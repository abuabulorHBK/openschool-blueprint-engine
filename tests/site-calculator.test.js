import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSiteRequirements } from '../src/engine/site-calculator.js';

describe('Site Planning & Land Requirement Engine', () => {
  it('calculates gross floor area and ground footprint based on stories factor', () => {
    const rooms = [
      { id: '1', area_m2: 100 },
      { id: '2', area_m2: 200 },
      { id: '3', area_m2: 300 }
    ];

    const singleStory = calculateSiteRequirements(rooms, 500, { buildingStories: 1 });
    assert.equal(singleStory.totalFloorAreaM2, 600);
    assert.equal(singleStory.buildingGroundFootprintM2, 510); // 600 * 0.85

    const twoStories = calculateSiteRequirements(rooms, 500, { buildingStories: 2 });
    assert.equal(twoStories.buildingGroundFootprintM2, 330); // 600 * 0.55
  });

  it('computes sports facilities, land requirements, and setbacks', () => {
    const rooms = [{ id: '1', area_m2: 800 }];
    const site = calculateSiteRequirements(rooms, 500, {
      includeFootballPitch: true,
      includeAthleticsTrack: true,
      includeBasketballCourt: true
    });

    assert.ok(site.facilities.footballPitchAreaM2 > 0);
    assert.ok(site.facilities.athleticsTrackAreaM2 > 0);
    assert.ok(site.facilities.outdoorCourtsAreaM2 > 0);
    assert.ok(site.recommendedLandAreaM2 >= 12500); // 500 * 25 norm
    assert.ok(site.landAreaHectares > 0);
    assert.ok(site.landAreaAcres > 0);
    assert.ok(site.setbacks.front >= 6);
    assert.ok(site.ratios.groundCoverageRatio > 0);
  });
});
