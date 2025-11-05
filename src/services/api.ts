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
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // AI Chat endpoints
  async analyzeSymptoms(message: string, userId?: string): Promise<AIChatResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/ai/analyze-symptoms`, {
      method: 'POST',
      body: JSON.stringify({ message, userId }),
    });
  }

  async getHerbalRecommendations(symptoms: string): Promise<{ recommendations: HerbalRecommendation }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/ai/herbal-recommendations`, {
      method: 'POST',
      body: JSON.stringify({ symptoms }),
    });
  }

  async clearConversation(userId: string) {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/ai/conversation/${userId}`, {
      method: 'DELETE',
    });
  }

  // Herb database endpoints
  async getAllHerbs(): Promise<{ herbs: Herb[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/herbs`);
  }

  async searchHerbs(query: string): Promise<{ results: Herb[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/herbs/search?q=${encodeURIComponent(query)}`);
  }

  async getHerbById(id: number): Promise<{ herb: Herb }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/herbs/${id}`);
  }

  async getHerbsBySymptom(symptom: string): Promise<{ herbs: Herb[] }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/herbs/symptom/${encodeURIComponent(symptom)}`);
  }
}

export const apiService = new ApiService();