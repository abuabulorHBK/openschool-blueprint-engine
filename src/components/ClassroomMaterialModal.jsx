import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Hammer, 
  CheckCircle2
} from 'lucide-react';
import { calculateClassroomMaterialSchedule } from '../engine/cost-calculator.js';
import { generateClassroomMaterialCSV } from '../engine/boq-generator.js';
import { formatCurrency } from '../data/currencies.js';
import { AFRICAN_COUNTRIES } from '../data/african-infrastructure.js';

export function ClassroomMaterialModal({ isOpen, onClose, schoolConfig }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArea, setSelectedArea] = useState(80);
  const [displayCurrency, setDisplayCurrency] = useState('local'); // 'local' or 'USD'

  if (!isOpen) return null;

  const schedule = calculateClassroomMaterialSchedule(schoolConfig, selectedArea);
  const country = AFRICAN_COUNTRIES[schoolConfig?.countryCode || 'TZ'] || AFRICAN_COUNTRIES.TZ;
  const currencyCode = schedule.currencyCode;
  
  const filteredItems = activeCategory === 'all' 
    ? schedule.items 
    : schedule.items.filter(item => item.category === activeCategory);

  const handleDownloadCSV = () => {
    const csvContent = generateClassroomMaterialCSV(schoolConfig, selectedArea);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Classroom_Material_Schedule_${country.code}_${selectedArea}m2.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
          border: '1px solid var(--border-glow)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
              border: '1px solid var(--border-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}>
              <Hammer size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  Standard Classroom Material Schedule & BoQ
                </h3>
                <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                  {country.name} Baseline
                </span>
                {schedule.inflationRate !== 0 && (
                  <span className={`badge ${schedule.inflationRate > 0 ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '11px' }}>
                    {schedule.inflationRate > 0 ? `+${schedule.inflationRate}% Inflation` : `${schedule.inflationRate}% Discount`}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Itemized empirical Bill of Quantities breakdown for 1 classroom unit ({country.regulatoryStandard})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Currency toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid var(--border-color)'
            }}>
              <button
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: displayCurrency === 'local' ? 'var(--accent-primary)' : 'transparent',
                  color: displayCurrency === 'local' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onClick={() => setDisplayCurrency('local')}
              >
                {currencyCode}
              </button>
              <button
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: displayCurrency === 'USD' ? 'var(--accent-primary)' : 'transparent',
                  color: displayCurrency === 'USD' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onClick={() => setDisplayCurrency('USD')}
              >
                USD ($)
              </button>
            </div>

            {/* CSV Download */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleDownloadCSV}
              title="Download Itemized Material Schedule CSV"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick KPI Summary Header */}
        <div style={{
          padding: '16px 24px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
          borderBottom: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {/* Total Cost Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              1-Classroom Unit Total ({selectedArea} m²)
            </span>
            <div className="number-mono" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-primary)' }}>
              {displayCurrency === 'local' 
                ? formatCurrency(schedule.grandTotalLocal, currencyCode)
                : formatCurrency(schedule.grandTotalUSD, 'USD')}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
              ≈ {displayCurrency === 'local' ? formatCurrency(schedule.grandTotalUSD, 'USD') : formatCurrency(schedule.grandTotalLocal, currencyCode)}
            </span>
          </div>

          {/* Unit Rate per m2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Unit Rate per m²
            </span>
            <div className="number-mono" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>
              {displayCurrency === 'local' 
                ? formatCurrency(schedule.costPerM2Local, currencyCode)
                : formatCurrency(schedule.costPerM2USD, 'USD')}
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/m²</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
              National guideline rate
            </span>
          </div>

          {/* Sizing Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Standard Room Sizing
            </span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
              {[56, 72, 80, 96].map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: selectedArea === area ? 'var(--accent-primary)' : 'var(--border-color)',
                    background: selectedArea === area ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: selectedArea === area ? 'var(--accent-primary)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {area} m²
                </button>
              ))}
            </div>
          </div>

          {/* Inflation Multiplier */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Escalation Multiplier
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="number-mono" style={{ fontSize: '18px', fontWeight: '700', color: schedule.inflationRate >= 0 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                {schedule.inflationModifier}x
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                ({schedule.inflationRate >= 0 ? `+${schedule.inflationRate}%` : `${schedule.inflationRate}%`})
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
              Applied to all unit materials
            </span>
          </div>
        </div>

        {/* Trade Category Progress Breakdown */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(255,255,255,0.01)'
        }}>
          <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', gap: '2px', marginBottom: '8px' }}>
            {schedule.categories.map((cat, i) => {
              const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
              return (
                <div
                  key={cat.id}
                  style={{
                    width: `${cat.percentage}%`,
                    background: colors[i % colors.length],
                    transition: 'all 0.3s ease'
                  }}
                  title={`${cat.name}: ${cat.percentage}% (${formatCurrency(displayCurrency === 'local' ? cat.totalLocal : cat.totalUSD, displayCurrency === 'local' ? currencyCode : 'USD')})`}
                />
              );
            })}
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '4px 10px',
                borderRadius: '99px',
                fontSize: '11.5px',
                fontWeight: '600',
                border: '1px solid',
                borderColor: activeCategory === 'all' ? 'var(--accent-primary)' : 'var(--border-color)',
                background: activeCategory === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activeCategory === 'all' ? 'var(--text-main)' : 'var(--text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              All Trades ({schedule.items.length})
            </button>
            {schedule.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '99px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  border: '1px solid',
                  borderColor: activeCategory === cat.id ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: activeCategory === cat.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: activeCategory === cat.id ? 'var(--text-main)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat.name.split('. ')[1] || cat.name} ({cat.percentage}%)
              </button>
            ))}
          </div>
        </div>

        {/* Itemized Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 8px', fontWeight: '700', width: '90px' }}>Code</th>
                <th style={{ padding: '10px 8px', fontWeight: '700' }}>Material / Description</th>
                <th style={{ padding: '10px 8px', fontWeight: '700' }}>Specification & Engineering Standards</th>
                <th style={{ padding: '10px 8px', fontWeight: '700', textAlign: 'center', width: '80px' }}>Unit</th>
                <th style={{ padding: '10px 8px', fontWeight: '700', textAlign: 'right', width: '90px' }}>Qty</th>
                <th style={{ padding: '10px 8px', fontWeight: '700', textAlign: 'right', width: '120px' }}>Unit Rate</th>
                <th style={{ padding: '10px 8px', fontWeight: '700', textAlign: 'right', width: '130px' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <tr 
                  key={item.itemCode || idx}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 8px', color: 'var(--accent-secondary)', fontWeight: '600' }}>
                    {item.itemCode}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.description}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>{item.notes}</div>
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {item.spec}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-subtle)' }}>
                    {item.unit}
                  </td>
                  <td className="number-mono" style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="number-mono" style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--text-muted)' }}>
                    {displayCurrency === 'local' 
                      ? formatCurrency(item.unitPriceLocal, currencyCode)
                      : formatCurrency(item.unitPriceUSD, 'USD')}
                  </td>
                  <td className="number-mono" style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '700', color: 'var(--text-main)' }}>
                    {displayCurrency === 'local' 
                      ? formatCurrency(item.totalLocal, currencyCode)
                      : formatCurrency(item.totalUSD, 'USD')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            <span>
              Ground-truth verified against <strong>{country.name}</strong> National Building Guidelines ({country.regulatoryStandard}).
            </span>
          </div>
          <div>
            100% Open-Access Sourcing Benchmark • Creator: @cambridgeacademytutorsfreeknowledgeworld
          </div>
        </div>

      </div>
    </div>
  );
}
