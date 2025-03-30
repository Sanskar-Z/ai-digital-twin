const API_BASE_URL = 'http://localhost:3000';

export const emailService = {
  generateReply: async (emailContent, tone = 'professional') => {
    try {
      const response = await fetch(`${API_BASE_URL}/email_generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailContent, tone }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating email reply:', error);
      throw error;
    }
  },
  
  summarizeEmail: async (emailContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/email_summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailContent }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error summarizing email:', error);
      throw error;
    }
  },
};

export const newsService = {
  summarize: async (newsContent, userInterest = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/news_summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newsContent, userInterest }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error summarizing news:', error);
      throw error;
    }
  },
};

export const calendarService = {
  scheduleMeeting: async (meetingDetails) => {
    try {
      console.log('Sending meeting request:', meetingDetails);
      
      const response = await fetch(`${API_BASE_URL}/calendar/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingDetails),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Calendar API error:', errorData);
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      throw error;
    }
  },
  
  getAuthUrl: () => {
    return 'http://localhost:4000/auth';
  },
  
  getEvents: async (startTime, endTime) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/calendar/events?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  },
  
  setReminder: async (eventId, reminderMinutes) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/reminder/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reminderMinutes }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error setting reminder:', error);
      throw error;
    }
  },
  
  deleteEvent: async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },
}; 