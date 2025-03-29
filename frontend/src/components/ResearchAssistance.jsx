import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const ResearchAssistance = () => {
  const [researchQuery, setResearchQuery] = useState('');
  const [assistance, setAssistance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle research assistance logic here
    console.log('Processing research query:', researchQuery);
  };

  return (
    <div className="page-container">
      <header>
        <h1>Research Assistance</h1>
      </header>
      <main>
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Get Research Help</h2>
          <p>
            Use our AI assistant to gather insights, summarize research papers, and find relevant information.
          </p>
        </section>
        <section id="demo">
          <h3>Try It Out</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="researchInput">Enter your research topic or question:</label>
            <textarea
              id="researchInput"
              value={researchQuery}
              onChange={(e) => setResearchQuery(e.target.value)}
              placeholder="Enter your research query here..."
              required
            />
            <button type="submit">Get Assistance</button>
          </form>
          <div id="output" aria-live="polite">
            {assistance && <p>{assistance}</p>}
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Digital Twin Solutions</p>
      </footer>
    </div>
  );
};

export default ResearchAssistance; 