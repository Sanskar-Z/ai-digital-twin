import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const CalendarManagement = () => {
  const [schedulingRequest, setSchedulingRequest] = useState('');
  const [schedule, setSchedule] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle calendar management logic here
    setIsLoading(true);
    console.log('Processing scheduling request:', schedulingRequest);
    
    // Simulate API call
    setTimeout(() => {
      setSchedule('Your schedule has been organized. Here are your upcoming events...');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="page-container">
      <header>
        <h1>Calendar Management</h1>
      </header>
      <main className="feature-section">
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Organize Your Schedule</h2>
          <p>
            Let our AI assistant help you manage your calendar, schedule meetings, and set reminders.
          </p>
        </section>
        <section id="demo">
          <h3>Try It Out</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="calendarInput">Describe your scheduling needs:</label>
            <textarea
              id="calendarInput"
              value={schedulingRequest}
              onChange={(e) => setSchedulingRequest(e.target.value)}
              placeholder="Enter your scheduling request here..."
              required
            />
            <button type="submit">Generate Schedule</button>
          </form>
          <div id="output" aria-live="polite">
            {isLoading ? (
              <div className="loading">Organizing your schedule</div>
            ) : (
              schedule && <p>{schedule}</p>
            )}
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; Code Crusaders</p>
      </footer>
    </div>
  );
};

export default CalendarManagement; 