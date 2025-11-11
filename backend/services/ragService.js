const Herb = require('../models/Herb');
const natural = require('natural');

class RAGService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    this.herbKnowledgeBase = [];
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('📚 Initializing RAG knowledge base...');
      
      // Load all herbs into memory for semantic search
      const herbs = await Herb.find({ isActive: true })
        .select('name scientific description benefits conditions');
      
      this.herbKnowledgeBase = herbs.map(herb => ({
        id: herb._id,
        name: herb.name,
        scientific: herb.scientific,
        description: herb.description,
        benefits: herb.benefits,
        conditions: herb.conditions,
        text: this.prepareTextForIndexing(herb)
      }));

      // Build TF-IDF index
      this.herbKnowledgeBase.forEach((herb, index) => {
        this.tfidf.addDocument(herb.text);
      });

      this.isInitialized = true;
      console.log(`✅ RAG knowledge base initialized with ${this.herbKnowledgeBase.length} herbs`);
    } catch (error) {
      console.error('🚨 RAG initialization error:', error);
      throw error;
    }
  }

  prepareTextForIndexing(herb) {
    return [
      herb.name,
      herb.scientific,
      herb.description,
      ...herb.benefits,
      ...herb.conditions
    ].join(' ').toLowerCase();
  }

  async findRelevantHerbs(query, maxResults = 5) {
    await this.initialize();

    try {
      const queryTokens = this.tokenizer.tokenize(query.toLowerCase());
      const scores = [];

      // Calculate similarity scores for each herb
      this.herbKnowledgeBase.forEach((herb, docIndex) => {
        let score = 0;
        
        queryTokens.forEach(token => {
          this.tfidf.tfidfs(token, (i, measure) => {
            if (i === docIndex) {
              score += measure;
            }
          });
        });

        // Boost score for exact matches in conditions and benefits
        const conditionMatches = herb.conditions.filter(condition => 
          query.toLowerCase().includes(condition.toLowerCase())
        ).length;

        const benefitMatches = herb.benefits.filter(benefit =>
          query.toLowerCase().includes(benefit.toLowerCase())
        ).length;

        score += (conditionMatches * 0.5) + (benefitMatches * 0.3);
        scores.push({ herb, score, docIndex });
      });

      // Sort by score and get top results
      const topResults = scores
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(item => ({
          id: item.herb.id,
          name: item.herb.name,
          scientific: item.herb.scientific,
          description: item.herb.description.substring(0, 200) + '...',
          benefits: item.herb.benefits.slice(0, 3),
          conditions: item.herb.conditions,
          relevanceScore: Math.round(item.score * 100) / 100,
          matchType: this.getMatchType(item.herb, query)
        }));

      return topResults;

    } catch (error) {
      console.error('🚨 RAG search error:', error);
      return [];
    }
  }

  getMatchType(herb, query) {
    const queryLower = query.toLowerCase();
    
    // Check for exact condition matches
    const conditionMatch = herb.conditions.some(condition => 
      queryLower.includes(condition.toLowerCase())
    );

    // Check for exact benefit matches
    const benefitMatch = herb.benefits.some(benefit =>
      queryLower.includes(benefit.toLowerCase())
    );

    if (conditionMatch) return 'condition_match';
    if (benefitMatch) return 'benefit_match';
    return 'semantic_match';
  }

  async getRelevantContext(query, maxContextLength = 1000) {
    const relevantHerbs = await this.findRelevantHerbs(query, 3);
    
    if (relevantHerbs.length === 0) {
      return 'No specific herb information found in knowledge base.';
    }

    let context = 'Relevant herbs from knowledge base:\n\n';
    
    relevantHerbs.forEach(herb => {
      context += `Herb: ${herb.name}`;
      if (herb.scientific) context += ` (${herb.scientific})`;
      context += `\nConditions: ${herb.conditions.join(', ')}`;
      context += `\nBenefits: ${herb.benefits.join(', ')}`;
      context += `\nDescription: ${herb.description}\n\n`;
    });

    // Trim context to avoid token limits
    if (context.length > maxContextLength) {
      context = context.substring(0, maxContextLength) + '...';
    }

    return context;
  }

  // Get knowledge base statistics
  getStats() {
    return {
      totalHerbs: this.herbKnowledgeBase.length,
      initialized: this.isInitialized,
      lastInitialized: this.isInitialized ? new Date().toISOString() : null
    };
  }
}

module.exports = new RAGService();