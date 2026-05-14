import { useState, useEffect, useCallback } from 'react';
import { alumniService } from '../services/alumni.service';
import { useNotification } from '../../../shared/components';

export const useAlumniProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  // ============================================
  // PERFIL
  // ============================================

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await alumniService.getProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al cargar el perfil';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);


  const updateProfileGeneral = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await alumniService.updateProfileGeneral(profile.id, data);
      setProfile(response.user);
      setError(null);
      showNotification('Perfil actualizado correctamente', 'success');
      await fetchProfile(); // 👈 Recargar automáticamente
      return response.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar el perfil';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, fetchProfile, showNotification]); // 👈 Agregar fetchProfile a dependencias



  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ============================================
  // ESTUDIOS
  // ============================================

  const createStudy = useCallback(async (studyData) => {
    try {
      setLoading(true);
      const response = await alumniService.createStudy(studyData);
      setError(null);
      showNotification('Estudio agregado con éxito', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear el estudio';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error creating study:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const updateStudy = useCallback(async (id, studyData) => {
    try {
      setLoading(true);
      const response = await alumniService.updateStudy(id, studyData);
      setError(null);
      showNotification('Estudio actualizado', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar el estudio';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error updating study:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const deleteStudy = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await alumniService.deleteStudy(id);
      setError(null);
      showNotification('Estudio eliminado', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar el estudio';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error deleting study:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);



  // ============================================
  // EXPERIENCIA
  // ============================================

  const createExperience = useCallback(async (experienceData) => {
    try {
      setLoading(true);
      const response = await alumniService.createExperience(experienceData);
      setError(null);
      showNotification('Experiencia laboral agregada', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear la experiencia';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error creating experience:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const updateExperience = useCallback(async (id, experienceData) => {
    try {
      setLoading(true);
      const response = await alumniService.updateExperience(id, experienceData);
      setError(null);
      showNotification('Experiencia actualizada', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar la experiencia';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error updating experience:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const deleteExperience = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await alumniService.deleteExperience(id);
      setError(null);
      showNotification('Experiencia eliminada', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar la experiencia';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error deleting experience:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);



  // ============================================
  // PUBLICACIONES
  // ============================================

  const createPublication = useCallback(async (publicationData) => {
    try {
      setLoading(true);
      const response = await alumniService.createPublication(publicationData);
      setError(null);
      showNotification('Publicación agregada', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear la publicación';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error creating publication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const updatePublication = useCallback(async (id, publicationData) => {
    try {
      setLoading(true);
      const response = await alumniService.updatePublication(id, publicationData);
      setError(null);
      showNotification('Publicación actualizada', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar la publicación';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error updating publication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const deletePublication = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await alumniService.deletePublication(id);
      setError(null);
      showNotification('Publicación eliminada', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar la publicación';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error deleting publication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);



  // ============================================
  // IDIOMAS
  // ============================================

  const createLanguage = useCallback(async (languageData) => {
    try {
      setLoading(true);
      const response = await alumniService.createLanguage(languageData);
      setError(null);
      showNotification('Idioma agregado', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear el idioma';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error creating language:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const updateLanguage = useCallback(async (id, languageData) => {
    try {
      setLoading(true);
      const response = await alumniService.updateLanguage(id, languageData);
      setError(null);
      showNotification('Idioma actualizado', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar el idioma';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error updating language:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const deleteLanguage = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await alumniService.deleteLanguage(id);
      setError(null);
      showNotification('Idioma eliminado', 'success');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar el idioma';
      setError(msg);
      showNotification(msg, 'error');
      console.error('Error deleting language:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // En el return:
  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    setProfile,
    updateProfileGeneral,
    createStudy,
    updateStudy,
    deleteStudy,
    createExperience,
    updateExperience,
    deleteExperience,
    createPublication,
    updatePublication,
    deletePublication,
    createLanguage,
    updateLanguage,
    deleteLanguage
  };
}