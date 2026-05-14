import { useState, useCallback, useEffect } from 'react';
import { alumniService } from '../services/alumni.service';

export const useAlumniDetails = (alumniId) => {
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlumniDetails = useCallback(async () => {
    if (!alumniId) return;
    
    try {
      setLoading(true);
      const data = await alumniService.getAlumniProfile(alumniId);
      setAlumni(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los detalles del egresado');
      console.error('Error fetching alumni details:', err);
    } finally {
      setLoading(false);
    }
  }, [alumniId]);

  useEffect(() => {
    fetchAlumniDetails();
  }, [fetchAlumniDetails]);

  return {
    alumni,
    loading,
    error,
    refresh: fetchAlumniDetails
  };
};
