import express from 'express';
import { getDatabase } from '../db.js';

const router = express.Router();

// Mock chatbot response (replace with real API call if needed)
async function getChatbotResponse(message) {
  const apiKey = process.env.CHATBOT_API_KEY;

  if (!apiKey) {
    return {
      text: "I'm a note-taking assistant. How can I help you today?",
      mock: true
    };
  }

  // Example integration with OpenAI or similar
  // This is a placeholder - implement actual API calls based on your provider
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error('Chatbot API error');
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      mock: false
    };
  } catch (error) {
    console.error('Chatbot API error:', error);
    return {
      text: "I'm having trouble connecting. Please try again later.",
      mock: false
    };
  }
}

// Send message to chatbot
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await getChatbotResponse(message);
    const db = getDatabase();

    // Save chat message to history
    await db.run(
      'INSERT INTO chat_messages (user_id, message, response) VALUES (?, ?, ?)',
      [req.userId, message, response.text]
    );

    res.json({
      message,
      response: response.text,
      mock: response.mock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/history', async (req, res) => {
  try {
    const db = getDatabase();
    const messages = await db.all(
      'SELECT id, message, response, created_at FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.userId]
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
