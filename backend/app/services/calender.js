const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
const { ClientSecretCredential } = require('@azure/identity');
require('dotenv').config();

const initializeGraphClient = () => {
    const credential = new ClientSecretCredential(
        process.env.TENANT_ID,
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET
    );
    
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default']
    });
    
    return Client.initWithMiddleware({ authProvider });
};

const scheduleMeeting = async (meetingDetails) => {
    try {
        const client = initializeGraphClient();
        const meeting = {
            subject: meetingDetails.subject,
            start: {
                dateTime: meetingDetails.startTime,
                timeZone: meetingDetails.timeZone || 'UTC'
            },
            end: {
                dateTime: meetingDetails.endTime,
                timeZone: meetingDetails.timeZone || 'UTC'
            },
            attendees: meetingDetails.attendees.map(email => ({
                emailAddress: {
                    address: email
                }
            })),
            body: {
                content: meetingDetails.description || '',
                contentType: 'text'
            }
        };

        const result = await client
            .api('/me/events')
            .post(meeting);

        return result;
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        throw error;
    }
};

const setReminder = async (eventId, reminderMinutes) => {
    try {
        const client = initializeGraphClient();
        
        const reminder = {
            reminderMinutesBeforeStart: reminderMinutes
        };

        const result = await client
            .api(`/me/events/${eventId}`)
            .patch(reminder);

        return result;
    } catch (error) {
        console.error('Error setting reminder:', error);
        throw error;
    }
};

const getCalendarEvents = async (startTime, endTime) => {
    try {
        const client = initializeGraphClient();
        
        const result = await client
            .api('/me/events')
            .filter(`start/dateTime ge '${startTime}' and end/dateTime le '${endTime}'`)
            .get();

        return result;
    } catch (error) {
        console.error('Error getting calendar events:', error);
        throw error;
    }
};

const deleteEvent = async (eventId) => {
    try {
        const client = initializeGraphClient();
        
        await client
            .api(`/me/events/${eventId}`)
            .delete();

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
