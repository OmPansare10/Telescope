import React, { useState } from 'react';
import { TelescopeProvider } from './context/TelescopeContext';
import { Navbar, PageId } from './components/common/Navbar';
import { OverviewPage } from './components/pages/OverviewPage';
import { ExplorerPage } from './components/pages/ExplorerPage';
import { InternalStructurePage } from './components/pages/InternalStructurePage';
import { ExplodedAssemblyPage } from './components/pages/ExplodedAssemblyPage';
import { CameraExplorerPage } from './components/pages/CameraExplorerPage';
import { EngineeringDrawingsPage } from './components/pages/EngineeringDrawingsPage';
import { OpticalRaySimulationPage } from './components/pages/OpticalRaySimulationPage';
import { SpectroscopyPage } from './components/pages/SpectroscopyPage';
import { TechnicalSpecsPage } from './components/pages/TechnicalSpecsPage';
import { ConfigurationPanel } from './components/explorer/ConfigurationPanel';

export function AppContent() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  return (
    <div className="app-container">
      {/* Global Navigation Bar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenConfig={() => setIsConfigOpen(true)} 
      />

      {/* Main Page Content */}
      <main className="main-content">
        {activePage === 'overview' && (
          <OverviewPage 
            setActivePage={setActivePage} 
            onOpenConfig={() => setIsConfigOpen(true)} 
          />
        )}
        {activePage === 'explorer' && <ExplorerPage />}
        {activePage === 'internal' && <InternalStructurePage />}
        {activePage === 'exploded' && <ExplodedAssemblyPage />}
        {activePage === 'camera' && <CameraExplorerPage />}
        {activePage === 'drawings' && <EngineeringDrawingsPage />}
        {activePage === 'rays' && <OpticalRaySimulationPage />}
        {activePage === 'spectroscopy' && <SpectroscopyPage />}
        {activePage === 'specs' && <TechnicalSpecsPage />}
      </main>

      {/* 9-Combination Configuration Matrix Modal */}
      <ConfigurationPanel 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <TelescopeProvider>
      <AppContent />
    </TelescopeProvider>
  );
}
