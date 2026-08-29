/**
 * Floor Area Ratios & Spatial Engineering Benchmarks
 * Combines Cambridge International guidelines with African standard building norms.
 */

export const ROOM_TYPE_DEFINITIONS = {
  classroom: {
    id: 'classroom',
    name: 'Standard Classroom',
    category: 'academic',
    color: '#6366f1', // Indigo
    bgClass: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    minRatioPerStudent: 1.5, // m2 per student
    recommendedRatioPerStudent: 2.0,
    defaultWidth: 10.0, // meters
    defaultLength: 8.0, // meters
    defaultArea: 80.0, // m2
    defaultCapacity: 40,
    minArea: 60.0,
    constructionType: 'classroom',
    description: 'Acoustically treated general learning space with natural left-hand illumination and cross-ventilation.'
  },
  physics_lab: {
    id: 'physics_lab',
    name: 'Physics Laboratory',
    category: 'stem',
    color: '#38bdf8', // Sky
    bgClass: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    minRatioPerStudent: 2.5,
    recommendedRatioPerStudent: 3.3,
    defaultWidth: 12.5,
    defaultLength: 8.0,
    defaultArea: 100.0,
    defaultCapacity: 30,
    minArea: 85.0,
    constructionType: 'lab',
    description: 'Specialized lab with low-voltage wiring conduits, optics dark zones, and vibration-damped benches.'
  },
  chemistry_lab: {
    id: 'chemistry_lab',
    name: 'Chemistry Laboratory',
    category: 'stem',
    color: '#ec4899', // Pink
    bgClass: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
    minRatioPerStudent: 2.5,
    recommendedRatioPerStudent: 3.3,
    defaultWidth: 12.5,
    defaultLength: 8.0,
    defaultArea: 100.0,
    defaultCapacity: 30,
    minArea: 85.0,
    constructionType: 'lab',
    description: 'Heavy wet-lab with ducted fume hood extraction, acid-resistant epoxy sinks, and chemical storage.'
  },
  biology_lab: {
    id: 'biology_lab',
    name: 'Biology Laboratory',
    category: 'stem',
    color: '#10b981', // Emerald
    bgClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    minRatioPerStudent: 2.2,
    recommendedRatioPerStudent: 3.0,
    defaultWidth: 11.25,
    defaultLength: 8.0,
    defaultArea: 90.0,
    defaultCapacity: 30,
    minArea: 75.0,
    constructionType: 'lab',
    description: 'Precision biological suite with microscope stations, specimen culture preparation, and cold storage.'
  },
  ict_lab: {
    id: 'ict_lab',
    name: 'ICT / Computer Laboratory',
    category: 'technology',
    color: '#06b6d4', // Cyan
    bgClass: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    minRatioPerStudent: 2.0,
    recommendedRatioPerStudent: 2.6,
    defaultWidth: 10.0,
    defaultLength: 8.0,
    defaultArea: 80.0,
    defaultCapacity: 30,
    minArea: 65.0,
    constructionType: 'lab',
    description: 'Climate-controlled computer room with raised/anti-static flooring, surge suppression, and dedicated server rack.'
  },
  geography_room: {
    id: 'geography_room',
    name: 'Geography Map & Globe Room',
    category: 'humanities',
    color: '#f59e0b', // Amber
    bgClass: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    minRatioPerStudent: 1.8,
    recommendedRatioPerStudent: 2.0,
    defaultWidth: 8.75,
    defaultLength: 8.0,
    defaultArea: 70.0,
    defaultCapacity: 35,
    minArea: 60.0,
    constructionType: 'classroom',
    description: 'Interactive spatial learning hub with large-format map rails, 3D globes, and meteorological displays.'
  },
  art_studio: {
    id: 'art_studio',
    name: 'Art & Design Studio',
    category: 'creative',
    color: '#a855f7', // Purple
    bgClass: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    minRatioPerStudent: 2.5,
    recommendedRatioPerStudent: 3.2,
    defaultWidth: 10.0,
    defaultLength: 8.0,
    defaultArea: 80.0,
    defaultCapacity: 25,
    minArea: 70.0,
    constructionType: 'classroom',
    description: 'Open-plan creative studio with high-CRI natural lighting, drying racks, easels, and dual wash sinks.'
  },
  music_room: {
    id: 'music_room',
    name: 'Music & Performing Arts Studio',
    category: 'creative',
    color: '#e879f9', // Fuchsia
    bgClass: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300',
    minRatioPerStudent: 2.0,
    recommendedRatioPerStudent: 2.5,
    defaultWidth: 10.0,
    defaultLength: 8.0,
    defaultArea: 80.0,
    defaultCapacity: 25,
    minArea: 60.0,
    constructionType: 'classroom',
    description: 'Acoustically treated studio for music rehearsal, instrument storage, and performance practice with sound insulation.'
  },
  staff_room: {
    id: 'staff_room',
    name: 'Staff Room & Faculty Lounge',
    category: 'admin',
    color: '#64748b', // Slate
    bgClass: 'bg-slate-500/10 border-slate-500/30 text-slate-300',
    minRatioPerStudent: 4.0, // per staff member
    recommendedRatioPerStudent: 5.0,
    defaultWidth: 10.0,
    defaultLength: 7.0,
    defaultArea: 70.0,
    defaultCapacity: 15,
    minArea: 40.0,
    constructionType: 'admin',
    description: 'Faculty workspace with private workstations, kitchenette, lockers, and informal conference area.'
  },
  admin_office: {
    id: 'admin_office',
    name: 'Administration & Principal Suite',
    category: 'admin',
    color: '#475569', // Slate dark
    bgClass: 'bg-slate-500/10 border-slate-500/30 text-slate-300',
    minRatioPerStudent: 6.0, // per desk
    recommendedRatioPerStudent: 8.0,
    defaultWidth: 8.0,
    defaultLength: 6.0,
    defaultArea: 48.0,
    defaultCapacity: 6,
    minArea: 30.0,
    constructionType: 'admin',
    description: 'Administrative core housing principal office, bursar, secure records vault, and reception.'
  },
  sports_hall: {
    id: 'sports_hall',
    name: 'Multi-Purpose Indoor Sports Hall',
    category: 'sports',
    color: '#84cc16', // Lime
    bgClass: 'bg-lime-500/10 border-lime-500/30 text-lime-300',
    minRatioPerStudent: 1.0,
    recommendedRatioPerStudent: 2.0,
    defaultWidth: 20.0,
    defaultLength: 20.0,
    defaultArea: 400.0,
    defaultCapacity: 200,
    minArea: 250.0,
    constructionType: 'sports',
    description: 'High-ceiling steel portal frame hall marked for basketball, volleyball, badminton, and whole-school assemblies.'
  }
};

/**
 * Calculate recommended room dimensions (width, length, area) from target student capacity
 * while preserving the room's aspect ratio and meeting Cambridge ratio standards.
 */
export function calculateDimensionsFromCapacity(roomType, capacity, currentWidth, currentLength) {
  const def = ROOM_TYPE_DEFINITIONS[roomType] || ROOM_TYPE_DEFINITIONS.classroom;
  const targetCapacity = Math.max(1, parseInt(capacity, 10) || def.defaultCapacity);
  
  // Calculate target area based on Cambridge recommended ratio per student
  const ratio = def.recommendedRatioPerStudent || 2.0;
  const targetArea = Math.max(def.minArea, targetCapacity * ratio);

  // Aspect ratio (width / length)
  const defaultRatio = (def.defaultWidth && def.defaultLength) ? (def.defaultWidth / def.defaultLength) : 1.25;
  const aspect = (currentWidth && currentLength && currentLength > 0) 
    ? (currentWidth / currentLength) 
    : defaultRatio;

  // area = width * length = (aspect * length) * length = aspect * length^2
  // length = sqrt(area / aspect)
  let length_m = Math.sqrt(targetArea / aspect);
  let width_m = aspect * length_m;

  // Round to nearest 0.25m for practical construction increments
  length_m = Math.max(4.0, Math.round(length_m * 4) / 4);
  width_m = Math.max(4.0, Math.round(width_m * 4) / 4);
  const area_m2 = parseFloat((width_m * length_m).toFixed(1));

  return {
    width_m,
    length_m,
    area_m2
  };
}

/**
 * Calculate max compliant student capacity from floor area
 */
export function calculateCapacityFromDimensions(roomType, width_m, length_m) {
  const def = ROOM_TYPE_DEFINITIONS[roomType] || ROOM_TYPE_DEFINITIONS.classroom;
  const area = (width_m || def.defaultWidth) * (length_m || def.defaultLength);
  const ratio = def.recommendedRatioPerStudent || 2.0;
  return Math.max(1, Math.floor(area / ratio));
}

export const SITE_PLANNING_STANDARDS = {
  minPlotAreaPerStudent: 25, // m2 of land per student (standard secondary school)
  builtFootprintRatio: 0.35, // 35% max building ground coverage
  greenAndSportsRatio: 0.45, // 45% minimum outdoor sports and green area
  circulationAndParkingRatio: 0.20, // 20% internal roads, paths, parking
  frontSetbackMeters: 12.0, // Distance from road boundary
  sideSetbackMeters: 6.0,
  rearSetbackMeters: 6.0,
  pitchStandardAreaM2: 4050, // Standard 90m x 45m football pitch
  athleticsTrackAreaM2: 3200 // 200m 4-lane track
};
