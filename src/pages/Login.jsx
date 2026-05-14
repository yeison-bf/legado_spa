import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '../features/auth';
import { authService } from '../shared/services/auth.service';
import '../App.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      console.log('Logging in...', data);
      await authService.login(data.email, data.password);
      
      const user = authService.getUser();
      // Redirigir segun el rol del token decodificado
      if (user?.role === 'ADMIN') {
        navigate('/dashboard', { state: { role: 'admin' } });
      } else {
        navigate('/dashboard', { state: { role: 'student' } });
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Error al iniciar sesion. Por favor verifica tus credenciales.');
    }
  };

  return (
    <div className="login-page">
      {/* Left Side: Image & Branding (70%) */}
      <div className="image-side">
        <div className="image-bg">
          <div className="image-overlay" />
          
          <div className="image-content">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '10px' }}></div>
                <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>LEGADO</span>
              </div>
            </div>

            <div style={{ maxWidth: '480px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' }}>
                Construye tu futuro junto a tu comunidad.
              </h2>
              <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: '1.6' }}>
                La plataforma exclusiva para egresados donde las conexiones y el crecimiento profesional nunca terminan.
              </p>
            </div>

            <div style={{ fontSize: '14px', opacity: 0.7 }}>
              © 2024 Legado Alumni Network. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form (30%) */}
      <div className="form-side">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Mobile Logo */}
          <div className="mobile-logo">
            <div style={{ width: '32px', height: '32px', backgroundColor: '#2563eb', borderRadius: '8px' }}></div>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>LEGADO</span>
          </div>

          <LoginForm onSubmit={handleLogin} />
          
          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            ¿Eres egresado y no tienes cuenta? <br />
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
