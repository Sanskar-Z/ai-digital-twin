require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateEmailReply } = require('./services/emailReply');
const { summarizeNewsByInterest } = require('./services/news');
const { scheduleMeeting, setReminder, getCalendarEvents, deleteEvent } = require('./services/calendar');
const { gatherInsights } = require('./services/researchAssistant');
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

        console.log(`Processing email reply request with tone: ${tone || 'professional'}`);
        const result = await generateEmailReply(emailContent, tone);
        console.log('Email reply generated successfully');
        res.json(result);
    } catch (error) {
        console.error('Error in email generation:', error.message);
        res.status(500).json({ 
            error: 'Failed to generate email reply', 
            details: error.message
        });
    }
});

app.post('/news_summarize', async (req, res) => {
    try {
        const { newsContent, userInterest } = req.body;
        
        if (!newsContent) {
            return res.status(400).json({ error: 'News content is required' });
        }

        const result = await summarizeNewsByInterest(newsContent, userInterest);
        res.json(result);
    } catch (error) {
        console.error('Error in news summarization:', error);
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

app.post('/calendar/schedule', async (req, res) => {
    try {
        const meetingDetails = req.body;
        const result = await scheduleMeeting(meetingDetails);
        res.json(result);
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/calendar/reminder/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { reminderMinutes } = req.body;
        const result = await setReminder(eventId, reminderMinutes);
        res.json(result);
    } catch (error) {
        console.error('Error setting reminder:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/calendar/events', async (req, res) => {
    try {
        const { startTime, endTime } = req.query;
        const result = await getCalendarEvents(startTime, endTime);
        res.json(result);
    } catch (error) {
        console.error('Error getting calendar events:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/calendar/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const result = await deleteEvent(eventId);
        res.json(result);
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/research-assistance', async (req, res) => {
    try {
        console.log('Received request for research assistance:', req.body);

        const { input, query } = req.body;
        if (!input || !query) {
            console.log('Invalid request: Missing input or query.');
            return res.status(400).json({ error: 'Input and query are required.' });
        }

        const result = await gatherInsights(input, query);
        console.log('Response to client:', result);
        res.json(result);
    } catch (error) {
        console.error('Error in /api/research-assistance:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
