const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});
const { GoogleGenerativeAI } = require("@google/generative-ai");
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not defined in environment variables');
    process.exit(1);
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

        if (!sentimentResult.response) {
            throw new Error('Failed to analyze sentiment.');
        }

        const detectedTone = await sentimentResult.response.text();
        console.log('Detected tone:', detectedTone);

        console.log('Generating email reply...');
        const replyPrompt = `Original email: ${emailContent}
        Detected tone: ${detectedTone}
        Please generate an email reply that is ${tone} in tone.
        The reply should be appropriate for the context and sentiment of the original email.`;

        const replyResult = await model.generateContent(replyPrompt);

        if (!replyResult.response) {
            throw new Error('Failed to generate email reply.');
        }

        const reply = await replyResult.response.text();
        console.log('Reply generated successfully');

        return { reply };
    } catch (error) {
        console.error('Error generating email reply:', error.message);
        throw new Error(`Failed to generate email reply: ${error.message}`);
    }
};
