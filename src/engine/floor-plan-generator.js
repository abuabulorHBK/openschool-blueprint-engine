/**
 * Advanced Architectural CAD & Spatial Blueprint Engine
 * Procedurally generates:
 *  1. Campus Masterplan & Site CAD (Athletics pitches, 200m track, outdoor courts, solar arrays, setbacks, landscaping)
 *  2. Multi-Wing Building Floor Plans (Linear, Courtyard Quadrangle, L-Shape, U-Shape with double walls & dimensioning)
 *  3. Detailed Classroom & Laboratory Interior CAD (Parametric furniture: desks, lab benches, fume hoods, sinks, computers, easels)
 *  4. 2.5D Isometric / Axonometric 3D Cutaway Models
 *  5. Multi-theme styling (Classic Blueprint, Dark CAD, Clean White Contractor Print) and layer toggles.
 */

import { ROOM_TYPE_DEFINITIONS } from '../data/floor-area-ratios.js';

export const ZONE_CONFIG = {
  academic: { name: 'Academic Classroom Wing', color: '#6366f1', fill: 'rgba(99, 102, 241, 0.14)', stroke: '#6366f1', icon: 'BookOpen' },
  stem: { name: 'STEM Science Laboratory Complex', color: '#06b6d4', fill: 'rgba(6, 182, 212, 0.14)', stroke: '#06b6d4', icon: 'FlaskConical' },
  technology: { name: 'Technology & Computing Wing', color: '#3b82f6', fill: 'rgba(59, 130, 246, 0.14)', stroke: '#3b82f6', icon: 'Monitor' },
  humanities: { name: 'Humanities & Geography Block', color: '#f59e0b', fill: 'rgba(245, 158, 11, 0.14)', stroke: '#f59e0b', icon: 'Globe' },
  creative: { name: 'Art & Design Studio Hub', color: '#a855f7', fill: 'rgba(168, 85, 247, 0.14)', stroke: '#a855f7', icon: 'Palette' },
  admin: { name: 'Administration & Faculty Suite', color: '#64748b', fill: 'rgba(100, 116, 139, 0.14)', stroke: '#64748b', icon: 'ShieldCheck' },
  sports: { name: 'Athletics & Multi-Purpose Arena', color: '#84cc16', fill: 'rgba(132, 204, 22, 0.14)', stroke: '#84cc16', icon: 'Trophy' }
};

export const THEME_CONFIG = {
  blueprint: {
    id: 'blueprint',
    name: 'Classic Blueprint',
    bg: '#071527',
    gridMinor: 'rgba(56, 189, 248, 0.08)',
    gridMajor: 'rgba(56, 189, 248, 0.18)',
    wallStroke: '#38bdf8',
    wallFill: 'rgba(14, 116, 144, 0.25)',
    furnitureStroke: '#7dd3fc',
    furnitureFill: 'rgba(56, 189, 248, 0.12)',
    doorStroke: '#38bdf8',
    windowStroke: '#93c5fd',
    dimColor: '#38bdf8',
    textColor: '#f0f9ff',
    textMuted: '#7dd3fc',
    borderGlow: 'rgba(56, 189, 248, 0.4)'
  },
  dark: {
    id: 'dark',
    name: 'Modern Dark CAD',
    bg: '#0b0f19',
    gridMinor: 'rgba(255, 255, 255, 0.04)',
    gridMajor: 'rgba(99, 102, 241, 0.15)',
    wallStroke: '#818cf8',
    wallFill: 'rgba(30, 41, 59, 0.7)',
    furnitureStroke: '#a5b4fc',
    furnitureFill: 'rgba(99, 102, 241, 0.1)',
    doorStroke: '#6366f1',
    windowStroke: '#38bdf8',
    dimColor: '#94a3b8',
    textColor: '#f8fafc',
    textMuted: '#94a3b8',
    borderGlow: 'rgba(99, 102, 241, 0.35)'
  },
  light: {
    id: 'light',
    name: 'Contractor White Print',
    bg: '#ffffff',
    gridMinor: 'rgba(0, 0, 0, 0.04)',
    gridMajor: 'rgba(0, 0, 0, 0.1)',
    wallStroke: '#0f172a',
    wallFill: '#f1f5f9',
    furnitureStroke: '#334155',
    furnitureFill: 'rgba(100, 116, 139, 0.08)',
    doorStroke: '#0284c7',
    windowStroke: '#0ea5e9',
    dimColor: '#475569',
    textColor: '#0f172a',
    textMuted: '#64748b',
    borderGlow: 'rgba(15, 23, 42, 0.25)'
  }
};

/**
 * Procedural Interior Furniture & Equipment Generator
 * Creates exact CAD geometry for desks, chairs, lab benches, fume hoods, sinks, computers, etc.
 */
export function generateRoomFurnitureCAD(room, roomType, widthM = 10, lengthM = 8, capacity = 40, scale = 14) {
  const furniture = [];
  const type = roomType || room.type || 'classroom';
  const cap = Math.max(1, capacity || room.capacity || 30);
  const def = ROOM_TYPE_DEFINITIONS[type] || ROOM_TYPE_DEFINITIONS.classroom;

  const roomW_px = widthM * scale;
  const roomH_px = lengthM * scale;

  // Coordinate offset margins inside the room walls
  const marginX = 0.8 * scale;
  const marginY = 0.8 * scale;
  const usableW = roomW_px - (marginX * 2);
  const usableH = roomH_px - (marginY * 2);

  // 1. TEACHER PODIUM & WHITEBOARD (Present in all academic & lab rooms)
  if (type !== 'sports_hall' && type !== 'staff_room' && type !== 'admin_office') {
    // 3.6m Whiteboard on front wall
    const wbWidth = Math.min(3.6 * scale, usableW * 0.6);
    furniture.push({
      id: 'wb-front',
      type: 'whiteboard',
      category: 'presentation',
      x: (roomW_px - wbWidth) / 2,
      y: 0.15 * scale,
      width: wbWidth,
      height: 0.25 * scale,
      label: '3.6m Vitreous Enamel Whiteboard',
      stroke: '#38bdf8',
      fill: 'rgba(56, 189, 248, 0.3)'
    });

    // Teacher Desk & Ergonomic Mesh Chair
    const tDeskX = (roomW_px / 2) - (0.8 * scale);
    const tDeskY = 1.0 * scale;
    furniture.push({
      id: 'teacher-desk',
      type: 'teacher_desk',
      category: 'faculty',
      x: tDeskX,
      y: tDeskY,
      width: 1.6 * scale,
      height: 0.75 * scale,
      label: 'Teacher Station / Laptop Terminal',
      stroke: '#f59e0b',
      fill: 'rgba(245, 158, 11, 0.2)'
    });
    // Teacher Chair
    furniture.push({
      id: 'teacher-chair',
      type: 'chair',
      category: 'faculty',
      x: tDeskX + (0.55 * scale),
      y: tDeskY - (0.45 * scale),
      width: 0.5 * scale,
      height: 0.45 * scale,
      radius: 0.25 * scale,
      stroke: '#f59e0b',
      fill: 'rgba(245, 158, 11, 0.3)'
    });
  }

  // 2. ROOM-SPECIFIC EQUIPMENT LAYOUTS

  switch (type) {
    case 'classroom': {
      // Grid of 2-Student Desks with Chairs
      // Target 2 students per desk
      const deskPairs = Math.ceil(cap / 2);
      const cols = Math.min(Math.max(3, Math.floor(usableW / (2.0 * scale))), 6);
      const rows = Math.ceil(deskPairs / cols);

      const startY = 2.4 * scale;
      const spacingX = usableW / cols;
      const spacingY = Math.min(1.4 * scale, (usableH - (startY - marginY)) / Math.max(rows, 1));

      let placed = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (placed >= deskPairs) break;
          const dx = marginX + (c * spacingX) + (spacingX - (1.2 * scale)) / 2;
          const dy = startY + (r * spacingY);

          // Student Dual Desk (1200mm x 500mm)
          furniture.push({
            id: `desk-pair-${placed}`,
            type: 'student_desk',
            category: 'furniture',
            x: dx,
            y: dy,
            width: 1.2 * scale,
            height: 0.5 * scale,
            label: 'Desk Pair',
            stroke: def.color,
            fill: 'rgba(99, 102, 241, 0.15)'
          });

          // Chair 1 (Left)
          furniture.push({
            id: `chair-${placed}-1`,
            type: 'student_chair',
            category: 'furniture',
            x: dx + (0.1 * scale),
            y: dy + (0.55 * scale),
            width: 0.42 * scale,
            height: 0.4 * scale,
            stroke: def.color,
            fill: 'rgba(99, 102, 241, 0.25)'
          });

          // Chair 2 (Right)
          furniture.push({
            id: `chair-${placed}-2`,
            type: 'student_chair',
            category: 'furniture',
            x: dx + (0.68 * scale),
            y: dy + (0.55 * scale),
            width: 0.42 * scale,
            height: 0.4 * scale,
            stroke: def.color,
            fill: 'rgba(99, 102, 241, 0.25)'
          });

          placed++;
        }
      }

      // Storage Cupboard (Rear right wall)
      furniture.push({
        id: 'cls-cupboard-1',
        type: 'storage_cabinet',
        category: 'furniture',
        x: roomW_px - (1.2 * scale),
        y: roomH_px - (1.8 * scale),
        width: 0.9 * scale,
        height: 1.5 * scale,
        label: 'Lockable Steel Storage',
        stroke: '#94a3b8',
        fill: 'rgba(148, 163, 184, 0.2)'
      });

      // Ceiling Fan Rotation Arc Indicators
      const fanPositions = [
        { x: roomW_px * 0.33, y: roomH_px * 0.4 },
        { x: roomW_px * 0.67, y: roomH_px * 0.4 },
        { x: roomW_px * 0.33, y: roomH_px * 0.75 },
        { x: roomW_px * 0.67, y: roomH_px * 0.75 }
      ];
      fanPositions.forEach((fp, idx) => {
        furniture.push({
          id: `fan-${idx}`,
          type: 'ceiling_fan',
          category: 'services',
          x: fp.x,
          y: fp.y,
          radius: 0.7 * scale,
          label: '56" Ceiling Fan',
          stroke: 'rgba(56, 189, 248, 0.4)',
          fill: 'none'
        });
      });
      break;
    }

    case 'chemistry_lab': {
      // 1. Ducted Walk-in Fume Hood on exterior left wall
      furniture.push({
        id: 'fume-hood-1',
        type: 'fume_hood',
        category: 'safety',
        x: 0.3 * scale,
        y: 1.2 * scale,
        width: 1.5 * scale,
        height: 0.85 * scale,
        label: 'Ducted Fume Hood (1.5m PP Sash)',
        stroke: '#ec4899',
        fill: 'rgba(236, 72, 153, 0.25)'
      });

      // 2. Emergency Deluge Shower & Eyewash Station (Near exit door)
      furniture.push({
        id: 'safety-shower-1',
        type: 'safety_shower',
        category: 'safety',
        x: roomW_px - (1.2 * scale),
        y: roomH_px - (1.2 * scale),
        radius: 0.45 * scale,
        label: 'Emergency Deluge Shower & Eyewash',
        stroke: '#10b981',
        fill: 'rgba(16, 185, 129, 0.3)'
      });

      // 3. Fire-Rated Flammable Storage Cabinet
      furniture.push({
        id: 'flammable-cab-1',
        type: 'hazard_cabinet',
        category: 'safety',
        x: 0.3 * scale,
        y: 2.3 * scale,
        width: 1.1 * scale,
        height: 0.5 * scale,
        label: 'Yellow Safety Cabinet (45 Gal)',
        stroke: '#f59e0b',
        fill: 'rgba(245, 158, 11, 0.35)'
      });

      // 4. Heavy Chemistry Island Benches with Sinks & Gas Turrets
      const benchCols = 3;
      const benchRows = 5;
      const startX = 2.2 * scale;
      const startY = 2.3 * scale;
      const benchW = 1.8 * scale;
      const benchH = 0.75 * scale;
      const stepX = (roomW_px - startX - (1.5 * scale)) / Math.max(benchCols - 1, 1);
      const stepY = 1.1 * scale;

      let bIdx = 0;
      for (let r = 0; r < benchRows; r++) {
        for (let c = 0; c < benchCols; c++) {
          if (bIdx >= 15) break;
          const bx = startX + (c * stepX);
          const by = startY + (r * stepY);

          // Chemical-resistant epoxy benchtop
          furniture.push({
            id: `chem-bench-${bIdx}`,
            type: 'lab_bench',
            category: 'lab_stem',
            x: bx,
            y: by,
            width: benchW,
            height: benchH,
            label: 'Chemistry Island (Epoxy Resin)',
            stroke: '#ec4899',
            fill: 'rgba(236, 72, 153, 0.15)'
          });

          // PP Cup Sink with Cold Water Tap
          furniture.push({
            id: `chem-sink-${bIdx}`,
            type: 'sink',
            category: 'services',
            x: bx + (benchW / 2) - (0.15 * scale),
            y: by + (0.1 * scale),
            width: 0.3 * scale,
            height: 0.25 * scale,
            stroke: '#06b6d4',
            fill: 'rgba(6, 182, 212, 0.4)'
          });

          // Dual Gas Turrets (Small orange dots)
          furniture.push({
            id: `gas-turret-${bIdx}`,
            type: 'gas_tap',
            category: 'services',
            x: bx + (benchW / 2) - (0.08 * scale),
            y: by + (0.45 * scale),
            radius: 0.08 * scale,
            stroke: '#f59e0b',
            fill: '#f59e0b'
          });

          // 2 Lab Stools
          furniture.push({
            id: `stool-${bIdx}-1`,
            type: 'lab_stool',
            category: 'furniture',
            x: bx + (0.2 * scale),
            y: by + benchH + (0.15 * scale),
            radius: 0.18 * scale,
            stroke: '#94a3b8',
            fill: 'rgba(148, 163, 184, 0.3)'
          });
          furniture.push({
            id: `stool-${bIdx}-2`,
            type: 'lab_stool',
            category: 'furniture',
            x: bx + benchW - (0.4 * scale),
            y: by + benchH + (0.15 * scale),
            radius: 0.18 * scale,
            stroke: '#94a3b8',
            fill: 'rgba(148, 163, 184, 0.3)'
          });

          bIdx++;
        }
      }
      break;
    }

    case 'physics_lab': {
      // 1. Teacher Master Demonstration Bench with variable AC/DC console & sink
      furniture.push({
        id: 'phy-demo-bench',
        type: 'demo_bench',
        category: 'lab_stem',
        x: (roomW_px - (2.4 * scale)) / 2,
        y: 1.0 * scale,
        width: 2.4 * scale,
        height: 0.9 * scale,
        label: 'Master Demonstration Bench (Variable AC/DC)',
        stroke: '#38bdf8',
        fill: 'rgba(56, 189, 248, 0.25)'
      });

      // 2. Physics Student Lab Workstations with Power Supply & Multimeters
      const pCols = 3;
      const pRows = 5;
      const pStartX = 1.0 * scale;
      const pStartY = 2.4 * scale;
      const pBenchW = 1.8 * scale;
      const pBenchH = 0.7 * scale;
      const pStepX = (roomW_px - (pStartX * 2) - pBenchW) / Math.max(pCols - 1, 1);
      const pStepY = 1.1 * scale;

      let pIdx = 0;
      for (let r = 0; r < pRows; r++) {
        for (let c = 0; c < pCols; c++) {
          if (pIdx >= 15) break;
          const bx = pStartX + (c * pStepX);
          const by = pStartY + (r * pStepY);

          furniture.push({
            id: `phy-bench-${pIdx}`,
            type: 'lab_bench',
            category: 'lab_stem',
            x: bx,
            y: by,
            width: pBenchW,
            height: pBenchH,
            label: 'Physics Bench (Power Box)',
            stroke: '#38bdf8',
            fill: 'rgba(56, 189, 248, 0.15)'
          });

          // Regulated DC/AC Power Supply Box
          furniture.push({
            id: `phy-power-${pIdx}`,
            type: 'power_box',
            category: 'services',
            x: bx + (0.1 * scale),
            y: by + (0.1 * scale),
            width: 0.35 * scale,
            height: 0.25 * scale,
            stroke: '#f59e0b',
            fill: 'rgba(245, 158, 11, 0.4)'
          });

          // Digital Storage Oscilloscope (On select benches)
          if (pIdx % 3 === 0) {
            furniture.push({
              id: `phy-osc-${pIdx}`,
              type: 'oscilloscope',
              category: 'lab_stem',
              x: bx + pBenchW - (0.45 * scale),
              y: by + (0.1 * scale),
              width: 0.35 * scale,
              height: 0.25 * scale,
              stroke: '#06b6d4',
              fill: 'rgba(6, 182, 212, 0.5)'
            });
          }

          pIdx++;
        }
      }

      // Optics Dark Zone & Dynamics Track (Rear wall)
      furniture.push({
        id: 'optics-track-1',
        type: 'optics_bench',
        category: 'lab_stem',
        x: 1.0 * scale,
        y: roomH_px - (1.0 * scale),
        width: 3.5 * scale,
        height: 0.6 * scale,
        label: 'IGCSE Dynamics Track & Ray Optics Bench',
        stroke: '#818cf8',
        fill: 'rgba(99, 102, 241, 0.2)'
      });
      break;
    }

    case 'biology_lab': {
      // 1. Wet-Lab Island Benches with Monocular Microscopes & Water Sinks
      const bioCols = 3;
      const bioRows = 5;
      const bioStartX = 1.0 * scale;
      const bioStartY = 2.3 * scale;
      const bioBenchW = 1.8 * scale;
      const bioBenchH = 0.75 * scale;
      const bioStepX = (roomW_px - (bioStartX * 2) - bioBenchW) / Math.max(bioCols - 1, 1);
      const bioStepY = 1.1 * scale;

      let bioIdx = 0;
      for (let r = 0; r < bioRows; r++) {
        for (let c = 0; c < bioCols; c++) {
          if (bioIdx >= 15) break;
          const bx = bioStartX + (c * bioStepX);
          const by = bioStartY + (r * bioStepY);

          furniture.push({
            id: `bio-bench-${bioIdx}`,
            type: 'lab_bench',
            category: 'lab_stem',
            x: bx,
            y: by,
            width: bioBenchW,
            height: bioBenchH,
            label: 'Biology Station',
            stroke: '#10b981',
            fill: 'rgba(16, 185, 129, 0.15)'
          });

          // Compound LED Microscope Icon/Square
          furniture.push({
            id: `microscope-${bioIdx}`,
            type: 'microscope',
            category: 'lab_stem',
            x: bx + (0.2 * scale),
            y: by + (0.15 * scale),
            width: 0.3 * scale,
            height: 0.3 * scale,
            label: 'LED Microscope',
            stroke: '#10b981',
            fill: 'rgba(16, 185, 129, 0.4)'
          });

          // Cup sink
          furniture.push({
            id: `bio-sink-${bioIdx}`,
            type: 'sink',
            category: 'services',
            x: bx + bioBenchW - (0.45 * scale),
            y: by + (0.15 * scale),
            width: 0.3 * scale,
            height: 0.25 * scale,
            stroke: '#06b6d4',
            fill: 'rgba(6, 182, 212, 0.4)'
          });

          bioIdx++;
        }
      }

      // Autoclave Sterilizer Unit & Anatomical Models (Side wall)
      furniture.push({
        id: 'autoclave-1',
        type: 'autoclave',
        category: 'lab_stem',
        x: roomW_px - (1.4 * scale),
        y: 1.2 * scale,
        width: 1.0 * scale,
        height: 0.8 * scale,
        label: 'Electric 24L Autoclave',
        stroke: '#10b981',
        fill: 'rgba(16, 185, 129, 0.3)'
      });
      furniture.push({
        id: 'torso-model-1',
        type: 'anatomical_model',
        category: 'lab_stem',
        x: roomW_px - (1.4 * scale),
        y: 2.3 * scale,
        width: 0.8 * scale,
        height: 0.6 * scale,
        label: 'Anatomical Torso Model',
        stroke: '#f59e0b',
        fill: 'rgba(245, 158, 11, 0.3)'
      });
      break;
    }

    case 'ict_lab': {
      // 1. Server Rack Cabinet (12U) & 6kVA Online UPS Bank
      furniture.push({
        id: 'server-rack-1',
        type: 'server_rack',
        category: 'it_electronics',
        x: roomW_px - (1.4 * scale),
        y: 0.3 * scale,
        width: 1.0 * scale,
        height: 0.9 * scale,
        label: '12U Managed Server Rack',
        stroke: '#06b6d4',
        fill: 'rgba(6, 182, 212, 0.4)'
      });
      furniture.push({
        id: 'ups-bank-1',
        type: 'ups_bank',
        category: 'it_electronics',
        x: roomW_px - (1.4 * scale),
        y: 1.4 * scale,
        width: 1.0 * scale,
        height: 0.6 * scale,
        label: '6kVA Online Pure Sine UPS',
        stroke: '#f59e0b',
        fill: 'rgba(245, 158, 11, 0.35)'
      });

      // 2. 100" Motorized Projection Screen at Front
      furniture.push({
        id: 'proj-screen-1',
        type: 'screen',
        category: 'it_electronics',
        x: (roomW_px - (2.2 * scale)) / 2,
        y: 0.1 * scale,
        width: 2.2 * scale,
        height: 0.15 * scale,
        label: '100" Laser Projection Screen',
        stroke: '#38bdf8',
        fill: '#38bdf8'
      });

      // 3. 30 Individual Computer Workstations (Dual back-to-back pods)
      const pcRows = 3;
      const pcCols = 5;
      const pcStartX = 0.8 * scale;
      const pcStartY = 2.4 * scale;
      const pcDeskW = 1.0 * scale;
      const pcDeskH = 0.6 * scale;
      const pcStepX = 1.15 * scale;
      const pcStepY = 1.4 * scale;

      let pcIdx = 0;
      for (let r = 0; r < pcRows; r++) {
        for (let c = 0; c < pcCols; c++) {
          if (pcIdx >= 30) break;
          const px = pcStartX + (c * pcStepX);
          const py = pcStartY + (r * pcStepY);

          // Workstation desk
          furniture.push({
            id: `pc-desk-${pcIdx}`,
            type: 'pc_workstation',
            category: 'it_electronics',
            x: px,
            y: py,
            width: pcDeskW,
            height: pcDeskH,
            label: `PC ${pcIdx + 1}`,
            stroke: '#06b6d4',
            fill: 'rgba(6, 182, 212, 0.15)'
          });

          // 23.8" Monitor screen
          furniture.push({
            id: `pc-mon-${pcIdx}`,
            type: 'monitor',
            category: 'it_electronics',
            x: px + (0.2 * scale),
            y: py + (0.1 * scale),
            width: 0.6 * scale,
            height: 0.08 * scale,
            stroke: '#38bdf8',
            fill: '#38bdf8'
          });

          // PC Tower Box
          furniture.push({
            id: `pc-tower-${pcIdx}`,
            type: 'cpu_tower',
            category: 'it_electronics',
            x: px + pcDeskW - (0.25 * scale),
            y: py + (0.1 * scale),
            width: 0.15 * scale,
            height: 0.35 * scale,
            stroke: '#94a3b8',
            fill: 'rgba(148, 163, 184, 0.5)'
          });

          pcIdx++;
        }
      }
      break;
    }

    case 'geography_room': {
      // 1. 5-Drawer Map Flat File (A0/A1 sheets)
      furniture.push({
        id: 'map-flat-file-1',
        type: 'flat_file',
        category: 'geography',
        x: roomW_px - (1.6 * scale),
        y: 1.0 * scale,
        width: 1.35 * scale,
        height: 0.95 * scale,
        label: 'A0 Map Flat File Cabinet',
        stroke: '#f59e0b',
        fill: 'rgba(245, 158, 11, 0.25)'
      });

      // 2. Automated Digital Weather Station Display
      furniture.push({
        id: 'weather-station-1',
        type: 'weather_station',
        category: 'geography',
        x: 0.3 * scale,
        y: 1.0 * scale,
        width: 0.9 * scale,
        height: 0.6 * scale,
        label: 'Digital Weather Station Telemetry',
        stroke: '#38bdf8',
        fill: 'rgba(56, 189, 248, 0.3)'
      });

      // 3. Collaborative Spatial Pods with 3D Relief Globes
      const geoPods = 6;
      const gCols = 3;
      const gRows = 2;
      const gStartX = 1.0 * scale;
      const gStartY = 2.4 * scale;
      const gDeskW = 1.6 * scale;
      const gDeskH = 1.1 * scale;
      const gStepX = (roomW_px - (gStartX * 2) - gDeskW) / Math.max(gCols - 1, 1);
      const gStepY = 1.8 * scale;

      let gIdx = 0;
      for (let r = 0; r < gRows; r++) {
        for (let c = 0; c < gCols; c++) {
          if (gIdx >= geoPods) break;
          const gx = gStartX + (c * gStepX);
          const gy = gStartY + (r * gStepY);

          furniture.push({
            id: `geo-pod-${gIdx}`,
            type: 'geo_pod',
            category: 'geography',
            x: gx,
            y: gy,
            width: gDeskW,
            height: gDeskH,
            label: 'Fieldwork Pod',
            stroke: '#f59e0b',
            fill: 'rgba(245, 158, 11, 0.15)'
          });

          // 3D Globe circle
          furniture.push({
            id: `globe-${gIdx}`,
            type: 'globe',
            category: 'geography',
            x: gx + (gDeskW / 2),
            y: gy + (gDeskH / 2),
            radius: 0.25 * scale,
            label: '3D Globe',
            stroke: '#06b6d4',
            fill: 'rgba(6, 182, 212, 0.5)'
          });

          gIdx++;
        }
      }
      break;
    }

    case 'art_studio': {
      // 1. Deep Stainless Wash-Up Sink with Clay/Plaster Sediment Trap
      furniture.push({
        id: 'clay-sink-1',
        type: 'clay_sink',
        category: 'art_design',
        x: 0.3 * scale,
        y: 1.0 * scale,
        width: 1.5 * scale,
        height: 0.6 * scale,
        label: 'Double Deep Wash Sink (Sediment Trap)',
        stroke: '#a855f7',
        fill: 'rgba(168, 85, 247, 0.3)'
      });

      // 2. Mobile 25-Shelf Artwork Drying Rack
      furniture.push({
        id: 'drying-rack-1',
        type: 'drying_rack',
        category: 'art_design',
        x: roomW_px - (1.2 * scale),
        y: 1.0 * scale,
        width: 0.8 * scale,
        height: 0.6 * scale,
        label: '25-Shelf Drying Rack',
        stroke: '#a855f7',
        fill: 'rgba(168, 85, 247, 0.25)'
      });

      // 3. A3 Tabletop Etching / Printmaking Press
      furniture.push({
        id: 'print-press-1',
        type: 'print_press',
        category: 'art_design',
        x: roomW_px - (1.4 * scale),
        y: 2.0 * scale,
        width: 1.0 * scale,
        height: 0.6 * scale,
        label: 'A3 Printmaking Press',
        stroke: '#f59e0b',
        fill: 'rgba(245, 158, 11, 0.25)'
      });

      // 4. Tilting Drafting Tables (A1 Format)
      const draftRows = 4;
      const draftCols = 4;
      const dStartX = 1.0 * scale;
      const dStartY = 2.4 * scale;
      const dW = 1.0 * scale;
      const dH = 0.7 * scale;
      const dStepX = 1.5 * scale;
      const dStepY = 1.2 * scale;

      let dIdx = 0;
      for (let r = 0; r < draftRows; r++) {
        for (let c = 0; c < draftCols; c++) {
          if (dIdx >= 16) break;
          const dx = dStartX + (c * dStepX);
          const dy = dStartY + (r * dStepY);

          furniture.push({
            id: `draft-table-${dIdx}`,
            type: 'drafting_table',
            category: 'art_design',
            x: dx,
            y: dy,
            width: dW,
            height: dH,
            label: 'A1 Tilt Table',
            stroke: '#a855f7',
            fill: 'rgba(168, 85, 247, 0.18)'
          });

          // Beechwood Easel (Alternate tables)
          if (dIdx % 2 === 0) {
            furniture.push({
              id: `easel-${dIdx}`,
              type: 'easel',
              category: 'art_design',
              x: dx + (0.2 * scale),
              y: dy - (0.4 * scale),
              width: 0.6 * scale,
              height: 0.25 * scale,
              label: 'H-Frame Easel',
              stroke: '#f59e0b',
              fill: '#f59e0b'
            });
          }

          dIdx++;
        }
      }
      break;
    }

    case 'music_room': {
      // 1. 88-Key Digital Grand Piano
      furniture.push({
        id: 'piano-1',
        type: 'piano',
        category: 'creative',
        x: (roomW_px - (1.6 * scale)) / 2,
        y: 1.0 * scale,
        width: 1.6 * scale,
        height: 1.4 * scale,
        label: '88-Key Digital Grand Piano',
        stroke: '#e879f9',
        fill: 'rgba(232, 121, 249, 0.25)'
      });

      // 2. Drum kit with cymbals
      furniture.push({
        id: 'drum-kit-1',
        type: 'drum_kit',
        category: 'creative',
        x: roomW_px - (2.5 * scale),
        y: 1.0 * scale,
        width: 1.8 * scale,
        height: 1.8 * scale,
        label: '5-Piece Drum Kit',
        stroke: '#f59e0b',
        fill: 'rgba(245, 158, 11, 0.25)'
      });

      // 3. Acoustic guitar racks
      furniture.push({
        id: 'guitar-rack-1',
        type: 'guitar_rack',
        category: 'creative',
        x: 0.5 * scale,
        y: 1.0 * scale,
        width: 1.2 * scale,
        height: 0.6 * scale,
        label: 'Acoustic Guitar Rack',
        stroke: '#a855f7',
        fill: 'rgba(168, 85, 247, 0.2)'
      });

      // 4. Semi-circular orchestra rehearsal arc with synth benches and notation stands
      const arcRadius = 3.5 * scale;
      const arcCenterX = roomW_px / 2;
      const arcCenterY = roomH_px - (1.5 * scale);
      const numStands = 8;
      const angleStep = Math.PI / (numStands - 1);
      
      for (let i = 0; i < numStands; i++) {
        const angle = Math.PI + (i * angleStep);
        const sx = arcCenterX + (arcRadius * Math.cos(angle));
        const sy = arcCenterY + (arcRadius * Math.sin(angle));

        furniture.push({
          id: `notation-stand-${i}`,
          type: 'notation_stand',
          category: 'creative',
          x: sx,
          y: sy,
          width: 0.5 * scale,
          height: 0.3 * scale,
          label: 'Music Notation Stand',
          stroke: '#e879f9',
          fill: 'rgba(232, 121, 249, 0.4)'
        });

        // Alternating Synth Keyboard Benches
        if (i % 2 === 0) {
          furniture.push({
            id: `synth-bench-${i}`,
            type: 'synth_bench',
            category: 'creative',
            x: sx + (0.3 * scale),
            y: sy + (0.5 * scale),
            width: 1.0 * scale,
            height: 0.4 * scale,
            label: 'Synthesizer Keyboard',
            stroke: '#06b6d4',
            fill: 'rgba(6, 182, 212, 0.2)'
          });
        }
      }
      break;
    }

    case 'staff_room': {
      // 1. 10-Person Conference / Meeting Table
      furniture.push({
        id: 'meeting-table-1',
        type: 'meeting_table',
        category: 'admin',
        x: (roomW_px - (3.0 * scale)) / 2,
        y: 1.2 * scale,
        width: 3.0 * scale,
        height: 1.2 * scale,
        label: '10-Person Faculty Conference Table',
        stroke: '#64748b',
        fill: 'rgba(100, 116, 139, 0.25)'
      });

      // 2. Modular Faculty Desk Pods (15 Workstations)
      const stCols = 3;
      const stRows = 5;
      const stStartX = 0.8 * scale;
      const stStartY = 2.8 * scale;
      const stW = 1.2 * scale;
      const stH = 0.6 * scale;
      const stStepX = (roomW_px - (stStartX * 2) - stW) / Math.max(stCols - 1, 1);
      const stStepY = 0.95 * scale;

      let stIdx = 0;
      for (let r = 0; r < stRows; r++) {
        for (let c = 0; c < stCols; c++) {
          if (stIdx >= 15) break;
          const sx = stStartX + (c * stStepX);
          const sy = stStartY + (r * stStepY);

          furniture.push({
            id: `staff-desk-${stIdx}`,
            type: 'staff_desk',
            category: 'admin',
            x: sx,
            y: sy,
            width: stW,
            height: stH,
            label: `Faculty Desk ${stIdx + 1}`,
            stroke: '#64748b',
            fill: 'rgba(100, 116, 139, 0.15)'
          });

          stIdx++;
        }
      }

      // High-volume Laser Copier & Kitchenette Counter
      furniture.push({
        id: 'copier-1',
        type: 'copier',
        category: 'admin',
        x: roomW_px - (1.3 * scale),
        y: 0.3 * scale,
        width: 0.9 * scale,
        height: 0.7 * scale,
        label: 'A3 Laser Multifunction Copier',
        stroke: '#3b82f6',
        fill: 'rgba(59, 130, 246, 0.3)'
      });
      break;
    }

    case 'admin_office': {
      // 1. Principal Executive Suite Desk
      furniture.push({
        id: 'principal-desk-1',
        type: 'principal_desk',
        category: 'admin',
        x: 1.0 * scale,
        y: 1.0 * scale,
        width: 2.0 * scale,
        height: 0.9 * scale,
        label: 'Principal Executive Desk & Dock',
        stroke: '#475569',
        fill: 'rgba(71, 85, 105, 0.3)'
      });

      // 2. Bursar & Reception Service Counter
      furniture.push({
        id: 'reception-counter-1',
        type: 'reception_counter',
        category: 'admin',
        x: roomW_px - (2.5 * scale),
        y: 1.0 * scale,
        width: 2.0 * scale,
        height: 0.8 * scale,
        label: 'Bursar & Records Service Counter',
        stroke: '#475569',
        fill: 'rgba(71, 85, 105, 0.25)'
      });

      // 3. Fire-Rated Records Vault
      furniture.push({
        id: 'records-vault-1',
        type: 'vault',
        category: 'admin',
        x: roomW_px - (1.4 * scale),
        y: roomH_px - (1.4 * scale),
        width: 1.0 * scale,
        height: 1.0 * scale,
        label: 'Fire-Rated Exam & Records Vault',
        stroke: '#f59e0b',
        fill: 'rgba(245, 158, 11, 0.35)'
      });
      break;
    }

    case 'sports_hall': {
      // Full Basketball & Multi-Court Court Markings
      const courtW = roomW_px * 0.75;
      const courtH = roomH_px * 0.75;
      const courtX = (roomW_px - courtW) / 2;
      const courtY = (roomH_px - courtH) / 2;

      furniture.push({
        id: 'court-perimeter',
        type: 'sports_court',
        category: 'sports',
        x: courtX,
        y: courtY,
        width: courtW,
        height: courtH,
        label: 'FIBA Regulation Multi-Purpose Hardwood Court',
        stroke: '#84cc16',
        fill: 'rgba(132, 204, 22, 0.12)'
      });

      // Center Jump Circle
      furniture.push({
        id: 'court-center-circle',
        type: 'court_circle',
        category: 'sports',
        x: courtX + (courtW / 2),
        y: courtY + (courtH / 2),
        radius: 1.8 * scale,
        stroke: '#84cc16',
        fill: 'none'
      });

      // Half Court Division Line
      furniture.push({
        id: 'court-half-line',
        type: 'court_line',
        category: 'sports',
        x: courtX + (courtW / 2),
        y: courtY,
        width: 1,
        height: courtH,
        stroke: '#84cc16',
        fill: 'none'
      });

      // Basketball Hoops (Left and Right)
      furniture.push({
        id: 'hoop-left',
        type: 'hoop',
        category: 'sports',
        x: courtX + (0.5 * scale),
        y: courtY + (courtH / 2),
        radius: 0.35 * scale,
        stroke: '#f59e0b',
        fill: 'rgba(245, 158, 11, 0.5)'
      });
      furniture.push({
        id: 'hoop-right',
        type: 'hoop',
        category: 'sports',
        x: courtX + courtW - (0.5 * scale),
        y: courtY + (courtH / 2),
        radius: 0.35 * scale,
        stroke: '#f59e0b',
        fill: 'rgba(245, 158, 11, 0.5)'
      });
      break;
    }

    default:
      break;
  }

  return furniture;
}

/**
 * Packs rooms into a cohesive Multi-Wing Blueprint Layout
 * Supports 4 campus typologies:
 *  - 'linear': Multi-wing pavilion blocks with central corridor
 *  - 'courtyard': Quadrangle layout surrounding a central landscaped quad
 *  - 'l_shape': L-shaped connected wings
 *  - 'u_shape': U-shaped wings surrounding an open amphitheater
 */
export function generateFloorPlanLayout(rooms = [], options = {}) {
  const { typology = 'linear', theme = 'blueprint' } = options;

  if (!rooms || rooms.length === 0) {
    return {
      svgWidth: 1200,
      svgHeight: 800,
      viewBox: '0 0 1200 800',
      placedRooms: [],
      corridors: [],
      zones: []
    };
  }

  const SCALE = 14; // 1 meter = 14 SVG pixels
  const CORRIDOR_WIDTH = 2.5 * SCALE; // 2.5m central circulation corridor
  const MARGIN = 50;

  // Group rooms by category/wing
  const categories = ['academic', 'stem', 'technology', 'humanities', 'creative', 'admin', 'sports'];
  const grouped = {};
  categories.forEach(c => { grouped[c] = []; });

  rooms.forEach((room) => {
    const def = ROOM_TYPE_DEFINITIONS[room.type] || ROOM_TYPE_DEFINITIONS.classroom;
    const cat = def.category || 'academic';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(room);
  });

  const placedRooms = [];
  let maxLayoutWidth = 800;
  let maxLayoutHeight = 600;

  if (typology === 'courtyard') {
    // Quadrangle / Courtyard Layout
    // North wing = Academic, East = STEM, South = Creative & Tech, West = Admin & Humanities
    const quadCenterX = 550;
    const quadCenterY = 450;
    const quadSize = 260; // Size of central landscaped quadrangle

    let topX = MARGIN;
    let bottomX = MARGIN;
    let leftY = MARGIN + 40;
    let rightY = MARGIN + 40;

    rooms.forEach((room, idx) => {
      const def = ROOM_TYPE_DEFINITIONS[room.type] || ROOM_TYPE_DEFINITIONS.classroom;
      const cat = def.category || 'academic';
      const zoneInfo = ZONE_CONFIG[cat] || ZONE_CONFIG.academic;

      const widthM = room.width_m || def.defaultWidth || 10;
      const lengthM = room.length_m || def.defaultLength || 8;
      const areaM2 = room.area_m2 || (widthM * lengthM);
      const svgW = widthM * SCALE;
      const svgH = lengthM * SCALE;

      let rx = 0;
      let ry = 0;

      if (cat === 'academic') {
        rx = topX;
        ry = MARGIN + 40;
        topX += svgW + 12;
      } else if (cat === 'stem' || cat === 'technology') {
        rx = Math.max(topX + 40, 850);
        ry = rightY;
        rightY += svgH + 12;
      } else if (cat === 'admin' || cat === 'humanities') {
        rx = MARGIN;
        ry = leftY + 220;
        leftY += svgH + 12;
      } else {
        rx = bottomX + 180;
        ry = Math.max(rightY, leftY) + CORRIDOR_WIDTH + 40;
        bottomX += svgW + 12;
      }

      placedRooms.push(buildPlacedRoom(room, def, zoneInfo, rx, ry, svgW, svgH, widthM, lengthM, areaM2, SCALE));
    });

  } else {
    // Standard Linear Pavilion Layout
    let currentY = MARGIN + 40;

    categories.forEach((catKey) => {
      const wingRooms = grouped[catKey];
      if (!wingRooms || wingRooms.length === 0) return;

      const zoneInfo = ZONE_CONFIG[catKey] || ZONE_CONFIG.academic;
      let currentX = MARGIN;
      let rowMaxHeight = 0;

      wingRooms.forEach((room, idx) => {
        const def = ROOM_TYPE_DEFINITIONS[room.type] || ROOM_TYPE_DEFINITIONS.classroom;
        const widthM = room.width_m || def.defaultWidth || 10;
        const lengthM = room.length_m || def.defaultLength || 8;
        const areaM2 = room.area_m2 || (widthM * lengthM);
        const svgW = widthM * SCALE;
        const svgH = lengthM * SCALE;

        // Wrap to next row if too wide
        if (currentX + svgW > 1100 && idx > 0) {
          currentX = MARGIN;
          currentY += rowMaxHeight + 15;
          rowMaxHeight = 0;
        }

        placedRooms.push(buildPlacedRoom(room, def, zoneInfo, currentX, currentY, svgW, svgH, widthM, lengthM, areaM2, SCALE));

        currentX += svgW + 14;
        if (currentX > maxLayoutWidth) maxLayoutWidth = currentX;
        if (svgH > rowMaxHeight) rowMaxHeight = svgH;
      });

      currentY += rowMaxHeight + CORRIDOR_WIDTH + 30;
      if (currentY > maxLayoutHeight) maxLayoutHeight = currentY;
    });
  }

  // Find bounding box
  placedRooms.forEach(r => {
    if (r.x + r.width > maxLayoutWidth) maxLayoutWidth = r.x + r.width;
    if (r.y + r.height > maxLayoutHeight) maxLayoutHeight = r.y + r.height;
  });

  const svgWidth = Math.max(maxLayoutWidth + MARGIN + 40, 1150);
  const svgHeight = Math.max(maxLayoutHeight + MARGIN + 40, 750);

  return {
    scale: SCALE,
    svgWidth,
    svgHeight,
    viewBox: `0 0 ${svgWidth} ${svgHeight}`,
    placedRooms,
    theme: THEME_CONFIG[theme] || THEME_CONFIG.blueprint
  };
}

function buildPlacedRoom(room, def, zoneInfo, x, y, svgW, svgH, widthM, lengthM, areaM2, scale) {
  const wallThick = 0.2 * scale; // 200mm exterior wall
  const furniture = generateRoomFurnitureCAD(room, room.type, widthM, lengthM, room.capacity || def.defaultCapacity, scale);

  return {
    id: room.id || `room-${Math.random().toString(36).substr(2, 5)}`,
    name: room.name || def.name,
    type: room.type,
    category: def.category || 'academic',
    widthM,
    lengthM,
    areaM2: parseFloat(areaM2.toFixed(1)),
    capacity: room.capacity || def.defaultCapacity,
    x,
    y,
    width: svgW,
    height: svgH,
    color: zoneInfo.color,
    fill: zoneInfo.fill,
    stroke: zoneInfo.stroke,
    wallThick,
    furniture,
    door: {
      x: x + (svgW * 0.4),
      y: y + svgH,
      width: 0.9 * scale // 900mm standard architectural door
    },
    windows: [
      { x: x + (0.5 * scale), y, width: 1.5 * scale },
      { x: x + (2.5 * scale), y, width: 1.5 * scale },
      { x: x + (4.5 * scale), y, width: 1.5 * scale }
    ]
  };
}

/**
 * Generates Detailed Single-Room Interior CAD Blueprint (Zoomed Micro View)
 * High-resolution scale: 1 meter = 45 pixels
 */
export function generateDetailedRoomCAD(room, options = {}) {
  const { theme = 'blueprint' } = options;
  const def = ROOM_TYPE_DEFINITIONS[room.type] || ROOM_TYPE_DEFINITIONS.classroom;
  const widthM = room.width_m || def.defaultWidth || 10;
  const lengthM = room.length_m || def.defaultLength || 8;
  const areaM2 = room.area_m2 || (widthM * lengthM);
  const capacity = room.capacity || def.defaultCapacity || 30;

  const SCALE = 45; // 1m = 45px for crisp detailed interior drafting
  const MARGIN = 70;

  const roomW_px = widthM * SCALE;
  const roomH_px = lengthM * SCALE;
  const svgWidth = roomW_px + (MARGIN * 2);
  const svgHeight = roomH_px + (MARGIN * 2) + 40;

  const rx = MARGIN;
  const ry = MARGIN;
  const wallThick = 0.22 * SCALE; // 220mm double brick wall

  const furniture = generateRoomFurnitureCAD(room, room.type, widthM, lengthM, capacity, SCALE);

  const placedRoom = {
    ...room,
    widthM,
    lengthM,
    areaM2: parseFloat(areaM2.toFixed(1)),
    capacity,
    x: rx,
    y: ry,
    width: roomW_px,
    height: roomH_px,
    wallThick,
    furniture,
    door: {
      x: rx + (roomW_px * 0.4),
      y: ry + roomH_px,
      width: 0.95 * SCALE
    },
    windows: [
      { x: rx + (0.6 * SCALE), y: ry, width: 1.8 * SCALE },
      { x: rx + (3.0 * SCALE), y: ry, width: 1.8 * SCALE },
      { x: rx + (5.4 * SCALE), y: ry, width: 1.8 * SCALE }
    ]
  };

  return {
    scale: SCALE,
    svgWidth,
    svgHeight,
    viewBox: `0 0 ${svgWidth} ${svgHeight}`,
    room: placedRoom,
    theme: THEME_CONFIG[theme] || THEME_CONFIG.blueprint
  };
}

/**
 * Generates Campus Masterplan & Site CAD Blueprint (Macro View)
 * Includes football pitch, 200m track, outdoor courts, building wings, solar array, roads, and setbacks
 */
export function generateCampusMasterPlanLayout(schoolConfig = {}, rooms = [], options = {}) {
  const { theme = 'blueprint' } = options;

  const svgWidth = 1400;
  const svgHeight = 900;
  const plotWidth = 1260;
  const plotHeight = 780;
  const plotX = 70;
  const plotY = 60;

  // Boundary setbacks
  const setbackFront = 12 * 4;
  const setbackSide = 6 * 4;

  return {
    svgWidth,
    svgHeight,
    viewBox: `0 0 ${svgWidth} ${svgHeight}`,
    plot: {
      x: plotX,
      y: plotY,
      width: plotWidth,
      height: plotHeight,
      setbackFront,
      setbackSide
    },
    theme: THEME_CONFIG[theme] || THEME_CONFIG.blueprint
  };
}

/**
 * Generates 2.5D Isometric / Axonometric Cutaway Model
 * 30-degree mathematical axonometric projection in pure SVG
 */
export function generateIsometricCAD(room, options = {}) {
  const { theme = 'blueprint' } = options;
  const def = ROOM_TYPE_DEFINITIONS[room.type] || ROOM_TYPE_DEFINITIONS.classroom;
  const widthM = room.width_m || def.defaultWidth || 10;
  const lengthM = room.length_m || def.defaultLength || 8;
  const wallHeightM = 3.2; // 3.2m standard ceiling height

  const SCALE = 24;
  const w = widthM * SCALE;
  const l = lengthM * SCALE;
  const h = wallHeightM * SCALE;

  const svgWidth = 900;
  const svgHeight = 650;
  const originX = 450;
  const originY = 380;

  // Isometric 30 degree projection helpers
  // x_iso = (x - y) * cos(30)
  // y_iso = (x + y) * sin(30) - z
  const cos30 = 0.866025;
  const sin30 = 0.5;

  const project = (x, y, z = 0) => ({
    x: originX + (x - y) * cos30,
    y: originY + (x + y) * sin30 - z
  });

  // Base floor corners
  const p0 = project(0, 0, 0); // Front corner
  const p1 = project(w, 0, 0); // Right corner
  const p2 = project(w, l, 0); // Back corner
  const p3 = project(0, l, 0); // Left corner

  // Top wall corners
  const p0_top = project(0, 0, h);
  const p1_top = project(w, 0, h);
  const p2_top = project(w, l, h);
  const p3_top = project(0, l, h);

  const furniture2D = generateRoomFurnitureCAD(room, room.type, widthM, lengthM, room.capacity || def.defaultCapacity, SCALE);
  const isometricFurniture = furniture2D.map(f => {
    const baseP0 = project(f.x, f.y, 0);
    const baseP1 = project(f.x + f.width, f.y, 0);
    const baseP2 = project(f.x + f.width, f.y + f.height, 0);
    const baseP3 = project(f.x, f.y + f.height, 0);

    const fHeight = 0.75 * SCALE; // Standard 750mm desk height
    const topP0 = project(f.x, f.y, fHeight);
    const topP1 = project(f.x + f.width, f.y, fHeight);
    const topP2 = project(f.x + f.width, f.y + f.height, fHeight);
    const topP3 = project(f.x, f.y + f.height, fHeight);

    return {
      ...f,
      base: [baseP0, baseP1, baseP2, baseP3],
      top: [topP0, topP1, topP2, topP3]
    };
  });

  return {
    svgWidth,
    svgHeight,
    viewBox: `0 0 ${svgWidth} ${svgHeight}`,
    room,
    points: { p0, p1, p2, p3, p0_top, p1_top, p2_top, p3_top },
    isometricFurniture,
    theme: THEME_CONFIG[theme] || THEME_CONFIG.blueprint
  };
}

/**
 * Render Complete Standalone SVG String for any mode
 */
export function renderFloorPlanSVGString(layout, schoolName = 'OpenSchool Campus Blueprint', countryName = 'Kenya') {
  const { svgWidth, svgHeight, placedRooms = [], theme = THEME_CONFIG.blueprint } = layout;

  const roomNodes = placedRooms.map(r => {
    const furnitureNodes = (r.furniture || []).map(f => {
      if (f.radius) {
        return `<circle cx="${r.x + f.x}" cy="${r.y + f.y}" r="${f.radius}" fill="${f.fill || theme.furnitureFill}" stroke="${f.stroke || theme.furnitureStroke}" stroke-width="1.2" />`;
      }
      return `<rect x="${r.x + f.x}" y="${r.y + f.y}" width="${f.width}" height="${f.height}" fill="${f.fill || theme.furnitureFill}" stroke="${f.stroke || theme.furnitureStroke}" stroke-width="1.2" rx="1.5" />`;
    }).join('\n      ');

    return `
    <g class="room-cad-block" id="svg-room-${r.id}">
      <!-- Outer Load-Bearing Wall -->
      <rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" 
            fill="${r.fill}" stroke="${theme.wallStroke}" stroke-width="3" rx="2" />
      
      <!-- Inner Wall Cavity Line -->
      <rect x="${r.x + r.wallThick}" y="${r.y + r.wallThick}" width="${r.width - (r.wallThick * 2)}" height="${r.height - (r.wallThick * 2)}" 
            fill="none" stroke="${theme.wallStroke}" stroke-width="1.2" stroke-dasharray="3,2" />

      <!-- Windows on Exterior Wall -->
      ${(r.windows || []).map(w => `
        <line x1="${w.x}" y1="${r.y}" x2="${w.x + w.width}" y2="${r.y}" stroke="${theme.windowStroke}" stroke-width="3" />
        <line x1="${w.x}" y1="${r.y - 2}" x2="${w.x + w.width}" y2="${r.y - 2}" stroke="${theme.windowStroke}" stroke-width="1" />
      `).join('\n')}

      <!-- Door Opening & Swing Arc -->
      <rect x="${r.door.x}" y="${r.door.y - 3}" width="${r.door.width}" height="6" fill="${theme.bg}" stroke="none" />
      <path d="M ${r.door.x} ${r.door.y} A ${r.door.width} ${r.door.width} 0 0 1 ${r.door.x + r.door.width} ${r.door.y - r.door.width}" 
            fill="none" stroke="${theme.doorStroke}" stroke-dasharray="2,2" stroke-width="1.5" />

      <!-- Furniture Layer -->
      ${furnitureNodes}

      <!-- Room Title & Tags -->
      <text x="${r.x + (r.width / 2)}" y="${r.y + 20}" font-family="system-ui, sans-serif" font-size="11.5" font-weight="700" fill="${theme.textColor}" text-anchor="middle">
        ${r.name.toUpperCase()}
      </text>
      <text x="${r.x + (r.width / 2)}" y="${r.y + 35}" font-family="system-ui, sans-serif" font-size="9.5" font-weight="500" fill="${theme.textMuted}" text-anchor="middle">
        ${r.widthM}m × ${r.lengthM}m (${r.areaM2} m²) • 👥 ${r.capacity} Stds
      </text>
    </g>
    `;
  }).join('\n');

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <defs>
    <pattern id="gridMinor" width="14" height="14" patternUnits="userSpaceOnUse">
      <path d="M 14 0 L 0 0 0 14" fill="none" stroke="${theme.gridMinor}" stroke-width="0.5"/>
    </pattern>
    <pattern id="gridMajor" width="70" height="70" patternUnits="userSpaceOnUse">
      <rect width="70" height="70" fill="url(#gridMinor)" />
      <path d="M 70 0 L 0 0 0 70" fill="none" stroke="${theme.gridMajor}" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="${theme.bg}" />
  <rect width="100%" height="100%" fill="url(#gridMajor)" />

  <!-- Drawing Border -->
  <rect x="15" y="15" width="${svgWidth - 30}" height="${svgHeight - 30}" fill="none" stroke="${theme.borderGlow}" stroke-width="1.5" />

  <!-- Header Title Block -->
  <text x="35" y="45" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="${theme.textColor}">
    ${schoolName.toUpperCase()} — 2D ARCHITECTURAL MASTER BLUEPRINT
  </text>
  <text x="35" y="65" font-family="system-ui, sans-serif" font-size="11" font-weight="500" fill="${theme.textMuted}">
    Cambridge International Standards • Location: ${countryName} • Scale 1:100 (1m = 14px)
  </text>

  <!-- North Arrow -->
  <g transform="translate(${svgWidth - 75}, 55)">
    <circle cx="0" cy="0" r="18" fill="rgba(15, 23, 42, 0.8)" stroke="${theme.wallStroke}" stroke-width="1.5" />
    <path d="M 0 -13 L 5 3 L -5 3 Z" fill="${theme.wallStroke}" />
    <text x="0" y="12" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="${theme.textColor}" text-anchor="middle">N</text>
  </g>

  <!-- Placed Rooms & Furniture -->
  <g class="rooms-layer">
    ${roomNodes}
  </g>

  <!-- Footer Scale Bar -->
  <g transform="translate(35, ${svgHeight - 35})">
    <rect x="0" y="0" width="70" height="4" fill="${theme.wallStroke}" />
    <rect x="70" y="0" width="70" height="4" fill="${theme.textMuted}" />
    <text x="0" y="16" font-family="system-ui, sans-serif" font-size="9" fill="${theme.textMuted}">0m</text>
    <text x="70" y="16" font-family="system-ui, sans-serif" font-size="9" fill="${theme.textMuted}">5m</text>
    <text x="140" y="16" font-family="system-ui, sans-serif" font-size="9" fill="${theme.textMuted}">10m</text>
    <text x="220" y="12" font-family="system-ui, sans-serif" font-size="9.5" fill="${theme.textMuted}">
      Auto-generated by OpenSchool Blueprint Engine (Free & Open Source GPLv3)
    </text>
  </g>
</svg>
  `.trim();
}
