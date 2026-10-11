import React from 'react';
import { useTelescope } from '../../context/TelescopeContext';
import { DetailLevel, CameraType, ViewMode } from '../../types/telescope';
import { 
  Layers, 
  Camera, 
  Eye, 
  Sun, 
  RotateCcw, 
  Sliders, 
  Maximize2, 
  Play, 
  Pause,
  Grid,
  Radio,
  SplitSquareVertical,
  Activity
} from 'lucide-react';

export const ControlBar: React.FC = () => {
  const {
    detailLevel,
    setDetailLevel,
    cameraType,
    setCameraType,
    viewMode,
    setViewMode,
    explodedProgress,
    setExplodedProgress,
    resetExploded,
    steeringTilt,
    setSteeringTilt,
    resetSteeringTilt,
    flipMirrorPosition,
    toggleFlipMirror,
    showRays,
    toggleRays,
    isRayPlaying,
    setIsRayPlaying
  } = useTelescope();

  return (
    <div className="bottom-control-bar">
      {/* 1. Detail Level Selector (3 Options) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Internal Detail
        </span>
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setDetailLevel('engineering')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: detailLevel === 'engineering' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: detailLevel === 'engineering' ? 'var(--accent-teal)' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Engineering 3D
          </button>
          <button
            onClick={() => setDetailLevel('photorealistic')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: detailLevel === 'photorealistic' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: detailLevel === 'photorealistic' ? 'var(--accent-teal)' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Photorealistic
          </button>
          <button
            onClick={() => setDetailLevel('cad')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: detailLevel === 'cad' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
              color: detailLevel === 'cad' ? '#38bdf8' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            CAD Assembly
          </button>
        </div>
      </div>

      <div style={{ width: '1px', height: '28px', background: 'var(--border-subtle)' }} />

      {/* 2. Camera Configuration (3 Options) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Camera System
        </span>
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setCameraType('scientific-cmos')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: cameraType === 'scientific-cmos' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: cameraType === 'scientific-cmos' ? 'var(--accent-teal)' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Scientific CMOS
          </button>
          <button
            onClick={() => setCameraType('dslr')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: cameraType === 'dslr' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: cameraType === 'dslr' ? 'var(--accent-teal)' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            DSLR
          </button>
          <button
            onClick={() => setCameraType('both')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: cameraType === 'both' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              color: cameraType === 'both' ? 'var(--accent-amber)' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Both (Compare)
          </button>
        </div>
      </div>

      <div style={{ width: '1px', height: '28px', background: 'var(--border-subtle)' }} />

      {/* 3. Tube View Mode (Solid / Transparent / Cutaway) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Tube View Mode
        </span>
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
        </div>
      </div>

      <div style={{ width: '1px', height: '28px', background: 'var(--border-subtle)' }} />

      {/* 4. Steering Lens Tilt Slider (-5.0° to +5.0°) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '150px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Steering Lens Tilt
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-amber)' }}>
              {steeringTilt > 0 ? `+${steeringTilt.toFixed(1)}°` : `${steeringTilt.toFixed(1)}°`}
            </span>
            <button
              onClick={resetSteeringTilt}
              title="Reset tilt to 0.0°"
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
            >
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

      <div style={{ width: '1px', height: '28px', background: 'var(--border-subtle)' }} />

      {/* 5. Exploded Distance Slider (0 to 100%) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '140px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Explode Assembly
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-teal)' }}>
              {Math.round(explodedProgress * 100)}%
            </span>
            <button
              onClick={resetExploded}
              title="Reset explosion to 0%"
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
            >
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

      <div style={{ width: '1px', height: '28px', background: 'var(--border-subtle)' }} />

      {/* 6. Flip Mirror Switching Button */}
      <button
        onClick={toggleFlipMirror}
        className={`btn btn-sm ${flipMirrorPosition === 'spectroscopy' ? 'btn-amber' : 'btn-secondary'}`}
        style={{ height: '36px' }}
        title="Toggle between Straight-Through Imaging (0°) and 90° Spectroscopy Port"
      >
        <SplitSquareVertical size={14} />
        {flipMirrorPosition === 'spectroscopy' ? 'Port: Spectroscopy (90°)' : 'Port: Imaging (0°)'}
      </button>

      {/* 7. Optical Rays Toggle & Play */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          onClick={toggleRays}
          className={`btn btn-sm ${showRays ? 'btn-primary' : 'btn-secondary'}`}
          style={{ height: '36px' }}
          title="Toggle Optical Ray Trace Paths"
        >
          <Sun size={14} />
          {showRays ? 'Rays ON' : 'Rays OFF'}
        </button>
        {showRays && (
          <button
            onClick={() => setIsRayPlaying(!isRayPlaying)}
            className="btn btn-sm btn-secondary btn-icon"
            title={isRayPlaying ? 'Pause Ray Animation' : 'Play Ray Animation'}
          >
            {isRayPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
        )}
      </div>
    </div>
  );
};
