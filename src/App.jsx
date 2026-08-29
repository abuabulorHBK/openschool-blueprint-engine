import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StepNavigation } from './components/StepNavigation';
import { ProjectModal } from './components/ProjectModal';
import { NewsletterFooter } from './components/NewsletterFooter';
import { NewsletterModal } from './components/NewsletterModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { SchoolConfig } from './views/SchoolConfig';
import { RoomPlanner } from './views/RoomPlanner';
import { EquipmentCatalog } from './views/EquipmentCatalog';
import { TeacherPlanner } from './views/TeacherPlanner';
import { SiteCalculator } from './views/SiteCalculator';
import { FloorPlanVisualizer } from './views/FloorPlanVisualizer';
import { ExportHub } from './views/ExportHub';
import { CostDashboard } from './views/CostDashboard';

import { loadActiveProject, saveProject, createDefaultModelSchool } from './services/persistence.js';
import './App.css';

export function App() {
  const [theme, setTheme] = useState('light');
  const [activeStep, setActiveStep] = useState('config');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);

  const [projectData, setProjectData] = useState(() => createDefaultModelSchool('TZ'));

  // Load project on mount
  useEffect(() => {
    async function init() {
      const active = await loadActiveProject();
      if (active) {
        setProjectData(active);
      }
      setIsLoaded(true);
    }
    init();
  }, []);

  // Update theme data attribute on body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auto-save project changes
  useEffect(() => {
    if (!isLoaded) return;
    const timeout = setTimeout(() => {
      saveProject(projectData);
    }, 400);
    return () => clearTimeout(timeout);
  }, [projectData, isLoaded]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleUpdateConfig = (newConfig) => {
    setProjectData(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const handleUpdateRooms = (newRooms) => {
    setProjectData(prev => ({
      ...prev,
      rooms: newRooms
    }));
  };

  const handleSelectProject = (project) => {
    setProjectData(project);
  };

  const handleNavigateToEquipment = (roomId) => {
    setSelectedRoomFilter(roomId);
    setActiveStep('equipment');
  };

  const handleNextStep = (nextStepId) => {
    setActiveStep(nextStepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Top Navbar */}
        <Navbar
          schoolConfig={projectData}
          onUpdateConfig={handleUpdateConfig}
          onOpenProjectModal={() => setIsProjectModalOpen(true)}
          onOpenNewsletterModal={() => setIsNewsletterModalOpen(true)}
          onNavigateToExport={() => setActiveStep('export')}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Stepper Navigation */}
        <StepNavigation
          activeStep={activeStep}
          onSelectStep={(step) => {
            setActiveStep(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Main Content Layout with Sticky Sidebar */}
        <main className="main-content-layout">
          {/* Main Views Viewport */}
          <section className="view-viewport">
            {activeStep === 'config' && (
              <SchoolConfig
                schoolConfig={projectData}
                onUpdateConfig={handleUpdateConfig}
                onNextStep={() => handleNextStep('rooms')}
              />
            )}

            {activeStep === 'rooms' && (
              <RoomPlanner
                rooms={projectData.rooms || []}
                onUpdateRooms={handleUpdateRooms}
                targetEnrollment={projectData.totalStudents || 500}
                onNavigateToEquipment={handleNavigateToEquipment}
                onNextStep={() => handleNextStep('equipment')}
              />
            )}

            {activeStep === 'equipment' && (
              <EquipmentCatalog
                rooms={projectData.rooms || []}
                onUpdateRooms={handleUpdateRooms}
                schoolConfig={projectData}
                selectedRoomIdFilter={selectedRoomFilter}
                onNextStep={() => handleNextStep('teachers')}
              />
            )}

            {activeStep === 'teachers' && (
              <TeacherPlanner
                schoolConfig={projectData}
                rooms={projectData.rooms || []}
                onUpdateConfig={handleUpdateConfig}
                onNextStep={() => handleNextStep('site')}
              />
            )}

            {activeStep === 'site' && (
              <SiteCalculator
                rooms={projectData.rooms || []}
                schoolConfig={projectData}
                onUpdateConfig={handleUpdateConfig}
                onNextStep={() => handleNextStep('floorplan')}
              />
            )}

            {activeStep === 'floorplan' && (
              <FloorPlanVisualizer
                rooms={projectData.rooms || []}
                schoolConfig={projectData}
                onNextStep={() => handleNextStep('export')}
              />
            )}

            {activeStep === 'export' && (
              <ExportHub
                schoolConfig={projectData}
                rooms={projectData.rooms || []}
                onUpdateConfig={handleUpdateConfig}
                onUpdateRooms={handleUpdateRooms}
              />
            )}
          </section>

          {/* Sticky Real-Time Cost Dashboard */}
          <CostDashboard
            schoolConfig={projectData}
            rooms={projectData.rooms || []}
          />
        </main>

        {/* Global Newsletter & Free/Open Status Footer */}
        <NewsletterFooter
          onOpenNewsletterModal={() => setIsNewsletterModalOpen(true)}
        />

        {/* Project & Template Management Modal */}
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onSelectProject={handleSelectProject}
          currentProjectId={projectData.id}
        />

        {/* Company & Industry Newsletter Modal */}
        <NewsletterModal
          isOpen={isNewsletterModalOpen}
          onClose={() => setIsNewsletterModalOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
