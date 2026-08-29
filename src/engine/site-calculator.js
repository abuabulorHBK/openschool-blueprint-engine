/**
 * Site Planning & Land Requirement Engine
 * Calculates total campus footprint, outdoor athletic zones, circulation, and boundary setbacks.
 */

import { SITE_PLANNING_STANDARDS } from '../data/floor-area-ratios.js';

export function calculateSiteRequirements(rooms = [], targetEnrollment = 500, customOptions = {}) {
  const std = SITE_PLANNING_STANDARDS;
  
  // Calculate total gross building floor area
  const totalFloorAreaM2 = rooms.reduce((sum, room) => {
    const area = room.area_m2 || (room.width_m * room.length_m) || 80;
    return sum + area;
  }, 0);

  // Assuming 1 to 2-story building typology (default ground footprint factor = 0.75 for 1-2 story mixed)
  const storiesFactor = customOptions.buildingStories === 2 ? 0.55 : (customOptions.buildingStories === 3 ? 0.38 : 0.85);
  const buildingGroundFootprintM2 = totalFloorAreaM2 * storiesFactor;

  // Recommended minimum total site area (based on enrollment norm: 25 m2 per student)
  const normSiteAreaM2 = Math.max(targetEnrollment * std.minPlotAreaPerStudent, 6000);

  // Outdoor facilities space
  const includeFootballPitch = customOptions.includeFootballPitch !== false;
  const includeAthleticsTrack = customOptions.includeAthleticsTrack !== false;
  const includeBasketballCourt = customOptions.includeBasketballCourt !== false;

  const footballPitchAreaM2 = includeFootballPitch ? std.pitchStandardAreaM2 : 0;
  const athleticsTrackAreaM2 = includeAthleticsTrack ? std.athleticsTrackAreaM2 : 0;
  const outdoorCourtsAreaM2 = includeBasketballCourt ? 800 : 0;

  const totalSportsFacilitiesM2 = footballPitchAreaM2 + athleticsTrackAreaM2 + outdoorCourtsAreaM2;

  // Circulation, assembly quadrangle & parking
  const assemblyQuadrangleM2 = Math.max(targetEnrollment * 1.2, 400);
  const parkingAndRoadsM2 = buildingGroundFootprintM2 * 0.40;

  // Minimum required land area
  const rawTotalLandM2 = buildingGroundFootprintM2 + totalSportsFacilitiesM2 + assemblyQuadrangleM2 + parkingAndRoadsM2;
  // Apply setback & boundary buffer (approx 15%)
  const recommendedLandAreaM2 = Math.max(rawTotalLandM2 * 1.15, normSiteAreaM2);
  
  const landAreaHectares = recommendedLandAreaM2 / 10000;
  const landAreaAcres = recommendedLandAreaM2 / 4046.86;

  // Ground coverage percentage
  const groundCoverageRatio = (buildingGroundFootprintM2 / recommendedLandAreaM2) * 100;
  const sportsAndGreenRatio = ((totalSportsFacilitiesM2 + assemblyQuadrangleM2) / recommendedLandAreaM2) * 100;
  const circulationRatio = 100 - groundCoverageRatio - sportsAndGreenRatio;

  return {
    totalFloorAreaM2: parseFloat(totalFloorAreaM2.toFixed(1)),
    buildingGroundFootprintM2: parseFloat(buildingGroundFootprintM2.toFixed(1)),
    recommendedLandAreaM2: parseFloat(recommendedLandAreaM2.toFixed(0)),
    landAreaHectares: parseFloat(landAreaHectares.toFixed(2)),
    landAreaAcres: parseFloat(landAreaAcres.toFixed(2)),
    ratios: {
      groundCoverageRatio: parseFloat(groundCoverageRatio.toFixed(1)),
      sportsAndGreenRatio: parseFloat(sportsAndGreenRatio.toFixed(1)),
      circulationRatio: parseFloat(circulationRatio.toFixed(1))
    },
    facilities: {
      footballPitchAreaM2,
      athleticsTrackAreaM2,
      outdoorCourtsAreaM2,
      assemblyQuadrangleM2,
      parkingAndRoadsM2
    },
    setbacks: {
      front: std.frontSetbackMeters,
      side: std.sideSetbackMeters,
      rear: std.rearSetbackMeters
    }
  };
}
