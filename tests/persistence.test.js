import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultModelSchool } from '../src/services/persistence.js';

describe('Persistence Service & Project Templates', () => {
  it('createDefaultModelSchool builds a complete 500-student model project', () => {
    const school = createDefaultModelSchool('KE');

    assert.ok(school.id);
    assert.equal(school.countryCode, 'KE');
    assert.equal(school.currency, 'KES');
    assert.equal(school.totalStudents, 500);
    assert.ok(school.rooms.length >= 15);

    // Verify rooms have default equipment populated
    const physicsLab = school.rooms.find(r => r.type === 'physics_lab');
    assert.ok(physicsLab);
    assert.ok(physicsLab.equipment.length > 0);

    // Verify staffing plan is included
    assert.ok(school.staffingPlan);
    assert.ok(school.staffingPlan.subjects.length > 0);
  });
});
