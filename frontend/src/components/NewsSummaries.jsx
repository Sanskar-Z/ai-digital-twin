import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';
import { newsService } from '../services/api';

const NewsSummaries = () => {
  const [newsInput, setNewsInput] = useState('');
  const [userInterest, setUserInterest] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await newsService.summarize(newsInput, userInterest);
      setSummary(result.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('An error occurred while generating the summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header>
        <h1 className="title">News Summaries</h1>
      </header>
      <main className="feature-section">
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Get Concise News Summaries</h2>
          <p>
            Stay updated with brief and accurate summaries of the latest news articles.
          </p>
        </section>
        <section id="demo">
          <h3>Try It Out</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="newsInput">Paste the news article link or content:</label>
            <textarea
              id="newsInput"
              value={newsInput}
              onChange={(e) => setNewsInput(e.target.value)}
              placeholder="Enter the news article here..."
              required
            />
            <div className="form-group">
              <label htmlFor="interestInput">Your interests (optional):</label>
              <input
                type="text"
                id="interestInput"
                value={userInterest}
                onChange={(e) => setUserInterest(e.target.value)}
                placeholder="e.g., Technology, Politics, Sports"
              />
            </div>
            <button type="submit">Generate Summary</button>
          </form>
          <div id="output" aria-live="polite">
            {isLoading ? (
              <div className="loading">Generating summary</div>
            ) : (
              summary && <p>{summary}</p>
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

export default NewsSummaries; 