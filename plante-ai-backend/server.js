require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const assistantId = process.env.OPENAI_ASSISTANT_ID;

// Endpoint to handle messages from frontend
app.post('/api/message', async (req, res) => {
  try {
    const { message, threadId } = req.body;

    let thread_id = threadId;
    // If no threadId, create a new thread
    if (!thread_id) {
      const thread = await openai.beta.threads.create();
      thread_id = thread.id;
    }

    // Send user message to assistant
    await openai.beta.threads.messages.create(thread_id, {
      role: 'user',
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread_id, {
      assistant_id: assistantId,
    });

    // Poll for completion
    let completed = false;
    let aiMessage = 'Sorry, no response.';
    while (!completed) {
      const runStatus = await openai.beta.threads.runs.retrieve(thread_id, run.id);
      if (runStatus.status === 'completed') {
        completed = true;
        const messages = await openai.beta.threads.messages.list(thread_id);
        // Get the last assistant message
        const lastMsg = messages.data.reverse().find(m => m.role === 'assistant');
        aiMessage = lastMsg ? lastMsg.content.text.value : aiMessage;
      } else if (['failed', 'cancelled', 'expired'].includes(runStatus.status)) {
        completed = true;
        aiMessage = 'Sorry, I could not process your request.';
      } else {
        // Wait a bit before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.json({ reply: aiMessage, threadId: thread_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI backend running on port ${PORT}`));
