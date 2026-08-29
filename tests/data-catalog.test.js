import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CURRENCIES, convertFromUSD, formatCurrency } from '../src/data/currencies.js';
import {
  AFRICAN_COUNTRIES,
  CLIMATE_ZONES,
  POWER_RELIABILITY_LEVELS,
  PROCUREMENT_MODIFIERS
} from '../src/data/african-infrastructure.js';
import { ROOM_TYPE_DEFINITIONS, SITE_PLANNING_STANDARDS } from '../src/data/floor-area-ratios.js';
import {
  MASTER_EQUIPMENT_ITEMS,
  EQUIPMENT_CATEGORIES,
  getDefaultEquipmentForRoomType
} from '../src/data/equipment-catalog.js';

describe('Data Catalog & Regulatory Constants', () => {
  it('CURRENCIES handles conversions and formatting', () => {
    assert.ok(CURRENCIES.USD);
    assert.ok(CURRENCIES.KES);
    assert.ok(CURRENCIES.NGN);
    assert.ok(CURRENCIES.GHS);

    const converted = convertFromUSD(100, 'KES');
    assert.ok(converted > 100);

    const formatted = formatCurrency(1234.56, 'USD');
    assert.ok(formatted.includes('1,234.56') || formatted.includes('$'));
  });

  it('AFRICAN_COUNTRIES contains valid country profiles and construction rates', () => {
    const countries = Object.keys(AFRICAN_COUNTRIES);
    assert.ok(countries.length >= 8);
    countries.forEach(code => {
      const c = AFRICAN_COUNTRIES[code];
      assert.ok(c.name);
      assert.ok(c.currency);
      assert.ok(c.constructionCostPerM2.classroom > 0);
      assert.ok(c.constructionCostPerM2.lab > 0);
    });

    assert.ok(CLIMATE_ZONES.tropical.modifier >= 1.0);
    assert.ok(POWER_RELIABILITY_LEVELS.low.modifier >= 1.0);
    assert.ok(PROCUREMENT_MODIFIERS.high.modifier >= 1.0);
  });

  it('ROOM_TYPE_DEFINITIONS adheres to Cambridge spatial minimums', () => {
    const types = Object.keys(ROOM_TYPE_DEFINITIONS);
    assert.ok(types.includes('classroom'));
    assert.ok(types.includes('physics_lab'));
    assert.ok(types.includes('chemistry_lab'));
    assert.ok(types.includes('biology_lab'));
    assert.ok(types.includes('ict_lab'));
    assert.ok(types.includes('sports_hall'));

    types.forEach(k => {
      const def = ROOM_TYPE_DEFINITIONS[k];
      assert.ok(def.minArea > 0);
      assert.ok(def.minRatioPerStudent > 0);
      assert.ok(def.recommendedRatioPerStudent >= def.minRatioPerStudent);
    });

    assert.ok(SITE_PLANNING_STANDARDS.minPlotAreaPerStudent >= 20);
  });

  it('MASTER_EQUIPMENT_ITEMS has valid pricing and structures', () => {
    assert.ok(MASTER_EQUIPMENT_ITEMS.length > 50);
    assert.ok(Object.keys(EQUIPMENT_CATEGORIES).length > 5);

    const seenIds = new Set();
    MASTER_EQUIPMENT_ITEMS.forEach(item => {
      assert.ok(item.id, 'Item must have an id');
      assert.ok(!seenIds.has(item.id), `Duplicate equipment id: ${item.id}`);
      seenIds.add(item.id);
      assert.ok(item.name, 'Item must have a name');
      assert.ok(typeof item.basePriceUSD === 'number' && item.basePriceUSD >= 0);
      assert.ok(item.category);
    });

    const defaultLabEquip = getDefaultEquipmentForRoomType('physics_lab', 30);
    assert.ok(defaultLabEquip.length > 0);
  });
});
