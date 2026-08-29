import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Image as ImageIcon, 
  ChevronRight,
  Compass,
  FileCode,
  Box,
  Building2,
  Search
} from 'lucide-react';
import { 
  generateFloorPlanLayout, 
  generateDetailedRoomCAD,
  generateCampusMasterPlanLayout,
  generateIsometricCAD,
  renderFloorPlanSVGString, 
  THEME_CONFIG 
} from '../engine/floor-plan-generator.js';
import { generateFloorPlanDXF, downloadDXFFile } from '../engine/dxf-generator.js';
import { AFRICAN_COUNTRIES } from '../data/african-infrastructure.js';
import { ROOM_TYPE_DEFINITIONS } from '../data/floor-area-ratios.js';

export function FloorPlanVisualizer({ rooms = [], schoolConfig = {}, onNextStep }) {
  const [viewMode, setViewMode] = useState('wing'); // 'masterplan' | 'wing' | 'room_cad' | 'isometric'
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('blueprint'); // 'blueprint' | 'dark' | 'light'
  const [selectedTypology, setSelectedTypology] = useState('linear'); // 'linear' | 'courtyard'
  const [zoomLevel, setZoomLevel] = useState(1.0);
  
  // Layer Toggles
  const [layers, setLayers] = useState({
    structure: true,
    furniture: true,
    dimensions: true,
    mep: true,
    grid: true
  });

  const svgContainerRef = useRef(null);

  const siteOptions = schoolConfig.siteOptions || {};
  const includeFootballPitch = siteOptions.includeFootballPitch !== false;
  const includeAthleticsTrack = siteOptions.includeAthleticsTrack !== false;
  const includeBasketballCourt = siteOptions.includeBasketballCourt !== false;

  const countryData = AFRICAN_COUNTRIES[schoolConfig.countryCode] || AFRICAN_COUNTRIES.KE;
  const currentTheme = THEME_CONFIG[selectedTheme] || THEME_CONFIG.blueprint;

  // Selected room object for detailed CAD inspection
  const selectedRoom = rooms[selectedRoomIndex] || rooms[0] || {
    name: 'Standard Classroom 1',
    type: 'classroom',
    width_m: 10,
    length_m: 8,
    area_m2: 80,
    capacity: 40
  };

  const roomDef = ROOM_TYPE_DEFINITIONS[selectedRoom.type] || ROOM_TYPE_DEFINITIONS.classroom;

  // Calculate Layouts
  const wingLayout = generateFloorPlanLayout(rooms, { typology: selectedTypology, theme: selectedTheme });
  const detailedCAD = generateDetailedRoomCAD(selectedRoom, { theme: selectedTheme });
  const siteMasterplan = generateCampusMasterPlanLayout(schoolConfig, rooms, { theme: selectedTheme });
  const isometricCAD = generateIsometricCAD(selectedRoom, { theme: selectedTheme });

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.4));
  const handleResetZoom = () => setZoomLevel(1.0);

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Download SVG
  const handleDownloadSVG = () => {
    let svgString = '';
    if (viewMode === 'room_cad') {
      const { svgWidth, svgHeight, room } = detailedCAD;
      svgString = renderFloorPlanSVGString({ svgWidth, svgHeight, placedRooms: [room], theme: currentTheme }, `${schoolConfig.name || 'OpenSchool'} - ${room.name}`, countryData.name);
    } else {
      svgString = renderFloorPlanSVGString(wingLayout, schoolConfig.name || 'OpenSchool Campus', countryData.name);
    }

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(schoolConfig.name || 'OpenSchool-Campus').replace(/\s+/g, '_')}_${viewMode.toUpperCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download High-Res PNG via Canvas Rasterizer
  const handleDownloadPNG = () => {
    const layout = (viewMode === 'room_cad') 
      ? { svgWidth: detailedCAD.svgWidth, svgHeight: detailedCAD.svgHeight, placedRooms: [detailedCAD.room], theme: currentTheme }
      : wingLayout;

    const svgString = renderFloorPlanSVGString(layout, schoolConfig.name || 'OpenSchool Campus', countryData.name);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URLObject = window.URL || window.webkitURL || window;
    const blobURL = URLObject.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = layout.svgWidth * 2;
      canvas.height = layout.svgHeight * 2;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = currentTheme.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${(schoolConfig.name || 'OpenSchool-Campus').replace(/\s+/g, '_')}_Blueprint_HD.png`;
      a.click();
      URLObject.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  // Download AutoCAD DXF file
  const handleDownloadDXF = () => {
    const layout = (viewMode === 'room_cad')
      ? { svgWidth: detailedCAD.svgWidth, svgHeight: detailedCAD.svgHeight, placedRooms: [detailedCAD.room] }
      : wingLayout;

    const dxfString = generateFloorPlanDXF(layout, schoolConfig.name || 'OpenSchool Campus', countryData.name);
    downloadDXFFile(`${(schoolConfig.name || 'OpenSchool-Campus').replace(/\s+/g, '_')}_CAD.dxf`, dxfString);
  };

  // Handle clicking a room in Wing view to inspect it in detailed CAD
  const handleSelectRoomFromCanvas = (roomId) => {
    const idx = rooms.findIndex(r => r.id === roomId);
    if (idx !== -1) {
      setSelectedRoomIndex(idx);
      setViewMode('room_cad');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* CAD Master Header & View Switcher */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>6. Architectural CAD & Spatial Blueprint Engine</h2>
              <span className="badge badge-success" style={{ fontSize: '11px' }}>Free & Open CAD v2.0</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              Multi-scale parametric drafting: Campus site masterplan, multi-wing layouts, and detailed room interior furniture CAD.
            </p>
          </div>

          {/* Export Actions Toolbar */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadSVG} title="Download Scalable Vector Graphics">
              <Download size={14} color="var(--accent-primary)" />
              <span>SVG</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadPNG} title="Download High-Res 300 DPI Raster">
              <ImageIcon size={14} color="var(--accent-secondary)" />
              <span>PNG</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadDXF} title="Download AutoCAD DXF for LibreCAD / Revit / AutoCAD">
              <FileCode size={14} color="var(--accent-green)" />
              <span>DXF</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setViewMode('wing')}
            className={`btn btn-sm ${viewMode === 'wing' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Building2 size={14} />
            <span>Wing Plan</span>
          </button>

          <button
            onClick={() => setViewMode('room_cad')}
            className={`btn btn-sm ${viewMode === 'room_cad' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Search size={14} />
            <span>Room Interior ({selectedRoom.name})</span>
          </button>

          <button
            onClick={() => setViewMode('masterplan')}
            className={`btn btn-sm ${viewMode === 'masterplan' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Compass size={14} />
            <span>Campus Masterplan</span>
          </button>

          <button
            onClick={() => setViewMode('isometric')}
            className={`btn btn-sm ${viewMode === 'isometric' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Box size={14} />
            <span>Isometric 3D</span>
          </button>
        </div>

        {/* Secondary Control Bar: Room Selector, Typology, Layers, Theme */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginTop: '12px' }}>
          
          {/* Room Selector (Visible in Room CAD & Isometric modes) */}
          {(viewMode === 'room_cad' || viewMode === 'isometric') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>SELECT ROOM:</span>
              <select
                className="form-select"
                style={{ padding: '4px 10px', fontSize: '12.5px', width: '220px' }}
                value={selectedRoomIndex}
                onChange={(e) => setSelectedRoomIndex(parseInt(e.target.value, 10))}
              >
                {rooms.map((r, idx) => (
                  <option key={r.id || idx} value={idx}>
                    {r.name} ({r.width_m || 10}m × {r.length_m || 8}m)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Typology Selector (Visible in Wing mode) */}
          {viewMode === 'wing' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>CAMPUS LAYOUT:</span>
              <button
                onClick={() => setSelectedTypology('linear')}
                className={`btn btn-sm ${selectedTypology === 'linear' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '3px 9px', fontSize: '11.5px' }}
              >
                Linear Pavilion
              </button>
              <button
                onClick={() => setSelectedTypology('courtyard')}
                className={`btn btn-sm ${selectedTypology === 'courtyard' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '3px 9px', fontSize: '11.5px' }}
              >
                Courtyard Quadrangle
              </button>
            </div>
          )}

          {/* Interactive Layer Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>LAYERS:</span>
            {[
              { id: 'structure', label: 'Walls & Openings' },
              { id: 'furniture', label: 'Furniture CAD' },
              { id: 'dimensions', label: 'Dimensions' },
              { id: 'mep', label: 'Services & MEP' },
              { id: 'grid', label: '1m Grid' }
            ].map(l => (
              <button
                key={l.id}
                onClick={() => toggleLayer(l.id)}
                className={`badge ${layers[l.id] ? 'badge-primary' : 'badge-secondary'}`}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  padding: '3px 8px',
                  fontSize: '11px',
                  background: layers[l.id] ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.06)',
                  color: layers[l.id] ? '#818cf8' : 'var(--text-muted)'
                }}
              >
                {layers[l.id] ? '✓ ' : '✕ '} {l.label}
              </button>
            ))}
          </div>

          {/* Theme Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>THEME:</span>
            {Object.values(THEME_CONFIG).map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t.id)}
                className={`btn btn-sm ${selectedTheme === t.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '3px 8px', fontSize: '11px' }}
              >
                {t.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main CAD Viewport Canvas */}
      <div className="floor-plan-viewport" style={{ background: currentTheme.bg }}>
        
        {/* Floating Viewport Controls (Zoom In/Out, Reset, Scale) */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          gap: '6px',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '6px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)'
        }}>
          <button className="btn btn-secondary btn-sm" style={{ padding: '6px 8px' }} onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button className="btn btn-secondary btn-sm" style={{ padding: '6px 8px' }} onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <button className="btn btn-secondary btn-sm" style={{ padding: '6px 8px' }} onClick={handleResetZoom} title="Reset Scale">
            <RotateCcw size={14} />
          </button>
          <span className="number-mono" style={{ fontSize: '11.5px', alignSelf: 'center', padding: '0 6px', color: '#94a3b8' }}>
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* SVG Drawing Canvas Container */}
        <div className="svg-canvas-container" ref={svgContainerRef}>
          <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}>
            
            {/* ======================================================== */}
            {/* MODE 1: DETAILED CLASSROOM & LAB INTERIOR CAD (MICRO)     */}
            {/* ======================================================== */}
            {viewMode === 'room_cad' && (
              <svg
                viewBox={detailedCAD.viewBox}
                width={detailedCAD.svgWidth}
                height={detailedCAD.svgHeight}
                style={{ display: 'block', borderRadius: 'var(--radius-md)', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}
              >
                <defs>
                  <pattern id="gridMinorCAD" width="15" height="15" patternUnits="userSpaceOnUse">
                    <path d="M 15 0 L 0 0 0 15" fill="none" stroke={currentTheme.gridMinor} strokeWidth="0.5" />
                  </pattern>
                  <pattern id="gridMajorCAD" width="75" height="75" patternUnits="userSpaceOnUse">
                    <rect width="75" height="75" fill="url(#gridMinorCAD)" />
                    <path d="M 75 0 L 0 0 0 75" fill="none" stroke={currentTheme.gridMajor} strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Blueprint Background & 1m Grid */}
                <rect width="100%" height="100%" fill={currentTheme.bg} />
                {layers.grid && <rect width="100%" height="100%" fill="url(#gridMajorCAD)" />}

                {/* Outer Drawing Border */}
                <rect x="15" y="15" width={detailedCAD.svgWidth - 30} height={detailedCAD.svgHeight - 30} fill="none" stroke={currentTheme.borderGlow} strokeWidth="1.5" />

                {/* Architectural Title Block */}
                <text x="35" y="42" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700" fill={currentTheme.textColor}>
                  {detailedCAD.room.name.toUpperCase()} — INTERIOR ARCHITECTURAL CAD SCHEMATIC
                </text>
                <text x="35" y="58" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="500" fill={currentTheme.textMuted}>
                  Category: {roomDef.name} • Scale 1:25 (1m = 45px) • Standard: {countryData.regulatoryStandard}
                </text>

                {/* Dimension Witness Lines (Top & Left) */}
                {layers.dimensions && (
                  <g className="dimension-layer">
                    {/* Top Width Dimension Line */}
                    <line x1={detailedCAD.room.x} y1={detailedCAD.room.y - 25} x2={detailedCAD.room.x + detailedCAD.room.width} y2={detailedCAD.room.y - 25} stroke={currentTheme.dimColor} strokeWidth="1.2" />
                    <line x1={detailedCAD.room.x} y1={detailedCAD.room.y - 32} x2={detailedCAD.room.x} y2={detailedCAD.room.y - 18} stroke={currentTheme.dimColor} strokeWidth="1.5" />
                    <line x1={detailedCAD.room.x + detailedCAD.room.width} y1={detailedCAD.room.y - 32} x2={detailedCAD.room.x + detailedCAD.room.width} y2={detailedCAD.room.y - 18} stroke={currentTheme.dimColor} strokeWidth="1.5" />
                    <text x={detailedCAD.room.x + (detailedCAD.room.width / 2)} y={detailedCAD.room.y - 30} fontFamily="monospace" fontSize="12" fontWeight="700" fill={currentTheme.dimColor} textAnchor="middle">
                      {detailedCAD.room.widthM.toFixed(2)} m
                    </text>

                    {/* Left Length Dimension Line */}
                    <line x1={detailedCAD.room.x - 25} y1={detailedCAD.room.y} x2={detailedCAD.room.x - 25} y2={detailedCAD.room.y + detailedCAD.room.height} stroke={currentTheme.dimColor} strokeWidth="1.2" />
                    <line x1={detailedCAD.room.x - 32} y1={detailedCAD.room.y} x2={detailedCAD.room.x - 18} y2={detailedCAD.room.y} stroke={currentTheme.dimColor} strokeWidth="1.5" />
                    <line x1={detailedCAD.room.x - 32} y1={detailedCAD.room.y + detailedCAD.room.height} x2={detailedCAD.room.x - 18} y2={detailedCAD.room.y + detailedCAD.room.height} stroke={currentTheme.dimColor} strokeWidth="1.5" />
                    <text x={detailedCAD.room.x - 32} y={detailedCAD.room.y + (detailedCAD.room.height / 2)} fontFamily="monospace" fontSize="12" fontWeight="700" fill={currentTheme.dimColor} textAnchor="middle" transform={`rotate(-90 ${detailedCAD.room.x - 32} ${detailedCAD.room.y + (detailedCAD.room.height / 2)})`}>
                      {detailedCAD.room.lengthM.toFixed(2)} m
                    </text>
                  </g>
                )}

                {/* Structure Layer: Outer Double-Line Walls */}
                {layers.structure && (
                  <g className="structure-layer">
                    {/* Outer load-bearing wall */}
                    <rect
                      x={detailedCAD.room.x}
                      y={detailedCAD.room.y}
                      width={detailedCAD.room.width}
                      height={detailedCAD.room.height}
                      fill={currentTheme.wallFill}
                      stroke={currentTheme.wallStroke}
                      strokeWidth="3.5"
                      rx="3"
                    />

                    {/* Inner wall line */}
                    <rect
                      x={detailedCAD.room.x + detailedCAD.room.wallThick}
                      y={detailedCAD.room.y + detailedCAD.room.wallThick}
                      width={detailedCAD.room.width - (detailedCAD.room.wallThick * 2)}
                      height={detailedCAD.room.height - (detailedCAD.room.wallThick * 2)}
                      fill="none"
                      stroke={currentTheme.wallStroke}
                      strokeWidth="1.2"
                      strokeDasharray="4,2"
                    />

                    {/* Window Fenestrations with Glazing Lines (Left-hand light) */}
                    {detailedCAD.room.windows.map((win, wIdx) => (
                      <g key={wIdx}>
                        <rect x={win.x} y={detailedCAD.room.y - 3} width={win.width} height="6" fill={currentTheme.bg} stroke="none" />
                        <line x1={win.x} y1={detailedCAD.room.y} x2={win.x + win.width} y2={detailedCAD.room.y} stroke={currentTheme.windowStroke} strokeWidth="3.5" />
                        <line x1={win.x} y1={detailedCAD.room.y - 2} x2={win.x + win.width} y2={detailedCAD.room.y - 2} stroke={currentTheme.windowStroke} strokeWidth="1" />
                        <line x1={win.x} y1={detailedCAD.room.y + 2} x2={win.x + win.width} y2={detailedCAD.room.y + 2} stroke={currentTheme.windowStroke} strokeWidth="1" />
                      </g>
                    ))}

                    {/* Door Swing & Opening */}
                    <rect x={detailedCAD.room.door.x} y={detailedCAD.room.door.y - 4} width={detailedCAD.room.door.width} height="8" fill={currentTheme.bg} stroke="none" />
                    <line x1={detailedCAD.room.door.x} y1={detailedCAD.room.door.y} x2={detailedCAD.room.door.x} y2={detailedCAD.room.door.y - detailedCAD.room.door.width} stroke={currentTheme.doorStroke} strokeWidth="2.5" />
                    <path
                      d={`M ${detailedCAD.room.door.x} ${detailedCAD.room.door.y - detailedCAD.room.door.width} A ${detailedCAD.room.door.width} ${detailedCAD.room.door.width} 0 0 1 ${detailedCAD.room.door.x + detailedCAD.room.door.width} ${detailedCAD.room.door.y}`}
                      fill="none"
                      stroke={currentTheme.doorStroke}
                      strokeDasharray="3,3"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Furniture & Equipment CAD Layer */}
                {layers.furniture && (
                  <g className="furniture-layer">
                    {detailedCAD.room.furniture.map(item => {
                      if (item.type === 'ceiling_fan' && !layers.mep) return null;
                      if ((item.type === 'sink' || item.type === 'gas_tap' || item.type === 'safety_shower') && !layers.mep) return null;

                      if (item.radius) {
                        return (
                          <g key={item.id}>
                            <circle
                              cx={detailedCAD.room.x + item.x}
                              cy={detailedCAD.room.y + item.y}
                              r={item.radius}
                              fill={item.fill || currentTheme.furnitureFill}
                              stroke={item.stroke || currentTheme.furnitureStroke}
                              strokeWidth="1.5"
                            />
                            {item.label && (
                              <text
                                x={detailedCAD.room.x + item.x}
                                y={detailedCAD.room.y + item.y + item.radius + 10}
                                fontFamily="system-ui, sans-serif"
                                fontSize="8"
                                fill={currentTheme.textMuted}
                                textAnchor="middle"
                              >
                                {item.label}
                              </text>
                            )}
                          </g>
                        );
                      }

                      return (
                        <g key={item.id}>
                          <rect
                            x={detailedCAD.room.x + item.x}
                            y={detailedCAD.room.y + item.y}
                            width={item.width}
                            height={item.height}
                            fill={item.fill || currentTheme.furnitureFill}
                            stroke={item.stroke || currentTheme.furnitureStroke}
                            strokeWidth="1.5"
                            rx="2"
                          />
                          {item.label && item.width > 30 && (
                            <text
                              x={detailedCAD.room.x + item.x + (item.width / 2)}
                              y={detailedCAD.room.y + item.y + (item.height / 2) + 3}
                              fontFamily="system-ui, sans-serif"
                              fontSize={item.width > 80 ? "9" : "7.5"}
                              fontWeight="600"
                              fill={currentTheme.textColor}
                              textAnchor="middle"
                            >
                              {item.label}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* Footer Specifications Block */}
                <g transform={`translate(35, ${detailedCAD.svgHeight - 35})`}>
                  <rect x="0" y="0" width="90" height="4" fill={currentTheme.wallStroke} />
                  <rect x="90" y="0" width="90" height="4" fill={currentTheme.textMuted} />
                  <text x="0" y="16" fontFamily="monospace" fontSize="9.5" fill={currentTheme.textMuted}>0m</text>
                  <text x="90" y="16" fontFamily="monospace" fontSize="9.5" fill={currentTheme.textMuted}>2m</text>
                  <text x="180" y="16" fontFamily="monospace" fontSize="9.5" fill={currentTheme.textMuted}>4m</text>
                  <text x="240" y="14" fontFamily="system-ui, sans-serif" fontSize="10" fill={currentTheme.textMuted}>
                    Area: {detailedCAD.room.areaM2} m² • Capacity: {detailedCAD.room.capacity} Students • Ratio: {(detailedCAD.room.areaM2 / detailedCAD.room.capacity).toFixed(2)} m²/std
                  </text>
                </g>
              </svg>
            )}

            {/* ======================================================== */}
            {/* MODE 2: MULTI-WING BUILDING FLOOR PLAN (MESO)            */}
            {/* ======================================================== */}
            {viewMode === 'wing' && (
              <svg
                viewBox={wingLayout.viewBox}
                width={wingLayout.svgWidth}
                height={wingLayout.svgHeight}
                style={{ display: 'block', borderRadius: 'var(--radius-md)', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}
              >
                <defs>
                  <pattern id="gridMinorWing" width="14" height="14" patternUnits="userSpaceOnUse">
                    <path d="M 14 0 L 0 0 0 14" fill="none" stroke={currentTheme.gridMinor} strokeWidth="0.5" />
                  </pattern>
                  <pattern id="gridMajorWing" width="70" height="70" patternUnits="userSpaceOnUse">
                    <rect width="70" height="70" fill="url(#gridMinorWing)" />
                    <path d="M 70 0 L 0 0 0 70" fill="none" stroke={currentTheme.gridMajor} strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill={currentTheme.bg} />
                {layers.grid && <rect width="100%" height="100%" fill="url(#gridMajorWing)" />}

                <rect x="15" y="15" width={wingLayout.svgWidth - 30} height={wingLayout.svgHeight - 30} fill="none" stroke={currentTheme.borderGlow} strokeWidth="1.5" />

                {/* Header */}
                <text x="35" y="45" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="700" fill={currentTheme.textColor}>
                  {(schoolConfig.name || 'OpenSchool Campus').toUpperCase()} — MULTI-WING ARCHITECTURAL BLUEPRINT
                </text>
                <text x="35" y="65" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="500" fill={currentTheme.textMuted}>
                  Cambridge International Standards • Typology: {selectedTypology.toUpperCase()} • Scale 1:100 (1m = 14px)
                </text>

                {/* North Arrow */}
                <g transform={`translate(${wingLayout.svgWidth - 75}, 55)`}>
                  <circle cx="0" cy="0" r="18" fill="rgba(15, 23, 42, 0.8)" stroke={currentTheme.wallStroke} strokeWidth="1.5" />
                  <path d="M 0 -13 L 5 3 L -5 3 Z" fill={currentTheme.wallStroke} />
                  <text x="0" y="12" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="700" fill={currentTheme.textColor} textAnchor="middle">N</text>
                </g>

                {/* Placed Rooms */}
                <g className="rooms-layer">
                  {wingLayout.placedRooms.map(r => (
                    <g 
                      key={r.id} 
                      className="room-interactive-node"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectRoomFromCanvas(r.id)}
                    >
                      {/* Outer Wall */}
                      <rect
                        x={r.x}
                        y={r.y}
                        width={r.width}
                        height={r.height}
                        fill={r.fill}
                        stroke={currentTheme.wallStroke}
                        strokeWidth="3"
                        rx="2"
                      />

                      {/* Inner Wall Cavity */}
                      <rect
                        x={r.x + r.wallThick}
                        y={r.y + r.wallThick}
                        width={r.width - (r.wallThick * 2)}
                        height={r.height - (r.wallThick * 2)}
                        fill="none"
                        stroke={currentTheme.wallStroke}
                        strokeWidth="1.2"
                        strokeDasharray="3,2"
                      />

                      {/* Door Opening & Swing Arc */}
                      <rect x={r.door.x} y={r.door.y - 3} width={r.door.width} height="6" fill={currentTheme.bg} stroke="none" />
                      <path
                        d={`M ${r.door.x} ${r.door.y} A ${r.door.width} ${r.door.width} 0 0 1 ${r.door.x + r.door.width} ${r.door.y - r.door.width}`}
                        fill="none"
                        stroke={currentTheme.doorStroke}
                        strokeDasharray="2,2"
                        strokeWidth="1.5"
                      />

                      {/* Furniture CAD Layer inside Wing */}
                      {layers.furniture && (r.furniture || []).map(f => {
                        if (f.radius) {
                          return (
                            <circle
                              key={f.id}
                              cx={r.x + f.x}
                              cy={r.y + f.y}
                              r={Math.max(f.radius, 1.5)}
                              fill={f.fill || currentTheme.furnitureFill}
                              stroke={f.stroke || currentTheme.furnitureStroke}
                              strokeWidth="0.8"
                            />
                          );
                        }
                        return (
                          <rect
                            key={f.id}
                            x={r.x + f.x}
                            y={r.y + f.y}
                            width={Math.max(f.width, 2)}
                            height={Math.max(f.height, 2)}
                            fill={f.fill || currentTheme.furnitureFill}
                            stroke={f.stroke || currentTheme.furnitureStroke}
                            strokeWidth="0.8"
                            rx="1"
                          />
                        );
                      })}

                      {/* Room Labels & Metrics */}
                      <text x={r.x + (r.width / 2)} y={r.y + 20} fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="700" fill={currentTheme.textColor} textAnchor="middle">
                        {r.name}
                      </text>
                      <text x={r.x + (r.width / 2)} y={r.y + 36} fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="500" fill={currentTheme.textMuted} textAnchor="middle">
                        {r.widthM}m × {r.lengthM}m ({r.areaM2} m²)
                      </text>

                      {/* Student Capacity Pill */}
                      <g transform={`translate(${r.x + (r.width / 2) - 34}, ${r.y + 46})`}>
                        <rect width="68" height="16" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke={r.stroke} strokeWidth="1" />
                        <text x="34" y="11.5" fontFamily="system-ui, sans-serif" fontSize="8.5" fontWeight="600" fill={r.stroke} textAnchor="middle">
                          👥 {r.capacity} Stds
                        </text>
                      </g>
                    </g>
                  ))}
                </g>

                {/* Footer Scale Bar */}
                <g transform={`translate(35, ${wingLayout.svgHeight - 35})`}>
                  <rect x="0" y="0" width="70" height="4" fill={currentTheme.wallStroke} />
                  <rect x="70" y="0" width="70" height="4" fill={currentTheme.textMuted} />
                  <text x="0" y="16" fontFamily="monospace" fontSize="9" fill={currentTheme.textMuted}>0m</text>
                  <text x="70" y="16" fontFamily="monospace" fontSize="9" fill={currentTheme.textMuted}>5m</text>
                  <text x="140" y="16" fontFamily="monospace" fontSize="9" fill={currentTheme.textMuted}>10m</text>
                  <text x="220" y="12" fontFamily="system-ui, sans-serif" fontSize="9.5" fill={currentTheme.textMuted}>
                    Click any classroom to zoom into detailed interior CAD layout • OpenSchool Engine
                  </text>
                </g>
              </svg>
            )}

            {/* ======================================================== */}
            {/* MODE 3: CAMPUS SITE MASTERPLAN (MACRO)                    */}
            {/* ======================================================== */}
            {viewMode === 'masterplan' && (
              <svg
                viewBox={siteMasterplan.viewBox}
                width={siteMasterplan.svgWidth}
                height={siteMasterplan.svgHeight}
                style={{ display: 'block', borderRadius: 'var(--radius-md)', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}
              >
                <defs>
                  <pattern id="gridSite" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke={currentTheme.gridMinor} strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill={currentTheme.bg} />
                <rect width="100%" height="100%" fill="url(#gridSite)" />

                {/* Outer Site Boundary Fence & Setbacks */}
                <rect x="50" y="40" width="1300" height="820" fill="rgba(16, 185, 129, 0.04)" stroke="#10b981" strokeWidth="2.5" strokeDasharray="8,4" />
                <text x="65" y="65" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#10b981">
                  PERIMETER SECURITY BOUNDARY (3.5 HECTARES / 8.6 ACRES)
                </text>

                {/* Regulation 90m x 45m Football Pitch & 200m Running Track */}
                {(includeFootballPitch || includeAthleticsTrack) && (
                  <g transform="translate(680, 180)">
                    {/* 200m Track Loop (Red / Cinder) */}
                    {includeAthleticsTrack && (
                      <rect x="-30" y="-30" width="560" height="300" rx="150" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="3" />
                    )}
                    
                    {/* Football Pitch (Green Turf) */}
                    {includeFootballPitch && (
                      <>
                        <rect x="20" y="20" width="460" height="200" rx="4" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />
                        <line x1="250" y1="20" x2="250" y2="220" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                        <circle cx="250" cy="120" r="40" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                        <rect x="20" y="60" width="60" height="120" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                        <rect x="420" y="60" width="60" height="120" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                      </>
                    )}

                    <text x="250" y="125" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#f8fafc" textAnchor="middle">
                      {includeFootballPitch && includeAthleticsTrack ? "FIFA STANDARD SECONDARY PITCH (90m × 45m) & 200m TRACK" :
                       includeFootballPitch ? "FIFA STANDARD SECONDARY PITCH (90m × 45m)" : "200m RUNNING TRACK"}
                    </text>
                  </g>
                )}

                {/* Outdoor Multi-Court Hardcourt Pad */}
                {includeBasketballCourt && (
                  <g transform="translate(680, 540)">
                    <rect width="280" height="160" rx="4" fill="rgba(245, 158, 11, 0.18)" stroke="#f59e0b" strokeWidth="2" />
                    <line x1="140" y1="0" x2="140" y2="160" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
                    <circle cx="140" cy="80" r="25" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
                    <text x="140" y="85" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#f59e0b" textAnchor="middle">
                      DUAL BASKETBALL & VOLLEYBALL HARDCOURTS
                    </text>
                  </g>
                )}

                {/* School Building Complexes (Wings) */}
                <g transform="translate(90, 140)">
                  {/* Academic Wing Block */}
                  <rect width="480" height="180" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="3" />
                  <text x="240" y="95" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700" fill="#f8fafc" textAnchor="middle">
                    ACADEMIC CLASSROOM COMPLEX (WINGS A & B)
                  </text>

                  {/* Rooftop Solar PV Array */}
                  <rect x="20" y="20" width="440" height="40" rx="2" fill="rgba(6, 182, 212, 0.35)" stroke="#06b6d4" strokeWidth="1.5" />
                  <text x="240" y="44" fontFamily="system-ui, sans-serif" fontSize="9.5" fontWeight="600" fill="#06b6d4" textAnchor="middle">
                    ☀ 45kWp Rooftop Solar Photovoltaic (PV) Array
                  </text>
                </g>

                {/* STEM Science & Tech Complex */}
                <g transform="translate(90, 360)">
                  <rect width="480" height="160" rx="4" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="3" />
                  <text x="240" y="85" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700" fill="#f8fafc" textAnchor="middle">
                    STEM SCIENCE LABORATORIES & ICT INNOVATION HUB
                  </text>
                </g>

                {/* Administration & Faculty Core */}
                <g transform="translate(90, 560)">
                  <rect width="480" height="140" rx="4" fill="rgba(100, 116, 139, 0.2)" stroke="#64748b" strokeWidth="3" />
                  <text x="240" y="75" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700" fill="#f8fafc" textAnchor="middle">
                    ADMINISTRATION, PRINCIPAL SUITE & FACULTY LOUNGE
                  </text>
                </g>

                {/* Rainwater Harvesting Tanks & Water Pump Hub */}
                <g transform="translate(1000, 560)">
                  <circle cx="40" cy="40" r="30" fill="rgba(6, 182, 212, 0.3)" stroke="#06b6d4" strokeWidth="2" />
                  <circle cx="110" cy="40" r="30" fill="rgba(6, 182, 212, 0.3)" stroke="#06b6d4" strokeWidth="2" />
                  <text x="75" y="100" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="600" fill="#06b6d4" textAnchor="middle">
                    50,000L Rainwater Cistern Tanks
                  </text>
                </g>

                {/* Entrance Security Gatehouse & Bus Loop */}
                <g transform="translate(90, 740)">
                  <rect width="200" height="60" rx="4" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
                  <text x="100" y="35" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#f59e0b" textAnchor="middle">
                    MAIN GATEHOUSE & DROP-OFF LOOP
                  </text>
                </g>
              </svg>
            )}

            {/* ======================================================== */}
            {/* MODE 4: 2.5D ISOMETRIC CUTAWAY (3D PERSPECTIVE)           */}
            {/* ======================================================== */}
            {viewMode === 'isometric' && (
              <svg
                viewBox={isometricCAD.viewBox}
                width={isometricCAD.svgWidth}
                height={isometricCAD.svgHeight}
                style={{ display: 'block', borderRadius: 'var(--radius-md)', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}
              >
                <rect width="100%" height="100%" fill={currentTheme.bg} />

                {/* Header */}
                <text x="35" y="42" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700" fill={currentTheme.textColor}>
                  {isometricCAD.room.name.toUpperCase()} — 2.5D ISOMETRIC ARCHITECTURAL CUTAWAY
                </text>
                <text x="35" y="58" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="500" fill={currentTheme.textMuted}>
                  Axonometric 30° Projection • Structural Wall Height: 3.2m • {countryData.name} Standard
                </text>

                {/* Floor Slab Polygon */}
                <polygon
                  points={`${isometricCAD.points.p0.x},${isometricCAD.points.p0.y} ${isometricCAD.points.p1.x},${isometricCAD.points.p1.y} ${isometricCAD.points.p2.x},${isometricCAD.points.p2.y} ${isometricCAD.points.p3.x},${isometricCAD.points.p3.y}`}
                  fill="rgba(30, 41, 59, 0.8)"
                  stroke={currentTheme.wallStroke}
                  strokeWidth="2.5"
                />

                {/* Back Left Wall */}
                <polygon
                  points={`${isometricCAD.points.p3.x},${isometricCAD.points.p3.y} ${isometricCAD.points.p2.x},${isometricCAD.points.p2.y} ${isometricCAD.points.p2_top.x},${isometricCAD.points.p2_top.y} ${isometricCAD.points.p3_top.x},${isometricCAD.points.p3_top.y}`}
                  fill="rgba(51, 65, 85, 0.6)"
                  stroke={currentTheme.wallStroke}
                  strokeWidth="2"
                />

                {/* Back Right Wall */}
                <polygon
                  points={`${isometricCAD.points.p2.x},${isometricCAD.points.p2.y} ${isometricCAD.points.p1.x},${isometricCAD.points.p1.y} ${isometricCAD.points.p1_top.x},${isometricCAD.points.p1_top.y} ${isometricCAD.points.p2_top.x},${isometricCAD.points.p2_top.y}`}
                  fill="rgba(71, 85, 105, 0.5)"
                  stroke={currentTheme.wallStroke}
                  strokeWidth="2"
                />

                {/* Isometric Furniture CAD Blocks */}
                {isometricCAD.isometricFurniture.map(f => (
                  <g key={f.id}>
                    {/* Furniture Top Surface */}
                    <polygon
                      points={`${f.top[0].x},${f.top[0].y} ${f.top[1].x},${f.top[1].y} ${f.top[2].x},${f.top[2].y} ${f.top[3].x},${f.top[3].y}`}
                      fill={f.fill || currentTheme.furnitureFill}
                      stroke={f.stroke || currentTheme.furnitureStroke}
                      strokeWidth="1.5"
                    />
                    {/* Front Face */}
                    <polygon
                      points={`${f.base[0].x},${f.base[0].y} ${f.base[1].x},${f.base[1].y} ${f.top[1].x},${f.top[1].y} ${f.top[0].x},${f.top[0].y}`}
                      fill="rgba(15, 23, 42, 0.6)"
                      stroke={f.stroke || currentTheme.furnitureStroke}
                      strokeWidth="1.2"
                    />
                  </g>
                ))}
              </svg>
            )}

          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          Ready for export? Proceed to generate the architectural blueprints, BoQ spreadsheet, and executive reports.
        </div>

        <button className="btn btn-primary" onClick={onNextStep}>
          <span>Proceed to Export Station</span>
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
