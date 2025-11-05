// backend/services/openaiService.js
const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY is missing from environment variables');
      throw new Error('OpenAI API key not configured');
    }

    console.log('🔑 OpenAI API Key found, initializing...');
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.herbalKnowledgeBase = this.getHerbalKnowledgeBase();
    console.log('✅ OpenAI service initialized successfully');
  }

  getHerbalKnowledgeBase() {
    return `
    HERBAL MEDICINE KNOWLEDGE BASE:

    [Keep the same content as before...]
    `;
  }

  async analyzeSymptoms(userMessage, conversationHistory = []) {
    try {
      console.log('🤖 Analyzing symptoms:', userMessage.substring(0, 100) + '...');

      const systemPrompt = `
      You are ALBA, an AI herbal medicine assistant. You provide natural, herbal recommendations based on traditional knowledge.

      CRITICAL RULES:
      1. NEVER diagnose medical conditions - always recommend consulting healthcare providers
      2. Focus on herbal remedies and lifestyle suggestions
      3. Always include safety information
      4. Be empathetic and clear

      HERBAL KNOWLEDGE BASE:
      ${this.herbalKnowledgeBase}

      USER'S MESSAGE: "${userMessage}"

      Provide helpful, safe herbal advice.
      `;

      console.log('📤 Sending request to OpenAI...');
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using 3.5-turbo for testing (cheaper and more available)
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      console.log('✅ Received response from OpenAI');
      
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('❌ OpenAI API Error:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('OpenAI Response Error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('OpenAI Request Error:', error.message);
      } else {
        console.error('OpenAI Setup Error:', error.message);
      }

      // Fallback response if API fails
      return `I apologize, but I'm having trouble accessing my knowledge base right now. 

Based on common herbal practices, here are some general recommendations:

🌿 **For general wellness**: Stay hydrated, get adequate rest, and consider gentle herbs like chamomile or ginger tea.

📚 **In the meantime**, you can:
- Browse our herbal database for specific remedies
- Check our health library for educational articles
- Consult with our certified herbal doctors

⚠️ **Important**: Always consult with a healthcare provider for proper medical advice.

Please try again in a few moments, or describe your symptoms and I'll do my best to help with basic herbal knowledge.`;
    }
  }

  async getHerbalRecommendation(symptoms) {
    try {
      const prompt = `
      Symptoms: "${symptoms}"
      Provide simple herbal advice in plain text.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Provide simple herbal advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Recommendation Error:', error);
      return "I'm currently unable to provide specific recommendations. Please try our herbal database or consult with a healthcare provider.";
    }
  }
}

module.exports = new OpenAIService();