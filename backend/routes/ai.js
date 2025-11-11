// backend/routes/ai.js
const express = require('express');
const Herb = require('../models/Herb');
const { auth } = require('../middleware/auth');
const openaiService = require('../services/openaiService');
const ragService = require('../services/ragService');

const router = express.Router();

// Get herb recommendations based on symptoms
router.post('/recommend', auth, async (req, res) => {
  try {
    const { symptoms, maxResults = 5 } = req.body;

    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({
        error: 'Symptoms required',
        message: 'Please describe your symptoms'
      });
    }

    console.log('🤖 AI Recommendation request:', symptoms);

    // Use RAG service to get relevant herbs based on symptoms
    const relevantHerbs = await ragService.findRelevantHerbs(symptoms, maxResults);

    // Get context for AI
    const context = await ragService.getRelevantContext(symptoms);

    // Generate AI response
    const aiResponse = await openaiService.generateResponse(
      `User symptoms: ${symptoms}. Suggest herbal remedies.`,
      context,
      'symptom_analysis'
    );

    res.json({
      symptoms,
      recommendations: relevantHerbs,
      aiAdvice: aiResponse.answer,
      sources: aiResponse.sources,
      confidence: aiResponse.confidence,
      source: aiResponse.model === 'database_search' ? 'knowledge_base' : 'ai_enhanced',
      count: relevantHerbs.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🚨 Recommendation error:', error);
    
    // Fallback to basic search if AI fails
    try {
      const fallbackHerbs = await Herb.find({
        isActive: true,
        $or: [
          { conditions: { $regex: req.body.symptoms, $options: 'i' } },
          { benefits: { $regex: req.body.symptoms, $options: 'i' } }
        ]
      }).limit(5).select('name scientific description benefits conditions imageUrl');

      res.json({
        symptoms: req.body.symptoms,
        recommendations: fallbackHerbs,
        aiAdvice: "I found these herbs that might help with your symptoms. For more detailed advice, please try again later.",
        source: 'fallback_search',
        count: fallbackHerbs.length,
        timestamp: new Date().toISOString()
      });
    } catch (fallbackError) {
      res.status(500).json({
        error: 'Recommendation service unavailable',
        message: 'Unable to generate herb recommendations at this time'
      });
    }
  }
});

// Ask AI a free-form question
router.post('/ask', auth, async (req, res) => {
  try {
    const { question, context = 'general' } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: 'Question required',
        message: 'Please provide a question'
      });
    }

    console.log('🤖 AI Question:', question);

    // Get relevant context from knowledge base
    const relevantContext = await ragService.getRelevantContext(question);
    
    // Generate AI response using OpenAI service
    const aiResponse = await openaiService.generateResponse(question, relevantContext, context);

    console.log('✅ AI Response generated successfully');

    res.json({
      question,
      answer: aiResponse.answer,
      sources: aiResponse.sources,
      confidence: aiResponse.confidence,
      model: aiResponse.model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🚨 AI ask error:', error);
    
    // Fallback response
    res.json({
      question: req.body.question,
      answer: "I'm currently experiencing technical difficulties. Please try browsing our herb database directly or try again in a few moments.",
      sources: [],
      confidence: 0.1,
      model: 'fallback',
      timestamp: new Date().toISOString()
    });
  }
});

// Test AI service status
router.get('/status', async (req, res) => {
  try {
    const openAIAvailable = await openaiService.isAvailable();
    const ragStats = ragService.getStats();
    
    res.json({
      openai: {
        available: openAIAvailable,
        hasApiKey: !!process.env.OPENAI_API_KEY
      },
      rag: ragStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      openai: {
        available: false,
        hasApiKey: !!process.env.OPENAI_API_KEY
      },
      rag: { initialized: false },
      error: error.message
    });
  }
});

module.exports = router;