import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const NewsSummaries = () => {
  const [newsInput, setNewsInput] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Generating summary for:', newsInput);
    setTimeout(() => {
      setSummary('The article discusses recent advancements in artificial intelligence and their impact on...');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="page-container">
      <header>
        <h1>News Summaries</h1>
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