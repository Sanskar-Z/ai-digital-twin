import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const CalendarManagement = () => {
  const [schedulingRequest, setSchedulingRequest] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle calendar management logic here
    console.log('Processing scheduling request:', schedulingRequest);
  };

  return (
    <div className="page-container">
      <header>
        <h1>Calendar Management</h1>
      </header>
      <main>
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
            {schedule && <p>{schedule}</p>}
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Digital Twin Solutions</p>
      </footer>
    </div>
  );
};

export default CalendarManagement; 