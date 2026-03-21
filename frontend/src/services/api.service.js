import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Change to your backend URL

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate AI suggestions for a message
   */
  async getSuggestions(message, options = {}) {
    try {
      const response = await this.client.post('/suggest', {
        message,
        contextMessages: options.contextMessages || [],
        userId: options.userId || 'anonymous',
        userTier: options.userTier || 'free',
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('API Error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get suggestions',
        status: error.response?.status,
      };
    }
  }

  /**
   * Get user's current usage stats
   */
  async getUsage(userId, tier = 'free') {
    try {
      const response = await this.client.get(`/suggest/usage/${userId}`, {
        params: { tier },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Usage API Error:', error);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Test the API connection
   */
  async testConnection() {
    try {
      const response = await this.client.post('/suggest/test', {
        message: 'Test message',
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check API health
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${API_URL.replace('/api', '')}/health`, {
        timeout: 5000,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'API is not reachable',
      };
    }
  }
}

export default new ApiService();
