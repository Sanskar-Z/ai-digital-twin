const {GoogleGenerativeAI} = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

module.exports = {
    summarizeEmail: async (emailContent) => {
        try {
            const summaryPrompt = `Summarize the following email content in a concise and clear manner: ${emailContent}`;
            const summaryResult = await model.generateContent(summaryPrompt);
            const summaryResponse = await summaryResult.response;
            const summary = summaryResponse.text();

            return { summary };
        } catch (error) {
            console.error('Error summarizing email:', error);
            throw error;
        }
    }
};