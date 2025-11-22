import api from './api';

export const ratingService = {
  async rateNurse(nurseId, ratingData) {
    const response = await api.post(`/ratings/${nurseId}`, ratingData);
    return response.data;
  },

  async getNurseRatings(nurseId) {
    const response = await api.get(`/ratings/${nurseId}`);
    return response.data;
  }
};