/**
 * African Infrastructure Dataset
 * Contains empirical modifiers for Climate, Power Grid Reliability, Procurement Dependency,
 * alongside official regulatory bodies, multi-country inflation benchmarks,
 * regional material indices, and itemized classroom construction Bill of Quantities (BoQ) for Tanzania.
 */

export const CLIMATE_ZONES = {
  arid: {
    id: 'arid',
    name: 'Arid / Semi-Arid',
    modifier: 1.08,
    description: 'Extreme heat and dust require enhanced ventilation, dust seals, and heavy-duty cooling.',
    examples: 'Northern Nigeria, Egypt, Northern Kenya'
  },
  tropical: {
    id: 'tropical',
    name: 'Tropical / Humid',
    modifier: 1.05,
    description: 'High humidity and rainfall require anti-fungal treatments, dehumidification, and rust-resistant hardware.',
    examples: 'Coastal Kenya, Southern Nigeria, Ghana, Tanzania, Uganda'
  },
  coastal: {
    id: 'coastal',
    name: 'Coastal Marine',
    modifier: 1.12,
    description: 'High salinity and coastal humidity demand marine-grade 316 stainless steel, galvanized fittings, and moisture barriers.',
    examples: 'Mombasa, Dar es Salaam, Maputo, Lagos, Alexandria'
  },
  highland: {
    id: 'highland',
    name: 'Highland / Temperate',
    modifier: 1.03,
    description: 'Mild temperatures with cold seasonal nights require thermal insulation and supplementary heating provisions.',
    examples: 'Nairobi, Maseru, Johannesburg, Addis Ababa'
  }
};

export const POWER_RELIABILITY_LEVELS = {
  low: {
    id: 'low',
    name: 'Low Grid Reliability (< 50% uptime)',
    modifier: 1.15,
    description: 'Frequent blackouts; requires solar photovoltaic array, 4-8 hr battery storage, and diesel generator backup.',
    recommendation: 'Mandatory Solar Hybrid Inverter + Battery Bank'
  },
  medium: {
    id: 'medium',
    name: 'Medium Grid Reliability (50% - 85% uptime)',
    modifier: 1.08,
    description: 'Occasional load shedding; requires dedicated UPS arrays for ICT/Labs and surge protection.',
    recommendation: 'UPS Systems on Critical Labs + Voltage Stabilizers'
  },
  high: {
    id: 'high',
    name: 'High Grid Reliability (> 85% uptime)',
    modifier: 1.02,
    description: 'Stable metropolitan grid; requires standard surge arrestors and minimal emergency lighting backups.',
    recommendation: 'Standard Commercial Surge Protection'
  }
};

export const PROCUREMENT_MODIFIERS = {
  local: {
    id: 'local',
    name: 'Strong Local Manufacturing',
    modifier: 1.00,
    description: 'Direct local production of school furniture, cement, steel, and electricals with minimal import tariffs.'
  },
  medium: {
    id: 'medium',
    name: 'Mixed Import & Assembly',
    modifier: 1.05,
    description: 'Standard customs tariffs with local assembly of furniture and basic electricals.'
  },
  high: {
    id: 'high',
    name: 'High Import Dependency',
    modifier: 1.10,
    description: 'Landlocked or limited domestic industry; lab apparatus, IT, and specialized fixtures require port transit and import duty.'
  }
};

/**
 * Standard Inflation Scenarios for Quick Application
 */
export const INFLATION_SCENARIOS = [
  { id: 'cpi', name: 'Official National CPI', rate: 'auto', description: 'Selected country official benchmark inflation' },
  { id: 'zero', name: 'Zero Base (0%)', rate: 0, description: 'Direct 2026 ground-truth baseline without escalation' },
  { id: 'mod', name: 'Moderate (+5%)', rate: 5.0, description: 'Standard annual cost escalation buffer' },
  { id: 'high', name: 'High Escalation (+15%)', rate: 15.0, description: 'Remote upcountry delivery & commodity spike buffer' },
  { id: 'hyper', name: 'Volatile FX (+30%)', rate: 30.0, description: 'Currency devaluation & severe supply chain constraint' },
  { id: 'subsidized', name: 'Community Subsidized (-15%)', rate: -15.0, description: 'Direct community labor & local quarry sourcing discount' }
];

export const AFRICAN_COUNTRIES = {
  TZ: {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    currency: 'TZS',
    capital: 'Dodoma',
    defaultClimate: 'tropical',
    defaultPower: 'low',
    defaultProcurement: 'medium',
    defaultInflationRate: 3.2, // Official 2025/2026 National Bureau of Statistics (NBS) CPI
    regulatoryBody: 'MoEST (Ministry of Education, Science & Tech) & PO-RALG',
    regulatoryStandard: 'Tanzania Secondary Education Infrastructure Standards (SEIS) & SEQUIP Norms',
    standardClassroomArea: 80, // m2 (10m x 8m)
    constructionCostPerM2: {
      classroom: 195, // ~487,500 TZS/m2 ($195 USD)
      lab: 390,       // ~975,000 TZS/m2 ($390 USD)
      admin: 245,     // ~612,500 TZS/m2 ($245 USD)
      sports: 165     // ~412,500 TZS/m2 ($165 USD)
    },
    notes: 'Primary focus country. Dar es Salaam port & local manufacturing (Twiga, Dangote, Simba Cement; ALAF roofing).'
  },
  KE: {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    capital: 'Nairobi',
    defaultClimate: 'tropical',
    defaultPower: 'medium',
    defaultProcurement: 'medium',
    defaultInflationRate: 6.5, // KNBS CPI
    regulatoryBody: 'TSC (Teachers Service Commission) & MoE Kenya',
    regulatoryStandard: 'Kenya National School Infrastructure Guidelines (KNSI-2023)',
    standardClassroomArea: 80, // m2
    constructionCostPerM2: {
      classroom: 210,
      lab: 420,
      admin: 260,
      sports: 180
    },
    notes: 'Strong regional hub in Nairobi; Mombasa corridor gateway for East Africa.'
  },
  UG: {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    currency: 'UGX',
    capital: 'Kampala',
    defaultClimate: 'tropical',
    defaultPower: 'low',
    defaultProcurement: 'high',
    defaultInflationRate: 3.8, // UBOS CPI
    regulatoryBody: 'MoES (Ministry of Education & Sports)',
    regulatoryStandard: 'Uganda Basic Requirements and Minimum Standards (BRMS)',
    standardClassroomArea: 80,
    constructionCostPerM2: {
      classroom: 185,
      lab: 375,
      admin: 230,
      sports: 155
    },
    notes: 'Transit cargo via Northern Corridor; Tororo & Hima cement hubs.'
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    capital: 'Pretoria',
    defaultClimate: 'highland',
    defaultPower: 'high',
    defaultProcurement: 'local',
    defaultInflationRate: 5.2, // Stats SA CPI
    regulatoryBody: 'DBE (Department of Basic Education)',
    regulatoryStandard: 'DBE National Norms and Standards for Public School Infrastructure',
    standardClassroomArea: 80,
    constructionCostPerM2: {
      classroom: 240,
      lab: 480,
      admin: 290,
      sports: 210
    },
    notes: 'Advanced domestic supply chain; stringent SANS 10400 building codes.'
  },
  GH: {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    capital: 'Accra',
    defaultClimate: 'tropical',
    defaultPower: 'medium',
    defaultProcurement: 'medium',
    defaultInflationRate: 23.2, // GSS CPI
    regulatoryBody: 'GES (Ghana Education Service)',
    regulatoryStandard: 'Ghana Education Service Infrastructure Development Standards',
    standardClassroomArea: 80,
    constructionCostPerM2: {
      classroom: 200,
      lab: 410,
      admin: 250,
      sports: 175
    },
    notes: 'Reliable West African sea-freight gateway via Tema Port; Ghacem cement.'
  },
  NG: {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    capital: 'Abuja',
    defaultClimate: 'tropical',
    defaultPower: 'low',
    defaultProcurement: 'local',
    defaultInflationRate: 31.5, // NBS Nigeria CPI
    regulatoryBody: 'UBEC (Universal Basic Education Commission)',
    regulatoryStandard: 'UBEC Standard Minimum Academic Standards for Secondary Schools',
    standardClassroomArea: 80,
    constructionCostPerM2: {
      classroom: 195,
      lab: 390,
      admin: 240,
      sports: 165
    },
    notes: 'Massive local fabrication (Dangote, BUA); off-grid power backup mandatory.'
  },
  EG: {
    code: 'EG',
    name: 'Egypt',
    flag: '🇪🇬',
    currency: 'EGP',
    capital: 'Cairo',
    defaultClimate: 'arid',
    defaultPower: 'high',
    defaultProcurement: 'local',
    defaultInflationRate: 26.5, // CAPMAS CPI
    regulatoryBody: 'Ministry of Education and Technical Education (MOETE)',
    regulatoryStandard: 'General Authority for Educational Buildings (GAEB) Code',
    standardClassroomArea: 75,
    constructionCostPerM2: {
      classroom: 220,
      lab: 440,
      admin: 270,
      sports: 190
    },
    notes: 'Highly industrialized regional manufacturing with strong STEM school focus.'
  },
  MZ: {
    code: 'MZ',
    name: 'Mozambique',
    flag: '🇲🇿',
    currency: 'MZN',
    capital: 'Maputo',
    defaultClimate: 'coastal',
    defaultPower: 'low',
    defaultProcurement: 'high',
    defaultInflationRate: 4.2, // INE CPI
    regulatoryBody: 'MINEDH (Ministry of Education and Human Development)',
    regulatoryStandard: 'Normas de Construção Escolar de Moçambique (NCEM)',
    standardClassroomArea: 80,
    constructionCostPerM2: {
      classroom: 195,
      lab: 395,
      admin: 245,
      sports: 170
    },
    notes: 'Cyclone and coastal corrosion resilience specifications apply.'
  },
  LS: {
    code: 'LS',
    name: 'Lesotho',
    flag: '🇱🇸',
    currency: 'LSL',
    capital: 'Maseru',
    defaultClimate: 'highland',
    defaultPower: 'medium',
    defaultProcurement: 'high',
    defaultInflationRate: 6.1, // BoL CPI
    regulatoryBody: 'MoET (Ministry of Education and Training)',
    regulatoryStandard: 'Lesotho Education Sector Infrastructure Norms',
    standardClassroomArea: 75,
    constructionCostPerM2: {
      classroom: 215,
      lab: 430,
      admin: 265,
      sports: 185
    },
    notes: 'Highland altitude winter heating insulation essential; SACU tariff union.'
  }
};

/**
 * Key Construction Material Unit Indices (2025/2026 Baseline in USD)
 * Sourced from national quantity surveying boards and empirical retail audits.
 */
export const COUNTRY_MATERIAL_INDICES = {
  TZ: {
    cementBag50kg: 7.00,       // TZS 17,500
    rebarY12_12m: 9.40,        // TZS 23,500
    rebarY10_12m: 6.60,        // TZS 16,500
    roundBarR6_coil_kg: 1.20,  // TZS 3,000/kg
    hollowBlock6inch: 0.54,    // TZS 1,350
    sand_m3: 10.30,            // TZS 25,700/m3
    ballast_m3: 14.80,         // TZS 37,000/m3
    timber_100x50_m: 1.28,     // TZS 3,200/m
    ironSheet_G28_3m: 10.40,   // TZS 26,000
    steelWindow1500x1200: 72.00, // TZS 180,000
    securityDoorSet: 140.00,   // TZS 350,000
    paint20L: 48.00,           // TZS 120,000
    masonDailyRate: 10.00,     // TZS 25,000
    unskilledDailyRate: 4.80   // TZS 12,000
  },
  KE: {
    cementBag50kg: 6.20,
    rebarY12_12m: 9.80,
    rebarY10_12m: 6.90,
    roundBarR6_coil_kg: 1.30,
    hollowBlock6inch: 0.58,
    sand_m3: 11.50,
    ballast_m3: 15.20,
    timber_100x50_m: 1.35,
    ironSheet_G28_3m: 11.00,
    steelWindow1500x1200: 78.00,
    securityDoorSet: 155.00,
    paint20L: 52.00,
    masonDailyRate: 11.50,
    unskilledDailyRate: 5.50
  },
  UG: {
    cementBag50kg: 7.20,
    rebarY12_12m: 9.10,
    rebarY10_12m: 6.40,
    roundBarR6_coil_kg: 1.25,
    hollowBlock6inch: 0.50,
    sand_m3: 9.80,
    ballast_m3: 14.00,
    timber_100x50_m: 1.20,
    ironSheet_G28_3m: 10.10,
    steelWindow1500x1200: 68.00,
    securityDoorSet: 135.00,
    paint20L: 46.00,
    masonDailyRate: 9.00,
    unskilledDailyRate: 4.20
  },
  NG: {
    cementBag50kg: 5.80,
    rebarY12_12m: 8.90,
    rebarY10_12m: 6.20,
    roundBarR6_coil_kg: 1.15,
    hollowBlock6inch: 0.48,
    sand_m3: 8.50,
    ballast_m3: 13.50,
    timber_100x50_m: 1.15,
    ironSheet_G28_3m: 9.80,
    steelWindow1500x1200: 65.00,
    securityDoorSet: 130.00,
    paint20L: 42.00,
    masonDailyRate: 8.50,
    unskilledDailyRate: 3.80
  },
  ZA: {
    cementBag50kg: 6.80,
    rebarY12_12m: 11.20,
    rebarY10_12m: 7.90,
    roundBarR6_coil_kg: 1.50,
    hollowBlock6inch: 0.72,
    sand_m3: 14.00,
    ballast_m3: 18.50,
    timber_100x50_m: 1.60,
    ironSheet_G28_3m: 13.50,
    steelWindow1500x1200: 95.00,
    securityDoorSet: 185.00,
    paint20L: 65.00,
    masonDailyRate: 18.00,
    unskilledDailyRate: 9.50
  },
  GH: {
    cementBag50kg: 6.50,
    rebarY12_12m: 9.60,
    rebarY10_12m: 6.70,
    roundBarR6_coil_kg: 1.28,
    hollowBlock6inch: 0.55,
    sand_m3: 10.80,
    ballast_m3: 14.90,
    timber_100x50_m: 1.30,
    ironSheet_G28_3m: 10.80,
    steelWindow1500x1200: 74.00,
    securityDoorSet: 148.00,
    paint20L: 50.00,
    masonDailyRate: 10.50,
    unskilledDailyRate: 5.00
  },
  EG: {
    cementBag50kg: 6.00,
    rebarY12_12m: 10.50,
    rebarY10_12m: 7.40,
    roundBarR6_coil_kg: 1.40,
    hollowBlock6inch: 0.60,
    sand_m3: 9.50,
    ballast_m3: 14.20,
    timber_100x50_m: 1.45,
    ironSheet_G28_3m: 12.00,
    steelWindow1500x1200: 85.00,
    securityDoorSet: 165.00,
    paint20L: 55.00,
    masonDailyRate: 12.00,
    unskilledDailyRate: 6.00
  },
  MZ: {
    cementBag50kg: 7.10,
    rebarY12_12m: 9.50,
    rebarY10_12m: 6.70,
    roundBarR6_coil_kg: 1.30,
    hollowBlock6inch: 0.56,
    sand_m3: 10.50,
    ballast_m3: 15.00,
    timber_100x50_m: 1.32,
    ironSheet_G28_3m: 10.60,
    steelWindow1500x1200: 73.00,
    securityDoorSet: 142.00,
    paint20L: 49.00,
    masonDailyRate: 10.00,
    unskilledDailyRate: 4.60
  },
  LS: {
    cementBag50kg: 6.90,
    rebarY12_12m: 10.80,
    rebarY10_12m: 7.60,
    roundBarR6_coil_kg: 1.45,
    hollowBlock6inch: 0.68,
    sand_m3: 13.20,
    ballast_m3: 17.50,
    timber_100x50_m: 1.52,
    ironSheet_G28_3m: 12.80,
    steelWindow1500x1200: 90.00,
    securityDoorSet: 175.00,
    paint20L: 60.00,
    masonDailyRate: 15.00,
    unskilledDailyRate: 8.00
  }
};

/**
 * Standard 80 m² Classroom Material Build-Up (Tanzania Baseline BoQ Schedule)
 * Verified against MoEST SEIS, PO-RALG, and World Bank SEQUIP tenders.
 * Base Area: 80 m² (10m length x 8m width x 3.2m height).
 */
export const TANZANIA_CLASSROOM_MATERIAL_BUILDUP = [
  // --- TRADE 1: SUBSTRUCTURE & FOUNDATION ---
  {
    category: 'substructure',
    categoryName: '1. Substructure & Foundation',
    itemCode: 'SUB-01',
    description: 'Site Excavation & Trenching for Strip Footings & Column Pits',
    spec: 'Bulk excavation in normal soil up to 1.2m depth, disposal & backfilling',
    unit: 'm³',
    quantity: 45.0,
    unitPriceUSD: 6.00,
    notes: 'Includes pit leveling and hand compaction'
  },
  {
    category: 'substructure',
    categoryName: '1. Substructure & Foundation',
    itemCode: 'SUB-02',
    description: 'Hardcore Quarry Stone Filling & Heavy Compaction',
    spec: '150mm thick hand-packed volcanic/limestone quarry hardcore stone',
    unit: 'm³',
    quantity: 14.5,
    unitPriceUSD: 24.00,
    notes: 'Rolled & consolidated in layers'
  },
  {
    category: 'substructure',
    categoryName: '1. Substructure & Foundation',
    itemCode: 'SUB-03',
    description: 'Sand / Quarry Dust Blinding Layer',
    spec: '50mm thick clean sharp sand blinding to receive DPM',
    unit: 'm³',
    quantity: 4.8,
    unitPriceUSD: 18.00,
    notes: 'Smooth screeded over hardcore'
  },
  {
    category: 'substructure',
    categoryName: '1. Substructure & Foundation',
    itemCode: 'SUB-04',
    description: 'Damp Proof Membrane (DPM) & Anti-Termite Chemical Treatment',
    spec: '1000-gauge heavy duty polythene sheeting + Premise 200SC soil treatment',
    unit: 'm²',
    quantity: 95.0,
    unitPriceUSD: 1.20,
    notes: '150mm laps taped with bitumen mastic'
  },
  {
    category: 'substructure',
    categoryName: '1. Substructure & Foundation',
    itemCode: 'SUB-05',
    description: 'Reinforced Concrete (Grade 25) in Strip Footings & Foundation Columns',
    spec: '1:1.5:3 mix, 20mm aggregate, machine vibrated into foundation trenches',
    unit: 'm³',
    quantity: 8.5,
    unitPriceUSD: 110.00,
    notes: 'Includes timber formwork'
  },
  {
    category: 'substructure',
    categoryName: '1. Substructure & Foundation',
    itemCode: 'SUB-06',
    description: 'Foundation High-Yield Rebar (Y12 / Y10 / R6 Links)',
    spec: 'BS 4449 high tensile steel bars cut, bent and tied into footing cages',
    unit: 'kg',
    quantity: 420.0,
    unitPriceUSD: 1.35,
    notes: 'Tied with 16-gauge black binding wire'
  },
  {
    category: 'substructure',
    categoryName: '1. Substructure & Foundation',
    itemCode: 'SUB-07',
    description: 'Solid Cement-Sand Foundation Walling (225mm / 9-inch)',
    spec: 'High-density solid blocks bedded in 1:3 cement mortar below ground slab',
    unit: 'm²',
    quantity: 42.0,
    unitPriceUSD: 16.50,
    notes: 'Includes flush mortar jointing'
  },
  {
    category: 'substructure',
    categoryName: '1. Substructure & Foundation',
    itemCode: 'SUB-08',
    description: 'Reinforced Concrete Ground Floor Slab (100mm) + BRC Mesh A142',
    spec: 'Grade 25 concrete cast over BRC fabric mesh with power-float finish prep',
    unit: 'm²',
    quantity: 80.0,
    unitPriceUSD: 18.50,
    notes: '100mm thick slab with perimeter edge expansion joint'
  },

  // --- TRADE 2: SUPERSTRUCTURE WALLING & COLUMNS ---
  {
    category: 'superstructure',
    categoryName: '2. Superstructure Walling & Structural Frame',
    itemCode: 'SUP-01',
    description: 'Sand-Cement Hollow Blocks (150mm / 6-inch)',
    spec: '400x200x150mm standard machine-vibrated blocks, crushing strength > 3.5N/mm²',
    unit: 'piece',
    quantity: 1350.0,
    unitPriceUSD: 0.54,
    notes: 'Twiga/Dangote cement mix'
  },
  {
    category: 'superstructure',
    categoryName: '2. Superstructure Walling & Structural Frame',
    itemCode: 'SUP-02',
    description: 'Portland Cement (Mortar, Lintels & Plaster)',
    spec: 'Twiga / Dangote 42.5N / 32.5R Portland cement (50kg bags)',
    unit: 'bag',
    quantity: 85.0,
    unitPriceUSD: 7.00,
    notes: 'Stored on raised wooden pallets'
  },
  {
    category: 'superstructure',
    categoryName: '2. Superstructure Walling & Structural Frame',
    itemCode: 'SUP-03',
    description: 'Clean Washed River Sand for Mortar & Plaster',
    spec: 'Sharp washed silica sand free of clay and organic matter',
    unit: 'm³',
    quantity: 18.0,
    unitPriceUSD: 10.30,
    notes: 'Screened through 5mm wire sieve'
  },
  {
    category: 'superstructure',
    categoryName: '2. Superstructure Walling & Structural Frame',
    itemCode: 'SUP-04',
    description: 'Reinforced Concrete Columns & Continuous Ring Beam (Grade 25)',
    spec: '200x200mm columns and 200x250mm continuous ring beam tying all walls',
    unit: 'm³',
    quantity: 6.2,
    unitPriceUSD: 115.00,
    notes: 'Includes marine plywood formwork and props'
  },
  {
    category: 'superstructure',
    categoryName: '2. Superstructure Walling & Structural Frame',
    itemCode: 'SUP-05',
    description: 'High-Yield Rebar for Columns & Ring Beam (4x Y12 + R6 @ 150mm c/c)',
    spec: 'BS 4449 deformed bars with seismic hook anchors at corners',
    unit: 'kg',
    quantity: 380.0,
    unitPriceUSD: 1.35,
    notes: 'Ensures wind-uplift and earthquake integrity'
  },

  // --- TRADE 3: ROOFING, TRUSSES & CEILING ---
  {
    category: 'roofing',
    categoryName: '3. Roofing, Structural Trusses & Ceiling',
    itemCode: 'ROOF-01',
    description: 'Treated Cypress/Pine Timber Roof Trusses (100x50mm & 75x50mm)',
    spec: 'Pressure-treated with CCA wood preservative, bolted with M12 galvanized bolts',
    unit: 'linear meter',
    quantity: 340.0,
    unitPriceUSD: 1.28,
    notes: 'Trusses spaced at 1800mm centers with wind bracing'
  },
  {
    category: 'roofing',
    categoryName: '3. Roofing, Structural Trusses & Ceiling',
    itemCode: 'ROOF-02',
    description: 'Prepainted Galvanized IT5 Box Profile Roofing Sheets (Gauge 28)',
    spec: 'ALAF / Resincot 0.40mm prepainted corrugated box profile with UV coating',
    unit: 'sheet (3m)',
    quantity: 42.0,
    unitPriceUSD: 10.40,
    notes: 'Includes 600mm eaves overhang'
  },
  {
    category: 'roofing',
    categoryName: '3. Roofing, Structural Trusses & Ceiling',
    itemCode: 'ROOF-03',
    description: 'Ridge Caps, Valley Gutters & Self-Tapping Screws with EPDM Washers',
    spec: 'Matching gauge 28 prepainted ridge rolls + rubberized neo-fasteners',
    unit: 'lot',
    quantity: 1.0,
    unitPriceUSD: 210.00,
    notes: 'Weather-tight ridge seal'
  },
  {
    category: 'roofing',
    categoryName: '3. Roofing, Structural Trusses & Ceiling',
    itemCode: 'ROOF-04',
    description: 'Fascia Board & Rainwater UPVC Gutters / Downpipes',
    spec: '225x25mm hardwood wrot fascia board + 150mm UPVC gutter collection array',
    unit: 'linear meter',
    quantity: 32.0,
    unitPriceUSD: 7.50,
    notes: 'Redirects storm water to perimeter apron'
  },
  {
    category: 'roofing',
    categoryName: '3. Roofing, Structural Trusses & Ceiling',
    itemCode: 'ROOF-05',
    description: 'Ceiling Brandering Timber & Gypsum Board Ceiling (9mm)',
    spec: '50x50mm sawn brandering @ 600mm grid + 9mm moisture-resistant gypsum boards',
    unit: 'm²',
    quantity: 80.0,
    unitPriceUSD: 11.50,
    notes: 'Includes joint tape, filler, and 600x600mm trapdoor'
  },

  // --- TRADE 4: DOORS, WINDOWS & GLAZING ---
  {
    category: 'openings',
    categoryName: '4. Doors, Windows & Glazing',
    itemCode: 'OPN-01',
    description: 'Heavy-Duty Mild Steel Casement Windows with Burglar Grills & 4mm Glass',
    spec: '1500mm x 1200mm fabricated from 25x25x3mm angle frames, burglar-proof bars',
    unit: 'unit',
    quantity: 6.0,
    unitPriceUSD: 72.00,
    notes: '6 large windows provide cross-ventilation per SEIS guidelines'
  },
  {
    category: 'openings',
    categoryName: '4. Doors, Windows & Glazing',
    itemCode: 'OPN-02',
    description: 'Solid Core Hardwood Entrance Double Door & Heavy Security Steel Grille',
    spec: '1200mm x 2100mm double leaf hardwood door + Union 3-lever mortise lockset',
    unit: 'unit',
    quantity: 1.0,
    unitPriceUSD: 140.00,
    notes: 'Includes brass hinges, rubber door stops, and padlock hasp'
  },
  {
    category: 'openings',
    categoryName: '4. Doors, Windows & Glazing',
    itemCode: 'OPN-03',
    description: 'Classroom Pinboards & Heavy-Duty Wall Chalkboard Dais Mount',
    spec: '2400x1200mm acoustic felt pinboards (2 units) + teacher dais timber trim',
    unit: 'lot',
    quantity: 1.0,
    unitPriceUSD: 110.00,
    notes: 'Mounted on side and rear walls'
  },

  // --- TRADE 5: FINISHES & PAINTING ---
  {
    category: 'finishes',
    categoryName: '5. Internal/External Finishes & Painting',
    itemCode: 'FIN-01',
    description: 'Internal & External 1:4 Cement-Sand Wall Plastering (18mm)',
    spec: 'Smooth steel-troweled wood float plaster to all masonry block surfaces',
    unit: 'm²',
    quantity: 210.0,
    unitPriceUSD: 4.20,
    notes: 'Includes arrises, reveals, and expansion cuts'
  },
  {
    category: 'finishes',
    categoryName: '5. Internal/External Finishes & Painting',
    itemCode: 'FIN-02',
    description: 'Heavy-Duty 32mm Floor Screed with Steel Trowel Hardener',
    spec: '1:3 cement-sand screed treated with anti-dusting ironite / hardener finish',
    unit: 'm²',
    quantity: 80.0,
    unitPriceUSD: 6.50,
    notes: 'High abrasion resistance for heavy student foot traffic'
  },
  {
    category: 'finishes',
    categoryName: '5. Internal/External Finishes & Painting',
    itemCode: 'FIN-03',
    description: 'Interior Vinyl Silk Emulsion Paint (3 Coats: 1 Primer + 2 Topcoats)',
    spec: 'Anti-fungal, washable silk emulsion (Crown / Coral / Goldstar brand)',
    unit: 'm²',
    quantity: 175.0,
    unitPriceUSD: 1.80,
    notes: 'Light reflective pastel cream / off-white tone'
  },
  {
    category: 'finishes',
    categoryName: '5. Internal/External Finishes & Painting',
    itemCode: 'FIN-04',
    description: 'Exterior Weatherguard Acrylic Paint & Gloss Metal Primer',
    spec: 'UV-resistant external weatherguard + zinc chromate primer on all steel windows',
    unit: 'm²',
    quantity: 115.0,
    unitPriceUSD: 2.10,
    notes: 'Resists tropical rain and sun degradation'
  },

  // --- TRADE 6: ELECTRICAL, LIGHTING & FANS ---
  {
    category: 'electrical',
    categoryName: '6. Electrical, Lighting & Mechanical Ventilation',
    itemCode: 'ELE-01',
    description: 'Flush PVC Conduiting, Junctions & 1.5mm / 2.5mm Copper Cable Wiring',
    spec: 'Single-core copper conductors inside 20mm heavy gauge PVC conduits chased into walls',
    unit: 'lot',
    quantity: 1.0,
    unitPriceUSD: 220.00,
    notes: 'Complies with TANESCO / IEE Wiring Regulations'
  },
  {
    category: 'electrical',
    categoryName: '6. Electrical, Lighting & Mechanical Ventilation',
    itemCode: 'ELE-02',
    description: 'LED 4ft Daylight Batten Fittings (40W, 4000lm)',
    spec: 'IP20 energy efficient LED tube fittings with shatterproof polycarbonate diffusers',
    unit: 'piece',
    quantity: 6.0,
    unitPriceUSD: 14.00,
    notes: 'Provides > 300 lux working illumination across desks'
  },
  {
    category: 'electrical',
    categoryName: '6. Electrical, Lighting & Mechanical Ventilation',
    itemCode: 'ELE-03',
    description: '56-Inch Industrial 3-Blade Ceiling Fans with Speed Regulators',
    spec: 'High air delivery (220 m³/min) heavy-duty ceiling fans with downrods and safety cables',
    unit: 'unit',
    quantity: 4.0,
    unitPriceUSD: 38.00,
    notes: 'Maintains optimal thermal comfort in tropical climates'
  },
  {
    category: 'electrical',
    categoryName: '6. Electrical, Lighting & Mechanical Ventilation',
    itemCode: 'ELE-04',
    description: 'Distribution Board, MCBs, 13A Twin Sockets, Switches & Earth Rod',
    spec: '8-way SPN Consumer Unit, Schneider/ABB 10A/16A MCBs, copper earth rod in pit',
    unit: 'lot',
    quantity: 1.0,
    unitPriceUSD: 180.00,
    notes: 'Includes 4 twin socket outlets for AV/projector'
  },

  // --- TRADE 7: EXTERNAL APRON & DRAINAGE ---
  {
    category: 'drainage',
    categoryName: '7. External Concrete Apron & Storm Drainage',
    itemCode: 'EXT-01',
    description: 'Perimeter Concrete Splash Apron (900mm wide x 75mm thick)',
    spec: 'Grade 20 concrete cast on compacted hardcore around classroom perimeter',
    unit: 'linear meter',
    quantity: 36.0,
    unitPriceUSD: 9.50,
    notes: 'Prevents rainwater splash erosion against foundation walls'
  },
  {
    category: 'drainage',
    categoryName: '7. External Concrete Apron & Storm Drainage',
    itemCode: 'EXT-02',
    description: 'Precast Half-Round Storm Drainage Channels (300mm)',
    spec: 'Precast concrete half-round channels laid to 1:100 fall leading to soakaway',
    unit: 'linear meter',
    quantity: 36.0,
    unitPriceUSD: 6.20,
    notes: 'Discharges roof runoff safely away from building footprint'
  }
];
