import React from 'react';

export const Button = ({ children, type = 'button', variant = 'primary', onClick, icon: Icon, fullWidth = false, style = {}, size = 'md' }) => {
  const baseStyle = {
    padding: size === 'sm' ? '8px 16px' : '12px 24px',
    borderRadius: '12px',
    fontSize: size === 'sm' ? '14px' : '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: fullWidth ? '100%' : 'auto',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    ...style
  };

  const variants = {
    primary: {
      backgroundColor: '#2563eb',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
    },
    secondary: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
    },
    danger: {
      backgroundColor: 'transparent',
      color: '#ef4444',
    }
  };

  return (
    <button 
      type={type} 
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant] }}
      onMouseOver={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = '#1d4ed8';
      }}
      onMouseOut={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = '#2563eb';
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
      {children}
    </button>
  );
};

export const Input = ({ label, icon: Icon, ...props }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div style={{ marginBottom: '20px' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#475569',
          marginBottom: '8px'
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={18} style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: isFocused ? '#2563eb' : '#94a3b8',
            transition: 'color 0.2s'
          }} />
        )}
        <input 
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          style={{
            width: '100%',
            padding: `12px 12px 12px ${Icon ? '42px' : '12px'}`,
            borderRadius: '12px',
            border: `1px solid ${isFocused ? '#2563eb' : '#e2e8f0'}`,
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s',
            ...props.style
          }}
        />
      </div>
    </div>
  );
};
export const Tooltip = ({ text, children }) => {
  const [show, setShow] = React.useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          marginBottom: '8px', padding: '6px 10px', backgroundColor: '#1e293b',
          color: 'white', fontSize: '11px', fontWeight: '600', borderRadius: '6px',
          whiteSpace: 'nowrap', zIndex: 100, pointerEvents: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {text}
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            borderWidth: '5px', borderStyle: 'solid', borderColor: '#1e293b transparent transparent transparent'
          }} />
        </div>
      )}
    </div>
  );
};

export * from './Card';
export * from './Notification';
export { default as ConfirmDialog } from './ConfirmDialog';
