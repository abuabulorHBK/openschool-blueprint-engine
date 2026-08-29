import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  Bell, 
  TrendingUp, 
  Building2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { submitNewsletterSubscription } from '../services/newsletter-service.js';

export function NewsletterModal({ isOpen, onClose }) {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('openschool_newsletter_email') || '';
    } catch {
      return '';
    }
  });

  const [preferences, setPreferences] = useState({
    costIndices: true,
    archetypes: true,
    companyNews: false
  });

  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      await submitNewsletterSubscription({
        email,
        source: 'Preferences Modal',
        preferences
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 1600);
    } catch {
      setStatus('idle');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)'
            }}>
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--text-main)' }}>
                Subscribe to Company & Industry Updates
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                No account needed to use OpenSchool. Opt in for intelligence.
              </p>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ padding: '6px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        {status === 'success' ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <CheckCircle2 size={28} />
            </div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
              Preferences Saved!
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', maxWidth: '340px' }}>
              We've updated your newsletter subscription. You can change your preferences anytime.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: '12.5px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldCheck size={18} style={{ color: '#10b981', flexShrink: 0 }} />
              <span>
                <strong>Zero Account Friction:</strong> OpenSchool Blueprint Engine stays completely unlocked without a login.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
                Your Work Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@firm.com or director@ministry.gov"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Topic Checkboxes */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                What would you like to receive?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={preferences.costIndices}
                    onChange={(e) => setPreferences({ ...preferences, costIndices: e.target.checked })}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TrendingUp size={14} color="#6366f1" />
                      Quarterly African Construction Cost Indices
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Updated local material multiplier & labor benchmarks across 12+ countries.
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={preferences.archetypes}
                    onChange={(e) => setPreferences({ ...preferences, archetypes: e.target.checked })}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={14} color="#06b6d4" />
                      New Modular Blueprint Archetypes & CAD Blocks
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      New templates for TVET, science labs, and solar micro-grids.
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={preferences.companyNews}
                    onChange={(e) => setPreferences({ ...preferences, companyNews: e.target.checked })}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} color="#f59e0b" />
                      Company Releases & Case Studies
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Announcements, donor deployment reports, and upcoming features.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Attribution note */}
            <div style={{ fontSize: '11.5px', color: 'var(--text-subtle)', lineHeight: '1.4', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <strong>OpenSchool Blueprint Engine™</strong> • 100% Free Educational Architecture Suite • Created by <strong>@cambridgeacademytutorsfreeknowledgeworld</strong> (<a href="mailto:cambridgeacademytutorstz@gmail.com" style={{ color: 'var(--text-muted)' }}>cambridgeacademytutorstz@gmail.com</a>).
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Saving...' : 'Save & Subscribe'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
