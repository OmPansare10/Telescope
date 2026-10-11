import React, { useState } from 'react';
import { TelescopeScene } from '../canvas/TelescopeScene';
import { PresetControls } from '../explorer/PresetControls';
import { useTelescope } from '../../context/TelescopeContext';
import { ComponentHierarchyTree } from '../explorer/ComponentHierarchyTree';
import { 
  X, 
  Layers, 
  RotateCcw, 
  Sun, 
  Sliders, 
  Eye, 
  Camera, 
  SplitSquareVertical,
  Info,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const ExplorerPage: React.FC = () => {
  const {
    selectedComponent,
    setSelectedComponentId,
    steeringTilt,
    setSteeringTilt,
    resetSteeringTilt,
    explodedProgress,
    setExplodedProgress,
    resetExploded,
    viewMode,
    setViewMode,
    showRays,
    toggleRays,
    flipMirrorPosition,
    toggleFlipMirror,
    cameraType,
    setCameraType,
    detailLevel,
    setDetailLevel,
  } = useTelescope();

  const [showPartsList, setShowPartsList] = useState<boolean>(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 58px)', overflow: 'hidden', background: '#070b14' }}>
      {/* 1. Full-Screen 3D Interactive Canvas */}
      <TelescopeScene />

      {/* 2. Top-Left Floating Camera Presets */}
      <PresetControls />

      {/* 3. Top-Right "Parts List" toggle button */}
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 30, display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setShowPartsList(!showPartsList)}
          className={`btn btn-sm ${showPartsList ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backdropFilter: 'blur(12px)', background: showPartsList ? undefined : 'rgba(11, 18, 34, 0.85)' }}
        >
          <Layers size={14} />
          <span>{showPartsList ? 'Close Parts' : 'Browse Parts'}</span>
        </button>
      </div>

      {/* 4. Floating Parts List Drawer (only appears when clicked) */}
      {showPartsList && (
        <div style={{
          position: 'absolute',
          top: '4rem',
          right: '1.25rem',
          width: '320px',
          maxHeight: 'calc(100vh - 160px)',
          background: 'rgba(10, 16, 32, 0.94)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          zIndex: 40,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff' }}>Component Catalog</span>
            <button onClick={() => setShowPartsList(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={15} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ComponentHierarchyTree />
          </div>
        </div>
      )}

      {/* 5. Sleek Floating Component Info Card (When a part is clicked) */}
      {selectedComponent && (
        <div style={{
          position: 'absolute',
          top: '4rem',
          left: '1.25rem',
          maxWidth: '360px',
          background: 'rgba(10, 16, 32, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          zIndex: 35,
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          animation: 'fadeIn 150ms ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase' }}>
                {selectedComponent.category}
              </span>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                {selectedComponent.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedComponentId(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {selectedComponent.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem' }}>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Dimensions: </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{selectedComponent.dimensionsMm}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Material: </span>
              <span style={{ color: 'var(--text-main)' }}>{selectedComponent.material.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Simple, Elegant Floating Bottom Control Bar */}
      <div style={{
        position: 'absolute',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        background: 'rgba(10, 16, 32, 0.90)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '0.65rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)',
        maxWidth: '96vw',
        flexWrap: 'wrap',
      }}>
        {/* Steering Lens Tilt Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '140px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Steering Lens Tilt</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-amber)' }}>
                {steeringTilt > 0 ? `+${steeringTilt.toFixed(1)}°` : `${steeringTilt.toFixed(1)}°`}
              </span>
              <button onClick={resetSteeringTilt} title="Reset tilt" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}>
                <RotateCcw size={10} />
              </button>
            </div>
          </div>
          <input
            type="range"
            min="-5.0"
            max="5.0"
            step="0.1"
            value={steeringTilt}
            onChange={(e) => setSteeringTilt(parseFloat(e.target.value))}
            className="range-slider"
          />
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        {/* Explode Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '130px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Explode View</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-teal)' }}>
                {Math.round(explodedProgress * 100)}%
              </span>
              <button onClick={resetExploded} title="Reset collapse" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}>
                <RotateCcw size={10} />
              </button>
            </div>
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
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        {/* View Mode: Solid / Cutaway / Transparent */}
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setViewMode('solid')}
            style={{
              padding: '0.35rem 0.55rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: viewMode === 'solid' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: viewMode === 'solid' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            Solid
          </button>
          <button
            onClick={() => setViewMode('cutaway')}
            style={{
              padding: '0.35rem 0.55rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: viewMode === 'cutaway' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              color: viewMode === 'cutaway' ? 'var(--accent-amber)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            Cutaway
          </button>
          <button
            onClick={() => setViewMode('transparent')}
            style={{
              padding: '0.35rem 0.55rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: viewMode === 'transparent' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: viewMode === 'transparent' ? 'var(--accent-teal)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            Transparent
          </button>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        {/* Flip Mirror: Imaging vs Spectroscopy */}
        <button
          onClick={toggleFlipMirror}
          className={`btn btn-sm ${flipMirrorPosition === 'spectroscopy' ? 'btn-amber' : 'btn-secondary'}`}
          style={{ height: '32px' }}
          title="Switch Flip Mirror between Straight Camera and 90° Spectroscopy Port"
        >
          <SplitSquareVertical size={13} />
          <span>{flipMirrorPosition === 'spectroscopy' ? 'Port: Spectroscopy' : 'Port: Camera'}</span>
        </button>

        {/* Camera Selector: CMOS vs DSLR */}
        <button
          onClick={() => setCameraType(cameraType === 'scientific-cmos' ? 'dslr' : 'scientific-cmos')}
          className="btn btn-sm btn-secondary"
          style={{ height: '32px' }}
          title="Switch Camera between Cooled Scientific CMOS and DSLR"
        >
          <Camera size={13} />
          <span>{cameraType === 'scientific-cmos' ? 'Camera: CMOS' : 'Camera: DSLR'}</span>
        </button>

        {/* Light Rays ON/OFF */}
        <button
          onClick={toggleRays}
          className={`btn btn-sm ${showRays ? 'btn-primary' : 'btn-secondary'}`}
          style={{ height: '32px' }}
          title="Toggle Sunlight Ray Paths"
        >
          <Sun size={13} />
          <span>{showRays ? 'Rays ON' : 'Rays OFF'}</span>
        </button>
      </div>
    </div>
  );
};
