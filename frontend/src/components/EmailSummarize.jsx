import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';
import { emailService } from '../services/api';

const EmailSummarize = () => {
  const [emailContent, setEmailContent] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await emailService.summarizeEmail(emailContent);
      setSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing email:', error);
      setSummary('An error occurred while summarizing the email. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <header>
        <h1 className="title">Email Summarization</h1>
      </header>
      <main className="feature-section">
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Generate Email Summaries</h2>
          <p>
            Convert long, complex emails into clear, concise summaries with our AI-powered tool.
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
            <button type="submit">Generate Summary</button>
          </form>
          <div id="output" aria-live="polite">
            {summary && (
              <div className="summary-container">
                <h4>Email Summary:</h4>
                <p>{summary}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmailSummarize; 