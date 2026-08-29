import React, { useState, useEffect } from 'react';
import { 
  X, 
  FolderOpen, 
  Upload, 
  Check, 
  Sparkles,
  Building2
} from 'lucide-react';
import { createDefaultModelSchool, listAllProjects, saveProject } from '../services/persistence.js';
import { getDefaultEquipmentForRoomType } from '../data/equipment-catalog.js';
import { getDefaultStaffingPlan } from '../data/cambridge-curriculum.js';

export function ProjectModal({ isOpen, onClose, onSelectProject, currentProjectId }) {
  const [projectsList, setProjectsList] = useState([]);
  const [importError, setImportError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadList();
    }
  }, [isOpen]);

  const loadList = async () => {
    const list = await listAllProjects();
    setProjectsList(list);
  };

  if (!isOpen) return null;

  const handleLoadTemplate = async (type) => {
    let newProject;
    if (type === 'necta') {
      newProject = createDefaultModelSchool('TZ');
      newProject.id = `project-necta-${Date.now()}`;
      newProject.name = 'Dodoma National Secondary Academy';
      newProject.location = 'Dodoma Urban, Tanzania';
      newProject.countryCode = 'TZ';
      newProject.currency = 'TZS';
      newProject.curriculumLevel = 'necta_csee';
      newProject.staffingPlan = getDefaultStaffingPlan('necta_csee', 500, newProject.rooms);
    } else if (type === 'stem') {
      newProject = createDefaultModelSchool('KE');
      newProject.id = `project-stem-${Date.now()}`;
      newProject.name = 'Mombasa STEM & Innovation Academy';
      newProject.totalStudents = 300;
      newProject.curriculumLevel = 'stem';
      // Filter & enhance with 2 extra science & computing labs
      newProject.rooms = [
        ...newProject.rooms.filter(r => ['physics_lab', 'chemistry_lab', 'biology_lab', 'ict_lab', 'staff_room', 'admin_office'].includes(r.type)),
        {
          id: `rm-ict-extra-${Date.now()}`,
          name: 'Advanced Robotics & AI Lab',
          type: 'ict_lab',
          width_m: 10,
          length_m: 8,
          area_m2: 80,
          capacity: 30,
          equipment: getDefaultEquipmentForRoomType('ict_lab', 30)
        }
      ];
      newProject.staffingPlan = getDefaultStaffingPlan('stem', 300, newProject.rooms);
    } else if (type === 'comprehensive') {
      newProject = createDefaultModelSchool('NG');
      newProject.id = `project-comp-${Date.now()}`;
      newProject.name = 'Abuja Comprehensive Secondary College';
      newProject.countryCode = 'NG';
      newProject.currency = 'NGN';
      newProject.totalStudents = 800;
      newProject.curriculumLevel = 'combined';
      newProject.staffingPlan = getDefaultStaffingPlan('combined', 800, newProject.rooms);
    } else {
      newProject = createDefaultModelSchool('TZ');
      newProject.curriculumLevel = 'igcse';
      newProject.staffingPlan = getDefaultStaffingPlan('igcse', 500, newProject.rooms);
    }

    await saveProject(newProject);
    onSelectProject(newProject);
    onClose();
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.schoolConfig || !parsed.rooms) {
          throw new Error('Invalid project JSON file format.');
        }
        const importedProject = {
          ...parsed.schoolConfig,
          id: `imported-${Date.now()}`,
          rooms: parsed.rooms,
          updatedAt: new Date().toISOString()
        };
        await saveProject(importedProject);
        onSelectProject(importedProject);
        onClose();
      } catch (err) {
        setImportError(err.message || 'Failed to read project JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderOpen size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Project & Template Manager</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {importError && (
          <div className="badge badge-danger" style={{ display: 'block', padding: '8px 12px', marginBottom: '16px' }}>
            {importError}
          </div>
        )}

        {/* Pre-Engineered Model Blueprints */}
        <div style={{ marginBottom: '24px' }}>
          <h3 className="form-label" style={{ marginBottom: '12px' }}>Pre-Engineered Master Blueprints</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div 
              className="glass-panel" 
              style={{ padding: '14px', cursor: 'pointer', borderColor: 'var(--accent-primary)', background: 'rgba(59, 130, 246, 0.08)' }}
              onClick={() => handleLoadTemplate('necta')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Building2 size={16} color="var(--accent-primary)" />
                <strong style={{ fontSize: '13.5px' }}>🇹🇿 NECTA Tanzania 500</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Form 1–4 CSEE, 3 Science Labs, Computer Room, Matron suite & TZS rates.
              </p>
            </div>

            <div 
              className="glass-panel" 
              style={{ padding: '14px', cursor: 'pointer', borderColor: 'var(--border-color)' }}
              onClick={() => handleLoadTemplate('standard')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Building2 size={16} color="var(--accent-secondary)" />
                <strong style={{ fontSize: '13.5px' }}>Cambridge 500-Model</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                8 Classrooms, 3 Science Labs, ICT Suite, Art, Geography & Sports.
              </p>
            </div>

            <div 
              className="glass-panel" 
              style={{ padding: '14px', cursor: 'pointer', borderColor: 'var(--border-color)' }}
              onClick={() => handleLoadTemplate('stem')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={16} color="var(--accent-secondary)" />
                <strong style={{ fontSize: '13.5px' }}>STEM Innovation 300</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                High-density Physics, Chem, Bio labs, Robotics & double ICT suites.
              </p>
            </div>

            <div 
              className="glass-panel" 
              style={{ padding: '14px', cursor: 'pointer', borderColor: 'var(--border-color)' }}
              onClick={() => handleLoadTemplate('comprehensive')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Building2 size={16} color="var(--accent-green)" />
                <strong style={{ fontSize: '13.5px' }}>Mega Campus 800</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Dual-stream comprehensive secondary with full facilities.
              </p>
            </div>
          </div>
        </div>

        {/* Upload JSON file */}
        <div style={{ marginBottom: '24px' }}>
          <h3 className="form-label" style={{ marginBottom: '10px' }}>Import Existing Project File (.json)</h3>
          <label 
            className="btn btn-secondary" 
            style={{ width: '100%', borderStyle: 'dashed', padding: '14px', cursor: 'pointer' }}
          >
            <Upload size={16} />
            <span>Select JSON Project Backup</span>
            <input type="file" accept=".json" onChange={handleFileImport} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Saved Projects List */}
        {projectsList.length > 0 && (
          <div>
            <h3 className="form-label" style={{ marginBottom: '10px' }}>Saved Local Projects ({projectsList.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {projectsList.map(proj => (
                <div 
                  key={proj.id}
                  onClick={() => { onSelectProject(proj); onClose(); }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: proj.id === currentProjectId ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: proj.id === currentProjectId ? 'var(--border-glow)' : 'var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600' }}>{proj.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {proj.countryCode} • {proj.rooms?.length || 0} Rooms • Updated {new Date(proj.updatedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  {proj.id === currentProjectId && <Check size={16} color="var(--accent-primary)" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
