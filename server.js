const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load environment variables first
dotenv.config();

const { OpenAI } = require('openai');

// 2. Initialize express app
const app = express();

// 3. Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// 4. Initialize OpenAI client configured for OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'ProPlex AI',
  },
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Use OpenRouter's auto-router to dynamically pick available free models
    const response = await openai.chat.completions.create({
      model: 'openrouter/free',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenRouter Error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: error.message || 'Failed to generate response from OpenRouter.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});