import api from './api';

export const nurseService = {
  async getAllNurses(verified) {
    const params = verified !== undefined ? { verified } : {};
    const response = await api.get('/nurses', { params });
    return response.data;
  },

  async getNurse(id) {
    const response = await api.get(`/nurses/${id}`);
    return response.data;
  },

  async updateNurse(id, nurseData) {
    const response = await api.put(`/nurses/${id}`, nurseData);
    return response.data;
  },

  async verifyNurse(id, idDocument) {
    const response = await api.put(`/nurses/${id}/verify`, { idDocument });
    return response.data;
  }
};