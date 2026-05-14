import React, { useState } from 'react';
import { LayoutDashboard, Users, UserCircle, Settings, LogOut, ShieldCheck, Search, GraduationCap, Megaphone, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { ProfileForm, useAlumniProfile, AlumniSearch, AlumniProfileDetail } from '../../alumni';
import { AlumniTable, InstitutionDashboard } from '../../admin';
import { PromotionModule } from '../../promotions';
import { authService } from '../../../shared/services/auth.service';

const DashboardMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getUser() || {};
  const { profile, loading, error } = useAlumniProfile();

  // Rol basado en profile.role.name (fuente de verdad)
  const roleName = profile?.role?.name || 'GRADUATE'; // default mientras carga
  const isAdmin = roleName === 'ADMINISTRATOR';

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedAlumniId, setSelectedAlumniId] = useState(null);

  // Menú inicial según rol — se calcula una sola vez cuando profile llega
  const defaultMenu = isAdmin ? 'dashboard' : 'home';
  const currentMenu = activeMenu ?? defaultMenu;

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
    setSelectedAlumniId(null); // Reset detail view when changing menu
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#64748b' }}>
      Cargando...
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#ef4444' }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <img
            src="public/logo.png"  // Cambia por la ruta de tu imagen
            alt="Logo LEGADO"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',  // o 'cover' dependiendo de cómo quieras que se vea
              borderRadius: '10px'   // opcional, si quieres mantener las esquinas redondeadas
            }}
          />
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>LEGADO</span>
        </div>

        {/* Avatar + nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
          {profile?.photoUrl
            ? <img src={profile.photoUrl} alt="avatar" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
            : <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </div>
          }
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {profile?.firstName} {profile?.lastName}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
              {isAdmin ? 'Administrador' : 'Egresado'}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          <SectionLabel>MENÚ PRINCIPAL</SectionLabel>

          {isAdmin ? (
            <>
              <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentMenu === 'dashboard'} onClick={() => handleMenuChange('dashboard')} />
              <NavItem icon={<Users size={20} />} label="Listado de Egresados" active={currentMenu === 'directory'} onClick={() => handleMenuChange('directory')} />
              <NavItem icon={<Search size={20} />} label="Buscador de Perfil" active={currentMenu === 'search'} onClick={() => handleMenuChange('search')} />
              <NavItem icon={<UserCircle size={20} />} label="Mi Perfil" active={currentMenu === 'profile'} onClick={() => handleMenuChange('profile')} />

            </>
          ) : (
            <>
              <NavItem icon={<Home size={20} />} label="Inicio" active={currentMenu === 'home'} onClick={() => handleMenuChange('home')} />
              <NavItem icon={<UserCircle size={20} />} label="Mi Perfil" active={currentMenu === 'profile'} onClick={() => handleMenuChange('profile')} />
              <NavItem icon={<Megaphone size={20} />} label="Promoción" active={currentMenu === 'promo'} onClick={() => handleMenuChange('promo')} />
            </>
          )}

          <SectionLabel style={{ marginTop: '24px' }}>CUENTA</SectionLabel>
        </nav>

        <Button
          variant="danger"
          onClick={() => authService.logout()}
          icon={LogOut}
          style={{ justifyContent: 'flex-start', padding: '12px' }}
        >
          Cerrar Sesión
        </Button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, padding: '40px', maxWidth: '100%' }}>

        {/* Header */}
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              {MENU_TITLES[currentMenu] || 'Panel'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              {isAdmin
                ? 'Supervisa y gestiona la base de datos de graduados.'
                : 'Mantén tu información actualizada para la comunidad.'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '700', color: '#1e293b' }}>
              {`${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || user.username}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: 2 }}>
              {isAdmin ? 'ADMINISTRADOR' : 'EGRESADO'}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {profile?.institution?.name}
            </div>
          </div>
        </header>

        {/* Vistas */}
        <div className="animate-fade-in">
          {/* ADMIN */}
          {isAdmin && currentMenu === 'dashboard' && <AdminDashboardView profile={profile} />}
          {isAdmin && currentMenu === 'directory' && (
            selectedAlumniId 
              ? <AlumniProfileDetail alumniId={selectedAlumniId} onBack={() => setSelectedAlumniId(null)} />
              : <AlumniTable institutionId={profile?.institution?.id} onSelectStudent={s => setSelectedAlumniId(s.id)} />
          )}
          {isAdmin && currentMenu === 'search' && (
            selectedAlumniId 
              ? <AlumniProfileDetail alumniId={selectedAlumniId} onBack={() => setSelectedAlumniId(null)} />
              : <AlumniSearch institutionId={profile?.institution?.id} onSelectAlumni={alumni => setSelectedAlumniId(alumni.id)} />
          )}
          {isAdmin && currentMenu === 'profile' && <ProfileForm />}

          {/* GRADUATE */}
          {!isAdmin && currentMenu === 'home' && <HomeView profile={profile} />}
          {!isAdmin && currentMenu === 'profile' && <ProfileForm />}
          {!isAdmin && currentMenu === 'overview' && <OverviewView />}
          {!isAdmin && currentMenu === 'promo' && <PromotionModule />}

          {/* Común */}
          {currentMenu === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

// ── Títulos del header según menú ──
const MENU_TITLES = {
  dashboard: 'Dashboard',
  directory: 'Listado de Egresados',
  search: 'Buscador de Perfil',
  home: 'Inicio',
  profile: 'Mi Perfil Profesional',
  overview: 'Resumen',
  promo: 'Promoción',
};

// ── Placeholders de vistas (reemplaza con tus componentes reales) ──
const Placeholder = ({ icon: Icon, title, subtitle }) => (
  <div style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
    <Icon size={48} style={{ color: '#2563eb', marginBottom: '16px' }} />
    <h2 style={{ margin: '0 0 8px', color: '#1e293b' }}>{title}</h2>
    <p style={{ margin: 0, color: '#64748b' }}>{subtitle}</p>
  </div>
);


const AdminDashboardView = ({ profile }) => (
  <InstitutionDashboard />
);
const SearchProfileView = () => (
  <AlumniSearch onSelectAlumni={alumni => console.log('Viewing alumni:', alumni)} />
);
const HomeView = ({ profile }) => (
  <Placeholder icon={Home} title={`Bienvenido, ${profile?.firstName || ''}!`} subtitle="Este es tu espacio en la comunidad de egresados." />
);
const OverviewView = () => (
  <Placeholder icon={LayoutDashboard} title="Resumen" subtitle="Próximamente: estadísticas de tu perfil." />
);
const PromoView = () => (
  <Placeholder icon={Megaphone} title="Promoción" subtitle="Próximamente: comparte tus logros con la comunidad." />
);
const SettingsView = () => (
  <Placeholder icon={Settings} title="Configuración" subtitle="Próximamente: ajustes de cuenta y privacidad." />
);

// ── Subcomponentes ──
const SectionLabel = ({ children }) => (
  <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '16px', paddingLeft: '12px' }}>
    {children}
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 16px', borderRadius: '12px',
      backgroundColor: active ? '#eff6ff' : 'transparent',
      color: active ? '#2563eb' : '#475569',
      fontWeight: active ? '700' : '500',
      marginBottom: '4px', cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
    onMouseOver={e => { if (!active) { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#1e293b'; } }}
    onMouseOut={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#475569'; } }}
  >
    {icon}
    <span style={{ fontSize: '15px' }}>{label}</span>
  </div>
);

export default DashboardMain;