import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const summarizeNewsByInterest = async (newsContent, userInterest) => {
    try {
        const summaryPrompt = `Summarize the following news content in a concise and clear manner, focusing on the user's interest: ${userInterest}.
        News content: ${newsContent}`;
        
        const summaryResult = await model.generateContent(summaryPrompt);
        const summaryResponse = await summaryResult.response;
        const summary = summaryResponse.text();

        return { summary };
    } catch (error) {
        console.error('Error summarizing news:', error);
        throw error;
    }
};