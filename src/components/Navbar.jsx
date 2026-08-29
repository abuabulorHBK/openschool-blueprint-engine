import React from 'react';
import { 
  Compass, 
  FolderOpen, 
  Moon, 
  Sun, 
  FileDown,
  Bell
} from 'lucide-react';
import { AFRICAN_COUNTRIES } from '../data/african-infrastructure';
import { CURRENCIES } from '../data/currencies';

export function Navbar({ 
  schoolConfig, 
  onUpdateConfig, 
  onOpenProjectModal, 
  onOpenNewsletterModal,
  onNavigateToExport,
  theme, 
  onToggleTheme 
}) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* Brand & Project Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
        }}>
          <Compass size={22} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.3px', margin: 0, color: 'var(--text-main)' }}>
              OpenSchool
            </h1>
            <span className="badge badge-primary" style={{ fontSize: '10.5px', padding: '2px 7px' }}>
              BLUEPRINT v1.0
            </span>
          </div>
          
          <input
            type="text"
            value={schoolConfig.name || ''}
            onChange={(e) => onUpdateConfig({ ...schoolConfig, name: e.target.value })}
            placeholder="School Project Name..."
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px dashed rgba(255,255,255,0.2)',
              color: 'var(--text-muted)',
              fontSize: '12.5px',
              padding: '2px 0',
              outline: 'none',
              width: '240px',
              fontWeight: 500
            }}
          />
        </div>
      </div>

      {/* Global Controls: Country, Currency, Save State, Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Country Quick Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <select
            className="form-select"
            value={schoolConfig.countryCode}
            aria-label="Select Country"
            onChange={(e) => {
              const code = e.target.value;
              const country = AFRICAN_COUNTRIES[code];
              onUpdateConfig({
                ...schoolConfig,
                countryCode: code,
                currency: country?.currency || 'USD'
              });
            }}
            style={{ 
              padding: '6px 10px', 
              fontSize: '13px', 
              width: '145px',
              height: '36px',
              fontWeight: 600
            }}
          >
            {Object.values(AFRICAN_COUNTRIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Quick Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <select
            className="form-select"
            value={schoolConfig.currency}
            onChange={(e) => onUpdateConfig({ ...schoolConfig, currency: e.target.value })}
            style={{ 
              padding: '6px 10px', 
              fontSize: '13px', 
              width: '125px',
              height: '36px',
              fontWeight: 600
            }}
          >
            {Object.values(CURRENCIES).map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} ({curr.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Newsletter / Updates */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenNewsletterModal}
          title="Subscribe to Cost Index & Blueprint Updates (No Account Required)"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Bell size={14} />
          <span>Updates</span>
        </button>

        {/* Projects / Template Manager */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenProjectModal}
          title="Manage Projects & Load Templates"
        >
          <FolderOpen size={15} />
          <span>Projects</span>
        </button>

        {/* Theme Toggle */}
        <div 
          className="theme-switch" 
          onClick={onToggleTheme}
          data-checked={theme === 'dark'}
          title="Toggle Light / Dark Mode"
        >
          <div className="theme-switch-slider">
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          </div>
        </div>

        {/* Instant Export Button */}
        <button
          className="btn btn-primary btn-sm"
          onClick={onNavigateToExport}
          title="Generate PDF Report, CAD & BoQ Exports"
        >
          <FileDown size={15} />
          <span>Export Project</span>
        </button>
      </div>
    </header>
  );
}
