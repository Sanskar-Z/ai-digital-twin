const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
    gatherInsights, 
    createStructuredSummary, 
    compareResearchSources,
    extractReferences
} = require('../services/researchAssistant');

// Configure multer for PDF file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        // Create the uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
});

/**
 * @route POST /api/research/upload-pdf
 * @description Upload a PDF file for analysis
 * @access Public
 */
router.post('/upload-pdf', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded.' });
        }

        const filePath = req.file.path;
        const query = req.body.query || 'summarize';
        
        // Extract content from the PDF
        const { extractPdfContent } = require('../services/researchAssistant');
        const pdfContent = await extractPdfContent(filePath);
        
        // Process the PDF content with AI
        const { processWithAI } = require('../services/researchAssistant');
        const result = await processWithAI(pdfContent, query);
        
        // Add the file info to the result
        result.fileInfo = {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
        };
        
        res.json(result);
    } catch (error) {
        console.error('Error processing PDF upload:', error);
        res.status(500).json({ error: 'An error occurred while processing your PDF.' });
    }
});

/**
 * @route POST /api/research/insights
 * @description Generate insights from research content
 * @access Public
 */
router.post('/insights', async (req, res) => {
    try {
        console.log('Received research insights request:', req.body);

        const { input, query } = req.body;
        if (!input || !query) {
            console.log('Invalid request: Missing input or query.');
            return res.status(400).json({ error: 'Input and query are required.' });
        }

        const result = await gatherInsights(input, query);
        console.log('Research insights generated successfully');
        res.json(result);
    } catch (error) {
        console.error('Error in research insights endpoint:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

/**
 * @route POST /api/research/structured-summary
 * @description Create a structured summary of research content
 * @access Public
 */
router.post('/structured-summary', async (req, res) => {
    try {
        console.log('Received structured summary request:', req.body);

        const { input } = req.body;
        if (!input) {
            console.log('Invalid request: Missing input.');
            return res.status(400).json({ error: 'Input is required.' });
        }

        // Process input if it's a URL
        let content = input;
        if (input.startsWith('http://') || input.startsWith('https://')) {
            const { gatherInsights } = require('../services/researchAssistant');
            // Just use gatherInsights to process the URL, but ignore the query
            const processed = await gatherInsights(input, 'dummy query');
            // If there was an error, it will be in the result
            if (!processed.success) {
                return res.status(400).json(processed);
            }
            // Otherwise, use the processed content
            content = processed.insights;
        }

        const result = await createStructuredSummary(content);
        console.log('Structured summary generated successfully');
        res.json(result);
    } catch (error) {
        console.error('Error in structured summary endpoint:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

/**
 * @route POST /api/research/compare
 * @description Compare multiple research sources
 * @access Public
 */
router.post('/compare', async (req, res) => {
    try {
        console.log('Received research comparison request:', req.body);

        const { inputs, criteria } = req.body;
        if (!inputs || !Array.isArray(inputs) || inputs.length < 2 || !criteria) {
            console.log('Invalid request: Missing inputs array or criteria.');
            return res.status(400).json({ 
                error: 'At least two inputs and comparison criteria are required.' 
            });
        }

        // Process inputs if they're URLs
        const processedContents = await Promise.all(inputs.map(async (input) => {
            if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
                const { gatherInsights } = require('../services/researchAssistant');
                // Just use gatherInsights to process the URL, but ignore the query
                const processed = await gatherInsights(input, 'dummy query');
                // If successful, return the processed content
                return processed.success ? processed.insights : input;
            }
            return input;
        }));

        const result = await compareResearchSources(processedContents, criteria);
        console.log('Research comparison generated successfully');
        res.json(result);
    } catch (error) {
        console.error('Error in research comparison endpoint:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

/**
 * @route POST /api/research/references
 * @description Extract references from research content
 * @access Public
 */
router.post('/references', async (req, res) => {
    try {
        console.log('Received references extraction request:', req.body);

        const { input } = req.body;
        if (!input) {
            console.log('Invalid request: Missing input.');
            return res.status(400).json({ error: 'Input is required.' });
        }

        // Process input if it's a URL
        let content = input;
        if (input.startsWith('http://') || input.startsWith('https://')) {
            const { gatherInsights } = require('../services/researchAssistant');
            // Just use gatherInsights to process the URL, but ignore the query
            const processed = await gatherInsights(input, 'dummy query');
            // If there was an error, it will be in the result
            if (!processed.success) {
                return res.status(400).json(processed);
            }
            // Otherwise, use the processed content
            content = processed.insights;
        }

        const result = await extractReferences(content);
        console.log('References extracted successfully');
        res.json(result);
    } catch (error) {
        console.error('Error in references extraction endpoint:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

/**
 * @route POST /api/research/upload-multiple-pdfs
 * @description Upload multiple PDF files for comparison
 * @access Public
 */
router.post('/upload-multiple-pdfs', upload.array('pdfFiles', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No PDF files uploaded.' });
        }

        if (req.files.length < 2) {
            return res.status(400).json({ error: 'At least two PDF files are required for comparison.' });
        }

        const criteria = req.body.criteria || 'Compare the methods and key findings';
        
        // Extract content from each PDF
        const { extractPdfContent } = require('../services/researchAssistant');
        const pdfContents = await Promise.all(
            req.files.map(file => extractPdfContent(file.path))
        );
        
        // Compare the PDF contents
        const result = await compareResearchSources(pdfContents, criteria);
        
        // Add the file info to the result
        result.filesInfo = req.files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            size: file.size,
        }));
        
        res.json(result);
    } catch (error) {
        console.error('Error processing multiple PDF uploads:', error);
        res.status(500).json({ error: 'An error occurred while processing your PDFs.' });
    }
});

/**
 * @route POST /api/research/pdf-structured-summary
 * @description Create a structured summary from an uploaded PDF
 * @access Public
 */
router.post('/pdf-structured-summary', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded.' });
        }

        const filePath = req.file.path;
        
        // Extract content from the PDF
        const { extractPdfContent } = require('../services/researchAssistant');
        const pdfContent = await extractPdfContent(filePath);
        
        // Create structured summary from the PDF content
        const result = await createStructuredSummary(pdfContent);
        
        // Add the file info to the result
        result.fileInfo = {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
        };
        
        res.json(result);
    } catch (error) {
        console.error('Error creating structured summary from PDF:', error);
        res.status(500).json({ error: 'An error occurred while processing your PDF.' });
    }
});

/**
 * @route POST /api/research/pdf-references
 * @description Extract references from an uploaded PDF
 * @access Public
 */
router.post('/pdf-references', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded.' });
        }

        const filePath = req.file.path;
        
        // Extract content from the PDF
        const { extractPdfContent } = require('../services/researchAssistant');
        const pdfContent = await extractPdfContent(filePath);
        
        // Extract references from the PDF content
        const result = await extractReferences(pdfContent);
        
        // Add the file info to the result
        result.fileInfo = {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
        };
        
        res.json(result);
    } catch (error) {
        console.error('Error extracting references from PDF:', error);
        res.status(500).json({ error: 'An error occurred while processing your PDF.' });
    }
});

module.exports = router; 