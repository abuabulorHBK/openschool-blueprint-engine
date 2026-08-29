import React from 'react';
import { 
  Settings2, 
  LayoutGrid, 
  PackageCheck, 
  GraduationCap, 
  LandPlot, 
  DraftingCompass, 
  FileSpreadsheet
} from 'lucide-react';

export const STEPS = [
  { id: 'config', label: '1. School Config', icon: Settings2 },
  { id: 'rooms', label: '2. Room Planner', icon: LayoutGrid },
  { id: 'equipment', label: '3. Equipment Catalog', icon: PackageCheck },
  { id: 'teachers', label: '4. Teacher Planner', icon: GraduationCap },
  { id: 'site', label: '5. Site & Land', icon: LandPlot },
  { id: 'floorplan', label: '6. 2D Blueprint', icon: DraftingCompass },
  { id: 'export', label: '7. Export Hub', icon: FileSpreadsheet }
];

export function StepNavigation({ activeStep, onSelectStep }) {
  return (
    <div className="stepper-container" style={{ margin: '16px auto 0 auto', maxWidth: '1600px', width: 'calc(100% - 48px)' }}>
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = activeStep === step.id;

        return (
          <button
            key={step.id}
            onClick={() => onSelectStep(step.id)}
            className={`step-item ${isActive ? 'active' : ''}`}
          >
            <span className="step-number">{idx + 1}</span>
            <Icon size={16} />
            <span>{step.label.replace(/^\d+\.\s*/, '')}</span>
          </button>
        );
      })}
    </div>
  );
}
