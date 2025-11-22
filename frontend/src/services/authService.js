import api from './api';

export const authService = {
  async register(userData) {
    try {
      console.log('AuthService: Sending registration request to:', '/auth/register');
      console.log('AuthService: Request payload:', JSON.stringify(userData, null, 2));
      
      const response = await api.post('/auth/register', userData);
      
      console.log('AuthService: Registration response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('AuthService: Token and user data saved to localStorage');
      }
      return response.data;
    } catch (error) {
      console.error('AuthService: Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        userData: userData
      });
      throw error;
    }
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      // Update localStorage with new user data
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!token && !!user;
  }
};