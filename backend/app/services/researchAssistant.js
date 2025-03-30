const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const dotenv = require('dotenv');
dotenv.config({
    path: '../.env' 
});


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Extract text content from a URL
 * @param {string} url - 
 * @returns {Promise<string>} 
 */
async function extractContentFromUrl(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    $('script, style, nav, footer, header, aside, [role="banner"], [role="navigation"]').remove();
    const bodyText = $('body').text();
    return bodyText.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Error extracting content from URL:', error);
    throw new Error(`Failed to extract content from URL: ${error.message}`);
  }
}

/**
 * Extract PDF content from a URL or a local file path
 * @param {string} source - URL or file path to the PDF
 * @returns {Promise<string>} - Extracted text from PDF
 */
async function extractPdfContent(source) {
  try {
    let dataBuffer;
    
    // Check if the source is a URL or a local file path
    if (source.startsWith('http://') || source.startsWith('https://')) {
      // Download the PDF from URL
      const response = await axios.get(source, { responseType: 'arraybuffer' });
      dataBuffer = Buffer.from(response.data);
    } else {
      // Read the PDF from local file path
      dataBuffer = fs.readFileSync(source);
    }
    
    // Parse the PDF
    const data = await pdfParse(dataBuffer);
    
    // Return the text content
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    throw new Error(`Failed to extract PDF content: ${error.message}`);
  }
}

/**
 * Detect the structure of research content
 * @param {string} content - The text content to analyze
 * @returns {string} - The detected content type 
 */
function detectContentStructure(content) {
  // Clean the content for analysis
  const cleanContent = content.trim();
  const firstLines = cleanContent.split('\n').slice(0, 10).join('\n').toLowerCase();
  
  // Check for academic paper structure
  if (firstLines.includes('abstract') || 
      firstLines.includes('introduction') || 
      (firstLines.includes('keywords') && firstLines.includes('doi'))) {
    return 'academic';
  }
  
  // Check for literature review structure
  if (firstLines.includes('literature review') || 
      firstLines.includes('related work') ||
      firstLines.includes('previous studies')) {
    return 'literature_review';
  }
  
  // Check for bullet-point findings
  if ((cleanContent.match(/•|\*|-\s+/g) || []).length > 3) {
    return 'bullet_points';
  }
  
  // Check for copied research summaries
  if (cleanContent.includes('findings:') || 
      cleanContent.includes('key results:') ||
      cleanContent.includes('conclusion:')) {
    return 'research_summary';
  }
  
  // Default type
  return 'general';
}

/**
 * Process a research query using the AI model
 * @param {string} content - The text content to analyze
 * @param {string} query - User's specific query or request
 * @returns {Promise<object>} - AI response with insights
 */
async function processWithAI(content, query) {
  try {
    const contentType = detectContentStructure(content);
    let prompt = '';

    // Customize prompt based on query and content structure
    switch (query.toLowerCase()) {
      case 'summarize':
        prompt = `Summarize the following research content:\n\n${content}`;
        break;
      case 'key findings':
        prompt = `Extract the key findings from the following research content:\n\n${content}`;
        break;
      case 'methodology':
        prompt = `Analyze the methodology used in the following research content:\n\n${content}`;
        break;
      case 'literature review':
        prompt = `Identify and analyze the literature review or related work in the following research content:\n\n${content}`;
        break;
      case 'future work':
        prompt = `Identify limitations and future research directions in the following research content:\n\n${content}`;
        break;
      default:
        prompt = `Address the following query: "${query}" based on the research content:\n\n${content}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      insights: text,
      query: query,
      contentType: contentType,
      success: true
    };
  } catch (error) {
    console.error('Error processing with AI:', error);
    throw new Error(`Failed to process content with AI: ${error.message}`);
  }
}

/**
 * Create a structured research summary with sections
 * @param {string} content - Research content to summarize
 * @returns {Promise<object>} - Structured summary with sections
 */
async function createStructuredSummary(content) {
  try {
    const prompt = `
    Create a comprehensive structured summary of the following research paper:
    
    ${content}
    
    Please structure the summary with the following sections:
    1. Title and Authors
    2. Research Questions/Objectives
    3. Methods/Approach
    4. Key Findings
    5. Limitations
    6. Implications/Applications
    7. Future Research Directions
    
    For each section, provide clear and concise information extracted from the paper.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      structuredSummary: text,
      success: true
    };
  } catch (error) {
    console.error('Error creating structured summary:', error);
    return {
      error: error.message,
      success: false
    };
  }
}

/**
 * Compare multiple research papers or sources
 * @param {Array<string>} contents - Array of research content to compare
 * @param {string} comparisonCriteria - Criteria for comparison
 * @returns {Promise<object>} - Comparison results
 */
async function compareResearchSources(contents, comparisonCriteria) {
  try {
    const truncatedContents = contents.map(content => 
      content.length > 30000 ? content.substring(0, 30000) + '...' : content
    );
    
    const prompt = `
    I have ${truncatedContents.length} research sources that I need to compare based on the following criteria: ${comparisonCriteria}.
    
    Here are the sources:
    ${truncatedContents.map((content, index) => `SOURCE ${index + 1}:\n${content}\n\n`).join('')}
    
    Please provide a comparative analysis of these sources focusing on: ${comparisonCriteria}.
    Include similarities, differences, strengths, and weaknesses of each source.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      comparison: text,
      criteria: comparisonCriteria,
      success: true
    };
  } catch (error) {
    console.error('Error comparing research sources:', error);
    return {
      error: error.message,
      success: false
    };
  }
}

/**
 * Extract bibliographic references from research content
 * @param {string} content - Research content to extract references from
 * @returns {Promise<object>} - Extracted references
 */
async function extractReferences(content) {
  try {
    const prompt = `
    Extract and format all bibliographic references or citations from the following research content:
    
    ${content}
    
    Please list each reference in a standard academic format (APA, MLA, or Chicago), one per line.
    If the reference is incomplete in the original text, please indicate this.
    `;
    
    const result = await model.generateContent(prompt);
    console.log(result);

    const response = await result.response;
    const text = response.text();
    
    return {
      references: text,
      success: true
    };
  } catch (error) {
    console.error('Error extracting references:', error);
    return {
      error: error.message,
      success: false
    };
  }
}

/**
 * Process research content that was copied from another source
 * @param {string} content - Text content that may contain copied research findings
 * @returns {string} - Cleaned and normalized research content
 */
function processResearchCopyPaste(content) {
  // Check if content starts with common research result introductions
  const researchIntros = [
    'Based on your research query',
    'According to the research',
    'From the research findings',
    'The research indicates',
    'Research findings show',
    'Key findings from the research',
    'Based on the analysis',
    'The analysis reveals',
    'The study found',
    'The literature suggests'
  ];
  
  let cleanContent = content.trim();
  
  // Remove common introductory phrases
  for (const intro of researchIntros) {
    if (cleanContent.toLowerCase().startsWith(intro.toLowerCase())) {
      cleanContent = cleanContent.substring(intro.length).trim();
      // Remove any starting punctuation like colons, commas, etc.
      cleanContent = cleanContent.replace(/^[,.:;]+\s*/, '');
      break;
    }
  }
  
  // Remove ellipses at the end (often indicates truncated text)
  cleanContent = cleanContent.replace(/\.{3,}\s*$/, '');
  
  // Clean up bullet points for consistency
  cleanContent = cleanContent.replace(/•/g, '- ');
  cleanContent = cleanContent.replace(/\*\s+/g, '- ');
  cleanContent = cleanContent.replace(/(\d+)\.\s+/g, '$1. ');
  
  // Normalize multiple newlines
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n');
  
  // Remove any trailing or excessive whitespace
  cleanContent = cleanContent.trim();
  
  return cleanContent;
}

/**
 * Main function to gather insights from research
 * @param {string} input - URL or text content to analyze
 * @param {string} query - User's specific query or request
 * @returns {Promise<object>} - Processed insights from the AI
 */
async function gatherInsights(input, query) {
  try {
    console.log('Gathering insights for input and query:', { input, query });
    let content = input;

    if (input.startsWith('http://') || input.startsWith('https://')) {
      if (input.toLowerCase().endsWith('.pdf')) {
        console.log('Input is a PDF URL. Extracting content...');
        content = await extractPdfContent(input);
      } else {
        console.log('Input is a webpage URL. Extracting content...');
        content = await extractContentFromUrl(input);
      }
    } else if (input.toLowerCase().endsWith('.pdf') && fs.existsSync(input)) {
      console.log('Input is a local PDF file. Extracting content...');
      content = await extractPdfContent(input);
    } else {
      console.log('Input is plain text. Processing...');
      content = processResearchCopyPaste(content);
    }

    // Limit content size for the AI model
    if (content.length > 100000) {
      console.warn('Content length exceeds 100,000 characters. Truncating...');
      content = content.substring(0, 100000);
    }

    const result = await processWithAI(content, query);
    console.log('Insights gathered successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in gatherInsights:', error.message, error.stack);
    return {
      error: error.message,
      success: false
    };
  }
}

/**
 * Cleans up old PDF files from the uploads directory
 * @param {number} maxAgeHours - Maximum age of files in hours before deletion
 */
async function cleanupUploadedFiles(maxAgeHours = 24) {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.log('Uploads directory does not exist, nothing to clean up');
      return;
    }
    
    const files = fs.readdirSync(uploadsDir);
    const now = new Date();
    
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      // Calculate file age in hours
      const fileAgeHours = (now - stats.mtime) / (1000 * 60 * 60);
      
      // Delete files older than maxAgeHours
      if (fileAgeHours > maxAgeHours) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old file: ${file}`);
      }
    }
    
    console.log('Cleanup completed');
  } catch (error) {
    console.error('Error cleaning up uploaded files:', error);
  }
}

module.exports = {
  gatherInsights,
  createStructuredSummary,
  compareResearchSources,
  extractReferences,
  cleanupUploadedFiles
};
