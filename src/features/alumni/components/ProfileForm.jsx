import React, { useState, useEffect } from 'react';
import { Card, Tabs, Input, Button } from '../../../shared/components';
import { Plus, Trash2, GraduationCap, Briefcase, Book, Languages as LangIcon, User, MapPin, Phone, Mail, CreditCard, Pencil, X, Check } from 'lucide-react';
import { useAlumniProfile } from '../hooks/useAlumniProfile';

// ============================================
// BOTONES DE MODO EDICIÓN — reutilizable
// ============================================
const EditModeButtons = ({ isEditing, onEdit, onCancel, onSave, saveLabel = 'Guardar' }) => {
  const btnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s ease',
  };

  if (!isEditing) {
    return (
      <button
        onClick={onEdit}
        style={{
          ...btnBase,
          background: '#f1f5f9',
          color: '#334155',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
      >
        <Pencil size={14} /> Editar
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={onCancel}
        style={{ ...btnBase, background: '#fee2e2', color: '#dc2626' }}
        onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
        onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
      >
        <X size={14} /> Cancelar
      </button>
      <button
        onClick={onSave}
        style={{ ...btnBase, background: '#dcfce7', color: '#16a34a' }}
        onMouseEnter={e => e.currentTarget.style.background = '#bbf7d0'}
        onMouseLeave={e => e.currentTarget.style.background = '#dcfce7'}
      >
        <Check size={14} /> {saveLabel}
      </button>
    </div>
  );
};

// ============================================
// WRAPPER DE CARD CON HEADER DE EDICIÓN
// ============================================
const EditableCard = ({ title, isEditing, onEdit, onCancel, onSave, saveLabel, children }) => (
  <div style={{
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    marginTop: '24px',
  }}>
    {/* Header */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 24px',
      borderBottom: '1px solid #f1f5f9',
      background: isEditing ? '#fafff4' : '#fafafa',
      transition: 'background 0.2s ease',
    }}>
      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
        {title}
      </h3>
      <EditModeButtons
        isEditing={isEditing}
        onEdit={onEdit}
        onCancel={onCancel}
        onSave={onSave}
        saveLabel={saveLabel}
      />
    </div>

    {/* Body */}
    <div style={{
      padding: '24px',
      opacity: isEditing ? 1 : 0.9,
      transition: 'opacity 0.2s ease',
    }}>
      {children}
    </div>
  </div>
);

// Estilo para inputs bloqueados
const inputWrapperStyle = (isEditing) => ({
  position: 'relative',
  pointerEvents: isEditing ? 'auto' : 'none',
  opacity: isEditing ? 1 : 0.7,
  transition: 'all 0.15s ease',
});

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const ProfileForm = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const { profile, loading, error } = useAlumniProfile();

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando perfil...</div>;
  if (error) return <div style={{ padding: '20px', color: '#ef4444', textAlign: 'center' }}>Error: {error}</div>;

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: User },
    { id: 'education', label: 'Estudios', icon: GraduationCap },
    { id: 'experience', label: 'Experiencia Laboral', icon: Briefcase },
    { id: 'publications', label: 'Publicaciones', icon: Book },
    { id: 'languages', label: 'Idiomas', icon: LangIcon },
  ];

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'personal' && <PersonalInfoSection data={profile} />}
      {activeTab === 'education' && <EducationSection data={profile?.studies} />}
      {activeTab === 'experience' && <ExperienceSection data={profile?.experiences} />}
      {activeTab === 'publications' && <PublicationsSection data={profile?.publications} />}
      {activeTab === 'languages' && <LanguagesSection data={profile?.languages} />}
    </div>
  );
};

// ============================================
// SECCIÓN PERSONAL
// ============================================
const PersonalInfoSection = ({ data }) => {
  const { updateProfileGeneral } = useAlumniProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const emptyForm = { firstName: '', lastName: '', username: '', phone: '', email: '', address: '' };
  const [form, setForm] = useState(emptyForm);
  const [snapshot, setSnapshot] = useState(emptyForm); // para cancelar

  useEffect(() => {
    if (data) {
      const values = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        username: data.username || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
      };
      setForm(values);
      setSnapshot(values);
    }
  }, [data]);

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleEdit = () => { setSnapshot(form); setIsEditing(true); };
  const handleCancel = () => { setForm(snapshot); setIsEditing(false); };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { username, ...datosAEnviar } = form; // username queda fuera
      await updateProfileGeneral(datosAEnviar);
      setSnapshot(form);
      setIsEditing(false);
    } catch (err) {
      // el hook maneja el toast de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditableCard
      title="Datos Personales y de Contacto"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      saveLabel={loading ? 'Guardando...' : 'Guardar'}
    >
      {/* Foto y nombre */}
      {data?.photoUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <img
            src={data.photoUrl}
            alt="Foto de perfil"
            style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
          />
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{data.firstName} {data.lastName}</p>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{data.institution?.name}</p>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>{data.roleName}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div style={{ ...inputWrapperStyle(isEditing), gridColumn: 'span 1' }}>
          <Input label="Nombre" icon={User} value={form.firstName} onChange={handleChange('firstName')} placeholder="Juan" />
        </div>
        <div style={{ ...inputWrapperStyle(isEditing), gridColumn: 'span 2' }}>
          <Input label="Apellidos" icon={User} value={form.lastName} onChange={handleChange('lastName')} placeholder="Pérez García" />
        </div>

        <div style={inputWrapperStyle(isEditing)}>
          <Input label="Usuario / Documento" icon={CreditCard} value={form.username} onChange={handleChange('username')} placeholder="123456789" />
        </div>
        <div style={inputWrapperStyle(isEditing)}>
          <Input label="Teléfono de Contacto" icon={Phone} value={form.phone} onChange={handleChange('phone')} placeholder="+57 300 000 0000" />
        </div>
        <div style={inputWrapperStyle(isEditing)}>
          <Input label="Correo" icon={Mail} type="email" value={form.email} onChange={handleChange('email')} placeholder="correo@gmail.com" />
        </div>

        <div style={{ ...inputWrapperStyle(isEditing), gridColumn: 'span 3' }}>
          <Input label="Dirección de Residencia" icon={MapPin} value={form.address} onChange={handleChange('address')} placeholder="Calle 123 #45-67, Ciudad" />
        </div>
      </div>

      {/* Indicador visual de modo bloqueado */}
      {!isEditing && (
        <p style={{ margin: '16px 0 0', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
          Presiona <strong>Editar</strong> para modificar tus datos personales
        </p>
      )}
    </EditableCard>
  );
};

// ============================================
// SECCIÓN ESTUDIOS
// ============================================

const EducationSection = ({ data }) => {
  const { createStudy, updateStudy, deleteStudy, refreshProfile } = useAlumniProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([]);
  const [snapshot, setSnapshot] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initial = data?.length > 0
      ? data.map(s => ({ 
          ...s, 
          _key: s.id,
          title: s.title || s.degree || '',
          institution: s.institution || '',
          level: s.level || '',
          fieldOfStudy: s.fieldOfStudy || '',
          startDate: s.startDate ? s.startDate.slice(0, 10) : '',
          completionDate: s.completionDate ? s.completionDate.slice(0, 10) : '',
          status: s.status || 'En curso',
          modality: s.modality || '',
          country: s.country || '',
          city: s.city || '',
          certificateUrl: s.certificateUrl || '',
          description: s.description || ''
        }))
      : [];
    setItems(initial);
    setSnapshot(initial);
  }, [data]);

  const handleChange = (key, field) => (e) =>
    setItems(prev => prev.map(i => i._key === key ? { ...i, [field]: e.target.value } : i));

  const addItem = () => {
    setItems(prev => [...prev, { 
      _key: Date.now(), 
      title: '', 
      institution: '', 
      level: '', 
      fieldOfStudy: '', 
      startDate: '', 
      completionDate: '', 
      status: 'En curso', 
      modality: '', 
      country: '', 
      city: '', 
      certificateUrl: '', 
      description: '' 
    }]);
  };

  const removeItem = async (key) => {
    const itemToRemove = items.find(i => i._key === key);
    if (itemToRemove.id) {
      try {
        setLoading(true);
        await deleteStudy(itemToRemove.id);
        await refreshProfile();
      } catch (err) {
        console.error('Error deleting study:', err);
      } finally {
        setLoading(false);
      }
    }
    setItems(prev => prev.filter(i => i._key !== key));
  };

  const handleEdit = () => { setSnapshot(JSON.parse(JSON.stringify(items))); setIsEditing(true); };
  const handleCancel = () => { setItems(JSON.parse(JSON.stringify(snapshot))); setIsEditing(false); };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      for (const item of items) {
        const studyData = {
          title: item.title,
          institution: item.institution,
          level: item.level || null,
          fieldOfStudy: item.fieldOfStudy || null,
          startDate: item.startDate || null,
          completionDate: item.completionDate || null,
          status: item.status || 'En curso',
          modality: item.modality || null,
          country: item.country || null,
          city: item.city || null,
          certificateUrl: item.certificateUrl || null,
          description: item.description || null
        };

        if (item.id) {
          await updateStudy(item.id, studyData);
        } else if (item.title || item.institution) {
          await createStudy(studyData);
        }
      }
      
      await refreshProfile();
      setSnapshot(JSON.parse(JSON.stringify(items)));
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving studies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Estilos compactos
  const compactInputStyle = {
    fontSize: '13px',
    padding: '6px 10px',
  };

  const compactLabelStyle = {
    fontSize: '11px',
    marginBottom: '2px',
    fontWeight: 500,
    color: '#64748b'
  };

  return (
    <EditableCard
      title="Formación Académica"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      saveLabel={loading ? 'Guardando...' : 'Guardar'}
    >
      <div style={{ maxHeight: isEditing ? 'none' : 'none', overflow: 'visible' }}>
        {items.map((item, index) => (
          <div
            key={item._key}
            style={{
              padding: '12px',
              border: `1px solid ${isEditing ? '#e2e8f0' : '#f1f5f9'}`,
              borderRadius: '10px',
              marginBottom: '12px',
              position: 'relative',
              background: isEditing ? '#fff' : '#fafafa',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Cabecera compacta del item */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: isEditing ? '12px' : '8px',
              paddingBottom: isEditing ? '8px' : '0',
              borderBottom: isEditing ? '1px solid #f1f5f9' : 'none'
            }}>
              {!isEditing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <strong style={{  color: '#1e293b' }}>
                    {item.title || 'Sin título'}
                  </strong>
                  <span style={{ fontSize: '14px', color: '#043881ff', fontWeight: 'bold' }}>
                    {item.institution}
                  </span>
                  {item.status && (
                    <span style={{ 
                      fontSize: '10px', 
                      background: item.status === 'En curso' ? '#fef3c7' : '#dcfce7',
                      color: item.status === 'En curso' ? '#d97706' : '#16a34a',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontWeight: 500
                    }}>
                      {item.status}
                    </span>
                  )}
                </div>
              )}
              {isEditing && items.length > 1 && (
                <button 
                  onClick={() => removeItem(item._key)} 
                  style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    color: '#ef4444', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Formulario compacto - 3 columnas en edición, resumen en vista */}
            {isEditing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={compactLabelStyle}>Título</label>
                  <input 
                    type="text"
                    value={item.title || ''} 
                    onChange={handleChange(item._key, 'title')} 
                    placeholder="Ingeniería de Sistemas"
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Institución</label>
                  <input 
                    type="text"
                    value={item.institution || ''} 
                    onChange={handleChange(item._key, 'institution')} 
                    placeholder="Universidad Nacional"
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Nivel</label>
                  <select 
                    value={item.level || ''} 
                    onChange={handleChange(item._key, 'level')}
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Tecnólogo">Tecnólogo</option>
                    <option value="Pregrado">Pregrado</option>
                    <option value="Especialización">Especialización</option>
                    <option value="Maestría">Maestría</option>
                    <option value="Doctorado">Doctorado</option>
                    <option value="Curso">Curso</option>
                  </select>
                </div>
                <div>
                  <label style={compactLabelStyle}>Área</label>
                  <input 
                    type="text"
                    value={item.fieldOfStudy || ''} 
                    onChange={handleChange(item._key, 'fieldOfStudy')} 
                    placeholder="Ingeniería"
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Inicio</label>
                  <input 
                    type="date"
                    value={item.startDate || ''} 
                    onChange={handleChange(item._key, 'startDate')} 
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Finalización</label>
                  <input 
                    type="date"
                    value={item.completionDate || ''} 
                    onChange={handleChange(item._key, 'completionDate')} 
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Estado</label>
                  <select 
                    value={item.status || 'En curso'} 
                    onChange={handleChange(item._key, 'status')}
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  >
                    <option value="En curso">En curso</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Suspendido">Suspendido</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label style={compactLabelStyle}>Modalidad</label>
                  <select 
                    value={item.modality || ''} 
                    onChange={handleChange(item._key, 'modality')}
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
                <div>
                  <label style={compactLabelStyle}>País</label>
                  <input 
                    type="text"
                    value={item.country || ''} 
                    onChange={handleChange(item._key, 'country')} 
                    placeholder="Colombia"
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Ciudad</label>
                  <input 
                    type="text"
                    value={item.city || ''} 
                    onChange={handleChange(item._key, 'city')} 
                    placeholder="Bogotá"
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <label style={compactLabelStyle}>Descripción (opcional)</label>
                  <input 
                    type="text"
                    value={item.description || ''} 
                    onChange={handleChange(item._key, 'description')} 
                    placeholder="Logros, actividades destacadas..."
                    style={{ ...compactInputStyle, width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  />
                </div>
              </div>
            ) : (
              // Vista resumen compacta
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                {item.level && <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>{item.level}</span>}
                {item.fieldOfStudy && <span>{item.fieldOfStudy}</span>}
                {(item.startDate || item.completionDate) && (
                  <span style={{ color: '#94a3b8', marginLeft: '8px' }}>
                    {item.startDate?.slice(0, 4)} - {item.completionDate?.slice(0, 4) || 'Actualidad'}
                  </span>
                )}
                {item.modality && <span style={{ marginLeft: '8px' }}>• {item.modality}</span>}
                {item.country && <span style={{ marginLeft: '8px' }}>• {item.country}</span>}
                {item.city && <span> - {item.city}</span>}
                {item.description && <div style={{ marginTop: '4px', fontSize: '11px', color: '#94a3b8' }}>{item.description}</div>}
              </div>
            )}
          </div>
        ))}

        {isEditing && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <button
              onClick={addItem}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                background: '#f1f5f9',
                border: '1px dashed #cbd5e1',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
            >
              <Plus size={14} /> Agregar Estudio
            </button>
          </div>
        )}

        {!isEditing && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>
            No hay estudios registrados. Presiona <strong>Editar</strong> para agregar tu formación académica.
          </div>
        )}

        {!isEditing && items.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
            Presiona <strong>Editar</strong> para modificar tus estudios
          </div>
        )}
      </div>
    </EditableCard>
  );
};

// ============================================
// SECCIÓN EXPERIENCIA
// ============================================

const ExperienceSection = ({ data }) => {
  const { createExperience, updateExperience, deleteExperience, refreshProfile } = useAlumniProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([]);
  const [snapshot, setSnapshot] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initial = data?.length > 0
      ? data.map(e => ({ 
          ...e, 
          _key: e.id,
          company: e.company || '',
          position: e.position || '',
          startDate: e.startDate ? e.startDate.slice(0, 10) : '',
          endDate: e.endDate ? e.endDate.slice(0, 10) : '',
          description: e.description || '',
          isCurrent: !e.endDate // para marcar trabajo actual
        }))
      : [];
    setItems(initial);
    setSnapshot(initial);
  }, [data]);

  const handleChange = (key, field) => (e) =>
    setItems(prev => prev.map(i => i._key === key ? { ...i, [field]: e.target.value } : i));

  const handleCurrentChange = (key, checked) => {
    setItems(prev => prev.map(i => i._key === key ? { 
      ...i, 
      isCurrent: checked,
      endDate: checked ? '' : i.endDate 
    } : i));
  };

  const addItem = () => {
    setItems(prev => [...prev, { 
      _key: Date.now(), 
      company: '', 
      position: '', 
      startDate: '', 
      endDate: '', 
      description: '',
      isCurrent: false
    }]);
  };

  const removeItem = async (key) => {
    const itemToRemove = items.find(i => i._key === key);
    if (itemToRemove.id) {
      try {
        setLoading(true);
        await deleteExperience(itemToRemove.id);
        await refreshProfile();
      } catch (err) {
        console.error('Error deleting experience:', err);
      } finally {
        setLoading(false);
      }
    }
    setItems(prev => prev.filter(i => i._key !== key));
  };

  const handleEdit = () => { setSnapshot(JSON.parse(JSON.stringify(items))); setIsEditing(true); };
  const handleCancel = () => { setItems(JSON.parse(JSON.stringify(snapshot))); setIsEditing(false); };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      for (const item of items) {
        const experienceData = {
          company: item.company,
          position: item.position,
          startDate: item.startDate || null,
          endDate: item.isCurrent ? null : (item.endDate || null),
          description: item.description || null
        };

        if (item.id) {
          await updateExperience(item.id, experienceData);
        } else if (item.company || item.position) {
          await createExperience(experienceData);
        }
      }
      
      await refreshProfile();
      setSnapshot(JSON.parse(JSON.stringify(items)));
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  const compactLabelStyle = {
    fontSize: '11px',
    marginBottom: '2px',
    fontWeight: 500,
    color: '#64748b'
  };

  const compactInputStyle = {
    fontSize: '13px',
    padding: '6px 10px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    width: '100%'
  };

  return (
    <EditableCard
      title="Experiencia Profesional"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      saveLabel={loading ? 'Guardando...' : 'Guardar'}
    >
      <div>
        {items.map((item) => (
          <div
            key={item._key}
            style={{
              padding: '12px',
              border: `1px solid ${isEditing ? '#e2e8f0' : '#f1f5f9'}`,
              borderRadius: '10px',
              marginBottom: '12px',
              position: 'relative',
              background: isEditing ? '#fff' : '#fafafa',
            }}
          >
            {/* Cabecera */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: isEditing ? '12px' : '8px',
              paddingBottom: isEditing ? '8px' : '0',
              borderBottom: isEditing ? '1px solid #f1f5f9' : 'none'
            }}>
              {!isEditing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <strong style={{ color: '#1e293b' }}>
                    {item.position || 'Sin cargo'}
                  </strong>
                  <span style={{ fontSize: '14px', color: '#002252ff', fontWeight: 'bold' }}>
                    @ {item.company}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {item.startDate?.slice(0, 4)} - {item.isCurrent ? 'Actualidad' : item.endDate?.slice(0, 4)}
                  </span>
                  {item.isCurrent && (
                    <span style={{ 
                      fontSize: '10px', 
                      background: '#dcfce7',
                      color: '#16a34a',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontWeight: 500
                    }}>
                      Actual
                    </span>
                  )}
                </div>
              )}
              {isEditing && items.length > 1 && (
                <button 
                  onClick={() => removeItem(item._key)} 
                  style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    color: '#ef4444', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {isEditing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={compactLabelStyle}>Empresa</label>
                  <input 
                    type="text"
                    value={item.company || ''} 
                    onChange={handleChange(item._key, 'company')} 
                    placeholder="Ej. Google"
                    style={compactInputStyle}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Cargo</label>
                  <input 
                    type="text"
                    value={item.position || ''} 
                    onChange={handleChange(item._key, 'position')} 
                    placeholder="Ej. Senior Developer"
                    style={compactInputStyle}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Fecha Inicio</label>
                  <input 
                    type="date"
                    value={item.startDate || ''} 
                    onChange={handleChange(item._key, 'startDate')} 
                    style={compactInputStyle}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Fecha Fin</label>
                  <input 
                    type="date"
                    value={item.endDate || ''} 
                    onChange={handleChange(item._key, 'endDate')} 
                    disabled={item.isCurrent}
                    style={{ ...compactInputStyle, opacity: item.isCurrent ? 0.5 : 1 }}
                  />
                  <label style={{ ...compactLabelStyle, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <input 
                      type="checkbox"
                      checked={item.isCurrent || false}
                      onChange={(e) => handleCurrentChange(item._key, e.target.checked)}
                    />
                    Trabajo actualmente aquí
                  </label>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={compactLabelStyle}>Descripción</label>
                  <textarea 
                    value={item.description || ''} 
                    onChange={handleChange(item._key, 'description')} 
                    placeholder="Logros, responsabilidades, tecnologías utilizadas..."
                    style={{ ...compactInputStyle, minHeight: '60px', resize: 'vertical' }}
                  />
                </div>
              </div>
            ) : (
              // Vista resumen
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                {item.description && (
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{item.description}</div>
                )}
              </div>
            )}
          </div>
        ))}

        {isEditing && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <button
              onClick={addItem}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                background: '#f1f5f9',
                border: '1px dashed #cbd5e1',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <Plus size={14} /> Agregar Experiencia
            </button>
          </div>
        )}

        {!isEditing && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>
            No hay experiencia registrada. Presiona <strong>Editar</strong> para agregar tu experiencia laboral.
          </div>
        )}
      </div>
    </EditableCard>
  );
};

// ============================================
// SECCIÓN PUBLICACIONES
// ============================================

const PublicationsSection = ({ data }) => {
  const { createPublication, updatePublication, deletePublication, refreshProfile } = useAlumniProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([]);
  const [snapshot, setSnapshot] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initial = data?.length > 0
      ? data.map(p => ({ 
          ...p, 
          _key: p.id,
          title: p.title || '',
          type: p.type || '',
          date: p.date ? p.date.slice(0, 10) : '',
          publisher: p.publisher || '',
          link: p.link || ''
        }))
      : [];
    setItems(initial);
    setSnapshot(initial);
  }, [data]);

  const handleChange = (key, field) => (e) =>
    setItems(prev => prev.map(i => i._key === key ? { ...i, [field]: e.target.value } : i));

  const addItem = () => {
    setItems(prev => [...prev, { 
      _key: Date.now(), 
      title: '', 
      type: 'Artículo', 
      date: '', 
      publisher: '', 
      link: '' 
    }]);
  };

  const removeItem = async (key) => {
    const itemToRemove = items.find(i => i._key === key);
    if (itemToRemove.id) {
      try {
        setLoading(true);
        await deletePublication(itemToRemove.id);
        await refreshProfile();
      } catch (err) {
        console.error('Error deleting publication:', err);
      } finally {
        setLoading(false);
      }
    }
    setItems(prev => prev.filter(i => i._key !== key));
  };

  const handleEdit = () => { setSnapshot(JSON.parse(JSON.stringify(items))); setIsEditing(true); };
  const handleCancel = () => { setItems(JSON.parse(JSON.stringify(snapshot))); setIsEditing(false); };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      for (const item of items) {
        const publicationData = {
          title: item.title,
          type: item.type,
          date: item.date || null,
          publisher: item.publisher || null,
          link: item.link || null
        };

        if (item.id) {
          await updatePublication(item.id, publicationData);
        } else if (item.title) {
          await createPublication(publicationData);
        }
      }
      
      await refreshProfile();
      setSnapshot(JSON.parse(JSON.stringify(items)));
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving publications:', err);
    } finally {
      setLoading(false);
    }
  };

  const compactLabelStyle = {
    fontSize: '11px',
    marginBottom: '2px',
    fontWeight: 500,
    color: '#64748b'
  };

  const compactInputStyle = {
    fontSize: '13px',
    padding: '6px 10px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    width: '100%'
  };

  // Tipos de publicación disponibles
  const publicationTypes = ['Artículo', 'Libro', 'Producción', 'Ensayo', 'Capítulo de libro', 'Memoria de conferencia'];

  return (
    <EditableCard
      title="Publicaciones Académicas"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      saveLabel={loading ? 'Guardando...' : 'Guardar'}
    >
      <div>
        {items.map((item) => (
          <div
            key={item._key}
            style={{
              padding: '12px',
              border: `1px solid ${isEditing ? '#e2e8f0' : '#f1f5f9'}`,
              borderRadius: '10px',
              marginBottom: '12px',
              position: 'relative',
              background: isEditing ? '#fff' : '#fafafa',
            }}
          >
            {/* Cabecera */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: isEditing ? '12px' : '8px',
              paddingBottom: isEditing ? '8px' : '0',
              borderBottom: isEditing ? '1px solid #f1f5f9' : 'none'
            }}>
              {!isEditing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>
                    {item.title || 'Sin título'}
                  </strong>
                  <span style={{ 
                    fontSize: '10px', 
                    background: '#e0e7ff',
                    color: '#4f46e5',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontWeight: 500
                  }}>
                    {item.type}
                  </span>
                  {item.date && (
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {item.date.slice(0, 4)}
                    </span>
                  )}
                  {item.publisher && (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {item.publisher}
                    </span>
                  )}
                </div>
              )}
              {isEditing && items.length > 1 && (
                <button 
                  onClick={() => removeItem(item._key)} 
                  style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    color: '#ef4444', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {isEditing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={compactLabelStyle}>Título</label>
                  <input 
                    type="text"
                    value={item.title || ''} 
                    onChange={handleChange(item._key, 'title')} 
                    placeholder="Ej. Inteligencia Artificial en la Educación"
                    style={compactInputStyle}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Tipo</label>
                  <select 
                    value={item.type || 'Artículo'} 
                    onChange={handleChange(item._key, 'type')}
                    style={compactInputStyle}
                  >
                    {publicationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={compactLabelStyle}>Fecha</label>
                  <input 
                    type="date"
                    value={item.date || ''} 
                    onChange={handleChange(item._key, 'date')} 
                    style={compactInputStyle}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Editorial / Revista</label>
                  <input 
                    type="text"
                    value={item.publisher || ''} 
                    onChange={handleChange(item._key, 'publisher')} 
                    placeholder="Ej. Revista Tecnología"
                    style={compactInputStyle}
                  />
                </div>
                <div>
                  <label style={compactLabelStyle}>Enlace (URL)</label>
                  <input 
                    type="url"
                    value={item.link || ''} 
                    onChange={handleChange(item._key, 'link')} 
                    placeholder="https://doi.org/..."
                    style={compactInputStyle}
                  />
                </div>
              </div>
            ) : (
              // Vista resumen
              <div style={{ fontSize: '12px', color: '#475569' }}>
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ fontSize: '11px', color: '#4f46e5', textDecoration: 'none' }}
                  >
                    Ver publicación →
                  </a>
                )}
              </div>
            )}
          </div>
        ))}

        {isEditing && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <button
              onClick={addItem}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                background: '#f1f5f9',
                border: '1px dashed #cbd5e1',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <Plus size={14} /> Agregar Publicación
            </button>
          </div>
        )}

        {!isEditing && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>
            No hay publicaciones registradas. Presiona <strong>Editar</strong> para agregar tus publicaciones académicas.
          </div>
        )}
      </div>
    </EditableCard>
  );
};

// ============================================
// SECCIÓN IDIOMAS
// ============================================

const LanguagesSection = ({ data }) => {
  const { createLanguage, updateLanguage, deleteLanguage, refreshProfile } = useAlumniProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([]);
  const [snapshot, setSnapshot] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initial = data?.length > 0
      ? data.map(l => ({ 
          ...l, 
          _key: l.id,
          language: l.language || '',
          level: l.level || ''
        }))
      : [];
    setItems(initial);
    setSnapshot(initial);
  }, [data]);

  const handleChange = (key, field) => (e) =>
    setItems(prev => prev.map(i => i._key === key ? { ...i, [field]: e.target.value } : i));

  const addItem = () => {
    setItems(prev => [...prev, { 
      _key: Date.now(), 
      language: '', 
      level: 'A1' 
    }]);
  };

  const removeItem = async (key) => {
    const itemToRemove = items.find(i => i._key === key);
    if (itemToRemove.id) {
      try {
        setLoading(true);
        await deleteLanguage(itemToRemove.id);
        await refreshProfile();
      } catch (err) {
        console.error('Error deleting language:', err);
      } finally {
        setLoading(false);
      }
    }
    setItems(prev => prev.filter(i => i._key !== key));
  };

  const handleEdit = () => { setSnapshot(JSON.parse(JSON.stringify(items))); setIsEditing(true); };
  const handleCancel = () => { setItems(JSON.parse(JSON.stringify(snapshot))); setIsEditing(false); };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      for (const item of items) {
        const languageData = {
          language: item.language,
          level: item.level
        };

        if (item.id) {
          await updateLanguage(item.id, languageData);
        } else if (item.language) {
          await createLanguage(languageData);
        }
      }
      
      await refreshProfile();
      setSnapshot(JSON.parse(JSON.stringify(items)));
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving languages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mapeo de niveles para mostrar nombres más descriptivos
  const levelNames = {
    'A1': 'A1 - Principiante',
    'A2': 'A2 - Básico',
    'B1': 'B1 - Intermedio',
    'B2': 'B2 - Intermedio Alto',
    'C1': 'C1 - Avanzado',
    'C2': 'C2 - Nativo/Proficiency'
  };

  // Colores por nivel
  const levelColors = {
    'A1': '#fef3c7',
    'A2': '#fde68a',
    'B1': '#bbf7d0',
    'B2': '#86efac',
    'C1': '#a5f3fc',
    'C2': '#c4b5fd'
  };

  const levelTextColors = {
    'A1': '#92400e',
    'A2': '#b45309',
    'B1': '#166534',
    'B2': '#14532d',
    'C1': '#0e7490',
    'C2': '#5b21b6'
  };

  const compactLabelStyle = {
    fontSize: '11px',
    marginBottom: '2px',
    fontWeight: 500,
    color: '#64748b'
  };

  const compactInputStyle = {
    fontSize: '13px',
    padding: '6px 10px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    width: '100%'
  };

  const languagesList = [
    'Español', 'Inglés', 'Portugués', 'Francés', 'Italiano', 
    'Alemán', 'Chino Mandarín', 'Japonés', 'Coreano', 'Ruso',
    'Árabe', 'Holandés', 'Sueco', 'Polaco', 'Turco', 'Hebreo',
    'Hindi', 'Bengalí', 'Vietnamita', 'Tailandés'
  ];

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <EditableCard
      title="Idiomas"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      saveLabel={loading ? 'Guardando...' : 'Guardar'}
    >
      <div>
        {/* Vista de lista compacta cuando no está en edición */}
        {!isEditing && items.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {items.map((item) => (
              <div
                key={item._key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: levelColors[item.level] || '#f1f5f9',
                  borderRadius: '20px',
                  fontSize: '13px',
                  color: levelTextColors[item.level] || '#1e293b'
                }}
              >
                <strong>{item.language}</strong>
                <span style={{ fontSize: '11px', fontWeight: 500 }}>
                  {levelNames[item.level] || item.level}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Formulario de edición */}
        {isEditing && (
          <>
            {items.map((item) => (
              <div
                key={item._key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '10px',
                  marginBottom: '10px',
                  alignItems: 'flex-end',
                  padding: '8px',
                  background: '#fafafa',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <label style={compactLabelStyle}>Idioma</label>
                  <select 
                    value={item.language || ''} 
                    onChange={handleChange(item._key, 'language')}
                    style={compactInputStyle}
                  >
                    <option value="">Seleccionar idioma</option>
                    {languagesList.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={compactLabelStyle}>Nivel</label>
                  <select 
                    value={item.level || 'A1'} 
                    onChange={handleChange(item._key, 'level')}
                    style={compactInputStyle}
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>
                        {level} - {levelNames[level].split(' - ')[1]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  {items.length > 1 && (
                    <button 
                      onClick={() => removeItem(item._key)} 
                      style={{ 
                        color: '#ef4444', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2px'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
              <button
                onClick={addItem}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  background: '#f1f5f9',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} /> Agregar Idioma
              </button>
            </div>
          </>
        )}

        {!isEditing && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>
            No hay idiomas registrados. Presiona <strong>Editar</strong> para agregar tus idiomas.
          </div>
        )}

        {!isEditing && items.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#94a3b8' }}>
            Presiona <strong>Editar</strong> para modificar tus idiomas
          </div>
        )}
      </div>
    </EditableCard>
  );
};
export default ProfileForm;