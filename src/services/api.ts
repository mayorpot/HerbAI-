// src/services/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

export interface AIChatResponse {
  response: string;
  messageId: string;
}

export interface Herb {
  id: number;
  name: string;
  scientificName: string;
  uses: string[];
  preparation: string;
  dosage: string;
  warnings: string;
  benefits: string[];
  image: string;
}

export interface HerbalRecommendation {
  causes: string[];
  remedies: {
    name: string;
    description: string;
    preparation: string;
    dosage: string;
    benefits: string[];
  }[];
  lifestyle: string[];
  warnings: string[];
  seeDoctor: string;
}

class ApiService {
  private async fetchWithErrorHandling(url: string, options: RequestInit = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'API error' }));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // AI endpoints - UPDATED to match new backend
  async getRecommendations(symptoms: string, maxResults?: number): Promise<{ recommendations: any[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/ai/recommend`, {
      method: 'POST',
      body: JSON.stringify({ symptoms, maxResults }),
    });
  }

  async askQuestion(question: string): Promise<{ answer: string }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/ai/ask`, {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  // Herb endpoints - UPDATED to match new backend
  async getAllHerbs(): Promise<{ herbs: any[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/herbs`);
  }

  async searchHerbs(query: string): Promise<{ herbs: any[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/herbs?search=${encodeURIComponent(query)}`);
  }

  async getHerbById(id: string): Promise<{ herb: any }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/herbs/${id}`);
  }

  async getHerbsByCondition(condition: string): Promise<{ herbs: any[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/herbs/search/condition?condition=${encodeURIComponent(condition)}`);
  }

  // Conditions endpoints - NEW
  async getAllConditions(): Promise<{ conditions: any[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/conditions`);
  }

  async searchConditions(query: string): Promise<{ conditions: any[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/conditions?search=${encodeURIComponent(query)}`);
  }

  async getConditionsBySymptom(symptom: string): Promise<{ conditions: any[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/conditions/search/symptom?symptom=${encodeURIComponent(symptom)}`);
  }

  // Feedback endpoints - NEW
  async submitFeedback(feedback: {
    herbId?: string;
    rating: number;
    comment?: string;
    type?: string;
  }): Promise<{ feedback: any }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  async getHerbFeedback(herbId: string): Promise<{ feedback: any[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/feedback/herb/${herbId}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/health`);
  }
}

export const apiService = new ApiService();