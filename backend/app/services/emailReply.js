require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.generateEmailReply = async (emailContent, tone = "professional") => {
    try {
        if (!emailContent) {
            throw new Error('Email content is required');
        }
        console.log('Analyzing email sentiment...');
        const analysisPrompt = `Analyze the tone and sentiment of this email: ${emailContent}`;
        const sentimentResult = await model.generateContent(analysisPrompt);
        const sentimentResponse = await sentimentResult.response;
        const detectedTone = sentimentResponse.text();
        console.log('Detected tone:', detectedTone);

        console.log('Generating email reply...');
        const replyPrompt = `Original email: ${emailContent}
        Detected tone: ${detectedTone}
        Please generate an email reply that is ${tone} in tone.
        The reply should be appropriate for the context and sentiment of the original email.`;
        
        const replyResult = await model.generateContent(replyPrompt);
        const replyResponse = await replyResult.response;
        const reply = replyResponse.text();
        console.log('Reply generated successfully');

        return { reply };
    } catch (error) {
        console.error('Error generating email reply:', error.message);
        if (error.response) {
            console.error('Response error:', error.response);
        }
        throw new Error(`Failed to generate email reply: ${error.message}`);
    }
}