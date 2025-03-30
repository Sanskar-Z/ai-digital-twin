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

const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/research', researchRoutes);

const CLEANUP_INTERVAL_MS = 12 * 60 * 60 * 1000; 
setInterval(() => {
    console.log('Running scheduled cleanup of uploaded files');
    cleanupUploadedFiles(24); 
}, CLEANUP_INTERVAL_MS);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
