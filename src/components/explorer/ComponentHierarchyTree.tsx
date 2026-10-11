import React from 'react';
import { useTelescope } from '../../context/TelescopeContext';
import { TELESCOPE_COMPONENTS } from '../../data/componentsData';
import { SubassemblyId } from '../../types/telescope';
import { 
  Eye, 
  EyeOff, 
  Search, 
  Layers, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ComponentHierarchyTree: React.FC = () => {
  const {
    activeSubassembly,
    setActiveSubassembly,
    selectedComponentId,
    setSelectedComponentId,
    setHoveredComponentId,
    searchQuery,
    setSearchQuery,
    toggleComponentVisibility,
    isComponentVisible,
    resetAllVisibility
  } = useTelescope();

  const subassemblies: { id: SubassemblyId; label: string; count: number }[] = [
    { id: 'all', label: 'Complete System', count: TELESCOPE_COMPONENTS.length },
    { id: 'objective', label: 'Objective Cell', count: TELESCOPE_COMPONENTS.filter(c => c.subassembly === 'objective').length },
    { id: 'optical-tube', label: 'Tube & Baffles', count: TELESCOPE_COMPONENTS.filter(c => c.subassembly === 'optical-tube').length },
    { id: 'steering', label: 'Steering Lens', count: TELESCOPE_COMPONENTS.filter(c => c.subassembly === 'steering').length },
    { id: 'flip-mirror', label: 'Flip-Mirror', count: TELESCOPE_COMPONENTS.filter(c => c.subassembly === 'flip-mirror').length },
    { id: 'camera', label: 'Camera Systems', count: TELESCOPE_COMPONENTS.filter(c => c.subassembly === 'camera').length },
    { id: 'spectroscopy', label: 'Spectroscopy', count: TELESCOPE_COMPONENTS.filter(c => c.subassembly === 'spectroscopy').length },
    { id: 'mount', label: 'Mount & Tripod', count: TELESCOPE_COMPONENTS.filter(c => c.subassembly === 'mount').length },
  ];

  const filteredComponents = TELESCOPE_COMPONENTS.filter(c => {
    const matchesSub = activeSubassembly === 'all' || c.subassembly === activeSubassembly;
    const matchesSearch = searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem' }}>
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-dim)' }} />
        <input
          type="text"
          placeholder="Search components, materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.45rem 0.6rem 0.45rem 2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            fontSize: '0.8125rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Subassembly Quick Filter Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Subassembly Filter
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
          {subassemblies.map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSubassembly(sub.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.35rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: activeSubassembly === sub.id ? 'var(--border-bright)' : 'transparent',
                background: activeSubassembly === sub.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: activeSubassembly === sub.id ? 'var(--accent-teal)' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.label}</span>
              <span style={{ fontSize: '0.6875rem', opacity: 0.7 }}>{sub.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hierarchy List Header with Reset Visibility */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Components ({filteredComponents.length})
        </div>
        <button
          onClick={resetAllVisibility}
          title="Reset all component visibilities"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.6875rem',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* Component Tree Items */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {filteredComponents.map(comp => {
          const isSelected = selectedComponentId === comp.id;
          const isVisible = isComponentVisible(comp.id);

          return (
            <div
              key={comp.id}
              onMouseEnter={() => setHoveredComponentId(comp.id)}
              onMouseLeave={() => setHoveredComponentId(null)}
              onClick={() => setSelectedComponentId(isSelected ? null : comp.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.04)',
                background: isSelected 
                  ? 'rgba(6, 182, 212, 0.18)' 
                  : isVisible ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)',
                opacity: isVisible ? 1 : 0.45,
                cursor: 'pointer',
                transition: 'all 120ms ease',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', marginRight: '0.5rem' }}>
                <span style={{ 
                  fontSize: '0.78125rem', 
                  fontWeight: isSelected ? 600 : 400, 
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {comp.name}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {comp.category}
                  {comp.isProvisional && (
                    <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>• PROV</span>
                  )}
                </span>
              </div>

              {/* Visibility Toggle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComponentVisibility(comp.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isVisible ? 'var(--text-muted)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
