import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateEmailReply = async (emailContent, tone = "professional") => {
    try {
        const analysisPrompt = `Analyze the tone and sentiment of this email: ${emailContent}`;
        const sentimentResult = await model.generateContent(analysisPrompt);
        const sentimentResponse = await sentimentResult.response;
        const detectedTone = sentimentResponse.text();

        const replyPrompt = `Original email: ${emailContent}
        Detected tone: ${detectedTone}
        Please generate an email reply that is ${tone} in tone.
        The reply should be appropriate for the context and sentiment of the original email.`;
        
        const replyResult = await model.generateContent(replyPrompt);
        const replyResponse = await replyResult.response;
        const reply = replyResponse.text();

        return { reply };
    } catch (error) {
        console.error('Error generating email reply:', error);
        throw error;
    }
}