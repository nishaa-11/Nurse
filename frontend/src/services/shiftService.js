import api from './api';

export const shiftService = {
  async getAllShifts() {
    const response = await api.get('/shifts');
    return response.data;
  },

  async getShift(id) {
    const response = await api.get(`/shifts/${id}`);
    return response.data;
  },

  async createShift(shiftData) {
    const response = await api.post('/shifts', shiftData);
    return response.data;
  },

  async updateShift(id, shiftData) {
    const response = await api.put(`/shifts/${id}`, shiftData);
    return response.data;
  },

  async deleteShift(id) {
    const response = await api.delete(`/shifts/${id}`);
    return response.data;
  },

  async applyForShift(id, message = '') {
    const response = await api.post(`/shifts/${id}/apply`, { message });
    return response.data;
  },

  async assignNurse(id, nurseId) {
    const response = await api.post(`/shifts/${id}/assign`, { nurseId });
    return response.data;
  },

  async cancelAssignment(id) {
    const response = await api.post(`/shifts/${id}/cancel`);
    return response.data;
  },

  async getQueue(id) {
    const response = await api.get(`/shifts/${id}/queue`);
    return response.data;
  }
};