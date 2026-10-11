import React from 'react';
import { useTelescope } from '../../context/TelescopeContext';
import { 
  Sliders, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  ShieldCheck, 
  Info,
  Layers
} from 'lucide-react';

export const TechnicalSpecsPage: React.FC = () => {
  const { 
    parameters, 
    updateParameter, 
    derivedSpecs, 
    resetParametersToDefault 
  } = useTelescope();

  const handleExportJson = () => {
    const data = {
      telescopeParameters: parameters,
      derivedOpticalSpecifications: derivedSpecs,
      exportTimestamp: new Date().toISOString(),
      opticalStandard: 'ISO-10110 Solar Chromosphere Architecture',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOLARIS-90-specs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', maxWidth: '1300px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-verified" style={{ marginBottom: '0.4rem' }}>
            <ShieldCheck size={12} /> PARAMETRIC OPTICAL CALCULATOR
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Technical Specifications & Tolerances
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '750px' }}>
            Configure optical parameters in real time. Formulas compute diffraction-limited resolutions, Airy disc dimensions, Nyquist sampling ratios, and dispersion. Unverified measurements are clearly identified with provisional tags.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button onClick={resetParametersToDefault} className="btn btn-secondary btn-sm">
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button onClick={handleExportJson} className="btn btn-primary btn-sm">
            <Download size={14} />
            <span>Export Specs (JSON)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Configurable Sliders vs Right Calculated Physics Benchmarks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Left Column: Configurable Sliders */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Sliders size={18} color="var(--accent-teal)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Configurable Parameters
            </h2>
          </div>

          {/* 1. Objective Aperture (80 - 100 mm) */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Objective Clear Aperture (D)</span>
              <span className="slider-value">{parameters.aperture} mm</span>
            </div>
            <input
              type="range"
              min="80"
              max="100"
              step="1"
              value={parameters.aperture}
              onChange={(e) => updateParameter('aperture', parseInt(e.target.value))}
              className="range-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
              <span>80 mm</span>
              <span className="badge badge-verified" style={{ padding: '1px 5px', fontSize: '0.625rem' }}>VERIFIED</span>
              <span>100 mm</span>
            </div>
          </div>

          {/* 2. Objective Focal Length (600 - 800 mm) */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Focal Length (f)</span>
              <span className="slider-value">{parameters.focalLength} mm</span>
            </div>
            <input
              type="range"
              min="600"
              max="800"
              step="10"
              value={parameters.focalLength}
              onChange={(e) => updateParameter('focalLength', parseInt(e.target.value))}
              className="range-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
              <span>600 mm</span>
              <span className="badge badge-verified" style={{ padding: '1px 5px', fontSize: '0.625rem' }}>VERIFIED</span>
              <span>800 mm</span>
            </div>
          </div>

          {/* 3. Objective Air Gap Spacing (Provisional) */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Objective Doublet Air Gap</span>
              <span className="slider-value" style={{ color: 'var(--accent-amber)' }}>{parameters.objectiveAirGap.toFixed(1)} mm</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={parameters.objectiveAirGap}
              onChange={(e) => updateParameter('objectiveAirGap', parseFloat(e.target.value))}
              className="range-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
              <span>1.0 mm</span>
              <span className="badge badge-provisional" style={{ padding: '1px 5px', fontSize: '0.625rem' }}>PROVISIONAL</span>
              <span>5.0 mm</span>
            </div>
          </div>

          {/* 4. Optical Tube Length */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Optical Tube Shell Length</span>
              <span className="slider-value">{parameters.tubeLength} mm</span>
            </div>
            <input
              type="range"
              min="500"
              max="700"
              step="10"
              value={parameters.tubeLength}
              onChange={(e) => updateParameter('tubeLength', parseInt(e.target.value))}
              className="range-slider"
            />
          </div>

          {/* 5. Steering Lens Tilt Angle (-5.0 to +5.0 deg) */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Steering Lens Tilt Angle</span>
              <span className="slider-value" style={{ color: 'var(--accent-amber)' }}>
                {parameters.steeringLensTilt > 0 ? `+${parameters.steeringLensTilt.toFixed(1)}°` : `${parameters.steeringLensTilt.toFixed(1)}°`}
              </span>
            </div>
            <input
              type="range"
              min="-5.0"
              max="5.0"
              step="0.1"
              value={parameters.steeringLensTilt}
              onChange={(e) => updateParameter('steeringLensTilt', parseFloat(e.target.value))}
              className="range-slider"
            />
          </div>

          {/* 6. Camera Sensor Pixel Size (Microns) */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Sensor Pixel Pitch</span>
              <span className="slider-value">{parameters.pixelSize.toFixed(2)} µm</span>
            </div>
            <input
              type="range"
              min="2.4"
              max="6.0"
              step="0.05"
              value={parameters.pixelSize}
              onChange={(e) => updateParameter('pixelSize', parseFloat(e.target.value))}
              className="range-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
              <span>2.4 µm (BSI High-Res)</span>
              <span>6.0 µm (Large Full-Frame)</span>
            </div>
          </div>

          {/* 7. Spectroscopy Grating Line Density */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Diffraction Grating Density</span>
              <span className="slider-value">{parameters.gratingGrooveDensity} lines/mm</span>
            </div>
            <input
              type="range"
              min="1200"
              max="2400"
              step="100"
              value={parameters.gratingGrooveDensity}
              onChange={(e) => updateParameter('gratingGrooveDensity', parseInt(e.target.value))}
              className="range-slider"
            />
          </div>
        </div>

        {/* Right Column: Calculated Physics Benchmarks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <Calculator size={18} color="var(--accent-amber)" />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Derived Optical Specifications
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {/* Focal Ratio */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Focal Ratio (f/D)</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>
                  f/{derivedSpecs.focalRatio}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Optimal speed for solar lucky imaging
                </div>
              </div>

              {/* Dawes Limit */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Dawes Resolution Limit</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  {derivedSpecs.dawesLimitArcsec}"
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  θ = 116 / D (arcseconds)
                </div>
              </div>

              {/* Rayleigh Criterion */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Rayleigh Criterion (@ 656.3nm)</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                  {derivedSpecs.rayleighCriterionArcsec}"
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  1.22 · λ / D
                </div>
              </div>

              {/* Airy Disk Diameter */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Airy Disk Diameter</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  {derivedSpecs.airyDiskDiameterMicrons} µm
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  2.44 · λ · (f/D)
                </div>
              </div>

              {/* Solar Disk Size on Sensor */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Solar Disc Diameter on Sensor</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                  {derivedSpecs.solarDiskDiameterMm} mm
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  D⊙ ≈ f · tan(32 arcmin)
                </div>
              </div>

              {/* Pixel Scale */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Image Pixel Scale</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  {derivedSpecs.pixelScaleArcsecPerPixel}" / px
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Scale = 206.265 · p / f
                </div>
              </div>
            </div>

            {/* Nyquist Sampling Status Card */}
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}>
              <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                  Nyquist Sampling Diagnostic
                </div>
                <div style={{ fontSize: '0.78125rem', color: 'var(--text-main)', marginTop: '2px' }}>
                  {derivedSpecs.nyquistCriterion}
                </div>
              </div>
            </div>
          </div>

          {/* Engineering Disclaimer on Provisional CAD values */}
          <div style={{
            padding: '1rem',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: 'var(--accent-amber)',
            lineHeight: 1.5,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <AlertTriangle size={15} /> PROVISIONAL CAD VALUES NOTICE
            </div>
            Unspecified commercial camera body internal traces and lens air-gap spacers are designated as provisional (<code>[PROV]</code>). Values reflect standard ISO-10110 optical design conventions.
          </div>
        </div>
      </div>
    </div>
  );
};
