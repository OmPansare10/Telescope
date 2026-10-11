import React from 'react';
import { 
  Telescope, 
  FileText, 
  Sun, 
  Activity, 
  SlidersHorizontal,
} from 'lucide-react';

export type SimplePageId = 'explorer' | 'drawings' | 'spectroscopy' | 'specs';
export type PageId = SimplePageId | 'overview' | 'internal' | 'exploded' | 'camera' | 'rays';

interface NavbarProps {
  activePage: SimplePageId;
  setActivePage: (page: SimplePageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const navItems: { id: SimplePageId; label: string; icon: React.ReactNode }[] = [
    { id: 'explorer', label: '3D Telescope Explorer', icon: <Telescope size={16} /> },
    { id: 'drawings', label: '2D Blueprints', icon: <FileText size={16} /> },
    { id: 'spectroscopy', label: 'Spectroscopy', icon: <Activity size={16} /> },
    { id: 'specs', label: 'Specifications', icon: <SlidersHorizontal size={16} /> },
  ];

  return (
    <nav className="navbar" style={{ padding: '0 1.5rem', height: '58px' }}>
      {/* Brand */}
      <div 
        className="nav-brand" 
        onClick={() => setActivePage('explorer')} 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
      >
        <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
          <Sun size={18} />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            SOLARIS-90
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '2px 6px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-teal)', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              Solar Refractor
            </span>
          </div>
        </div>
      </div>

      {/* Clean Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activePage === item.id ? 'rgba(6, 182, 212, 0.4)' : 'transparent',
              background: activePage === item.id ? 'rgba(6, 182, 212, 0.14)' : 'transparent',
              color: activePage === item.id ? 'var(--accent-teal)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
