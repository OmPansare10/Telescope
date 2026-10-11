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
    viewMode
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

  // Cutaway angle: if cutaway mode, open 110 degrees of the shell along top-side
  const thetaLength = viewMode === 'cutaway' ? Math.PI * 1.35 : Math.PI * 2;
  const thetaStart = viewMode === 'cutaway' ? Math.PI * 0.35 : 0;

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

      {/* 5. CNC Dual Tube Rings */}
      {isComponentVisible('tube-rings') && (
        <group position={[0, 0.02 + explodedOffset * 0.6, 0]}>
          {/* Front Ring at Z = 1.8 */}
          <group position={[0, 0, 1.8]}>
            <mesh
              onClick={(e) => handleClick(e, 'tube-rings')}
              onPointerOver={(e) => handlePointerOver(e, 'tube-rings')}
              onPointerOut={handlePointerOut}
              material={materials.machinedAluminum}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.61, 0.06, 16, 48]} />
            </mesh>
            {/* Top quick-release thumbscrew */}
            <mesh position={[0, 0.68, 0]} material={materials.brass}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
            </mesh>
          </group>
          {/* Rear Ring at Z = 0.4 */}
          <group position={[0, 0, 0.4]}>
            <mesh
              onClick={(e) => handleClick(e, 'tube-rings')}
              onPointerOver={(e) => handlePointerOver(e, 'tube-rings')}
              onPointerOut={handlePointerOut}
              material={materials.machinedAluminum}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.61, 0.06, 16, 48]} />
            </mesh>
            {/* Top quick-release thumbscrew */}
            <mesh position={[0, 0.68, 0]} material={materials.brass}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
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
