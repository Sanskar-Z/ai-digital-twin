import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="page-container">
      <header>
        <h1 class="title">Login</h1>
      </header>
      <main>
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Welcome Back!</h2>
          <p>Log in to access your AI-powered digital twin services.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <div className="auth-links">
            <p>Don't have an account? <Link to="/signup">Sign up here</Link>.</p>
            <p><Link to="/forgot-password">Forgot password?</Link></p>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; Code Crusaders</p>
      </footer>
    </div>
  );
};

export default Login; 