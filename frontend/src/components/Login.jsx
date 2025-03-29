import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../styles/index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the Firebase ID token
      const token = await user.getIdToken();
      localStorage.setItem('token', token);

      alert('Login successful!');
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="page-container">
      <header>
        <h1 className="title">Login</h1>
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
    </div>
  );
};

export default Login;