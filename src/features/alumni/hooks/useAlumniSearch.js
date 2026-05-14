import { useState, useCallback } from 'react';
import { alumniService } from '../services/alumni.service';

export const useAlumniSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query, institutionId) => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await alumniService.searchAlumni(query, institutionId);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al buscar egresados');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    search
  };
};
