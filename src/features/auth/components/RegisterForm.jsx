import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../../shared/components';

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    graduationYear: '',
    major: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        maxWidth: '550px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Link to="/login" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: '#64748b', 
        fontSize: '14px',
        marginBottom: '24px',
        textDecoration: 'none'
      }}>
        <ArrowLeft size={16} /> Volver al login
      </Link>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Registro de Egresado</h1>
        <p style={{ color: '#64748b', fontSize: '15px' }}>Únete a la comunidad de graduados y mantente conectado.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Input 
            label="Nombre Completo"
            icon={User}
            name="name"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input 
            label="Año de Graduación"
            icon={Calendar}
            type="number"
            name="graduationYear"
            placeholder="2023"
            value={formData.graduationYear}
            onChange={handleChange}
            required
          />
        </div>

        <Input 
          label="Correo Institucional"
          icon={Mail}
          type="email"
          name="email"
          placeholder="juan.perez@universidad.edu"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input 
          label="Carrera / Programa"
          icon={BookOpen}
          name="major"
          placeholder="Ingeniería de Sistemas"
          value={formData.major}
          onChange={handleChange}
          required
        />

        <Button type="submit" fullWidth icon={<UserPlus size={18} />}>
          Completar Registro
        </Button>
      </form>
    </motion.div>
  );
};

export default RegisterForm;
