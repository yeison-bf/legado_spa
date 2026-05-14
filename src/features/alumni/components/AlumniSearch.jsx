import React, { useState, useEffect } from 'react';
import { Search, User, Mail, GraduationCap, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { Card, Input } from '../../../shared/components';
import { useAlumniSearch } from '../hooks/useAlumniSearch';

const AlumniSearch = ({ onSelectAlumni, institutionId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { results, loading, error, search } = useAlumniSearch();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 3) {
        search(searchTerm, institutionId);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, search, institutionId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Input
          placeholder="Buscar egresados por nombre, email o documento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
          style={{ paddingLeft: '48px', height: '56px', fontSize: '16px' }}
        />
        {loading && (
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <Loader2 className="animate-spin" size={20} color="#64748b" />
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {results.length > 0 ? (
          results.map((alumni) => (
            <AlumniCard key={alumni.id} alumni={alumni} onClick={() => onSelectAlumni?.(alumni)} />
          ))
        ) : searchTerm.length >= 3 && !loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No se encontraron egresados con "{searchTerm}"
          </div>
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            {searchTerm.length > 0 ? 'Sigue escribiendo para buscar...' : 'Ingresa al menos 3 caracteres para comenzar la búsqueda.'}
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: '#ef4444', textAlign: 'center', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

const AlumniCard = ({ alumni, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = '#2563eb';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.1)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {alumni.photoUrl ? (
          <img 
            src={alumni.photoUrl} 
            alt={alumni.firstName} 
            style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '12px', 
            backgroundColor: '#eff6ff', color: '#2563eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={28} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
            {alumni.firstName} {alumni.lastName}
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <GraduationCap size={14} /> {alumni.roleName || 'Egresado'}
          </p>
        </div>
        <ExternalLink size={18} color="#94a3b8" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
          <Mail size={14} color="#94a3b8" />
          {alumni.email}
        </div>
        {alumni.address && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
            <MapPin size={14} color="#94a3b8" />
            {alumni.address}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniSearch;
