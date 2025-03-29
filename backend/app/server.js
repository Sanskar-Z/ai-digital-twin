const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateEmailReply } = require('./services/emailReply');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/email_generate', async (req, res) => {
    try {
        const { emailContent, tone } = req.body;
        
        if (!emailContent) {
            return res.status(400).json({ error: 'Email content is required' });
        }

        const result = await generateEmailReply(emailContent, tone);
        res.json(result);
    } catch (error) {
        console.error('Error in email generation:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/news_summarize', async (req, res) => {
    try {
        res.json({ message: 'News summarization endpoint' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/calender', async (req, res) => {
    try {
        res.json({ message: 'Calendar endpoint' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
