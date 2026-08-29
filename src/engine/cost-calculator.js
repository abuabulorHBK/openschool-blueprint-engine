/**
 * Core Cost Calculation Engine
 * Implements the mathematical modeling formulas with dynamic multi-country
 * inflation adjustments and itemized classroom material build-up calculations.
 */

import { 
  CLIMATE_ZONES, 
  POWER_RELIABILITY_LEVELS, 
  PROCUREMENT_MODIFIERS, 
  AFRICAN_COUNTRIES,
  COUNTRY_MATERIAL_INDICES,
  TANZANIA_CLASSROOM_MATERIAL_BUILDUP 
} from '../data/african-infrastructure.js';
import { CURRENCIES, convertFromUSD } from '../data/currencies.js';
import { ROOM_TYPE_DEFINITIONS } from '../data/floor-area-ratios.js';

export const IMPORT_MARGIN = 0.15; // 15% wholesale buffer for shipping, customs clearance, local freight
export const CONTINGENCY_RATE = 0.10; // 10% standard bankable contingency margin
export const DEFAULT_SITE_PREP_RATE = 0.06; // 6% of total construction for clearing, grading & civil utilities

/**
 * Calculate active infrastructure & inflation modifiers based on selected country or manual overrides
 */
export function getActiveModifiers(config) {
  const countryData = AFRICAN_COUNTRIES[config?.countryCode || 'TZ'] || AFRICAN_COUNTRIES.TZ;
  
  const climateKey = config?.climateZone || countryData.defaultClimate;
  const powerKey = config?.powerReliability || countryData.defaultPower;
  const procurementKey = config?.procurementType || countryData.defaultProcurement;

  const climate = CLIMATE_ZONES[climateKey] || CLIMATE_ZONES.tropical;
  const power = POWER_RELIABILITY_LEVELS[powerKey] || POWER_RELIABILITY_LEVELS.medium;
  const procurement = PROCUREMENT_MODIFIERS[procurementKey] || PROCUREMENT_MODIFIERS.medium;

  // Inflation / Cost Escalation Rate (%): Default to 0 unless set in config
  const inflationRate = typeof config?.inflationRate === 'number' 
    ? config.inflationRate 
    : (typeof config?.inflationRate === 'string' ? parseFloat(config.inflationRate) || 0 : 0);

  const inflationModifier = parseFloat((1 + (inflationRate / 100)).toFixed(4));
  const infrastructureModifier = parseFloat((climate.modifier * power.modifier * procurement.modifier).toFixed(4));
  const combinedModifier = parseFloat((infrastructureModifier * inflationModifier).toFixed(4));

  return {
    climate,
    power,
    procurement,
    infrastructureModifier,
    inflationRate,
    inflationModifier,
    combinedModifier,
    countryData
  };
}

/**
 * Calculate the unit adjusted price for a piece of equipment in USD
 */
export function calculateEquipmentUnitPriceUSD(item, modifiers) {
  const basePrice = item.basePriceUSD || 0;
  // Step 1: Base wholesale + 15% import margin
  const importedPrice = basePrice * (1 + IMPORT_MARGIN);
  // Step 2: Apply combined infrastructure & inflation modifiers
  const finalUnitPrice = importedPrice * (modifiers.combinedModifier || 1.0);
  
  return parseFloat(finalUnitPrice.toFixed(2));
}

/**
 * Calculate full project financials, breakdown by rooms, construction, and totals
 */
export function calculateProjectFinancials(schoolConfig, rooms = []) {
  const modifiers = getActiveModifiers(schoolConfig);
  const currencyCode = schoolConfig?.currency || modifiers.countryData.currency || 'TZS';
  const currency = CURRENCIES[currencyCode] || CURRENCIES.TZS || CURRENCIES.USD;

  let totalBaseEquipmentUSD = 0;
  let totalAdjustedEquipmentUSD = 0;
  let totalBuildingAreaM2 = 0;
  let totalConstructionUSD = 0;
  let totalUnescalatedConstructionUSD = 0;

  const roomBreakdowns = rooms.map(room => {
    const roomDef = ROOM_TYPE_DEFINITIONS[room.type] || ROOM_TYPE_DEFINITIONS.classroom;
    const area = room.area_m2 || (room.width_m * room.length_m) || roomDef.defaultArea;
    const constType = roomDef.constructionType || 'classroom';
    
    // Country baseline construction cost per m2 for this room type
    const baseUnitConstructionRate = modifiers.countryData.constructionCostPerM2[constType] || 195;
    
    // Apply inflation modifier to construction rate
    const escalatedUnitConstructionRate = baseUnitConstructionRate * modifiers.inflationModifier;
    
    const unescalatedRoomConstructionCost = area * baseUnitConstructionRate;
    const roomConstructionCost = area * escalatedUnitConstructionRate;
    
    // Sum equipment in room
    let roomEquipmentBase = 0;
    let roomEquipmentAdjusted = 0;

    const equipmentWithCosts = (room.equipment || []).map(item => {
      const unitAdjusted = calculateEquipmentUnitPriceUSD(item, modifiers);
      const qty = item.quantity || 1;
      const totalItemAdjusted = unitAdjusted * qty;
      const totalItemBase = (item.basePriceUSD || 0) * (1 + IMPORT_MARGIN) * qty;

      roomEquipmentBase += totalItemBase;
      roomEquipmentAdjusted += totalItemAdjusted;

      return {
        ...item,
        unitAdjustedUSD: unitAdjusted,
        totalAdjustedUSD: parseFloat(totalItemAdjusted.toFixed(2)),
        unitLocal: parseFloat(convertFromUSD(unitAdjusted, currencyCode).toFixed(currency.decimals)),
        totalLocal: parseFloat(convertFromUSD(totalItemAdjusted, currencyCode).toFixed(currency.decimals))
      };
    });

    totalBaseEquipmentUSD += roomEquipmentBase;
    totalAdjustedEquipmentUSD += roomEquipmentAdjusted;
    totalBuildingAreaM2 += area;
    totalConstructionUSD += roomConstructionCost;
    totalUnescalatedConstructionUSD += unescalatedRoomConstructionCost;

    const roomTotalUSD = roomConstructionCost + roomEquipmentAdjusted;

    return {
      roomId: room.id,
      name: room.name,
      type: room.type,
      category: roomDef.category,
      area_m2: area,
      unitConstructionRateUSD: parseFloat(escalatedUnitConstructionRate.toFixed(2)),
      constructionCostUSD: parseFloat(roomConstructionCost.toFixed(2)),
      equipmentBaseUSD: parseFloat(roomEquipmentBase.toFixed(2)),
      equipmentAdjustedUSD: parseFloat(roomEquipmentAdjusted.toFixed(2)),
      totalRoomUSD: parseFloat(roomTotalUSD.toFixed(2)),
      totalRoomLocal: parseFloat(convertFromUSD(roomTotalUSD, currencyCode).toFixed(currency.decimals)),
      equipment: equipmentWithCosts
    };
  });

  // Site preparation cost (6%)
  const sitePrepUSD = totalConstructionUSD * DEFAULT_SITE_PREP_RATE;
  
  // Subtotal before contingency
  const subtotalUSD = totalAdjustedEquipmentUSD + totalConstructionUSD + sitePrepUSD;
  
  // Contingency 10%
  const contingencyUSD = subtotalUSD * CONTINGENCY_RATE;
  
  // Grand Total Project Cost
  const grandTotalUSD = subtotalUSD + contingencyUSD;
  const grandTotalLocal = convertFromUSD(grandTotalUSD, currencyCode);

  // Inflation impact isolation
  const unescalatedSubtotalUSD = (totalBaseEquipmentUSD * modifiers.infrastructureModifier) + totalUnescalatedConstructionUSD + (totalUnescalatedConstructionUSD * DEFAULT_SITE_PREP_RATE);
  const unescalatedGrandTotalUSD = unescalatedSubtotalUSD * (1 + CONTINGENCY_RATE);
  const inflationImpactUSD = Math.max(0, grandTotalUSD - unescalatedGrandTotalUSD);
  const inflationImpactLocal = convertFromUSD(inflationImpactUSD, currencyCode);

  const studentCount = parseInt(schoolConfig?.totalStudents, 10) || 500;
  const costPerStudentUSD = studentCount > 0 ? grandTotalUSD / studentCount : 0;
  const costPerStudentLocal = convertFromUSD(costPerStudentUSD, currencyCode);

  return {
    modifiers,
    currencyCode,
    currency,
    totals: {
      totalBuildingAreaM2: parseFloat(totalBuildingAreaM2.toFixed(1)),
      equipmentBaseUSD: parseFloat(totalBaseEquipmentUSD.toFixed(2)),
      equipmentAdjustedUSD: parseFloat(totalAdjustedEquipmentUSD.toFixed(2)),
      infrastructureImpactUSD: parseFloat(((totalBaseEquipmentUSD * (modifiers.infrastructureModifier - 1))).toFixed(2)),
      inflationRate: modifiers.inflationRate,
      inflationModifier: modifiers.inflationModifier,
      inflationImpactUSD: parseFloat(inflationImpactUSD.toFixed(2)),
      inflationImpactLocal: parseFloat(inflationImpactLocal.toFixed(currency.decimals)),
      constructionUSD: parseFloat(totalConstructionUSD.toFixed(2)),
      sitePrepUSD: parseFloat(sitePrepUSD.toFixed(2)),
      subtotalUSD: parseFloat(subtotalUSD.toFixed(2)),
      contingencyUSD: parseFloat(contingencyUSD.toFixed(2)),
      grandTotalUSD: parseFloat(grandTotalUSD.toFixed(2)),
      grandTotalLocal: parseFloat(grandTotalLocal.toFixed(currency.decimals)),
      costPerStudentUSD: parseFloat(costPerStudentUSD.toFixed(2)),
      costPerStudentLocal: parseFloat(costPerStudentLocal.toFixed(currency.decimals)),
      costPerM2USD: totalBuildingAreaM2 > 0 ? parseFloat((grandTotalUSD / totalBuildingAreaM2).toFixed(2)) : 0,
      costPerM2Local: totalBuildingAreaM2 > 0 ? parseFloat((grandTotalLocal / totalBuildingAreaM2).toFixed(currency.decimals)) : 0
    },
    rooms: roomBreakdowns
  };
}

/**
 * Calculate Itemized Classroom Material Schedule (BoQ) for 1 Classroom Unit
 * Scales standard 80m² schedule to custom classroom dimensions and applies country currency & inflation.
 */
export function calculateClassroomMaterialSchedule(schoolConfig, targetArea = 80) {
  const modifiers = getActiveModifiers(schoolConfig);
  const countryCode = schoolConfig?.countryCode || 'TZ';
  const currencyCode = schoolConfig?.currency || modifiers.countryData.currency || 'TZS';
  const currency = CURRENCIES[currencyCode] || CURRENCIES.TZS || CURRENCIES.USD;
  const areaScale = targetArea > 0 ? (targetArea / 80.0) : 1.0;

  const categories = {
    substructure: { id: 'substructure', name: '1. Substructure & Foundation', totalUSD: 0, items: [] },
    superstructure: { id: 'superstructure', name: '2. Superstructure Walling & Structural Frame', totalUSD: 0, items: [] },
    roofing: { id: 'roofing', name: '3. Roofing, Structural Trusses & Ceiling', totalUSD: 0, items: [] },
    openings: { id: 'openings', name: '4. Doors, Windows & Glazing', totalUSD: 0, items: [] },
    finishes: { id: 'finishes', name: '5. Internal/External Finishes & Painting', totalUSD: 0, items: [] },
    electrical: { id: 'electrical', name: '6. Electrical, Lighting & Mechanical Ventilation', totalUSD: 0, items: [] },
    drainage: { id: 'drainage', name: '7. External Concrete Apron & Storm Drainage', totalUSD: 0, items: [] }
  };

  let grandTotalUSD = 0;

  const itemizedList = TANZANIA_CLASSROOM_MATERIAL_BUILDUP.map(item => {
    // Scale quantity according to area
    const scaledQty = parseFloat((item.quantity * areaScale).toFixed(1));
    // Apply inflation modifier to base unit rate
    const unitPriceUSD = parseFloat((item.unitPriceUSD * modifiers.inflationModifier).toFixed(2));
    const totalUSD = parseFloat((scaledQty * unitPriceUSD).toFixed(2));
    
    const unitPriceLocal = parseFloat(convertFromUSD(unitPriceUSD, currencyCode).toFixed(currency.decimals));
    const totalLocal = parseFloat(convertFromUSD(totalUSD, currencyCode).toFixed(currency.decimals));

    const processedItem = {
      ...item,
      quantity: scaledQty,
      unitPriceUSD,
      totalUSD,
      unitPriceLocal,
      totalLocal,
      currencyCode,
      currencySymbol: currency.symbol
    };

    if (categories[item.category]) {
      categories[item.category].totalUSD += totalUSD;
      categories[item.category].items.push(processedItem);
    }

    grandTotalUSD += totalUSD;
    return processedItem;
  });

  const grandTotalLocal = convertFromUSD(grandTotalUSD, currencyCode);
  const costPerM2USD = targetArea > 0 ? (grandTotalUSD / targetArea) : 0;
  const costPerM2Local = targetArea > 0 ? (grandTotalLocal / targetArea) : 0;

  // Add percentage to categories
  const categoriesArray = Object.values(categories).map(cat => ({
    ...cat,
    totalLocal: parseFloat(convertFromUSD(cat.totalUSD, currencyCode).toFixed(currency.decimals)),
    percentage: grandTotalUSD > 0 ? Math.round((cat.totalUSD / grandTotalUSD) * 100) : 0
  }));

  return {
    targetArea,
    countryCode,
    currencyCode,
    currency,
    inflationRate: modifiers.inflationRate,
    inflationModifier: modifiers.inflationModifier,
    grandTotalUSD: parseFloat(grandTotalUSD.toFixed(2)),
    grandTotalLocal: parseFloat(grandTotalLocal.toFixed(currency.decimals)),
    costPerM2USD: parseFloat(costPerM2USD.toFixed(2)),
    costPerM2Local: parseFloat(costPerM2Local.toFixed(currency.decimals)),
    categories: categoriesArray,
    items: itemizedList
  };
}
