import React from 'react';
import { useTelescope } from '../../context/TelescopeContext';
import { CameraPreset } from '../../types/telescope';
import { Compass, RotateCcw, Crosshair } from 'lucide-react';

export const PresetControls: React.FC = () => {
  const { currentPreset, setCurrentPreset, setSelectedComponentId, resetExploded, resetSteeringTilt } = useTelescope();

  const presets: { id: CameraPreset; label: string }[] = [
    { id: 'isometric', label: 'ISO' },
    { id: 'front', label: 'Front' },
    { id: 'side', label: 'Side' },
    { id: 'top', label: 'Top' },
    { id: 'rear', label: 'Rear' },
  ];

  const handleResetAll = () => {
    setCurrentPreset('isometric');
    setSelectedComponentId(null);
    resetExploded();
    resetSteeringTilt();
  };

  return (
    <div className="preset-floating-bar">
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', color: 'var(--text-dim)' }}>
        <Compass size={14} />
      </div>
      {presets.map(p => (
        <button
          key={p.id}
          onClick={() => setCurrentPreset(p.id)}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.6875rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: currentPreset === p.id ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
            color: currentPreset === p.id ? 'var(--accent-teal)' : 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          {p.label}
        </button>
      ))}
      <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)', margin: '0 2px' }} />
      <button
        onClick={handleResetAll}
        title="Reset all camera, tilt, and exploded views"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: '0.25rem 0.5rem',
          fontSize: '0.6875rem',
          fontWeight: 500,
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          background: 'transparent',
          color: 'var(--text-muted)',
          cursor: 'pointer',
        }}
      >
        <RotateCcw size={11} /> Reset
      </button>
    </div>
  );
};
