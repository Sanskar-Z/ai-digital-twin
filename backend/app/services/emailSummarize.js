import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const summarizeEmail = async (emailContent) => {
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
};