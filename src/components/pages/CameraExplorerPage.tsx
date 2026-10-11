import React from 'react';
import { TelescopeScene } from '../canvas/TelescopeScene';
import { useTelescope } from '../../context/TelescopeContext';
import { CameraType } from '../../types/telescope';
import { 
  Cpu, 
  Layers, 
  Thermometer, 
  Clock, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const CameraExplorerPage: React.FC = () => {
  const { 
    cameraType, 
    setCameraType, 
    setActiveSubassembly,
    detailLevel
  } = useTelescope();

  // Ensure camera subassembly is highlighted
  React.useEffect(() => {
    setActiveSubassembly('camera');
  }, [setActiveSubassembly]);

  return (
    <div style={{ flex: 1, display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Left Comparison Column */}
      <div style={{
        width: '420px',
        height: '100%',
        background: 'rgba(10, 16, 32, 0.94)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflowY: 'auto',
        flexShrink: 0
      }}>
        <div>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Detector Subsystems
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            Camera Explorer & Comparison
          </h2>
          <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
            Compare cooled scientific CMOS astronomy cameras against full-frame DSLR architectures. Note: Reflex mirrors are omitted from scientific CMOS and mirrorless cameras as per optical engineering requirements.
          </p>
        </div>

        {/* Camera Selector (Option A, Option B, Option C) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Camera Architecture Selection
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
            <button
              onClick={() => setCameraType('scientific-cmos')}
              className={`btn btn-sm ${cameraType === 'scientific-cmos' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Option A: CMOS
            </button>
            <button
              onClick={() => setCameraType('dslr')}
              className={`btn btn-sm ${cameraType === 'dslr' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Option B: DSLR
            </button>
            <button
              onClick={() => setCameraType('both')}
              className={`btn btn-sm ${cameraType === 'both' ? 'btn-amber' : 'btn-secondary'}`}
            >
              Option C: Both
            </button>
          </div>
        </div>

        {/* Detailed Side-by-Side Specification Table */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Architecture Comparison Matrix
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.5rem', fontSize: '0.71875rem' }}>
            <div style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Metric</div>
            <div style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>Scientific CMOS</div>
            <div style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>DSLR / Mirrorless</div>

            {/* Backfocus */}
            <div style={{ color: 'var(--text-muted)' }}>Flange Backfocus</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>17.5 mm</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>55.0 mm</div>

            {/* Sensor Format */}
            <div style={{ color: 'var(--text-muted)' }}>Sensor Format</div>
            <div>APS-C (23.5×15.6mm)</div>
            <div>Full-Frame (36×24mm)</div>

            {/* Pixel Pitch */}
            <div style={{ color: 'var(--text-muted)' }}>Pixel Size</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>3.76 µm</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>4.30 µm</div>

            {/* Max Framerate */}
            <div style={{ color: 'var(--text-muted)' }}>Max Lucky FPS</div>
            <div style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>120 fps (ROI)</div>
            <div style={{ color: 'var(--text-muted)' }}>10–14 fps</div>

            {/* Cooling */}
            <div style={{ color: 'var(--text-muted)' }}>Sensor Cooling</div>
            <div style={{ color: '#10b981', fontWeight: 600 }}>ΔT = -35°C (Peltier)</div>
            <div>Ambient / Passive</div>

            {/* Dark Current */}
            <div style={{ color: 'var(--text-muted)' }}>Dark Current</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>0.001 e-/px/s</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>0.15 e-/px/s</div>

            {/* Solar Optical Role */}
            <div style={{ color: 'var(--text-muted)' }}>Primary Role</div>
            <div>Solar granulation lucky imaging</div>
            <div>Full-disc solar prominence HDR</div>
          </div>
        </div>

        {/* Generic Architecture Disclaimer (Requirement 6) */}
        <div style={{
          padding: '0.75rem',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.71875rem',
          color: 'var(--accent-amber)',
          lineHeight: 1.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, marginBottom: '2px' }}>
            <AlertTriangle size={14} /> GENERIC ARCHITECTURE IDENTIFICATION
          </div>
          Internal components reflect an industry-standard generic cooled CMOS and magnesium DSLR layout. Specific proprietary internal layouts will update upon exact commercial camera model integration.
        </div>
      </div>

      {/* Right 3D Interactive Viewport */}
      <div style={{ flex: 1, position: 'relative', height: '100%', background: '#070b14' }}>
        <TelescopeScene />

        {/* Floating Indicator */}
        <div style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'rgba(10, 16, 32, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1rem',
          fontSize: '0.75rem',
          color: 'var(--text-main)',
          boxShadow: 'var(--shadow-subtle)',
        }}>
          Currently Inspecting: <strong style={{ color: 'var(--accent-teal)' }}>
            {cameraType === 'scientific-cmos' ? 'Scientific Cooled CMOS' : cameraType === 'dslr' ? 'Full-Frame DSLR' : 'Both Cameras (Comparison Mode)'}
          </strong>
        </div>
      </div>
    </div>
  );
};
