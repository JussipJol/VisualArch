import React, { useState } from 'react';
import { api } from '../../api/client';

interface ShareModalProps {
  projectId: string;
  projectName: string;
  onClose: () => void;
}

export const ShareModal = ({ projectId, projectName, onClose }: ShareModalProps) => {
  const [inviteUrl, setInviteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateLink = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post(`/projects/${projectId}/invite`);
      setInviteUrl(data.inviteUrl);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to generate link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.1)',
        width: 480,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: '"Space Mono", monospace',
        color: '#fff',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: 3, color: 'rgba(255,255,255,0.3)' }}>SHARE WORKSPACE</div>
            <div style={{ fontSize: '1rem', fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginTop: 4 }}>
              {projectName}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>
            ✕
          </button>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* Description */}
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', lineHeight: 1.8 }}>
          Generate a <strong style={{ color: '#fff' }}>7-day invite link</strong>. Anyone who opens it and accepts will get <strong style={{ color: '#fff' }}>Editor access</strong> to this workspace — they can view all stages and save changes.
        </p>

        {/* Generate button */}
        {!inviteUrl && (
          <button
            onClick={generateLink}
            disabled={loading}
            style={{
              background: loading ? 'transparent' : '#fff',
              color: loading ? 'rgba(255,255,255,0.4)' : '#000',
              border: `1px solid ${loading ? 'rgba(255,255,255,0.15)' : '#fff'}`,
              padding: '14px',
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: 2,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'GENERATING...' : '⟨/⟩ GENERATE INVITE LINK'}
          </button>
        )}

        {/* Invite link display */}
        {inviteUrl && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '12px 16px',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.5)',
              wordBreak: 'break-all',
              lineHeight: 1.6,
            }}>
              {inviteUrl}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={copyToClipboard}
                style={{
                  flex: 1,
                  background: copied ? 'rgba(16,185,129,0.1)' : '#fff',
                  color: copied ? '#10b981' : '#000',
                  border: `1px solid ${copied ? '#10b981' : '#fff'}`,
                  padding: '12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: 1,
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ COPIED!' : 'COPY LINK'}
              </button>
              <button
                onClick={generateLink}
                title="Generate a new link"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.4)',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  letterSpacing: 1,
                }}
              >
                ↻
              </button>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
              Link expires in 7 days · Editor access
            </div>
          </div>
        )}

        {error && (
          <div style={{ fontSize: '0.72rem', color: '#ff1493', background: 'rgba(255,20,147,0.05)', border: '1px solid rgba(255,20,147,0.15)', padding: '10px 14px' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
