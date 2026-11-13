import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: '🎉',
      color: '#10b981',
      bg: '#d1fae5',
      buttonBg: '#10b981',
      buttonHover: '#059669'
    },
    warning: {
      icon: '⚠️',
      color: '#f59e0b',
      bg: '#fef3c7',
      buttonBg: '#f59e0b',
      buttonHover: '#d97706'
    },
    danger: {
      icon: '❌',
      color: '#ef4444',
      bg: '#fee2e2',
      buttonBg: '#ef4444',
      buttonHover: '#dc2626'
    },
    info: {
      icon: 'ℹ️',
      color: '#3b82f6',
      bg: '#dbeafe',
      buttonBg: '#3b82f6',
      buttonHover: '#2563eb'
    }
  };

  const style = config[type];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '400px',
        overflow: 'hidden',
        animation: 'scaleIn 0.2s ease',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}>
        {/* Cabeçalho */}
        <div style={{
          padding: '24px',
          textAlign: 'center',
          background: style.bg
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '12px'
          }}>
            {style.icon}
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: style.color,
            margin: 0
          }}>
            {title}
          </h3>
        </div>

        {/* Mensagem */}
        <div style={{
          padding: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#374151',
            fontSize: '15px',
            lineHeight: '1.5',
            margin: 0
          }}>
            {message}
          </p>
        </div>

        {/* Botões */}
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '0 24px 24px 24px'
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: '#4b5563',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px',
              background: style.buttonBg,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: 'white',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = style.buttonHover}
            onMouseLeave={(e) => e.currentTarget.style.background = style.buttonBg}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;