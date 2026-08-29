import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  ChevronRight, 
  X,
  PlusCircle
} from 'lucide-react';
import { MASTER_EQUIPMENT_ITEMS, EQUIPMENT_CATEGORIES } from '../data/equipment-catalog';
import { calculateEquipmentUnitPriceUSD, getActiveModifiers } from '../engine/cost-calculator';

export function EquipmentCatalog({ 
  rooms = [], 
  onUpdateRooms, 
  schoolConfig, 
  selectedRoomIdFilter,
  onNextStep 
}) {
  const [activeRoomId, setActiveRoomId] = useState(selectedRoomIdFilter || 'all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [masterSearchQuery, setMasterSearchQuery] = useState('');
  const [masterCategory, setMasterCategory] = useState('all');
  const [masterTargetRoomId, setMasterTargetRoomId] = useState('');
  const [isAddingCustomModalOpen, setIsAddingCustomModalOpen] = useState(false);
  const [customItem, setCustomItem] = useState({
    name: '',
    spec: '',
    category: 'furniture',
    basePriceUSD: 50,
    quantity: 1,
    unit: 'piece',
    roomId: rooms[0]?.id || ''
  });

  const modifiers = getActiveModifiers(schoolConfig);

  // Handle quantity changes for a room item
  const handleQuantityChange = (roomId, instanceId, newQty) => {
    const qty = Math.max(0, parseInt(newQty, 10) || 0);
    const updated = rooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          equipment: (r.equipment || [])
            .map(eq => eq.instanceId === instanceId ? { ...eq, quantity: qty } : eq)
            .filter(eq => eq.quantity > 0)
        };
      }
      return r;
    });
    onUpdateRooms(updated);
  };

  // Delete item from room
  const handleDeleteItem = (roomId, instanceId) => {
    const updated = rooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          equipment: (r.equipment || []).filter(eq => eq.instanceId !== instanceId)
        };
      }
      return r;
    });
    onUpdateRooms(updated);
  };

  // Add item from Master Catalog to current room
  const handleAddMasterItemToRoom = (masterItem, targetRoomId) => {
    const targetId = targetRoomId || (activeRoomId === 'all' ? rooms[0]?.id : activeRoomId);
    if (!targetId) return;

    const newItem = {
      ...masterItem,
      quantity: 1,
      instanceId: `${masterItem.id}-${Math.random().toString(36).substr(2, 7)}`
    };

    const updated = rooms.map(r => {
      if (r.id === targetId) {
        return {
          ...r,
          equipment: [...(r.equipment || []), newItem]
        };
      }
      return r;
    });
    onUpdateRooms(updated);
  };

  // Save custom added item
  const handleSaveCustomItem = (e) => {
    e.preventDefault();
    if (!customItem.name.trim() || !customItem.roomId) return;

    const targetRoomId = customItem.roomId;
    const newItem = {
      id: `custom-eq-${Math.random().toString(36).substr(2, 7)}`,
      name: customItem.name.trim(),
      spec: customItem.spec.trim() || 'Custom Client Specification',
      category: customItem.category,
      unit: customItem.unit || 'piece',
      basePriceUSD: parseFloat(customItem.basePriceUSD) || 10,
      quantity: parseInt(customItem.quantity, 10) || 1,
      source: 'Custom Client Specification',
      instanceId: `custom-inst-${Math.random().toString(36).substr(2, 7)}`
    };

    const updated = rooms.map(r => {
      if (r.id === targetRoomId) {
        return {
          ...r,
          equipment: [...(r.equipment || []), newItem]
        };
      }
      return r;
    });

    onUpdateRooms(updated);
    setIsAddingCustomModalOpen(false);
    setCustomItem({
      name: '',
      spec: '',
      category: 'furniture',
      basePriceUSD: 50,
      quantity: 1,
      unit: 'piece',
      roomId: rooms[0]?.id || ''
    });
  };

  // Filter items for display
  const itemsToDisplay = [];
  rooms.forEach(room => {
    if (activeRoomId !== 'all' && room.id !== activeRoomId) return;

    (room.equipment || []).forEach(eq => {
      if (selectedCategory !== 'all' && eq.category !== selectedCategory) return;
      if (searchQuery && !eq.name.toLowerCase().includes(searchQuery.toLowerCase()) && !eq.spec?.toLowerCase().includes(searchQuery.toLowerCase())) return;

      const unitAdjustedUSD = calculateEquipmentUnitPriceUSD(eq, modifiers);
      const totalUSD = unitAdjustedUSD * (eq.quantity || 1);

      itemsToDisplay.push({
        ...eq,
        roomId: room.id,
        roomName: room.name,
        unitAdjustedUSD,
        totalUSD
      });
    });
  });

  // Filter master catalog
  const filteredMasterItems = MASTER_EQUIPMENT_ITEMS.filter(mItem => {
    if (masterCategory !== 'all' && mItem.category !== masterCategory) return false;
    if (masterSearchQuery && !mItem.name.toLowerCase().includes(masterSearchQuery.toLowerCase()) && !mItem.spec?.toLowerCase().includes(masterSearchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>3. Equipment & Apparatus Catalog</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              China/India wholesale procurement baselines adjusted for African import tariffs, power protection, and climate modifiers.
            </p>
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddingCustomModalOpen(true)}
          >
            <Plus size={15} /> Add Custom Item
          </button>
        </div>

        {/* Search & Filtering Bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search equipment, specs, apparatus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Room Filter Dropdown */}
          <select
            className="form-select"
            value={activeRoomId}
            onChange={(e) => setActiveRoomId(e.target.value)}
            style={{ width: '220px' }}
          >
            <option value="all">All Rooms ({rooms.length})</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Categories</option>
            {Object.entries(EQUIPMENT_CATEGORIES).map(([catKey, label]) => (
              <option key={catKey} value={catKey}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment Table / List */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Item & Specification</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Room Allocation</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Unit Cost (USD / Adj)</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', width: '120px' }}>Quantity</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Total (USD)</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemsToDisplay.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No equipment found matching criteria.
                  </td>
                </tr>
              ) : (
                itemsToDisplay.map((item, idx) => (
                  <tr 
                    key={item.instanceId || `${item.id}-${idx}`}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    {/* Item details */}
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '13.5px' }}>
                        {item.name}
                      </strong>
                      <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '400px' }}>
                        {item.spec}
                      </p>
                      <span className="badge badge-primary" style={{ fontSize: '10px', marginTop: '4px' }}>
                        {EQUIPMENT_CATEGORIES[item.category] || item.category}
                      </span>
                    </td>

                    {/* Room Name */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--accent-secondary)' }}>
                        {item.roomName}
                      </span>
                    </td>

                    {/* Unit Price */}
                    <td style={{ padding: '14px 16px' }}>
                      <div className="number-mono" style={{ fontWeight: '600' }}>
                        ${item.unitAdjustedUSD.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                        (Base: ${item.basePriceUSD || 0})
                      </div>
                    </td>

                    {/* Quantity Selector */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px' }}
                          onClick={() => handleQuantityChange(item.roomId, item.instanceId, (item.quantity || 1) - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-input number-mono"
                          value={item.quantity || 1}
                          onChange={(e) => handleQuantityChange(item.roomId, item.instanceId, e.target.value)}
                          style={{ width: '50px', textAlign: 'center', padding: '4px 6px' }}
                        />
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px' }}
                          onClick={() => handleQuantityChange(item.roomId, item.instanceId, (item.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Total USD */}
                    <td style={{ padding: '14px 16px' }}>
                      <strong className="number-mono" style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                        ${item.totalUSD.toFixed(2)}
                      </strong>
                    </td>

                    {/* Delete button */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDeleteItem(item.roomId, item.instanceId)}
                        style={{ color: 'var(--accent-red)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Sourcing Catalog Browser */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 className="form-label" style={{ marginBottom: '16px' }}>
          + Add Apparatus from Master Sourcing Catalog
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {/* Master Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search master catalog..."
              value={masterSearchQuery}
              onChange={(e) => setMasterSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Master Category Filter */}
          <select
            className="form-select"
            value={masterCategory}
            onChange={(e) => setMasterCategory(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Categories</option>
            {Object.entries(EQUIPMENT_CATEGORIES).map(([catKey, label]) => (
              <option key={catKey} value={catKey}>{label}</option>
            ))}
          </select>
          
          {/* Master Target Room Picker */}
          <select
            className="form-select"
            value={masterTargetRoomId || (activeRoomId === 'all' ? rooms[0]?.id : activeRoomId)}
            onChange={(e) => setMasterTargetRoomId(e.target.value)}
            style={{ width: '220px' }}
          >
            {rooms.map(r => (
              <option key={r.id} value={r.id}>Add to: {r.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredMasterItems.map(mItem => (
            <div 
              key={mItem.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                gap: '8px'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>
                  {mItem.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {mItem.spec}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '9px' }}>{EQUIPMENT_CATEGORIES[mItem.category] || mItem.category}</span>
                  <span className="badge" style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)' }}>{mItem.source}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <div className="number-mono" style={{ fontSize: '12px', color: 'var(--accent-secondary)' }}>
                  ${mItem.basePriceUSD.toFixed(2)} / {mItem.unit}
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleAddMasterItemToRoom(mItem, masterTargetRoomId || (activeRoomId === 'all' ? rooms[0]?.id : activeRoomId))}
                  title="Add to target room"
                >
                  <Plus size={13} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Item Modal */}
      {isAddingCustomModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddingCustomModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Add Custom Equipment Item</h3>
              </div>
              <button 
                onClick={() => setIsAddingCustomModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Specialized Centrifuge System"
                  value={customItem.name}
                  onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Technical Specification</label>
                <textarea
                  className="form-input"
                  rows="2"
                  placeholder="e.g. 4000 RPM, digital timer, 8x15ml rotor tube"
                  value={customItem.spec}
                  onChange={(e) => setCustomItem({ ...customItem, spec: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={customItem.category}
                    onChange={(e) => setCustomItem({ ...customItem, category: e.target.value })}
                  >
                    {Object.entries(EQUIPMENT_CATEGORIES).map(([k, label]) => (
                      <option key={k} value={k}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Target Room</label>
                  <select
                    className="form-select"
                    value={customItem.roomId}
                    onChange={(e) => setCustomItem({ ...customItem, roomId: e.target.value })}
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Base Wholesale Cost (USD)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    className="form-input number-mono"
                    value={customItem.basePriceUSD}
                    onChange={(e) => setCustomItem({ ...customItem, basePriceUSD: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Initial Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input number-mono"
                    value={customItem.quantity}
                    onChange={(e) => setCustomItem({ ...customItem, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsAddingCustomModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Assign Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button className="btn btn-primary" onClick={onNextStep}>
          <span>Proceed to Teacher Planner</span>
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
