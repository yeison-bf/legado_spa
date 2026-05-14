import { useState, useEffect, useCallback } from 'react';
import { alumniService } from '../services/alumni.service';

export const useAlumniList = (institutionId, initialPage = 1, initialLimit = 10) => {
  const [data, setData] = useState({ items: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await alumniService.listAlumni(page, limit, institutionId);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el listado');
      console.error('Error fetching alumni list:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, institutionId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const updateRole = async (userId, roleName) => {
    try {
      await alumniService.updateAlumniRole(userId, roleName);
      // Actualizar localmente el rol del usuario en la lista
      setData(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === userId ? { ...item, role: { ...item.role, name: roleName } } : item
        )
      }));
      return { success: true };
    } catch (err) {
      console.error('Error updating role:', err);
      return { success: false, error: err.response?.data?.message || 'Error al actualizar rol' };
    }
  };

  return { 
    alumni: data.items, 
    total: data.total, 
    totalPages: data.totalPages,
    page, 
    setPage, 
    limit, 
    setLimit,
    loading, 
    error, 
    refresh: fetchList,
    updateRole
  };
};
