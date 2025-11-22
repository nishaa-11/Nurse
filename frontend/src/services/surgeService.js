import api from './api';

export const surgeService = {
  async activateSurge() {
    const response = await api.post('/surge/activate');
    return response.data;
  },

  async deactivateSurge() {
    const response = await api.post('/surge/deactivate');
    return response.data;
  }
};