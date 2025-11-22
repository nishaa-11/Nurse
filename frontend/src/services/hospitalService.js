import api from './api';

export const hospitalService = {
  async getAllHospitals() {
    const response = await api.get('/hospitals');
    return response.data;
  },

  async getHospital(id) {
    const response = await api.get(`/hospitals/${id}`);
    return response.data;
  },

  async updateHospital(id, hospitalData) {
    const response = await api.put(`/hospitals/${id}`, hospitalData);
    return response.data;
  }
};