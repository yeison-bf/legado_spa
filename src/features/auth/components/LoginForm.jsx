import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../../shared/components';

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          backgroundColor: '#eff6ff',
          marginBottom: '16px',
          color: '#2563eb'
        }}>
          <GraduationCap size={32} />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Bienvenido de nuevo</h1>
        <p style={{ color: '#64748b', fontSize: '15px' }}>Accede a la plataforma de egresados Legado</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Input 
          label="Usuario o correo electrónico"
          icon={User}
          type="text"
          placeholder="Ingrese su usuario o correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input 
          label="Contraseña"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" fullWidth icon={ArrowRight}>
          Iniciar Sesión
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          ¿No tienes una cuenta? {' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: '600' }}>Regístrate aquí</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
