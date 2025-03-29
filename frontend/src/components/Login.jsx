import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Import reset email function
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import '../styles/index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

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
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        alert('Invalid username or password.');
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Please enter your email to reset your password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      alert('Failed to send password reset email. Please try again.');
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
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit">Login</button>
          </form>
          <div className="auth-links">
            <p>Don't have an account? <Link to="/signup">Sign up here</Link>.</p>
            <p>
              <button type="button" onClick={handleForgotPassword} className="forgot-password-button">
                Forgot password?
              </button>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;