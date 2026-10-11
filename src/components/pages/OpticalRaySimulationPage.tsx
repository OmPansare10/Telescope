import React from 'react';
import { TelescopeScene } from '../canvas/TelescopeScene';
import { useTelescope } from '../../context/TelescopeContext';
import { 
  Sun, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  SplitSquareVertical, 
  Activity, 
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';

export const OpticalRaySimulationPage: React.FC = () => {
  const { 
    showRays, 
    setShowRays, 
    isRayPlaying, 
    setIsRayPlaying, 
    raySpeed, 
    setRaySpeed,
    steeringTilt, 
    setSteeringTilt, 
    resetSteeringTilt,
    flipMirrorPosition,
    toggleFlipMirror,
    parameters
  } = useTelescope();

  // Theoretical image shift on focal plane: Δy = f_eff * tan(δ)
  // For steering lens tilt θ, deflection δ ≈ (n - 1) * θ
  const nGlass = 1.517; // N-BK7
  const deflectionAngleDeg = (nGlass - 1) * steeringTilt;
  const imageShiftMm = 720 * Math.tan((deflectionAngleDeg * Math.PI) / 180);

  return (
    <div style={{ flex: 1, display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Left Optical Simulation Controls Column */}
      <div style={{
        width: '400px',
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
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Optical Physics Engine
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            Optical Ray Simulation
          </h2>
          <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
            Geometrically consistent ray trace simulation following the solar wave bundle through the objective doublet, adjustable steering lens, and switching flip-mirror.
          </p>
        </div>

        {/* Steering Lens Tilt Interactive Mechanism (Real-Time Physics) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Target size={15} color="var(--accent-amber)" /> Steering Lens Tilt (θ)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-amber)' }}>
                {steeringTilt > 0 ? `+${steeringTilt.toFixed(2)}°` : `${steeringTilt.toFixed(2)}°`}
              </span>
              <button onClick={resetSteeringTilt} title="Reset to 0°" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          <input
            type="range"
            min="-5.0"
            max="5.0"
            step="0.05"
            value={steeringTilt}
            onChange={(e) => setSteeringTilt(parseFloat(e.target.value))}
            className="range-slider"
          />

          {/* Real-time calculated focal shift metric */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.71875rem',
          }}>
            <span style={{ color: 'var(--text-dim)' }}>Sensor Image Displacement (Δy):</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-teal)' }}>
              {imageShiftMm > 0 ? `+${imageShiftMm.toFixed(2)} mm` : `${imageShiftMm.toFixed(2)} mm`}
            </span>
          </div>
        </div>

        {/* Optical Mode Selector: Imaging vs Spectroscopy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Optical Light Path Destination
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => flipMirrorPosition !== 'imaging' && toggleFlipMirror()}
              className={`btn btn-sm ${flipMirrorPosition === 'imaging' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.6rem' }}
            >
              Straight Imaging (0°)
            </button>
            <button
              onClick={() => flipMirrorPosition !== 'spectroscopy' && toggleFlipMirror()}
              className={`btn btn-sm ${flipMirrorPosition === 'spectroscopy' ? 'btn-amber' : 'btn-secondary'}`}
              style={{ padding: '0.6rem' }}
            >
              Spectroscopy (90°)
            </button>
          </div>
        </div>

        {/* Animation & Speed Controls */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Photon Flow Animation
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setIsRayPlaying(!isRayPlaying)}
              className={`btn btn-sm ${isRayPlaying ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              {isRayPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isRayPlaying ? 'Pause Photons' : 'Play Photons'}</span>
            </button>

            <button
              onClick={() => setShowRays(!showRays)}
              className={`btn btn-sm ${showRays ? 'btn-amber' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              <Sun size={14} />
              <span>{showRays ? 'Rays Visible' : 'Rays Hidden'}</span>
            </button>
          </div>

          {/* Speed Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
              <span>Photon Speed</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-teal)' }}>{raySpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={raySpeed}
              onChange={(e) => setRaySpeed(parseFloat(e.target.value))}
              className="range-slider"
            />
          </div>
        </div>

        {/* Simplified Simulation Disclaimer (Requirement 11) */}
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
            <AlertTriangle size={14} /> ILLUSTRATIVE OPTICAL SIMULATION
          </div>
          Ray traces visualize paraxial wave bundles and illustrative steering shifts. This model is for engineering visualization and does not constitute full Zemax/CodeV optical tolerance validation.
        </div>
      </div>

      {/* Right 3D Viewport with Live Rays and Sensor Plane Spot */}
      <div style={{ flex: 1, position: 'relative', height: '100%', background: '#070b14' }}>
        <TelescopeScene />

        {/* Floating Real-Time Spot Diagram Card */}
        <div style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'rgba(10, 16, 32, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          boxShadow: 'var(--shadow-subtle)',
          width: '240px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase' }}>
            Focal Plane Spot Diagram
          </div>
          {/* Mini 2D SVG Spot Monitor */}
          <svg viewBox="-50 -50 100 100" width="100%" height="90" style={{ background: '#070c18', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            {/* Sensor boundary */}
            <rect x="-42" y="-28" width="84" height="56" fill="none" stroke="#334155" strokeWidth="1" />
            {/* Sensor crosshairs */}
            <line x1="-48" y1="0" x2="48" y2="0" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.8" />
            <line x1="0" y1="-48" x2="0" y2="48" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.8" />
            {/* Deflected Solar Disc Spot */}
            <circle cx="0" cy={-imageShiftMm * 6} r="14" fill="rgba(245, 158, 11, 0.4)" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="3" cy={-imageShiftMm * 6 - 2} r="2.5" fill="#0f172a" />
            <text x="0" y="42" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Δy = {imageShiftMm.toFixed(2)} mm
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};
