/**
 * Master Equipment Catalog Database
 * Benchmark prices derived from China/India wholesale sourcing hubs (Alibaba, 1688, Yiwu).
 * Pre-configured with item specs, categories, unit prices, and default allocations.
 */

export const EQUIPMENT_CATEGORIES = {
  furniture: 'Furniture & Fixtures',
  lab_stem: 'STEM & Lab Apparatus',
  chemicals_safety: 'Chemicals, PPE & Safety',
  it_electronics: 'IT, AV & Electronics',
  geography_fieldwork: 'Maps & Fieldwork',
  art_design: 'Art & Design Tools',
  music_performing: 'Music & Performing Arts',
  sports: 'Sports & Athletics',
  admin: 'Office & Storage'
};

export const MASTER_EQUIPMENT_ITEMS = [
  // --- CLASSROOM FURNITURE & BASIC AV ---
  {
    id: 'cls-desk-chair-001',
    name: 'Student Desk & Chair Set (Steel + High-Density Polyethylene)',
    category: 'furniture',
    spec: '600mm x 400mm x 750mm, 1.5mm oval steel tube frame, anti-scratch desktop, bag hook',
    unit: 'set',
    basePriceUSD: 28.00,
    source: 'China Wholesale (Guangdong Hub)',
    applicableRooms: ['classroom']
  },
  {
    id: 'cls-teacher-station-001',
    name: 'Teacher Presentation Desk & Ergonomic Mesh Chair',
    category: 'furniture',
    spec: '1400mm x 700mm x 760mm, 3 lockable drawers, modesty panel, cable management grommets',
    unit: 'set',
    basePriceUSD: 110.00,
    source: 'China Wholesale (Zhejiang Hub)',
    applicableRooms: ['classroom', 'geography_room', 'art_studio']
  },
  {
    id: 'cls-whiteboard-001',
    name: 'Magnetic Porcelain Steel Whiteboard (3600mm x 1200mm)',
    category: 'furniture',
    spec: 'Vitreous enamel surface, heavy-duty aluminum frame, full-length pen tray, 25-yr surface warranty',
    unit: 'piece',
    basePriceUSD: 95.00,
    source: 'China Wholesale (Shandong)',
    applicableRooms: ['classroom', 'physics_lab', 'chemistry_lab', 'biology_lab', 'ict_lab', 'geography_room', 'art_studio']
  },
  {
    id: 'cls-cabinet-storage-001',
    name: 'Lockable Steel Storage Cabinet (Double Door)',
    category: 'furniture',
    spec: '900mm x 400mm x 1850mm, 0.8mm cold rolled steel, 4 adjustable shelves, 3-point locking',
    unit: 'piece',
    basePriceUSD: 85.00,
    source: 'China Wholesale (Luoyang Hub)',
    applicableRooms: ['classroom', 'geography_room', 'art_studio', 'staff_room']
  },
  {
    id: 'cls-fan-led-pack-001',
    name: 'Classroom Environmental Pack (4 Ceiling Fans + 6 LED 4ft Troffers)',
    category: 'furniture',
    spec: '56-inch 3-blade industrial ceiling fans + 40W 4000lm daylight LED tube fittings',
    unit: 'lot',
    basePriceUSD: 140.00,
    source: 'China Wholesale (Foshan Lighting Hub)',
    applicableRooms: ['classroom', 'geography_room', 'art_studio', 'staff_room']
  },

  // --- PHYSICS LAB ---
  {
    id: 'phy-bench-001',
    name: 'Physics Lab Student Island Bench (2-Student)',
    category: 'lab_stem',
    spec: '1800mm x 700mm x 850mm, 25mm solid chemical/heat-resistant epoxy resin top, heavy steel C-frame',
    unit: 'piece',
    basePriceUSD: 125.00,
    source: 'China Lab Equipment (Jiangsu)',
    applicableRooms: ['physics_lab']
  },
  {
    id: 'phy-stool-001',
    name: 'Adjustable Lab Stool (Chemical-Resistant PU)',
    category: 'furniture',
    spec: 'Gas-lift height adjustment (480-680mm), anti-static PU seat, chrome 5-star base with footring',
    unit: 'piece',
    basePriceUSD: 24.00,
    source: 'China Lab Furniture (Guangzhou)',
    applicableRooms: ['physics_lab', 'chemistry_lab', 'biology_lab']
  },
  {
    id: 'phy-demo-bench-001',
    name: 'Physics Demonstration Bench (Teacher Suite)',
    category: 'lab_stem',
    spec: '2400mm x 900mm x 900mm, integrated variable AC/DC power terminals, sink, gas turret, storage',
    unit: 'piece',
    basePriceUSD: 420.00,
    source: 'China Lab Systems',
    applicableRooms: ['physics_lab']
  },
  {
    id: 'phy-oscilloscope-001',
    name: 'Dual-Channel Digital Storage Oscilloscope (50MHz)',
    category: 'lab_stem',
    spec: '50MHz bandwidth, 1GSa/s real-time sample rate, 7-inch TFT color display, USB interface (CLEAPSS compliant)',
    unit: 'piece',
    basePriceUSD: 185.00,
    source: 'Shenzhen Electronics Hub',
    applicableRooms: ['physics_lab']
  },
  {
    id: 'phy-power-supply-001',
    name: 'Regulated DC/AC Variable Lab Power Supply (0-30V / 0-5A)',
    category: 'lab_stem',
    spec: 'Digital dual LED display, low ripple/noise, short-circuit current limit protection',
    unit: 'piece',
    basePriceUSD: 45.00,
    source: 'Shenzhen Electronics Hub',
    applicableRooms: ['physics_lab']
  },
  {
    id: 'phy-optics-kit-001',
    name: 'Complete Ray Optics & Wave Mechanics Kit',
    category: 'lab_stem',
    spec: 'Laser ray box with slit plates, cylindrical/biconvex/concave lenses, acrylic prisms, reflection mirrors',
    unit: 'set',
    basePriceUSD: 38.00,
    source: 'Ningbo Educational Instruments',
    applicableRooms: ['physics_lab']
  },
  {
    id: 'phy-mechanics-kit-001',
    name: 'IGCSE Mechanics & Dynamics Track Set',
    category: 'lab_stem',
    spec: '1.2m aluminum low-friction track, 2 dynamic carts, pulley attachments, slotted mass sets (10g-500g)',
    unit: 'set',
    basePriceUSD: 55.00,
    source: 'Ningbo Educational Instruments',
    applicableRooms: ['physics_lab']
  },
  {
    id: 'phy-multimeter-pack-001',
    name: 'Digital Multimeter & Circuit Components Pack',
    category: 'lab_stem',
    spec: 'Auto-ranging True-RMS digital multimeter + resistor/capacitor/rheostat decade boxes + banana lead sets',
    unit: 'set',
    basePriceUSD: 22.00,
    source: 'Shenzhen Wholesale',
    applicableRooms: ['physics_lab']
  },

  // --- CHEMISTRY LAB ---
  {
    id: 'chem-fume-hood-001',
    name: 'Ducted Walk-In Laboratory Fume Hood (1500mm)',
    category: 'chemicals_safety',
    spec: '1500mm x 850mm x 2350mm, anti-corrosive PP construction, 6mm tempered explosion-proof sash, centrifugal blower, water/gas outlets',
    unit: 'unit',
    basePriceUSD: 1350.00,
    source: 'China Cleanroom & Lab Tech (Jiangsu)',
    applicableRooms: ['chemistry_lab']
  },
  {
    id: 'chem-bench-island-001',
    name: 'Chemistry Island Bench with Sinks & Gas Turrets (2-Student)',
    category: 'lab_stem',
    spec: '1800mm x 750mm x 850mm, 20mm solid chemical-proof epoxy resin surface, dual 2-way gas taps, PP cup sink & 3-way water faucet',
    unit: 'piece',
    basePriceUSD: 195.00,
    source: 'China Lab Furniture (Guangzhou)',
    applicableRooms: ['chemistry_lab']
  },
  {
    id: 'chem-glassware-suite-001',
    name: 'IGCSE Chemistry Class Borosilicate 3.3 Glassware Suite',
    category: 'lab_stem',
    spec: '60 beakers (100/250/500ml), 60 conical flasks, 30 Class A 50ml burettes, 60 pipettes, 30 graduated cylinders, 120 test tubes with racks',
    unit: 'lot',
    basePriceUSD: 420.00,
    source: 'Yancheng Glassware Hub',
    applicableRooms: ['chemistry_lab']
  },
  {
    id: 'chem-reagents-starter-001',
    name: 'Cambridge IGCSE Chemistry Reagents & Standard Solutions Pack',
    category: 'chemicals_safety',
    spec: 'Analytical grade salts, acids (HCl, H2SO4, HNO3), indicators, testing reagents for 6 mandatory practicals',
    unit: 'lot',
    basePriceUSD: 310.00,
    source: 'Chemical Supply Consortium',
    applicableRooms: ['chemistry_lab']
  },
  {
    id: 'chem-safety-shower-001',
    name: 'Emergency Deluge Shower & Eyewash Station (Stainless Steel 304)',
    category: 'chemicals_safety',
    spec: 'Combination emergency drench shower and foot-pedal activated twin aerated eyewash bowl, ANSI Z358.1 compliant',
    unit: 'unit',
    basePriceUSD: 165.00,
    source: 'Industrial Safety Equipment (Wenzhou)',
    applicableRooms: ['chemistry_lab', 'biology_lab']
  },
  {
    id: 'chem-cabinet-hazard-001',
    name: 'Yellow Fire-Rated Safety Storage Cabinet for Flammables (45 Gal)',
    category: 'chemicals_safety',
    spec: 'Double-walled 18-gauge welded steel with 1.5" insulating air space, dual vents with flame arrestors, OSHA/NFPA compliant',
    unit: 'unit',
    basePriceUSD: 360.00,
    source: 'Industrial Safety Hub',
    applicableRooms: ['chemistry_lab']
  },
  {
    id: 'chem-burners-pack-001',
    name: 'Bunsen Burners & Gas Manifold Accessories Pack',
    category: 'lab_stem',
    spec: '15 nickel-plated brass Bunsen burners with air regulator + flame retardant tubing + 15 tripods & wire gauzes',
    unit: 'set',
    basePriceUSD: 95.00,
    source: 'Ningbo Educational Instruments',
    applicableRooms: ['chemistry_lab']
  },

  // --- BIOLOGY LAB ---
  {
    id: 'bio-microscope-001',
    name: 'Cambridge Standard Monocular Compound LED Microscope',
    category: 'lab_stem',
    spec: 'Achromatic 4X, 10X, 40X, 100X (Oil) objectives, WF10x eyepiece, coaxial coarse/fine focus, Abbe NA 1.25 condenser, rechargeable LED illumination',
    unit: 'piece',
    basePriceUSD: 78.00,
    source: 'Optics Hub (Ningbo)',
    applicableRooms: ['biology_lab']
  },
  {
    id: 'bio-bench-001',
    name: 'Biology Wet-Lab Workstation Bench with Water Point',
    category: 'lab_stem',
    spec: '1800mm x 750mm x 850mm, anti-bacterial solid core phenolic resin top, PP drip cup sink, cold water tap, reagent rack',
    unit: 'piece',
    basePriceUSD: 165.00,
    source: 'China Lab Systems',
    applicableRooms: ['biology_lab']
  },
  {
    id: 'bio-autoclave-001',
    name: 'Vertical Micro-Laboratory Electric Autoclave / Sterilizer (24L)',
    category: 'lab_stem',
    spec: 'Full SUS304 stainless steel chamber, 0.14-0.16MPa working pressure, automatic pressure relief safety valve',
    unit: 'unit',
    basePriceUSD: 240.00,
    source: 'Medical Equipment Hub (Shanghai)',
    applicableRooms: ['biology_lab']
  },
  {
    id: 'bio-models-slides-001',
    name: 'Anatomical Model Set & Prepared Biological Slides (100pc Box)',
    category: 'lab_stem',
    spec: 'Human torso model (85cm, 19 parts), plant stem/leaf cross-section models + 100 histological prepared slide sets',
    unit: 'set',
    basePriceUSD: 145.00,
    source: 'Biological Teaching Aids Hub (Zhejiang)',
    applicableRooms: ['biology_lab']
  },
  {
    id: 'bio-dissection-kit-001',
    name: 'Student Dissection Instrument Kit (Stainless Steel)',
    category: 'lab_stem',
    spec: 'Scalpel with spare blades, forceps, scissors, teasing needles, ruler in zippered vinyl case + dissection wax pan',
    unit: 'set',
    basePriceUSD: 12.00,
    source: 'Medical Tools (Wenzhou)',
    applicableRooms: ['biology_lab']
  },

  // --- ICT / COMPUTER LAB ---
  {
    id: 'ict-workstation-pc-001',
    name: 'Intel Core i5 Desktop Computer Suite with 23.8" FHD IPS Monitor',
    category: 'it_electronics',
    spec: 'Core i5 12th Gen, 16GB DDR4, 512GB NVMe SSD, USB keyboard & mouse, 23.8-inch 1080p IPS low-blue-light monitor, 3-yr warranty',
    unit: 'set',
    basePriceUSD: 360.00,
    source: 'Shenzhen Technology OEM Hub',
    applicableRooms: ['ict_lab', 'admin_office']
  },
  {
    id: 'ict-workstation-refurb-001',
    name: 'Certified Refurbished Business Desktop (Core i5, 8GB RAM, 256GB SSD) with 22" Monitor',
    category: 'it_electronics',
    spec: 'Refurbished Tier-1 (Dell/HP/Lenovo) Core i5, 8GB RAM, 256GB SSD, Wi-Fi dongle, keyboard, mouse, 22-inch LCD (1-year warranty)',
    unit: 'set',
    basePriceUSD: 150.00,
    source: 'Qrent / Rasheed Sons (Africa Wholesale)',
    applicableRooms: ['ict_lab', 'admin_office', 'staff_room']
  },
  {
    id: 'ict-chromebook-refurb-001',
    name: 'Refurbished Educational Chromebook (11.6")',
    category: 'it_electronics',
    spec: '11.6-inch display, Intel Celeron, 4GB RAM, 32GB eMMC, Chrome OS, designed for education and cloud-based learning',
    unit: 'piece',
    basePriceUSD: 100.00,
    source: 'Computers2Africa / Wholesale Education Vendors',
    applicableRooms: ['ict_lab', 'classroom', 'geography_room']
  },
  {
    id: 'ict-thin-client-001',
    name: 'Low-Power Thin Client / Single Board Computer (e.g. Raspberry Pi 400)',
    category: 'it_electronics',
    spec: 'Integrated keyboard computer (Broadcom BCM2711, 4GB RAM), mouse, power supply, micro-HDMI cable (monitor not included). Extremely low power draw (5W).',
    unit: 'piece',
    basePriceUSD: 80.00,
    source: 'Global Educational Electronics Distributors',
    applicableRooms: ['ict_lab']
  },
  {
    id: 'ict-desk-station-001',
    name: 'ICT Individual Computer Desk with Cable Conduit',
    category: 'furniture',
    spec: '1000mm x 600mm x 750mm, scratch-resistant Melamine top, enclosed CPU holder, integrated under-desk power tray',
    unit: 'piece',
    basePriceUSD: 38.00,
    source: 'China Office Furniture (Foshan)',
    applicableRooms: ['ict_lab']
  },
  {
    id: 'ict-ups-bank-001',
    name: '6kVA Online Double-Conversion High-Frequency Rack UPS + Battery Pack',
    category: 'it_electronics',
    spec: '6000VA / 5400W, pure sine wave, 16x 12V/9Ah external battery cabinet providing 30-45min clean backup under full lab load',
    unit: 'unit',
    basePriceUSD: 680.00,
    source: 'Power Electronics Hub (Shenzhen)',
    applicableRooms: ['ict_lab']
  },
  {
    id: 'ict-network-rack-001',
    name: 'Server Rack & Managed Network Infrastructure Bundle',
    category: 'it_electronics',
    spec: '12U wall-mount server cabinet, 48-port Gigabit managed L2 switch, 305m Cat6 UTP pure copper spool, RJ45 patch panels & Wi-Fi 6 AP',
    unit: 'lot',
    basePriceUSD: 390.00,
    source: 'Telecom Equipment Hub (Shenzhen)',
    applicableRooms: ['ict_lab']
  },
  {
    id: 'ict-projector-av-001',
    name: 'Short-Throw 4000 Lumens Laser Projector & 100" Motorized Screen',
    category: 'it_electronics',
    spec: '4000 ANSI lumens, 1080p native, 20,000hr laser light source, HDMI/wireless mirroring, 100-inch 16:9 matte white electric screen',
    unit: 'set',
    basePriceUSD: 520.00,
    source: 'AV Manufacturing Hub (Shenzhen)',
    applicableRooms: ['ict_lab', 'geography_room', 'sports_hall']
  },

  // --- GEOGRAPHY & FIELDWORK ---
  {
    id: 'geo-flat-file-001',
    name: 'Architectural Heavy-Duty 5-Drawer Map Storage Flat File',
    category: 'furniture',
    spec: '1350mm x 950mm x 550mm (Fits A0/A1 sheets), heavy-gauge cold rolled steel, ball-bearing roller slides',
    unit: 'unit',
    basePriceUSD: 240.00,
    source: 'Office Storage Manufacturing (Luoyang)',
    applicableRooms: ['geography_room']
  },
  {
    id: 'geo-maps-wall-001',
    name: 'Cambridge Standard Large Wall Map Series & Hanging Rails',
    category: 'geography_fieldwork',
    spec: '15 high-res laminated maps (World, Africa Physical/Political, Climate Zones, Tectonics, Population, Topo) + wall hanging track',
    unit: 'set',
    basePriceUSD: 180.00,
    source: 'Educational Cartography Hub',
    applicableRooms: ['geography_room']
  },
  {
    id: 'geo-globes-pack-001',
    name: '3D Physical Relief & Political Illuminated Globe Pack (6 Units)',
    category: 'geography_fieldwork',
    spec: '30cm diameter, raised relief mountain topography, LED internal illumination, meridian metal arc',
    unit: 'set',
    basePriceUSD: 110.00,
    source: 'Educational Aids Hub (Zhejiang)',
    applicableRooms: ['geography_room']
  },
  {
    id: 'geo-fieldwork-kit-001',
    name: 'IGCSE Geography Practical Fieldwork Equipment Kit',
    category: 'geography_fieldwork',
    spec: '15 liquid prismatic sighting compasses, 6 handheld GPS receivers, 10 clinometers, 10 fiberglass 30m surveyor tapes, 10 ranging rods',
    unit: 'lot',
    basePriceUSD: 340.00,
    source: 'Survey Instrument Hub (Suzhou)',
    applicableRooms: ['geography_room']
  },
  {
    id: 'geo-weather-station-001',
    name: 'Automated Solar Digital Weather Station + Stevenson Screen',
    category: 'geography_fieldwork',
    spec: 'Digital telemetry station measuring wind speed/dir, rain gauge, barometric pressure, UV/solar radiation + traditional wooden Stevenson screen',
    unit: 'set',
    basePriceUSD: 220.00,
    source: 'Meteorological Instruments',
    applicableRooms: ['geography_room']
  },

  // --- ART & DESIGN STUDIO ---
  {
    id: 'art-drafting-table-001',
    name: 'Professional Tilting Drafting & Drawing Table (A1 Format)',
    category: 'art_design',
    spec: '1000mm x 700mm, 0-80 degree multi-angle tilt mechanism, powder-coated steel frame, integrated pencil ledge & T-square clamp',
    unit: 'piece',
    basePriceUSD: 62.00,
    source: 'Drafting Equipment Hub (Foshan)',
    applicableRooms: ['art_studio']
  },
  {
    id: 'art-easel-drying-001',
    name: 'Solid Beechwood Studio H-Frame Easel',
    category: 'art_design',
    spec: 'Oiled European beechwood, adjustable canvas height up to 140cm, sturdy mast with crank adjustment',
    unit: 'piece',
    basePriceUSD: 35.00,
    source: 'Art Supplies Hub (Ningbo)',
    applicableRooms: ['art_studio']
  },
  {
    id: 'art-drying-rack-001',
    name: 'Mobile Spring-Loaded Metal Artwork Drying Rack (25 Shelves)',
    category: 'art_design',
    spec: 'Heavy-duty steel wire mesh shelves (fits A2/A3 sheets), locking castors, spring tensioners for smooth spacing',
    unit: 'unit',
    basePriceUSD: 145.00,
    source: 'School Studio Equipment',
    applicableRooms: ['art_studio']
  },
  {
    id: 'art-sink-clay-001',
    name: 'Double Deep Stainless Steel Wash-Up Sink with Clay/Plaster Trap',
    category: 'art_design',
    spec: '1500mm x 600mm x 850mm, SUS304 commercial grade, under-sink sediment interceptor box preventing plumbing blockages',
    unit: 'unit',
    basePriceUSD: 280.00,
    source: 'Commercial Kitchen & Lab Equipment',
    applicableRooms: ['art_studio']
  },
  {
    id: 'art-press-printmaking-001',
    name: 'A3 Tabletop Printmaking Etching Press',
    category: 'art_design',
    spec: 'Solid steel rollers, 300mm x 500mm bed plate, heavy-duty gear drive, pressure adjustment screws, felt blanket included',
    unit: 'unit',
    basePriceUSD: 320.00,
    source: 'Printmaking Instruments Hub',
    applicableRooms: ['art_studio']
  },
  {
    id: 'art-materials-starter-001',
    name: 'Cambridge Art & Design Studio Bulk Consumables & Tools Pack',
    category: 'art_design',
    spec: 'Acrylic paints (500ml jars), watercolor sets, gouache, artist brushes (sets of 50), charcoal, pastels, clay modeling tools, linocut knives',
    unit: 'lot',
    basePriceUSD: 380.00,
    source: 'Fine Art Material Manufacturers (Yiwu/Ningbo)',
    applicableRooms: ['art_studio']
  },

  // --- MUSIC & PERFORMING ARTS ---
  {
    id: 'mus-piano-001',
    name: '88-Key Weighted Digital Piano with Stand & Pedals',
    category: 'music_performing',
    spec: 'Hammer action keys, 128-note polyphony, dual headphone jacks, MIDI USB',
    unit: 'set',
    basePriceUSD: 350.00,
    source: 'Musical Instruments (Guangzhou)',
    applicableRooms: ['music_room', 'sports_hall']
  },
  {
    id: 'mus-drum-kit-001',
    name: '5-Piece Acoustic Drum Kit with Cymbals & Hardware',
    category: 'music_performing',
    spec: '22" bass, 14" snare, 10"/12" toms, 16" floor tom, hi-hat, crash, ride cymbals, throne included',
    unit: 'set',
    basePriceUSD: 280.00,
    source: 'Musical Instruments (Tianjin)',
    applicableRooms: ['music_room']
  },
  {
    id: 'mus-guitar-acoustic-001',
    name: 'Acoustic Nylon/Steel Guitars (Pack of 5)',
    category: 'music_performing',
    spec: '3/4 and 4/4 sizes, spruce top, mahogany back/sides, includes padded gig bags and tuners',
    unit: 'pack',
    basePriceUSD: 220.00,
    source: 'Guitar Manufacturing (Guangdong)',
    applicableRooms: ['music_room']
  },
  {
    id: 'mus-synth-keyboard-001',
    name: '61-Key Electronic Synthesizer Keyboard',
    category: 'music_performing',
    spec: 'Touch-sensitive keys, 400+ voices, pitch bend, USB MIDI, built-in speakers',
    unit: 'piece',
    basePriceUSD: 120.00,
    source: 'Musical Instruments (Shenzhen)',
    applicableRooms: ['music_room']
  },
  {
    id: 'mus-audio-mixer-001',
    name: '8-Channel USB Audio Mixer & Studio Monitor Speakers',
    category: 'music_performing',
    spec: '8-input mixer with phantom power and FX, pair of 5-inch active studio monitors, cabling',
    unit: 'set',
    basePriceUSD: 195.00,
    source: 'Pro Audio Hub (Enping)',
    applicableRooms: ['music_room', 'sports_hall']
  },
  {
    id: 'mus-mic-stands-001',
    name: 'Microphones & Heavy-Duty Notation Stands Bundle',
    category: 'music_performing',
    spec: '4 dynamic vocal mics, 2 condenser mics, 6 boom stands, 10 collapsible notation stands',
    unit: 'bundle',
    basePriceUSD: 150.00,
    source: 'Pro Audio Hub (Enping)',
    applicableRooms: ['music_room']
  },

  // --- SPORTS & ATHLETICS ---
  {
    id: 'spt-indoor-bundle-001',
    name: 'Multi-Sport Indoor Arena Equipment Bundle',
    category: 'sports',
    spec: '2 portable glass basketball backboards with spring rings, 1 competition volleyball net system, 4 badminton net posts & nets, 30 gym landing mats',
    unit: 'lot',
    basePriceUSD: 1850.00,
    source: 'Sports Infrastructure Hub (Hebei)',
    applicableRooms: ['sports_hall']
  },
  {
    id: 'spt-outdoor-football-001',
    name: 'Regulation Outdoor Aluminum Football Goal Posts (Pair)',
    category: 'sports',
    spec: '7.32m x 2.44m (Full FIFA spec), 120mm reinforced elliptical aluminum profile, ground sockets, heavy-duty UV nets',
    unit: 'pair',
    basePriceUSD: 720.00,
    source: 'Stadium Equipment Manufacturing',
    applicableRooms: ['sports_hall']
  },
  {
    id: 'spt-athletics-kit-001',
    name: 'Track & Field Athletics Training & Competition Pack',
    category: 'sports',
    spec: '10 height-adjustable hurdles, 4 competition javelins (600g/800g), 4 shot puts, 4 discus, long jump takeoff board & rake',
    unit: 'lot',
    basePriceUSD: 540.00,
    source: 'Athletics Equipment Hub',
    applicableRooms: ['sports_hall']
  },

  // --- ADMIN & STAFF ROOM ---
  {
    id: 'adm-faculty-workstation-001',
    name: 'Modular Faculty Desk & Ergonomic Swivel Chair Unit',
    category: 'admin',
    spec: '1200mm x 600mm, privacy acoustic desk screen, cable tray, mobile 3-drawer pedestal, high-back lumbar mesh chair',
    unit: 'set',
    basePriceUSD: 95.00,
    source: 'Office Systems Hub (Guangdong)',
    applicableRooms: ['staff_room', 'admin_office']
  },
  {
    id: 'adm-meeting-table-001',
    name: 'Conference & Staff Meeting Table (10-Person)',
    category: 'admin',
    spec: '3000mm x 1200mm x 750mm, heavy steel base with walnut laminate top, brushed aluminum cable box',
    unit: 'piece',
    basePriceUSD: 240.00,
    source: 'Office Systems Hub',
    applicableRooms: ['staff_room', 'admin_office']
  },
  {
    id: 'adm-printer-copier-001',
    name: 'High-Volume Network Multi-Function A3/A4 Laser Copier / Printer',
    category: 'it_electronics',
    spec: '45 ppm monochrome/color, dual 500-sheet paper trays, automatic duplexing, Gigabit network/Wi-Fi, 100,000 page monthly duty cycle',
    unit: 'unit',
    basePriceUSD: 850.00,
    source: 'Office Automation Electronics',
    applicableRooms: ['admin_office', 'staff_room']
  }
];

/**
 * Generates the default equipment allocations for a newly added room
 */
export function getDefaultEquipmentForRoomType(roomType, roomCapacity = 30) {
  const items = [];

  switch (roomType) {
    case 'classroom':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-desk-chair-001'), quantity: Math.max(roomCapacity, 40) },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-teacher-station-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-whiteboard-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-cabinet-storage-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-fan-led-pack-001'), quantity: 1 }
      );
      break;

    case 'physics_lab':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-bench-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-stool-001'), quantity: 30 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-demo-bench-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-oscilloscope-001'), quantity: 6 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-power-supply-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-optics-kit-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-mechanics-kit-001'), quantity: 10 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-multimeter-pack-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-whiteboard-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-cabinet-storage-001'), quantity: 2 }
      );
      break;

    case 'chemistry_lab':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'chem-bench-island-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-stool-001'), quantity: 30 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'chem-fume-hood-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'chem-glassware-suite-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'chem-reagents-starter-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'chem-safety-shower-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'chem-cabinet-hazard-001'), quantity: 2 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'chem-burners-pack-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-whiteboard-001'), quantity: 1 }
      );
      break;

    case 'biology_lab':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'bio-bench-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'phy-stool-001'), quantity: 30 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'bio-microscope-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'bio-autoclave-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'bio-models-slides-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'bio-dissection-kit-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'chem-safety-shower-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-whiteboard-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-cabinet-storage-001'), quantity: 2 }
      );
      break;

    case 'ict_lab':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'ict-workstation-pc-001'), quantity: 30 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'ict-desk-station-001'), quantity: 30 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'ict-ups-bank-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'ict-network-rack-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'ict-projector-av-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-whiteboard-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-cabinet-storage-001'), quantity: 1 }
      );
      break;

    case 'geography_room':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-desk-chair-001'), quantity: 35 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-teacher-station-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'geo-flat-file-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'geo-maps-wall-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'geo-globes-pack-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'geo-fieldwork-kit-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'geo-weather-station-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-whiteboard-001'), quantity: 1 }
      );
      break;

    case 'art_studio':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'art-drafting-table-001'), quantity: 25 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'art-easel-drying-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'art-drying-rack-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'art-sink-clay-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'art-press-printmaking-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'art-materials-starter-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-teacher-station-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-whiteboard-001'), quantity: 1 }
      );
      break;

    case 'music_room':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'mus-piano-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'mus-drum-kit-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'mus-guitar-acoustic-001'), quantity: 2 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'mus-synth-keyboard-001'), quantity: 3 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'mus-audio-mixer-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'mus-mic-stands-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-teacher-station-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-whiteboard-001'), quantity: 1 }
      );
      break;

    case 'staff_room':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'adm-faculty-workstation-001'), quantity: 15 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'adm-meeting-table-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-cabinet-storage-001'), quantity: 3 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'adm-printer-copier-001'), quantity: 1 }
      );
      break;

    case 'admin_office':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'adm-faculty-workstation-001'), quantity: 6 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'ict-workstation-pc-001'), quantity: 4 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'adm-meeting-table-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-cabinet-storage-001'), quantity: 4 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'adm-printer-copier-001'), quantity: 1 }
      );
      break;

    case 'sports_hall':
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'spt-indoor-bundle-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'spt-outdoor-football-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'spt-athletics-kit-001'), quantity: 1 }
      );
      break;

    default:
      items.push(
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-desk-chair-001'), quantity: 30 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-teacher-station-001'), quantity: 1 },
        { ...MASTER_EQUIPMENT_ITEMS.find(i => i.id === 'cls-whiteboard-001'), quantity: 1 }
      );
  }

  // Filter out any undefined items and attach unique instance ID
  return items.filter(Boolean).map((item, idx) => ({
    ...item,
    instanceId: `${item.id}-${Date.now()}-${idx}`
  }));
}
