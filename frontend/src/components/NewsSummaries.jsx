import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';
import { newsService } from '../services/api';

const NewsSummaries = () => {
  const [newsInput, setNewsInput] = useState('');
  const [userInterest, setUserInterest] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSummary('');
    
    try {
      const result = await newsService.summarize(newsInput, userInterest);
      setSummary(result.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error.response?.data?.details || error.message || 'An error occurred while generating the summary.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    handleSubmit({ preventDefault: () => {} });
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
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Summary'}
            </button>
          </form>
          <div id="output" aria-live="polite">
            {isLoading ? (
              <div className="loading">Generating summary...</div>
            ) : error ? (
              <div className="error">
                <p>Error: {error}</p>
                <button onClick={handleRetry}>Retry</button>
              </div>
            ) : (
              summary && <p>{summary}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewsSummaries; 