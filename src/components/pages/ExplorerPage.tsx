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
    convexLensPosition,
    setConvexLensPosition,
    resetConvexLensPosition,
  } = useTelescope();

  const [showPartsList, setShowPartsList] = useState<boolean>(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);

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
          width: '300px',
          maxHeight: isControlsCollapsed ? 'calc(100vh - 120px)' : 'calc(100vh - 400px)',
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

      {/* 6. Sleek Floating Right-Side Controls Panel */}
      <div style={{
        position: 'absolute',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 35,
        width: '290px',
        background: 'rgba(10, 16, 32, 0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '0.85rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)',
        transition: 'all 0.2s ease',
      }}>
        {/* Panel Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: isControlsCollapsed ? '0' : '0.45rem',
          borderBottom: isControlsCollapsed ? 'none' : '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            <Sliders size={13} color="var(--accent-teal)" />
            <span>Telescope Controls</span>
          </div>
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            title={isControlsCollapsed ? "Expand controls" : "Collapse controls"}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            {isControlsCollapsed ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        {!isControlsCollapsed && (
          <>
            {/* Steering Lens Tilt Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem' }}>
                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Steering Lens Tilt</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-amber)' }}>
                    {steeringTilt > 0 ? `+${steeringTilt.toFixed(1)}°` : `${steeringTilt.toFixed(1)}°`}
                  </span>
                  <button onClick={resetSteeringTilt} title="Reset tilt to 0°" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}>
                    <RotateCcw size={11} />
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

            {/* Explode View Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem' }}>
                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Explode View</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-teal)' }}>
                    {Math.round(explodedProgress * 100)}%
                  </span>
                  <button onClick={resetExploded} title="Reset collapse" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}>
                    <RotateCcw size={11} />
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

            {/* 45° Convex Lens Position Slider (Movable Left/Right) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem' }}>
                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>45° Convex Lens (L/R)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-teal)' }}>
                    {convexLensPosition > 0 ? `+${Math.round(convexLensPosition * 100)}mm` : `${Math.round(convexLensPosition * 100)}mm`}
                  </span>
                  <button onClick={resetConvexLensPosition} title="Center lens (0 mm)" style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}>
                    <RotateCcw size={11} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={() => setConvexLensPosition(convexLensPosition + 0.05)}
                  title="Move Lens Left (Towards front)"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    padding: '2px 7px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  ◀ Left
                </button>
                <input
                  type="range"
                  min="-0.4"
                  max="0.4"
                  step="0.01"
                  value={convexLensPosition}
                  onChange={(e) => setConvexLensPosition(parseFloat(e.target.value))}
                  className="range-slider"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => setConvexLensPosition(convexLensPosition - 0.05)}
                  title="Move Lens Right (Towards rear)"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    padding: '2px 7px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  Right ▶
                </button>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.1rem 0' }} />

            {/* View Mode: Solid / Cutaway / Transparent */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setViewMode('solid')}
                style={{
                  padding: '0.35rem 0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: viewMode === 'solid' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: viewMode === 'solid' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Solid
              </button>
              <button
                onClick={() => setViewMode('cutaway')}
                style={{
                  padding: '0.35rem 0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: viewMode === 'cutaway' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                  color: viewMode === 'cutaway' ? 'var(--accent-amber)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Cutaway
              </button>
              <button
                onClick={() => setViewMode('transparent')}
                style={{
                  padding: '0.35rem 0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: viewMode === 'transparent' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                  color: viewMode === 'transparent' ? 'var(--accent-teal)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Transparent
              </button>
            </div>

            {/* Flip Mirror, Camera, and Light Rays Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {/* Flip Mirror: Imaging vs Spectroscopy */}
              <button
                onClick={toggleFlipMirror}
                className={`btn btn-sm ${flipMirrorPosition === 'spectroscopy' ? 'btn-amber' : 'btn-secondary'}`}
                style={{ height: '32px', width: '100%', justifyContent: 'center' }}
                title="Switch Flip Mirror between Straight Camera and 90° Spectroscopy Port"
              >
                <SplitSquareVertical size={13} />
                <span>{flipMirrorPosition === 'spectroscopy' ? 'Port: Spectroscopy' : 'Port: Camera'}</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {/* Camera Selector: CMOS vs DSLR */}
                <button
                  onClick={() => setCameraType(cameraType === 'scientific-cmos' ? 'dslr' : 'scientific-cmos')}
                  className="btn btn-sm btn-secondary"
                  style={{ height: '32px', justifyContent: 'center', padding: '0 0.4rem', fontSize: '0.6875rem' }}
                  title="Switch Camera between Cooled Scientific CMOS and DSLR"
                >
                  <Camera size={13} />
                  <span>{cameraType === 'scientific-cmos' ? 'Camera: CMOS' : 'Camera: DSLR'}</span>
                </button>

                {/* Light Rays ON/OFF */}
                <button
                  onClick={toggleRays}
                  className={`btn btn-sm ${showRays ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ height: '32px', justifyContent: 'center', padding: '0 0.4rem', fontSize: '0.6875rem' }}
                  title="Toggle Sunlight Ray Paths"
                >
                  <Sun size={13} />
                  <span>{showRays ? 'Rays ON' : 'Rays OFF'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
