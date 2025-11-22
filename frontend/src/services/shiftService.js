import api from './api';

export const shiftService = {
  async getAllShifts() {
    try {
      console.log('ShiftService - Fetching all shifts');
      const response = await api.get('/shifts');
      console.log('ShiftService - Received shifts:', response.data.length);
      return response.data || [];
    } catch (error) {
      console.error('ShiftService - Error fetching shifts:', error);
      return [];
    }
  },

  async getShift(id) {
    const response = await api.get(`/shifts/${id}`);
    return response.data;
  },

  async createShift(shiftData) {
    try {
      console.log('ShiftService - Creating shift:', shiftData);
      const response = await api.post('/shifts', shiftData);
      console.log('ShiftService - Shift created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('ShiftService - Error creating shift:', error);
      throw error;
    }
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