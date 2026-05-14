import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, GraduationCap, Briefcase, Award, TrendingUp, Globe } from 'lucide-react';
import { useInstitutionStats } from '../../alumni';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const InstitutionDashboard = () => {
  const { stats, loading, error } = useInstitutionStats();

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Cargando estadísticas...</div>;
  if (error) return <div style={{ padding: '40px', color: '#ef4444', textAlign: 'center' }}>Error: {error}</div>;
  if (!stats) return null;

  const summaryCards = [
    { title: 'Total Egresados', value: stats.totalAlumni, icon: Users, color: '#2563eb' },
    { title: 'Profesionales', value: stats.professionals, icon: Award, color: '#10b981' },
    { title: 'Con Experiencia', value: stats.withExperience, icon: Briefcase, color: '#f59e0b' },
    { title: 'Trabajando Hoy', value: stats.currentlyWorking, icon: TrendingUp, color: '#06b6d4' },
    { title: 'Políglotas (2+)', value: stats.polyglots, icon: Globe, color: '#8b5cf6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Resumen Superior */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {summaryCards.map((card, idx) => (
          <div key={idx} style={{ 
            backgroundColor: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', backgroundColor: `${card.color}10`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color
            }}>
              <card.icon size={28} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{card.title}</p>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        
        {/* Distribución por Nivel de Estudio */}
        <div style={{ 
          backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <TrendingUp size={20} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>Distribución por Nivel</h3>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.levelDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proporción de Empleabilidad */}
        <div style={{ 
          backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ margin: '0 0 32px', fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>Estado Laboral</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Trabajando', value: stats.currentlyWorking },
                    { name: 'En Búsqueda/Otros', value: stats.totalAlumni - stats.currentlyWorking },
                  ]}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#06b6d4" />
                  <Cell fill="#e2e8f0" />
                </Pie>
                <Tooltip />
                <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Programas con más Egresados */}
        <div style={{ 
          backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <GraduationCap size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>Top Programas</h3>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Media Técnica', count: stats.totalAlumni * 0.4 },
                { name: 'Académica', count: stats.totalAlumni * 0.3 },
                { name: 'Sabatina', count: stats.totalAlumni * 0.2 },
                { name: 'Nocturna', count: stats.totalAlumni * 0.1 },
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 600 }} width={120} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de Idiomas */}
        <div style={{ 
          backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          gridColumn: '1 / -1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <Globe size={20} color="#8b5cf6" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>Idiomas más Hablados</h3>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.languageDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="language" type="category" axisLine={false} tickLine={false} tick={{ fill: '#1e293b', fontSize: 13, fontWeight: 600 }} width={100} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstitutionDashboard;
