# OpenSchool Blueprint Engine — Design Spec

## 1. Executive Summary & Platform Mission

**OpenSchool Blueprint Engine** is a free, open-source, zero-cost school infrastructure planning tool designed for the African context. It enables any organization — NGOs, governments, private investors, community groups — to plan, cost, and export professional tender documents for building secondary schools aligned to the Cambridge curriculum (IGCSE / AS / A-Level) across 9 African countries.

The system eliminates weeks of planning by providing an interactive builder with real-time cost estimation, auto-generated 2D floor plans, full Bill of Quantities (BoQ) generation, and professional export capabilities — all running entirely in the browser with no server, no database, and zero operational cost.

**Core Value Proposition:**
- Reduce school planning from months to hours
- Realistic cost baselines sourced from China/India manufacturing hubs
- African infrastructure-aware: climate, power, procurement, regulatory
- Professional-grade exports: PDF tenders, CSV procurement, JSON interchange, SVG/PNG floor plans

---

## 2. High-Level System Design & Architecture

### 2.1 Architectural Paradigm (Pure Client-Side Zero-Backend SPA)

- **Framework:** React 18+ with Vite bundler
- **Styling:** Tailwind CSS with custom glassmorphism design system
- **State Management:** React hooks (useState, useCallback, useContext) — no Redux needed
- **Persistence:** LocalStorage / IndexedDB for saving school projects locally
- **Export:** Client-side PDF generation (jsPDF/react-pdf), CSV generation, JSON serialization, SVG rendering
- **Hosting:** Static files only — deploy to GitHub Pages, Netlify, Vercel, or run locally
- **Cost:** $0 recurring — runs entirely on user's machine

### 2.2 End-to-End System Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenSchool Blueprint Engine                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────┐ │
│  │ School   │──▶│ Room     │──▶│Equipment │──▶│ Floor   │ │
│  │ Config   │   │ Planner  │   │ Catalog  │   │ Plan    │ │
│  │ (Country │   │ (Rooms,  │   │ (Items,  │   │ Visual  │ │
│  │  Count,  │   │  Sizes,  │   │  Specs,  │   │ 2D SVG  │ │
│  │  Curric) │   │  Types)  │   │  Prices) │   │ Layout) │ │
│  └──────────┘   └──────────┘   └──────────┘   └─────────┘ │
│       │              │              │              │         │
│       ▼              ▼              ▼              ▼         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Live Cost Dashboard                     │   │
│  │    (Real-time budget tracking, per-room & total)     │   │
│  └─────────────────────────────────────────────────────┘   │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              African Infrastructure Modifiers        │   │
│  │  Climate │ Power │ Procurement │ Regulatory │ Currency│   │
│  └─────────────────────────────────────────────────────┘   │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────┐ │
│  │ PDF      │   │ CSV      │   │ JSON     │   │ SVG/PNG │ │
│  │ Tender   │   │ Procure- │   │ Data     │   │ Floor   │ │
│  │ Export   │   │ ment     │   │ Inter-   │   │ Plan    │ │
│  │          │   │ BoQ      │   │ change   │   │ Print   │ │
│  └──────────┘   └──────────┘   └──────────┘   └─────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Module & File Structure Breakdown

```
src/
├── main.jsx                          # Entry point
├── App.jsx                           # Root component, routing, global state
├── index.css                         # Tailwind + glassmorphism design tokens
│
├── components/
│   ├── ErrorBoundary.jsx             # Graceful error fallback
│   ├── SystemStates.jsx              # Loading skeletons, offline banner
│   └── SecurityHubModal.jsx          # (repurposed: project settings modal)
│
├── views/
│   ├── SchoolConfig.jsx              # Step 1: Country, student count, curriculum
│   ├── RoomPlanner.jsx               # Step 2: Add/configure all rooms
│   ├── EquipmentCatalog.jsx          # Step 3: Browse/search/edit equipment items
│   ├── FloorPlanVisualizer.jsx       # Step 4: Auto-generated 2D SVG layout
│   ├── CostDashboard.jsx             # Live cost tracker (sidebar or overlay)
│   ├── TeacherPlanner.jsx            # Teacher ratios, subject requirements, staff room
│   ├── SiteCalculator.jsx            # Land size, setbacks, outdoor facilities
│   └── ExportHub.jsx                 # PDF, CSV, JSON, SVG/PNG export
│
├── data/
│   ├── equipment-catalog.js          # Pre-loaded equipment database (specs + prices)
│   ├── african-infrastructure.js     # Climate, power, procurement, regulatory per country
│   ├── currencies.js                 # Exchange rates (USD base + 9 African currencies)
│   ├── cambridge-curriculum.js       # Subject requirements, teacher ratios, room needs
│   └── floor-area-ratios.js          # Capacity formulas, setback requirements
│
├── engine/
│   ├── cost-calculator.js            # Core pricing engine (base × modifiers)
│   ├── capacity-calculator.js        # Room capacity & violation detection
│   ├── site-calculator.js            # Plot size recommendations
│   ├── floor-plan-generator.js       # SVG layout generation from room data
│   └── boq-generator.js              # Bill of Quantities engine
│
└── services/
    └── persistence.js                # LocalStorage/IndexedDB save/load
```

### 2.4 Obsidian Glassmorphism Design System & UI/UX Hierarchy

**Design Language:** Dark glassmorphism with accent gradients (adapted from existing Artist Centre palette)

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `--bg-dark` | `#0b0f19` | `#f8fafc` |
| `--bg-card` | `rgba(18, 26, 43, 0.75)` | `rgba(255, 255, 255, 0.85)` |
| `--accent-primary` | `#6366f1` (indigo) | `#4f46e5` |
| `--accent-secondary` | `#06b6d4` (cyan) | `#0891b2` |
| `--accent-green` | `#10b981` (emerald) | `#059669` |
| `--accent-amber` | `#f59e0b` | `#d97706` |
| `--accent-red` | `#ef4444` | `#dc2626` |
| `--radius-sm` | `8px` | `8px` |
| `--radius-md` | `12px` | `12px` |
| `--radius-lg` | `16px` | `16px` |
| `--shadow-glow` | `0 0 25px rgba(99,102,241,0.25)` | `0 0 25px rgba(79,70,229,0.15)` |

**UI Hierarchy:**
1. **Top Nav:** Logo + Project Name + Country Selector + Theme Toggle + Export Button
2. **Step Navigation:** Horizontal stepper (Config → Rooms → Equipment → Teachers → Site → Floor Plan → Export)
3. **Main Content:** Active step view
4. **Sidebar:** Live Cost Dashboard (always visible, collapsible on mobile)
5. **Mobile:** Bottom tab navigation, stacked layouts

---

## 3. Deep-Dive: 7 Pre-Engineered Master Blueprint Modules

### 3.1 Standard Classroom Blueprint

**Default Configuration:**
- Floor area: 80m² (10m × 8m) — fits 40 students at 2.0m²/student (Cambridge standard)
- Equipment: 40 student desks + chairs, 1 teacher desk + chair, 1 whiteboard (3.6m × 1.2m), 1 marker set (8 markers + eraser), 2 wall clocks, 1 closet/cabinet (storage), 4 window curtains/blinds
- Ventilation: 4 ceiling fans or 2 wall-mounted fans (climate-dependent)
- Lighting: 6 LED tube fixtures (4ft), natural light from 4 windows minimum
- Electrical: 4 power outlets (teacher area + 3 student zones)

**Cambridge Compliance:**
- Minimum 1.5m² per student (floor area)
- Whiteboard visible from all seats
- Natural lighting from left side (anti-glare)
- Power outlets for projector/laptop

### 3.2 Physics Laboratory Blueprint

**Default Configuration:**
- Floor area: 100m² (12.5m × 8m) — fits 30 students at 3.3m²/student (lab safety standard)
- Equipment: 15 lab benches (1800mm × 700mm, 2 students each), 30 lab stools (adjustable height), 1 teacher demonstration bench (2400mm × 900mm), 1 whiteboard, 1 projection screen, 30 safety goggles, 30 lab aprons, fire extinguisher (CO2), first aid kit
- Specialized: Oscilloscopes (15), power supplies (15), multimeters (30), lens sets (15), pulley systems (10), spring balances (15), optics benches (5)
- Storage: 4 equipment cabinets, 1 chemical storage cabinet (fire-rated)
- Safety: Emergency shower, eyewash station, ventilation hood

**Climate Modifiers:**
- Arid: Add dehumidifier, sealed storage for moisture-sensitive equipment
- Tropical: Add extra ventilation, anti-humidity cabinets
- Coastal: Marine-grade stainless steel fixtures, anti-corrosion coating

### 3.3 Chemistry Laboratory Blueprint

**Default Configuration:**
- Floor area: 100m² (12.5m × 8m) — fits 30 students
- Equipment: 15 fume hoods, 15 lab benches with gas taps, 30 lab stools, 1 teacher demo bench with fume extraction, 1 whiteboard
- Specialized: Burettes (30), pipettes (60), conical flasks (60), beakers (90), measuring cylinders (30), reagent bottles (200+), heating equipment (15 Bunsen burners + gas supply)
- Safety: Fume extraction system, chemical spill kit, fire blanket, MSDS station, emergency shower, eyewash
- Storage: 4 chemical storage cabinets (segregated by hazard class), 2 equipment cabinets

**Regulatory:** Must comply with Cambridge practical requirements for IGCSE Chemistry (6 required practicals)

### 3.4 Biology Laboratory Blueprint

**Default Configuration:**
- Floor area: 90m² (11.25m × 8m) — fits 30 students
- Equipment: 15 lab benches, 30 lab stools, 1 teacher bench, 1 whiteboard, 15 microscopes, 15 specimen sets, 15 model sets (anatomy), projection system
- Specialized: Slide preparation area (1 bench + equipment), culture/bacteria growth area (sealed, autoclave), botanical specimen storage
- Storage: 4 cabinets (specimens, slides, models, chemicals), 1 refrigerated cabinet
- Safety: Biological waste disposal, handwashing station, PPE storage

### 3.5 ICT / Computer Laboratory Blueprint

**Default Configuration:**
- Floor area: 80m² (10m × 8m) — fits 30 workstations
- Equipment: 30 desktop computers (or laptops + charging stations), 30 desks (1200mm × 600mm), 30 chairs, 1 teacher workstation, 1 projector + screen, 1 network switch, 30m Ethernet cable + 30 ports, 1 UPS (backup power), 1 laser printer
- Power: 30 dedicated power outlets (surge-protected), backup generator connection point
- Climate: Air conditioning required (tropical/arid), anti-static flooring
- Network: Structured cabling to each desk, server rack (small), WiFi access point

**Power Reliability Modifiers:**
- Low reliability zones: Add solar inverter system, battery backup (4hr minimum)
- Add generator backup for extended outages

### 3.6 Geography Map Room / Globe Room

**Default Configuration:**
- Floor area: 70m² (8.75m × 8m) — fits 35 students
- Equipment: 15 large wall maps (world, Africa, continents, climate, vegetation, tectonic plates, rainfall), 6 globes (standard + political + physical), 10 contour model sets, 10 topographic map sets, 1 teacher demonstration desk, 1 whiteboard, 1 projection system
- Specialized: Map storage cabinets (flat file, 4 units), globe display stands, contour terrain models (10 sets), compasses (35),GPS devices (15), rain gauges (10), weather instruments (1 set)
- Display: Map wall mounting rails, display cases for geological specimens

### 3.7 Art & Design Studio

**Default Configuration:**
- Floor area: 80m² (10m × 8m) — fits 25 students (more space needed for art activities)
- Equipment: 25 drawing tables (tilted surface), 25 stools, 1 teacher desk, 1 whiteboard, 1 display board, easels (15), drying rack (1), sinks (2), storage cabinets (4), supply cart (2)
- Specialized: Drawing supplies (pencils, charcoal, pastels per student), paint sets (25), brushes (50), canvases (25), clay/modelling tools (25 sets), printmaking press (1)
- Lighting: Natural light preferred, daylight-balanced LED fixtures, adjustable task lighting at each station
- Storage: Art supply storage room or cabinet (paints, paper, tools), student work-in-progress shelving

### 3.8 Sports Facilities

**Indoor Hall:**
- Floor area: 400m² (20m × 20m minimum)
- Equipment: Basketball hoop set (2), volleyball net set, badminton net set (4), gym mats (30), skipping ropes (30), storage rack for equipment
- Features: Sprung wooden floor or sports vinyl, changing rooms (2), shower area, storage room

**Outdoor Fields:**
- Football/soccer pitch: 90m × 45m (full) or 60m × 30m (small-sided)
- Athletics track: 200m minimum (4-lane)
- Equipment: Football goals (2), athletics equipment (hurdles, javelins, shot puts, long jump pit), outdoor basketball/netball court markings
- Features: Spectator seating (optional), floodlights (if evening use), water fountain

---

## 4. Core Mathematical, Pricing & Engineering Logic

### 4.1 Equipment Base Price Formula

```
Unit_Price_USD = China_Base_Price × (1 + Import_Margin)
```

Where:
- `China_Base_Price` = wholesale price from Alibaba/1688.com/Yiwu market benchmarks
- `Import_Margin` = 0.15 (15% buffer for shipping, customs, local distribution)

### 4.2 African Infrastructure Modifier System

```
Final_Cost_USD = Unit_Price_USD × Climate_Modifier × Power_Modifier × Procurement_Modifier
```

**Climate Modifiers (per zone):**

| Zone | Modifier | Rationale |
|------|----------|-----------|
| Arid (Egypt, Northern Nigeria) | 1.08 | Extra cooling, dust-resistant materials |
| Tropical (Kenya, Ghana, Uganda, Tanzania, Mozambique) | 1.05 | Humidity protection, ventilation |
| Coastal (Dar es Salaam, Maputo, Mombasa) | 1.12 | Marine-grade materials, anti-corrosion |
| Highland (Nairobi, Maseru, Lesotho) | 1.03 | Standard + heating for cold seasons |

**Power Reliability Modifiers:**

| Zone | Modifier | Rationale |
|------|----------|-----------|
| Low reliability (Nigeria, Tanzania, Uganda, Mozambique) | 1.15 | Solar backup, UPS, generator |
| Medium reliability (Ghana, Kenya) | 1.08 | UPS recommended |
| High reliability (South Africa, Egypt) | 1.02 | Standard equipment |

**Procurement Modifiers:**

| Zone | Modifier | Rationale |
|------|----------|-----------|
| High import dependency (Lesotho, Uganda, Mozambique) | 1.10 | Limited local manufacturing |
| Medium import dependency (Kenya, Ghana, Tanzania) | 1.05 | Some local alternatives |
| Local manufacturing (Nigeria, South Africa, Egypt) | 1.00 | Base price |

### 4.3 Capacity Calculation Formula

```
Max_Students = Floor_Area_m² ÷ Floor_Area_Ratio_per_Student
```

**Floor Area Ratios (Cambridge + African Standards):**

| Room Type | Ratio (m²/student) | Source |
|-----------|---------------------|--------|
| Regular Classroom | 1.5 | Cambridge, UBEC, TSC |
| Physics Lab | 2.5 | CLEAPSS / Cambridge practical |
| Chemistry Lab | 2.5 | CLEAPSS / Cambridge practical |
| Biology Lab | 2.2 | Cambridge practical |
| ICT Lab | 2.0 | Becta guidelines |
| Geography Room | 1.8 | Standard |
| Art Studio | 2.5 | Space for activities |
| Staff Room | 4.0 per staff | UK DfE adapted |
| Admin Office | 6.0 per desk | Standard |

### 4.4 Total Project Cost Formula

```
Total_Cost_USD = Σ (Room_Equipment_Cost × Quantity × Climate_Mod × Power_Mod × Procurement_Mod)
               + Site_Preparation_Cost
               + Construction_Cost_per_m² × Total_Building_Area
               + Contingency (10%)
```

**Construction Cost Benchmarks (USD per m², China/India sourced):**

| Component | Cost/m² (USD) |
|-----------|---------------|
| Basic classroom block | $180 - $250 |
| Lab block (plumbing + extraction) | $350 - $500 |
| Admin block | $200 - $300 |
| Sports hall (steel frame) | $150 - $250 |
| External works (roads, drainage) | $40 - $80 |

### 4.5 Multi-Currency Real-Time Conversion

**Base Currency:** USD

**Supported African Currencies (9):**

| Country | Currency | Code | Approximate Rate (2026) |
|---------|----------|------|-------------------------|
| Nigeria | Naira | NGN | 1 USD = 1,550 NGN |
| Kenya | Shilling | KES | 1 USD = 155 KES |
| South Africa | Rand | ZAR | 1 USD = 18.5 ZAR |
| Ghana | Cedi | GHS | 1 USD = 14.8 GHS |
| Tanzania | Shilling | TZS | 1 USD = 2,500 TZS |
| Egypt | Pound | EGP | 1 USD = 48.5 EGP |
| Uganda | Shilling | UGX | 1 USD = 3,750 UGX |
| Mozambique | Metical | MZN | 1 USD = 63.5 MZN |
| Lesotho | Loti | LSL | 1 USD = 18.5 LSL |

**Conversion Formula:**
```
Local_Cost = USD_Cost × Exchange_Rate[Country]
```

### 4.6 Floor Plan SVG Generation Logic

```
1. Parse room list (type, width_m, length_m)
2. Calculate total area needed
3. Apply packing algorithm (bin-packing or grid placement)
4. Generate SVG rectangles for each room
5. Add labels (room name, capacity, area)
6. Add doors (breaks in walls)
7. Scale to fit viewport
8. Export as SVG or render to PNG via canvas
```

**Packing Algorithm:** Simple row-based layout for v1 (rooms placed left-to-right, top-to-bottom, grouped by block: academic, labs, admin, sports)

### 4.7 BoQ Generation Formula

```
BoQ_Row = {
  Item_No: sequential,
  Description: equipment name + spec,
  Unit: piece / set / m² / lot,
  Quantity: count,
  Unit_Price_USD: from catalog × modifiers,
  Total_USD: Quantity × Unit_Price_USD,
  Unit_Price_Local: Unit_Price_USD × Exchange_Rate,
  Total_Local: Total_USD × Exchange_Rate
}
```

---

## 5. Data Provenance & Empirical Sources

### 5.1 Equipment Pricing Sources

| Source | Type | Use |
|--------|------|-----|
| Alibaba.com / 1688.com | Wholesale | China base prices for furniture, lab equipment |
| Yiwu Market benchmarks | Wholesale | Small items, stationery, accessories |
| Local African suppliers | Retail/wholesale | Kenya (Jumia), Nigeria (Jumia/Konga), SA (Takealot) — validation |
| Cambridge International | Curriculum | Subject requirements, practical specifications |

### 5.2 African Regulatory Standards

| Country | Body | Standard |
|---------|------|----------|
| Nigeria | UBEC (Universal Basic Education Commission) | Classroom specs, teacher ratios |
| Kenya | TSC (Teachers Service Commission) | School infrastructure guidelines |
| South Africa | DBE (Department of Basic Education) | Norms and standards for school infrastructure |
| Ghana | Ghana Education Service | School building specifications |
| Tanzania | MoEST (Ministry of Education) | Secondary school infrastructure guidelines |
| Egypt | Ministry of Education | School building code |
| Uganda | MoES (Ministry of Education & Sports) | School infrastructure standards |
| Mozambique | MINEDH (Ministry of Education) | School construction norms |
| Lesotho | MoEST (Ministry of Education) | School building standards |

### 5.3 Cambridge Curriculum Requirements

| Subject | Practical Requirements | Equipment Standard |
|---------|----------------------|-------------------|
| Physics IGCSE | 6 required practicals | CLEAPSS equivalent |
| Chemistry IGCSE | 6 required practicals | Fume hood mandatory |
| Biology IGCSE | 6 required practicals | Microscope required |
| ICT | Theory + practical | Computer per student |
| Geography | Map reading, fieldwork | Maps, globes, GPS |

---

## 6. Comprehensive Troubleshooting & "How to Fix" Manual

### 6.1 Issue: SVG Floor Plan Clipping on Small Screens
**Fix:** Implement responsive SVG viewBox scaling. Use CSS `max-width: 100%` on SVG container. Add pan/zoom controls for mobile.

### 6.2 Issue: Currency Rate Desync / Stale Rates
**Fix:** Store rates in JSON with `last_updated` timestamp. Show staleness warning if > 7 days old. Allow manual rate override. Fetch live rates from free API (ExchangeRate-API free tier) with graceful fallback.

### 6.3 Issue: LocalStorage Quota Exceeded (Large Projects)
**Fix:** Implement IndexedDB as primary storage (larger quota). Auto-compress project data. Show storage usage indicator. Offer export-as-file fallback.

### 6.4 Issue: PDF Export Layout Breaks
**Fix:** Use fixed-width layout in PDF generation. Test with A4 paper size. Use page breaks between sections. Ensure font embedding for special characters (African names).

### 6.5 Issue: Mobile Touch Conflicts on Floor Plan
**Fix:** Separate pan gesture (two-finger) from zoom gesture (pinch). Add explicit zoom buttons. Use `touch-action: none` on SVG container.

### 6.6 Issue: Equipment Catalog Performance with 500+ Items
**Fix:** Virtual scrolling for large lists. Debounce search input. Lazy-load item details. Paginate results (50 per page).

---

## 7. Developer Guide: How to Rebuild & Extend the Logic

### 7.1 Blueprint Schema Standard

```javascript
// Room Blueprint Schema
{
  id: "physics-lab-001",
  type: "physics_lab",           // enum: classroom, physics_lab, chemistry_lab, etc.
  name: "Physics Lab 1",
  width_m: 12.5,
  length_m: 8,
  area_m2: 100,
  capacity: 30,                  // max students
  equipment: [
    {
      id: "lab-bench-001",
      name: "Standard Lab Bench",
      spec: "1800mm × 700mm, hardwood top, steel frame",
      quantity: 15,
      unit_price_usd: 85,
      source: "Alibaba",
      category: "furniture"
    },
    // ... more items
  ],
  modifiers: {
    climate: "tropical",
    power: "low",
    procurement: "medium"
  }
}
```

### 7.2 Step-by-Step: Adding a New Room Type

1. Add room type to `data/cambridge-curriculum.js` enum
2. Define default equipment list in `data/equipment-catalog.js`
3. Set floor area ratio in `data/floor-area-ratios.js`
4. Add to room type selector in `views/RoomPlanner.jsx`
5. Add SVG representation in `engine/floor-plan-generator.js`
6. Update BoQ generator to handle new room type

### 7.3 Adding Custom Currencies and Regional Factors

1. Add currency to `data/currencies.js` with exchange rate
2. Add country to `data/african-infrastructure.js` with modifiers
3. Update country selector in `views/SchoolConfig.jsx`
4. Add regulatory standards reference

### 7.4 Rebuilding the Core Calculation Engine from Scratch

1. Start with `engine/cost-calculator.js` — base price × modifiers
2. Add `engine/capacity-calculator.js` — floor area ÷ ratio
3. Add `engine/site-calculator.js` — building footprint + setbacks
4. Add `engine/boq-generator.js` — itemized cost breakdown
5. Wire all engines to `views/CostDashboard.jsx` for live display

---

## 8. Tender Export & Bankable Feasibility Specification

### 8.1 PDF Tender Document Structure

```
1. Cover Page
   - School name, location, country
   - Project title, date, version
   - Confidentiality statement

2. Executive Summary
   - School overview (student count, curriculum, phases)
   - Total estimated cost (USD + local currency)
   - Timeline summary

3. School Configuration
   - Site plan (SVG floor plan)
   - Room schedule (list of all rooms with areas)
   - Capacity analysis (students per room, compliance flags)

4. Bill of Quantities (BoQ)
   - Itemized by room/block
   - Each item: description, spec, quantity, unit price, total
   - Subtotals per room, grand total

5. Infrastructure Requirements
   - Power requirements (total kW, backup needs)
   - Water requirements (liters/day)
   - Ventilation/HVAC requirements
   - Network/data requirements

6. Teacher & Staff Requirements
   - Teacher-to-staff ratios per subject
   - Total teaching staff needed
   - Support staff needed

7. Phased Construction Plan
   - Phase breakdown (if applicable)
   - Per-phase cost and timeline

8. Regulatory Compliance
   - Country-specific standards met
   - Cambridge curriculum alignment

9. Procurement Notes
   - Sourcing strategy (China/India + local)
   - Import duty estimates
   - Logistics considerations

10. Appendices
    - Full equipment catalog with specs
    - Exchange rates used
    - Climate zone reference
    - Modifier reference tables
```

### 8.2 CSV Export Format

```csv
Item_No,Room,Block,Description,Spec,Unit,Quantity,Unit_Price_USD,Total_USD,Unit_Price_Local,Total_Local,Currency
1,Physics Lab 1,Labs,Lab Bench,1800x700mm hardwood,pc,15,85.00,1275.00,131.78,1976.56,KES
2,Physics Lab 1,Labs,Lab Stool,Adjustable height,pc,30,22.00,660.00,34.19,1025.81,KES
...
```

### 8.3 JSON Export Schema

```json
{
  "project": {
    "name": "Example Secondary School",
    "country": "KE",
    "currency": "KES",
    "curriculum": "Cambridge IGCSE",
    "total_students": 500,
    "created_at": "2026-08-26T10:00:00Z",
    "version": "1.0"
  },
  "rooms": [...],
  "equipment_total_usd": 125000,
  "construction_total_usd": 450000,
  "total_project_usd": 618750,
  "total_project_local": 95906250,
  "modifiers": {...},
  "exchange_rates": {...}
}
```

### 8.4 SVG/PNG Floor Plan Export

- SVG: Vector format, scalable, printable at any size
- PNG: Rasterized at 300 DPI for embedding in PDF documents
- Include: Room labels, dimensions, area callouts, legend, scale bar, north arrow

---

## 9. Official Trademark, Copyright & License Declaration

### Project Name
**OpenSchool Blueprint Engine**

### License
**GNU General Public License v3.0 (GPLv3)** — free to use, modify, and distribute. Any derivative works must also be open-source under GPLv3.

### Open Source Declaration
This project is free and open-source. No fees, no subscriptions, no premium tiers. All equipment data, formulas, and infrastructure modifiers are transparent and editable by any user.

### Data Attribution
- Equipment prices are estimates based on publicly available wholesale data (Alibaba, 1688, Yiwu market benchmarks) — not fixed retail prices
- Exchange rates are approximate and should be verified before procurement
- Regulatory standards are summarized references — always consult official country documentation

### Contributing
Contributions welcome: new countries, new room types, price updates, curriculum additions, translations. Submit pull requests to the open repository.

---

## 10. Implementation Priority (v1 Scope)

| Priority | Feature | Effort |
|----------|---------|--------|
| P0 | School Config (country, students, curriculum) | Small |
| P0 | Room Planner (all room types, equipment assignment) | Medium |
| P0 | Equipment Catalog (pre-loaded + editable) | Medium |
| P0 | Live Cost Dashboard (real-time calculation) | Medium |
| P0 | African Infrastructure Modifiers (9 countries) | Medium |
| P0 | BoQ Generator (CSV + PDF) | Medium |
| P1 | Floor Plan SVG Visualizer | Large |
| P1 | PDF Tender Export (full document) | Large |
| P1 | Teacher/Staff Planner | Small |
| P1 | Site Calculator | Small |
| P2 | PNG Floor Plan Export | Small |
| P2 | JSON Data Interchange | Small |
| P2 | IndexedDB Persistence | Small |
| P2 | Dark/Light Theme Toggle | Small |
| v2 | Country Cost Comparison | Medium |
| v2 | Phased Construction Planning | Medium |
| v2 | Live Exchange Rate API | Small |
