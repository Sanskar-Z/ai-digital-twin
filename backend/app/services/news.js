const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

 const summarizeNewsByInterest = async (newsContentOrLink, userInterest) => {
    try {
        let newsContent;

        
        if (newsContentOrLink.startsWith("http://") || newsContentOrLink.startsWith("https://")) {
            const response = await axios.get(newsContentOrLink);
            const $ = cheerio.load(response.data);
            newsContent = $("body").text();
        } else {
            newsContent = newsContentOrLink;
        }

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

exports.summarizeNewsByInterest = summarizeNewsByInterest;