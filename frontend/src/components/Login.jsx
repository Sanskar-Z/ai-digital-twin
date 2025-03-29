import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="page-container">
      <header>
        <h1>Login</h1>
      </header>
      <main>
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Welcome Back!</h2>
          <p>Log in to access your AI-powered digital twin services.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>Don't have an account? <Link to="/signup">Sign up here</Link>.</p>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Digital Twin Solutions</p>
      </footer>
    </div>
  );
};

export default Login; 