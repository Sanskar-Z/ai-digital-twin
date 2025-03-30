import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const ResearchAssistance = () => {
  const [researchQuery, setResearchQuery] = useState('');
  const [input, setInput] = useState('');
  const [assistance, setAssistance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputType, setInputType] = useState('text'); 
  const [analysisType, setAnalysisType] = useState('summarize');
  const [serverStatus, setServerStatus] = useState({ checked: false, online: true });

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/health', {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setServerStatus({ checked: true, online: response.ok });
      } catch (err) {
        console.error('Server connectivity check failed:', err);
        setServerStatus({ checked: true, online: false });
      }
    };
    
    checkServerStatus();
  }, []);

  const validateInput = () => {
    if (serverStatus.checked && !serverStatus.online) {
      setError('Cannot connect to server. Please check your connection or try again later.');
      return false;
    }
    
    if (inputType === 'url') {
      if (!input) {
        setError('Please enter a URL.');
        return false;
      }
      
      try {
        new URL(input);
      } catch (err) {
        setError('Please enter a valid URL (e.g., https://example.com).');
        return false;
      }
    } else {
      if (!input || input.trim().length < 10) {
        setError('Please enter at least 10 characters of content to analyze.');
        return false;
      }
    }
    
    if (analysisType === 'custom' && (!researchQuery || researchQuery.trim().length < 5)) {
      setError('Please enter a specific research question (at least 5 characters).');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAssistance('');

    if (!validateInput()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const requestBody = {
        input: input,
        query: researchQuery || analysisType,
      };

      const response = await fetch('http://localhost:3000/api/research/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.insights) {
        throw new Error('Response missing insights data');
      }

      setAssistance(data.insights);
      window.scrollTo({
        top: document.getElementById('output').offsetTop - 20,
        behavior: 'smooth',
      });
    } catch (err) {
      console.error('Error processing research:', err);
      setError(err.message || 'An error occurred while processing your research query');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputTypeChange = (type) => {
    setInputType(type);
    setError('');
  };
  
  const clearResults = () => {
    setAssistance('');
    // Scroll back to the form
    window.scrollTo({
      top: document.getElementById('demo').offsetTop - 20,
      behavior: 'smooth',
    });
  };
  
  const retryServerConnection = async () => {
    setServerStatus({ checked: false, online: false });
    setError('');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/api/health', { 
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setServerStatus({ checked: true, online: response.ok });
      
      if (!response.ok) {
        setError('Server is currently unavailable. Please try again later.');
      }
    } catch (err) {
      console.error('Server retry check failed:', err);
      setServerStatus({ checked: true, online: false });
      setError('Cannot connect to server. Please check your connection or try again later.');
    }
  };

  return (
    <div className="page-container">
      <header>
        <h1 className="title">Research Assistance</h1>
      </header>
      <main className="feature-section">
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Get Research Help</h2>
          <p>
            Use our AI assistant to gather insights, summarize research papers, and find relevant information.
          </p>
        </section>
        
        {!serverStatus.online && serverStatus.checked ? (
          <section className="server-error-section">
            <div className="server-error">
              <h3>Server Connection Error</h3>
              <p>We're having trouble connecting to the server. This could be due to:</p>
              <ul>
                <li>Network connectivity issues</li>
                <li>The server may be temporarily down</li>
                <li>Your firewall or security settings</li>
              </ul>
              <button 
                onClick={retryServerConnection}
                className="retry-btn"
              >
                Retry Connection
              </button>
            </div>
          </section>
        ) : (
          <section id="demo">
            <h3>Try It Out</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select input type:</label>
                <div className="input-type-selector">
                  <button 
                    type="button" 
                    className={`input-type-btn ${inputType === 'text' ? 'active' : ''}`}
                    onClick={() => handleInputTypeChange('text')}
                  >
                    Text Content
                  </button>
                  <button 
                    type="button" 
                    className={`input-type-btn ${inputType === 'url' ? 'active' : ''}`}
                    onClick={() => handleInputTypeChange('url')}
                  >
                    URL
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="inputField">
                  {inputType === 'url' ? 'Enter a URL to analyze:' : 'Paste research content to analyze:'}
                </label>
                <textarea
                  id="inputField"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={inputType === 'url' ? 'https://example.com/research-paper.html' : 'Paste research content here...'}
                  className="input-field"
                />
              </div>
              
              <div className="form-group">
                <label>What would you like to know?</label>
                <select 
                  value={analysisType} 
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="analysis-type-select"
                >
                  <option value="summarize">Summarize the content</option>
                  <option value="key findings">Extract key findings</option>
                  <option value="methodology">Analyze methodology</option>
                  <option value="literature review">Identify related work</option>
                  <option value="future work">Identify limitations and future work</option>
                  <option value="custom">Custom query (specify below)</option>
                </select>
              </div>
              
              {analysisType === 'custom' && (
                <div className="form-group">
                  <label htmlFor="researchInput">Enter your specific research question:</label>
                  <textarea
                    id="researchInput"
                    value={researchQuery}
                    onChange={(e) => {
                      setResearchQuery(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="E.g., 'What are the key findings?' or 'Summarize the methodology'"
                    className="query-field"
                  />
                </div>
              )}
              
              <div className="buttons-row">
                <button type="submit" disabled={isLoading} className="submit-btn">
                  {isLoading ? 'Processing...' : 'Get Assistance'}
                </button>
                
                {assistance && (
                  <button 
                    type="button" 
                    onClick={clearResults} 
                    className="clear-btn"
                    disabled={isLoading}
                  >
                    Clear Results
                  </button>
                )}
              </div>
            </form>
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            
            <div id="output" aria-live="polite">
              {assistance ? (
                <div className="result-container">
                  <h4>Research Insights</h4>
                  <div className="insights-content">
                    {assistance.split('\n').map((paragraph, index) => (
                      paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ResearchAssistance;