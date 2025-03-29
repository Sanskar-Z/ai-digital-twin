import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';
import { emailService } from '../services/api';

const EmailReply = () => {
  const [emailContent, setEmailContent] = useState('');
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState('professional');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await emailService.generateReply(emailContent, tone);
      setReply(result.reply);
    } catch (error) {
      console.error('Error generating reply:', error);
      setReply('An error occurred while generating the reply. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header>
        <h1 className="title">Email Reply Generation</h1>
      </header>
      <main className="feature-section">
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
            <div className="form-group">
              <label htmlFor="toneSelect">Select tone:</label>
              <select
                id="toneSelect"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            <button type="submit">Generate Reply</button>
          </form>
          <div id="output" aria-live="polite">
            {isLoading ? (
              <div className="loading">Crafting your reply</div>
            ) : (
              reply && <p>{reply}</p>
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

export default EmailReply; 