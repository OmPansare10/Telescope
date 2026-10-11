import React, { useState, useMemo } from 'react';
import { TelescopeScene } from '../canvas/TelescopeScene';
import { useTelescope } from '../../context/TelescopeContext';
import { SOLAR_FRAUNHOFER_LINES, generateSpectrumCurve, SpectralLine } from '../../data/solarSpectrumData';
import { 
  Activity, 
  Layers, 
  Sliders, 
  RotateCcw, 
  Info, 
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

export const SpectroscopyPage: React.FC = () => {
  const { 
    parameters, 
    updateParameter, 
    setActiveSubassembly,
    flipMirrorPosition,
    setFlipMirrorPosition
  } = useTelescope();

  const [selectedLine, setSelectedLine] = useState<SpectralLine>(SOLAR_FRAUNHOFER_LINES[9]); // H-alpha default
  const [dopplerVelocity, setDopplerVelocity] = useState<number>(0); // km/s (-50 to +50)

  // Ensure spectroscopy module is active and flip mirror reflects to 90 degrees
  React.useEffect(() => {
    setActiveSubassembly('spectroscopy');
    setFlipMirrorPosition('spectroscopy');
  }, [setActiveSubassembly, setFlipMirrorPosition]);

  // Generate synthetic spectral absorption intensity curve around selected line
  const spectrumData = useMemo(() => {
    return generateSpectrumCurve(selectedLine.wavelengthNm, 12, 120, dopplerVelocity);
  }, [selectedLine, dopplerVelocity]);

  // Calculate grating equation: m * λ = d * (sin(α) + sin(β))
  // For 1800 lines/mm, d = 1/1800 mm = 555.55 nm
  const dNm = 1e6 / parameters.gratingGrooveDensity;
  const gratingAngleRad = (parameters.gratingAngle * Math.PI) / 180;
  // Resolving power R = m * N_grooves ~ 1 * (1800 * 25mm) = 45,000
  const theoreticalResolvingPower = parameters.gratingGrooveDensity * 25; // 25mm illuminated width

  return (
    <div style={{ flex: 1, display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Left Spectroscopy Workbench Column */}
      <div style={{
        width: '450px',
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
            Holographic Solar Spectrograph
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            Spectroscopy Module
          </h2>
          <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
            High-dispersion 90° port spectrometer with bilateral 25µm entrance slit, 1800 lines/mm holographic grating, and Fraunhofer absorption profiling.
          </p>
        </div>

        {/* Fraunhofer Solar Line Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Fraunhofer Absorption Line Target
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            {SOLAR_FRAUNHOFER_LINES.map(line => {
              const isSelected = selectedLine.id === line.id;
              return (
                <button
                  key={line.id}
                  onClick={() => setSelectedLine(line)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-teal)' : 'var(--border-subtle)',
                    background: isSelected ? 'rgba(6, 182, 212, 0.16)' : 'rgba(255, 255, 255, 0.02)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: line.colorHex }} />
                    <span style={{ fontWeight: 600 }}>{line.ion}</span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', opacity: 0.8 }}>
                    {line.wavelengthNm} nm
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Synthetic Spectrum Visualization */}
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
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Absorption Line Profile: {selectedLine.ion}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>
              {selectedLine.wavelengthAngstrom} Å
            </span>
          </div>

          {/* SVG Spectrum Curve Graph */}
          <div style={{ background: '#050913', borderRadius: '6px', padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>
            <svg viewBox="0 0 360 120" width="100%" height="120" style={{ display: 'block' }}>
              {/* Grid Lines */}
              <line x1="20" y1="20" x2="340" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
              <line x1="20" y1="60" x2="340" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
              <line x1="20" y1="100" x2="340" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

              {/* Spectrum rainbow gradient bar at bottom */}
              <defs>
                <linearGradient id="specRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="25%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="75%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <rect x="20" y="105" width="320" height="8" rx="2" fill="url(#specRainbow)" opacity="0.8" />

              {/* Intensity Curve Path */}
              {(() => {
                const minI = 0.0;
                const maxI = 1.0;
                const pts = spectrumData.map((d, idx) => {
                  const x = 20 + (idx / (spectrumData.length - 1)) * 320;
                  const y = 100 - ((d.intensity - minI) / (maxI - minI)) * 80;
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <polyline
                    fill="none"
                    stroke={selectedLine.colorHex}
                    strokeWidth="2"
                    points={pts}
                  />
                );
              })()}

              {/* Central Wavelength Marker */}
              <line x1="180" y1="10" x2="180" y2="105" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />
              <text x="180" y="14" fill="#ffffff" fontSize="8" textAnchor="middle">CENTRAL λ</text>
            </svg>
          </div>

          <p style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {selectedLine.scientificSignificance}
          </p>
        </div>

        {/* Doppler Shift Simulator (Solar Flare Ejection Dynamics) */}
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
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Doppler Plasma Velocity
            </span>
            <span style={{
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: dopplerVelocity > 0 ? '#ef4444' : dopplerVelocity < 0 ? '#06b6d4' : 'var(--text-muted)'
            }}>
              {dopplerVelocity > 0 ? `+${dopplerVelocity} km/s (Redshift)` : dopplerVelocity < 0 ? `${dopplerVelocity} km/s (Blueshift)` : '0 km/s (Rest)'}
            </span>
          </div>

          <input
            type="range"
            min="-50"
            max="50"
            step="2"
            value={dopplerVelocity}
            onChange={(e) => setDopplerVelocity(parseInt(e.target.value))}
            className="range-slider"
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
            <span>-50 km/s (Rising flare)</span>
            <button onClick={() => setDopplerVelocity(0)} style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', cursor: 'pointer' }}>
              Reset Rest Frame
            </button>
            <span>+50 km/s (Falling plasma)</span>
          </div>
        </div>

        {/* Grating Angle Rotary Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Grating Angle (θg)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-teal)' }}>
              {parameters.gratingAngle.toFixed(1)}°
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="55"
            step="0.2"
            value={parameters.gratingAngle}
            onChange={(e) => updateParameter('gratingAngle', parseFloat(e.target.value))}
            className="range-slider"
          />
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
            Theoretical Resolving Power: R ≈ <strong>{theoreticalResolvingPower.toLocaleString()}</strong> (λ/Δλ)
          </div>
        </div>
      </div>

      {/* Right 3D Viewport with Spectroscopy Assembly Isolated */}
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
          padding: '0.75rem 1rem',
          fontSize: '0.75rem',
          color: 'var(--text-main)',
          boxShadow: 'var(--shadow-subtle)',
        }}>
          Spectroscopy Mode Active: <strong style={{ color: 'var(--accent-teal)' }}>1800 lines/mm Holographic Disperser</strong>
        </div>
      </div>
    </div>
  );
};
