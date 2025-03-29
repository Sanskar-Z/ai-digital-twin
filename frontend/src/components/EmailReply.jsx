import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const EmailReply = () => {
  const [emailContent, setEmailContent] = useState('');
  const [reply, setReply] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Generating reply for:', emailContent);
  };

  return (
    <div className="page-container">
      <header>
        <h1>Email Reply Generation</h1>
      </header>
      <main>
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Generate Smart Email Replies</h2>
          <p>
            Use our AI-powered tool to craft professional and personalized email replies in seconds.
          </p>
        </section>
        <section id="demo">
          <h3>Try It Out</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="emailInput">Paste your email content:</label>
            <textarea
              id="emailInput"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Enter your email content here..."
              required
            />
            <button type="submit">Generate Reply</button>
          </form>
          <div id="output" aria-live="polite">
            {reply && <p>{reply}</p>}
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Digital Twin Solutions</p>
      </footer>
    </div>
  );
};

export default EmailReply; 