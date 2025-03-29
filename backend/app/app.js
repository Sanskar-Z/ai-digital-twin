const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { gatherInsights } = require('./services/researchAssistant');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Research Assistance Endpoint
app.post('/api/research-assistance', async (req, res) => {
    try {
        console.log('Received request:', req.body);

        const { input, query } = req.body;
        if (!input || !query) {
            console.log('Invalid request: Missing input or query.');
            return res.status(400).json({ error: 'Input and query are required.' });
        }

        const result = await gatherInsights(input, query);
        console.log('Response to client:', result);
        res.json(result);
    } catch (error) {
        console.error('Error in /api/research-assistance:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
