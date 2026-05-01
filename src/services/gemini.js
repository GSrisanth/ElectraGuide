/**
 * Gemini AI Service
 * Handles communication with Google's Gemini API directly from the client.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash"; // Updated to match server.js

export const sendMessageToGemini = async (messages, language = 'en') => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.');
    }

    // Convert frontend messages (role: user/assistant) to Gemini format (role: user/model)
    // Filter out 'system' roles as we'll pass it as systemInstruction
    const geminiContents = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ 
            text: `You are the ElectraGuide AI Assistant. You answer questions strictly related to the Indian election process, voting eligibility, and civic duties. Keep your answers concise, educational, and neutral. Respond in ${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'}.` 
          }]
        },
        contents: geminiContents
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from Gemini');
    }

    // Extract the text response from Gemini
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw error;
  }
};
