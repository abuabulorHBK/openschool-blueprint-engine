import React, { useState } from 'react';
import { 
  FileDown, 
  FileSpreadsheet, 
  FileCode, 
  CheckCircle, 
  ShieldCheck, 
  Compass, 
  Layers, 
  FileText, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Bell,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import { generateBoQTable, generateBoQCSV, generateClassroomMaterialCSV, generateProjectJSON } from '../engine/boq-generator';
import { generateFloorPlanLayout } from '../engine/floor-plan-generator';
import { generateFloorPlanDXF, downloadDXFFile } from '../engine/dxf-generator';
import { generateTypstDossier, downloadTypstFile } from '../engine/typst-generator';
import { generateWeasyPrintHTML, downloadWeasyPrintHTML } from '../engine/weasyprint-generator';
import { sanitizeSchoolProject } from '../engine/slop-filter';
import { AFRICAN_COUNTRIES } from '../data/african-infrastructure';
import { formatCurrency } from '../data/currencies';
import { calculateProjectFinancials } from '../engine/cost-calculator';
import { computeStaffingRequirements } from '../data/cambridge-curriculum';

export function ExportHub({ schoolConfig, rooms = [] }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [lastExported, setLastExported] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState(() => {
    try {
      return localStorage.getItem('openschool_newsletter_email') || '';
    } catch {
      return '';
    }
  });
  const [newsletterStatus, setNewsletterStatus] = useState(() => {
    try {
      return localStorage.getItem('openschool_newsletter_subscribed') ? 'success' : 'idle';
    } catch {
      return 'idle';
    }
  });

  const countryData = AFRICAN_COUNTRIES[schoolConfig.countryCode] || AFRICAN_COUNTRIES.KE;
  const financials = calculateProjectFinancials(schoolConfig, rooms);
  const currencyCode = financials.currencyCode;

  // Background sanitizer to ensure all outputs are high-grade and professional
  const getSanitizedConfig = () => {
    const { sanitizedProject } = sanitizeSchoolProject({
      ...schoolConfig,
      rooms
    });
    return sanitizedProject;
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if blocked
    }
  };

  // 1. Generate Executive Project & Tender PDF
  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    const cleanConfig = getSanitizedConfig();

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const primaryColor = [99, 102, 241];
      const darkColor = [11, 15, 25];

      // --- PAGE 1: COVER & EXECUTIVE SUMMARY ---
      doc.setFillColor(...darkColor);
      doc.rect(0, 0, 210, 297, 'F');

      // Top Accent Line
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 6, 'F');

      // Institutional Header
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('OPENSCHOOL BLUEPRINT ENGINE', 20, 35);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(129, 140, 248);
      doc.text('AFRICAN INFRASTRUCTURE & EDUCATIONAL PLANNING SUITE', 20, 43);

      // Project Overview Card
      doc.setFillColor(18, 26, 43);
      doc.roundedRect(20, 55, 170, 82, 4, 4, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(cleanConfig.name || 'Cambridge Secondary Campus', 28, 71);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`Location: ${cleanConfig.location || 'Coast Region'}, ${countryData.name} ${countryData.flag}`, 28, 80);
      doc.text(`Target Enrollment: ${cleanConfig.totalStudents || 500} Students • Curriculum: Cambridge Secondary`, 28, 88);
      doc.text(`Regulatory Standard: ${countryData.regulatoryStandard}`, 28, 96);
      doc.text(`Created By: @cambridgeacademytutorsfreeknowledgeworld`, 28, 104);
      doc.text(`Contact: cambridgeacademytutorstz@gmail.com • 100% Free Platform`, 28, 112);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()} • Version: 1.0 (Bankable)`, 28, 120);
      doc.text(`Trademark Notice: Registered solely for creator attribution • GNU GPLv3`, 28, 128);

      // Financial Executive Summary Box
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(20, 144, 170, 68, 4, 4, 'F');

      doc.setTextColor(129, 140, 248);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EXECUTIVE FINANCIAL SUMMARY', 28, 157);

      doc.setFontSize(10.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`Total Estimated Investment (USD): $${financials.totals.grandTotalUSD.toLocaleString()}`, 28, 168);
      doc.text(`Total Estimated Investment (${currencyCode}): ${formatCurrency(financials.totals.grandTotalLocal, currencyCode)}`, 28, 177);
      doc.text(`Cost Per Student: ${formatCurrency(financials.totals.costPerStudentLocal, currencyCode)} ($${financials.totals.costPerStudentUSD.toLocaleString()} USD)`, 28, 186);
      doc.text(`Total Built Area: ${financials.totals.totalBuildingAreaM2} m² • Total Planned Rooms: ${rooms.length}`, 28, 195);

      // Modifiers Card
      doc.setFillColor(18, 26, 43);
      doc.roundedRect(20, 218, 170, 48, 4, 4, 'F');

      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(148, 163, 184);
      doc.text('REGIONAL INFRASTRUCTURE & ECONOMIC MODIFIERS:', 28, 228);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      const inflationTxt = financials.modifiers.inflationRate >= 0 ? `+${financials.modifiers.inflationRate}%` : `${financials.modifiers.inflationRate}%`;
      doc.text(`• Inflation / Escalation: ${inflationTxt} (${financials.modifiers.inflationModifier}x) • Combined Multiplier: ${financials.modifiers.combinedModifier}x`, 28, 236);
      doc.text(`• Climate Zone: ${financials.modifiers.climate.name} (${financials.modifiers.climate.modifier}x)`, 28, 243);
      doc.text(`• Grid Reliability: ${financials.modifiers.power.name.split('(')[0]} (${financials.modifiers.power.modifier}x)`, 28, 250);
      doc.text(`• Procurement & Import Duty: ${financials.modifiers.procurement.name} (${financials.modifiers.procurement.modifier}x)`, 28, 257);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('OpenSchool Blueprint Engine™ • Created by @cambridgeacademytutorsfreeknowledgeworld (cambridgeacademytutorstz@gmail.com) • 100% Free', 20, 285);
      doc.text('Page 1 of 4', 180, 285);

      // --- PAGE 2: ITEMIZED BILL OF QUANTITIES ---
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('1. ITEMIZED BILL OF QUANTITIES (BoQ)', 20, 20);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Masterformat Procurement Schedule • Local Currency: ${currencyCode} • Multipliers Applied`, 20, 27);

      const boqData = generateBoQTable(cleanConfig, rooms);
      const tableRows = (boqData.items || []).map(item => [
        item.itemNo || '-',
        item.itemName || item.name || 'Equipment Item',
        item.category || item.division || 'General',
        `${item.quantity || 1} ${item.unit || 'unit'}`,
        formatCurrency(item.unitPriceUSD || 0, 'USD'),
        formatCurrency(item.totalUSD || 0, 'USD'),
        formatCurrency(item.totalLocal || 0, currencyCode)
      ]);

      autoTable(doc, {
        startY: 32,
        head: [['Item', 'Description', 'Category', 'Qty', 'Unit (USD)', 'Total (USD)', `Total (${currencyCode})`]],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2.2 },
        alternateRowStyles: { fillColor: [248, 250, 252] }
      });

      // --- PAGE 2 FOOTER ---
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('OpenSchool Blueprint Engine™ • Created by @cambridgeacademytutorsfreeknowledgeworld (cambridgeacademytutorstz@gmail.com) • 100% Free', 20, 285);
      doc.text('Page 2 of 4', 180, 285);

      // --- PAGE 3: CAMBRIDGE STAFFING & CURRICULUM ALLOCATION ---
      doc.addPage();
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('2. CURRICULUM & STAFFING PLAN', 20, 20);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Specialist Subject Allocation & Teacher Quotas', 20, 27);

      const staffing = computeStaffingRequirements(cleanConfig.staffingPlan, cleanConfig.totalStudents || 500, rooms);
      const staffRows = (staffing.subjects || []).map(s => [
        s.name,
        `${s.teachersNeeded} FTE`,
        `${s.subjectStudents || 0} Students`,
        s.isOverridden ? 'Manual Override' : 'Optimized Ratio'
      ]);

      autoTable(doc, {
        startY: 32,
        head: [['Department / Subject', 'Required Staff', 'Student Allocation', 'Status']],
        body: staffRows,
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8.5, cellPadding: 2.8 }
      });

      // --- PAGE 3 FOOTER ---
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('OpenSchool Blueprint Engine™ • Created by @cambridgeacademytutorsfreeknowledgeworld (cambridgeacademytutorstz@gmail.com) • 100% Free', 20, 285);
      doc.text('Page 3 of 4', 180, 285);

      // --- PAGE 4: CAD ARCHITECTURAL SCHEDULE ---
      doc.addPage();
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('3. ARCHITECTURAL ROOM & CAD SCHEDULE', 20, 20);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Floor Area Allocations, Capacity Ratios & Equipment Assignments', 20, 27);

      const cadSummaryRows = rooms.map(r => [
        r.name,
        `${r.widthM || 8}m x ${r.lengthM || 7}m`,
        `${(r.widthM || 8) * (r.lengthM || 7)} m²`,
        `${r.capacity || 40} pax`,
        `${((r.widthM || 8) * (r.lengthM || 7) / (r.capacity || 40)).toFixed(1)} m²/pupil`,
        `${(r.equipment || []).length} items`,
        r.specs?.structure || 'Reinforced Concrete'
      ]);

      autoTable(doc, {
        startY: 34,
        head: [['Unit Name', 'Dimensions', 'Area', 'Capacity', 'Ratio', 'Equipment', 'Structure']],
        body: cadSummaryRows,
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2.5 }
      });

      // --- PAGE 4 FOOTER ---
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('OpenSchool Blueprint Engine™ • Created by @cambridgeacademytutorsfreeknowledgeworld (cambridgeacademytutorstz@gmail.com) • 100% Free', 20, 285);
      doc.text('Page 4 of 4', 180, 285);

      const filename = `${(cleanConfig.name || 'OpenSchool_Project').replace(/\s+/g, '_')}_Report.pdf`;
      doc.save(filename);
      setLastExported('Project Report (PDF)');
      triggerConfetti();
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 2. Export AutoCAD DXF Drawing
  const handleExportDXF = () => {
    try {
      const cleanConfig = getSanitizedConfig();
      const floorPlanLayout = generateFloorPlanLayout(rooms, cleanConfig);
      const dxfString = generateFloorPlanDXF(floorPlanLayout, cleanConfig.name || 'OpenSchool Project', countryData.name || 'Africa');
      const filename = `${(cleanConfig.name || 'OpenSchool_Project').replace(/\s+/g, '_')}_Blueprint.dxf`;
      downloadDXFFile(filename, dxfString);
      setLastExported('AutoCAD DXF Drawing');
      triggerConfetti();
    } catch (err) {
      console.error('Error exporting DXF:', err);
    }
  };

  // 3. Export Procurement BoQ CSV
  const handleExportCSV = () => {
    const cleanConfig = getSanitizedConfig();
    const csvContent = generateBoQCSV(cleanConfig, rooms);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(cleanConfig.name || 'OpenSchool_Project').replace(/\s+/g, '_')}_BoQ.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLastExported('Procurement BoQ (CSV)');
    triggerConfetti();
  };

  // Advanced Exports (Internal/Developer)
  const handleExportTypst = () => {
    const cleanConfig = getSanitizedConfig();
    const typstCode = generateTypstDossier(cleanConfig, rooms, { sanitizeSlop: true });
    const filename = `${(cleanConfig.name || 'OpenSchool_Project').replace(/\s+/g, '_')}_Layout.typ`;
    downloadTypstFile(filename, typstCode);
    setLastExported('Typst Source (.typ)');
    triggerConfetti();
  };

  const handleExportWeasyPrint = () => {
    const cleanConfig = getSanitizedConfig();
    const htmlCode = generateWeasyPrintHTML(cleanConfig, rooms, { sanitizeSlop: true });
    const filename = `${(cleanConfig.name || 'OpenSchool_Project').replace(/\s+/g, '_')}_Print_Layout.html`;
    downloadWeasyPrintHTML(filename, htmlCode);
    setLastExported('Print HTML (.html)');
    triggerConfetti();
  };

  const handleExportClassroomMaterialCSV = () => {
    const cleanConfig = getSanitizedConfig();
    const csvContent = generateClassroomMaterialCSV(cleanConfig, 80);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Classroom_Material_Schedule_${countryData.code}_80m2.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLastExported('Classroom Material Schedule (CSV)');
    triggerConfetti();
  };

  const handleExportJSON = () => {
    const cleanConfig = getSanitizedConfig();
    const jsonContent = generateProjectJSON(cleanConfig, rooms);
    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(cleanConfig.name || 'OpenSchool_Project').replace(/\s+/g, '_')}_Backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    setLastExported('Project Data (JSON)');
    triggerConfetti();
  };

  // Newsletter submission
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    setNewsletterStatus('loading');
    setTimeout(() => {
      try {
        localStorage.setItem('openschool_newsletter_subscribed', 'true');
        localStorage.setItem('openschool_newsletter_email', newsletterEmail);
      } catch {
        // Ignore
      }
      setNewsletterStatus('success');
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '-0.3px', color: 'var(--text-main)' }}>
                7. Project & Architectural Exports
              </h2>
              <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                100% FREE & OPEN
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
              Download production-ready CAD blueprints, itemized procurement schedules, and complete executive project documentation.
            </p>
          </div>

          {lastExported && (
            <span className="badge badge-success" style={{ padding: '7px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} /> Downloaded {lastExported}
            </span>
          )}
        </div>
      </div>

      {/* The 3 Core High-Class Export Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        
        {/* CARD 1: Executive Project Report (PDF) */}
        <div className="glass-panel" style={{ 
          padding: '28px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          borderTop: '3px solid #6366f1',
          position: 'relative'
        }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.08) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6366f1',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
            }}>
              <FileDown size={24} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <strong style={{ fontSize: '17px', color: 'var(--text-main)' }}>
                Executive Project Report
              </strong>
              <span className="badge badge-primary" style={{ fontSize: '10px', padding: '1px 6px' }}>PDF</span>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '22px' }}>
              Comprehensive 4-page institutional package including executive financial summary, curriculum teacher ratios, room schedule, and infrastructure multipliers.
            </p>
          </div>

          <div>
            <button 
              className="btn btn-primary"
              onClick={handleExportPDF}
              disabled={isGeneratingPDF}
              style={{ 
                width: '100%', 
                padding: '12px 18px', 
                fontSize: '13.5px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                fontWeight: 700
              }}
            >
              <Download size={16} />
              <span>{isGeneratingPDF ? 'Generating High-Res PDF...' : 'Download Project Report (PDF)'}</span>
            </button>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '8px', textAlign: 'center' }}>
              Attributed to: <strong>@cambridgeacademytutorsfreeknowledgeworld</strong> (100% Free)
            </div>
          </div>
        </div>

        {/* CARD 2: AutoCAD DXF Vector Drawing */}
        <div className="glass-panel" style={{ 
          padding: '28px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          borderTop: '3px solid #f59e0b'
        }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.08) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
            }}>
              <Compass size={24} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <strong style={{ fontSize: '17px', color: 'var(--text-main)' }}>
                Architectural Blueprint
              </strong>
              <span className="badge" style={{ fontSize: '10px', padding: '1px 6px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>DXF CAD</span>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '22px' }}>
              Production-grade 2D CAD vectors organized by standard layers (<code>WALLS</code>, <code>DOORS</code>, <code>WINDOWS</code>, <code>FURNITURE</code>) for AutoCAD, Revit, and LibreCAD.
            </p>
          </div>

          <div>
            <button 
              className="btn btn-secondary"
              onClick={handleExportDXF}
              style={{ 
                width: '100%', 
                padding: '12px 18px', 
                fontSize: '13.5px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                borderColor: 'rgba(245, 158, 11, 0.4)',
                color: 'var(--text-main)',
                fontWeight: 700
              }}
            >
              <Download size={16} />
              <span>Download AutoCAD CAD (.dxf)</span>
            </button>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '8px', textAlign: 'center' }}>
              Titleblock credited to: <strong>@cambridgeacademytutorsfreeknowledgeworld</strong> (100% Free)
            </div>
          </div>
        </div>

        {/* CARD 3: Procurement & Bill of Quantities (CSV / Excel) */}
        <div className="glass-panel" style={{ 
          padding: '28px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          borderTop: '3px solid #10b981'
        }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.08) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
            }}>
              <FileSpreadsheet size={24} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <strong style={{ fontSize: '17px', color: 'var(--text-main)' }}>
                Procurement & BoQ
              </strong>
              <span className="badge" style={{ fontSize: '10px', padding: '1px 6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>CSV / EXCEL</span>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '22px' }}>
              Itemized Bill of Quantities spreadsheet formatted with Masterformat divisions, unit costs, quantities, and dual-currency pricing ({currencyCode} & USD).
            </p>
          </div>

          <div>
            <button 
              className="btn btn-secondary"
              onClick={handleExportCSV}
              style={{ 
                width: '100%', 
                padding: '12px 18px', 
                fontSize: '13.5px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                color: 'var(--text-main)',
                fontWeight: 700
              }}
            >
              <Download size={16} />
              <span>Download BoQ Spreadsheet (.csv)</span>
            </button>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '8px', textAlign: 'center' }}>
              Metadata tagged with: <strong>@cambridgeacademytutorsfreeknowledgeworld</strong> (100% Free)
            </div>
          </div>
        </div>

      </div>

      {/* Advanced Formats (Collapsible / Non-intrusive) */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCode size={16} />
            Advanced & Developer Interchange Formats (Typst, Print HTML, JSON)
          </span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '12px', 
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)'
          }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleExportClassroomMaterialCSV}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <FileSpreadsheet size={14} />
              <span>Classroom Material Schedule (.csv)</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleExportTypst}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Layers size={14} />
              <span>Typst Source (.typ)</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleExportWeasyPrint}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <FileText size={14} />
              <span>Print HTML Template</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleExportJSON}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <FileCode size={14} />
              <span>Raw Project Backup (JSON)</span>
            </button>
          </div>
        )}
      </div>

      {/* Newsletter & Cost Updates Opt-In Panel */}
      <div className="glass-panel" style={{ 
        padding: '24px 28px', 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
        border: '1px solid var(--border-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6366f1'
            }}>
              <Bell size={15} />
            </div>
            <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>
              Get {countryData.name} Construction Cost Updates
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            No account required. Subscribe to receive quarterly price index recalibrations, new architectural presets, and company releases directly to your inbox.
          </p>
        </div>

        <div>
          {newsletterStatus === 'success' ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#10b981',
              fontWeight: 600,
              fontSize: '13px',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)'
            }}>
              <CheckCircle2 size={18} />
              <span>Subscribed for {countryData.name} cost updates!</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your work email..."
                  style={{
                    padding: '9px 12px 9px 36px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    outline: 'none',
                    width: '230px'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={newsletterStatus === 'loading'}
                style={{ padding: '9px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>{newsletterStatus === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Institutional License & Open Source Card */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <ShieldCheck size={28} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>
            100% Free & Open-Access Educational Infrastructure Platform
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0', lineHeight: '1.5' }}>
            OpenSchool Blueprint Engine™ is <strong>100% free and open</strong> for educational planners, architects, schools, and ministries worldwide. The trademark and copyright are registered solely to attribute authorship to <strong>@cambridgeacademytutorsfreeknowledgeworld</strong> (Cambridge Academy Tutors). For collaborations, questions, or custom institutional planning: <a href="mailto:cambridgeacademytutorstz@gmail.com" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>cambridgeacademytutorstz@gmail.com</a>.
          </p>
        </div>
      </div>

    </div>
  );
}
