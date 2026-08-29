import React, { useState } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  BellRing
} from 'lucide-react';
import { submitNewsletterSubscription } from '../services/newsletter-service.js';

export function NewsletterFooter({ onOpenNewsletterModal }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [isSubscribed, setIsSubscribed] = useState(() => {
    try {
      return Boolean(localStorage.getItem('openschool_newsletter_subscribed'));
    } catch {
      return false;
    }
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      await submitNewsletterSubscription({
        email,
        source: 'Global Application Footer'
      });
      setStatus('success');
      setIsSubscribed(true);
    } catch {
      setStatus('idle');
    }
  };

  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      padding: '36px 24px 28px 24px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Top Pitch & Newsletter Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(6, 182, 212, 0.04) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px'
        }}>
          {/* Left info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-primary" style={{ fontSize: '11px', letterSpacing: '0.3px' }}>
                ZERO SIGN-UP REQUIRED
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: 'var(--text-subtle)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                fontWeight: 500
              }}>
                <ShieldCheck size={14} style={{ color: '#10b981' }} />
                Instant Open Access
              </span>
            </div>

            <h3 style={{ 
              margin: '0 0 6px 0', 
              fontSize: '17px', 
              fontWeight: '700', 
              color: 'var(--text-main)',
              letterSpacing: '-0.2px'
            }}>
              Want Company News & Construction Benchmarks?
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '13px', 
              color: 'var(--text-muted)', 
              lineHeight: '1.5' 
            }}>
              You do not need an account to plan schools or export tenders. Subscribe to our newsletter to receive quarterly cost index reports, new school archetypes, and product release updates.
            </p>
          </div>

          {/* Right subscribe form */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', mdJustifyContent: 'flex-end' }}>
            {isSubscribed || status === 'success' ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                color: '#10b981',
                fontWeight: 600,
                fontSize: '13.5px'
              }}>
                <CheckCircle2 size={20} />
                <div>
                  <div>You are subscribed to company updates!</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 400, opacity: 0.85 }}>
                    We'll email you when new cost indices & blueprints drop.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ 
                display: 'flex', 
                gap: '8px', 
                flexWrap: 'wrap',
                width: '100%',
                maxWidth: '440px'
              }}>
                <div style={{ position: 'relative', flex: '1 1 220px' }}>
                  <Mail size={16} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--text-subtle)' 
                  }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === 'loading'}
                  style={{
                    padding: '10px 18px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{status === 'loading' ? 'Joining...' : 'Get Updates'}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom credits, trademark & attribution links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '12px',
          color: 'var(--text-subtle)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>
              © {new Date().getFullYear()} <strong>OpenSchool Blueprint Engine™</strong> • Created by <strong>@cambridgeacademytutorsfreeknowledgeworld</strong>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              100% Free & Open Platform for educational development worldwide. Trademark is registered solely for author attribution. Contact: <a href="mailto:cambridgeacademytutorstz@gmail.com" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>cambridgeacademytutorstz@gmail.com</a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} />
              100% Free Architecture Suite
            </span>
            <button
              type="button"
              onClick={onOpenNewsletterModal}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'underline'
              }}
            >
              <BellRing size={12} />
              Newsletter Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
