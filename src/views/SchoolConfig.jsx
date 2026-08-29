import React from 'react';
import { 
  SunMedium, 
  Zap, 
  Truck, 
  Shield, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { 
  AFRICAN_COUNTRIES, 
  CLIMATE_ZONES, 
  POWER_RELIABILITY_LEVELS, 
  PROCUREMENT_MODIFIERS,
  INFLATION_SCENARIOS
} from '../data/african-infrastructure.js';
import { getDefaultStaffingPlan } from '../data/cambridge-curriculum.js';
import { getActiveModifiers } from '../engine/cost-calculator.js';

export function SchoolConfig({ schoolConfig, onUpdateConfig, onNextStep }) {
  const currentCountry = AFRICAN_COUNTRIES[schoolConfig.countryCode] || AFRICAN_COUNTRIES.TZ;
  const modifiers = getActiveModifiers(schoolConfig);
  const activeInflation = typeof schoolConfig.inflationRate === 'number' ? schoolConfig.inflationRate : (modifiers.inflationRate || 0);

  const handleCountrySelect = (countryCode) => {
    const c = AFRICAN_COUNTRIES[countryCode];
    onUpdateConfig({
      ...schoolConfig,
      countryCode,
      currency: c.currency,
      climateZone: c.defaultClimate,
      powerReliability: c.defaultPower,
      procurementType: c.defaultProcurement,
      // Keep existing custom inflation or update to country default if requested
      inflationRate: typeof schoolConfig.inflationRate === 'number' ? schoolConfig.inflationRate : (c.defaultInflationRate || 0)
    });
  };

  const handleSetInflationScenario = (scenario) => {
    if (scenario.id === 'cpi') {
      onUpdateConfig({ ...schoolConfig, inflationRate: currentCountry.defaultInflationRate || 0 });
    } else {
      onUpdateConfig({ ...schoolConfig, inflationRate: scenario.rate });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      
      {/* Intro Header */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>
            {currentCountry.name} Destination Focus
          </span>
          <span className="badge badge-warning" style={{ padding: '4px 10px', fontSize: '12px' }}>
            Empirical 2026 Cost Benchmarks
          </span>
        </div>
        <h2 style={{ fontSize: '40px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)', margin: 0 }}>
          Initiate Project & Jurisdictional Settings
        </h2>
        <p style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Define campus parameters, host jurisdiction building codes, and dynamic economic inflation rates.
        </p>
      </div>

      {/* Glass Panel Form with decorative blob */}
      <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '256px',
          height: '256px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          filter: 'blur(4px)',
          pointerEvents: 'none',
          marginRight: '-40px',
          marginTop: '-40px',
          borderRadius: '9999px',
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbNTAL3o8igYL6p7JWDHLvoM5g6Dfj2ax73MhCFKGyJ_vJmagBhYj0PHwm4MmUcbceh8OmIAfvVSZUpjKRGbFypwKpDA5BkVJLTG1PXVE9ayC4lJJsR80sDuR1fjm_vxBhDKFAuc3_CWhd8SAETlvHN26_xTZ1W32OvtnwgE5Vx2zbUd5q0uwqkAqdxYe-cB_JjPHt5F6cS0ZL_SodbjXVIVh_ojtraSVG116YNCLwbLgHVgxXG22l')"
        }}></div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>School Name</label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              value={schoolConfig.name || ''}
              onChange={(e) => onUpdateConfig({ ...schoolConfig, name: e.target.value })}
              placeholder="e.g. Dar es Salaam International Academy"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Campus Location / Region</label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                value={schoolConfig.location || ''}
                onChange={(e) => onUpdateConfig({ ...schoolConfig, location: e.target.value })}
                placeholder="e.g. Kinondoni District, Dar es Salaam"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Curriculum Track</label>
              <select
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '15px',
                  outline: 'none',
                  appearance: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                value={schoolConfig.curriculumLevel || (schoolConfig.countryCode === 'TZ' ? 'necta_csee' : 'igcse')}
                onChange={(e) => {
                  const lvl = e.target.value;
                  onUpdateConfig({
                    ...schoolConfig,
                    curriculumLevel: lvl,
                    staffingPlan: getDefaultStaffingPlan(lvl, schoolConfig.totalStudents || 500, schoolConfig.rooms || [])
                  });
                }}
              >
                <optgroup label="🇹🇿 Tanzania National Curriculum (NECTA)" style={{ color: '#000', fontWeight: '700' }}>
                  <option value="necta_csee">NECTA O-Level / CSEE (Kidato cha 1–4 / Form 1–4)</option>
                  <option value="necta_acsee">NECTA A-Level / ACSEE (Kidato cha 5–6 / Form 5–6)</option>
                  <option value="necta_combined">NECTA Complete Secondary (Form 1–6 Comprehensive)</option>
                </optgroup>
                <optgroup label="🌍 Cambridge Assessment International Education" style={{ color: '#000', fontWeight: '700' }}>
                  <option value="igcse">Cambridge IGCSE (Grades 9–10)</option>
                  <option value="a_level">Cambridge International AS & A-Level (Grades 11–12)</option>
                  <option value="combined">Full Cambridge Secondary (Grades 7–12)</option>
                </optgroup>
                <optgroup label="🔬 Specialized & Applied Academies" style={{ color: '#000', fontWeight: '700' }}>
                  <option value="stem">STEM & Innovation Academy (Robotics & Science)</option>
                  <option value="arts_humanities">Humanities, Languages & Creative Arts College</option>
                  <option value="vocational_tech">Technical & Applied Vocational Secondary (VETA/TVET)</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Target Enrollment</label>
              <span className="number-mono" style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-secondary)' }}>
                {schoolConfig.totalStudents || 500} Students
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="50"
              value={schoolConfig.totalStudents || 500}
              onChange={(e) => onUpdateConfig({ ...schoolConfig, totalStudents: parseInt(e.target.value, 10) })}
              style={{ width: '100%', accentColor: 'var(--accent-secondary)', height: '8px', borderRadius: '8px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              <span>100</span>
              <span>3000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selection Grid */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Host African Country</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Automatically configures national building codes, currency, and baseline material indices.
            </p>
          </div>
          <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>9 Jurisdictions</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px' }}>
          {Object.values(AFRICAN_COUNTRIES).map((country) => {
            const isSelected = schoolConfig.countryCode === country.code;
            return (
              <div
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)' 
                    : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--border-glow)' : 'var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.25)' : 'none',
                  position: 'relative'
                }}
              >
                {country.code === 'TZ' && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '9.5px',
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    letterSpacing: '0.5px'
                  }}>
                    MAIN FOCUS
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '8px', 
                    background: isSelected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '13px',
                    letterSpacing: '0.5px'
                  }}>
                    {country.code}
                  </div>
                  <div>
                    <strong style={{ fontSize: '15px', display: 'block', color: 'var(--text-main)' }}>{country.name}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{country.currency} • CPI +{country.defaultInflationRate}%</span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '8px' }}>
                  Norm: {country.regulatoryBody.split(' ')[0]} • ${country.constructionCostPerM2.classroom}/m²
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Market Inflation & Cost Escalation Section */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                Economic Inflation & Material Escalation Adjustment
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                Calibrate accurate market inflation rates for {currentCountry.name} or adjust for rural delivery, commodity surges, or bulk subsidies.
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-warning" style={{ fontSize: '13px', padding: '6px 12px' }}>
              Multiplier: {modifiers.inflationModifier}x
            </span>
          </div>
        </div>

        {/* Inflation Slider & Direct Input */}
        <div style={{
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                Active Escalation Rate (%)
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Applied across all construction material items, BoQ tables, and equipment sourcing.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                step="0.1"
                min="-30"
                max="100"
                value={activeInflation}
                onChange={(e) => onUpdateConfig({ ...schoolConfig, inflationRate: parseFloat(e.target.value) || 0 })}
                style={{
                  width: '90px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '16px',
                  fontWeight: '700',
                  textAlign: 'right',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-muted)' }}>%</span>
            </div>
          </div>

          <input
            type="range"
            min="-20"
            max="50"
            step="0.5"
            value={activeInflation}
            onChange={(e) => onUpdateConfig({ ...schoolConfig, inflationRate: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--accent-amber)', height: '8px', borderRadius: '8px', cursor: 'pointer' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: 'var(--text-subtle)' }}>
            <span>-20% (Subsidized / Bulk)</span>
            <span>0% (Ground Baseline)</span>
            <span>+15% (Upcountry Transport)</span>
            <span>+50% (High FX Volatility)</span>
          </div>
        </div>

        {/* Quick Inflation Presets */}
        <div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
            Quick Inflation & Market Scenarios
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {INFLATION_SCENARIOS.map(sc => {
              const targetRate = sc.id === 'cpi' ? currentCountry.defaultInflationRate : sc.rate;
              const isMatch = Math.abs(activeInflation - targetRate) < 0.05;

              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleSetInflationScenario(sc)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: isMatch ? 'var(--accent-amber)' : 'var(--border-color)',
                    background: isMatch ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: isMatch ? 'var(--accent-amber)' : 'var(--text-main)' }}>
                      {sc.name}
                    </strong>
                    <span className="number-mono" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                      {targetRate >= 0 ? `+${targetRate}%` : `${targetRate}%`}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', lineHeight: 1.3 }}>
                    {sc.id === 'cpi' ? `${currentCountry.name} Official 2026 National CPI` : sc.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Infrastructure Modifiers (Retained & Connected) */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '24px' }}>
          Physical Infrastructure Modifiers & Regulatory Authority
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* Climate Modifier */}
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <SunMedium size={20} color="var(--accent-amber)" />
              <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Climate & Environment</strong>
              <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>
                {modifiers.climate.modifier}x
              </span>
            </div>
            <select
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '14px', marginBottom: '12px', outline: 'none' }}
              value={schoolConfig.climateZone || currentCountry.defaultClimate}
              onChange={(e) => onUpdateConfig({ ...schoolConfig, climateZone: e.target.value })}
            >
              {Object.values(CLIMATE_ZONES).map(z => (
                <option key={z.id} value={z.id} style={{ color: '#000' }}>{z.name} ({z.modifier}x)</option>
              ))}
            </select>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {modifiers.climate.description}
            </p>
          </div>

          {/* Power Reliability */}
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Zap size={20} color="var(--accent-secondary)" />
              <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Power Grid Reliability</strong>
              <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>
                {modifiers.power.modifier}x
              </span>
            </div>
            <select
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '14px', marginBottom: '12px', outline: 'none' }}
              value={schoolConfig.powerReliability || currentCountry.defaultPower}
              onChange={(e) => onUpdateConfig({ ...schoolConfig, powerReliability: e.target.value })}
            >
              {Object.values(POWER_RELIABILITY_LEVELS).map(p => (
                <option key={p.id} value={p.id} style={{ color: '#000' }}>{p.name} ({p.modifier}x)</option>
              ))}
            </select>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {modifiers.power.recommendation}
            </p>
          </div>

          {/* Procurement Dependency */}
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Truck size={20} color="var(--accent-green)" />
              <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Procurement & Tariffs</strong>
              <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                {modifiers.procurement.modifier}x
              </span>
            </div>
            <select
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '14px', marginBottom: '12px', outline: 'none' }}
              value={schoolConfig.procurementType || currentCountry.defaultProcurement}
              onChange={(e) => onUpdateConfig({ ...schoolConfig, procurementType: e.target.value })}
            >
              {Object.values(PROCUREMENT_MODIFIERS).map(m => (
                <option key={m.id} value={m.id} style={{ color: '#000' }}>{m.name} ({m.modifier}x)</option>
              ))}
            </select>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {modifiers.procurement.description}
            </p>
          </div>
        </div>

        {/* Regulatory Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px'
        }}>
          <Shield size={28} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              Official National Standard: {currentCountry.regulatoryBody}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Framework: {currentCountry.regulatoryStandard} • {currentCountry.notes}
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', marginBottom: '64px' }}>
        <button 
          className="btn btn-primary" 
          style={{ padding: '16px 32px', fontSize: '16px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}
          onClick={onNextStep}
        >
          <span>Proceed to Room Planner</span>
          <ChevronRight size={20} />
        </button>
      </div>

    </div>
  );
}
