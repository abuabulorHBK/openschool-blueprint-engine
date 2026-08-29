import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Copy, 
  RotateCcw, 
  Sparkles, 
  GraduationCap,
  Building2, 
  Sliders
} from 'lucide-react';
import { 
  SCHOOL_STAFFING_PROFILES, 
  getDefaultStaffingPlan, 
  computeStaffingRequirements 
} from '../data/cambridge-curriculum.js';

export function TeacherPlanner({ schoolConfig, rooms = [], onUpdateConfig, onNextStep }) {
  const targetEnrollment = schoolConfig.totalStudents || 500;
  const currentSchoolType = schoolConfig.staffingPlan?.schoolType || schoolConfig.curriculumLevel || 'igcse';

  // Ensure staffing plan exists or initialize it
  const [staffingPlan, setStaffingPlan] = useState(() => {
    if (schoolConfig.staffingPlan && schoolConfig.staffingPlan.subjects) {
      return schoolConfig.staffingPlan;
    }
    return getDefaultStaffingPlan(currentSchoolType, targetEnrollment, rooms);
  });

  // Keep local state synced if schoolConfig.staffingPlan changes externally
  useEffect(() => {
    if (schoolConfig.staffingPlan && schoolConfig.staffingPlan.subjects) {
      setStaffingPlan(schoolConfig.staffingPlan);
    }
  }, [schoolConfig.staffingPlan]);

  // Compute live requirements
  const evaluated = computeStaffingRequirements(staffingPlan, targetEnrollment, rooms);

  // Helper to persist updates
  const savePlanUpdates = (updatedPlan) => {
    const nextPlan = {
      ...updatedPlan,
      updatedAt: new Date().toISOString()
    };
    setStaffingPlan(nextPlan);
    if (onUpdateConfig) {
      onUpdateConfig({
        ...schoolConfig,
        staffingPlan: nextPlan
      });
    }
  };

  // Switch School Profile Preset
  const handleSelectProfile = (profileKey) => {
    const newPlan = getDefaultStaffingPlan(profileKey, targetEnrollment, rooms);
    savePlanUpdates(newPlan);
  };

  // Adjust school enrollment size dynamically
  const handleEnrollmentChange = (newEnrollment) => {
    const val = Math.max(50, Math.min(2500, parseInt(newEnrollment, 10) || 500));
    if (onUpdateConfig) {
      onUpdateConfig({
        ...schoolConfig,
        totalStudents: val
      });
    }
  };

  // Subject level updates
  const handleUpdateSubject = (subjectId, updates) => {
    const updatedSubjects = staffingPlan.subjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, ...updates };
      }
      return s;
    });

    savePlanUpdates({
      ...staffingPlan,
      subjects: updatedSubjects
    });
  };

  // Custom Teacher Count Stepper / Direct Input
  const handleTeacherCountChange = (subjectId, newCount) => {
    const count = Math.max(0, parseInt(newCount, 10) || 0);
    handleUpdateSubject(subjectId, {
      customTeachersNeeded: count,
      isCustomTeachers: true
    });
  };

  // Reset a single subject to auto-calculated ratio
  const handleRevertSubjectToAuto = (subjectId) => {
    handleUpdateSubject(subjectId, {
      customTeachersNeeded: null,
      isCustomTeachers: false
    });
  };

  // Reset all subjects to auto-calculated ratios
  const handleResetAllToAuto = () => {
    const updatedSubjects = staffingPlan.subjects.map(s => ({
      ...s,
      customTeachersNeeded: null,
      isCustomTeachers: false,
      customStudentCount: null
    }));
    savePlanUpdates({
      ...staffingPlan,
      subjects: updatedSubjects
    });
  };

  // Add new subject
  const handleAddSubject = () => {
    const newSubject = {
      id: `subj-custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: 'New Cambridge Subject / Elective',
      category: 'stem',
      participationRatePct: 50,
      recommendedTeacherRatio: 25,
      practicalsMandatory: false,
      practicalPaper: 'Paper 1 Written / Coursework',
      customTeachersNeeded: null,
      isCustomTeachers: false
    };

    savePlanUpdates({
      ...staffingPlan,
      subjects: [...staffingPlan.subjects, newSubject]
    });
  };

  // Duplicate subject
  const handleDuplicateSubject = (subj) => {
    const dup = {
      ...subj,
      id: `subj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${subj.name} (Copy)`
    };
    savePlanUpdates({
      ...staffingPlan,
      subjects: [...staffingPlan.subjects, dup]
    });
  };

  // Delete subject
  const handleDeleteSubject = (subjectId) => {
    if (staffingPlan.subjects.length <= 1) return;
    savePlanUpdates({
      ...staffingPlan,
      subjects: staffingPlan.subjects.filter(s => s.id !== subjectId)
    });
  };

  // Support staff updates
  const handleUpdateSupportRole = (roleId, updates) => {
    const updatedSupport = staffingPlan.supportStaff.map(st => {
      if (st.id === roleId) {
        return { ...st, ...updates, isCustom: true };
      }
      return st;
    });

    savePlanUpdates({
      ...staffingPlan,
      supportStaff: updatedSupport
    });
  };

  // Add custom support specialist
  const handleAddSupportRole = () => {
    const newRole = {
      id: `sup-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: 'New Support Specialist',
      formulaType: 'fixed',
      count: 1,
      description: 'Custom specialist duties and responsibilities',
      isCustom: true
    };

    savePlanUpdates({
      ...staffingPlan,
      supportStaff: [...staffingPlan.supportStaff, newRole]
    });
  };

  // Delete support specialist
  const handleDeleteSupportRole = (roleId) => {
    savePlanUpdates({
      ...staffingPlan,
      supportStaff: staffingPlan.supportStaff.filter(st => st.id !== roleId)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Main KPIs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)'
              }}>
                <GraduationCap size={20} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>4. Teacher & Faculty Staffing Planner</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Dynamic Cambridge staffing model. <strong>Adjust school size or modify individual ratios & headcounts</strong> without restriction.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Academic Teachers
              </div>
              <div className="number-mono" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-primary)' }}>
                {evaluated.totalTeachingStaff} <span style={{ fontSize: '12px', fontWeight: '600' }}>Faculty</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                Ratio 1 : {evaluated.overallRatio} stds
              </div>
            </div>

            <div style={{ textAlign: 'right', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Support Specialists
              </div>
              <div className="number-mono" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-secondary)' }}>
                {evaluated.totalSupportStaff} <span style={{ fontSize: '12px', fontWeight: '600' }}>Staff</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                Labs, IT & Admin
              </div>
            </div>

            <div style={{ textAlign: 'right', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Combined Staff
              </div>
              <div className="number-mono" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-green)' }}>
                {evaluated.totalFacultyAndStaff} <span style={{ fontSize: '12px', fontWeight: '600' }}>Headcount</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                For {targetEnrollment} Students
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic School Enrollment Adjustment Bar */}
        <div style={{
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} color="var(--accent-primary)" />
              <strong style={{ fontSize: '13px' }}>Adjust School Size (Dynamic Enrollment Driver):</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong className="number-mono" style={{ fontSize: '16px', color: 'var(--accent-primary)' }}>
                {targetEnrollment} Students
              </strong>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[150, 300, 500, 800, 1200].map(sz => (
                  <button
                    key={sz}
                    onClick={() => handleEnrollmentChange(sz)}
                    className={`btn btn-sm ${targetEnrollment === sz ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <input
            type="range"
            min="100"
            max="1500"
            step="25"
            value={targetEnrollment}
            onChange={(e) => handleEnrollmentChange(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>
            <span>100 (Boutique)</span>
            <span>300 (STEM Academy)</span>
            <span>500 (Standard Model)</span>
            <span>800 (Comprehensive)</span>
            <span>1500 (Mega Campus)</span>
          </div>
        </div>

        {/* School Type / Model Profile Selector */}
        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              School Type Staffing Answers & Profiles:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleResetAllToAuto}
                title="Reset all teacher numbers to standard ratio formulas"
                style={{ fontSize: '11.5px' }}
              >
                <Sparkles size={13} color="var(--accent-green)" />
                <span>Auto-Calculate Ratios</span>
              </button>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => handleSelectProfile(staffingPlan.schoolType || 'igcse')}
                title="Reset entire profile to factory defaults"
                style={{ fontSize: '11.5px' }}
              >
                <RotateCcw size={13} />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.values(SCHOOL_STAFFING_PROFILES).map(prof => {
              const isSelected = (staffingPlan.schoolType || 'igcse') === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => handleSelectProfile(prof.id)}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <Building2 size={13} />
                  <span>{prof.name}</span>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {SCHOOL_STAFFING_PROFILES[staffingPlan.schoolType || 'igcse']?.description}
          </div>
        </div>

        {/* Staff Room Desk Audit Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: evaluated.isDeskSufficient ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: '1px solid',
          borderColor: evaluated.isDeskSufficient ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          marginTop: '16px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {evaluated.isDeskSufficient ? (
              <CheckCircle size={20} color="var(--accent-green)" />
            ) : (
              <AlertTriangle size={20} color="var(--accent-amber)" />
            )}
            <div>
              <span style={{ fontSize: '13.5px', fontWeight: '700', display: 'block' }}>
                Staff Room Spatial Audit: {evaluated.staffDeskCapacity} Desks Planned in Blueprints
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Target: {evaluated.requiredDesks} workstations for {evaluated.totalTeachingStaff} academic teachers ({Math.round(staffingPlan.deskAllocationRatio * 100)}% allocation ratio)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Desk Ratio:</span>
              <select
                className="form-select"
                value={staffingPlan.deskAllocationRatio || 1.0}
                onChange={(e) => savePlanUpdates({ ...staffingPlan, deskAllocationRatio: parseFloat(e.target.value) })}
                style={{ padding: '3px 8px', fontSize: '11.5px', width: 'auto' }}
              >
                <option value="1.0">1.0 (Dedicated Desk)</option>
                <option value="0.8">0.8 (Hot-Desking)</option>
                <option value="1.2">1.2 (Spacious / Prep)</option>
              </select>
            </div>

            <span className={`badge ${evaluated.isDeskSufficient ? 'badge-success' : 'badge-warning'}`} style={{ padding: '6px 12px', fontSize: '12px' }}>
              {evaluated.isDeskSufficient ? `Sufficient (+${evaluated.deskSurplus} Surplus)` : `Deficit: ${evaluated.deskDeficit} Desks Needed`}
            </span>
          </div>
        </div>
      </div>

      {/* Editable Subject-by-Subject Cambridge Ratio Modeling Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="form-label" style={{ margin: 0 }}>Editable Cambridge Subject Breakdown & Ratio Modeling</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Adjust cohort enrollment %, standard ratio (1:X), or override faculty numbers directly. All changes auto-calculate and persist.
            </p>
          </div>
          
          <button 
            className="btn btn-primary btn-sm"
            onClick={handleAddSubject}
            style={{ fontSize: '12px' }}
          >
            <Plus size={14} />
            <span>Add Cambridge Subject</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', fontWeight: '600', minWidth: '220px' }}>Cambridge Subject & Category</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', minWidth: '180px' }}>Student Cohort (% & Count)</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', minWidth: '140px' }}>Teacher Ratio</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', minWidth: '200px' }}>Practical Exam / Requirements</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', minWidth: '180px', textAlign: 'right' }}>Faculty Needed</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', width: '80px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluated.subjects.map((subj) => {
                const isOverridden = subj.isOverridden;

                return (
                  <tr key={subj.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}>
                    
                    {/* Subject Name & Category */}
                    <td style={{ padding: '14px 16px' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={subj.name}
                        onChange={(e) => handleUpdateSubject(subj.id, { name: e.target.value })}
                        style={{ fontWeight: '700', fontSize: '13.5px', padding: '4px 8px', marginBottom: '4px' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <select
                          className="form-select"
                          value={subj.category || 'core'}
                          onChange={(e) => handleUpdateSubject(subj.id, { category: e.target.value })}
                          style={{ fontSize: '11px', padding: '2px 6px', width: 'auto' }}
                        >
                          <option value="core">CORE</option>
                          <option value="stem">STEM SCIENCE</option>
                          <option value="technology">TECHNOLOGY / ICT</option>
                          <option value="humanities">HUMANITIES</option>
                          <option value="creative">CREATIVE ARTS</option>
                        </select>
                        <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                          {subj.practicalsMandatory ? '🔬 Lab Pracs' : '📝 Written Exam'}
                        </span>
                      </div>
                    </td>

                    {/* Student Cohort */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Cohort:</span>
                        <strong className="number-mono" style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                          {subj.subjectStudents} Students
                        </strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={subj.participationRatePct || 100}
                          onChange={(e) => handleUpdateSubject(subj.id, { participationRatePct: parseInt(e.target.value, 10), customStudentCount: null })}
                          style={{ flex: 1, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                        />
                        <span className="number-mono" style={{ fontSize: '11.5px', color: 'var(--text-muted)', width: '36px', textAlign: 'right' }}>
                          {subj.participationRatePct}%
                        </span>
                      </div>
                    </td>

                    {/* Standard Teacher Ratio */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>1 :</span>
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={subj.recommendedTeacherRatio || 25}
                          onChange={(e) => handleUpdateSubject(subj.id, { recommendedTeacherRatio: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                          className="form-input number-mono"
                          style={{ width: '60px', padding: '4px 6px', fontSize: '13px', textAlign: 'center' }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>stds</span>
                      </div>
                    </td>

                    {/* Practical Exam Notes */}
                    <td style={{ padding: '14px 16px' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={subj.practicalPaper || ''}
                        onChange={(e) => handleUpdateSubject(subj.id, { practicalPaper: e.target.value })}
                        placeholder="Exam / practical specification"
                        style={{ fontSize: '12px', padding: '4px 8px', marginBottom: '4px' }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={!!subj.practicalsMandatory}
                          onChange={(e) => handleUpdateSubject(subj.id, { practicalsMandatory: e.target.checked })}
                          style={{ accentColor: 'var(--accent-secondary)' }}
                        />
                        <span>Mandatory Lab Exam Paper</span>
                      </label>
                    </td>

                    {/* Faculty Needed with Stepper & Status Badge */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginBottom: '4px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 6px', fontSize: '12px' }}
                          onClick={() => handleTeacherCountChange(subj.id, Math.max(0, subj.teachersNeeded - 1))}
                          title="Decrease teacher count"
                        >
                          -
                        </button>
                        
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={subj.teachersNeeded}
                          onChange={(e) => handleTeacherCountChange(subj.id, e.target.value)}
                          className="form-input number-mono"
                          style={{ width: '54px', padding: '4px 6px', fontSize: '14px', fontWeight: '800', textAlign: 'center', color: isOverridden ? 'var(--accent-amber)' : 'var(--accent-primary)' }}
                        />

                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 6px', fontSize: '12px' }}
                          onClick={() => handleTeacherCountChange(subj.id, subj.teachersNeeded + 1)}
                          title="Increase teacher count"
                        >
                          +
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        {isOverridden ? (
                          <>
                            <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
                              Custom ({subj.autoTeachers} auto)
                            </span>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleRevertSubjectToAuto(subj.id)}
                              title="Revert to auto-calculated ratio based on school size"
                              style={{ padding: '2px 6px', fontSize: '10px', border: 'none' }}
                            >
                              <RotateCcw size={10} /> Auto
                            </button>
                          </>
                        ) : (
                          <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 6px' }}>
                            Auto (1:{subj.recommendedTeacherRatio})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 6px' }}
                          onClick={() => handleDuplicateSubject(subj)}
                          title="Duplicate Subject"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 6px', color: 'var(--accent-red)' }}
                          onClick={() => handleDeleteSubject(subj.id)}
                          title="Delete Subject"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editable Support & Technical Specialists Section */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="form-label" style={{ margin: 0 }}>Support & Technical Specialists</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Laboratories, ICT network infrastructure, student affairs, and administrative personnel.
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handleAddSupportRole}
            style={{ fontSize: '12px' }}
          >
            <Plus size={13} color="var(--accent-green)" />
            <span>Add Support Specialist Role</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {evaluated.supportStaff.map((st) => (
            <div 
              key={st.id}
              style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={st.title}
                    onChange={(e) => handleUpdateSupportRole(st.id, { title: e.target.value })}
                    style={{ fontWeight: '700', fontSize: '13px', padding: '3px 6px', flex: 1, marginRight: '8px' }}
                  />
                  <button
                    onClick={() => handleDeleteSupportRole(st.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '4px' }}
                    title="Delete Specialist Role"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <textarea
                  className="form-textarea"
                  rows={2}
                  value={st.description || ''}
                  onChange={(e) => handleUpdateSupportRole(st.id, { description: e.target.value })}
                  style={{ fontSize: '11.5px', padding: '6px 8px', resize: 'vertical' }}
                  placeholder="Specialist responsibilities & coverage"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Required Staff:</span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 6px', fontSize: '11px' }}
                    onClick={() => handleUpdateSupportRole(st.id, { count: Math.max(0, (st.count || 1) - 1) })}
                  >
                    -
                  </button>
                  
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={st.count || 0}
                    onChange={(e) => handleUpdateSupportRole(st.id, { count: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                    className="form-input number-mono"
                    style={{ width: '48px', padding: '3px 4px', fontSize: '13.5px', fontWeight: '700', textAlign: 'center', color: 'var(--accent-secondary)' }}
                  />

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 6px', fontSize: '11px' }}
                    onClick={() => handleUpdateSupportRole(st.id, { count: (st.count || 0) + 1 })}
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Staffing Plan Custom Notes */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 className="form-label" style={{ marginBottom: '8px' }}>Staffing Justification & Accreditation Notes</h3>
        <textarea
          className="form-textarea"
          rows={3}
          value={staffingPlan.notes || ''}
          onChange={(e) => savePlanUpdates({ ...staffingPlan, notes: e.target.value })}
          placeholder="Enter custom staffing notes, ministry teacher certification benchmarks, or regional compliance commentary to include in tender dossier..."
          style={{ fontSize: '12.5px', padding: '10px 12px' }}
        />
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button className="btn btn-primary" onClick={onNextStep}>
          <span>Proceed to Site Calculator</span>
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
