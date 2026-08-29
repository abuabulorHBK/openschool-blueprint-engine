import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateWeasyPrintHTML } from '../src/engine/weasyprint-generator.js';

describe('WeasyPrint & HTML Print Engine', () => {
  const mockConfig = {
    name: 'Kilifi Cambridge Secondary Academy',
    location: 'Kilifi County',
    countryCode: 'KE',
    currency: 'KES',
    totalStudents: 500,
    notes: 'As a helpful assistant, here is a comprehensive breakdown of our campus.'
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

  it('generates valid standalone HTML with CSS @page media rules', () => {
    const html = generateWeasyPrintHTML(mockConfig, mockRooms, { sanitizeSlop: true });

    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('@page {'));
    assert.ok(html.includes('size: A4 portrait;'));
    assert.ok(html.includes('Kilifi Cambridge Secondary Academy'));
    assert.ok(!html.includes('As a helpful assistant'));
    assert.ok(html.includes('Classroom 1'));
  });
});
