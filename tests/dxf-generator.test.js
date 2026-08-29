import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateFloorPlanDXF } from '../src/engine/dxf-generator.js';

describe('AutoCAD DXF Generator Engine', () => {
  it('generates standard R12/2000 ASCII DXF with valid tables and entities', () => {
    const mockLayout = {
      placedRooms: [
        {
          id: 'rm-1',
          name: 'Physics Lab',
          x: 50,
          y: 60,
          width: 140,
          height: 112,
          widthM: 10,
          lengthM: 8,
          areaM2: 80,
          capacity: 30,
          door: { x: 50, y: 150, width: 14 },
          furniture: [
            { x: 10, y: 20, width: 30, height: 15, label: 'Demo Bench' }
          ]
        }
      ],
      svgWidth: 1000,
      svgHeight: 800
    };

    const dxf = generateFloorPlanDXF(mockLayout, 'Kilifi Academy', 'Kenya');

    // Check CAD headers
    assert.ok(dxf.includes('SECTION\n2\nHEADER'));
    assert.ok(dxf.includes('$ACADVER\n1\nAC1009'));
    assert.ok(dxf.includes('TABLE\n2\nLAYER'));
    assert.ok(dxf.includes('WALLS'));
    assert.ok(dxf.includes('DOORS'));
    assert.ok(dxf.includes('WINDOWS'));
    assert.ok(dxf.includes('FURNITURE'));
    assert.ok(dxf.includes('DIMENSIONS'));
    assert.ok(dxf.includes('ANNOTATIONS'));

    // Check entities section
    assert.ok(dxf.includes('SECTION\n2\nENTITIES'));
    assert.ok(dxf.includes('Physics Lab'));
    assert.ok(dxf.includes('Demo Bench'));
    assert.ok(dxf.includes('EOF'));
  });
});
