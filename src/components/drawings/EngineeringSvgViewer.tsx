import React, { useState } from 'react';
import { useTelescope } from '../../context/TelescopeContext';
import { TELESCOPE_COMPONENTS } from '../../data/componentsData';
import { 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  Layers,
  CheckSquare,
  Square
} from 'lucide-react';

export type DrawingType = 
  | 'front-elevation'
  | 'side-elevation'
  | 'top-view'
  | 'longitudinal-cutaway'
  | 'optical-layout'
  | 'exploded-drawing'
  | 'camera-cross-section'
  | 'steering-mechanism'
  | 'spectroscopy-layout';

export const EngineeringSvgViewer: React.FC = () => {
  const { 
    showDimensions, 
    setShowDimensions, 
    showLabels, 
    setShowLabels, 
    showCenterlines, 
    setShowCenterlines,
    showRays,
    setShowRays,
    steeringTilt,
    flipMirrorPosition,
    cameraType
  } = useTelescope();

  const [activeDrawing, setActiveDrawing] = useState<DrawingType>('longitudinal-cutaway');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const drawingTabs: { id: DrawingType; label: string }[] = [
    { id: 'longitudinal-cutaway', label: '1. Longitudinal Cutaway Section' },
    { id: 'side-elevation', label: '2. Side Elevation' },
    { id: 'front-elevation', label: '3. Front Elevation' },
    { id: 'top-view', label: '4. Top View' },
    { id: 'optical-layout', label: '5. Optical Ray Layout' },
    { id: 'exploded-drawing', label: '6. Exploded Assembly Drawing' },
    { id: 'camera-cross-section', label: '7. Camera Cross-Section' },
    { id: 'steering-mechanism', label: '8. Steering-Lens Mechanism Detail' },
    { id: 'spectroscopy-layout', label: '9. Spectroscopy Optical Layout' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportSvg = () => {
    const svgEl = document.getElementById('cad-svg-canvas');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOLARIS-90-${activeDrawing}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Steering deflection in SVG pixels
  const svgTiltDeflection = steeringTilt * 3.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem', padding: '1rem' }}>
      {/* Top Drawing Selector Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', maxWidth: '70vw', paddingBottom: '4px' }}>
          {drawingTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDrawing(tab.id)}
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: activeDrawing === tab.id ? 'var(--accent-teal)' : 'var(--border-subtle)',
                background: activeDrawing === tab.id ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: activeDrawing === tab.id ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CAD Layer Toggles & Export Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`btn btn-sm ${showDimensions ? 'btn-primary' : 'btn-secondary'}`}
            title="Toggle Dimension Lines & Tolerances"
          >
            {showDimensions ? <CheckSquare size={13} /> : <Square size={13} />}
            <span>Dimensions</span>
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`btn btn-sm ${showLabels ? 'btn-primary' : 'btn-secondary'}`}
            title="Toggle Component Callout Balloons"
          >
            {showLabels ? <CheckSquare size={13} /> : <Square size={13} />}
            <span>Callouts</span>
          </button>

          <button
            onClick={() => setShowCenterlines(!showCenterlines)}
            className={`btn btn-sm ${showCenterlines ? 'btn-primary' : 'btn-secondary'}`}
            title="Toggle Optical Axis Centerlines"
          >
            {showCenterlines ? <CheckSquare size={13} /> : <Square size={13} />}
            <span>Centerlines</span>
          </button>

          <button
            onClick={() => setShowRays(!showRays)}
            className={`btn btn-sm ${showRays ? 'btn-amber' : 'btn-secondary'}`}
            title="Toggle Optical Ray Traces"
          >
            {showRays ? <CheckSquare size={13} /> : <Square size={13} />}
            <span>Ray Traces</span>
          </button>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

          <button onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.15))} className="btn btn-secondary btn-sm btn-icon" title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.15))} className="btn btn-secondary btn-sm btn-icon" title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <button onClick={() => setZoomLevel(1.0)} className="btn btn-secondary btn-sm btn-icon" title="Reset Zoom">
            <RotateCcw size={14} />
          </button>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

          <button onClick={handleExportSvg} className="btn btn-secondary btn-sm" title="Download Vector SVG File">
            <Download size={14} />
            <span>Export SVG</span>
          </button>
          <button onClick={handlePrint} className="btn btn-secondary btn-sm" title="Print CAD Drawing">
            <Printer size={14} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Drawing Viewport & Bill of Materials */}
      <div style={{ flex: 1, display: 'flex', gap: '1rem', overflow: 'hidden' }}>
        {/* SVG Drawing Canvas Container */}
        <div style={{
          flex: 1,
          height: '100%',
          background: '#090e1a',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          position: 'relative'
        }}>
          {/* Engineering Blueprint Watermark & Grid */}
          <div style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 150ms ease',
            boxShadow: '0 0 35px rgba(0, 0, 0, 0.7)',
            borderRadius: '6px',
            background: '#070c18',
          }}>
            <svg
              id="cad-svg-canvas"
              viewBox="0 0 1100 650"
              width="1100"
              height="650"
              style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {/* Blueprint Grid pattern */}
              <defs>
                <pattern id="cadGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="0.8" />
                </pattern>
                <pattern id="cadMajorGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
                </pattern>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8" />
                </marker>
                <marker id="arrowAmber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#f59e0b" />
                </marker>
              </defs>

              {/* Grid Background */}
              <rect width="1100" height="650" fill="#070c18" />
              <rect width="1100" height="650" fill="url(#cadGrid)" />
              <rect width="1100" height="650" fill="url(#cadMajorGrid)" />

              {/* Standard ISO Engineering Title Block Border */}
              <rect x="20" y="20" width="1060" height="610" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="25" y="25" width="1050" height="600" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.75" />

              {/* Title Block Box (Bottom Right) */}
              <g transform="translate(730, 500)">
                <rect width="345" height="125" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.2" />
                <line x1="0" y1="35" x2="345" y2="35" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
                <line x1="0" y1="70" x2="345" y2="70" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
                <line x1="170" y1="0" x2="170" y2="70" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />

                <text x="10" y="16" fill="#94a3b8" fontSize="9">PROJECT:</text>
                <text x="10" y="30" fill="#ffffff" fontSize="12" fontWeight="700">SOLARIS-90 ENGINEERING</text>

                <text x="180" y="16" fill="#94a3b8" fontSize="9">DRAWING NO:</text>
                <text x="180" y="30" fill="#38bdf8" fontSize="11" fontWeight="600">DWG-SOL-2026-009</text>

                <text x="10" y="50" fill="#94a3b8" fontSize="9">CONFIGURATION:</text>
                <text x="10" y="64" fill="#ffffff" fontSize="10">{cameraType.toUpperCase()} / H-ALPHA 656.3nm</text>

                <text x="180" y="50" fill="#94a3b8" fontSize="9">STATUS:</text>
                <text x="180" y="64" fill="#10b981" fontSize="10" fontWeight="700">ISO-10110 OPTICAL RELEASE</text>

                <text x="10" y="88" fill="#94a3b8" fontSize="9">SHEET TITLE:</text>
                <text x="10" y="106" fill="#f59e0b" fontSize="13" fontWeight="700">
                  {drawingTabs.find(t => t.id === activeDrawing)?.label.toUpperCase()}
                </text>
                <text x="250" y="118" fill="#64748b" fontSize="9">PROVISIONAL MARKS IN AMBER</text>
              </g>

              {/* RENDER SPECIFIC DRAWINGS */}

              {/* 1. LONGITUDINAL CUTAWAY & OPTICAL SCHEMATIC */}
              {(activeDrawing === 'longitudinal-cutaway' || activeDrawing === 'optical-layout') && (
                <g transform="translate(60, 260)">
                  {/* Optical Centerline */}
                  {(showCenterlines || activeDrawing === 'optical-layout') && (
                    <g>
                      <line x1="30" y1="0" x2="900" y2="0" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="14,6,3,6" />
                      <text x="910" y="4" fill="#06b6d4" fontSize="10">OPTICAL AXIS</text>
                    </g>
                  )}

                  {/* Objective Cell & Filter Front (X = 80 to 180) */}
                  <rect x="80" y="-85" width="20" height="170" fill="rgba(153, 27, 27, 0.4)" stroke="#991b1b" strokeWidth="1.5" />
                  <rect x="105" y="-95" width="30" height="190" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                  {/* Objective Lens 1 (Crown - convex) */}
                  <path d="M 140 -80 Q 155 0 140 80 L 160 80 Q 148 0 160 -80 Z" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Air spacer gap (provisional tag) */}
                  <line x1="162" y1="-80" x2="162" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" />
                  {/* Objective Lens 2 (Flint - concave) */}
                  <path d="M 165 -80 Q 152 0 165 80 L 180 80 Q 175 0 180 -80 Z" fill="rgba(99, 102, 241, 0.3)" stroke="#818cf8" strokeWidth="1.5" />

                  {/* Optical Tube Shell (Cutaway upper half, solid lower half) */}
                  <rect x="180" y="-90" width="460" height="8" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="180" y="82" width="460" height="8" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Internal Baffles */}
                  {/* Baffle 1 */}
                  <line x1="280" y1="-82" x2="280" y2="-60" stroke="#f1f5f9" strokeWidth="2.5" />
                  <line x1="280" y1="82" x2="280" y2="60" stroke="#f1f5f9" strokeWidth="2.5" />
                  {/* Baffle 2 */}
                  <line x1="410" y1="-82" x2="410" y2="-48" stroke="#f1f5f9" strokeWidth="2.5" />
                  <line x1="410" y1="82" x2="410" y2="48" stroke="#f1f5f9" strokeWidth="2.5" />
                  {/* Baffle 3 */}
                  <line x1="530" y1="-82" x2="530" y2="-36" stroke="#f1f5f9" strokeWidth="2.5" />
                  <line x1="530" y1="82" x2="530" y2="36" stroke="#f1f5f9" strokeWidth="2.5" />

                  {/* Steering Lens Gimbal Mechanism (X = 640) */}
                  <g transform={`translate(640, 0) rotate(${steeringTilt * 1.5})`}>
                    <rect x="-10" y="-45" width="20" height="90" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                    <path d="M -6 -40 Q 6 0 -6 40 L 4 40 Q 14 0 4 -40 Z" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="1.5" />
                    {/* Pivot pins */}
                    <circle cx="0" cy="-48" r="4" fill="#38bdf8" />
                    <circle cx="0" cy="48" r="4" fill="#38bdf8" />
                  </g>

                  {/* Flip-Mirror Housing & Cube (X = 720) */}
                  <rect x="680" y="-70" width="80" height="140" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* 45-degree Flip Mirror or flat */}
                  {flipMirrorPosition === 'spectroscopy' ? (
                    <line x1="695" y1="35" x2="745" y2="-35" stroke="#10b981" strokeWidth="4" />
                  ) : (
                    <line x1="700" y1="-60" x2="750" y2="-60" stroke="#64748b" strokeWidth="3" />
                  )}

                  {/* Spectroscopy Vertical Port (+Y in drawing, upwards) */}
                  <rect x="700" y="-190" width="40" height="120" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Entrance slit */}
                  <line x1="705" y1="-100" x2="735" y2="-100" stroke="#f59e0b" strokeWidth="2" />
                  {/* Grating */}
                  <line x1="705" y1="-150" x2="735" y2="-150" stroke="#06b6d4" strokeWidth="3" />

                  {/* Camera Body (X = 770 to 880) */}
                  <rect x="760" y="-60" width="110" height="120" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Sensor Plane */}
                  <line x1="840" y1={`calc(-35 + ${svgTiltDeflection})`} x2="840" y2={`calc(35 + ${svgTiltDeflection})`} stroke="#ef4444" strokeWidth="3" />
                  <text x="846" y={svgTiltDeflection} fill="#ef4444" fontSize="9">SENSOR</text>

                  {/* OPTICAL RAYS (Incoming parallel sunlight -> objective -> steering lens -> sensor / spec) */}
                  {showRays && (
                    <g opacity="0.85">
                      {/* Incoming parallel rays */}
                      <path d="M 30 -75 L 140 -75" stroke="#ef4444" strokeWidth="1.2" />
                      <path d="M 30 0 L 140 0" stroke="#ef4444" strokeWidth="1.2" />
                      <path d="M 30 75 L 140 75" stroke="#ef4444" strokeWidth="1.2" />

                      {/* Objective refraction cone */}
                      <path d="M 160 -75 L 640 -30" stroke="#ef4444" strokeWidth="1.2" />
                      <path d="M 160 0 L 640 0" stroke="#ef4444" strokeWidth="1.2" />
                      <path d="M 160 75 L 640 30" stroke="#ef4444" strokeWidth="1.2" />

                      {/* Steered beam through flip mirror */}
                      {flipMirrorPosition === 'imaging' ? (
                        <>
                          <path d={`M 640 -30 L 840 ${svgTiltDeflection - 2}`} stroke="#ef4444" strokeWidth="1.2" />
                          <path d={`M 640 0 L 840 ${svgTiltDeflection}`} stroke="#ef4444" strokeWidth="1.2" />
                          <path d={`M 640 30 L 840 ${svgTiltDeflection + 2}`} stroke="#ef4444" strokeWidth="1.2" />
                          {/* Focused solar spot indicator */}
                          <circle cx="840" cy={svgTiltDeflection} r="4" fill="#f59e0b" />
                        </>
                      ) : (
                        <>
                          {/* Reflected 90 degrees up into spectroscopy port */}
                          <path d="M 640 -30 L 710 0 L 710 -170" stroke="#06b6d4" strokeWidth="1.2" />
                          <path d="M 640 0 L 720 0 L 720 -170" stroke="#10b981" strokeWidth="1.2" />
                          <path d="M 640 30 L 730 0 L 730 -170" stroke="#ef4444" strokeWidth="1.2" />
                        </>
                      )}
                    </g>
                  )}

                  {/* DIMENSION LINES & CALLOUTS */}
                  {showDimensions && (
                    <g>
                      {/* Main Tube Length: 580 mm */}
                      <line x1="180" y1="110" x2="640" y2="110" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                      <text x="380" y="125" fill="#38bdf8" fontSize="10" textAnchor="middle">580.0 mm (TUBE LENGTH)</text>

                      {/* Aperture Diameter: Ø90 mm */}
                      <line x1="55" y1="-80" x2="55" y2="80" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                      <text x="45" y="4" fill="#38bdf8" fontSize="10" textAnchor="end">Ø90.0 mm</text>

                      {/* Objective Air Gap: 2.4 mm (Provisional) */}
                      <line x1="162" y1="-95" x2="162" y2="-125" stroke="#f59e0b" strokeWidth="1" />
                      <rect x="120" y="-140" width="130" height="18" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                      <text x="125" y="-127" fill="#f59e0b" fontSize="8" fontWeight="700">AIR-GAP: 2.4 mm [PROV]</text>
                    </g>
                  )}

                  {/* CALLOUT BUBBLES */}
                  {showLabels && (
                    <g>
                      {/* Callout 1: ERF Filter */}
                      <circle cx="90" cy="-105" r="10" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.2" />
                      <text x="90" y="-101" fill="#38bdf8" fontSize="9" fontWeight="700" textAnchor="middle">1</text>
                      <line x1="90" y1="-95" x2="90" y2="-85" stroke="#38bdf8" strokeWidth="1" />

                      {/* Callout 2: Objective Doublet */}
                      <circle cx="150" cy="-105" r="10" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.2" />
                      <text x="150" y="-101" fill="#38bdf8" fontSize="9" fontWeight="700" textAnchor="middle">2</text>

                      {/* Callout 3: Baffles */}
                      <circle cx="410" cy="-105" r="10" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.2" />
                      <text x="410" y="-101" fill="#38bdf8" fontSize="9" fontWeight="700" textAnchor="middle">3</text>

                      {/* Callout 4: Steering Lens */}
                      <circle cx="640" cy="-105" r="10" fill="#0b1329" stroke="#f59e0b" strokeWidth="1.2" />
                      <text x="640" y="-101" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">4</text>

                      {/* Callout 5: Flip Mirror */}
                      <circle cx="720" cy="95" r="10" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.2" />
                      <text x="720" y="99" fill="#38bdf8" fontSize="9" fontWeight="700" textAnchor="middle">5</text>

                      {/* Callout 6: Camera */}
                      <circle cx="820" cy="-80" r="10" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.2" />
                      <text x="820" y="-76" fill="#38bdf8" fontSize="9" fontWeight="700" textAnchor="middle">6</text>
                    </g>
                  )}
                </g>
              )}

              {/* 2. SIDE ELEVATION */}
              {activeDrawing === 'side-elevation' && (
                <g transform="translate(80, 290)">
                  {/* Complete external side silhouette with tube rings, dovetail, mount head, tripod */}
                  {/* Optical Tube & Hood */}
                  <rect x="70" y="-55" width="60" height="110" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.5" />
                  <rect x="130" y="-50" width="520" height="100" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Tube Rings */}
                  <rect x="240" y="-56" width="30" height="112" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
                  <circle cx="255" cy="-62" r="5" fill="#f59e0b" />
                  <rect x="460" y="-56" width="30" height="112" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
                  <circle cx="475" cy="-62" r="5" fill="#f59e0b" />
                  {/* Dovetail Plate */}
                  <rect x="220" y="56" width="290" height="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Rear Optical Housing & Flip Mirror */}
                  <rect x="650" y="-52" width="90" height="104" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* 90-degree Spectroscopy Port Housing */}
                  <rect x="665" y="-140" width="60" height="88" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Camera Body */}
                  <rect x="740" y="-48" width="85" height="96" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                  <circle cx="782" cy="0" r="18" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Mount Saddle & Altitude Axis */}
                  <rect x="330" y="70" width="70" height="35" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="365" cy="120" r="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Tripod Pier & Splayed Legs */}
                  <rect x="350" y="148" width="30" height="40" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="365" y1="188" x2="220" y2="310" stroke="#e2e8f0" strokeWidth="6" />
                  <line x1="365" y1="188" x2="510" y2="310" stroke="#e2e8f0" strokeWidth="6" />
                  <line x1="280" y1="260" x2="450" y2="260" stroke="#38bdf8" strokeWidth="2" />

                  {/* Side Dimensions */}
                  {showDimensions && (
                    <g>
                      <line x1="70" y1="-80" x2="825" y2="-80" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                      <text x="447" y="-90" fill="#38bdf8" fontSize="10" textAnchor="middle">755.0 mm (OVERALL INSTRUMENT LENGTH)</text>
                    </g>
                  )}
                </g>
              )}

              {/* 3. FRONT ELEVATION */}
              {activeDrawing === 'front-elevation' && (
                <g transform="translate(480, 280)">
                  {/* Concentric rings: Outer dew shield -> cell -> clear aperture -> solar ERF */}
                  <circle cx="0" cy="0" r="140" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2" />
                  <circle cx="0" cy="0" r="125" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="105" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Dielectric ERF Filter Glass (Deep red tint) */}
                  <circle cx="0" cy="0" r="95" fill="rgba(153, 27, 27, 0.5)" stroke="#ef4444" strokeWidth="2" />

                  {/* 3 Collimation screw pairs at 120 degrees */}
                  {[0, 120, 240].map((deg, i) => {
                    const r = 115;
                    const rad = (deg * Math.PI) / 180;
                    const x = Math.cos(rad) * r;
                    const y = Math.sin(rad) * r;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                        <line x1={x - 4} y1={y} x2={x + 4} y2={y} stroke="#000" strokeWidth="1.5" />
                      </g>
                    );
                  })}

                  {/* Crosshairs & Centerline */}
                  {showCenterlines && (
                    <g>
                      <line x1="-160" y1="0" x2="160" y2="0" stroke="#06b6d4" strokeWidth="1" strokeDasharray="10,5" />
                      <line x1="0" y1="-160" x2="0" y2="160" stroke="#06b6d4" strokeWidth="1" strokeDasharray="10,5" />
                    </g>
                  )}

                  {showDimensions && (
                    <g>
                      <line x1="-95" y1="0" x2="95" y2="0" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                      <text x="0" y="-10" fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">CLEAR APERTURE: Ø90.0 mm</text>
                    </g>
                  )}
                </g>
              )}

              {/* 4. STEERING-LENS MECHANISM DETAIL DRAWING */}
              {activeDrawing === 'steering-mechanism' && (
                <g transform="translate(180, 280)">
                  {/* Detailed zoomed cross-section of Gimbal frame, pivot bearing, micrometer, lens cell */}
                  <rect x="0" y="-120" width="220" height="240" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="110" cy="0" r="85" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Meniscus steering lens inside tilted gimbal */}
                  <g transform={`translate(110, 0) rotate(${steeringTilt * 2})`}>
                    <rect x="-14" y="-60" width="28" height="120" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                    <path d="M -8 -50 Q 8 0 -8 50 L 6 50 Q 18 0 6 -50 Z" fill="rgba(245, 158, 11, 0.4)" stroke="#f59e0b" strokeWidth="1.5" />
                    {/* Delrin retention buffer shims */}
                    <circle cx="0" cy="-55" r="4" fill="#38bdf8" />
                    <circle cx="0" cy="55" r="4" fill="#38bdf8" />
                  </g>

                  {/* Differential Micrometer Actuator */}
                  <rect x="90" y="120" width="40" height="90" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1="90" y1="150" x2="130" y2="150" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="90" y1="165" x2="130" y2="165" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="90" y1="180" x2="130" y2="180" stroke="#e2e8f0" strokeWidth="1" />
                  {/* Push rod into gimbal arm */}
                  <rect x="105" y="80" width="10" height="40" fill="#e2e8f0" stroke="#38bdf8" strokeWidth="1" />

                  {/* Digital Angular Encoder Scale */}
                  <rect x="220" y="-40" width="60" height="80" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="250" y="5" fill="#10b981" fontSize="10" fontWeight="700" textAnchor="middle">
                    {steeringTilt > 0 ? `+${steeringTilt.toFixed(1)}°` : `${steeringTilt.toFixed(1)}°`}
                  </text>
                  <text x="250" y="20" fill="#64748b" fontSize="8" textAnchor="middle">ENCODER</text>

                  {showDimensions && (
                    <g>
                      <text x="110" y="-135" fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">
                        GIMBAL ROTATION AXIS: ±5.0° BACKLASH-FREE (CURRENT: {steeringTilt.toFixed(1)}°)
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* 5. EXPLODED ASSEMBLY DRAWING */}
              {activeDrawing === 'exploded-drawing' && (
                <g transform="translate(60, 280)">
                  {/* Step-by-step exploded sequence along axis with leader lines */}
                  {/* 1. ERF Filter */}
                  <rect x="40" y="-50" width="15" height="100" fill="rgba(153, 27, 27, 0.4)" stroke="#ef4444" strokeWidth="1.5" />
                  <line x1="55" y1="0" x2="110" y2="0" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* 2. Lens Cell */}
                  <rect x="110" y="-60" width="25" height="120" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                  <line x1="135" y1="0" x2="190" y2="0" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* 3. Crown Lens 1 */}
                  <rect x="190" y="-45" width="15" height="90" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="205" y1="0" x2="250" y2="0" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* 4. Air Spacer */}
                  <rect x="250" y="-45" width="6" height="90" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
                  <line x1="256" y1="0" x2="295" y2="0" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* 5. Flint Lens 2 */}
                  <rect x="295" y="-45" width="15" height="90" fill="rgba(99, 102, 241, 0.3)" stroke="#818cf8" strokeWidth="1.5" />
                  <line x1="310" y1="0" x2="380" y2="0" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* 6. Tube Shell */}
                  <rect x="380" y="-55" width="220" height="110" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="600" y1="0" x2="650" y2="0" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* 7. Steering Unit */}
                  <rect x="650" y="-45" width="30" height="90" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1="680" y1="0" x2="730" y2="0" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* 8. Flip Mirror Cube */}
                  <rect x="730" y="-45" width="40" height="90" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="770" y1="0" x2="820" y2="0" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* 9. Camera Unit */}
                  <rect x="820" y="-55" width="60" height="110" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />

                  {/* Exploded Leader Callout Numbers */}
                  {[
                    { x: 47, n: '1' },
                    { x: 122, n: '2' },
                    { x: 197, n: '3' },
                    { x: 253, n: '4' },
                    { x: 302, n: '5' },
                    { x: 490, n: '6' },
                    { x: 665, n: '7' },
                    { x: 750, n: '8' },
                    { x: 850, n: '9' },
                  ].map((item, idx) => (
                    <g key={idx}>
                      <circle cx={item.x} cy="-80" r="10" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.2" />
                      <text x={item.x} y="-76" fill="#38bdf8" fontSize="9" fontWeight="700" textAnchor="middle">{item.n}</text>
                      <line x1={item.x} y1="-70" x2={item.x} y2="-55" stroke="#38bdf8" strokeWidth="1" />
                    </g>
                  ))}
                </g>
              )}

              {/* 6. SPECTROSCOPY OPTICAL LAYOUT */}
              {activeDrawing === 'spectroscopy-layout' && (
                <g transform="translate(150, 310)">
                  {/* Czerny-Turner / Littrow style spectrograph ray path */}
                  {/* Entrance Slit */}
                  <rect x="50" y="-20" width="10" height="40" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
                  <text x="55" y="35" fill="#f59e0b" fontSize="9" textAnchor="middle">SLIT (25µm)</text>

                  {/* Collimator Achromat */}
                  <rect x="180" y="-35" width="16" height="70" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="188" y="50" fill="#38bdf8" fontSize="9" textAnchor="middle">COLLIMATOR (f=140mm)</text>

                  {/* 1800 lines/mm Diffraction Grating */}
                  <g transform="translate(360, 0) rotate(25)">
                    <rect x="-8" y="-45" width="16" height="90" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                    {/* Grating rulings */}
                    {[-30, -15, 0, 15, 30].map((ly, i) => (
                      <line key={i} x1="-6" y1={ly} x2="6" y2={ly} stroke="#38bdf8" strokeWidth="1" />
                    ))}
                    <text x="30" y="5" fill="#06b6d4" fontSize="9" fontWeight="700">1800 l/mm</text>
                  </g>

                  {/* Imaging Doublet Lens */}
                  <rect x="520" y="-40" width="16" height="80" fill="rgba(99, 102, 241, 0.3)" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="528" y="55" fill="#818cf8" fontSize="9" textAnchor="middle">CAMERA OBJECTIVE</text>

                  {/* Linear Detector Array */}
                  <rect x="680" y="-50" width="12" height="100" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
                  <text x="686" y="65" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">DETECTOR</text>

                  {/* Multi-spectral rays bundle */}
                  <g opacity="0.85">
                    {/* From slit to collimator */}
                    <line x1="60" y1="0" x2="180" y2="-25" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="60" y1="0" x2="180" y2="25" stroke="#ffffff" strokeWidth="1.2" />

                    {/* Collimated beam to grating */}
                    <line x1="196" y1="-25" x2="350" y2="-25" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="196" y1="25" x2="350" y2="25" stroke="#ffffff" strokeWidth="1.2" />

                    {/* Dispersed wavelengths from grating to detector */}
                    {/* Red: H-alpha (656.3 nm) */}
                    <line x1="370" y1="-20" x2="520" y2="-30" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="536" y1="-30" x2="680" y2="-35" stroke="#ef4444" strokeWidth="1.5" />

                    {/* Yellow: Sodium D (589 nm) */}
                    <line x1="370" y1="-5" x2="520" y2="-10" stroke="#f59e0b" strokeWidth="1.5" />
                    <line x1="536" y1="-10" x2="680" y2="-12" stroke="#f59e0b" strokeWidth="1.5" />

                    {/* Green: Magnesium b (518 nm) */}
                    <line x1="370" y1="10" x2="520" y2="10" stroke="#10b981" strokeWidth="1.5" />
                    <line x1="536" y1="10" x2="680" y2="10" stroke="#10b981" strokeWidth="1.5" />

                    {/* Cyan: H-beta (486 nm) */}
                    <line x1="370" y1="25" x2="520" y2="28" stroke="#06b6d4" strokeWidth="1.5" />
                    <line x1="536" y1="28" x2="680" y2="35" stroke="#06b6d4" strokeWidth="1.5" />
                  </g>
                </g>
              )}

              {/* 7. CAMERA CROSS-SECTION */}
              {activeDrawing === 'camera-cross-section' && (
                <g transform="translate(220, 290)">
                  {/* Detailed cross section of camera: flange, window, sensor, peltier, heatsink, fan */}
                  <rect x="0" y="-100" width="380" height="200" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  {/* Nosepiece */}
                  <rect x="-40" y="-60" width="40" height="120" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" />
                  {/* Hermetic chamber AR window */}
                  <rect x="25" y="-50" width="8" height="100" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="29" y="70" fill="#38bdf8" fontSize="9" textAnchor="middle">AR WINDOW</text>
                  {/* CMOS Sensor Die */}
                  <rect x="80" y="-45" width="12" height="90" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
                  <text x="86" y="-55" fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="middle">CMOS SENSOR DIE</text>
                  {/* Peltier Thermoelectric Cooler */}
                  <rect x="105" y="-35" width="18" height="70" fill="#e2e8f0" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="114" y="55" fill="#f59e0b" fontSize="8" textAnchor="middle">PELTIER (ΔT=-35°C)</text>
                  {/* Copper Heat Pipe & Heat Sink */}
                  <rect x="135" y="-70" width="120" height="140" fill="#b45309" stroke="#f97316" strokeWidth="1.5" />
                  {/* Fan */}
                  <rect x="270" y="-60" width="35" height="120" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="287" y="5" fill="#94a3b8" fontSize="9" textAnchor="middle">FAN</text>
                  {/* USB / DC 12V Connectors */}
                  <rect x="380" y="-25" width="25" height="50" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />

                  {showDimensions && (
                    <g>
                      <line x1="0" y1="120" x2="80" y2="120" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                      <text x="40" y="135" fill="#38bdf8" fontSize="9" textAnchor="middle">17.5 mm BACKFOCUS</text>
                    </g>
                  )}
                </g>
              )}

              {/* 8. TOP VIEW */}
              {activeDrawing === 'top-view' && (
                <g transform="translate(80, 290)">
                  <rect x="70" y="-50" width="60" height="100" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.5" />
                  <rect x="130" y="-45" width="520" height="90" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="240" y="-48" width="30" height="96" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="460" y="-48" width="30" height="96" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="650" y="-48" width="90" height="96" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Flip mirror selector knob on side (+Y in top view) */}
                  <circle cx="695" cy="55" r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  <rect x="740" y="-44" width="85" height="88" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                  {showCenterlines && (
                    <line x1="40" y1="0" x2="850" y2="0" stroke="#06b6d4" strokeWidth="1" strokeDasharray="10,5" />
                  )}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Bill of Materials (BOM) & Drawing Notes Sidebar */}
        <div style={{
          width: '320px',
          height: '100%',
          background: 'rgba(11, 17, 33, 0.88)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          overflowY: 'auto'
        }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Drawing Information
            </div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {drawingTabs.find(t => t.id === activeDrawing)?.label}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              Precision vector engineering drawing adhering to optical ISO-10110 standards with interactive dimension tolerances and ray paths.
            </p>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }} />

          {/* Component Bill of Materials Legend */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Bill of Materials (BOM) Legend
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { tag: '1', name: 'Dielectric Energy Rejection Filter (ERF)', spec: 'Ø95 mm' },
                { tag: '2', name: 'Objective Doublet (FCD100 / Lanthanum)', spec: 'Ø90 mm f=720mm' },
                { tag: '3', name: 'Knife-Edge Glare Baffles (3 Stages)', spec: 'Brass 0.8 mm' },
                { tag: '4', name: 'Adjustable Steering Gimbal Lens', spec: '±5.0° Tilting' },
                { tag: '5', name: 'Dielectric 90° Flip Mirror Substrate', spec: 'λ/10 Flat' },
                { tag: '6', name: 'Scientific CMOS / DSLR Imaging Camera', spec: 'Coated Sensor' },
                { tag: '7', name: 'Diffraction Grating Spectrometer', spec: '1800 lines/mm' },
              ].map(item => (
                <div
                  key={item.tag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    fontSize: '0.71875rem',
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'rgba(6, 182, 212, 0.2)',
                    color: 'var(--accent-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}>
                    {item.tag}
                  </span>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.65625rem' }}>
                      {item.spec}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }} />

          {/* Provisional Dimension Warning Note */}
          <div style={{
            padding: '0.65rem',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.71875rem',
            color: 'var(--accent-amber)',
            lineHeight: 1.5,
          }}>
            <strong>CAD NOTE:</strong> Dimensions labeled in amber with <code>[PROV]</code> indicate unverified provisional values subject to final mechanical tolerance sign-off.
          </div>
        </div>
      </div>
    </div>
  );
};
