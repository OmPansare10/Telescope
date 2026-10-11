import React from 'react';
import { useTelescope } from '../../context/TelescopeContext';
import { DetailLevel, CameraType } from '../../types/telescope';
import { CheckCircle2, Layers, Camera, Sparkles, X, Sliders } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigurationPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const { detailLevel, setDetailLevel, cameraType, setCameraType } = useTelescope();

  if (!isOpen) return null;

  const combinations: {
    detail: DetailLevel;
    camera: CameraType;
    index: number;
    title: string;
    description: string;
  }[] = [
    {
      index: 1,
      detail: 'engineering',
      camera: 'scientific-cmos',
      title: '1. Engineering-level 3D + Scientific CMOS',
      description: 'Functional mechanical linkages, visible push-pull collimators, internal baffles, and dedicated cooled CMOS lucky-imaging sensor package.',
    },
    {
      index: 2,
      detail: 'engineering',
      camera: 'dslr',
      title: '2. Engineering-level 3D + DSLR',
      description: 'Engineering view with mechanical T-ring bayonet, shutter blades, astro-modified sensor filter, and DSLR chassis architecture.',
    },
    {
      index: 3,
      detail: 'engineering',
      camera: 'both',
      title: '3. Engineering-level 3D + Both cameras',
      description: 'Dual side-by-side engineering comparison view highlighting distinct sensor back-focus dimensions and mounting interfaces.',
    },
    {
      index: 4,
      detail: 'photorealistic',
      camera: 'scientific-cmos',
      title: '4. Photorealistic 3D + Scientific CMOS',
      description: 'PBR metallic finishes, anti-reflective purple lens coatings, sapphire window reflections, and copper Peltier heat pipes.',
    },
    {
      index: 5,
      detail: 'photorealistic',
      camera: 'dslr',
      title: '5. Photorealistic 3D + DSLR',
      description: 'High-fidelity magnesium alloy textured camera body, optical glass reflections, knurled dials, and deep solar shadow rendering.',
    },
    {
      index: 6,
      detail: 'photorealistic',
      camera: 'both',
      title: '6. Photorealistic 3D + Both cameras',
      description: 'Photorealistic dual camera setup comparing the deep-blue anodized scientific body against the ergonomic DSLR housing.',
    },
    {
      index: 7,
      detail: 'cad',
      camera: 'scientific-cmos',
      title: '7. CAD-level assembly + Scientific CMOS',
      description: 'Dimensioned CAD model with wireframe overlays, centerlines, tolerance annotations, and provisional measurement tags.',
    },
    {
      index: 8,
      detail: 'cad',
      camera: 'dslr',
      title: '8. CAD-level assembly + DSLR',
      description: 'Toleranced CAD geometry with bayonet flange clearances, sensor plane callouts, and provisional chassis measurements.',
    },
    {
      index: 9,
      detail: 'cad',
      camera: 'both',
      title: '9. CAD-level assembly + Both cameras',
      description: 'CAD assembly comparison displaying mechanical flange dimensions, weight differentials, and optical axis alignment references.',
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(5, 8, 17, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-medium)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} color="var(--accent-teal)" />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                System Configuration Matrix (All 9 Combinations)
              </h2>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Select any of the 9 independent configuration combinations. User mechanical settings are preserved.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Matrix Grid */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
          {combinations.map(combo => {
            const isActive = detailLevel === combo.detail && cameraType === combo.camera;

            return (
              <div
                key={combo.index}
                onClick={() => {
                  setDetailLevel(combo.detail);
                  setCameraType(combo.camera);
                }}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(6, 182, 212, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--accent-teal)' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'all 150ms ease',
                  boxShadow: isActive ? '0 0 15px rgba(6, 182, 212, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: isActive ? '#ffffff' : 'var(--text-main)',
                  }}>
                    {combo.title}
                  </div>
                  {isActive && <CheckCircle2 size={16} color="var(--accent-teal)" />}
                </div>

                <p style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {combo.description}
                </p>

                <div style={{ display: 'flex', gap: '0.35rem', marginTop: 'auto', paddingTop: '0.25rem' }}>
                  <span style={{
                    fontSize: '0.625rem',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                  }}>
                    {combo.detail}
                  </span>
                  <span style={{
                    fontSize: '0.625rem',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                  }}>
                    {combo.camera}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
