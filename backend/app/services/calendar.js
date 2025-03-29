const { google } = require('googleapis');
require('dotenv').config();

const initializeGoogleClient = () => {
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    
    // Set credentials using refresh token
    auth.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
    
    return google.calendar({ version: 'v3', auth });
};

const scheduleMeeting = async (meetingDetails) => {
    try {
        const calendar = initializeGoogleClient();
        const event = {
            summary: meetingDetails.subject,
            start: {
                dateTime: meetingDetails.startTime,
                timeZone: meetingDetails.timeZone || 'UTC'
            },
            end: {
                dateTime: meetingDetails.endTime,
                timeZone: meetingDetails.timeZone || 'UTC'
            },
            attendees: meetingDetails.attendees.map(email => ({ email })),
            description: meetingDetails.description || ''
        };

        const result = await calendar.events.insert({
            calendarId: 'primary',
            resource: event
        });

        return result.data;
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        throw error;
    }
};

const setReminder = async (eventId, reminderMinutes) => {
    try {
        const calendar = initializeGoogleClient();
        
        // First get the event to preserve its properties
        const event = await calendar.events.get({
            calendarId: 'primary',
            eventId: eventId
        });
        
        // Set the reminder
        event.data.reminders = {
            useDefault: false,
            overrides: [
                { method: 'popup', minutes: reminderMinutes }
            ]
        };

        const result = await calendar.events.update({
            calendarId: 'primary',
            eventId: eventId,
            resource: event.data
        });

        return result.data;
    } catch (error) {
        console.error('Error setting reminder:', error);
        throw error;
    }
};

const getCalendarEvents = async (startTime, endTime) => {
    try {
        const calendar = initializeGoogleClient();
        
        const result = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startTime,
            timeMax: endTime,
            singleEvents: true,
            orderBy: 'startTime'
        });

        return result.data;
    } catch (error) {
        console.error('Error getting calendar events:', error);
        throw error;
    }
};

const deleteEvent = async (eventId) => {
    try {
        const calendar = initializeGoogleClient();
        
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId
        });

        return { success: true };
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};

module.exports = {
    scheduleMeeting,
    setReminder,
    getCalendarEvents,
    deleteEvent
};