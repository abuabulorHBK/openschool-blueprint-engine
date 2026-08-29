/**
 * WeasyPrint & HTML Print Layout Generator
 * 
 * Generates standalone, self-contained HTML/CSS print documents with 
 * CSS Paged Media rules (@page) ready for WeasyPrint CLI, PrinceXML, or Browser Print-to-PDF.
 */

import { AFRICAN_COUNTRIES } from '../data/african-infrastructure.js';
import { formatCurrency } from '../data/currencies.js';
import { calculateProjectFinancials } from './cost-calculator.js';
import { computeStaffingRequirements, CAMBRIDGE_LEVELS } from '../data/cambridge-curriculum.js';
import { generateBoQTable } from './boq-generator.js';
import { cleanText } from './slop-filter.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates print-ready HTML/CSS suitable for WeasyPrint.
 */
export function generateWeasyPrintHTML(schoolConfig, rooms = [], options = { sanitizeSlop: true }) {
  const sanitize = (txt) => options.sanitizeSlop ? escapeHtml(cleanText(txt)) : escapeHtml(txt);

  const countryData = AFRICAN_COUNTRIES[schoolConfig.countryCode] || AFRICAN_COUNTRIES.TZ;
  const financials = calculateProjectFinancials(schoolConfig, rooms);
  const currencyCode = financials.currencyCode;
  const boq = generateBoQTable(schoolConfig, rooms);
  const staffing = computeStaffingRequirements(schoolConfig.staffingPlan, schoolConfig.totalStudents || 500, rooms);
  const curriculumInfo = CAMBRIDGE_LEVELS[schoolConfig.curriculumLevel] || CAMBRIDGE_LEVELS.necta_csee || CAMBRIDGE_LEVELS.igcse;

  const schoolName = sanitize(schoolConfig.name || 'Dar es Salaam Secondary Academy');
  const location = sanitize(schoolConfig.location || 'Kinondoni District, Dar es Salaam');
  const notes = sanitize(schoolConfig.notes || 'Center of excellence for NECTA / Cambridge education.');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${schoolName} — Infrastructure Dossier</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm 15mm 20mm 15mm;
      @top-left {
        content: "OpenSchool Blueprint Engine | ${schoolName}";
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
      @top-right {
        content: "Cambridge Tender Dossier";
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
      @bottom-left {
        content: "OpenSchool Blueprint Engine™ • Created by @cambridgeacademytutorsfreeknowledgeworld (cambridgeacademytutorstz@gmail.com) • 100% Free Platform";
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 7.5pt;
        color: #94a3b8;
      }
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
    }

    @page:first {
      @top-left { content: none; }
      @top-right { content: none; }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 9.5pt;
      line-height: 1.45;
    }

    .page-break {
      page-break-before: always;
    }

    .avoid-break {
      page-break-inside: avoid;
    }

    /* Cover / Hero Card */
    .hero-box {
      background: #0f172a;
      color: #ffffff;
      padding: 24px;
      border-radius: 6px;
      margin-bottom: 24px;
    }

    .hero-badge {
      font-size: 8pt;
      font-weight: 700;
      color: #818cf8;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .hero-title {
      font-size: 22pt;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .hero-meta {
      font-size: 10pt;
      color: #cbd5e1;
      line-height: 1.5;
    }

    /* Section Headings */
    h1 {
      font-size: 15pt;
      font-weight: 700;
      color: #1e1b4b;
      border-bottom: 2px solid #4338ca;
      padding-bottom: 6px;
      margin-top: 18px;
      margin-bottom: 14px;
    }

    h2 {
      font-size: 12pt;
      font-weight: 700;
      color: #312e81;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 18px;
    }

    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 14px;
    }

    .card h3 {
      font-size: 10.5pt;
      color: #4338ca;
      margin-bottom: 8px;
    }

    .card ul {
      list-style-type: none;
      padding-left: 0;
    }

    .card li {
      margin-bottom: 4px;
      font-size: 9pt;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 8.5pt;
    }

    th {
      background: #4338ca;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #312e81;
    }

    th.dark {
      background: #0f172a;
      border-color: #0f172a;
    }

    td {
      padding: 5px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: middle;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    .text-right {
      text-align: right;
    }

    .text-center {
      text-align: center;
    }

    .notice-box {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 10px 14px;
      border-radius: 0 4px 4px 0;
      margin-bottom: 16px;
      font-size: 9pt;
      color: #1e3a8a;
    }
  </style>
</head>
<body>

  <!-- COVER SECTION -->
  <div class="hero-box">
    <div class="hero-badge">OpenSchool Blueprint Engine — Tender Dossier</div>
    <div class="hero-title">${schoolName}</div>
    <div class="hero-meta">
      <strong>Location:</strong> ${location}, ${escapeHtml(countryData.name)} ${escapeHtml(countryData.flag || '')}<br>
      <strong>Regulatory Authority:</strong> ${escapeHtml(countryData.regulatoryBody)} (${escapeHtml(countryData.regulatoryStandard)})<br>
      <strong>Enrollment Target:</strong> ${schoolConfig.totalStudents || 500} Students &bull; <strong>Curriculum:</strong> ${escapeHtml(curriculumInfo.name)}
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h3>Financial Summary</h3>
      <ul>
        <li><strong>Grand Total (USD):</strong> $${financials.totals.grandTotalUSD.toLocaleString()}</li>
        <li><strong>Grand Total (${currencyCode}):</strong> ${escapeHtml(formatCurrency(financials.totals.grandTotalLocal, currencyCode))}</li>
        <li><strong>Cost Per Student:</strong> ${escapeHtml(formatCurrency(financials.totals.costPerStudentLocal, currencyCode))} ($${financials.totals.costPerStudentUSD.toLocaleString()} USD)</li>
        <li><strong>Built Area:</strong> ${financials.totals.totalBuildingAreaM2} m²</li>
      </ul>
    </div>
    <div class="card">
      <h3>Infrastructure & Economic Modifiers</h3>
      <ul>
        <li><strong>Economic Inflation:</strong> ${financials.modifiers.inflationRate >= 0 ? '+' : ''}${financials.modifiers.inflationRate}% (${financials.modifiers.inflationModifier}x)</li>
        <li><strong>Climate Zone:</strong> ${escapeHtml(financials.modifiers.climate.name)} (${financials.modifiers.climate.modifier}x)</li>
        <li><strong>Power Grid:</strong> ${escapeHtml(financials.modifiers.power.name.split('(')[0])} (${financials.modifiers.power.modifier}x)</li>
        <li><strong>Combined Multiplier:</strong> ${financials.modifiers.combinedModifier}x (incl. 10% Contingency)</li>
      </ul>
    </div>
  </div>

  <div class="notice-box">
    <strong>Strategic Project Note:</strong> ${notes}
  </div>

  <!-- PAGE 2: ROOM SCHEDULE -->
  <div class="page-break"></div>
  <h1>1. Room Schedule & Spatial Capacity Analysis</h1>
  <table>
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th>Room Name</th>
        <th>Category</th>
        <th>Dimensions</th>
        <th class="text-right">Area</th>
        <th class="text-right">Capacity</th>
        <th class="text-right">Spatial Ratio</th>
      </tr>
    </thead>
    <tbody>
      ${rooms.map((r, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td><strong>${sanitize(r.name)}</strong></td>
          <td>${sanitize(r.type.replace(/_/g, ' ').toUpperCase())}</td>
          <td>${r.width_m}m &times; ${r.length_m}m</td>
          <td class="text-right">${r.area_m2} m²</td>
          <td class="text-right">${r.capacity} stds</td>
          <td class="text-right">${(r.area_m2 / (r.capacity || 1)).toFixed(2)} m²/std</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- PAGE 3: BILL OF QUANTITIES -->
  <div class="page-break"></div>
  <h1>2. Itemized Bill of Quantities (BoQ) & Sourcing</h1>
  <table>
    <thead>
      <tr>
        <th class="dark text-center">Item #</th>
        <th class="dark">Room</th>
        <th class="dark">Description & Spec</th>
        <th class="dark text-center">Unit</th>
        <th class="dark text-right">Qty</th>
        <th class="dark text-right">Unit USD</th>
        <th class="dark text-right">Total USD</th>
        <th class="dark text-right">Total (${currencyCode})</th>
      </tr>
    </thead>
    <tbody>
      ${boq.items.slice(0, 45).map(item => `
        <tr>
          <td class="text-center">${escapeHtml(item.itemNo)}</td>
          <td>${sanitize(item.roomName)}</td>
          <td>${sanitize(item.itemName)}</td>
          <td class="text-center">${escapeHtml(item.unit)}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">$${item.unitPriceUSD.toFixed(2)}</td>
          <td class="text-right">$${item.totalUSD.toFixed(2)}</td>
          <td class="text-right">${escapeHtml(formatCurrency(item.totalLocal, currencyCode))}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- PAGE 4: FACULTY STAFFING -->
  <div class="page-break"></div>
  <h1>3. Cambridge Faculty & Staffing Plan</h1>
  <div class="notice-box">
    <strong>Staffing Highlights:</strong> Academic Teachers: ${staffing.totalTeachingStaff} &bull; Support Staff: ${staffing.totalSupportStaff} &bull; Total Faculty: ${staffing.totalFacultyAndStaff} &bull; Student-Teacher Ratio: 1:${staffing.overallRatio}
  </div>

  <h2>Subject Teaching Allocations</h2>
  <table>
    <thead>
      <tr>
        <th>Subject Name</th>
        <th>Category</th>
        <th class="text-right">Cohort Size</th>
        <th class="text-right">Ratio</th>
        <th>Practical Examination Specification</th>
        <th class="text-right">Teachers</th>
      </tr>
    </thead>
    <tbody>
      ${staffing.subjects.map(s => `
        <tr>
          <td><strong>${sanitize(s.name)}</strong></td>
          <td>${sanitize(s.category.toUpperCase())}</td>
          <td class="text-right">${s.subjectStudents} (${s.participationRatePct}%)</td>
          <td class="text-right">1 : ${s.recommendedTeacherRatio}</td>
          <td>${sanitize(s.practicalPaper || (s.practicalsMandatory ? 'Mandatory Practical' : 'Theory Exam'))}</td>
          <td class="text-right"><strong>${s.teachersNeeded}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Specialist & Technical Support</h2>
  <table>
    <thead>
      <tr>
        <th class="dark">Role / Position</th>
        <th class="dark text-right">Headcount</th>
        <th class="dark">Responsibilities</th>
      </tr>
    </thead>
    <tbody>
      ${staffing.supportStaff.map(st => `
        <tr>
          <td><strong>${sanitize(st.title)}</strong></td>
          <td class="text-right">${st.count}</td>
          <td>${sanitize(st.description || 'Specialist operations')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

</body>
</html>`;
}

/**
 * Initiates browser download of generated HTML file.
 */
export function downloadWeasyPrintHTML(filename, htmlContent) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
