import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateTypstDossier } from '../src/engine/typst-generator.js';

describe('Typst Generator Engine', () => {
  const mockConfig = {
    name: 'Kilifi Cambridge Secondary Academy',
    location: 'Kilifi County',
    countryCode: 'KE',
    currency: 'KES',
    totalStudents: 500,
    notes: 'As an AI language model, this school serves as a cornerstone of learning.'
  };

  const mockRooms = [
    {
      id: 'rm-1',
      name: 'Classroom 1',
      type: 'classroom',
      width_m: 10,
      length_m: 8,
      area_m2: 80,
      capacity: 40,
      equipment: [
        { id: 'eq-1', name: 'Dual Student Desk', basePriceUSD: 85, quantity: 20 }
      ]
    }
  ];

  it('generates compilable Typst markup source', () => {
    const typst = generateTypstDossier(mockConfig, mockRooms, { sanitizeSlop: true });

    assert.ok(typst.includes('#set page('));
    assert.ok(typst.includes('#set text('));
    assert.ok(typst.includes('Kilifi Cambridge Secondary Academy'));
    assert.ok(!typst.includes('As an AI language model'));
    assert.ok(typst.includes('Classroom 1'));
  });
});
