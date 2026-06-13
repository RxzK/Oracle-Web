const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const DATA_PATH = path.join(__dirname, 'knowledge.json');

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize knowledge file
if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2));
}

app.post('/api/sync', (req, res) => {
    const { data } = req.body;
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
        res.json({ message: "Sync successful", count: data.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Read knowledge
    const knowledge = JSON.parse(fs.readFileSync(DATA_PATH));

    // Simple search for context
    const contextItems = knowledge.filter(item =>
        item.name.toLowerCase().includes(message.toLowerCase()) ||
        item.content.toLowerCase().includes(message.toLowerCase())
    ).slice(0, 5);

    let contextStr = "Here is relevant information from the user's PC:\n";
    contextItems.forEach(item => {
        contextStr += `- ${item.name}: ${item.content.substring(0, 500)}...\n`;
    });

    const prompt = `
        You are Oracle Web Edition. You have access to the user's synced PC data.
        CONTEXT:
        ${contextStr}
        
        USER QUESTION: "${message}"
        
        Respond helpfully and intelligently based on the context.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        res.json({ text: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Serve frontend FOR ALL OTHER ROUTES
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend build not found. Please run "npm run build" in the frontend directory.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Oracle Web Backend running on port ${PORT}`);
});
