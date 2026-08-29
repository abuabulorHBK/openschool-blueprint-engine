import React, { useState } from 'react';
import { 
  Package, 
  ShieldCheck, 
  Zap, 
  SunMedium, 
  Truck,
  Layers,
  LandPlot,
  Hammer,
  Banknote,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { calculateProjectFinancials } from '../engine/cost-calculator.js';
import { formatCurrency } from '../data/currencies.js';
import { ClassroomMaterialModal } from '../components/ClassroomMaterialModal.jsx';

export function CostDashboard({ schoolConfig, rooms = [] }) {
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const financials = calculateProjectFinancials(schoolConfig, rooms);
  const { totals, modifiers, currencyCode } = financials;

  const totalUSD = totals.grandTotalUSD || 1;
  const pctConstruction = Math.round((totals.constructionUSD / totalUSD) * 100);
  const pctEquipment = Math.round((totals.equipmentAdjustedUSD / totalUSD) * 100);
  const pctSite = Math.round((totals.sitePrepUSD / totalUSD) * 100);
  const pctContingency = Math.round((totals.contingencyUSD / totalUSD) * 100);

  const costPerSqM = totals.totalBuildingAreaM2 > 0 ? (totals.grandTotalLocal / totals.totalBuildingAreaM2) : 0;
  
  return (
    <>
      <aside className="sidebar-dashboard-wrapper">
        <div className="glass-panel glass-panel-glow" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', height: '100%', overflowY: 'auto' }}>
          
          {/* Dashboard Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                Cost Dashboard
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {modifiers.countryData.name} • {modifiers.countryData.currency}
              </p>
            </div>
            <span className="badge badge-primary">
              {currencyCode}
            </span>
          </div>

          {/* Bento Grid layout (Vertical Stack) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Total Budget Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '1px solid var(--border-glow)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="form-label" style={{ margin: 0 }}>Total Estimated Budget</span>
                <Banknote size={16} color="var(--accent-primary)" />
              </div>
              <div>
                <div className="number-mono" style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
                  {formatCurrency(totals.grandTotalLocal, currencyCode)}
                </div>
                <div className="number-mono" style={{ fontSize: '13px', color: 'var(--accent-secondary)', fontWeight: '600' }}>
                  ≈ {formatCurrency(totals.grandTotalUSD, 'USD')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Per Student: <strong style={{ color: 'var(--text-main)' }}>{formatCurrency(totals.costPerStudentLocal, currencyCode)}</strong>
                </span>
                {modifiers.inflationRate !== 0 && (
                  <span style={{ color: modifiers.inflationRate > 0 ? 'var(--accent-amber)' : 'var(--accent-green)', fontSize: '11px', fontWeight: '700' }}>
                    {modifiers.inflationRate > 0 ? `+${modifiers.inflationRate}%` : `${modifiers.inflationRate}%`} Esc.
                  </span>
                )}
              </div>
            </div>

            {/* Cost Per Area Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="form-label" style={{ margin: 0 }}>Cost per Sq M</span>
                <LandPlot size={16} color="var(--accent-secondary)" />
              </div>
              <div className="number-mono" style={{ fontSize: '19px', fontWeight: '700', color: 'var(--text-main)' }}>
                {formatCurrency(costPerSqM, currencyCode)}<span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/m²</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                Building Area: {totals.totalBuildingAreaM2} m²
              </div>
            </div>
          </div>

          {/* Quick Action: Inspect Classroom Material Schedule */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsMaterialModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              color: 'var(--accent-primary)',
              fontWeight: '700',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <FileSpreadsheet size={15} />
            <span>Inspect Classroom Materials (BoQ)</span>
          </button>

          {/* Cost Breakdown */}
          <div>
            <h3 style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '10px' }}>
              Project Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* Construction */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hammer size={14} color="var(--text-main)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>Construction</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-subtle)' }}>Materials & Labor</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="number-mono" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    {formatCurrency(totals.constructionUSD * (financials.currency.rateToUSD || 1), currencyCode)}
                  </div>
                  <div className="number-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{pctConstruction}%</div>
                </div>
              </div>

              {/* Equipment */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={14} color="var(--text-main)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>Equipment</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-subtle)' }}>Furniture & Labs</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="number-mono" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    {formatCurrency(totals.equipmentAdjustedUSD * (financials.currency.rateToUSD || 1), currencyCode)}
                  </div>
                  <div className="number-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{pctEquipment}%</div>
                </div>
              </div>

              {/* Site Prep */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={14} color="var(--text-main)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>Site Prep (6%)</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-subtle)' }}>Civil & Access</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="number-mono" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    {formatCurrency(totals.sitePrepUSD * (financials.currency.rateToUSD || 1), currencyCode)}
                  </div>
                  <div className="number-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{pctSite}%</div>
                </div>
              </div>

              {/* Contingency */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={14} color="var(--text-main)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>Contingency (10%)</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-subtle)' }}>Bankable Reserve</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="number-mono" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    {formatCurrency(totals.contingencyUSD * (financials.currency.rateToUSD || 1), currencyCode)}
                  </div>
                  <div className="number-mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{pctContingency}%</div>
                </div>
              </div>

            </div>
          </div>

          {/* Active Modifiers Pill Summary */}
          <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-subtle)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Applied Multipliers ({modifiers.combinedModifier}x)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                  <TrendingUp size={12} color="var(--accent-amber)" /> Inflation / Escalation
                </span>
                <span className="badge badge-warning">{modifiers.inflationModifier}x</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                  <SunMedium size={12} color="var(--accent-amber)" /> Climate ({modifiers.climate.name.split(' ')[0]})
                </span>
                <span className="badge badge-warning">{modifiers.climate.modifier}x</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                  <Zap size={12} color="var(--accent-secondary)" /> Power Grid
                </span>
                <span className="badge badge-primary">{modifiers.power.modifier}x</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                  <Truck size={12} color="var(--accent-green)" /> Procurement
                </span>
                <span className="badge badge-success">{modifiers.procurement.modifier}x</span>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* Classroom Material Schedule BoQ Modal */}
      <ClassroomMaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        schoolConfig={schoolConfig}
      />
    </>
  );
}
