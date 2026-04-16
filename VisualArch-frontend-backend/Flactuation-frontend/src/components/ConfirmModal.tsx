import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean; // красная кнопка подтверждения = danger=true
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Подтвердить',
  danger = false,
}: ConfirmModalProps) => {
  // Закрытие по ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        animation: 'modalBackdropIn 0.25s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '40px 48px',
          maxWidth: 420,
          width: '90%',
          fontFamily: '"Space Mono", monospace',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
          animation: 'modalPanelIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >

        {/* Заголовок */}
        <div style={{
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: 4,
          marginBottom: 16,
          textTransform: 'uppercase',
        }}>
          // CONFIRM
        </div>
        <h2 style={{
          margin: '0 0 12px',
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 300,
          fontSize: '1.5rem',
          color: '#fff',
        }}>
          {title}
        </h2>
        <p style={{
          margin: '0 0 36px',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.7,
        }}>
          {message}
        </p>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '13px 0',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.75rem',
              letterSpacing: 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            ОТМЕНА
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            style={{
              flex: 1,
              padding: '13px 0',
              background: danger ? 'rgba(255,20,100,0.9)' : '#fff',
              border: 'none',
              color: danger ? '#fff' : '#000',
              cursor: 'pointer',
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {confirmLabel.toUpperCase()}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
