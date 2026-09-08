const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Clock AI backend is running' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'clock.html'));
});

app.post('/api/chat', async (req, res) => {
  const message = (req.body && req.body.message) ? String(req.body.message).trim() : '';

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openAiKey && !geminiKey) {
    return res.json({
      reply:
        'AI is ready, but no API key is configured yet. Add OPENAI_API_KEY or GEMINI_API_KEY in a .env file and restart the server.'
    });
  }

  try {
    if (openAiKey) {
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for a digital clock website. Answer clearly and briefly.'
            },
            { role: 'user', content: message }
          ],
          temperature: 0.7
        })
      });

      const data = await aiResponse.json();

      if (!aiResponse.ok) {
        throw new Error(data.error?.message || 'OpenAI request failed');
      }

      const reply = data.choices?.[0]?.message?.content?.trim();
      return res.json({ reply: reply || 'I could not generate a response.' });
    }

    if (geminiKey) {
      const aiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: message }]
              }
            ]
          })
        }
      );

      const data = await aiResponse.json();

      if (!aiResponse.ok) {
        throw new Error(data.error?.message || 'Gemini request failed');
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return res.json({ reply: reply || 'I could not generate a response.' });
    }

    return res.json({ reply: 'No AI provider is configured.' });
  } catch (error) {
    console.error('AI API error:', error);
    return res.json({
      reply: 'The AI service is unavailable right now. Please check your API key or try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Clock AI server running on http://localhost:${PORT}`);
});
