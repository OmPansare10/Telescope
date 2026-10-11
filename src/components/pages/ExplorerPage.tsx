import React, { useState } from 'react';
import { TelescopeScene } from '../canvas/TelescopeScene';
import { ComponentHierarchyTree } from '../explorer/ComponentHierarchyTree';
import { ComponentInspector } from '../explorer/ComponentInspector';
import { ControlBar } from '../explorer/ControlBar';
import { PresetControls } from '../explorer/PresetControls';
import { useTelescope } from '../../context/TelescopeContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Info,
  SlidersHorizontal,
  Sun
} from 'lucide-react';

export const ExplorerPage: React.FC = () => {
  const [leftOpen, setLeftOpen] = useState<boolean>(true);
  const [rightOpen, setRightOpen] = useState<boolean>(true);
  const { steeringTilt, flipMirrorPosition, detailLevel, cameraType } = useTelescope();

  return (
    <div className="explorer-layout">
      {/* 1. Left Hierarchy Sidebar */}
      <aside className={`sidebar-left ${leftOpen ? '' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <Layers size={16} color="var(--accent-teal)" />
            <span>Component Hierarchy</span>
          </div>
          <button
            onClick={() => setLeftOpen(false)}
            className="btn btn-secondary btn-icon"
            style={{ width: '26px', height: '26px' }}
            title="Collapse Sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        </div>
        <div className="sidebar-content">
          <ComponentHierarchyTree />
        </div>
      </aside>

      {/* Floating Toggle Button to re-open Left Sidebar if collapsed */}
      {!leftOpen && (
        <button
          onClick={() => setLeftOpen(true)}
          style={{
            position: 'absolute',
            top: '4.5rem',
            left: '1.25rem',
            zIndex: 40,
            background: 'rgba(11, 18, 34, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            padding: '0.45rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: 'var(--shadow-subtle)',
          }}
          title="Open Component Hierarchy"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* 2. Central 3D Canvas Viewport */}
      <main className="viewport-canvas-container">
        <TelescopeScene />

        {/* Floating Preset Camera Controls (Top Left) */}
        <PresetControls />

        {/* Live Steering Angle Status Widget (Top Right) */}
        <div className="ray-status-widget">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: flipMirrorPosition === 'spectroscopy' ? 'var(--accent-amber)' : 'var(--accent-teal)',
              boxShadow: `0 0 8px ${flipMirrorPosition === 'spectroscopy' ? 'var(--accent-amber)' : 'var(--accent-teal)'}`,
            }} />
            <span style={{ color: 'var(--text-dim)', fontSize: '0.6875rem' }}>PORT:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {flipMirrorPosition === 'spectroscopy' ? 'Spectroscopy (90°)' : 'Imaging (0°)'}
            </span>
          </div>
          <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.6875rem' }}>TILT:</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
              {steeringTilt > 0 ? `+${steeringTilt.toFixed(1)}°` : `${steeringTilt.toFixed(1)}°`}
            </span>
          </div>
        </div>

        {/* Bottom Master Interactive Controls Bar */}
        <ControlBar />
      </main>

      {/* 3. Right Properties Inspector Sidebar */}
      <aside className={`sidebar-right ${rightOpen ? '' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <Info size={16} color="var(--accent-teal)" />
            <span>Properties & Specs</span>
          </div>
          <button
            onClick={() => setRightOpen(false)}
            className="btn btn-secondary btn-icon"
            style={{ width: '26px', height: '26px' }}
            title="Collapse Sidebar"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="sidebar-content">
          <ComponentInspector />
        </div>
      </aside>

      {/* Floating Toggle Button to re-open Right Sidebar if collapsed */}
      {!rightOpen && (
        <button
          onClick={() => setRightOpen(true)}
          style={{
            position: 'absolute',
            top: '4.5rem',
            right: '1.25rem',
            zIndex: 40,
            background: 'rgba(11, 18, 34, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            padding: '0.45rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: 'var(--shadow-subtle)',
          }}
          title="Open Properties Inspector"
        >
          <ChevronLeft size={16} />
        </button>
      )}
    </div>
  );
};
