import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import '../firebase'; // Ensure Firebase is initialized in this file
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName: formData.name });

      console.log('Signup successful:', user);
      alert('Signup successful! Please log in.');
    } catch (error) {
      console.error('Signup failed:', error.message);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <header>
        <h1 class="title">Signup</h1>
      </header>
      <main>
        <section>
          <Link to="/" className="home-button">Home</Link>
          <h2>Create Your Account</h2>
          <p>Sign up to start using your AI-powered digital twin services.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
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
            </div>
            <div className="form-group">
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
            </div>
            <div className="form-group">
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
            </div>
            <button type="submit">Signup</button>
          </form>
          <div className="auth-links">
            <p>Already have an account? <Link to="/login">Log in here</Link>.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Signup;