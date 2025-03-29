import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup attempt with:', formData);
  };

  return (
    <div className="page-container">
      <header>
        <h1>Signup</h1>
      </header>
      <main>
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Create Your Account</h2>
          <p>Sign up to start using your AI-powered digital twin services.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
            <button type="submit">Signup</button>
          </form>
          <p>Already have an account? <Link to="/login">Log in here</Link>.</p>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Digital Twin Solutions</p>
      </footer>
    </div>
  );
};

export default Signup; 