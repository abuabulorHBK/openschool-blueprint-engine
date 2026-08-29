/**
 * Bill of Quantities (BoQ) Generation Engine
 * Produces structured procurement tables, CSV strings, and JSON datasets,
 * including dynamic inflation metadata and itemized classroom construction schedules.
 */

import { calculateProjectFinancials, calculateClassroomMaterialSchedule } from './cost-calculator.js';
import { CURRENCIES } from '../data/currencies.js';

/**
 * Generate flattened itemized BoQ table
 */
const SPECIAL_OUTSOURCE_DETAILS = [
  "BULK IT PROCUREMENT OUTSOURCE STRATEGY FOR AFRICAN EDUCATIONAL DEPLOYMENTS:",
  "1. Qrent / InnoVent: Provides high-quality certified refurbished Tier-1 laptops and desktops across 8 African countries. Ideal for institutional computer labs.",
  "2. Rasheed Sons: Wholesale supplier specializing in bulk laptops and desktops for schools and NGOs with nationwide shipping.",
  "3. Computers2Africa / IT Schools Africa: Non-profit organizations providing refurbished devices and e-learning labs for subsidized/donated educational equipment.",
  "4. NComputing & Raspberry Pi Foundations: Extremely low-power thin-client alternatives that can run off solar power, ideal for rural or low-grid areas."
];

export function generateBoQTable(schoolConfig, rooms = []) {
  const financials = calculateProjectFinancials(schoolConfig, rooms);
  const currencyCode = financials.currencyCode;
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;

  let itemSequence = 1;
  const items = [];

  financials.rooms.forEach(room => {
    (room.equipment || []).forEach(eq => {
      items.push({
        itemNo: itemSequence++,
        roomId: room.roomId,
        roomName: room.name,
        roomCategory: room.category,
        itemName: eq.name,
        spec: eq.spec || 'Standard Specification',
        category: eq.category,
        unit: eq.unit || 'piece',
        quantity: eq.quantity || 1,
        source: eq.source || 'Wholesale Benchmark',
        unitPriceUSD: eq.unitAdjustedUSD,
        totalUSD: eq.totalAdjustedUSD,
        unitPriceLocal: eq.unitLocal,
        totalLocal: eq.totalLocal,
        currencyCode: currencyCode,
        currencySymbol: currency.symbol
      });
    });
  });

  return {
    financials,
    items,
    totalItems: items.length,
    grandTotalUSD: financials.totals.grandTotalUSD,
    grandTotalLocal: financials.totals.grandTotalLocal,
    inflationRate: financials.modifiers.inflationRate,
    inflationModifier: financials.modifiers.inflationModifier,
    currencyCode,
    currency
  };
}

/**
 * Export Bill of Quantities as formatted CSV
 */
export function generateBoQCSV(schoolConfig, rooms = []) {
  const boq = generateBoQTable(schoolConfig, rooms);
  const currencyCode = boq.currencyCode;
  const inflationSign = boq.inflationRate >= 0 ? `+${boq.inflationRate}%` : `${boq.inflationRate}%`;

  const metadataHeaders = [
    `# OpenSchool Blueprint Engine™ — Itemized Procurement BoQ`,
    `# Platform Creator: @cambridgeacademytutorsfreeknowledgeworld`,
    `# Contact Email: cambridgeacademytutorstz@gmail.com`,
    `# Terms: 100% Free & Open-Access Educational Platform (Trademark registered solely for creator attribution)`,
    `# Project: ${schoolConfig.name || 'OpenSchool Campus'} (${schoolConfig.location || 'Africa'})`,
    `# Country / Jurisdiction: ${boq.financials.modifiers.countryData.name} (${boq.financials.modifiers.countryData.regulatoryBody})`,
    `# Active Economic Inflation / Escalation Rate: ${inflationSign} (Multiplier: ${boq.financials.modifiers.inflationModifier}x)`,
    `# Export Date: ${new Date().toISOString()}`,
    ''
  ];

  const headers = [
    'Item_No',
    'Room_Name',
    'Category',
    'Item_Description',
    'Specification',
    'Unit',
    'Quantity',
    'Unit_Price_USD',
    'Total_USD',
    `Unit_Price_${currencyCode}`,
    `Total_${currencyCode}`,
    'Currency'
  ];

  const escapeCSV = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

  const rows = boq.items.map(item => [
    item.itemNo,
    escapeCSV(item.roomName),
    escapeCSV(item.roomCategory),
    escapeCSV(item.itemName),
    escapeCSV(item.spec),
    item.unit,
    item.quantity,
    item.unitPriceUSD.toFixed(2),
    item.totalUSD.toFixed(2),
    item.unitPriceLocal.toFixed(2),
    item.totalLocal.toFixed(2),
    currencyCode
  ].join(','));

  // Append summary construction & grand totals at the bottom
  rows.push('');
  rows.push(`"", "EQUIPMENT TOTAL (ADJUSTED)", "", "", "", "", "", "", "${boq.financials.totals.equipmentAdjustedUSD.toFixed(2)}", "", "${(boq.financials.totals.equipmentAdjustedUSD * (boq.currency.rateToUSD || 1)).toFixed(2)}", "${currencyCode}"`);
  rows.push(`"", "CONSTRUCTION TOTAL (${boq.financials.totals.totalBuildingAreaM2} m²)", "", "", "", "", "", "", "${boq.financials.totals.constructionUSD.toFixed(2)}", "", "${(boq.financials.totals.constructionUSD * (boq.currency.rateToUSD || 1)).toFixed(2)}", "${currencyCode}"`);
  rows.push(`"", "SITE PREPARATION (6%)", "", "", "", "", "", "", "${boq.financials.totals.sitePrepUSD.toFixed(2)}", "", "${(boq.financials.totals.sitePrepUSD * (boq.currency.rateToUSD || 1)).toFixed(2)}", "${currencyCode}"`);
  rows.push(`"", "CONTINGENCY (10%)", "", "", "", "", "", "", "${boq.financials.totals.contingencyUSD.toFixed(2)}", "", "${(boq.financials.totals.contingencyUSD * (boq.currency.rateToUSD || 1)).toFixed(2)}", "${currencyCode}"`);
  if (boq.financials.totals.inflationImpactUSD > 0) {
    rows.push(`"", "INFLATION & ESCALATION IMPACT (${inflationSign})", "", "", "", "", "", "", "${boq.financials.totals.inflationImpactUSD.toFixed(2)}", "", "${boq.financials.totals.inflationImpactLocal.toFixed(2)}", "${currencyCode}"`);
  }
  rows.push(`"", "GRAND TOTAL PROJECT COST", "", "", "", "", "", "", "${boq.financials.totals.grandTotalUSD.toFixed(2)}", "", "${boq.financials.totals.grandTotalLocal.toFixed(2)}", "${currencyCode}"`);

  // Append Special Outsource Details
  rows.push('');
  rows.push('');
  SPECIAL_OUTSOURCE_DETAILS.forEach(detail => {
    rows.push(escapeCSV(detail));
  });

  // Footer Attribution Notice
  rows.push('');
  rows.push(escapeCSV('OpenSchool Blueprint Engine™ • Created by @cambridgeacademytutorsfreeknowledgeworld • Contact: cambridgeacademytutorstz@gmail.com • 100% Free & Open Platform'));

  return [...metadataHeaders, headers.join(','), ...rows].join('\r\n');
}

/**
 * Generate Itemized Classroom Material Schedule CSV
 */
export function generateClassroomMaterialCSV(schoolConfig, targetArea = 80) {
  const schedule = calculateClassroomMaterialSchedule(schoolConfig, targetArea);
  const currencyCode = schedule.currencyCode;
  const inflationSign = schedule.inflationRate >= 0 ? `+${schedule.inflationRate}%` : `${schedule.inflationRate}%`;

  const metadataHeaders = [
    `# OpenSchool Blueprint Engine™ — Standard Classroom Material Schedule (BoQ)`,
    `# Target Room Size: ${targetArea} m² (Standard 1-Classroom Unit)`,
    `# Jurisdiction: ${schoolConfig.countryCode || 'TZ'} (National Standards Baseline)`,
    `# Active Economic Inflation / Escalation Rate: ${inflationSign} (Multiplier: ${schedule.inflationModifier}x)`,
    `# Total Unit Construction Cost: $${schedule.grandTotalUSD.toLocaleString()} USD (${schedule.currency.symbol} ${schedule.grandTotalLocal.toLocaleString()} ${currencyCode})`,
    `# Unit Rate per m²: $${schedule.costPerM2USD.toFixed(2)} USD/m² (${schedule.currency.symbol} ${schedule.costPerM2Local.toFixed(2)}/m²)`,
    `# Platform Creator: @cambridgeacademytutorsfreeknowledgeworld (cambridgeacademytutorstz@gmail.com)`,
    `# Export Date: ${new Date().toISOString()}`,
    ''
  ];

  const headers = [
    'Trade_Category',
    'Item_Code',
    'Material_Description',
    'Specification',
    'Unit',
    'Quantity',
    'Unit_Price_USD',
    'Total_USD',
    `Unit_Price_${currencyCode}`,
    `Total_${currencyCode}`,
    'Notes'
  ];

  const escapeCSV = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

  const rows = schedule.items.map(item => [
    escapeCSV(item.categoryName),
    item.itemCode,
    escapeCSV(item.description),
    escapeCSV(item.spec),
    item.unit,
    item.quantity,
    item.unitPriceUSD.toFixed(2),
    item.totalUSD.toFixed(2),
    item.unitPriceLocal.toFixed(2),
    item.totalLocal.toFixed(2),
    escapeCSV(item.notes)
  ].join(','));

  // Trade category subtotals
  rows.push('');
  rows.push('--- TRADE CATEGORY SUMMARY ---');
  schedule.categories.forEach(cat => {
    rows.push(`"", "", "${escapeCSV(cat.name)}", "", "", "", "", "${cat.totalUSD.toFixed(2)}", "", "${cat.totalLocal.toFixed(2)}", "${cat.percentage}% of total"`);
  });

  rows.push('');
  rows.push(`"", "", "1-CLASSROOM GRAND TOTAL (${targetArea} m²)", "", "", "", "", "${schedule.grandTotalUSD.toFixed(2)}", "", "${schedule.grandTotalLocal.toFixed(2)}", "100%"`);

  return [...metadataHeaders, headers.join(','), ...rows].join('\r\n');
}

/**
 * Generate full project backup JSON schema
 */
export function generateProjectJSON(schoolConfig, rooms = []) {
  const boq = generateBoQTable(schoolConfig, rooms);
  const classroomSchedule = calculateClassroomMaterialSchedule(schoolConfig, 80);

  return {
    schemaVersion: '1.1.0',
    exportTimestamp: new Date().toISOString(),
    generator: 'OpenSchool Blueprint Engine™ (100% Free & Open-Access)',
    creator: '@cambridgeacademytutorsfreeknowledgeworld',
    contactEmail: 'cambridgeacademytutorstz@gmail.com',
    trademarkNotice: 'Registered solely for creator attribution. 100% free to plan, modify, and build.',
    schoolConfig,
    rooms,
    financialSummary: boq.financials.totals,
    modifiers: boq.financials.modifiers,
    itemizedBoQ: boq.items,
    standardClassroomMaterialSchedule: classroomSchedule,
    specialOutsourceStrategy: SPECIAL_OUTSOURCE_DETAILS
  };
}
