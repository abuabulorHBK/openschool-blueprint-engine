import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getActiveModifiers,
  calculateEquipmentUnitPriceUSD,
  calculateProjectFinancials,
  IMPORT_MARGIN,
  CONTINGENCY_RATE,
  DEFAULT_SITE_PREP_RATE
} from '../src/engine/cost-calculator.js';

describe('Cost Calculation Engine', () => {
  it('should verify global financial constants', () => {
    assert.equal(IMPORT_MARGIN, 0.15);
    assert.equal(CONTINGENCY_RATE, 0.10);
    assert.equal(DEFAULT_SITE_PREP_RATE, 0.06);
  });

  it('getActiveModifiers returns valid modifiers for standard country configs', () => {
    const keMods = getActiveModifiers({ countryCode: 'KE' });
    assert.equal(keMods.countryData.name, 'Kenya');
    assert.ok(keMods.combinedModifier > 0);

    const ngMods = getActiveModifiers({ countryCode: 'NG' });
    assert.equal(ngMods.countryData.name, 'Nigeria');
    assert.ok(ngMods.combinedModifier > 0);

    // Fallback for unknown country
    const fallbackMods = getActiveModifiers({ countryCode: 'UNKNOWN' });
    assert.equal(fallbackMods.countryData.code, 'TZ');
  });

  it('calculateEquipmentUnitPriceUSD applies 15% import buffer and infrastructure multipliers', () => {
    const item = { id: 'eq-1', basePriceUSD: 100 };
    const modifiers = { combinedModifier: 1.20 };
    // Base 100 * 1.15 = 115 * 1.20 = 138.00
    const price = calculateEquipmentUnitPriceUSD(item, modifiers);
    assert.equal(price, 138.00);
  });

  it('calculateProjectFinancials accurately computes rooms, construction, site prep, contingency and totals', () => {
    const config = {
      countryCode: 'KE',
      currency: 'KES',
      totalStudents: 500
    };

    const rooms = [
      {
        id: 'rm-1',
        name: 'Classroom 1',
        type: 'classroom',
        width_m: 10,
        length_m: 8,
        area_m2: 80,
        equipment: [
          { id: 'eq-desk', name: 'Student Desk', basePriceUSD: 50, quantity: 20 }
        ]
      },
      {
        id: 'rm-2',
        name: 'Physics Lab',
        type: 'physics_lab',
        width_m: 12.5,
        length_m: 8,
        area_m2: 100,
        equipment: [
          { id: 'eq-bench', name: 'Lab Bench', basePriceUSD: 200, quantity: 5 }
        ]
      }
    ];

    const financials = calculateProjectFinancials(config, rooms);

    assert.equal(financials.currencyCode, 'KES');
    assert.equal(financials.totals.totalBuildingAreaM2, 180);
    assert.ok(financials.totals.equipmentAdjustedUSD > 0);
    assert.ok(financials.totals.constructionUSD > 0);
    assert.ok(financials.totals.sitePrepUSD > 0);
    assert.ok(financials.totals.contingencyUSD > 0);
    assert.ok(financials.totals.grandTotalUSD > 0);
    assert.ok(financials.totals.grandTotalLocal > financials.totals.grandTotalUSD);
    assert.ok(financials.totals.costPerStudentUSD > 0);
    assert.equal(financials.rooms.length, 2);
  });
});
