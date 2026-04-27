import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(401).json({ error: 'Gemini API key is not configured on the server.' });
    }

    // Convert frontend messages (role: user/assistant) to Gemini format (role: user/model)
    const geminiContents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are the ElectraGuide AI Assistant. You answer questions strictly related to the Indian election process, voting eligibility, and civic duties. Keep your answers concise, educational, and neutral." }]
        },
        contents: geminiContents
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from Gemini');
    }

    // Extract the text response from Gemini and format it like the frontend expects
    const aiText = data.candidates[0].content.parts[0].text;

    res.json({ content: [{ text: aiText }] });
  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ error: 'Failed to communicate with Gemini AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`ElectraGuide Backend Server running on http://localhost:${PORT}`);
});
