const functions = require('firebase-functions');
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, '../backend/app/.env')
});

const app = express();
app.use(cors({ origin: true }));

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

app.get('/auth', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];
  
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', 
    scope: scopes,
    prompt: 'consent' 
  });
  
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Refresh token:', tokens.refresh_token);
    
    res.send(`
      <h1>Authentication successful!</h1>
      <p>Your refresh token is: <code>${tokens.refresh_token}</code></p>
      <p>Please add this to your .env file as GOOGLE_REFRESH_TOKEN</p>
      <p><a href="/">Return to application</a></p>
    `);
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).send('Authentication failed');
  }
});


exports.api = functions.https.onRequest(app); 