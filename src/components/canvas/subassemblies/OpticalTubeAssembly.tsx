import React from 'react';
import * as THREE from 'three';
import { MaterialPalette } from '../materials';
import { useTelescope } from '../../../context/TelescopeContext';

interface SubassemblyProps {
  materials: MaterialPalette;
  explodedOffset: number;
}

export const OpticalTubeAssembly: React.FC<SubassemblyProps> = ({ materials, explodedOffset }) => {
  const { 
    selectedComponentId, 
    setSelectedComponentId, 
    hoveredComponentId, 
    setHoveredComponentId,
    isComponentVisible,
    viewMode,
    convexLensPosition
  } = useTelescope();

  const isSelected = (id: string) => selectedComponentId === id;
  const isHovered = (id: string) => hoveredComponentId === id;

  const handleClick = (e: any, id: string) => {
    e.stopPropagation();
    setSelectedComponentId(selectedComponentId === id ? null : id);
  };

  const handlePointerOver = (e: any, id: string) => {
    e.stopPropagation();
    setHoveredComponentId(id);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredComponentId(null);
  };

  // Tube length = 3.6 units, centered from Z = -0.5 to Z = +2.7, center at Z = 1.1
  const tubeCenterZ = 1.1;
  const tubeRadius = 0.58;
  const tubeLength = 3.4;

  // Cutaway angle: if cutaway mode, open 140 degrees facing the camera for clear internal view
  const thetaLength = viewMode === 'cutaway' ? Math.PI * 1.20 : Math.PI * 2;
  const thetaStart = viewMode === 'cutaway' ? Math.PI * 0.70 : 0;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Optical Tube Shell */}
      {isComponentVisible('optical-tube-shell') && (
        <group position={[0, 0, tubeCenterZ]}>
          <mesh
            onClick={(e) => handleClick(e, 'optical-tube-shell')}
            onPointerOver={(e) => handlePointerOver(e, 'optical-tube-shell')}
            onPointerOut={handlePointerOut}
            material={materials.tubeOuter}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry 
              args={[tubeRadius, tubeRadius, tubeLength, 48, 1, true, thetaStart, thetaLength]} 
            />
          </mesh>
          {/* Inner flocked lining */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.tubeInner}>
            <cylinderGeometry 
              args={[tubeRadius - 0.015, tubeRadius - 0.015, tubeLength - 0.02, 48, 1, true, thetaStart, thetaLength]} 
            />
          </mesh>
          {(isSelected('optical-tube-shell') || isHovered('optical-tube-shell')) && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[tubeRadius + 0.01, tubeRadius + 0.01, tubeLength + 0.02, 32, 1, true]} />
              <meshBasicMaterial color={isSelected('optical-tube-shell') ? '#06b6d4' : '#f59e0b'} wireframe />
            </mesh>
          )}
        </group>
      )}

      {/* 2. Internal Knife-Edge Baffle #1 (Z ~ 2.0) */}
      {isComponentVisible('baffle-ring-1') && (
        <group position={[0, 0, 2.0 - explodedOffset * 0.4]}>
          <mesh
            onClick={(e) => handleClick(e, 'baffle-ring-1')}
            onPointerOver={(e) => handlePointerOver(e, 'baffle-ring-1')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
            rotation={[Math.PI / 2, 0, 0]}
          >
            {/* Knife edge conical taper */}
            <cylinderGeometry args={[0.55, 0.40, 0.04, 36, 1, true]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.brass}>
            <ringGeometry args={[0.40, 0.56, 36]} />
          </mesh>
        </group>
      )}

      {/* 3. Internal Knife-Edge Baffle #2 (Z ~ 1.1) */}
      {isComponentVisible('baffle-ring-2') && (
        <group position={[0, 0, 1.1 - explodedOffset * 0.9]}>
          <mesh
            onClick={(e) => handleClick(e, 'baffle-ring-2')}
            onPointerOver={(e) => handlePointerOver(e, 'baffle-ring-2')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.55, 0.32, 0.04, 36, 1, true]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.brass}>
            <ringGeometry args={[0.32, 0.56, 36]} />
          </mesh>
        </group>
      )}

      {/* 4. Internal Knife-Edge Baffle #3 (Z ~ 0.2) */}
      {isComponentVisible('baffle-ring-3') && (
        <group position={[0, 0, 0.2 - explodedOffset * 1.4]}>
          <mesh
            onClick={(e) => handleClick(e, 'baffle-ring-3')}
            onPointerOver={(e) => handlePointerOver(e, 'baffle-ring-3')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.55, 0.24, 0.04, 36, 1, true]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.brass}>
            <ringGeometry args={[0.24, 0.56, 36]} />
          </mesh>
        </group>
      )}

      {/* 5. Precision Optical Elements: 
          - Ring 1 (Front): Vertical Achromatic Doublet Objective Lens
          - Ring 2 (Rear): 45° Convex Lens with Left/Right Linear Motion Track
          - External Tube Clamping Rings around Tube Outer Diameter
      */}

      {/* Internal Linear Slide Rails (Mounted along bottom of tube interior for movable 45° lens) */}
      <group position={[0, -0.42, 0.55]}>
        {/* Left stainless guide rod */}
        <mesh position={[-0.20, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.stainlessSteel}>
          <cylinderGeometry args={[0.012, 0.012, 1.35, 16]} />
        </mesh>
        {/* Right stainless guide rod */}
        <mesh position={[0.20, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.stainlessSteel}>
          <cylinderGeometry args={[0.012, 0.012, 1.35, 16]} />
        </mesh>
        {/* Front mounting block */}
        <mesh position={[0, 0, 0.65]} material={materials.anodizedBlack}>
          <boxGeometry args={[0.46, 0.035, 0.06]} />
        </mesh>
        {/* Rear mounting block */}
        <mesh position={[0, 0, -0.65]} material={materials.anodizedBlack}>
          <boxGeometry args={[0.46, 0.035, 0.06]} />
        </mesh>
      </group>

      {/* RING 1: Vertical Achromatic Doublet Objective Lens (At Z = 1.8) */}
      {isComponentVisible('achromatic-doublet-ring') && (
        <group position={[0, 0, 1.8 - explodedOffset * 0.4]}>
          {/* Vertical Lens Cell Ring (rotation [0,0,0] so it stands upright perpendicular to optical Z-axis) */}
          <mesh
            onClick={(e) => handleClick(e, 'achromatic-doublet-ring')}
            onPointerOver={(e) => handlePointerOver(e, 'achromatic-doublet-ring')}
            onPointerOut={handlePointerOut}
            material={materials.machinedAluminum}
            rotation={[0, 0, 0]}
          >
            {/* Outer toroidal precision ring standing vertically */}
            <torusGeometry args={[0.55, 0.042, 20, 64]} />
          </mesh>

          {/* Knurled retaining collar bezel */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.anodizedBlack}>
            <cylinderGeometry args={[0.555, 0.555, 0.07, 48, 1, true]} />
          </mesh>

          {/* Brass optical retaining threaded ring */}
          <mesh position={[0, 0, 0.032]} rotation={[0, 0, 0]} material={materials.brass}>
            <torusGeometry args={[0.52, 0.016, 16, 48]} />
          </mesh>

          {/* --- ACHROMATIC DOUBLET OPTICAL ELEMENTS --- */}
          {/* Element 1: Crown Glass (Positive low-dispersion convex lens, front face) */}
          <mesh
            position={[0, 0, 0.015]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.glassCrown}
          >
            <cylinderGeometry args={[0.49, 0.51, 0.035, 48]} />
          </mesh>

          {/* Element 2: Flint Glass (Negative high-dispersion concave mating lens, rear face) */}
          <mesh
            position={[0, 0, -0.018]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.glassFlint}
          >
            <cylinderGeometry args={[0.51, 0.485, 0.032, 48]} />
          </mesh>

          {/* Micro air-gap / optical cement boundary rim */}
          <mesh position={[0, 0, -0.002]} rotation={[Math.PI / 2, 0, 0]} material={materials.brass}>
            <ringGeometry args={[0.48, 0.51, 48]} />
          </mesh>

          {/* Top precision adjustment thumbscrew */}
          <mesh position={[0, 0.62, 0]} material={materials.brass}>
            <cylinderGeometry args={[0.035, 0.035, 0.07, 16]} />
          </mesh>

          {/* Highlight wireframe overlay if hovered / selected */}
          {(isSelected('achromatic-doublet-ring') || isHovered('achromatic-doublet-ring')) && (
            <mesh rotation={[0, 0, 0]}>
              <ringGeometry args={[0.49, 0.58, 48]} />
              <meshBasicMaterial color={isSelected('achromatic-doublet-ring') ? '#06b6d4' : '#f59e0b'} side={2} wireframe />
            </mesh>
          )}
        </group>
      )}

      {/* RING 2: 45° Convex Lens with Movable Left-Right Linear Mechanism */}
      {isComponentVisible('movable-convex-lens-45') && (
        <group position={[0, 0, 0.5 + convexLensPosition - explodedOffset * 0.8]}>
          {/* Carriage runner block riding along the dual stainless steel slide rails */}
          <group position={[0, -0.42, 0]}>
            {/* CNC slide carriage block */}
            <mesh material={materials.anodizedBlack}>
              <boxGeometry args={[0.44, 0.045, 0.16]} />
            </mesh>
            {/* Dual brass linear sleeve bushings */}
            <mesh position={[-0.20, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.brass}>
              <cylinderGeometry args={[0.022, 0.022, 0.17, 16]} />
            </mesh>
            <mesh position={[0.20, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.brass}>
              <cylinderGeometry args={[0.022, 0.022, 0.17, 16]} />
            </mesh>
            {/* Stainless linear locking thumb-clamp */}
            <mesh position={[0.24, 0.03, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.stainlessSteel}>
              <cylinderGeometry args={[0.015, 0.015, 0.05, 12]} />
            </mesh>
          </group>

          {/* Upright mounting riser bracket to 45° ring */}
          <mesh position={[0, -0.36, 0]} material={materials.machinedAluminum}>
            <boxGeometry args={[0.16, 0.09, 0.12]} />
          </mesh>

          {/* --- 45-DEGREE TILTED GIMBAL RING & CONVEX LENS ASSEMBLY --- */}
          <group rotation={[Math.PI / 4, 0, 0]}>
            {/* 45° Angled Circular Carrier Ring */}
            <mesh
              onClick={(e) => handleClick(e, 'movable-convex-lens-45')}
              onPointerOver={(e) => handlePointerOver(e, 'movable-convex-lens-45')}
              onPointerOut={handlePointerOut}
              material={materials.machinedAluminum}
              rotation={[0, 0, 0]}
            >
              <torusGeometry args={[0.52, 0.042, 20, 64]} />
            </mesh>

            {/* Chamfered 45° retaining bezel collar */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.anodizedBlack}>
              <cylinderGeometry args={[0.53, 0.53, 0.065, 48, 1, true]} />
            </mesh>

            {/* Knurled brass retaining ring */}
            <mesh position={[0, 0, 0.025]} rotation={[0, 0, 0]} material={materials.brass}>
              <torusGeometry args={[0.49, 0.014, 16, 48]} />
            </mesh>

            {/* --- CONVEX OPTICAL LENS --- */}
            {/* High-purity polished crown optical glass with convex curve */}
            <mesh
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.glassCrown}
            >
              {/* Biconvex lens geometry */}
              <cylinderGeometry args={[0.47, 0.47, 0.045, 48]} />
            </mesh>

            {/* Convex surface curve caps (front & rear convex curvature) */}
            <mesh position={[0, 0, 0.018]} rotation={[Math.PI / 2, 0, 0]} material={materials.glassCrown}>
              <sphereGeometry args={[0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.18]} />
            </mesh>
            <mesh position={[0, 0, -0.018]} rotation={[-Math.PI / 2, 0, 0]} material={materials.glassCrown}>
              <sphereGeometry args={[0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.18]} />
            </mesh>

            {/* Anti-reflective dielectric highlight edge */}
            <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]} material={materials.mirrorDielectric}>
              <ringGeometry args={[0.46, 0.47, 48]} />
            </mesh>

            {/* Lateral adjustment micrometer knob */}
            <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.brass}>
              <cylinderGeometry args={[0.03, 0.03, 0.06, 16]} />
            </mesh>

            {/* Highlight wireframe overlay if hovered / selected */}
            {(isSelected('movable-convex-lens-45') || isHovered('movable-convex-lens-45')) && (
              <mesh rotation={[0, 0, 0]}>
                <ringGeometry args={[0.46, 0.55, 48]} />
                <meshBasicMaterial color={isSelected('movable-convex-lens-45') ? '#06b6d4' : '#f59e0b'} side={2} wireframe />
              </mesh>
            )}
          </group>
        </group>
      )}

      {/* External Tube Mounting Clamp Rings (Encircling outer tube in solid/transparent view) */}
      {isComponentVisible('tube-rings') && viewMode !== 'cutaway' && (
        <group position={[0, 0, 0]}>
          {/* Front Outer Tube Ring (Z = 1.9) */}
          <group position={[0, 0.02 + explodedOffset * 0.6, 1.9]}>
            <mesh
              onClick={(e) => handleClick(e, 'tube-rings')}
              onPointerOver={(e) => handlePointerOver(e, 'tube-rings')}
              onPointerOut={handlePointerOut}
              material={materials.machinedAluminum}
              rotation={[0, 0, 0]}
            >
              <torusGeometry args={[0.61, 0.038, 16, 48]} />
            </mesh>
            {/* Top quick-release thumbscrew */}
            <mesh position={[0, 0.66, 0]} material={materials.brass}>
              <cylinderGeometry args={[0.038, 0.038, 0.08, 16]} />
            </mesh>
            {/* Bottom dovetail mounting foot */}
            <mesh position={[0, -0.63, 0]} material={materials.anodizedBlack}>
              <boxGeometry args={[0.16, 0.07, 0.09]} />
            </mesh>
          </group>

          {/* Rear Outer Tube Ring (Z = 0.3) */}
          <group position={[0, 0.02 + explodedOffset * 0.6, 0.3]}>
            <mesh
              onClick={(e) => handleClick(e, 'tube-rings')}
              onPointerOver={(e) => handlePointerOver(e, 'tube-rings')}
              onPointerOut={handlePointerOut}
              material={materials.machinedAluminum}
              rotation={[0, 0, 0]}
            >
              <torusGeometry args={[0.61, 0.038, 16, 48]} />
            </mesh>
            {/* Top quick-release thumbscrew */}
            <mesh position={[0, 0.66, 0]} material={materials.brass}>
              <cylinderGeometry args={[0.038, 0.038, 0.08, 16]} />
            </mesh>
            {/* Bottom dovetail mounting foot */}
            <mesh position={[0, -0.63, 0]} material={materials.anodizedBlack}>
              <boxGeometry args={[0.16, 0.07, 0.09]} />
            </mesh>
          </group>
        </group>
      )}

      {/* 6. Dovetail Mounting Plate (Bottom at Y = -0.70) */}
      {isComponentVisible('dovetail-plate') && (
        <group position={[0, -0.70 - explodedOffset * 0.8, 1.1]}>
          <mesh
            onClick={(e) => handleClick(e, 'dovetail-plate')}
            onPointerOver={(e) => handlePointerOver(e, 'dovetail-plate')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
          >
            {/* Vixen profile bar */}
            <boxGeometry args={[0.22, 0.07, 1.8]} />
          </mesh>
          {/* Stainless safety stop screws */}
          <mesh position={[0, 0.03, 0.85]} material={materials.stainlessSteel}>
            <cylinderGeometry args={[0.015, 0.015, 0.03, 12]} />
          </mesh>
          <mesh position={[0, 0.03, -0.85]} material={materials.stainlessSteel}>
            <cylinderGeometry args={[0.015, 0.015, 0.03, 12]} />
          </mesh>
        </group>
      )}

      {/* 7. Rear Structural Mounting Flange (Z ~ -0.6) */}
      {isComponentVisible('tube-rear-flange') && (
        <group position={[0, 0, -0.6 - explodedOffset * 0.3]}>
          <mesh
            onClick={(e) => handleClick(e, 'tube-rear-flange')}
            onPointerOver={(e) => handlePointerOver(e, 'tube-rear-flange')}
            onPointerOut={handlePointerOut}
            material={materials.machinedAluminum}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.60, 0.60, 0.12, 48, 1, true]} />
          </mesh>
          {/* Internal retaining collar */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.anodizedBlack}>
            <torusGeometry args={[0.55, 0.04, 16, 48]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
