# SOLARIS-90: Interactive 3D Solar Refractor Telescope Engineering Simulator

A professional, comprehensive, interactive 3D engineering simulator for a high-precision solar refractor telescope built with **React**, **TypeScript**, **Three.js**, **React Three Fiber**, **@react-three/drei**, and **SVG CAD**.

The application models the telescope's external mechanical housing and internal optical train: adjustable optical steering mechanism, apochromatic objective doublet, internal knife-edge glare baffles, switching flip-mirror cube, scientific cooled CMOS / DSLR camera subsystems, 1800 lines/mm holographic spectroscopy module, and alt-azimuth mount with stainless steel tripod.

---

## 1. Quick Start & Startup Commands

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+)

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (Vite)
npm run dev

# 3. Open in browser
# Navigate to http://localhost:5173/
```

### Production Build
```bash
# Build production bundle with TypeScript validation
npm run build

# Preview production build locally
npm run preview
```

---

## 2. System Architecture & Tech Stack

- **Core**: React 19 + TypeScript + Vite
- **3D Visualization**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Materials**: Physically Based Rendering (PBR) metallic/roughness shaders + Procedural CAD wireframe overlays
- **2D Engineering Drawings**: Interactive SVG vector blueprints adhering to ISO-10110 standards
- **Icons**: Lucide React
- **Design System**: Vanilla CSS with dark navy & graphite palette (`#070b14`), restrained cyan/teal (`#06b6d4`) and solar amber (`#f59e0b`) accents.

---

## 3. Web Application Navigation Sections

1. **Overview**: Executive optical summary, live hero 3D preview, key instrument benchmarks, and quick-launch cards to all engineering modules.
2. **3D Telescope Explorer**: Full interactive 3D viewport with OrbitControls, hierarchical component tree, right properties inspector, bottom control bar, and camera presets (ISO, Front, Side, Top, Rear).
3. **Internal Structure**: Stepped optical train explorer focusing on the apochromatic doublet cell, precision 2.4 mm air-gap ring, and 3-stage knife-edge glare baffles (150 mm, 320 mm, and 470 mm behind objective).
4. **Exploded Assembly**: Kinematic breakout simulator with an interactive distance slider (0% to 100%), preset shortcuts, and subassembly isolation filters (Entire Assembly, Camera Alone, Steering Mechanism Alone, Spectroscopy Alone).
5. **Camera Explorer**: Side-by-side engineering comparison between Cooled Scientific CMOS astronomy cameras (lucky imaging @ 120 fps, Peltier cooling to $\Delta T = -35^\circ\text{C}$, 17.5 mm backfocus) and Full-Frame DSLR camera bodies (55.0 mm backfocus, mechanical focal plane shutter, astro-modified H-alpha filter).
6. **2D Engineering Drawings**: 9 high-precision interactive SVG engineering blueprints with toggles for dimension lines, callout tags, optical rays, centerlines, SVG download, and print output:
   - Longitudinal Cutaway Section
   - Side Elevation
   - Front Elevation
   - Top View
   - Optical Ray Layout
   - Exploded Assembly Drawing
   - Camera Cross-Section
   - Steering-Lens Mechanism Detail
   - Spectroscopy Optical Layout
7. **Optical Ray Simulation**: Geometrically consistent paraxial ray trace simulation tracing parallel solar wave bundles, dynamic deflection by the steering lens ($\delta \approx (n-1)\theta$), flip-mirror routing (0° vs 90°), live sensor spot displacement, and photon packet animations.
8. **Spectroscopy Module**: High-resolution Czerny-Turner/Littrow spectrograph simulation with bilateral 25 µm entrance slit, collimator doublet, 1800 lines/mm holographic grating, Fraunhofer line catalog (H-alpha, H-beta, Na D doublet, Mg b, Ca II H&K), and Doppler plasma velocity shift simulation (-50 km/s to +50 km/s).
9. **Technical Specifications**: Parametric optical calculator with live recalculation of focal ratio ($f/8$), Dawes' limit, Rayleigh criterion, Airy disk diameter, image scale, Nyquist sampling diagnostics, and JSON export.

---

## 4. Master 9-Configuration Matrix

The application supports all 9 independent combinations of internal detail levels and camera architectures:

| # | Detail Level | Camera Subsystem | Description |
|---|---|---|---|
| 1 | **Engineering-level 3D** | **Scientific CMOS** | High-contrast mechanical linkages, push-pull screws, and cooled CMOS sensor. |
| 2 | **Engineering-level 3D** | **DSLR Camera** | Mechanical bayonet T-ring, shutter blades, and DSLR chassis architecture. |
| 3 | **Engineering-level 3D** | **Both Cameras** | Side-by-side comparison highlighting distinct sensor backfocus dimensions. |
| 4 | **Photorealistic 3D** | **Scientific CMOS** | PBR metallic finishes, anti-reflective purple lens coatings, and copper heat pipes. |
| 5 | **Photorealistic 3D** | **DSLR Camera** | Magnesium alloy textured body, optical glass reflections, and shadow rendering. |
| 6 | **Photorealistic 3D** | **Both Cameras** | Dual photorealistic camera setup comparing scientific body vs DSLR housing. |
| 7 | **CAD-level Assembly** | **Scientific CMOS** | Toleranced CAD geometry with wireframe overlays, centerlines, and provisional tags. |
| 8 | **CAD-level Assembly** | **DSLR Camera** | Toleranced CAD geometry with bayonet flange clearances and sensor plane callouts. |
| 9 | **CAD-level Assembly** | **Both Cameras** | CAD assembly comparison showing mechanical flange dimensions and optical axis alignment. |

---

## 5. Adjustable Optical Steering Mechanism

The adjustable optical steering mechanism allows fine solar pointing and tracking adjustments without mechanical vibration from tube motion:
- **Curved Meniscus Lens**: N-BK7 glass with broadband anti-reflection coating.
- **Kinematic Gimbal Cradle**: Aluminum cradle with Delrin lens buffer and horizontal pivot shaft on dual ABEC-7 miniature ball bearings.
- **Differential Micrometer Actuator**: 0.05° per revolution pitch with anti-backlash spring preload.
- **Interactive Slider**: Real-time adjustment from **-5.0° to +5.0°**.
- **Live Optical Response**: Adjusting the tilt physically rotates the 3D lens cradle, deflects the ray bundle in 3D, and updates the focused solar spot diagram on the camera sensor plane in real time.

---

## 6. Known Limitations & Optical Disclaimers

1. **Paraxial Ray Simplification**: The optical ray tracing component simulates paraxial wavefront convergence and illustrative refraction angles. It provides an intuitive engineering visualizer and does not replace full wave-aberration tolerance analysis software (such as Zemax OpticStudio or Code V).
2. **Provisional CAD Dimensions**: Unspecified commercial camera internal traces and lens air-gap spacers are designated with `[PROV]` tags. Values reflect standard ISO-10110 optical conventions and are subject to final mechanical tolerance sign-offs.
3. **Procedural 3D Geometry**: The application generates all 3D geometries procedurally using Three.js buffer geometries to ensure zero external model download latency and standalone portability.
