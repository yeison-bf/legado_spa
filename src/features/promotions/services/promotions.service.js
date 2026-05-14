import api from '../../../shared/services/api';

export const promotionsService = {
  searchGroups: async (query) => {
    const response = await api.get('/promotions/search', { params: query });
    return response.data;
  },

  joinOrCreate: async (data) => {
    const response = await api.post('/promotions/join', data);
    return response.data;
  },

  getMyGroups: async () => {
    const response = await api.get('/promotions/my-groups');
    return response.data;
  },

  getMessages: async (groupId) => {
    const response = await api.get(`/promotions/${groupId}/messages`);
    return response.data;
  },

  sendMessage: async (groupId, content) => {
    const response = await api.post(`/promotions/${groupId}/messages`, { content });
    return response.data;
  },

  leaveGroup: async (groupId) => {
    const response = await api.delete(`/promotions/${groupId}/leave`);
    return response.data;
  },

  // Simulación de fetching de programas desde edunormas
  getPrograms: async (institutionId) => {
    // Aquí podrías llamar a la API real de edunormas si tienes el endpoint expuesto
    // Por ahora, devolvemos una lista estandarizada
    return [
      { id: 1, name: 'Educación Media (10° - 11°)' },
      { id: 2, name: 'Formación Complementaria' },
      { id: 3, name: 'Básica Secundaria' },
      { id: 4, name: 'Nocturna / Sabatina' },
    ];
  }
};
