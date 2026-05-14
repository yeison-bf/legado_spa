import api from '../../../shared/services/api';

export const alumniService = {
  // Perfil General (Incluye estudios, experiencia, etc.)
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  getAlumniProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  updateProfileGeneral: async (userId, data) => {
    return api.put(`/users/${userId}`, data); // patch, no put
  },

  searchAlumni: async (query, institutionId) => {
    let url = `/users/search?q=${query}`;
    if (institutionId) url += `&institutionId=${institutionId}`;
    const response = await api.get(url);
    return response.data;
  },

  getInstitutionStats: async () => {
    const response = await api.get('/users/institution/stats');
    return response.data;
  },

  listAlumni: async (page = 1, limit = 10, institutionId) => {
    let url = `/users/institution/list?page=${page}&limit=${limit}`;
    if (institutionId) url += `&institutionId=${institutionId}`;
    const response = await api.get(url);
    return response.data;
  },

  updateAlumniRole: async (userId, roleName) => {
    const response = await api.put(`/users/${userId}/role`, { roleName });
    return response.data;
  },

  // Estudios
  createStudy: async (studyData) => {
    return api.post('/user-studies', studyData).then(res => res.data);
  },

  updateStudy: async (id, studyData) => {
    return api.put(`/user-studies/${id}`, studyData).then(res => res.data);
  },

  deleteStudy(id) {
    return api.delete(`/user-studies/${id}`).then(res => res.data);
  },


  // Experiencia

  createExperience(experienceData) {
    return api.post('/user-experience', experienceData).then(res => res.data);
  },

  updateExperience(id, experienceData) {
    return api.put(`/user-experience/${id}`, experienceData).then(res => res.data);
  },

  deleteExperience(id) {
    return api.delete(`/user-experience/${id}`).then(res => res.data);
  },



  // Publicaciones
  createPublication(publicationData) {
    return api.post('/user-publications', publicationData).then(res => res.data);
  },

  updatePublication(id, publicationData) {
    return api.put(`/user-publications/${id}`, publicationData).then(res => res.data);
  },

  deletePublication(id) {
    return api.delete(`/user-publications/${id}`).then(res => res.data);
  },



  // Idiomas
  createLanguage(languageData) {
    return api.post('/user-languages', languageData).then(res => res.data);
  },

  updateLanguage(id, languageData) {
    return api.put(`/user-languages/${id}`, languageData).then(res => res.data);
  },

  deleteLanguage(id) {
    return api.delete(`/user-languages/${id}`).then(res => res.data);
  },
};
