import React, { useState } from 'react';
import { TelescopeProvider } from './context/TelescopeContext';
import { Navbar, SimplePageId } from './components/common/Navbar';
import { ExplorerPage } from './components/pages/ExplorerPage';
import { EngineeringDrawingsPage } from './components/pages/EngineeringDrawingsPage';
import { SpectroscopyPage } from './components/pages/SpectroscopyPage';
import { TechnicalSpecsPage } from './components/pages/TechnicalSpecsPage';

export function AppContent() {
  const [activePage, setActivePage] = useState<SimplePageId>('explorer');

  return (
    <div className="app-container">
      {/* Clean Global Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />

      {/* Main Clean Page Content */}
      <main className="main-content">
        {activePage === 'explorer' && <ExplorerPage />}
        {activePage === 'drawings' && <EngineeringDrawingsPage />}
        {activePage === 'spectroscopy' && <SpectroscopyPage />}
        {activePage === 'specs' && <TechnicalSpecsPage />}
      </main>
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
