import React from 'react';
import { 
  Telescope, 
  Layers, 
  Cpu, 
  FileText, 
  Sun, 
  Activity, 
  Sliders, 
  HelpCircle,
  Eye,
  CheckCircle,
  SplitSquareVertical,
  Compass
} from 'lucide-react';

export type PageId = 
  | 'overview'
  | 'explorer'
  | 'internal'
  | 'exploded'
  | 'camera'
  | 'drawings'
  | 'rays'
  | 'spectroscopy'
  | 'specs';

interface NavbarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  onOpenConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, onOpenConfig }) => {
  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Compass size={15} /> },
    { id: 'explorer', label: '3D Telescope Explorer', icon: <Telescope size={15} /> },
    { id: 'internal', label: 'Internal Structure', icon: <Eye size={15} /> },
    { id: 'exploded', label: 'Exploded Assembly', icon: <Layers size={15} /> },
    { id: 'camera', label: 'Camera Explorer', icon: <Cpu size={15} /> },
    { id: 'drawings', label: '2D Engineering Drawings', icon: <FileText size={15} /> },
    { id: 'rays', label: 'Optical Ray Simulation', icon: <Sun size={15} /> },
    { id: 'spectroscopy', label: 'Spectroscopy Module', icon: <Activity size={15} /> },
    { id: 'specs', label: 'Technical Specifications', icon: <Sliders size={15} /> },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setActivePage('overview')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <Sun size={20} />
        </div>
        <div>
          <div className="brand-title">
            SOLARIS-90 <span className="brand-badge">H-α Refractor</span>
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
            90mm F/8.0 CHROMOSPHERE SIMULATOR
          </div>
        </div>
      </div>

      <div className="nav-links">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`nav-tab-btn ${activePage === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="nav-actions">
        <button
          onClick={onOpenConfig}
          className="btn btn-secondary btn-sm"
          title="Open Master 9-Configuration Matrix"
        >
          <Sliders size={14} />
          <span>Config (9 Combinations)</span>
        </button>
      </div>
    </nav>
  );
};
