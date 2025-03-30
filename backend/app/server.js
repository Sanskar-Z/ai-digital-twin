require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { generateEmailReply } = require('./services/emailReply');
const { summarizeEmail } = require('./services/emailSummarize');
const { summarizeNewsByInterest } = require('./services/news');
const { scheduleMeeting, setReminder, getCalendarEvents, deleteEvent } = require('./services/calendar');
const { gatherInsights, cleanupUploadedFiles } = require('./services/researchAssistant');
const researchRoutes = require('./routes/researchRoutes');
const { google } = require('googleapis');

const app = express();

const PORT = process.env.PORT || 3000;
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Configure uploads directory cleanup interval (every 6 hours)
const CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
setInterval(() => {
    console.log('Running scheduled cleanup of uploaded files');
    cleanupUploadedFiles(12); // Delete files older than 12 hours
}, CLEANUP_INTERVAL_MS);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use research routes
app.use('/api/research', researchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route for basic testing
app.get('/', (req, res) => {
  res.send(`
    <h1>AI Digital Twin Server</h1>
    <p>Server is running. Timestamp: ${new Date().toISOString()}</p>
    
    <h2>Testing & Debugging</h2>
    <ul>
      <li><a href="/api/health">Health Check</a></li>
      <li><a href="/debug/config">Configuration Debug</a></li>
      <li><a href="/test-callback">Test OAuth Callback</a></li>
      <li><a href="/auth">Start OAuth Flow</a></li>
    </ul>
    
    <h2>Route Information</h2>
    <p>Available API routes:</p>
    <ul>
      <li>/api/health - Health check endpoint</li>
      <li>/auth - Google OAuth authentication</li>
      <li>/auth/google/callback - OAuth callback (used by Google)</li>
      <li>/email_generate - Generate email replies</li>
      <li>/email_summarize - Summarize emails</li>
      <li>/calendar/schedule - Schedule meetings</li>
      <li>/calendar/events - Get calendar events</li>
    </ul>
  `);
});

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

app.post('/email_summarize', async (req, res) => {
    try {
        const { emailContent } = req.body;
        
        if (!emailContent) {
            return res.status(400).json({ error: 'Email content is required' });
        }

        console.log('Processing email summarization request');
        const result = await summarizeEmail(emailContent);
        console.log('Email summarized successfully');
        res.json(result);
    } catch (error) {
        console.error('Error in email summarization:', error.message);
        res.status(500).json({ 
            error: 'Failed to summarize email', 
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

        // Implement retry logic
        let retries = 3;
        let result;
        let lastError;

        while (retries > 0) {
            try {
                result = await summarizeNewsByInterest(newsContent, userInterest);
                break; // If successful, exit the loop
            } catch (error) {
                lastError = error;
                console.error(`Attempt ${4-retries}/3 failed:`, error);
                retries--;
                if (retries > 0) {
                    // Wait 1 second before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        if (result) {
            res.json(result);
        } else {
            console.error('All retry attempts failed for news summarization:', lastError);
            res.status(500).json({ 
                error: 'Failed to summarize news after multiple attempts', 
                details: lastError.message
            });
        }
    } catch (error) {
        console.error('Error in news summarization:', error);
        res.status(500).json({ 
            error: 'Failed to summarize news', 
            details: error.message 
        });
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
        console.log('Received meeting scheduling request:', JSON.stringify(meetingDetails, null, 2));
        
        // Basic validation
        if (!meetingDetails.subject) {
            return res.status(400).json({ error: 'Meeting subject is required' });
        }
        if (!meetingDetails.startTime) {
            return res.status(400).json({ error: 'Meeting start time is required' });
        }
        if (!meetingDetails.endTime) {
            return res.status(400).json({ error: 'Meeting end time is required' });
        }
        
        const result = await scheduleMeeting(meetingDetails);
        console.log('Meeting scheduled successfully');
        res.json(result);
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        res.status(500).json({ 
            error: 'Failed to schedule meeting', 
            details: error.message,
            suggestion: 'Ensure GOOGLE_REFRESH_TOKEN is set in your .env file'
        });
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

// Google OAuth routes
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Validate OAuth2 configuration
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
  console.error('WARNING: Google OAuth2 configuration is incomplete. The authentication flow will not work properly.');
  console.error('Missing environment variables:', {
    GOOGLE_CLIENT_ID: !process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: !process.env.GOOGLE_REDIRECT_URI
  });
}

// Special route to help debug direct callback access issues
app.get('/auth/google', (req, res) => {
  console.log('Base callback path accessed without full path');
  res.status(200).send(`
    <h1>Google Auth Callback Base Path</h1>
    <p>You've reached the base path for callbacks, but not the complete callback URL.</p>
    <p>To initiate auth flow properly, <a href="/auth">click here</a>.</p>
    <p>Expected callback path: /auth/google/callback</p>
  `);
});

app.get('/auth', (req, res) => {
  try {
    console.log('Auth endpoint accessed');
    console.log(`Using client ID: ${process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}`);
    console.log(`Using client secret: ${process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set'}`);
    console.log(`Using redirect URI: ${process.env.GOOGLE_REDIRECT_URI}`);
    
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];
    
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', 
      scope: scopes,
      prompt: 'consent' 
    });
    
    console.log(`Redirecting to: ${url}`);
    res.redirect(url);
  } catch (error) {
    console.error('Error in auth endpoint:', error);
    res.status(500).send(`Authentication error: ${error.message}`);
  }
});

app.get('/auth/google/*', (req, res) => {
  console.log('Alternative callback pattern matched:', req.path);
  res.status(200).send(`
    <h1>Callback route accessed directly</h1>
    <p>This route should only be accessed via Google OAuth redirect.</p>
    <p>Current path: ${req.path}</p>
    <p>Expected path: /auth/google/callback</p>
    <p>To initiate auth flow properly, <a href="/auth">click here</a>.</p>
  `);
});

app.get('/auth/google/callback', async (req, res) => {
  console.log('Callback endpoint accessed');
  console.log('Query parameters:', req.query);
  
  const { code } = req.query;
  if (!code) {
    console.error('No code parameter received in callback');
    return res.status(400).send('Error: No authorization code received from Google');
  }
  
  try {
    console.log('Attempting to exchange code for tokens');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Token exchange successful');
    console.log('Access token received:', tokens.access_token ? 'Yes' : 'No');
    console.log('Refresh token received:', tokens.refresh_token ? 'Yes' : 'No');
    
    res.send(`
      <h1>Authentication successful!</h1>
      <p>Your refresh token is: <code>${tokens.refresh_token}</code></p>
      <p>Please add this to your .env file as GOOGLE_REFRESH_TOKEN</p>
      <p><a href="/">Return to application</a></p>
    `);
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).send(`
      <h1>Authentication failed</h1>
      <p>Error: ${error.message}</p>
      <p>Please check your Google OAuth configuration:</p>
      <ul>
        <li>Make sure your OAuth consent screen is properly configured</li>
        <li>Verify that ${process.env.GOOGLE_REDIRECT_URI} is authorized in your Google Cloud Console</li>
      </ul>
    `);
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
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Auth endpoint: /auth`);
    console.log(`Callback endpoint: /auth/google/callback`);
    console.log(`Google redirect URI: ${process.env.GOOGLE_REDIRECT_URI}`);
});
