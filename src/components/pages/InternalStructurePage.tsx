import React, { useState } from 'react';
import { TelescopeScene } from '../canvas/TelescopeScene';
import { useTelescope } from '../../context/TelescopeContext';
import { 
  Eye, 
  Layers, 
  ShieldAlert, 
  Sliders, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const InternalStructurePage: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    setSelectedComponentId,
    setActiveSubassembly,
    steeringTilt,
    setSteeringTilt
  } = useTelescope();

  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      title: 'Stage 1: Apochromatic Objective Doublet & ERF',
      componentId: 'objective-lens-1',
      subassembly: 'objective',
      description: 'The front optical cell houses the dielectric solar ERF filter, Ohara FCD100 extra-low dispersion crown element, a calibrated 2.4 mm precision air-gap ring, and dense Lanthanum flint element. Three radial collimation push-pull screw pairs provide sub-micron angular optical axis squaring.',
      specs: 'Aperture: Ø90 mm | Air Gap: 2.4 mm [PROV] | R1=+480mm, R2=-480mm | BBAR Coated',
    },
    {
      title: 'Stage 2: 3-Stage Knife-Edge Stray Light Baffles',
      componentId: 'baffle-ring-1',
      subassembly: 'optical-tube',
      description: 'Positioned at calibrated distances (150 mm, 320 mm, and 470 mm behind the objective) inside the flocked aerospace tube. Each baffle features a razor-sharp 45° brass knife edge angled forward to completely intercept off-axis grazing sunlight and eliminate thermal tube glare.',
      specs: 'Baffle 1: Ø76 mm | Baffle 2: Ø62 mm | Baffle 3: Ø48 mm | Material: Blackened Brass 0.8mm',
    },
    {
      title: 'Stage 3: Adjustable Optical Steering Lens Gimbal',
      componentId: 'steering-lens',
      subassembly: 'steering',
      description: 'A precision curved meniscus lens held in a low-stress Delrin cradle on dual ABEC-7 miniature ball bearing trunnions. Driven by a differential micrometer actuator with anti-backlash spring preload and absolute rotary encoder, allowing fine solar disc steering across ±5.0° without tube movement.',
      specs: 'Clear Aperture: Ø45 mm | Tilt Range: ±5.0° | Resolution: 0.05°/turn | Backlash: < 2 arcsec',
    },
    {
      title: 'Stage 4: Dielectric Flip-Mirror Switching Cube',
      componentId: 'flip-mirror-substrate',
      subassembly: 'flip-mirror',
      description: 'An octagonal CNC optical cube directing light between the straight-through lucky-imaging camera port and the 90° spectroscopy port. Features a λ/10 fused silica flat with 99.4% dielectric reflectance at 656.3 nm and hardened kinematic mechanical indexing stops.',
      specs: 'Surface Accuracy: λ/10 PV | Switching Angle: 0° / 45.0° | Port Clear: Ø28 mm',
    },
  ];

  const handleSelectStage = (index: number) => {
    setActiveStage(index);
    const stage = stages[index];
    setSelectedComponentId(stage.componentId);
    setActiveSubassembly(stage.subassembly as any);
  };

  return (
    <div style={{ flex: 1, display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Left Stepped Optical Train Navigator */}
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
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Optical Train Architecture
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            Internal Structure Deep-Dive
          </h2>
          <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
            Inspect internal optics, knife-edge glare baffles, and mechanical clearances with cutaway sectioning.
          </p>
        </div>

        {/* View Mode Quick Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Tube Section Cutaway Mode
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
            <button
              onClick={() => setViewMode('cutaway')}
              className={`btn btn-sm ${viewMode === 'cutaway' ? 'btn-amber' : 'btn-secondary'}`}
            >
              Cutaway
            </button>
            <button
              onClick={() => setViewMode('transparent')}
              className={`btn btn-sm ${viewMode === 'transparent' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Transparent
            </button>
            <button
              onClick={() => setViewMode('solid')}
              className={`btn btn-sm ${viewMode === 'solid' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Solid
            </button>
          </div>
        </div>

        {/* Stepped Stage Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Stepped Optical Path ({stages.length} Stages)
          </div>
          {stages.map((stg, i) => {
            const isCur = activeStage === i;
            return (
              <div
                key={i}
                onClick={() => handleSelectStage(i)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isCur ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid',
                  borderColor: isCur ? 'var(--accent-teal)' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: isCur ? '#ffffff' : 'var(--text-main)' }}>
                  {stg.title}
                </div>
                <p style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {stg.description}
                </p>
                <div style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: isCur ? 'var(--accent-amber)' : 'var(--text-dim)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '4px 6px',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '2px',
                }}>
                  {stg.specs}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 3D Interactive Viewport */}
      <div style={{ flex: 1, position: 'relative', height: '100%', background: '#070b14' }}>
        <TelescopeScene />

        {/* Floating Instruction Overlay */}
        <div style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'rgba(10, 16, 32, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.6rem 1rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          maxWidth: '300px',
          boxShadow: 'var(--shadow-subtle)',
        }}>
          <strong style={{ color: 'var(--accent-teal)' }}>Cutaway View Active:</strong> Rotate and zoom around the optical tube to inspect the knife-edge baffles and steering lens mount.
        </div>
      </div>
    </div>
  );
};
