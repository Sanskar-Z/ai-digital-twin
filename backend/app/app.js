const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const researchRoutes = require('./routes/researchRoutes');
const { cleanupUploadedFiles } = require('./services/researchAssistant');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically for development purposes only
// In production, use proper security measures
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/research', researchRoutes);

// Configure uploads directory cleanup interval (every 12 hours)
const CLEANUP_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours
setInterval(() => {
    console.log('Running scheduled cleanup of uploaded files');
    cleanupUploadedFiles(24); // Delete files older than 24 hours
}, CLEANUP_INTERVAL_MS);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
