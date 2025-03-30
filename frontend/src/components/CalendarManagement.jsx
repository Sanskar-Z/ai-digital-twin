import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';
import { calendarService } from '../services/api';

const CalendarManagement = () => {
  const [schedulingRequest, setSchedulingRequest] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [attendees, setAttendees] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const now = new Date();
      const oneWeekLater = new Date();
      oneWeekLater.setDate(now.getDate() + 7);
      
      const result = await calendarService.getEvents(
        now.toISOString(),
        oneWeekLater.toISOString()
      );
      
      setEvents(result.items || []);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.message && (error.message.includes('not authenticated') || 
          error.message.includes('authentication') || 
          error.message.includes('Calendar API not authenticated'))) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleSignIn = () => {
    window.location.href = calendarService.getAuthUrl();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const dateTimeStart = new Date(`${startDate}T${startTime}`);
      const dateTimeEnd = new Date(dateTimeStart.getTime() + duration * 60000);
      
      const attendeesList = attendees
        .split(',')
        .map(email => email.trim())
        .filter(email => email);
      
      const meetingDetails = {
        subject,
        description,
        startTime: dateTimeStart.toISOString(),
        endTime: dateTimeEnd.toISOString(),
        attendees: attendeesList,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      const result = await calendarService.scheduleMeeting(meetingDetails);
      setSchedule(`Meeting "${result.summary}" scheduled successfully! ID: ${result.id}`);
      fetchEvents();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setSchedule('An error occurred while scheduling the meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await calendarService.deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="page-container">
      <header>
        <h1 className="title">Calendar Management</h1>
      </header>
      <main className="feature-section">
        <style>
          {`
            .auth-section {
              margin: 20px 0;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 8px;
              border: 1px solid #ddd;
            }
            .signin-button {
              background-color: #4285F4;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              font-weight: bold;
              cursor: pointer;
              transition: background-color 0.3s;
            }
            .signin-button:hover {
              background-color: #357ae8;
            }
            .auth-required {
              margin: 20px 0;
              padding: 30px;
              text-align: center;
              background-color: #f8f9fa;
              border-radius: 8px;
              border: 1px solid #ddd;
            }
            .auth-required p {
              margin-bottom: 20px;
              font-size: 16px;
            }
          `}
        </style>
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Organize Your Schedule</h2>
          <p>
            Let our AI assistant help you manage your calendar, schedule meetings, and set reminders.
          </p>
          {!isAuthenticated && (
            <div className="auth-section">
              <p>You need to sign in to access your Google Calendar.</p>
              <button onClick={handleSignIn} className="signin-button">
                Sign in to Calendar
              </button>
            </div>
          )}
        </section>
        <section id="demo">
          <h3>Schedule a Meeting</h3>
          {isAuthenticated ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="subjectInput">Meeting Subject:</label>
                  <input
                    type="text"
                    id="subjectInput"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter meeting subject"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="dateInput">Date:</label>
                  <input
                    type="date"
                    id="dateInput"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="timeInput">Time:</label>
                  <input
                    type="time"
                    id="timeInput"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="durationInput">Duration (minutes):</label>
                  <input
                    type="number"
                    id="durationInput"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    min="15"
                    step="15"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="attendeesInput">Attendees (comma-separated emails):</label>
                  <input
                    type="text"
                    id="attendeesInput"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="descriptionInput">Description:</label>
                  <textarea
                    id="descriptionInput"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter meeting description"
                  />
                </div>
                
                <button type="submit">Schedule Meeting</button>
              </form>
              
              <div id="output" aria-live="polite">
                {schedule && <p>{schedule}</p>}
              </div>
              
              <div className="events-section">
                <h3>Upcoming Events</h3>
                <ul className="events-list">
                  {events.length > 0 ? (
                    events.map(event => (
                      <li key={event.id} className="event-item">
                        <div className="event-details">
                          <strong>{event.summary}</strong>
                          <p>
                            {new Date(event.start.dateTime).toLocaleString()} - 
                            {new Date(event.end.dateTime).toLocaleTimeString()}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="delete-event-btn"
                        >
                          Delete
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No upcoming events found</li>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="auth-required">
              <p>Please sign in to Google Calendar to schedule meetings and view your calendar.</p>
              <button onClick={handleSignIn} className="signin-button">
                Sign in to Calendar
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CalendarManagement; 