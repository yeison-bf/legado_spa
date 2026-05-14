import React, { useState } from 'react';
import { Card, Tooltip, ConfirmDialog, useNotification } from '../../../shared/components';
import { Search, Eye, Download, Shield, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAlumniList } from '../../alumni';

const AlumniTable = ({ onSelectStudent, institutionId }) => {
  const { alumni, loading, totalPages, page, setPage, updateRole } = useAlumniList(institutionId);
  const [updatingId, setUpdatingId] = useState(null);
  const { showNotification } = useNotification();
  
  // Estado para el modal de confirmación
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null });

  const handleOpenConfirm = (user) => {
    setConfirmModal({ isOpen: true, user });
  };

  const handleConfirmRoleChange = async () => {
    const { user } = confirmModal;
    const newRole = user.role?.name === 'ADMINISTRATOR' ? 'GRADUATE' : 'ADMINISTRATOR';
    
    setConfirmModal({ isOpen: false, user: null });
    setUpdatingId(user.id);
    
    const result = await updateRole(user.id, newRole);
    if (result.success) {
      showNotification(`Rol de ${user.firstName} actualizado a ${newRole}`, 'success');
    } else {
      showNotification(result.error, 'error');
    }
    setUpdatingId(null);
  };

  if (loading && alumni.length === 0) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando listado...</div>;

  return (
    <Card title="Directorio de Egresados">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>Rol Actual</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumni.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {student.photoUrl ? (
                      <img src={student.photoUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserIcon size={16} color="#64748b" />
                      </div>
                    )}
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{student.firstName} {student.lastName}</div>
                  </div>
                </td>
                <td style={tdStyle}>{student.email}</td>
                <td style={tdStyle}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '11px', 
                    fontWeight: '700',
                    backgroundColor: student.role?.name === 'ADMINISTRATOR' ? '#eff6ff' : '#f8fafc',
                    color: student.role?.name === 'ADMINISTRATOR' ? '#2563eb' : '#64748b',
                    border: `1px solid ${student.role?.name === 'ADMINISTRATOR' ? '#dbeafe' : '#e2e8f0'}`
                  }}>
                    {student.role?.name || 'GRADUATE'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Tooltip text="Ver Perfil Completo">
                      <button onClick={() => onSelectStudent(student)} style={actionBtnStyle}>
                        <Eye size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text={student.role?.name === 'ADMINISTRATOR' ? 'Quitar privilegios ADMIN' : 'Hacer ADMINISTRADOR'}>
                      <button 
                        onClick={() => handleOpenConfirm(student)} 
                        disabled={updatingId === student.id}
                        style={{ 
                          ...actionBtnStyle, 
                          color: student.role?.name === 'ADMINISTRATOR' ? '#f59e0b' : '#2563eb' 
                        }} 
                      >
                        <Shield size={18} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
          style={pageBtnStyle}
        >
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
          Página {page} de {totalPages}
        </span>
        <button 
          onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
          disabled={page === totalPages}
          style={pageBtnStyle}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmDialog 
        isOpen={confirmModal.isOpen}
        title="Cambiar Rol de Usuario"
        message={`¿Estás seguro que deseas cambiar el rol de ${confirmModal.user?.firstName}? Esto afectará sus permisos en la plataforma.`}
        confirmText="Sí, cambiar rol"
        cancelText="No, cancelar"
        onConfirm={handleConfirmRoleChange}
        onCancel={() => setConfirmModal({ isOpen: false, user: null })}
      />
    </Card>
  );
};

const thStyle = { padding: '16px 12px', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '16px 12px', fontSize: '14px' };
const actionBtnStyle = { 
  padding: '8px', 
  borderRadius: '8px', 
  border: '1px solid #e2e8f0', 
  backgroundColor: 'white', 
  color: '#64748b', 
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s'
};
const pageBtnStyle = {
  padding: '8px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  backgroundColor: 'white',
  color: '#1e293b',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
};

export default AlumniTable;
