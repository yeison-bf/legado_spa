import React from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Book, Languages as LangIcon, X, Calendar, Globe, Award, ExternalLink } from 'lucide-react';
import { useAlumniDetails } from '../hooks/useAlumniDetails';

const AlumniProfileDetail = ({ alumniId, onBack }) => {
  const { alumni, loading, error } = useAlumniDetails(alumniId);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px', gap: '16px' }}>
      <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2563eb', borderRadius: '50%' }} />
      <p style={{ color: '#64748b', fontWeight: 500 }}>Cargando perfil profesional...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
      <button onClick={onBack} style={{ marginTop: '16px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
        Volver a la búsqueda
      </button>
    </div>
  );

  if (!alumni) return null;

  return (
    <div style={{  margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
      {/* Botón Volver */}
      <button 
        onClick={onBack}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          padding: '8px 16px', backgroundColor: 'white', 
          border: '1px solid #e2e8f0', borderRadius: '8px', 
          cursor: 'pointer', marginBottom: '24px',
          color: '#475569', fontWeight: 500,
          transition: 'all 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
      >
        <X size={18} /> Cerrar Vista Completa
      </button>

      {/* Header / Banner de Perfil */}
      <div style={{ 
        backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', 
        overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ height: '120px'}} />
        <div style={{ padding: '0 40px 40px', marginTop: '-60px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '24px' }}>
            {alumni.photoUrl ? (
              <img 
                src={alumni.photoUrl} 
                alt={alumni.firstName} 
                style={{ width: '140px', height: '140px', borderRadius: '24px', border: '6px solid white', objectFit: 'cover', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
              />
            ) : (
              <div style={{ 
                width: '140px', height: '140px', borderRadius: '24px', border: '6px solid white',
                backgroundColor: '#eff6ff', color: '#2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <User size={64} />
              </div>
            )}
            <div style={{ paddingBottom: '12px' }}>
              <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>
                {alumni.firstName} {alumni.lastName}
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '18px', color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={20} color="#2563eb" /> {alumni.roleName || 'Egresado'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
            <ContactInfo icon={Mail} label="Correo Electrónico" value={alumni.email} />
            <ContactInfo icon={Phone} label="Teléfono" value={alumni.phone || 'No especificado'} />
            <ContactInfo icon={MapPin} label="Ubicación" value={alumni.address || 'No especificada'} />
          </div>
        </div>
      </div>

      {/* Grid de Secciones */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        {/* Columna Izquierda: Experiencia y Educación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Educación */}
          <Section title="Formación Académica" icon={GraduationCap}>
            {alumni.studies?.length > 0 ? (
              alumni.studies.map((study, idx) => (
                <TimelineItem 
                  key={idx}
                  title={study.title}
                  subtitle={study.institution}
                  period={`${study.startDate?.slice(0, 4) || 'N/A'} - ${study.completionDate?.slice(0, 4) || 'Actualidad'}`}
                  description={study.description}
                  badge={study.level}
                  url={study.certificateUrl}
                />
              ))
            ) : <EmptySection message="No hay formación académica registrada." />}
          </Section>

          {/* Experiencia */}
          <Section title="Experiencia Profesional" icon={Briefcase}>
            {alumni.experiences?.length > 0 ? (
              alumni.experiences.map((exp, idx) => (
                <TimelineItem 
                  key={idx}
                  title={exp.position}
                  subtitle={exp.company}
                  period={`${exp.startDate?.slice(0, 4) || 'N/A'} - ${exp.endDate?.slice(0, 4) || 'Actualidad'}`}
                  description={exp.description}
                />
              ))
            ) : <EmptySection message="No hay experiencia laboral registrada." />}
          </Section>

          {/* Publicaciones */}
          <Section title="Publicaciones y Logros" icon={Book}>
            {alumni.publications?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {alumni.publications.map((pub, idx) => (
                  <div key={idx} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>{pub.title}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#64748b' }}>
                        <span>{pub.type}</span>
                        <span>•</span>
                        <span>{pub.year || pub.date?.slice(0, 4)}</span>
                        {pub.publisher && <span>• {pub.publisher}</span>}
                      </div>
                      {pub.link && (
                        <a 
                          href={pub.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          <ExternalLink size={14} /> Ver enlace
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptySection message="No hay publicaciones registradas." />}
          </Section>
        </div>

        {/* Columna Derecha: Idiomas e Info Adicional */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Idiomas */}
          <Section title="Idiomas" icon={LangIcon}>
            {alumni.languages?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {alumni.languages.map((lang, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{lang.language}</span>
                    <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '20px' }}>
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            ) : <EmptySection message="No especificado." />}
          </Section>

          {/* Institución */}
          <div style={{ padding: '24px', backgroundColor: '#eff6ff', borderRadius: '20px', border: '1px solid #dbeafe' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#1e40af', fontWeight: 800 }}>INSTITUCIÓN</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af' }}>
                <Award size={20} />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#1e3a8a' }}>{alumni.institution?.name}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Subcomponentes de apoyo ---

const ContactInfo = ({ icon: Icon, label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontWeight: 500, fontSize: '14px' }}>
      <Icon size={16} color="#64748b" />
      {value}
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
        <Icon size={20} />
      </div>
      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>{title}</h3>
    </div>
    {children}
  </div>
);

const TimelineItem = ({ title, subtitle, period, description, badge, url }) => (
  <div style={{ position: 'relative', paddingLeft: '24px', paddingBottom: '24px', borderLeft: '2px solid #f1f5f9' }}>
    <div style={{ position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563eb', border: '2px solid white' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{title}</h4>
      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{period}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 600 }}>{subtitle}</span>
        {badge && (
          <span style={{ fontSize: '10px', backgroundColor: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
            {badge}
          </span>
        )}
      </div>
      {url && (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
        >
          <ExternalLink size={14} /> Ver certificado
        </a>
      )}
    </div>
    {description && <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{description}</p>}
  </div>
);

const EmptySection = ({ message }) => (
  <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>{message}</p>
);

export default AlumniProfileDetail;
