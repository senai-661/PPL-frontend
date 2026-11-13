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
      icon: '🎉',
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      title: 'Sucesso!',
      emojiBg: '#34d399'
    },
    error: {
      icon: '😞',
      bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      title: 'Erro!',
      emojiBg: '#f87171'
    },
    warning: {
      icon: '⚠️',
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      title: 'Atenção!',
      emojiBg: '#fbbf24'
    },
    info: {
      icon: 'ℹ️',
      bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      title: 'Informação',
      emojiBg: '#60a5fa'
    }
  };

  const style = config[type];

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 9999,
      animation: 'slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), fadeOut 0.3s ease 3.7s forwards',
    }}>
      <div style={{
        background: style.bg,
        color: 'white',
        padding: '18px 24px',
        borderRadius: '20px',
        boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        minWidth: '340px',
        maxWidth: '480px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}>
        <div style={{
          fontSize: '32px',
          background: style.emojiBg,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          animation: 'bounce 0.5s ease'
        }}>
          {style.icon}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px', 
            marginBottom: '4px',
            letterSpacing: '-0.3px'
          }}>
            {style.title}
          </div>
          <div style={{ 
            fontSize: '13px', 
            opacity: 0.95,
            lineHeight: '1.4'
          }}>
            {message}
          </div>
        </div>
        
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Adicionar animações CSS global
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }
    
    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateX(100%) scale(0.8);
      }
    }
    
    @keyframes bounce {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(styleElement);
}

export default ToastNotification;