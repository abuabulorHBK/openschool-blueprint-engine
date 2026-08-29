# OpenSchool Blueprint Engine - UI Architecture & Prompt

This document contains an extraction of all interactive UI elements and key layout nodes across the application. It is designed to be provided as a prompt to AI design tools (like Stitch or Figma) to ensure accurate UI reconstruction.

## File: `src/components/ClassroomMaterialModal.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `glass-panel`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "setDisplayCurrency('local')} > {currencyCode}"
- **BUTTON**
  - **Text/Content**: "setDisplayCurrency('USD')} > USD ($)"
- **BUTTON**
  - **Text/Content**: "Export CSV"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "(Icon/No text)"
- **BUTTON**
  - **Text/Content**: "setSelectedArea(area)} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', border: '1px solid', borderColor: selectedArea === area ? 'var(--accent-primary)' : 'var(--border-color)', background: selectedArea === area ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)', color: selectedArea === area ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer' }} > {area} m²"
- **BUTTON**
  - **Text/Content**: "setActiveCategory('all')} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11.5px', fontWeight: '600', border: '1px solid', borderColor: activeCategory === 'all' ? 'var(--accent-primary)' : 'var(--border-color)', background: activeCategory === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'transparent', color: activeCategory === 'all' ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer', whiteSpace: 'nowrap' }} > All Trades ({schedule.items.length})"
- **BUTTON**
  - **Text/Content**: "setActiveCategory(cat.id)} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11.5px', fontWeight: '600', border: '1px solid', borderColor: activeCategory === cat.id ? 'var(--accent-primary)' : 'var(--border-color)', background: activeCategory === cat.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent', color: activeCategory === cat.id ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer', whiteSpace: 'nowrap' }} > {cat.name.split('. ')[1] || cat.name} ({cat.percentage}%)"

## File: `src/components/ErrorBoundary.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `glass-panel`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "window.location.reload()} > Reload Application"
  - **Classes**: `btn btn-primary`

## File: `src/components/Navbar.jsx`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "Updates"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "Projects"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "Export Project"
  - **Classes**: `btn btn-primary btn-sm`
- **INPUT**
  - **Type**: `text`
- **SELECT**
  - **Classes**: `form-select`
- **SELECT**
  - **Classes**: `form-select`

## File: `src/components/NewsletterFooter.jsx`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "{status === 'loading' ? 'Joining...' : 'Get Updates'}"
  - **Type**: `submit`
  - **Classes**: `btn btn-primary`
- **BUTTON**
  - **Text/Content**: "Newsletter Preferences"
  - **Type**: `button`
- **INPUT**
  - **Type**: `email`

## File: `src/components/NewsletterModal.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `modal-overlay`
- **Node**: `<div>`
  - **Classes**: `modal-content`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "(Icon/No text)"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "Cancel"
  - **Type**: `button`
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "{status === 'loading' ? 'Saving...' : 'Save & Subscribe'}"
  - **Type**: `submit`
  - **Classes**: `btn btn-primary btn-sm`
- **INPUT**
  - **Type**: `email`
- **INPUT**
  - **Type**: `checkbox`
- **INPUT**
  - **Type**: `checkbox`
- **INPUT**
  - **Type**: `checkbox`

## File: `src/components/ProjectModal.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `modal-overlay`
- **Node**: `<div>`
  - **Classes**: `modal-content`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "(Icon/No text)"
- **INPUT**
  - **Type**: `file`

## File: `src/components/StepNavigation.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `stepper-container`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "onSelectStep(step.id)} className={`step-item ${isActive ? 'active' : ''}`} > {idx + 1} {step.label.replace(/^\d+\.\s*/, '')}"

## File: `src/views/CostDashboard.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `glass-panel glass-panel-glow`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "setIsMaterialModalOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)', color: 'var(--accent-primary)', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }} > Inspect Classroom Materials (BoQ)"
  - **Classes**: `btn btn-secondary btn-sm`

## File: `src/views/EquipmentCatalog.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `modal-overlay`
- **Node**: `<div>`
  - **Classes**: `modal-content`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "setIsAddingCustomModalOpen(true)} > Add Custom Item"
  - **Classes**: `btn btn-primary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleQuantityChange(item.roomId, item.instanceId, (item.quantity || 1) - 1)} > -"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleQuantityChange(item.roomId, item.instanceId, (item.quantity || 1) + 1)} > +"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleDeleteItem(item.roomId, item.instanceId)} style={{ color: 'var(--accent-red)' }} >"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleAddMasterItemToRoom(mItem, masterTargetRoomId || (activeRoomId === 'all' ? rooms[0]?.id : activeRoomId))} title="Add to target room" > Add"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "setIsAddingCustomModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} >"
- **BUTTON**
  - **Text/Content**: "setIsAddingCustomModalOpen(false)} > Cancel"
  - **Type**: `button`
  - **Classes**: `btn btn-secondary`
- **BUTTON**
  - **Text/Content**: "Save & Assign Item"
  - **Type**: `submit`
  - **Classes**: `btn btn-primary`
- **BUTTON**
  - **Text/Content**: "Proceed to Teacher Planner"
  - **Classes**: `btn btn-primary`
- **INPUT**
  - **Type**: `text`
  - **Placeholder**: "Search equipment, specs, apparatus..."
  - **Classes**: `form-input`
- **INPUT**
  - **Type**: `number`
  - **Classes**: `form-input number-mono`
- **INPUT**
  - **Type**: `text`
  - **Placeholder**: "Search master catalog..."
  - **Classes**: `form-input`
- **INPUT**
  - **Type**: `text`
  - **Placeholder**: "e.g. Specialized Centrifuge System"
  - **Classes**: `form-input`
- **INPUT**
  - **Type**: `number`
  - **Classes**: `form-input number-mono`
- **INPUT**
  - **Type**: `number`
  - **Classes**: `form-input number-mono`
- **SELECT**
  - **Classes**: `form-select`
- **SELECT**
  - **Classes**: `form-select`
- **SELECT**
  - **Classes**: `form-select`
- **SELECT**
  - **Classes**: `form-select`
- **SELECT**
  - **Classes**: `form-select`
- **SELECT**
  - **Classes**: `form-select`
- **TEXTAREA**
  - **Placeholder**: "e.g. 4000 RPM, digital timer, 8x15ml rotor tube"
  - **Classes**: `form-input`

## File: `src/views/ExportHub.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "{isGeneratingPDF ? 'Generating High-Res PDF...' : 'Download Project Report (PDF)'}"
  - **Classes**: `btn btn-primary`
- **BUTTON**
  - **Text/Content**: "Download AutoCAD CAD (.dxf)"
  - **Classes**: `btn btn-secondary`
- **BUTTON**
  - **Text/Content**: "Download BoQ Spreadsheet (.csv)"
  - **Classes**: `btn btn-secondary`
- **BUTTON**
  - **Text/Content**: "setShowAdvanced(!showAdvanced)} style={{ background: 'none', border: 'none', padding: 0, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }} > Advanced & Developer Interchange Formats (Typst, Print HTML, JSON) {showAdvanced ? : }"
  - **Type**: `button`
- **BUTTON**
  - **Text/Content**: "Classroom Material Schedule (.csv)"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "Typst Source (.typ)"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "Print HTML Template"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "Raw Project Backup (JSON)"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "{newsletterStatus === 'loading' ? 'Joining...' : 'Subscribe'}"
  - **Type**: `submit`
  - **Classes**: `btn btn-primary`
- **INPUT**
  - **Type**: `email`

## File: `src/views/FloorPlanVisualizer.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `svg-canvas-container`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "SVG"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "PNG"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "DXF"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "setViewMode('wing')} className={`btn btn-sm ${viewMode === 'wing' ? 'btn-primary' : 'btn-secondary'}`} > Wing Plan"
- **BUTTON**
  - **Text/Content**: "setViewMode('room_cad')} className={`btn btn-sm ${viewMode === 'room_cad' ? 'btn-primary' : 'btn-secondary'}`} > Room Interior ({selectedRoom.name})"
- **BUTTON**
  - **Text/Content**: "setViewMode('masterplan')} className={`btn btn-sm ${viewMode === 'masterplan' ? 'btn-primary' : 'btn-secondary'}`} > Campus Masterplan"
- **BUTTON**
  - **Text/Content**: "setViewMode('isometric')} className={`btn btn-sm ${viewMode === 'isometric' ? 'btn-primary' : 'btn-secondary'}`} > Isometric 3D"
- **BUTTON**
  - **Text/Content**: "setSelectedTypology('linear')} className={`btn btn-sm ${selectedTypology === 'linear' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 9px', fontSize: '11.5px' }} > Linear Pavilion"
- **BUTTON**
  - **Text/Content**: "setSelectedTypology('courtyard')} className={`btn btn-sm ${selectedTypology === 'courtyard' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 9px', fontSize: '11.5px' }} > Courtyard Quadrangle"
- **BUTTON**
  - **Text/Content**: "toggleLayer(l.id)} className={`badge ${layers[l.id] ? 'badge-primary' : 'badge-secondary'}`} style={{ cursor: 'pointer', border: 'none', padding: '3px 8px', fontSize: '11px', background: layers[l.id] ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.06)', color: layers[l.id] ? '#818cf8' : 'var(--text-muted)' }} > {layers[l.id] ? '✓ ' : '✕ '} {l.label}"
- **BUTTON**
  - **Text/Content**: "setSelectedTheme(t.id)} className={`btn btn-sm ${selectedTheme === t.id ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '11px' }} > {t.name}"
- **BUTTON**
  - **Text/Content**: "(Icon/No text)"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "(Icon/No text)"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "(Icon/No text)"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "Proceed to Export Station"
  - **Classes**: `btn btn-primary`
- **SELECT**
  - **Classes**: `form-select`

## File: `src/views/RoomPlanner.jsx`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "Add Room"
  - **Classes**: `btn btn-secondary`
- **BUTTON**
  - **Text/Content**: "onNavigateToEquipment(room.id)} className="btn btn-secondary btn-sm" style={{ gap: '8px' }} > {eqCount} Items"
- **BUTTON**
  - **Text/Content**: "handleDeltaCapacity(room, -1)} style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'} aria-label="Decrease capacity" >"
- **BUTTON**
  - **Text/Content**: "handleDeltaCapacity(room, +1)} style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'} aria-label="Increase capacity" >"
- **BUTTON**
  - **Text/Content**: "Proceed to Equipment Catalog"
  - **Classes**: `btn btn-primary`

## File: `src/views/SchoolConfig.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "handleSetInflationScenario(sc)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid', borderColor: isMatch ? 'var(--accent-amber)' : 'var(--border-color)', background: isMatch ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease' }} > {sc.name} {targetRate >= 0 ? `+${targetRate}%` : `${targetRate}%`} {sc.id === 'cpi' ? `${currentCountry.name} Official 2026 National CPI` : sc.description}"
  - **Type**: `button`
- **BUTTON**
  - **Text/Content**: "Proceed to Room Planner"
  - **Classes**: `btn btn-primary`
- **INPUT**
  - **Type**: `text`
- **INPUT**
  - **Type**: `text`
- **INPUT**
  - **Type**: `range`
- **INPUT**
  - **Type**: `number`
- **INPUT**
  - **Type**: `range`
- **SELECT**
- **SELECT**
- **SELECT**
- **SELECT**

## File: `src/views/SiteCalculator.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "Proceed to 2D Floor Plan"
  - **Classes**: `btn btn-primary`
- **INPUT**
  - **Type**: `checkbox`
- **INPUT**
  - **Type**: `checkbox`
- **INPUT**
  - **Type**: `checkbox`

## File: `src/views/TeacherPlanner.jsx`

### Layout Nodes (Containers)
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`
- **Node**: `<div>`
  - **Classes**: `glass-panel`

### Interactive Elements
- **BUTTON**
  - **Text/Content**: "handleEnrollmentChange(sz)} className={`btn btn-sm ${targetEnrollment === sz ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '2px 8px', fontSize: '11px' }} > {sz}"
- **BUTTON**
  - **Text/Content**: "Auto-Calculate Ratios"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleSelectProfile(staffingPlan.schoolType || 'igcse')} title="Reset entire profile to factory defaults" style={{ fontSize: '11.5px' }} > Reset Defaults"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleSelectProfile(prof.id)} className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '12px', padding: '6px 12px' }} > {prof.name}"
- **BUTTON**
  - **Text/Content**: "Add Cambridge Subject"
  - **Classes**: `btn btn-primary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleTeacherCountChange(subj.id, Math.max(0, subj.teachersNeeded - 1))} title="Decrease teacher count" > -"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleTeacherCountChange(subj.id, subj.teachersNeeded + 1)} title="Increase teacher count" > +"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleRevertSubjectToAuto(subj.id)} title="Revert to auto-calculated ratio based on school size" style={{ padding: '2px 6px', fontSize: '10px', border: 'none' }} > Auto"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleDuplicateSubject(subj)} title="Duplicate Subject" >"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleDeleteSubject(subj.id)} title="Delete Subject" >"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "Add Support Specialist Role"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleDeleteSupportRole(st.id)} style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '4px' }} title="Delete Specialist Role" >"
- **BUTTON**
  - **Text/Content**: "handleUpdateSupportRole(st.id, { count: Math.max(0, (st.count || 1) - 1) })} > -"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "handleUpdateSupportRole(st.id, { count: (st.count || 0) + 1 })} > +"
  - **Classes**: `btn btn-secondary btn-sm`
- **BUTTON**
  - **Text/Content**: "Proceed to Site Calculator"
  - **Classes**: `btn btn-primary`
- **INPUT**
  - **Type**: `range`
- **INPUT**
  - **Type**: `text`
  - **Classes**: `form-input`
- **INPUT**
  - **Type**: `range`
- **INPUT**
  - **Type**: `number`
- **INPUT**
  - **Type**: `text`
  - **Classes**: `form-input`
- **INPUT**
  - **Type**: `checkbox`
- **INPUT**
  - **Type**: `number`
- **INPUT**
  - **Type**: `text`
  - **Classes**: `form-input`
- **INPUT**
  - **Type**: `number`
- **SELECT**
  - **Classes**: `form-select`
- **SELECT**
  - **Classes**: `form-select`
- **TEXTAREA**
  - **Classes**: `form-textarea`
- **TEXTAREA**
  - **Classes**: `form-textarea`

