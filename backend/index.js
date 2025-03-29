const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const app = express();
const PORT = 5000;

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json'); // Replace with your Firebase service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const auth = getAuth();
const db = getFirestore();

// Middleware
app.use(cors());
app.use(express.json());

// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Save additional user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await auth.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Firebase does not provide password validation in Admin SDK.
    // Use Firebase Authentication client SDK on the frontend for password validation.
    res.status(200).json({ message: 'Login successful', uid: user.uid });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
