/**
 * Curriculum Standards & Staffing Dataset
 * Comprehensive curriculum definitions covering:
 * 1. Tanzania National Examinations Council (NECTA) - O-Level (CSEE), A-Level (ACSEE), and Combined Form 1–6
 * 2. Cambridge Assessment International Education - IGCSE, AS-Level, A-Level, and Combined Grade 7–12
 * 3. Specialized STEM & Robotics Academies, Arts/Humanities Colleges, and Vocational/TVET Institutes
 */

export const CAMBRIDGE_LEVELS = {
  // --- TANZANIA NATIONAL EXAMINATIONS COUNCIL (NECTA) TRACKS ---
  necta_csee: {
    id: 'necta_csee',
    name: 'NECTA O-Level / CSEE (Kidato cha 1–4 / Form 1–4 - Tanzania)',
    shortName: 'NECTA O-Level (CSEE)',
    curriculumGroup: 'Tanzania National (NECTA)',
    examinationBody: 'NECTA (National Examinations Council of Tanzania / Baraza la Mitihani la Tanzania)',
    description: 'Tanzania National Secondary Curriculum (Form 1–4) leading to Certificate of Secondary Education Examination (CSEE). Covers core sciences, humanities, mathematics, Kiswahili, and English.',
    practicalHoursWeekly: 4.0,
    maxLabGroupSize: 30,
    regulatoryBody: 'MoEST & PO-RALG (TAMISEMI)'
  },
  necta_acsee: {
    id: 'necta_acsee',
    name: 'NECTA A-Level / ACSEE (Kidato cha 5–6 / Form 5–6 - Tanzania)',
    shortName: 'NECTA A-Level (ACSEE)',
    curriculumGroup: 'Tanzania National (NECTA)',
    examinationBody: 'NECTA',
    description: 'Tanzania Advanced Level High School specialization combinations (PCM, PCB, PGM, CBG, HGL, HGE, EGM, HKL, ECA) with intensive laboratory practicals and General Studies.',
    practicalHoursWeekly: 5.5,
    maxLabGroupSize: 24,
    regulatoryBody: 'MoEST Tanzania'
  },
  necta_combined: {
    id: 'necta_combined',
    name: 'NECTA Complete Secondary (Kidato cha 1–6 / Form 1–6 - Tanzania)',
    shortName: 'NECTA Complete (Form 1–6)',
    curriculumGroup: 'Tanzania National (NECTA)',
    examinationBody: 'NECTA',
    description: 'Full 6-year Tanzania national secondary school pipeline covering both O-Level (CSEE) and A-Level (ACSEE) science & arts combinations.',
    practicalHoursWeekly: 4.5,
    maxLabGroupSize: 30,
    regulatoryBody: 'MoEST & PO-RALG (TAMISEMI)'
  },

  // --- CAMBRIDGE INTERNATIONAL TRACKS ---
  igcse: {
    id: 'igcse',
    name: 'Cambridge IGCSE (Ages 14–16 / Grades 9–10)',
    shortName: 'Cambridge IGCSE',
    curriculumGroup: 'Cambridge International',
    examinationBody: 'Cambridge Assessment International Education (CAIE)',
    description: 'Foundational international secondary education with compulsory laboratory practical papers.',
    practicalHoursWeekly: 3.5,
    maxLabGroupSize: 30,
    regulatoryBody: 'Cambridge International & Regional MoE'
  },
  a_level: {
    id: 'a_level',
    name: 'Cambridge International AS & A-Level (Ages 16–18 / Grades 11–12)',
    shortName: 'Cambridge AS & A-Level',
    curriculumGroup: 'Cambridge International',
    examinationBody: 'Cambridge Assessment International Education (CAIE)',
    description: 'Advanced pre-university specialization requiring dedicated advanced practical suites.',
    practicalHoursWeekly: 5.0,
    maxLabGroupSize: 24,
    regulatoryBody: 'Cambridge International'
  },
  combined: {
    id: 'combined',
    name: 'Full Cambridge Secondary (Lower Sec + IGCSE + A-Level)',
    shortName: 'Full Cambridge (Grades 7–12)',
    curriculumGroup: 'Cambridge International',
    examinationBody: 'Cambridge Assessment International Education (CAIE)',
    description: 'Comprehensive secondary pathway from Grade 7 through Grade 12.',
    practicalHoursWeekly: 4.0,
    maxLabGroupSize: 30,
    regulatoryBody: 'Cambridge International'
  },

  // --- SPECIALIZED ACADEMY TRACKS ---
  stem: {
    id: 'stem',
    name: 'STEM & Innovation Academy (Science, Robotics & Tech)',
    shortName: 'STEM & Robotics Academy',
    curriculumGroup: 'Specialized Academies',
    examinationBody: 'Hybrid / International STEM Benchmark',
    description: 'Specialized science and technology academy with high-density labs and computing suites.',
    practicalHoursWeekly: 6.0,
    maxLabGroupSize: 24,
    regulatoryBody: 'National STEM / TVET Authority'
  },
  arts_humanities: {
    id: 'arts_humanities',
    name: 'Humanities, Languages & Creative Arts College',
    shortName: 'Creative Arts & Humanities',
    curriculumGroup: 'Specialized Academies',
    examinationBody: 'International & National Arts Accreditation',
    description: 'Creative arts, social sciences, geography, and languages focus with studio workshops.',
    practicalHoursWeekly: 4.5,
    maxLabGroupSize: 25,
    regulatoryBody: 'National Education Service'
  },
  vocational_tech: {
    id: 'vocational_tech',
    name: 'Technical & Applied Vocational Secondary (VETA / TVET)',
    shortName: 'Vocational & TVET Technical',
    curriculumGroup: 'Specialized Academies',
    examinationBody: 'VETA Tanzania / National TVET Board',
    description: 'Applied computing, design technology, engineering sciences, and vocational trades.',
    practicalHoursWeekly: 5.5,
    maxLabGroupSize: 25,
    regulatoryBody: 'VETA / NACTVET'
  }
};

export const CURRICULUM_TRACKS = CAMBRIDGE_LEVELS; // Alias for generalized terminology

export const CAMBRIDGE_SUBJECTS = [
  {
    id: 'physics',
    name: 'Physics (0625 / 9702 / NECTA 031 & 131)',
    category: 'stem',
    requiredRoomType: 'physics_lab',
    weeklyPeriods: 5,
    recommendedTeacherRatio: 25,
    practicalsMandatory: true,
    practicalPaper: 'Paper 3 / Paper 5 / NECTA Paper 2A/2B/3 Practical',
    keyEquipmentRequirements: [
      'Oscilloscopes & Signal Generators',
      'Low-voltage Variable Power Supplies (0-12V AC/DC)',
      'Digital Multimeters & Galvanometers',
      'Optics ray boxes, cylindrical lenses, prisms',
      'Pulleys, force boards, ticker-tape timers / photogates',
      'Eye protection (BS EN 166)'
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry (0620 / 9701 / NECTA 032 & 132)',
    category: 'stem',
    requiredRoomType: 'chemistry_lab',
    weeklyPeriods: 5,
    recommendedTeacherRatio: 25,
    practicalsMandatory: true,
    practicalPaper: 'Paper 3 / Paper 5 / NECTA Qualitative & Volumetric Practical',
    keyEquipmentRequirements: [
      'Fume cupboard / Ducted fume hood extraction',
      'Class B Volumetric glassware (burettes, pipettes, volumetric flasks)',
      'Chemical spill neutralization kits & eye wash shower',
      'Corrosive & Flammable segregated chemical storage cabinets',
      'Bunsen burners with LPG manifold or portable gas cartridges',
      'Top-pan digital balances (0.01g & 0.001g accuracy)'
    ]
  },
  {
    id: 'biology',
    name: 'Biology (0610 / 9700 / NECTA 033 & 133)',
    category: 'stem',
    requiredRoomType: 'biology_lab',
    weeklyPeriods: 5,
    recommendedTeacherRatio: 25,
    practicalsMandatory: true,
    practicalPaper: 'Paper 3 / Paper 5 / NECTA Microscopy & Food Tests Practical',
    keyEquipmentRequirements: [
      'Monocular/Binocular Compound Microscopes (40x-1000x) with LED illumination',
      'Prepared histological and botanical slide sets',
      'Autoclave / Pressure cooker for microbiological sterilization',
      'Dissection kits & wax trays',
      'Water baths (thermostatically controlled)',
      'Biological specimen preservation display'
    ]
  },
  {
    id: 'ict',
    name: 'Computer Science / ICT (0478 / 9618 / NECTA ICS 036)',
    category: 'technology',
    requiredRoomType: 'ict_lab',
    weeklyPeriods: 4,
    recommendedTeacherRatio: 30,
    practicalsMandatory: true,
    practicalPaper: 'Hands-on practical exams (Python, SQL, Web, Networks)',
    keyEquipmentRequirements: [
      'Workstations (Core i5 / 16GB RAM / SSD minimum)',
      'Centralized Gigabit Managed Switch + Cat6 structured cabling',
      'Online Double-Conversion UPS (minimum 5kVA with battery bank)',
      'Interactive Projector / 75" Commercial Display',
      'Server rack for local caching, Git server & assessment sandbox',
      'Anti-static vinyl flooring'
    ]
  },
  {
    id: 'geography',
    name: 'Geography (0460 / 9696 / NECTA 013 & 113)',
    category: 'humanities',
    requiredRoomType: 'geography_room',
    weeklyPeriods: 4,
    recommendedTeacherRatio: 30,
    practicalsMandatory: true,
    practicalPaper: 'Paper 2 Geographical Skills / NECTA Map Reading & Surveying',
    keyEquipmentRequirements: [
      'Topographic map survey series (1:50,000 & 1:25,000)',
      'Flat-file architectural map storage drawer units',
      'Fieldwork kits (Prismatic compasses, GPS handhelds, clinometers)',
      'Weather station (Barometer, Stevenson screen, rain gauge, anemometer)',
      'Physical 3D Relief Globes & Geomorphology model sets'
    ]
  },
  {
    id: 'art',
    name: 'Art & Design (0400 / 9479 / NECTA 016)',
    category: 'creative',
    requiredRoomType: 'art_studio',
    weeklyPeriods: 4,
    recommendedTeacherRatio: 20,
    practicalsMandatory: true,
    practicalPaper: 'Coursework portfolio + practical examination',
    keyEquipmentRequirements: [
      'Heavy-duty A1 tilting art & drafting desks',
      'Studio H-frame wooden easels',
      'Multi-tier metal artwork drying racks',
      'Double deep stainless steel wash-up sinks with clay trap',
      'Printmaking etching press (A3/A2)',
      'High CRI (95+) 5000K daylight-balanced illumination'
    ]
  },
  {
    id: 'general_academic',
    name: 'Mathematics, English, Kiswahili & Civics',
    category: 'core',
    requiredRoomType: 'classroom',
    weeklyPeriods: 18,
    recommendedTeacherRatio: 35,
    practicalsMandatory: false,
    practicalPaper: 'Written theory examinations',
    keyEquipmentRequirements: [
      'Ergonomic dual or single student desks with steel powder-coated frames',
      'Magnetic porcelain-coated steel whiteboards (3600mm x 1200mm)',
      'Teacher presentation podium & desk with lockable storage',
      'Cross-ventilation ceiling fans & anti-glare high-output LED troffers'
    ]
  }
];

/**
 * School Type Profiles with tailored subject participation, ratios, and default staffing answers
 */
export const SCHOOL_STAFFING_PROFILES = {
  // --- NECTA TANZANIA PROFILES ---
  necta_csee: {
    id: 'necta_csee',
    name: 'NECTA O-Level Secondary (Form 1–4)',
    badge: 'NECTA CSEE (Form 1–4)',
    description: 'Standard Tanzania O-Level school with compulsory Basic Mathematics, English, Kiswahili, Biology, Civics, Geography, History, Physics, and Chemistry.',
    defaultSubjects: [
      { id: 'subj-necta-core', name: 'Basic Mathematics, English & Kiswahili', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 35, practicalsMandatory: false, practicalPaper: 'NECTA Written Papers 1 & 2' },
      { id: 'subj-necta-civics-hist', name: 'Civics, History & Social Studies', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 35, practicalsMandatory: false, practicalPaper: 'NECTA Written Papers' },
      { id: 'subj-necta-phy', name: 'Physics (NECTA 031)', category: 'stem', participationRatePct: 70, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'NECTA Paper 2A/2B/2C Practical' },
      { id: 'subj-necta-chem', name: 'Chemistry (NECTA 032)', category: 'stem', participationRatePct: 70, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'NECTA Paper 2A/2B/2C Volumetric & Qualitative' },
      { id: 'subj-necta-bio', name: 'Biology (NECTA 033)', category: 'stem', participationRatePct: 80, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'NECTA Paper 2A/2B/2C Microscopy & Dissection' },
      { id: 'subj-necta-geo', name: 'Geography (NECTA 013)', category: 'humanities', participationRatePct: 75, recommendedTeacherRatio: 30, practicalsMandatory: true, practicalPaper: 'NECTA Map Reading & Field Survey' },
      { id: 'subj-necta-ics', name: 'Information & Computer Studies (ICS 036)', category: 'technology', participationRatePct: 55, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'NECTA Hands-on Computer Lab Exam' },
      { id: 'subj-necta-comm', name: 'Commerce, Bookkeeping & Additional Math', category: 'core', participationRatePct: 45, recommendedTeacherRatio: 30, practicalsMandatory: false, practicalPaper: 'NECTA Written Examination' }
    ],
    defaultSupportStaff: [
      { id: 'sup-lab', title: 'Science Laboratory Technicians', formulaType: 'labs', count: 2, description: 'Prepare NECTA Advance Instructions reagents & laboratory equipment' },
      { id: 'sup-it', title: 'ICT & Computer Lab Administrator', formulaType: 'ict', count: 1, description: 'Manage computer lab, solar backup & NECTA registration portal' },
      { id: 'sup-adm', title: 'School Administration & Bursary', formulaType: 'students', count: 3, description: 'Head of school office, academic master, examinations officer & bursar' },
      { id: 'sup-lib', title: 'Librarian & Learning Resources', formulaType: 'fixed', count: 1, description: 'Curate TIE approved textbooks and secondary reference library' },
      { id: 'sup-patron', title: 'Matron / Patron & Student Welfare', formulaType: 'fixed', count: 2, description: 'Boarding facilities, counseling, and first aid health coordinator' }
    ]
  },

  necta_acsee: {
    id: 'necta_acsee',
    name: 'NECTA A-Level High School (Form 5–6)',
    badge: 'NECTA ACSEE (Form 5–6)',
    description: 'Specialized High School offering Science combinations (PCM, PCB, PGM, CBG) and Arts/Business combinations (HGL, HGE, EGM, HKL, ECA) with intensive NECTA Paper 3 practicals.',
    defaultSubjects: [
      { id: 'subj-necta-adv-sci', name: 'Advanced Physics, Chemistry & Biology (131/132/133)', category: 'stem', participationRatePct: 65, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'NECTA Paper 3 Practical Examinations' },
      { id: 'subj-necta-adv-math', name: 'Advanced Mathematics (141) & BAM', category: 'core', participationRatePct: 60, recommendedTeacherRatio: 22, practicalsMandatory: false, practicalPaper: 'NECTA Pure Math & BAM Papers' },
      { id: 'subj-necta-adv-arts', name: 'Advanced History, Geography & Economics (112/113/151)', category: 'humanities', participationRatePct: 55, recommendedTeacherRatio: 22, practicalsMandatory: true, practicalPaper: 'NECTA Geography Practical (Map & Survey)' },
      { id: 'subj-necta-adv-lang', name: 'Advanced Kiswahili & English Language (121/122)', category: 'core', participationRatePct: 40, recommendedTeacherRatio: 20, practicalsMandatory: false, practicalPaper: 'NECTA Literature & Linguistics' },
      { id: 'subj-necta-gen-studies', name: 'General Studies (GS 111)', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 35, practicalsMandatory: false, practicalPaper: 'Compulsory NECTA Paper for all combinations' },
      { id: 'subj-necta-adv-cs', name: 'Computer Science (136) & Accountancy', category: 'technology', participationRatePct: 35, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'NECTA Practical Programming Exam' }
    ],
    defaultSupportStaff: [
      { id: 'sup-lab', title: 'Senior Science Lab Technicians', formulaType: 'labs', count: 3, description: 'Titration manifolds, organic chemistry synthesis & high-voltage physics rigs' },
      { id: 'sup-it', title: 'Network & Exam Systems Administrator', formulaType: 'ict', count: 1, description: 'Manage campus high-speed network, NECTA candidate index & server systems' },
      { id: 'sup-adm', title: 'Academic Registrar & Finance Team', formulaType: 'students', count: 3, description: 'Academic master, exams officer, bursar & student records' },
      { id: 'sup-counselor', title: 'University Admissions & HESLB Counselor', formulaType: 'fixed', count: 1, description: 'TCU central admission system & higher education student loans advisor' },
      { id: 'sup-health', title: 'School Nurse & Health Officer', formulaType: 'fixed', count: 1, description: 'Campus clinic, emergency care & public health officer' }
    ]
  },

  necta_combined: {
    id: 'necta_combined',
    name: 'NECTA Complete Secondary School (Form 1–6)',
    badge: 'NECTA Form 1–6 (CSEE + ACSEE)',
    description: 'Full 6-year national secondary campus spanning Form 1 through Form 6 with comprehensive science labs and faculty allocation.',
    defaultSubjects: [
      { id: 'subj-necta-all-core', name: 'Basic & Advanced Mathematics, English & Kiswahili', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 30, practicalsMandatory: false, practicalPaper: 'NECTA CSEE & ACSEE Core Papers' },
      { id: 'subj-necta-all-phy', name: 'Physics (Form 1–6 / CSEE 031 & ACSEE 131)', category: 'stem', participationRatePct: 68, recommendedTeacherRatio: 22, practicalsMandatory: true, practicalPaper: 'NECTA Practical Progression (Papers 2 & 3)' },
      { id: 'subj-necta-all-chem', name: 'Chemistry (Form 1–6 / CSEE 032 & ACSEE 132)', category: 'stem', participationRatePct: 68, recommendedTeacherRatio: 22, practicalsMandatory: true, practicalPaper: 'NECTA Practical Progression (Papers 2 & 3)' },
      { id: 'subj-necta-all-bio', name: 'Biology (Form 1–6 / CSEE 033 & ACSEE 133)', category: 'stem', participationRatePct: 75, recommendedTeacherRatio: 22, practicalsMandatory: true, practicalPaper: 'NECTA Practical Progression (Papers 2 & 3)' },
      { id: 'subj-necta-all-geo', name: 'Geography & Environmental Studies (Form 1–6)', category: 'humanities', participationRatePct: 65, recommendedTeacherRatio: 26, practicalsMandatory: true, practicalPaper: 'Map Reading, Surveying & Fieldwork' },
      { id: 'subj-necta-all-hist', name: 'Civics, History, General Studies & Economics', category: 'humanities', participationRatePct: 80, recommendedTeacherRatio: 28, practicalsMandatory: false, practicalPaper: 'NECTA Written Examinations' },
      { id: 'subj-necta-all-ict', name: 'Information & Computer Studies (Form 1–6)', category: 'technology', participationRatePct: 60, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'Hands-on Computer Lab Exams' }
    ],
    defaultSupportStaff: [
      { id: 'sup-lab', title: 'Senior Laboratory Technicians', formulaType: 'labs', count: 3, description: 'Maintain physics, chemistry, and biology laboratory prep suites' },
      { id: 'sup-it', title: 'ICT Systems & Network Administrator', formulaType: 'ict', count: 2, description: 'Campus computer centers, solar backup & internet connectivity' },
      { id: 'sup-adm', title: 'Headmaster, Academic Masters & Bursary', formulaType: 'students', count: 4, description: 'Leadership team, O-level/A-level academic masters, registrar & bursar' },
      { id: 'sup-lib', title: 'Head Librarian & Resource Specialist', formulaType: 'fixed', count: 1, description: 'Manage library, digital past paper repository & study halls' },
      { id: 'sup-matron', title: 'Boarding Matrons, Patrons & Nurses', formulaType: 'fixed', count: 3, description: 'Hostel superintendents, student welfare & medical clinic' }
    ]
  },

  // --- CAMBRIDGE PROFILES ---
  igcse: {
    id: 'igcse',
    name: 'Standard Cambridge IGCSE',
    badge: 'IGCSE 9–10',
    description: 'Balanced secondary curriculum with core subjects, foundational science practicals, ICT, and humanities.',
    defaultSubjects: [
      { id: 'subj-core', name: 'Mathematics, English & Languages', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 35, practicalsMandatory: false, practicalPaper: 'Written Papers 1 & 2' },
      { id: 'subj-phy', name: 'Physics (0625)', category: 'stem', participationRatePct: 65, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'Paper 3/5 Practical Test' },
      { id: 'subj-chem', name: 'Chemistry (0620)', category: 'stem', participationRatePct: 65, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'Paper 3/5 Practical Test' },
      { id: 'subj-bio', name: 'Biology (0610)', category: 'stem', participationRatePct: 70, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'Paper 3/5 Practical Test' },
      { id: 'subj-ict', name: 'Computer Science / ICT (0478/0417)', category: 'technology', participationRatePct: 60, recommendedTeacherRatio: 30, practicalsMandatory: true, practicalPaper: 'Paper 2 Practical Problem-Solving' },
      { id: 'subj-geo', name: 'Geography & Environmental (0460)', category: 'humanities', participationRatePct: 50, recommendedTeacherRatio: 30, practicalsMandatory: true, practicalPaper: 'Paper 2 Fieldwork & Maps' },
      { id: 'subj-art', name: 'Art & Design (0400)', category: 'creative', participationRatePct: 40, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Component 1 Portfolio + Exam' }
    ],
    defaultSupportStaff: [
      { id: 'sup-lab', title: 'Science Laboratory Technicians', formulaType: 'labs', count: 2, description: 'Prepare chemical reagents, physics apparatus & biological specimens' },
      { id: 'sup-it', title: 'Network & ICT Systems Admin', formulaType: 'ict', count: 1, description: 'Manage lab LAN, UPS systems & Cambridge assessment sandboxes' },
      { id: 'sup-adm', title: 'Administration, Registrar & Bursary', formulaType: 'students', count: 3, description: 'Principal office, student records, finance & bursary management' },
      { id: 'sup-lib', title: 'Library & Resource Specialist', formulaType: 'fixed', count: 1, description: 'Curate reference texts, digital catalog & study hall supervision' }
    ]
  },
  a_level: {
    id: 'a_level',
    name: 'Cambridge AS & A-Level Pre-University',
    badge: 'AS / A2 Grades 11–12',
    description: 'Rigorous pre-university pathways with intensive laboratory practicals, advanced seminars, and smaller seminar groups.',
    defaultSubjects: [
      { id: 'subj-math-adv', name: 'Pure Mathematics, Statistics & Mechanics (9709)', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 22, practicalsMandatory: false, practicalPaper: 'Pure Maths & Mechanics Written Papers' },
      { id: 'subj-phy-adv', name: 'Advanced Physics (9702)', category: 'stem', participationRatePct: 55, recommendedTeacherRatio: 18, practicalsMandatory: true, practicalPaper: 'Paper 3 Advanced Practical Skills + Paper 5' },
      { id: 'subj-chem-adv', name: 'Advanced Chemistry (9701)', category: 'stem', participationRatePct: 55, recommendedTeacherRatio: 18, practicalsMandatory: true, practicalPaper: 'Paper 3 Advanced Practical Skills + Paper 5' },
      { id: 'subj-bio-adv', name: 'Advanced Biology (9700)', category: 'stem', participationRatePct: 50, recommendedTeacherRatio: 18, practicalsMandatory: true, practicalPaper: 'Paper 3 Advanced Practical Skills + Paper 5' },
      { id: 'subj-cs-adv', name: 'Advanced Computer Science (9618)', category: 'technology', participationRatePct: 45, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Paper 4 Advanced Practical Programming' },
      { id: 'subj-hum-adv', name: 'Economics, Geography & History (9708/9696)', category: 'humanities', participationRatePct: 55, recommendedTeacherRatio: 22, practicalsMandatory: true, practicalPaper: 'Data Response & Case Study Papers' },
      { id: 'subj-art-adv', name: 'Advanced Art & Design (9479)', category: 'creative', participationRatePct: 30, recommendedTeacherRatio: 15, practicalsMandatory: true, practicalPaper: 'Coursework + 15-Hour Practical Exam' }
    ],
    defaultSupportStaff: [
      { id: 'sup-lab', title: 'Senior Lab Technicians (CLEAPSS)', formulaType: 'labs', count: 3, description: 'Oversee advanced titration, microbiology cultures & oscilloscope calibration' },
      { id: 'sup-it', title: 'Systems & Assessment Specialist', formulaType: 'ict', count: 1, description: 'Administer secure exam portals, server virtualization & high-speed network' },
      { id: 'sup-adm', title: 'Academic Administration & Bursary', formulaType: 'students', count: 3, description: 'Registrar, student transcripts, exams officer & bursary' },
      { id: 'sup-counselor', title: 'University Admissions & UCAS Counselor', formulaType: 'fixed', count: 1, description: 'Guide university applications, personal statements & scholarship portfolios' }
    ]
  },
  combined: {
    id: 'combined',
    name: 'Full Cambridge Secondary (Grades 7–12)',
    badge: 'Grades 7–12 Comprehensive',
    description: 'End-to-end secondary education pipeline from Lower Secondary through IGCSE to A-Level.',
    defaultSubjects: [
      { id: 'subj-core', name: 'Mathematics, English & World Languages', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 32, practicalsMandatory: false, practicalPaper: 'Lower Secondary & IGCSE Written Papers' },
      { id: 'subj-phy', name: 'Physics (Lower Sec + IGCSE + A2)', category: 'stem', participationRatePct: 70, recommendedTeacherRatio: 24, practicalsMandatory: true, practicalPaper: 'Cambridge Practical Progression (Papers 3/5)' },
      { id: 'subj-chem', name: 'Chemistry (Lower Sec + IGCSE + A2)', category: 'stem', participationRatePct: 70, recommendedTeacherRatio: 24, practicalsMandatory: true, practicalPaper: 'Cambridge Practical Progression (Papers 3/5)' },
      { id: 'subj-bio', name: 'Biology & Environmental Systems', category: 'stem', participationRatePct: 75, recommendedTeacherRatio: 24, practicalsMandatory: true, practicalPaper: 'Practical Examinations (Papers 3/5)' },
      { id: 'subj-ict', name: 'Computing, Coding & Digital Literacy', category: 'technology', participationRatePct: 65, recommendedTeacherRatio: 28, practicalsMandatory: true, practicalPaper: 'Hands-on practical exams' },
      { id: 'subj-geo', name: 'Geography, History & Global Perspectives', category: 'humanities', participationRatePct: 55, recommendedTeacherRatio: 28, practicalsMandatory: true, practicalPaper: 'Fieldwork portfolio & written papers' },
      { id: 'subj-art', name: 'Art, Design & Music Studios', category: 'creative', participationRatePct: 45, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Studio coursework & exhibitions' }
    ],
    defaultSupportStaff: [
      { id: 'sup-lab', title: 'Science Laboratory Technicians', formulaType: 'labs', count: 3, description: 'Maintain general science, bio/chem, and advanced physics prep rooms' },
      { id: 'sup-it', title: 'ICT Systems & Network Administrator', formulaType: 'ict', count: 2, description: 'Maintain campus Wi-Fi, computer labs, and digital classroom audio/visual' },
      { id: 'sup-adm', title: 'Central Administration & Student Affairs', formulaType: 'students', count: 4, description: 'Principal, deputy head, admissions, bursary, and student pastoral care' },
      { id: 'sup-lib', title: 'Chief Librarian & Media Center Head', formulaType: 'fixed', count: 1, description: 'Manage digital learning resources, book collections, and archive center' },
      { id: 'sup-nurse', title: 'School Nurse & Health Officer', formulaType: 'fixed', count: 1, description: 'First aid clinic, medical records, and health compliance officer' }
    ]
  },
  stem: {
    id: 'stem',
    name: 'STEM & Innovation Academy',
    badge: 'STEM & Robotics Hub',
    description: 'High-tech learning environment focusing heavily on robotics, computer science, laboratory research, and mathematics.',
    defaultSubjects: [
      { id: 'subj-math-stem', name: 'Pure & Applied Mathematics, Algorithms', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 24, practicalsMandatory: false, practicalPaper: 'Advanced Problem-Solving & Modeling' },
      { id: 'subj-phy-stem', name: 'Physics & Applied Engineering Mechanics', category: 'stem', participationRatePct: 90, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Paper 3/5 + Engineering Lab Projects' },
      { id: 'subj-chem-stem', name: 'Chemistry & Material Science', category: 'stem', participationRatePct: 90, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Paper 3/5 + Synthesis & Micro-analysis' },
      { id: 'subj-bio-stem', name: 'Biology, Biotechnology & Genetics', category: 'stem', participationRatePct: 85, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Paper 3/5 + Microbiology & Microscopy' },
      { id: 'subj-cs-stem', name: 'Computer Science, Robotics & AI Systems', category: 'technology', participationRatePct: 100, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Robotics Coding, IoT & Practical Exam' },
      { id: 'subj-comms-stem', name: 'Technical Communications & English', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 30, practicalsMandatory: false, practicalPaper: 'Scientific writing & presentations' },
      { id: 'subj-design-stem', name: 'CAD, 3D Design & Prototyping', category: 'creative', participationRatePct: 50, recommendedTeacherRatio: 18, practicalsMandatory: true, practicalPaper: 'Portfolio & 3D fabricated design' }
    ],
    defaultSupportStaff: [
      { id: 'sup-lab', title: 'STEM & Science Lab Technicians', formulaType: 'labs', count: 4, description: 'Specialize in chemical reagents, optics kits, robotics rigs & sensor arrays' },
      { id: 'sup-it', title: 'Robotics, IoT & Network Administrators', formulaType: 'ict', count: 2, description: 'Manage fabrication lab, 3D printers, server sandboxes & high-density Wi-Fi' },
      { id: 'sup-adm', title: 'Academy Administration & Industry Liaison', formulaType: 'students', count: 3, description: 'Corporate sponsorships, university partnerships, bursary & operations' },
      { id: 'sup-stem-coord', title: 'STEM Innovation & Makerspace Coordinator', formulaType: 'fixed', count: 1, description: 'Facilitate hackathons, robotics tournaments, and student patent projects' }
    ]
  },
  arts_humanities: {
    id: 'arts_humanities',
    name: 'Humanities, Languages & Creative Arts College',
    badge: 'Arts & Humanities Focus',
    description: 'Enriched creative studios, global humanities, foreign languages, and performing arts.',
    defaultSubjects: [
      { id: 'subj-art-humanities', name: 'Fine Art, Painting & Printmaking (0400/9479)', category: 'creative', participationRatePct: 85, recommendedTeacherRatio: 18, practicalsMandatory: true, practicalPaper: 'Studio Coursework Portfolio & Practical Exam' },
      { id: 'subj-geo-humanities', name: 'Geography, Environmental & Urban Studies', category: 'humanities', participationRatePct: 80, recommendedTeacherRatio: 24, practicalsMandatory: true, practicalPaper: 'Fieldwork Investigation & Cartography' },
      { id: 'subj-lang-humanities', name: 'English Literature, World & African Languages', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 25, practicalsMandatory: false, practicalPaper: 'Oral examinations & literary analysis' },
      { id: 'subj-hist-humanities', name: 'World History, Politics & Global Perspectives', category: 'humanities', participationRatePct: 75, recommendedTeacherRatio: 25, practicalsMandatory: false, practicalPaper: 'Independent research essays' },
      { id: 'subj-math-humanities', name: 'Mathematics & Statistical Applications', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 30, practicalsMandatory: false, practicalPaper: 'Core written papers' },
      { id: 'subj-media-humanities', name: 'Digital Media, Graphic Design & Photography', category: 'creative', participationRatePct: 65, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Digital production portfolio' },
      { id: 'subj-sci-humanities', name: 'Integrated Environmental Science & Biology', category: 'stem', participationRatePct: 50, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'Paper 3 practical exam' }
    ],
    defaultSupportStaff: [
      { id: 'sup-studio-tech', title: 'Studio Curators & Art Technicians', formulaType: 'fixed', count: 2, description: 'Maintain kilns, darkrooms, printmaking presses & studio supplies' },
      { id: 'sup-it', title: 'Digital Media & A/V Technician', formulaType: 'ict', count: 1, description: 'Manage audio-visual equipment, media lab workstations & theater lighting' },
      { id: 'sup-adm', title: 'College Administration & Cultural Affairs', formulaType: 'students', count: 3, description: 'Registrar, exhibitions coordinator, bursary & community events' },
      { id: 'sup-lib', title: 'Humanities & Fine Arts Librarian', formulaType: 'fixed', count: 1, description: 'Curate historical archives, art folios & digital media repositories' }
    ]
  },
  vocational_tech: {
    id: 'vocational_tech',
    name: 'Technical & Applied Vocational Secondary (VETA / TVET)',
    badge: 'Vocational & Applied Tech',
    description: 'Hands-on practical training in computing, technical design, electronics, and applied sciences.',
    defaultSubjects: [
      { id: 'subj-tech-computing', name: 'Applied Information Technology & Systems', category: 'technology', participationRatePct: 95, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Hands-on software & hardware assessments' },
      { id: 'subj-tech-design', name: 'Design & Technology / Engineering Graphics', category: 'creative', participationRatePct: 90, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Technical drafting, machining & project design' },
      { id: 'subj-tech-physics', name: 'Applied Physics, Mechanics & Electronics', category: 'stem', participationRatePct: 75, recommendedTeacherRatio: 22, practicalsMandatory: true, practicalPaper: 'Circuit analysis & mechanical testing' },
      { id: 'subj-tech-math', name: 'Technical & Applied Mathematics', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 28, practicalsMandatory: false, practicalPaper: 'Applied calculations & trade geometry' },
      { id: 'subj-tech-english', name: 'Workplace Communications & Business English', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 30, practicalsMandatory: false, practicalPaper: 'Professional reports & trade presentations' },
      { id: 'subj-tech-applied-sci', name: 'Applied Chemistry & Industrial Materials', category: 'stem', participationRatePct: 60, recommendedTeacherRatio: 22, practicalsMandatory: true, practicalPaper: 'Materials testing & chemical assay' }
    ],
    defaultSupportStaff: [
      { id: 'sup-workshop-tech', title: 'Workshop & Engineering Technicians', formulaType: 'labs', count: 3, description: 'Tool maintenance, safety protocol enforcement & CNC/materials prep' },
      { id: 'sup-it', title: 'Systems & Network Administrator', formulaType: 'ict', count: 2, description: 'Maintain CAD workstations, trade software licenses & network infrastructure' },
      { id: 'sup-adm', title: 'Vocational Center Administration & Apprenticeship', formulaType: 'students', count: 3, description: 'Industry apprenticeships, trade certifications, bursary & administration' },
      { id: 'sup-safety', title: 'Safety & Facilities Maintenance Officer', formulaType: 'fixed', count: 1, description: 'Inspect OSHA/factory safety compliance, fire systems & heavy machinery' }
    ]
  },
  custom: {
    id: 'custom',
    name: 'Custom / Bespoke Campus Configuration',
    badge: 'Fully Tailored',
    description: 'Custom educational blueprint with user-defined subjects, personalized ratios, and tailored staffing numbers.',
    defaultSubjects: [
      { id: 'subj-core', name: 'Mathematics & Languages', category: 'core', participationRatePct: 100, recommendedTeacherRatio: 30, practicalsMandatory: false, practicalPaper: 'Standard examination' },
      { id: 'subj-stem', name: 'Science & Laboratory Studies', category: 'stem', participationRatePct: 70, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'Practical paper' },
      { id: 'subj-tech', name: 'Computing & Digital Technology', category: 'technology', participationRatePct: 65, recommendedTeacherRatio: 25, practicalsMandatory: true, practicalPaper: 'Hands-on practical' },
      { id: 'subj-arts', name: 'Creative & Humanities Studies', category: 'creative', participationRatePct: 50, recommendedTeacherRatio: 20, practicalsMandatory: true, practicalPaper: 'Portfolio & projects' }
    ],
    defaultSupportStaff: [
      { id: 'sup-lab', title: 'Laboratory Technicians', formulaType: 'labs', count: 2, description: 'Maintain laboratories and prep rooms' },
      { id: 'sup-it', title: 'IT & Network Admin', formulaType: 'ict', count: 1, description: 'Manage campus technology and computers' },
      { id: 'sup-adm', title: 'Administration & Finance Staff', formulaType: 'students', count: 3, description: 'Administrative office, registrar & bursary' }
    ]
  }
};

/**
 * Creates default staffing plan object for a given school type
 */
export function getDefaultStaffingPlan(schoolType = 'necta_csee', totalStudents = 500, rooms = []) {
  const profile = SCHOOL_STAFFING_PROFILES[schoolType] || SCHOOL_STAFFING_PROFILES.necta_csee || SCHOOL_STAFFING_PROFILES.igcse;

  // Initialize subjects
  const subjects = profile.defaultSubjects.map((s, idx) => ({
    ...s,
    id: s.id || `subj-${idx + 1}-${Math.random().toString(36).substr(2, 5)}`,
    customStudentCount: null, // null means auto-calculated from totalStudents * participationRatePct
    customTeachersNeeded: null, // null means auto-calculated from students / recommendedTeacherRatio
    isCustomTeachers: false
  }));

  // Initialize support staff with dynamic counts based on rooms/students
  const labCount = rooms.filter(r => ['physics_lab', 'chemistry_lab', 'biology_lab'].includes(r.type)).length;
  const ictCount = rooms.filter(r => r.type === 'ict_lab').length;

  const supportStaff = profile.defaultSupportStaff.map((st, idx) => {
    let computedCount = st.count;
    if (st.formulaType === 'labs') {
      computedCount = Math.max(1, Math.ceil((labCount || 3) / 2));
    } else if (st.formulaType === 'ict') {
      computedCount = Math.max(1, Math.ceil(ictCount || 1));
    } else if (st.formulaType === 'students') {
      computedCount = Math.max(2, Math.ceil(totalStudents / 180));
    }

    return {
      ...st,
      id: st.id || `sup-${idx + 1}-${Math.random().toString(36).substr(2, 5)}`,
      count: computedCount,
      isCustom: false
    };
  });

  return {
    schoolType: profile.id,
    schoolTypeName: profile.name,
    subjects,
    supportStaff,
    deskAllocationRatio: 1.0, // 1 desk per teacher
    notes: 'Staffing plan aligned to national NECTA/MoEST regulations and international accreditation standards.',
    updatedAt: new Date().toISOString()
  };
}

/**
 * Dynamic calculation engine for Teacher & Staffing requirements.
 * Dynamically computes numbers from current school size (totalStudents) and room layout,
 * while strictly honoring any manual customizations/overrides.
 */
export function computeStaffingRequirements(staffingPlan, totalStudents = 500, rooms = []) {
  const currentPlan = staffingPlan || getDefaultStaffingPlan('necta_csee', totalStudents, rooms);
  const subjectsList = currentPlan.subjects || [];
  const supportList = currentPlan.supportStaff || [];

  // Evaluate subject-by-subject requirements
  const evaluatedSubjects = subjectsList.map(subj => {
    // Determine cohort student count
    const participationPct = typeof subj.participationRatePct === 'number' ? subj.participationRatePct : 100;
    const autoStudents = Math.round(totalStudents * (participationPct / 100));
    const subjectStudents = typeof subj.customStudentCount === 'number' ? subj.customStudentCount : autoStudents;

    // Determine teacher ratio
    const ratio = Math.max(1, subj.recommendedTeacherRatio || 25);
    const autoTeachers = Math.max(1, Math.ceil(subjectStudents / ratio));
    
    // Honor custom manual override if user explicitly set one
    const teachersNeeded = subj.isCustomTeachers && typeof subj.customTeachersNeeded === 'number'
      ? Math.max(0, subj.customTeachersNeeded)
      : autoTeachers;

    return {
      ...subj,
      autoStudents,
      subjectStudents,
      autoTeachers,
      teachersNeeded,
      isOverridden: !!(subj.isCustomTeachers && subj.customTeachersNeeded !== null && subj.customTeachersNeeded !== autoTeachers)
    };
  });

  const totalTeachingStaff = evaluatedSubjects.reduce((sum, s) => sum + s.teachersNeeded, 0);

  // Evaluate support specialists
  const labCount = rooms.filter(r => ['physics_lab', 'chemistry_lab', 'biology_lab'].includes(r.type)).length;
  const ictCount = rooms.filter(r => r.type === 'ict_lab').length;

  const evaluatedSupportStaff = supportList.map(st => {
    let autoCount = st.count;
    if (st.formulaType === 'labs') {
      autoCount = Math.max(1, Math.ceil((labCount || 3) / 2));
    } else if (st.formulaType === 'ict') {
      autoCount = Math.max(1, Math.ceil(ictCount || 1));
    } else if (st.formulaType === 'students') {
      autoCount = Math.max(2, Math.ceil(totalStudents / 180));
    }

    const finalCount = st.isCustom && typeof st.count === 'number' ? st.count : autoCount;

    return {
      ...st,
      autoCount,
      count: finalCount
    };
  });

  const totalSupportStaff = evaluatedSupportStaff.reduce((sum, st) => sum + (st.count || 0), 0);
  const totalFacultyAndStaff = totalTeachingStaff + totalSupportStaff;

  // Staff room capacity audit
  const staffRooms = rooms.filter(r => r.type === 'staff_room');
  const staffDeskCapacity = staffRooms.reduce((sum, r) => sum + (r.capacity || 15), 0);
  const requiredDesks = Math.ceil(totalTeachingStaff * (currentPlan.deskAllocationRatio || 1.0));
  const isDeskSufficient = staffDeskCapacity >= requiredDesks;
  const deskDeficit = Math.max(0, requiredDesks - staffDeskCapacity);
  const deskSurplus = Math.max(0, staffDeskCapacity - requiredDesks);

  // Overall student to teacher ratio
  const overallRatio = totalTeachingStaff > 0 ? (totalStudents / totalTeachingStaff).toFixed(1) : '0';

  return {
    staffingPlan: currentPlan,
    subjects: evaluatedSubjects,
    supportStaff: evaluatedSupportStaff,
    totalTeachingStaff,
    totalSupportStaff,
    totalFacultyAndStaff,
    staffDeskCapacity,
    requiredDesks,
    isDeskSufficient,
    deskDeficit,
    deskSurplus,
    overallRatio,
    totalStudents
  };
}
