import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateRoomFurnitureCAD,
  generateFloorPlanLayout,
  generateCampusMasterPlanLayout,
  generateIsometricCAD,
  renderFloorPlanSVGString,
  ZONE_CONFIG,
  THEME_CONFIG
} from '../src/engine/floor-plan-generator.js';

describe('Architectural CAD & Floor Plan Generator', () => {
  it('exports valid themes and zone configurations', () => {
    assert.ok(THEME_CONFIG.blueprint);
    assert.ok(THEME_CONFIG.dark);
    assert.ok(THEME_CONFIG.light);
    assert.ok(ZONE_CONFIG.academic);
    assert.ok(ZONE_CONFIG.stem);
    assert.ok(ZONE_CONFIG.technology);
  });

  it('generateRoomFurnitureCAD populates parametric furniture for classrooms and laboratories', () => {
    // Classroom
    const classroom = { id: 'rm-1', type: 'classroom', capacity: 40 };
    const furnitureCls = generateRoomFurnitureCAD(classroom, 'classroom', 10, 8, 40);
    assert.ok(furnitureCls.length > 5);
    assert.ok(furnitureCls.some(f => f.type === 'whiteboard'));
    assert.ok(furnitureCls.some(f => f.type === 'teacher_desk'));
    assert.ok(furnitureCls.some(f => f.type === 'student_desk'));

    // Physics Lab
    const physicsLab = { id: 'rm-2', type: 'physics_lab', capacity: 30 };
    const furnitureLab = generateRoomFurnitureCAD(physicsLab, 'physics_lab', 12.5, 8, 30);
    assert.ok(furnitureLab.some(f => f.type === 'lab_bench' || f.category === 'laboratory'));

    // Sports Hall
    const sportsHall = { id: 'rm-3', type: 'sports_hall', capacity: 200 };
    const furnitureSports = generateRoomFurnitureCAD(sportsHall, 'sports_hall', 20, 20, 200);
    assert.ok(furnitureSports.some(f => f.type.startsWith('court') || f.type.startsWith('hoop')));
  });

  it('generateFloorPlanLayout positions rooms across pavilions and typologies', () => {
    const mockRooms = [
      { id: '1', name: 'Classroom 1', type: 'classroom', width_m: 10, length_m: 8, capacity: 40 },
      { id: '2', name: 'Physics Lab', type: 'physics_lab', width_m: 12.5, length_m: 8, capacity: 30 },
      { id: '3', name: 'Staff Room', type: 'staff_room', width_m: 10, length_m: 7, capacity: 20 }
    ];

    // Linear Typology
    const linearLayout = generateFloorPlanLayout(mockRooms, { typology: 'linear', theme: 'blueprint' });
    assert.equal(linearLayout.placedRooms.length, 3);
    assert.ok(linearLayout.svgWidth >= 1000);
    assert.ok(linearLayout.svgHeight >= 600);

    // Courtyard Typology
    const courtyardLayout = generateFloorPlanLayout(mockRooms, { typology: 'courtyard', theme: 'dark' });
    assert.equal(courtyardLayout.placedRooms.length, 3);
  });

  it('generateIsometricCAD generates 3D axonometric projection vertices', () => {
    const room = { id: 'rm-iso', type: 'classroom', width_m: 10, length_m: 8, capacity: 40 };
    const iso = generateIsometricCAD(room, { theme: 'blueprint' });
    assert.ok(iso.points.p0);
    assert.ok(iso.points.p1);
    assert.ok(iso.points.p2);
    assert.ok(iso.points.p3);
    assert.ok(iso.points.p0_top);
    assert.ok(Array.isArray(iso.isometricFurniture));
  });

  it('generateCampusMasterPlanLayout builds campus plot coordinates', () => {
    const masterPlan = generateCampusMasterPlanLayout({}, [], { theme: 'light' });
    assert.ok(masterPlan.plot.width > 1000);
    assert.ok(masterPlan.plot.setbackFront > 0);
  });

  it('renderFloorPlanSVGString outputs complete standalone SVG markup', () => {
    const mockRooms = [
      { id: '1', name: 'Classroom 1', type: 'classroom', width_m: 10, length_m: 8, capacity: 40 }
    ];
    const layout = generateFloorPlanLayout(mockRooms);
    const svg = renderFloorPlanSVGString(layout, 'Kilifi Academy', 'Kenya');
    assert.ok(svg.startsWith('<svg'));
    assert.ok(svg.endsWith('</svg>'));
    assert.ok(svg.includes('KILIFI ACADEMY'));
    assert.ok(svg.includes('CLASSROOM 1'));
  });
});
