/**
 * Typst Blueprint & Dossier Source Generator
 * 
 * Generates compilation-ready Typst (.typ) markup for bankable school dossiers,
 * architectural space plans, BoQs, and Cambridge curriculum audits.
 */

import { AFRICAN_COUNTRIES } from '../data/african-infrastructure.js';
import { formatCurrency } from '../data/currencies.js';
import { calculateProjectFinancials } from './cost-calculator.js';
import { computeStaffingRequirements, CAMBRIDGE_LEVELS } from '../data/cambridge-curriculum.js';
import { generateBoQTable } from './boq-generator.js';
import { cleanText } from './slop-filter.js';

/**
 * Escapes characters that have special meaning in Typst markup.
 */
function escapeTypst(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/#/g, '\\#')
    .replace(/\$/g, '\\$')
    .replace(/@/g, '\\@')
    .replace(/`/g, '\\`');
}

/**
 * Generates a complete, publication-grade Typst document source (.typ)
 * @param {object} schoolConfig 
 * @param {Array} rooms 
 * @param {object} options - Options like { sanitizeSlop: true }
 * @returns {string} Typst markup code
 */
export function generateTypstDossier(schoolConfig, rooms = [], options = { sanitizeSlop: true }) {
  const sanitize = (txt) => options.sanitizeSlop ? escapeTypst(cleanText(txt)) : escapeTypst(txt);

  const countryData = AFRICAN_COUNTRIES[schoolConfig.countryCode] || AFRICAN_COUNTRIES.TZ;
  const financials = calculateProjectFinancials(schoolConfig, rooms);
  const currencyCode = financials.currencyCode;
  const boq = generateBoQTable(schoolConfig, rooms);
  const staffing = computeStaffingRequirements(schoolConfig.staffingPlan, schoolConfig.totalStudents || 500, rooms);
  const curriculumInfo = CAMBRIDGE_LEVELS[schoolConfig.curriculumLevel] || CAMBRIDGE_LEVELS.necta_csee || CAMBRIDGE_LEVELS.igcse;

  const schoolName = sanitize(schoolConfig.name || 'Dar es Salaam Secondary Academy');
  const location = sanitize(schoolConfig.location || 'Kinondoni District, Dar es Salaam');
  const notes = sanitize(schoolConfig.notes || 'Center of excellence for NECTA / Cambridge education.');

  let code = `// ==============================================================================
// OPENSCHOOL BLUEPRINT ENGINE — BANKABLE DOSSIER (TYPST)
// Auto-generated publication layout for African Educational Infrastructure
// ==============================================================================

#set page(
  paper: "a4",
  margin: (x: 2cm, top: 2.5cm, bottom: 2.5cm),
  header: locate(loc => {
    if loc.page() > 1 [
      #grid(
        columns: (1fr, auto),
        align(left)[#text(size: 8pt, fill: rgb("64748b"))[*OpenSchool Blueprint Engine* | ${schoolName}]],
        align(right)[#text(size: 8pt, fill: rgb("64748b"))[Cambridge Infrastructure Dossier]]
      )
      #v(0.3cm)
      #line(length: 100%, stroke: 0.5pt + rgb("cbd5e1"))
    ]
  }),
  footer: locate(loc => {
    if loc.page() > 1 [
      #line(length: 100%, stroke: 0.5pt + rgb("cbd5e1"))
      #v(0.3cm)
      #grid(
        columns: (1fr, auto),
        align(left)[#text(size: 7.5pt, fill: rgb("94a3b8"))[OpenSchool Blueprint Engine™ • Created by @cambridgeacademytutorsfreeknowledgeworld (cambridgeacademytutorstz@gmail.com) • 100% Free Platform]],
        align(right)[#text(size: 8pt, fill: rgb("64748b"))[Page #loc.page()]]
      )
    ]
  })
)

#set text(
  font: ("Inter", "Helvetica", "Arial", "Liberation Sans"),
  size: 9.5pt,
  fill: rgb("0f172a"),
  weight: "regular"
)

#show heading: set text(fill: rgb("0f172a"), weight: "bold")
#show heading.where(level: 1): it => {
  v(0.6cm)
  text(size: 15pt, fill: rgb("1e1b4b"), it.body)
  v(0.3cm)
}
#show heading.where(level: 2): it => {
  v(0.4cm)
  text(size: 12pt, fill: rgb("312e81"), it.body)
  v(0.2cm)
}

// ------------------------------------------------------------------------------
// COVER / EXECUTIVE HEADER
// ------------------------------------------------------------------------------

#rect(
  width: 100%,
  fill: rgb("0f172a"),
  radius: 6pt,
  inset: 18pt
)[
  #grid(
    columns: (1fr),
    gutter: 10pt,
    [
      #text(size: 8pt, weight: "bold", fill: rgb("818cf8"), tracking: 1.5pt)[OPENSCHOOL BLUEPRINT ENGINE — TENDER DOSSIER]
      
      #v(4pt)
      #text(size: 20pt, weight: "bold", fill: rgb("ffffff"))[${schoolName}]
      
      #v(4pt)
      #text(size: 10.5pt, fill: rgb("cbd5e1"))[
        *Location:* ${location}, ${escapeTypst(countryData.name)} | *Standard:* ${escapeTypst(countryData.regulatoryStandard)}
      ]
      
      #text(size: 9pt, fill: rgb("94a3b8"))[
        *Target Enrollment:* ${schoolConfig.totalStudents || 500} Students | *Curriculum:* ${escapeTypst(curriculumInfo.name)}
      ]
    ]
  )
]

#v(0.6cm)

// ------------------------------------------------------------------------------
// FINANCIAL & INFRASTRUCTURE SUMMARY CARDS
// ------------------------------------------------------------------------------

#grid(
  columns: (1fr, 1fr),
  gutter: 14pt,
  [
    #rect(width: 100%, fill: rgb("f8fafc"), stroke: 1pt + rgb("e2e8f0"), radius: 4pt, inset: 12pt)[
      #text(weight: "bold", size: 10pt, fill: rgb("4338ca"))[Financial Overview (Bankable)]
      #v(6pt)
      - *Grand Total (USD):* \\$${financials.totals.grandTotalUSD.toLocaleString()}
      - *Grand Total (${currencyCode}):* ${escapeTypst(formatCurrency(financials.totals.grandTotalLocal, currencyCode))}
      - *Cost Per Student:* ${escapeTypst(formatCurrency(financials.totals.costPerStudentLocal, currencyCode))} (\\$${financials.totals.costPerStudentUSD.toLocaleString()} USD)
      - *Built Area Footprint:* ${financials.totals.totalBuildingAreaM2} m²
    ]
  ],
  [
    #rect(width: 100%, fill: rgb("f8fafc"), stroke: 1pt + rgb("e2e8f0"), radius: 4pt, inset: 12pt)[
      #text(weight: "bold", size: 10pt, fill: rgb("4338ca"))[Infrastructure & Economic Modifiers]
      #v(6pt)
      - *Economic Inflation:* ${financials.modifiers.inflationRate >= 0 ? '+' : ''}${financials.modifiers.inflationRate}% (${financials.modifiers.inflationModifier}x)
      - *Climate Zone:* ${escapeTypst(financials.modifiers.climate.name)} (${financials.modifiers.climate.modifier}x)
      - *Power System:* ${escapeTypst(financials.modifiers.power.name.split('(')[0])} (${financials.modifiers.power.modifier}x)
      - *Combined Multiplier:* ${financials.modifiers.combinedModifier}x (incl. 10% Contingency)
    ]
  ]
)

#v(0.4cm)
#text(size: 9pt, style: "italic", fill: rgb("64748b"))[
  *Project Strategic Notes:* ${notes}
]

#pagebreak()

// ------------------------------------------------------------------------------
// 1. ROOM SCHEDULE & SPATIAL CAPACITY ANALYSIS
// ------------------------------------------------------------------------------

= 1. Room Schedule & Spatial Capacity Analysis

The spatial allocation adheres to standard Cambridge International Education recommendations and regional building authority safety minimums.

#v(0.3cm)

#table(
  columns: (auto, 2fr, 1.2fr, 1.2fr, 1fr, 1fr, 1.2fr),
  fill: (x, y) => if y == 0 { rgb("4338ca") } else if calc.even(y) { rgb("f8fafc") } else { white },
  stroke: (x, y) => if y == 0 { (bottom: 1.5pt + rgb("312e81")) } else { 0.5pt + rgb("e2e8f0") },
  inset: 6pt,
  align: (col, row) => if row == 0 { center + horizon } else if col == 0 { center } else if col >= 3 { right } else { left },
  table.header(
    [*\\#*], [*Room Name*], [*Category*], [*Dimensions*], [*Area*], [*Cap.*], [*Spatial Ratio*]
  ),
${rooms.map((r, idx) => `  [${idx + 1}], [${sanitize(r.name)}], [${sanitize(r.type.replace(/_/g, ' '))}], [${r.width_m}m × ${r.length_m}m], [${r.area_m2} m²], [${r.capacity}], [${(r.area_m2 / (r.capacity || 1)).toFixed(2)} m²/s],`).join('\n')}
)

#v(0.5cm)
#text(size: 8.5pt, fill: rgb("64748b"))[
  *Summary:* Total Planned Rooms: ${rooms.length} | Aggregate Classroom & Lab Area: ${financials.totals.totalBuildingAreaM2} m².
]

#pagebreak()

// ------------------------------------------------------------------------------
// 2. ITEMIZED BILL OF QUANTITIES (BoQ)
// ------------------------------------------------------------------------------

= 2. Itemized Bill of Quantities (BoQ) & Sourcing

Itemized procurement breakdown with unit costs adjusted for local import duties and climate coatings.

#v(0.3cm)

#table(
  columns: (0.8fr, 1.8fr, 2.5fr, 0.8fr, 0.6fr, 1fr, 1fr, 1.2fr),
  fill: (x, y) => if y == 0 { rgb("0f172a") } else if calc.even(y) { rgb("f8fafc") } else { white },
  stroke: (x, y) => if y == 0 { (bottom: 1.5pt + rgb("0f172a")) } else { 0.5pt + rgb("e2e8f0") },
  inset: 5pt,
  align: (col, row) => if row == 0 { center + horizon } else if col == 0 { center } else if col >= 4 { right } else { left },
  table.header(
    [*Item \\#*], [*Room*], [*Specification*], [*Unit*], [*Qty*], [*Unit USD*], [*Total USD*], [*Total ${currencyCode}*]
  ),
${boq.items.slice(0, 40).map(item => `  [${escapeTypst(item.itemNo)}], [${sanitize(item.roomName)}], [${sanitize(item.itemName)}], [${escapeTypst(item.unit)}], [${item.quantity}], [\\$${item.unitPriceUSD.toFixed(2)}], [\\$${item.totalUSD.toFixed(2)}], [${escapeTypst(formatCurrency(item.totalLocal, currencyCode))}],`).join('\n')}
)

${boq.items.length > 40 ? `\n#text(size: 8pt, style: "italic", fill: rgb("64748b"))[Table truncated for print dossier view. Total items in project catalogue: ${boq.items.length}.]\n` : ''}

#pagebreak()

// ------------------------------------------------------------------------------
// 3. TEACHER & FACULTY STAFFING SCHEDULE
// ------------------------------------------------------------------------------

= 3. Cambridge Faculty & Staffing Plan

#rect(width: 100%, fill: rgb("eff6ff"), stroke: 1pt + rgb("bfdbfe"), radius: 4pt, inset: 10pt)[
  *Faculty Staffing Metrics:*
  - *Academic Subject Teachers:* ${staffing.totalTeachingStaff} Teachers
  - *Technical & Support Specialists:* ${staffing.totalSupportStaff} Staff
  - *Combined Faculty Count:* ${staffing.totalFacultyAndStaff} Full-Time Equivalent
  - *Overall Student-Teacher Ratio:* 1 : ${staffing.overallRatio}
  - *Staff Room Desk Coverage:* ${staffing.staffDeskCapacity} Desks (${staffing.isDeskSufficient ? 'Sufficient capacity' : `Deficit of ${staffing.deskDeficit} desks`})
]

#v(0.4cm)

#table(
  columns: (2fr, 1.2fr, 1.2fr, 1fr, 2fr, 1.2fr),
  fill: (x, y) => if y == 0 { rgb("4338ca") } else if calc.even(y) { rgb("f8fafc") } else { white },
  stroke: (x, y) => if y == 0 { (bottom: 1.5pt + rgb("312e81")) } else { 0.5pt + rgb("e2e8f0") },
  inset: 5.5pt,
  align: (col, row) => if row == 0 { center + horizon } else if col >= 2 && col <= 3 { right } else { left },
  table.header(
    [*Subject Area*], [*Category*], [*Cohort*], [*Ratio*], [*Practical / Lab Requirement*], [*Teachers*]
  ),
${staffing.subjects.map(s => `  [${sanitize(s.name)}], [${sanitize(s.category.toUpperCase())}], [${s.subjectStudents} (${s.participationRatePct}%)], [1 : ${s.recommendedTeacherRatio}], [${sanitize(s.practicalPaper || (s.practicalsMandatory ? 'Mandatory Lab Test' : 'Standard Theory'))}], [${s.teachersNeeded} Teachers],`).join('\n')}
)

#v(0.6cm)

== Support & Technical Specialists

#table(
  columns: (2fr, 1fr, 3fr),
  fill: (x, y) => if y == 0 { rgb("0f172a") } else if calc.even(y) { rgb("f8fafc") } else { white },
  stroke: 0.5pt + rgb("e2e8f0"),
  inset: 6pt,
  table.header(
    [*Role & Position*], [*Headcount*], [*Responsibilities & Safety Duties*]
  ),
${staffing.supportStaff.map(st => `  [${sanitize(st.title)}], [${st.count} Staff], [${sanitize(st.description || 'Specialist operations')}],`).join('\n')}
)

#pagebreak()

// ------------------------------------------------------------------------------
// 4. REGULATORY AUDIT & PROJECT FINANCIALS
// ------------------------------------------------------------------------------

= 4. Infrastructure Compliance & Bankable Financial Audit

#grid(
  columns: (1fr, 1fr),
  gutter: 14pt,
  [
    #text(weight: "bold", size: 11pt, fill: rgb("1e1b4b"))[Statutory Compliance Profile]
    #v(4pt)
    - *Host Nation:* ${escapeTypst(countryData.name)} (${escapeTypst(countryData.flag)})
    - *Regulatory Authority:* ${escapeTypst(countryData.regulatoryBody)}
    - *Building Code Standard:* ${escapeTypst(countryData.regulatoryStandard)}
    - *Cambridge Benchmark:* CLEAPSS Safety & ISO 17025 Compliant
    - *Power Specification:* ${escapeTypst(financials.modifiers.power.recommendation)}
  ],
  [
    #text(weight: "bold", size: 11pt, fill: rgb("1e1b4b"))[Environmental Design Directives]
    #v(4pt)
    - *Ventilation:* Dual cross-ventilation passive airflow
    - *Orientation:* Solar axis orientation (East-West facing)
    - *Wall Specification:* 200mm thermal mass masonry
    - *Roofing:* High solar reflectance index (SRI) sheeting
  ]
)

#v(0.6cm)

== Comprehensive Capital Cost Table

#table(
  columns: (3fr, 1.5fr, 1.5fr),
  fill: (x, y) => if y == 0 { rgb("4338ca") } else if y == 5 { rgb("f1f5f9") } else if calc.even(y) { rgb("f8fafc") } else { white },
  stroke: 0.5pt + rgb("cbd5e1"),
  inset: 7pt,
  align: (col, row) => if row == 0 { center + horizon } else if col >= 1 { right } else { left },
  table.header(
    [*Cost Category*], [*USD Amount*], [*Local Currency (${currencyCode})*]
  ),
  [Equipment, Furniture & Labs (Adjusted)], [\\$${financials.totals.equipmentAdjustedUSD.toLocaleString()}], [${escapeTypst(formatCurrency(financials.totals.equipmentAdjustedUSD * (financials.currency.rateToUSD || 1), currencyCode))}],
  [Building Construction (${financials.totals.totalBuildingAreaM2} m²)], [\\$${financials.totals.constructionUSD.toLocaleString()}], [${escapeTypst(formatCurrency(financials.totals.constructionUSD * (financials.currency.rateToUSD || 1), currencyCode))}],
  [Civil & Site Preparation (6%)], [\\$${financials.totals.sitePrepUSD.toLocaleString()}], [${escapeTypst(formatCurrency(financials.totals.sitePrepUSD * (financials.currency.rateToUSD || 1), currencyCode))}],
  [Bankable Contingency Margin (10%)], [\\$${financials.totals.contingencyUSD.toLocaleString()}], [${escapeTypst(formatCurrency(financials.totals.contingencyUSD * (financials.currency.rateToUSD || 1), currencyCode))}],
  [*GRAND TOTAL PROJECT CAPITAL*], [*\\$${financials.totals.grandTotalUSD.toLocaleString()}*], [*${escapeTypst(formatCurrency(financials.totals.grandTotalLocal, currencyCode))}*]
)

#v(1cm)
#align(center)[
  #text(size: 8pt, fill: rgb("94a3b8"))[
    Generated by OpenSchool Blueprint Engine — Free & Open Source Educational Infrastructure Suite (GNU GPLv3)
  ]
]
`;

  return code;
}

/**
 * Initiates browser download of generated Typst file.
 */
export function downloadTypstFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.typ') ? filename : `${filename}.typ`;
  a.click();
  URL.revokeObjectURL(url);
}
