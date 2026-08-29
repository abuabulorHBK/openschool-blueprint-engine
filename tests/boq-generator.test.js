import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateBoQTable,
  generateBoQCSV,
  generateProjectJSON
} from '../src/engine/boq-generator.js';

describe('Bill of Quantities (BoQ) Generation Engine', () => {
  const mockConfig = {
    name: 'Kilifi Model Academy',
    countryCode: 'KE',
    currency: 'KES',
    totalStudents: 500
  };

  const mockRooms = [
    {
      id: 'rm-1',
      name: 'Classroom 1',
      type: 'classroom',
      width_m: 10,
      length_m: 8,
      area_m2: 80,
      equipment: [
        { id: 'eq-1', name: 'Dual Student Desk', spec: 'Steel frame + Beech Top', category: 'furniture', basePriceUSD: 85, quantity: 20, unit: 'set' },
        { id: 'eq-2', name: 'Teacher Executive Chair', spec: 'Ergonomic Mesh', category: 'furniture', basePriceUSD: 120, quantity: 1, unit: 'piece' }
      ]
    }
  ];

  it('generateBoQTable flattens equipment and calculates totals', () => {
    const boq = generateBoQTable(mockConfig, mockRooms);
    assert.equal(boq.currencyCode, 'KES');
    assert.equal(boq.totalItems, 2);
    assert.equal(boq.items[0].itemNo, 1);
    assert.equal(boq.items[0].itemName, 'Dual Student Desk');
    assert.ok(boq.items[0].unitPriceUSD > 85);
    assert.ok(boq.grandTotalUSD > 0);
  });

  it('generateBoQCSV generates compliant CSV with headers, escaped strings, and summaries', () => {
    const csv = generateBoQCSV(mockConfig, mockRooms);
    assert.ok(csv.includes('Item_No,Room_Name,Category,Item_Description'));
    assert.ok(csv.includes('"Dual Student Desk"'));
    assert.ok(csv.includes('EQUIPMENT TOTAL (ADJUSTED)'));
    assert.ok(csv.includes('GRAND TOTAL PROJECT COST'));
    assert.ok(csv.includes('BULK IT PROCUREMENT OUTSOURCE STRATEGY'));
  });

  it('generateProjectJSON creates valid export JSON payload', () => {
    const json = generateProjectJSON(mockConfig, mockRooms);
    assert.equal(json.schemaVersion, '1.1.0');
    assert.ok(json.exportTimestamp);
    assert.equal(json.schoolConfig.name, 'Kilifi Model Academy');
    assert.equal(json.rooms.length, 1);
    assert.ok(json.itemizedBoQ.length >= 2);
  });
});
