import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastProps> = ({ message, type, duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: '✅',
      bg: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
      border: '#81c784'
    },
    error: {
      icon: '❌',
      bg: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
      border: '#ef9a9a'
    },
    warning: {
      icon: '⚠️',
      bg: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
      border: '#ffcc80'
    },
    info: {
      icon: 'ℹ️',
      bg: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
      border: '#90caf9'
    }
  };

  const style = config[type];

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      animation: 'slideInRight 0.3s ease',
    }}>
      <div style={{
        background: style.bg,
        color: 'white',
        padding: '16px 24px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '450px',
        border: `1px solid ${style.border}`,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          fontSize: '28px',
          background: 'rgba(255,255,255,0.2)',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {style.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '14px' }}>
            {type === 'success' && 'Sucesso!'}
            {type === 'error' && 'Erro!'}
            {type === 'warning' && 'Atenção!'}
            {type === 'info' && 'Informação'}
          </div>
          <div style={{ fontSize: '13px', opacity: 0.95 }}>{message}</div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            opacity: 0.7,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Adicionar animação CSS global
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

export default ToastNotification;