import api from './api';

export const locationService = {
  async updateLocation(coordinates) {
    const response = await api.put('/location/update', { coordinates });
    return response.data;
  },

  async getNearbyNurses(lng, lat, distance = 5) {
    const response = await api.get('/location/nearby', {
      params: { lng, lat, distance }
    });
    return response.data;
  }
};