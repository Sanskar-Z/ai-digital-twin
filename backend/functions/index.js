const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.json({ message: "Hello from Firebase Cloud Functions!" });
});

// Export Express API as a Firebase Function
exports.api = functions.https.onRequest(app);
