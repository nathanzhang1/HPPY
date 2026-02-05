import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your machine's local IP for physical device testing, or localhost for simulators
// const API_URL = 'http://localhost:3000/api';
const API_URL = 'https://rightable-polymeric-katherina.ngrok-free.dev/api';

const TOKEN_KEY = 'auth_token';

class ApiService {
  async getToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  async setToken(token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  async removeToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  async request(endpoint, options = {}) {
    const token = await this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Auth endpoints
  async register(phone, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    return data;
  }

  async login(phone, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    return data;
  }

  async logout() {
    await this.removeToken();
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async checkAuth() {
    const token = await this.getToken();
    if (!token) return null;
    
    try {
      const data = await this.getCurrentUser();
      return data.user;
    } catch (error) {
      // Token is invalid or expired
      await this.removeToken();
      return null;
    }
  }

  // Activity endpoints
  async createActivity(name, happiness) {
    // Send local timestamp to backend
    const created_at = new Date().toISOString();
    return await this.request('/activities', {
      method: 'POST',
      body: JSON.stringify({ name, happiness, created_at }),
    });
  }

  async getActivities() {
    return await this.request('/activities');
  }

  async updateActivity(id, name, happiness) {
    const body = {};
    if (name !== undefined) body.name = name;
    if (happiness !== undefined) body.happiness = happiness;

    return await this.request(`/activities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async deleteActivity(id) {
    return await this.request(`/activities/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
