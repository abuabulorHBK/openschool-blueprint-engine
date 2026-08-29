/**
 * Persistence & Project Storage Service
 * Uses IndexedDB with transparent LocalStorage fallback.
 * Includes pre-engineered Cambridge Model Templates.
 */

import { getDefaultEquipmentForRoomType } from '../data/equipment-catalog.js';
import { getDefaultStaffingPlan } from '../data/cambridge-curriculum.js';
import { AFRICAN_COUNTRIES } from '../data/african-infrastructure.js';

const DB_NAME = 'OpenSchoolBlueprintDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';
const ACTIVE_PROJECT_KEY = 'openschool_active_project_id';
const LOCAL_STORAGE_BACKUP_KEY = 'openschool_project_backup';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null); // Fallback gracefully
  });
}

/**
 * Creates default 500-Student Model School Project
 */
export function createDefaultModelSchool(countryCode = 'TZ') {
  const country = AFRICAN_COUNTRIES[countryCode] || AFRICAN_COUNTRIES.TZ;
  const rooms = [
    // 8 Standard Classrooms (40 students each = 320 seat baseline)
    { id: 'rm-cls-01', name: 'Classroom 1 (Grade 9A)', type: 'classroom', width_m: 10, length_m: 8, area_m2: 80, capacity: 40 },
    { id: 'rm-cls-02', name: 'Classroom 2 (Grade 9B)', type: 'classroom', width_m: 10, length_m: 8, area_m2: 80, capacity: 40 },
    { id: 'rm-cls-03', name: 'Classroom 3 (Grade 10A)', type: 'classroom', width_m: 10, length_m: 8, area_m2: 80, capacity: 40 },
    { id: 'rm-cls-04', name: 'Classroom 4 (Grade 10B)', type: 'classroom', width_m: 10, length_m: 8, area_m2: 80, capacity: 40 },
    { id: 'rm-cls-05', name: 'Classroom 5 (Grade 11A - AS)', type: 'classroom', width_m: 10, length_m: 8, area_m2: 80, capacity: 40 },
    { id: 'rm-cls-06', name: 'Classroom 6 (Grade 11B - AS)', type: 'classroom', width_m: 10, length_m: 8, area_m2: 80, capacity: 40 },
    { id: 'rm-cls-07', name: 'Classroom 7 (Grade 12A - A2)', type: 'classroom', width_m: 10, length_m: 8, area_m2: 80, capacity: 40 },
    { id: 'rm-cls-08', name: 'Classroom 8 (Grade 12B - A2)', type: 'classroom', width_m: 10, length_m: 8, area_m2: 80, capacity: 40 },

    // STEM Science Labs (Physics, Chemistry, Biology)
    { id: 'rm-phy-01', name: 'Physics Laboratory (Faraday Suite)', type: 'physics_lab', width_m: 12.5, length_m: 8, area_m2: 100, capacity: 30 },
    { id: 'rm-chem-01', name: 'Chemistry Laboratory (Mendeleev Suite)', type: 'chemistry_lab', width_m: 12.5, length_m: 8, area_m2: 100, capacity: 30 },
    { id: 'rm-bio-01', name: 'Biology Laboratory (Darwin Suite)', type: 'biology_lab', width_m: 11.25, length_m: 8, area_m2: 90, capacity: 30 },

    // ICT & Computing
    { id: 'rm-ict-01', name: 'ICT & Computing Centre (Turing Suite)', type: 'ict_lab', width_m: 10, length_m: 8, area_m2: 80, capacity: 30 },

    // Humanities & Creative
    { id: 'rm-geo-01', name: 'Geography & Map Studio (Humboldt Suite)', type: 'geography_room', width_m: 8.75, length_m: 8, area_m2: 70, capacity: 35 },
    { id: 'rm-art-01', name: 'Art & Design Studio (Da Vinci Hub)', type: 'art_studio', width_m: 10, length_m: 8, area_m2: 80, capacity: 25 },

    // Faculty & Administration
    { id: 'rm-stf-01', name: 'Faculty Staff Room & Lounge', type: 'staff_room', width_m: 10, length_m: 7, area_m2: 70, capacity: 20 },
    { id: 'rm-adm-01', name: 'Administration & Principal Suite', type: 'admin_office', width_m: 8, length_m: 6, area_m2: 48, capacity: 6 },

    // Sports Hall
    { id: 'rm-spt-01', name: 'Multi-Purpose Sports & Assembly Hall', type: 'sports_hall', width_m: 20, length_m: 20, area_m2: 400, capacity: 250 }
  ];

  // Populate pre-configured equipment for each room
  const roomsWithEquipment = rooms.map(room => ({
    ...room,
    equipment: getDefaultEquipmentForRoomType(room.type, room.capacity)
  }));

  const defaultLevel = countryCode === 'TZ' ? 'necta_csee' : 'igcse';

  return {
    id: `project-${Date.now()}`,
    name: countryCode === 'TZ' ? 'Dar es Salaam Secondary Academy' : 'Kilifi Cambridge Secondary Academy',
    location: countryCode === 'TZ' ? 'Kinondoni District, Dar es Salaam' : 'Coast Region',
    countryCode: countryCode,
    currency: country.currency || 'TZS',
    inflationRate: country.defaultInflationRate || 3.2,
    curriculumLevel: defaultLevel,
    totalStudents: 500,
    targetCohorts: countryCode === 'TZ' ? 'Form 1 through Form 4 (NECTA CSEE)' : 'Grade 9 through Grade 12 (IGCSE & A-Level)',
    notes: countryCode === 'TZ' ? 'Center of excellence for NECTA science and technical secondary education in Tanzania.' : 'Regional center of excellence for Cambridge STEM and Creative Arts.',
    staffingPlan: getDefaultStaffingPlan(defaultLevel, 500, roomsWithEquipment),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rooms: roomsWithEquipment
  };
}

export async function saveProject(project) {
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString()
  };

  try {
    const db = await openDB();
    if (db) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(updatedProject);
        tx.oncomplete = resolve;
        tx.onerror = reject;
      });
    }
  } catch (err) {
    console.warn('IndexedDB write failed, writing to LocalStorage', err);
  }

  // Backup to localStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(updatedProject));
    localStorage.setItem(ACTIVE_PROJECT_KEY, updatedProject.id);
  } catch (e) {
    console.warn('LocalStorage write error', e);
  }

  return updatedProject;
}

export async function loadActiveProject() {
  try {
    const activeId = localStorage.getItem(ACTIVE_PROJECT_KEY);
    const db = await openDB();
    
    if (db && activeId) {
      const project = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(activeId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });
      if (project) return project;
    }

    // Try LocalStorage backup
    const backup = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    if (backup) {
      return JSON.parse(backup);
    }
  } catch (err) {
    console.warn('Error loading project from DB/LocalStorage', err);
  }

  // Default fallback project
  const defaultProject = createDefaultModelSchool('KE');
  await saveProject(defaultProject);
  return defaultProject;
}

export async function listAllProjects() {
  try {
    const db = await openDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }
  } catch (e) {
    console.warn('List projects failed', e);
  }
  return [];
}
