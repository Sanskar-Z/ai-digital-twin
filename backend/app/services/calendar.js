// Load environment variables first
const path = require('path');
const dotenv = require('dotenv');

// Ensure environment variables are loaded correctly
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const { google } = require('googleapis');
const express = require('express');
const app = express();

// Log the loaded environment variables for debugging
console.log('Calendar service initialized:');
console.log('- GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
console.log('- GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing');
console.log('- GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI ? 'Set' : 'Missing');
console.log('- GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? 'Set' : 'Missing');

// Now create the OAuth client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set up authentication and utility functions
const setupAuth = () => {
  // Check if we have tokens stored somewhere and set them
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    console.log('Setting up auth with refresh token');
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
    return oauth2Client;
  } else {
    console.warn('No GOOGLE_REFRESH_TOKEN found in environment variables.');
    console.warn('Please complete the OAuth flow by visiting http://localhost:4000/auth');
    return oauth2Client;
  }
};

// Create calendar client
const getCalendarClient = () => {
  const auth = setupAuth();
  return google.calendar({ version: 'v3', auth });
};

// Schedule a meeting
const scheduleMeeting = async (meetingDetails) => {
  try {
    console.log('scheduleMeeting called with:', JSON.stringify(meetingDetails, null, 2));
    console.log('Checking environment variables:');
    console.log('- GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing');
    console.log('- GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing');
    console.log('- GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI ? '✓ Set' : '✗ Missing');
    console.log('- GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? '✓ Set' : '✗ Missing');
    
    // Initialize auth and calendar clients
    const auth = setupAuth();
    const calendar = getCalendarClient();
    
    console.log('Auth credentials set:', !!auth.credentials);
    
    // Validate required fields
    if (!meetingDetails.subject) throw new Error('Meeting subject is required');
    if (!meetingDetails.startTime) throw new Error('Meeting start time is required');
    if (!meetingDetails.endTime) throw new Error('Meeting end time is required');
    
    const { subject, description, startTime, endTime, attendees, timeZone } = meetingDetails;
    
    // Check if auth is set up properly
    if (!auth.credentials || !auth.credentials.refresh_token) {
      console.error('Missing authentication: No refresh token set in credentials.');
      throw new Error('Calendar API not authenticated. Please set up authentication first.');
    }
    
    // Create event object for Google Calendar
    const event = {
      summary: subject,
      description: description || '',
      start: {
        dateTime: startTime,
        timeZone: timeZone || 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: timeZone || 'UTC',
      },
      attendees: attendees && attendees.length ? attendees.map(email => ({ email })) : [],
      reminders: {
        useDefault: true,
      },
    };
    
    console.log('Creating event with:', JSON.stringify(event, null, 2));
    
    // Attempt to insert the event
    try {
      const result = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      
      console.log('Event created successfully:', result.data.id);
      return result.data;
    } catch (apiError) {
      console.error('Google Calendar API error:', apiError);
      if (apiError.response) {
        console.error('API response error:', apiError.response.data);
      }
      throw apiError;
    }
  } catch (error) {
    console.error('Error in scheduleMeeting:', error);
    console.error('Error details:', error.message);
    throw new Error(`Failed to schedule meeting: ${error.message}`);
  }
};

// Set reminder for an event
const setReminder = async (eventId, reminderMinutes) => {
  const calendar = getCalendarClient();
  
  try {
    // First get the event to preserve its existing data
    const event = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });
    
    // Update the reminders
    const updatedEvent = {
      ...event.data,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: reminderMinutes },
          { method: 'popup', minutes: reminderMinutes },
        ],
      },
    };
    
    const result = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: updatedEvent,
    });
    
    return result.data;
  } catch (error) {
    console.error('Error in setReminder:', error);
    throw new Error(error.message);
  }
};

// Get calendar events in a time range
const getCalendarEvents = async (startTime, endTime) => {
  const calendar = getCalendarClient();
  
  try {
    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    return {
      items: result.data.items,
    };
  } catch (error) {
    console.error('Error in getCalendarEvents:', error);
    throw new Error(error.message);
  }
};

// Delete an event
const deleteEvent = async (eventId) => {
  const calendar = getCalendarClient();
  
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
    
    return { success: true, message: 'Event deleted successfully' };
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    throw new Error(error.message);
  }
};

// Generate the authorization URL
app.get('/auth', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];
  
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // This is essential to get a refresh token
    scope: scopes,
    prompt: 'consent' // Forces to show the consent screen each time
  });
  
  res.redirect(url);
});

// Handle the callback after Google has authenticated the user
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Refresh token:', tokens.refresh_token);
    
    // Save these tokens to your database or .env file
    // Store them securely
    
    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).send('Authentication failed');
  }
});

// Don't start a separate server here if this is being imported in server.js
if (require.main === module) {
  // Use a default port if GOOGLE_REDIRECT_URI is not defined
  const defaultPort = 4000;
  let serverPort = defaultPort;
  
  try {
    if (process.env.GOOGLE_REDIRECT_URI) {
      const url = new URL(process.env.GOOGLE_REDIRECT_URI);
      serverPort = url.port || defaultPort;
    } else {
      console.warn('GOOGLE_REDIRECT_URI is not defined in .env file. Using default port 4000.');
      console.warn('Please ensure your Google Cloud Console has http://localhost:4000/auth/google/callback as an authorized redirect URI.');
    }
  } catch (error) {
    console.warn(`Error parsing GOOGLE_REDIRECT_URI: ${error.message}`);
    console.warn(`Using default port ${defaultPort} instead.`);
  }
  
  app.listen(serverPort, () => {
    console.log(`Calendar auth server running on port ${serverPort}`);
    console.log(`Please visit http://localhost:${serverPort}/auth to get your refresh token`);
    console.log(`Make sure you have authorized http://localhost:${serverPort}/auth/google/callback in Google Cloud Console`);
  });
}

module.exports = {
  scheduleMeeting,
  setReminder,
  getCalendarEvents,
  deleteEvent
};