import React from 'react';
import { TelescopeScene } from '../canvas/TelescopeScene';
import { useTelescope } from '../../context/TelescopeContext';
import { SubassemblyId } from '../../types/telescope';
import { 
  Layers, 
  RotateCcw, 
  Sliders, 
  Eye, 
  CheckCircle2, 
  Camera, 
  Activity, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const ExplodedAssemblyPage: React.FC = () => {
  const { 
    explodedProgress, 
    setExplodedProgress, 
    resetExploded,
    activeSubassembly,
    setActiveSubassembly,
    cameraType,
    detailLevel
  } = useTelescope();

  const isolateOptions: { id: SubassemblyId; label: string; desc: string }[] = [
    { id: 'all', label: 'Complete Telescope Assembly', desc: 'Explodes all 8 major subassemblies along primary optical Z, radial Y, and orthogonal X axes.' },
    { id: 'camera', label: 'Camera Alone', desc: 'Isolates the camera assembly: adapter nosepiece, hermetic window, CMOS sensor die, Peltier cooler, heatsink, fan, and PCB.' },
    { id: 'steering', label: 'Steering Mechanism Alone', desc: 'Isolates the gimbal frame, dual pivot bearings, lens cradle, curved meniscus steering lens, and micrometer actuator.' },
    { id: 'spectroscopy', label: 'Spectroscopy Module Alone', desc: 'Isolates the bilateral entrance slit, collimator doublet, holographic 1800 l/mm grating, turret, camera lens, and detector.' },
    { id: 'objective', label: 'Objective Cell Alone', desc: 'Isolates the front solar ERF filter, crown element, 2.4 mm air gap spacer, flint element, and push-pull collimation screws.' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Left Control Column */}
      <div style={{
        width: '380px',
        height: '100%',
        background: 'rgba(10, 16, 32, 0.92)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflowY: 'auto',
        flexShrink: 0
      }}>
        <div>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Kinematic Breakout
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            Exploded Assembly Simulator
          </h2>
          <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
            Animate component separation along precise mechanical assembly vectors while maintaining kinematic relationships.
          </p>
        </div>

        {/* Master Explosion Slider Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Explosion Distance Factor
            </span>
            <span style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-teal)' }}>
              {Math.round(explodedProgress * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodedProgress}
            onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
            className="range-slider"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem' }}>
            {[
              { val: 0.0, lbl: '0% Collapsed' },
              { val: 0.35, lbl: '35% Spaced' },
              { val: 0.70, lbl: '70% Breakout' },
              { val: 1.0, lbl: '100% Full' },
            ].map(preset => (
              <button
                key={preset.val}
                onClick={() => setExplodedProgress(preset.val)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.6875rem', padding: '0.3rem 0.2rem' }}
              >
                {preset.lbl}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button
              onClick={resetExploded}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <RotateCcw size={13} /> Reset Collapse (0%)
            </button>
            <button
              onClick={() => setExplodedProgress(1.0)}
              className="btn btn-amber btn-sm"
              style={{ flex: 1 }}
            >
              Full Explode (100%)
            </button>
          </div>
        </div>

        {/* Subassembly Isolation Selector (Requirement 9: Inspect Complete, Camera alone, Steering alone, Spectroscopy alone) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Subassembly Isolation Filter
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {isolateOptions.map(opt => {
              const isSelected = activeSubassembly === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setActiveSubassembly(opt.id)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(6, 182, 212, 0.14)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-teal)' : 'var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                      {opt.label}
                    </span>
                    {isSelected && <CheckCircle2 size={15} color="var(--accent-teal)" />}
                  </div>
                  <p style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {opt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right 3D Interactive Viewport */}
      <div style={{ flex: 1, position: 'relative', height: '100%', background: '#070b14' }}>
        <TelescopeScene />

        {/* Floating Kinematic Explode Axis Vector Legend */}
        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          background: 'rgba(10, 16, 32, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          fontSize: '0.75rem',
          boxShadow: 'var(--shadow-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ fontWeight: 700, color: 'var(--accent-teal)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
            Assembly Axis Reference
          </div>
          <div style={{ color: 'var(--text-main)' }}>
            • <strong>Z-Axis (+Z/-Z):</strong> Optical train, lenses, filters, camera backfocus
          </div>
          <div style={{ color: 'var(--text-main)' }}>
            • <strong>Y-Axis (+Y/-Y):</strong> Spectroscopy module, mount saddle, tripod
          </div>
          <div style={{ color: 'var(--text-main)' }}>
            • <strong>X-Axis (+X/-X):</strong> Steering trunnions, mode switch lever
          </div>
        </div>
      </div>
    </div>
  );
};
