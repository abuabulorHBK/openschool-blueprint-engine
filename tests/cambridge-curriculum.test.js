import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CAMBRIDGE_LEVELS,
  CAMBRIDGE_SUBJECTS,
  getDefaultStaffingPlan,
  computeStaffingRequirements
} from '../src/data/cambridge-curriculum.js';

describe('Cambridge Curriculum & Faculty Staffing Model', () => {
  it('CAMBRIDGE_LEVELS defines all curriculum tiers', () => {
    assert.ok(CAMBRIDGE_LEVELS.igcse);
    assert.ok(CAMBRIDGE_LEVELS.a_level);
    assert.ok(CAMBRIDGE_LEVELS.combined);
    assert.ok(CAMBRIDGE_LEVELS.stem);
  });

  it('CAMBRIDGE_SUBJECTS contains valid Cambridge syllabus entries', () => {
    assert.ok(CAMBRIDGE_SUBJECTS.length >= 7);
    CAMBRIDGE_SUBJECTS.forEach(s => {
      assert.ok(s.id);
      assert.ok(s.name);
      assert.ok(s.category);
      assert.ok(s.weeklyPeriods > 0);
    });
  });

  it('computeStaffingRequirements calculates teacher counts and desk capacity audit', () => {
    const mockRooms = [
      { id: '1', type: 'classroom', capacity: 40 },
      { id: '2', type: 'physics_lab', capacity: 30 },
      { id: '3', type: 'staff_room', capacity: 25 }
    ];

    const staffingPlan = getDefaultStaffingPlan('igcse', 500, mockRooms);
    const audit = computeStaffingRequirements(staffingPlan, 500, mockRooms);

    assert.ok(audit.totalTeachingStaff > 0);
    assert.ok(audit.totalSupportStaff > 0);
    assert.ok(audit.totalFacultyAndStaff > 0);
    assert.equal(audit.staffDeskCapacity, 25);
    assert.ok(typeof audit.isDeskSufficient === 'boolean');
    assert.ok(parseFloat(audit.overallRatio) > 0);
  });
});
