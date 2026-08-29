import React, { useState, useEffect } from 'react';
import { 
  LandPlot, 
  Trees, 
  Trophy, 
  ChevronRight
} from 'lucide-react';
import { calculateSiteRequirements } from '../engine/site-calculator';

export function SiteCalculator({ rooms = [], schoolConfig, onUpdateConfig, onNextStep }) {
  const [buildingStories, setBuildingStories] = useState(schoolConfig.siteOptions?.buildingStories ?? 1);
  const [includeFootballPitch, setIncludeFootballPitch] = useState(schoolConfig.siteOptions?.includeFootballPitch ?? true);
  const [includeAthleticsTrack, setIncludeAthleticsTrack] = useState(schoolConfig.siteOptions?.includeAthleticsTrack ?? true);
  const [includeBasketballCourt, setIncludeBasketballCourt] = useState(schoolConfig.siteOptions?.includeBasketballCourt ?? true);

  useEffect(() => {
    if (onUpdateConfig) {
      onUpdateConfig({
        siteOptions: {
          buildingStories,
          includeFootballPitch,
          includeAthleticsTrack,
          includeBasketballCourt
        }
      });
    }
  }, [buildingStories, includeFootballPitch, includeAthleticsTrack, includeBasketballCourt, onUpdateConfig]);

  const site = calculateSiteRequirements(rooms, schoolConfig.totalStudents || 500, {
    buildingStories,
    includeFootballPitch,
    includeAthleticsTrack,
    includeBasketballCourt
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>5. Campus Site & Land Allocation Calculator</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Civil engineering plot requirements, outdoor athletic pitches, building footprint coverage, and boundary setbacks.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Recommended Plot Size
            </div>
            <div className="number-mono" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-green)' }}>
              {site.landAreaHectares} Hectares ({site.landAreaAcres} Acres)
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
              {site.recommendedLandAreaM2.toLocaleString()} m² total land
            </div>
          </div>
        </div>

        {/* Footprint vs Green Allocation Progress Bar */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--accent-primary)' }}>■ Built Footprint ({site.ratios.groundCoverageRatio}%)</span>
            <span style={{ color: 'var(--accent-green)' }}>■ Outdoor Sports & Green ({site.ratios.sportsAndGreenRatio}%)</span>
            <span style={{ color: 'var(--accent-amber)' }}>■ Internal Roads & Parking ({site.ratios.circulationRatio}%)</span>
          </div>

          <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{ width: `${site.ratios.groundCoverageRatio}%`, background: 'var(--accent-primary)' }} />
            <div style={{ width: `${site.ratios.sportsAndGreenRatio}%`, background: 'var(--accent-green)' }} />
            <div style={{ width: `${site.ratios.circulationRatio}%`, background: 'var(--accent-amber)' }} />
          </div>
        </div>
      </div>

      {/* Building Topology & Stories */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 className="form-label" style={{ marginBottom: '16px' }}>Building Typology & Vertical Stories</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {[
            { stories: 1, label: 'Single Story Campus', desc: 'Sprawling pavilion layout, lowest structural cost, larger land footprint.' },
            { stories: 2, label: '2-Story Mixed Blocks', desc: 'Optimal balance of land efficiency, civil cost, and accessibility.' },
            { stories: 3, label: '3-Story High-Density', desc: 'Compact footprint for urban or constrained plots.' }
          ].map(t => (
            <div
              key={t.stories}
              onClick={() => setBuildingStories(t.stories)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: buildingStories === t.stories ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: buildingStories === t.stories ? 'var(--border-glow)' : 'var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <strong style={{ fontSize: '13.5px', display: 'block', marginBottom: '4px' }}>{t.label}</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Gross Floor Area: </span>
            <strong className="number-mono">{site.totalFloorAreaM2} m²</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Ground Footprint: </span>
            <strong className="number-mono">{site.buildingGroundFootprintM2} m²</strong>
          </div>
        </div>
      </div>

      {/* Outdoor Athletic & Sports Facilities */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 className="form-label" style={{ marginBottom: '16px' }}>Outdoor Sports & Athletic Infrastructure</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          
          {/* Football Pitch */}
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={16} color="var(--accent-green)" />
                <strong style={{ fontSize: '13px' }}>Regulation Football Pitch</strong>
              </div>
              <input
                type="checkbox"
                checked={includeFootballPitch}
                onChange={(e) => setIncludeFootballPitch(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-green)', cursor: 'pointer' }}
              />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              90m × 45m standard secondary school pitch with natural drainage (4,050 m²).
            </p>
          </div>

          {/* Athletics Track */}
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LandPlot size={16} color="var(--accent-secondary)" />
                <strong style={{ fontSize: '13px' }}>200m Running Track</strong>
              </div>
              <input
                type="checkbox"
                checked={includeAthleticsTrack}
                onChange={(e) => setIncludeAthleticsTrack(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-secondary)', cursor: 'pointer' }}
              />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              4-lane compacted cinder/synthetic sprint & middle-distance loop (3,200 m²).
            </p>
          </div>

          {/* Outdoor Basketball/Volleyball */}
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trees size={16} color="var(--accent-amber)" />
                <strong style={{ fontSize: '13px' }}>Outdoor Multi-Courts</strong>
              </div>
              <input
                type="checkbox"
                checked={includeBasketballCourt}
                onChange={(e) => setIncludeBasketballCourt(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
              />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Dual hardcourt pad for basketball, netball, and volleyball (800 m²).
            </p>
          </div>

        </div>
      </div>

      {/* Boundary Setback Norms */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 className="form-label" style={{ marginBottom: '16px' }}>Boundary Setbacks & Planning Regulations</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Front Setback (Road)</span>
            <div className="number-mono" style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px' }}>
              {site.setbacks.front} Meters
            </div>
          </div>

          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Side Setbacks</span>
            <div className="number-mono" style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px' }}>
              {site.setbacks.side} Meters
            </div>
          </div>

          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rear Setback</span>
            <div className="number-mono" style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px' }}>
              {site.setbacks.rear} Meters
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button className="btn btn-primary" onClick={onNextStep}>
          <span>Proceed to 2D Floor Plan</span>
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
