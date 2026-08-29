import React, { useState } from 'react';
import { Plus, Minus, Package, RefreshCw, ChevronRight } from 'lucide-react';
import { 
  ROOM_TYPE_DEFINITIONS, 
  calculateDimensionsFromCapacity 
} from '../data/floor-area-ratios.js';
import { getDefaultEquipmentForRoomType } from '../data/equipment-catalog.js';

export function RoomPlanner({ rooms = [], onUpdateRooms, onNextStep, onNavigateToEquipment }) {
  const [globalAutoScale, setGlobalAutoScale] = useState(true);

  const handleAddRoom = () => {
    const typeKey = 'classroom';
    const def = ROOM_TYPE_DEFINITIONS[typeKey] || ROOM_TYPE_DEFINITIONS.classroom;
    const sameTypeCount = rooms.filter(r => r.type === typeKey).length + 1;

    const newRoom = {
      id: `rm-${typeKey}-${rooms.length + 1}-${Math.random().toString(36).substr(2, 5)}`,
      name: `${def.name} ${sameTypeCount}`,
      type: typeKey,
      width_m: def.defaultWidth,
      length_m: def.defaultLength,
      area_m2: def.defaultArea,
      capacity: def.defaultCapacity,
      equipment: getDefaultEquipmentForRoomType(typeKey, def.defaultCapacity)
    };

    onUpdateRooms([...rooms, newRoom]);
  };

  const handleUpdateCapacity = (roomId, newCapacity) => {
    const cap = Math.max(1, parseInt(newCapacity, 10) || 1);

    const updated = rooms.map(r => {
      if (r.id === roomId) {
        let next = { ...r, capacity: cap };

        if (globalAutoScale) {
          const dims = calculateDimensionsFromCapacity(r.type, cap, r.width_m, r.length_m);
          next = {
            ...next,
            width_m: dims.width_m,
            length_m: dims.length_m,
            area_m2: dims.area_m2
          };
        }

        if (next.equipment) {
          next.equipment = next.equipment.map(eq => {
            if (eq.id.includes('desk-chair') || eq.id.includes('lab-stool') || eq.id.includes('drafting-table')) {
              return { ...eq, quantity: cap };
            }
            return eq;
          });
        }
        return next;
      }
      return r;
    });

    onUpdateRooms(updated);
  };

  const handleDeltaCapacity = (room, delta) => {
    const current = room.capacity || 40;
    handleUpdateCapacity(room.id, Math.max(1, current + delta));
  };

  const totalAllocatedSpace = rooms.reduce((acc, r) => acc + (r.area_m2 || 0), 0).toLocaleString();

  return (
    <main style={{ padding: '40px 24px', width: '100%' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Canvas Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '40px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)', margin: 0 }}>Room Inventory</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '800px' }}>
              Allocate spatial requirements and capacities across the campus blueprint. Use auto-resize to let the engine optimize dimensions based on standard per-student square footage.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                Auto-Resize {globalAutoScale ? 'Active' : 'Inactive'}
              </span>
              <div 
                className="theme-switch" 
                onClick={() => setGlobalAutoScale(!globalAutoScale)}
                data-checked={globalAutoScale}
              >
                <div className="theme-switch-slider"></div>
              </div>
            </label>
            <button 
              onClick={handleAddRoom}
              className="btn btn-secondary"
              style={{ padding: '12px 24px', gap: '8px' }}
            >
              <Plus size={18} />
              <span>Add Room</span>
            </button>
          </div>
        </div>

        {/* Blueprint Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '120px' }}>
          {rooms.map((room) => {
            const def = ROOM_TYPE_DEFINITIONS[room.type] || ROOM_TYPE_DEFINITIONS.classroom;
            const eqCount = room.equipment?.length || 0;
            const capacity = room.capacity || def.defaultCapacity;
            // SQ FT conversion for display
            const areaSqFt = Math.round((room.area_m2 || 0) * 10.7639).toLocaleString();

            return (
              <article key={room.id} className="glass-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>{room.name}</h3>
                      <span className="badge">
                        {def.category || 'Instructional'}
                      </span>
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {def.name} • Floor 1
                    </p>
                  </div>
                  <button 
                    onClick={() => onNavigateToEquipment(room.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '8px' }}
                  >
                    <Package size={16} />
                    <span>{eqCount} Items</span>
                  </button>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '24px', 
                  background: 'rgba(0,0,0,0.02)', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  border: '1px solid var(--border-color)' 
                }}>
                  {/* Capacity Control */}
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
                      Capacity
                    </span>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      background: 'var(--bg-surface)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '12px', 
                      padding: '8px', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)' 
                    }}>
                      <button 
                        onClick={() => handleDeltaCapacity(room, -1)}
                        style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        aria-label="Decrease capacity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="number-mono" style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', width: '48px', textAlign: 'center' }}>
                        {capacity}
                      </span>
                      <button 
                        onClick={() => handleDeltaCapacity(room, +1)}
                        style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        aria-label="Increase capacity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Dimensions Display */}
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
                      Dimensions {globalAutoScale ? '(Auto)' : '(Manual)'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span className="number-mono" style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                        {areaSqFt}
                      </span>
                      <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>sq ft</span>
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-subtle)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RefreshCw size={12} />
                      Optimized for {capacity} students
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar (Fixed) */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: 'var(--bg-card)', 
        backdropFilter: 'blur(24px)', 
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border-color)', 
        padding: '24px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 30, 
        boxShadow: '0 -10px 40px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)' }}>Total Allocated Space:</span>
          <span className="number-mono" style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>{totalAllocatedSpace} m²</span>
        </div>
        <button 
          onClick={onNextStep}
          className="btn btn-primary"
          style={{ gap: '8px' }}
        >
          <span>Proceed to Equipment Catalog</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </main>
  );
}
