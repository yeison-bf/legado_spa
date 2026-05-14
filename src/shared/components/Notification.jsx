import React, { useState, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {createPortal(
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <AnimatePresence>
            {notifications.map(n => (
              <NotificationItem 
                key={n.id} 
                notification={n} 
                onClose={() => removeNotification(n.id)} 
              />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
};

const NotificationItem = ({ notification, onClose }) => {
  const { message, type } = notification;

  const config = {
    success: { icon: CheckCircle, color: '#10b981', bg: '#ecfdf5', border: '#d1fae5' },
    error: { icon: AlertCircle, color: '#ef4444', bg: '#fef2f2', border: '#fee2e2' },
    warning: { icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7' },
    info: { icon: Info, color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe' },
  }[type] || config.info;

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '16px 20px', borderRadius: '16px',
        backgroundColor: 'white', border: `1px solid ${config.border}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        minWidth: '320px', maxWidth: '450px',
        position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px',
        backgroundColor: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: config.color, flexShrink: 0
      }}>
        <Icon size={22} />
      </div>
      
      <div style={{ flexGrow: 1 }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
          {message}
        </p>
      </div>

      <button 
        onClick={onClose}
        style={{
          background: 'none', border: 'none', color: '#94a3b8',
          cursor: 'pointer', padding: '4px', display: 'flex'
        }}
      >
        <X size={18} />
      </button>

      {/* Progress Bar */}
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: 4, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: 0, left: 0, height: '3px',
          backgroundColor: config.color, opacity: 0.3
        }}
      />
    </motion.div>
  );
};
