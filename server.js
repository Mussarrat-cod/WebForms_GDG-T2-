const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from the current directory

const DATA_FILE = path.join(__dirname, 'formSubmissions.json');

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
}

// API endpoint to submit form data
app.post('/api/submit-form', async (req, res) => {
    try {
        const { formId, formData } = req.body;
        
        // Read existing data
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        
        // Add new submission
        data.push({
            id: Date.now(),
            form: formId,
            data: formData,
            timestamp: new Date().toISOString()
        });
        
        // Save back to file
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        
        res.status(200).json({ success: true, message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ success: false, message: 'Error saving form data' });
    }
});

// API endpoint to get all form submissions
app.get('/api/submissions', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        res.status(200).json(data);
    } catch (error) {
        console.error('Error reading form data:', error);
        res.status(500).json({ success: false, message: 'Error reading form data' });
    }
});

// Start server
async function startServer() {
    await initializeDataFile();
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();
