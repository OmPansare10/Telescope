import React from 'react';
import { useTelescope } from '../../context/TelescopeContext';
import { 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Box, 
  Sparkles, 
  Compass, 
  Sliders,
  ExternalLink,
  Cpu
} from 'lucide-react';

export const ComponentInspector: React.FC = () => {
  const { 
    selectedComponent, 
    setSelectedComponentId, 
    detailLevel, 
    cameraType,
    derivedSpecs,
    explodedProgress,
    setExplodedProgress
  } = useTelescope();

  if (!selectedComponent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--text-muted)' }}>
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)', fontWeight: 600, fontSize: '0.8125rem' }}>
            <Info size={16} /> INSPECTOR READY
          </div>
          <p style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
            Click on any component in the 3D viewport or hierarchy tree to view optical specifications, CAD tolerances, materials, and mechanical interfaces.
          </p>
        </div>

        {/* Global Optical Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Benchmark
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Clear Aperture</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>90.0 mm</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Focal Length</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>720 mm (f/{derivedSpecs.focalRatio})</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Target Line</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>656.28 nm (H-α)</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Dawes Limit</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>{derivedSpecs.dawesLimitArcsec}" arcsec</div>
            </div>
          </div>
        </div>

        {/* Active Configuration Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Current Configuration Mode
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: 600 }}>
            {detailLevel === 'engineering' && '⚙️ Engineering-level 3D'}
            {detailLevel === 'photorealistic' && '✨ Photorealistic 3D (PBR)'}
            {detailLevel === 'cad' && '📐 CAD-level Assembly (Toleranced)'}
            {' + '}
            {cameraType === 'scientific-cmos' && 'Scientific CMOS Camera'}
            {cameraType === 'dslr' && 'DSLR Camera System'}
            {cameraType === 'both' && 'Dual Comparison Assembly'}
          </div>
          <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
            One of 9 active combinations seamlessly switchable in the toolbar below.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Component Title & Subassembly Badge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {selectedComponent.category}
          </span>
          <button
            onClick={() => setSelectedComponentId(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
          {selectedComponent.name}
        </h3>
      </div>

      {/* Provisional vs Verified Engineering Status Badge */}
      <div>
        {selectedComponent.isProvisional ? (
          <div className="badge badge-provisional" style={{ width: '100%', justifyContent: 'center', padding: '0.4rem' }}>
            <AlertTriangle size={13} /> PROVISIONAL CAD DIMENSION (UNVERIFIED)
          </div>
        ) : (
          <div className="badge badge-verified" style={{ width: '100%', justifyContent: 'center', padding: '0.4rem' }}>
            <CheckCircle2 size={13} /> VERIFIED SPECIFICATION / FLIGHT GRADE
          </div>
        )}
      </div>

      {/* Detailed Specifications Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Physical Dimensions</div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {selectedComponent.dimensionsMm}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Material & Construction</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>
            {selectedComponent.material}
          </div>
        </div>

        {selectedComponent.weightGrams !== undefined && (
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Estimated Mass</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {selectedComponent.weightGrams} grams
            </div>
          </div>
        )}

        {selectedComponent.opticalRole && (
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Optical Function</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--accent-amber)' }}>
              {selectedComponent.opticalRole}
            </div>
          </div>
        )}

        {selectedComponent.mechanicalInterface && (
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Mechanical Interface</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {selectedComponent.mechanicalInterface}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Functional Description
        </div>
        <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {selectedComponent.description}
        </p>
      </div>

      {/* Kinematics Explode Vector */}
      <div style={{ padding: '0.6rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-medium)' }}>
        <div style={{ fontSize: '0.6875rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
          Explode Axis Vector
        </div>
        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)', marginTop: '2px' }}>
          [{selectedComponent.explodeDirection.join(', ')}] @ {selectedComponent.explodeDistance} mm
        </div>
      </div>
    </div>
  );
};
