import React from 'react';

export const Card = ({ title, children, style = {} }) => (
  <div style={{ 
    backgroundColor: 'white', 
    padding: '24px', 
    borderRadius: '16px', 
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    marginBottom: '24px',
    ...style
  }}>
    {title && <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>{title}</h3>}
    {children}
  </div>
);

export const Tabs = ({ tabs, activeTab, onTabChange }) => (
  <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px' }}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        style={{
          padding: '12px 20px',
          fontSize: '15px',
          fontWeight: activeTab === tab.id ? '600' : '500',
          color: activeTab === tab.id ? '#2563eb' : '#64748b',
          backgroundColor: 'transparent',
          borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
          marginBottom: '-2px',
          transition: 'all 0.2s'
        }}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
