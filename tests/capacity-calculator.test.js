import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeRoomCapacity,
  analyzeSchoolCapacity
} from '../src/engine/capacity-calculator.js';

describe('Capacity & Cambridge Compliance Engine', () => {
  it('analyzeRoomCapacity flags non-compliant undersized rooms', () => {
    const undersizedRoom = {
      id: 'rm-tiny',
      type: 'classroom',
      width_m: 4,
      length_m: 4,
      area_m2: 16,
      capacity: 40
    };

    const analysis = analyzeRoomCapacity(undersizedRoom);
    assert.equal(analysis.status, 'non_compliant');
    assert.ok(analysis.flags.some(f => f.type === 'area_below_minimum'));
    assert.ok(analysis.flags.some(f => f.type === 'overcrowded'));
  });

  it('analyzeRoomCapacity warns on Cambridge lab cohorts > 30', () => {
    const crowdedLab = {
      id: 'rm-lab-1',
      type: 'physics_lab',
      width_m: 12.5,
      length_m: 8,
      area_m2: 100,
      capacity: 35
    };

    const analysis = analyzeRoomCapacity(crowdedLab);
    assert.equal(analysis.status, 'warning');
    assert.ok(analysis.flags.some(f => f.type === 'lab_cohort_size'));
  });

  it('analyzeRoomCapacity validates optimal compliant room', () => {
    const compliantClassroom = {
      id: 'rm-cls-ok',
      type: 'classroom',
      width_m: 10,
      length_m: 8,
      area_m2: 80,
      capacity: 40
    };

    const analysis = analyzeRoomCapacity(compliantClassroom);
    assert.equal(analysis.status, 'optimal');
    assert.equal(analysis.flags.length, 0);
    assert.equal(analysis.actualRatio, 2.0);
  });

  it('analyzeSchoolCapacity computes aggregate totals and deficits', () => {
    const rooms = [
      { id: 'rm-1', type: 'classroom', area_m2: 80, capacity: 40 },
      { id: 'rm-2', type: 'classroom', area_m2: 80, capacity: 40 },
      { id: 'rm-3', type: 'physics_lab', area_m2: 100, capacity: 30 }
    ];

    const schoolAudit = analyzeSchoolCapacity(rooms, 160);
    assert.equal(schoolAudit.totalClassrooms, 2);
    assert.equal(schoolAudit.totalLabs, 1);
    assert.equal(schoolAudit.totalAcademicCapacity, 80);
    assert.equal(schoolAudit.enrollmentCoverage, 50.0);
    assert.equal(schoolAudit.classroomDeficit, 2);
    assert.equal(schoolAudit.isSufficientCapacity, false);
  });
});
