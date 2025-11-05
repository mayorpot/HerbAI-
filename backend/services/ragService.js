// backend/services/ragService.js
const herbDatabase = require('../data/herbDatabase');
const natural = require('natural');
const { TfIdf, PorterStemmer } = natural;

class RAGService {
  constructor() {
    this.herbDatabase = herbDatabase;
    this.tfidf = new TfIdf();
    this.setupSearchIndex();
  }

  setupSearchIndex() {
    // Create search index from herb database
    this.herbDatabase.forEach((herb, index) => {
      const document = this.createDocumentText(herb);
      this.tfidf.addDocument(document);
    });
  }

  createDocumentText(herb) {
    return `
      ${herb.name} ${herb.scientificName} ${herb.description}
      ${herb.uses.join(' ')} ${herb.symptoms.join(' ')}
      ${herb.benefits.join(' ')} ${herb.category}
    `.toLowerCase();
  }

  searchHerbs(query, limit = 5) {
    const scores = [];
    const queryTerms = query.toLowerCase().split(' ');

    this.tfidf.tfidfs(query, (i, measure) => {
      if (measure > 0) {
        scores.push({ index: i, score: measure });
      }
    });

    // Sort by score and get top results
    scores.sort((a, b) => b.score - a.score);
    
    const results = scores.slice(0, limit).map(score => {
      return {
        ...this.herbDatabase[score.index],
        relevanceScore: score.score
      };
    });

    return results;
  }

  findHerbsBySymptoms(symptoms) {
    const symptomText = Array.isArray(symptoms) ? symptoms.join(' ') : symptoms;
    const relevantHerbs = this.herbDatabase.filter(herb =>
      herb.symptoms.some(symptom => 
        symptomText.toLowerCase().includes(symptom.toLowerCase())
      )
    );

    // Score by number of matching symptoms
    const scoredHerbs = relevantHerbs.map(herb => {
      const matchingSymptoms = herb.symptoms.filter(symptom =>
        symptomText.toLowerCase().includes(symptom.toLowerCase())
      );
      return {
        ...herb,
        matchingSymptoms,
        matchScore: matchingSymptoms.length
      };
    });

    // Sort by match score
    return scoredHerbs.sort((a, b) => b.matchScore - a.matchScore);
  }

  getHerbRecommendations(symptoms, userHealthProfile = {}) {
    const relevantHerbs = this.findHerbsBySymptoms(symptoms);
    
    // Filter based on user health profile (allergies, medications, etc.)
    const filteredHerbs = this.filterHerbsForUser(relevantHerbs, userHealthProfile);

    return {
      symptoms,
      recommendedHerbs: filteredHerbs.slice(0, 5),
      totalMatches: filteredHerbs.length,
      considerations: this.generateSafetyConsiderations(filteredHerbs, userHealthProfile)
    };
  }

  filterHerbsForUser(herbs, healthProfile) {
    const { allergies = [], medications = [], medicalHistory = [] } = healthProfile;

    return herbs.filter(herb => {
      // Check for allergies
      if (allergies.some(allergy => 
        herb.name.toLowerCase().includes(allergy.toLowerCase()) ||
        herb.warnings.some(warning => 
          warning.toLowerCase().includes(allergy.toLowerCase())
        )
      )) {
        return false;
      }

      // Check for medication interactions
      if (medications.some(medication =>
        herb.interactions.some(interaction =>
          interaction.toLowerCase().includes(medication.toLowerCase())
        )
      )) {
        return false;
      }

      return true;
    });
  }

  generateSafetyConsiderations(herbs, healthProfile) {
    const considerations = [];

    herbs.forEach(herb => {
      if (herb.warnings.length > 0) {
        considerations.push({
          herb: herb.name,
          warnings: herb.warnings,
          interactions: herb.interactions.filter(interaction => 
            healthProfile.medications?.some(med => 
              interaction.toLowerCase().includes(med.toLowerCase())
            )
          )
        });
      }
    });

    return considerations;
  }

  // Enhanced search with semantic understanding
  enhancedSearch(query, userContext = {}) {
    const searchResults = this.searchHerbs(query);
    const symptomResults = this.findHerbsBySymptoms(query);
    
    // Combine and deduplicate results
    const allResults = [...searchResults, ...symptomResults];
    const uniqueResults = this.deduplicateResults(allResults);

    // Apply user context filtering
    const filteredResults = this.filterHerbsForUser(uniqueResults, userContext.healthProfile || {});

    return {
      query,
      results: filteredResults.slice(0, 6),
      searchType: this.determineSearchType(query),
      suggestedQuestions: this.generateFollowUpQuestions(query, filteredResults)
    };
  }

  deduplicateResults(results) {
    const seen = new Set();
    return results.filter(herb => {
      if (seen.has(herb.id)) return false;
      seen.add(herb.id);
      return true;
    });
  }

  determineSearchType(query) {
    const symptoms = ['pain', 'ache', 'fever', 'cough', 'nausea', 'stress', 'anxiety'];
    const isSymptomSearch = symptoms.some(symptom => 
      query.toLowerCase().includes(symptom)
    );
    
    return isSymptomSearch ? 'symptom' : 'general';
  }

  generateFollowUpQuestions(query, results) {
    const questions = [];
    
    if (results.length > 0) {
      questions.push(`Would you like more details about ${results[0].name}?`);
      questions.push('Are you experiencing any other symptoms?');
      questions.push('How long have you had these symptoms?');
    }

    return questions;
  }
}

module.exports = new RAGService();