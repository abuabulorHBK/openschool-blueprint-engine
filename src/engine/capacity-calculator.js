/**
 * Capacity & Cambridge Compliance Engine
 * Analyzes room spatial dimensions, student allocations, and detects curriculum compliance flags.
 */

import { ROOM_TYPE_DEFINITIONS } from '../data/floor-area-ratios.js';

export function analyzeRoomCapacity(room) {
  const roomDef = ROOM_TYPE_DEFINITIONS[room.type] || ROOM_TYPE_DEFINITIONS.classroom;
  const area = room.area_m2 || (room.width_m * room.length_m) || roomDef.defaultArea;
  
  // Calculate maximum compliant capacity
  const maxCompliantStudents = Math.floor(area / roomDef.minRatioPerStudent);
  const recommendedStudents = Math.floor(area / roomDef.recommendedRatioPerStudent);
  const assignedCapacity = room.capacity || roomDef.defaultCapacity;

  const actualRatio = assignedCapacity > 0 ? (area / assignedCapacity) : area;

  // Compliance Flags
  const flags = [];
  let status = 'optimal'; // 'optimal' | 'warning' | 'non_compliant'

  if (area < roomDef.minArea) {
    status = 'non_compliant';
    flags.push({
      type: 'area_below_minimum',
      severity: 'error',
      message: `Total floor area (${area.toFixed(1)}m²) is below Cambridge minimum benchmark of ${roomDef.minArea}m².`
    });
  }

  if (actualRatio < roomDef.minRatioPerStudent) {
    status = 'non_compliant';
    flags.push({
      type: 'overcrowded',
      severity: 'error',
      message: `Overcrowded: ${actualRatio.toFixed(2)}m²/student is below the mandatory minimum of ${roomDef.minRatioPerStudent}m²/student.`
    });
  } else if (actualRatio < roomDef.recommendedRatioPerStudent) {
    if (status !== 'non_compliant') status = 'warning';
    flags.push({
      type: 'tight_spacing',
      severity: 'warning',
      message: `Dense allocation: ${actualRatio.toFixed(2)}m²/student is below recommended standard of ${roomDef.recommendedRatioPerStudent}m²/student.`
    });
  }

  // Lab specific group size check
  if (['physics_lab', 'chemistry_lab', 'biology_lab', 'ict_lab'].includes(room.type)) {
    if (assignedCapacity > 30) {
      if (status !== 'non_compliant') status = 'warning';
      flags.push({
        type: 'lab_cohort_size',
        severity: 'warning',
        message: `Cambridge practical exam guidelines recommend max 30 students per lab session for safety.`
      });
    }
  }

  return {
    roomId: room.id,
    area_m2: area,
    assignedCapacity,
    maxCompliantStudents,
    recommendedStudents,
    actualRatio: parseFloat(actualRatio.toFixed(2)),
    minRatio: roomDef.minRatioPerStudent,
    recommendedRatio: roomDef.recommendedRatioPerStudent,
    status,
    flags
  };
}

export function analyzeSchoolCapacity(rooms = [], targetEnrollment = 500) {
  let totalAcademicCapacity = 0;
  let totalClassrooms = 0;
  let totalLabs = 0;
  const roomAnalyses = [];
  let totalViolations = 0;
  let totalWarnings = 0;

  rooms.forEach(room => {
    const analysis = analyzeRoomCapacity(room);
    roomAnalyses.push(analysis);

    if (analysis.status === 'non_compliant') totalViolations++;
    if (analysis.status === 'warning') totalWarnings++;

    if (room.type === 'classroom') {
      totalClassrooms++;
      totalAcademicCapacity += (room.capacity || 40);
    } else if (['physics_lab', 'chemistry_lab', 'biology_lab', 'ict_lab'].includes(room.type)) {
      totalLabs++;
    }
  });

  const enrollmentCoverage = targetEnrollment > 0 ? (totalAcademicCapacity / targetEnrollment) * 100 : 0;
  const classroomDeficit = Math.max(0, Math.ceil((targetEnrollment - totalAcademicCapacity) / 40));

  return {
    targetEnrollment,
    totalAcademicCapacity,
    enrollmentCoverage: parseFloat(enrollmentCoverage.toFixed(1)),
    totalClassrooms,
    totalLabs,
    classroomDeficit,
    totalViolations,
    totalWarnings,
    isSufficientCapacity: totalAcademicCapacity >= targetEnrollment,
    roomAnalyses
  };
}
