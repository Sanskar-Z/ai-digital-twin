import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const EmailReply = () => {
  const [emailContent, setEmailContent] = useState('');
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Generating reply for:', emailContent);
    
    // Simulate API call
    setTimeout(() => {
      setReply('Thank you for your email. I have reviewed the information you provided and...');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="page-container">
      <header>
        <h1>Email Reply Generation</h1>
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