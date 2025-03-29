import genai from '@google/genai';

const client = genai.Client(api_key=process.env.GEMINI_API_KEY)


export const generateEmailReply = async (emailContent, tone = "professional") => {
    const analysisPrompt = `Analyze the tone and sentiment of this email: ${emailContent}`
    const sentimentResponse = await client.models.generateContent(
        model="gemini-2.0-flash",
        contents=analysisPrompt
    );
    const replyPrompt = `Original email: ${emailContent}
    Detected tone: ${sentimentResponse.text}
    Please generate an email reply that is ${tone} in tone.
    The reply should be appropriate for the context and sentiment of the original email.`;
    const replyResponse = await client.models.generateContent(
        model="gemini-2.0-flash",
        contents=replyPrompt
    );

    return {"reply": replyResponse.text}
}