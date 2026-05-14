import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../shared/services/auth.service';
import { Input, Button, Card, useNotification } from '../shared/components';
import { User, Mail, Lock, Building, UserCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    institutionId: ''
  });
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await authService.getInstitutions();
        setInstitutions(data);
      } catch (err) {
        console.error('Error fetching institutions:', err);
      }
    };
    fetchInstitutions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.institutionId) {
      showNotification('Por favor selecciona una institución', 'warning');
      return;
    }
    setLoading(true);
    try {
      await authService.register(form);
      showNotification('Registro exitoso. Ya puedes iniciar sesión', 'success');
      navigate('/login');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error al registrarse', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#f8fafc', padding: '20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '64px', height: '64px', backgroundColor: '#eff6ff', 
              borderRadius: '20px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 16px', color: '#2563eb'
            }}>
              <UserCircle size={32} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: '0 0 8px' }}>Crear Cuenta</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Regístrate para gestionar tu perfil profesional en LEGADO</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input 
                label="Nombre" 
                name="firstName" 
                icon={User} 
                value={form.firstName} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Apellido" 
                name="lastName" 
                icon={User} 
                value={form.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>

            <Input 
              label="Correo Electrónico" 
              name="email" 
              type="email" 
              icon={Mail} 
              value={form.email} 
              onChange={handleChange} 
              required 
            />

            <Input 
              label="Usuario / Documento" 
              name="username" 
              icon={UserCircle} 
              value={form.username} 
              onChange={handleChange} 
              required 
            />

            <Input 
              label="Contraseña" 
              name="password" 
              type="password" 
              icon={Lock} 
              value={form.password} 
              onChange={handleChange} 
              required 
            />

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                Institución Educativa
              </label>
              <div style={{ position: 'relative' }}>
                <Building size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <select
                  name="institutionId"
                  value={form.institutionId}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px',
                    border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none',
                    appearance: 'none', backgroundColor: 'white', cursor: 'pointer'
                  }}
                >
                  <option value="">Selecciona tu institución</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Registrarse ahora
            </Button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            ¿Ya tienes una cuenta? <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Inicia sesión</Link>
          </div>
        </Card>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
