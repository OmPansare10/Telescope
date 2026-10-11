import React from 'react';
import { PageId } from '../common/Navbar';
import { useTelescope } from '../../context/TelescopeContext';
import { TelescopeScene } from '../canvas/TelescopeScene';
import { 
  Telescope, 
  Layers, 
  Cpu, 
  FileText, 
  Sun, 
  Activity, 
  Sliders, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Zap
} from 'lucide-react';

interface Props {
  setActivePage: (p: PageId) => void;
  onOpenConfig: () => void;
}

export const OverviewPage: React.FC<Props> = ({ setActivePage, onOpenConfig }) => {
  const { derivedSpecs, detailLevel, cameraType } = useTelescope();

  const featureCards: {
    id: PageId;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
  }[] = [
    {
      id: 'explorer',
      title: '3D Telescope Explorer',
      description: 'Master 3D CAD/PBR viewport with complete component tree, real-time material rendering, and interactive ray tracing.',
      icon: <Telescope size={20} color="var(--accent-teal)" />,
      badge: 'Interactive 3D',
    },
    {
      id: 'internal',
      title: 'Internal Structure',
      description: 'Inspect the apochromatic doublet, precision 2.4mm air-gap ring, 3 internal knife-edge glare baffles, and optical alignment cells.',
      icon: <Eye size={20} color="var(--accent-teal)" />,
      badge: 'Cutaway View',
    },
    {
      id: 'exploded',
      title: 'Exploded Assembly',
      description: 'Animate part-by-part breakout along kinematic assembly axes. Inspect the entire instrument, camera alone, or steering unit alone.',
      icon: <Layers size={20} color="var(--accent-amber)" />,
      badge: 'Kinematic Breakout',
    },
    {
      id: 'camera',
      title: 'Camera Explorer',
      description: 'Compare the Cooled Scientific CMOS astronomy camera (lucky imaging @ 120 fps) against full-frame DSLR architectures.',
      icon: <Cpu size={20} color="var(--accent-teal)" />,
      badge: 'Option A / B / C',
    },
    {
      id: 'drawings',
      title: '2D Engineering Drawings',
      description: 'High-precision SVG vector drawings: Front/Side elevation, longitudinal cutaway, exploded assembly, and optical schematics with PDF print export.',
      icon: <FileText size={20} color="var(--accent-teal)" />,
      badge: 'ISO-10110 CAD',
    },
    {
      id: 'rays',
      title: 'Optical Ray Simulation',
      description: 'Trace incoming solar light through the ERF filter, objective doublet, adjustable steering lens, and flip mirror with live photon packets.',
      icon: <Sun size={20} color="var(--accent-amber)" />,
      badge: 'Ray Tracer',
    },
    {
      id: 'spectroscopy',
      title: 'Spectroscopy Module',
      description: 'High-resolution Czerny-Turner/Littrow spectrograph with bilateral entrance slit, 1800 lines/mm grating, and Fraunhofer absorption profiling.',
      icon: <Activity size={20} color="var(--accent-teal)" />,
      badge: 'R > 30,000',
    },
    {
      id: 'specs',
      title: 'Technical Specifications',
      description: 'Configurable aperture (80-100mm), focal length (600-800mm), sensor dimensions, Nyquist sampling, and provisional tag verification.',
      icon: <Sliders size={20} color="var(--accent-amber)" />,
      badge: 'Parametric CAD',
    },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Hero Section with Interactive 3D Model Viewport */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '2rem',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(6, 182, 212, 0.08) 0%, rgba(11, 18, 35, 0.6) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Left Column: Hero Text & Quick Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-verified">
              <ShieldCheck size={12} /> H-ALPHA 656.3 NM INSTRUMENT
            </span>
            <span className="badge badge-cad">
              9 CONFIGURATION MATRIX READY
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#ffffff' }}>
            Precision 3D Solar Refractor Telescope Simulator
          </h1>

          <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            A comprehensive, interactive scientific engineering platform modeling a specialized 90mm f/8.0 solar telescope. Features an adjustable optical steering lens mechanism, dual-element apochromatic objective, dielectric flip-mirror, scientific CMOS / DSLR camera subsystems, and an 1800 lines/mm holographic spectroscopy module.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Aperture</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>90 mm</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Focal Ratio</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>f/{derivedSpecs.focalRatio}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Line</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>656.3 nm</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Steering Tilt</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>±5.0°</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => setActivePage('explorer')}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}
            >
              <Telescope size={18} />
              <span>Launch 3D Explorer</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onOpenConfig}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}
            >
              <Sliders size={16} />
              <span>Matrix Configurations</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Live 3D Viewport Preview */}
        <div style={{
          height: '420px',
          width: '100%',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
          position: 'relative'
        }}>
          <TelescopeScene />
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(10, 16, 32, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.6875rem',
            color: 'var(--accent-teal)',
            border: '1px solid var(--border-subtle)',
            pointerEvents: 'none',
          }}>
            Interactive 3D Canvas • Drag to Rotate
          </div>
        </div>
      </div>

      {/* Feature Modules Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#ffffff' }}>
              Engineering Simulation Modules
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Explore every subsystem through interactive 3D models, SVG engineering drawings, and physics calculations.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {featureCards.map(card => (
            <div
              key={card.id}
              onClick={() => setActivePage(card.id)}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'all 200ms ease',
                border: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-teal)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {card.icon}
                </div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-muted)',
                }}>
                  {card.badge}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '4px' }}>
                  {card.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-teal)', fontSize: '0.75rem', fontWeight: 600, marginTop: 'auto' }}>
                <span>Launch Module</span>
                <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
