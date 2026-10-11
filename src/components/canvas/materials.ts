import * as THREE from 'three';
import { DetailLevel } from '../../types/telescope';

export interface MaterialPalette {
  tubeOuter: THREE.Material;
  tubeInner: THREE.Material;
  anodizedBlack: THREE.Material;
  anodizedBlue: THREE.Material;
  magnesiumBody: THREE.Material;
  machinedAluminum: THREE.Material;
  brass: THREE.Material;
  stainlessSteel: THREE.Material;
  copper: THREE.Material;
  glassCrown: THREE.Material;
  glassFlint: THREE.Material;
  filterSolarERF: THREE.Material;
  mirrorDielectric: THREE.Material;
  sensorSilicon: THREE.Material;
  pcbGreen: THREE.Material;
  gratingHolographic: THREE.Material;
  cadWireframe: THREE.Material;
}

export function createTelescopeMaterials(
  detailLevel: DetailLevel, 
  viewMode: 'solid' | 'transparent' | 'cutaway',
  showWireframe: boolean = false
): MaterialPalette {
  const isCad = detailLevel === 'cad';
  const isPhoto = detailLevel === 'photorealistic';
  const isEng = detailLevel === 'engineering';

  const tubeOpacity = viewMode === 'transparent' ? 0.22 : 1.0;
  const tubeTransparent = viewMode === 'transparent';

  // 1. Tube Outer Shell
  const tubeOuter = new THREE.MeshStandardMaterial({
    color: isCad ? 0xd1d5db : isPhoto ? 0x0f172a : 0x1e293b,
    metalness: isCad ? 0.8 : isPhoto ? 0.92 : 0.6,
    roughness: isCad ? 0.3 : isPhoto ? 0.25 : 0.45,
    transparent: tubeTransparent,
    opacity: tubeOpacity,
    wireframe: isCad && showWireframe,
  });

  // 2. Tube Inner Flocking (anti-reflective matte black)
  const tubeInner = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    metalness: 0.05,
    roughness: 0.95,
    side: THREE.BackSide,
  });

  // 3. Anodized Black (housings, cell, rings)
  const anodizedBlack = new THREE.MeshStandardMaterial({
    color: isCad ? 0x374151 : isPhoto ? 0x18181b : 0x27272a,
    metalness: isCad ? 0.6 : isPhoto ? 0.85 : 0.5,
    roughness: isCad ? 0.4 : isPhoto ? 0.35 : 0.5,
    wireframe: isCad && showWireframe,
  });

  // 4. Anodized Deep Blue (Scientific CMOS body)
  const anodizedBlue = new THREE.MeshStandardMaterial({
    color: isCad ? 0x60a5fa : isPhoto ? 0x1d4ed8 : 0x2563eb,
    metalness: isCad ? 0.7 : isPhoto ? 0.88 : 0.6,
    roughness: isCad ? 0.3 : isPhoto ? 0.28 : 0.4,
    wireframe: isCad && showWireframe,
  });

  // 5. Magnesium Body (DSLR camera body)
  const magnesiumBody = new THREE.MeshStandardMaterial({
    color: isCad ? 0x4b5563 : isPhoto ? 0x262626 : 0x3f3f46,
    metalness: isCad ? 0.5 : isPhoto ? 0.7 : 0.4,
    roughness: isCad ? 0.5 : isPhoto ? 0.65 : 0.55,
  });

  // 6. Machined Aluminum (flanges, rails, spacers)
  const machinedAluminum = new THREE.MeshStandardMaterial({
    color: isCad ? 0xe5e7eb : isPhoto ? 0xd4d4d8 : 0xa1a1aa,
    metalness: isCad ? 0.85 : isPhoto ? 0.92 : 0.75,
    roughness: isCad ? 0.25 : isPhoto ? 0.22 : 0.35,
  });

  // 7. Brass (worm gears, thumbscrews, spacers)
  const brass = new THREE.MeshStandardMaterial({
    color: isCad ? 0xfcd34d : isPhoto ? 0xd97706 : 0xf59e0b,
    metalness: isCad ? 0.8 : isPhoto ? 0.85 : 0.7,
    roughness: 0.28,
  });

  // 8. Stainless Steel (shafts, screws, legs)
  const stainlessSteel = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.95,
    roughness: 0.18,
  });

  // 9. Copper (Peltier heat pipes)
  const copper = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.9,
    roughness: 0.25,
  });

  // 10. Crown Lens Glass (BK7 / FCD100 Extra-Low Dispersion)
  const glassCrown = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    metalness: 0.05,
    roughness: 0.05,
    transmission: 0.92,
    thickness: 1.2,
    ior: 1.49,
    transparent: true,
    opacity: 0.82,
    reflectivity: isPhoto ? 0.9 : 0.6,
  });

  // 11. Flint Lens Glass (Lanthanum flint)
  const glassFlint = new THREE.MeshPhysicalMaterial({
    color: 0xdbeafe,
    metalness: 0.05,
    roughness: 0.05,
    transmission: 0.90,
    thickness: 1.0,
    ior: 1.62,
    transparent: true,
    opacity: 0.80,
  });

  // 12. Dielectric Solar ERF Filter (Deep red reflective coating)
  const filterSolarERF = new THREE.MeshPhysicalMaterial({
    color: 0x991b1b,
    metalness: 0.3,
    roughness: 0.1,
    transmission: 0.45,
    thickness: 1.5,
    ior: 1.55,
    transparent: true,
    opacity: 0.88,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  // 13. Dielectric Flip Mirror (Gold / Enhanced Silver 99.4% reflection)
  const mirrorDielectric = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.98,
    roughness: 0.04,
  });

  // 14. Silicon CMOS Sensor (iridescent die with microscopic circuitry)
  const sensorSilicon = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.95,
    roughness: 0.15,
  });

  // 15. PCB Green
  const pcbGreen = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    metalness: 0.3,
    roughness: 0.6,
  });

  // 16. Holographic Diffraction Grating (multi-spectral iridescent shine)
  const gratingHolographic = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.95,
    roughness: 0.1,
  });

  // 17. CAD Wireframe overlay
  const cadWireframe = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
  });

  return {
    tubeOuter,
    tubeInner,
    anodizedBlack,
    anodizedBlue,
    magnesiumBody,
    machinedAluminum,
    brass,
    stainlessSteel,
    copper,
    glassCrown,
    glassFlint,
    filterSolarERF,
    mirrorDielectric,
    sensorSilicon,
    pcbGreen,
    gratingHolographic,
    cadWireframe,
  };
}
