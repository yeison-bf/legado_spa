import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning' }) => {
  if (!isOpen) return null;

  const content = (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            backgroundColor: 'white', borderRadius: '24px',
            width: '100%', maxWidth: '400px', padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}
        >
          <button 
            onClick={onCancel}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={20} />
          </button>

          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            backgroundColor: '#fffbeb', color: '#f59e0b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <AlertTriangle size={32} />
          </div>

          <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
            {title}
          </h3>
          
          <p style={{ margin: '0 0 32px', fontSize: '15px', color: '#64748b', lineHeight: '1.6' }}>
            {message}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                border: '1px solid #e2e8f0', backgroundColor: 'white',
                color: '#475569', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                border: 'none', backgroundColor: '#f59e0b',
                color: 'white', fontWeight: 600, cursor: 'pointer',
                boxShadow: `0 4px 6px -1px rgba(245, 158, 11, 0.25)`,
                transition: 'all 0.2s'
              }}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default ConfirmDialog;
