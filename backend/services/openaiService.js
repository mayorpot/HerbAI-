const axios = require('axios');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000,
      httpsAgent: new (require('https').Agent)({
    keepAlive: true,
    timeout: 60000
      })
    });
  }

  async generateResponse(question, context, type = 'general') {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      let systemPrompt = '';
      let userPrompt = '';

      switch (type) {
        case 'herb_recommendation':
          systemPrompt = `You are a knowledgeable herbal medicine expert. Provide accurate, evidence-based information about herbs and their uses. Always prioritize safety and recommend consulting healthcare professionals for serious conditions.`;
          userPrompt = `Based on the following context from our herb database and the user's question, provide a helpful response:

Context: ${context}

User Question: ${question}

Please provide:
1. A clear, concise answer
2. Relevant herbs from our database (if any)
3. Safety considerations
4. When to consult a professional`;
          break;

        case 'general':
        default:
          systemPrompt = `You are HerbAI, a friendly and knowledgeable assistant specializing in herbal medicine. You provide accurate, helpful information while emphasizing safety and professional consultation for medical conditions.`;
          userPrompt = `Question: ${question}

${context ? `Relevant context: ${context}` : ''}

Please provide a helpful, accurate response about herbal medicine.`;
      }

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      });

      const answer = response.data.choices[0].message.content;

      return {
        answer,
        sources: this.extractSources(context),
        confidence: 0.9, // Placeholder for confidence scoring
        model: response.data.model,
        usage: response.data.usage
      };

    } catch (error) {
      console.error('🚨 OpenAI API error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('OpenAI API key invalid');
      } else if (error.response?.status === 429) {
        throw new Error('OpenAI API rate limit exceeded');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('OpenAI API request timeout');
      }
      
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  extractSources(context) {
    // Simple source extraction - in production, this would be more sophisticated
    const sources = [];
    if (context && context.includes('Herb:')) {
      const herbMatches = context.match(/Herb: ([^\n]+)/g);
      if (herbMatches) {
        sources.push(...herbMatches.map(match => match.replace('Herb: ', '')));
      }
    }
    return sources.slice(0, 3); // Limit to 3 sources
  }

  // Check if service is available
  async isAvailable() {
    try {
      if (!this.apiKey) return false;
      
      // Simple check by making a small request
      await this.client.get('/models', { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new OpenAIService();