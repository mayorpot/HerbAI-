// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');

// Store conversation history
const conversationHistory = new Map();

// Analyze symptoms and provide herbal recommendations
router.post('/analyze-symptoms', async (req, res) => {
  try {
    const { message, userId = 'default' } = req.body;

    console.log('📝 Received message:', message);

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required',
        details: 'Please provide a message describing your symptoms'
      });
    }

    // Basic validation
    if (message.length > 1000) {
      return res.status(400).json({
        error: 'Message too long',
        details: 'Please keep your message under 1000 characters'
      });
    }

    // Get user's conversation history
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }
    const userHistory = conversationHistory.get(userId);

    // Add user message to history
    userHistory.push({ role: 'user', content: message });

    console.log('🔄 Processing with OpenAI...');
    
    // Get AI response with timeout
    const aiResponse = await Promise.race([
      openaiService.analyzeSymptoms(message, userHistory),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )
    ]);

    // Add AI response to history
    userHistory.push({ role: 'assistant', content: aiResponse });

    // Keep only last 10 messages
    if (userHistory.length > 10) {
      conversationHistory.set(userId, userHistory.slice(-10));
    }

    console.log('✅ Successfully generated response');
    
    res.json({
      response: aiResponse,
      messageId: Date.now().toString(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Error in analyze-symptoms:', error);
    
    let errorMessage = 'Failed to analyze symptoms';
    let statusCode = 500;

    if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout - please try again';
      statusCode = 408;
    } else if (error.message.includes('API key')) {
      errorMessage = 'Service configuration error';
      statusCode = 503;
    }

    res.status(statusCode).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      suggestion: 'Please try again in a few moments'
    });
  }
});

// Test endpoint to check OpenAI connection
router.get('/test', async (req, res) => {
  try {
    const testResponse = await openaiService.analyzeSymptoms('Hello, are you working?');
    res.json({ 
      status: 'success', 
      message: 'OpenAI connection is working',
      response: testResponse.substring(0, 100) + '...'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'OpenAI connection failed',
      error: error.message
    });
  }
});

// Other routes remain the same...
router.post('/herbal-recommendations', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    const recommendations = await openaiService.getHerbalRecommendation(symptoms);

    res.json({
      recommendations,
      symptoms
    });

  } catch (error) {
    console.error('Error in herbal-recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to get herbal recommendations',
      message: error.message 
    });
  }
});

// ... rest of the routes

module.exports = router;