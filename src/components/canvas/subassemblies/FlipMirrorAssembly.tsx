import React from 'react';
import * as THREE from 'three';
import { MaterialPalette } from '../materials';
import { useTelescope } from '../../../context/TelescopeContext';

interface SubassemblyProps {
  materials: MaterialPalette;
  explodedOffset: number;
}

export const FlipMirrorAssembly: React.FC<SubassemblyProps> = ({ materials, explodedOffset }) => {
  const { 
    selectedComponentId, 
    setSelectedComponentId, 
    hoveredComponentId, 
    setHoveredComponentId,
    isComponentVisible,
    flipMirrorPosition,
    toggleFlipMirror
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

  // Base position for flip-mirror switching cube along Z-axis (Z ~ -1.35)
  const baseZ = -1.35;
  
  // Mirror angle:
  // In 'imaging' mode: mirror is flipped up/aside (parallel to beam, rotation ~ 0 rad or retracted)
  // In 'spectroscopy' mode: mirror is tilted at exactly 45 degrees (-Math.PI / 4)
  const isSpec = flipMirrorPosition === 'spectroscopy';
  const mirrorAngle = isSpec ? -Math.PI / 4 : -Math.PI * 0.05; // 45 deg vs folded away

  return (
    <group position={[0, 0, baseZ]}>
      {/* 1. Octagonal Switching Cube Housing */}
      {isComponentVisible('flip-mirror-body') && (
        <group position={[0, 0, -explodedOffset * 0.4]}>
          <mesh
            onClick={(e) => handleClick(e, 'flip-mirror-body')}
            onPointerOver={(e) => handlePointerOver(e, 'flip-mirror-body')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
          >
            {/* Octagonal cube body */}
            <cylinderGeometry args={[0.50, 0.50, 0.75, 8]} />
          </mesh>
          {/* Top port collar for spectroscopy module (+Y direction) */}
          <mesh position={[0, 0.42, 0]} material={materials.machinedAluminum}>
            <cylinderGeometry args={[0.26, 0.28, 0.12, 24]} />
          </mesh>
          {/* Rear port collar for camera (-Z direction) */}
          <mesh position={[0, 0, -0.42]} rotation={[Math.PI / 2, 0, 0]} material={materials.machinedAluminum}>
            <cylinderGeometry args={[0.26, 0.28, 0.12, 24]} />
          </mesh>
          {/* Internal light trap tube */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.tubeInner}>
            <cylinderGeometry args={[0.24, 0.24, 0.76, 24, 1, true]} />
          </mesh>
        </group>
      )}

      {/* DYNAMIC ROTATING MIRROR SUBASSEMBLY */}
      <group position={[0, 0, 0]} rotation={[mirrorAngle, 0, 0]}>
        {/* 2. Kinematic Mirror Cradle & Arm */}
        {isComponentVisible('flip-mirror-holder') && (
          <group position={[0, explodedOffset * 0.25, 0]}>
            <mesh
              onClick={(e) => handleClick(e, 'flip-mirror-holder')}
              onPointerOver={(e) => handlePointerOver(e, 'flip-mirror-holder')}
              onPointerOut={handlePointerOut}
              material={materials.machinedAluminum}
            >
              {/* Elliptical cradle backing */}
              <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
            </mesh>
            {/* Hinge bracket */}
            <mesh position={[0, 0.18, 0]} material={materials.anodizedBlack}>
              <boxGeometry args={[0.16, 0.06, 0.06]} />
            </mesh>
          </group>
        )}

        {/* 3. Dielectric Flip Mirror Substrate & 99.4% Reflective Surface */}
        {isComponentVisible('flip-mirror-substrate') && (
          <group position={[0, explodedOffset * 0.35, 0.015]}>
            {/* Fused silica optical flat substrate */}
            <mesh
              onClick={(e) => handleClick(e, 'flip-mirror-substrate')}
              onPointerOver={(e) => handlePointerOver(e, 'flip-mirror-substrate')}
              onPointerOut={handlePointerOut}
              material={materials.glassCrown}
            >
              <cylinderGeometry args={[0.20, 0.20, 0.025, 32]} />
            </mesh>
            {/* Mirror front reflective dielectric face */}
            <mesh position={[0, 0.014, 0]} material={materials.mirrorDielectric}>
              <cylinderGeometry args={[0.195, 0.195, 0.005, 32]} />
            </mesh>
            {(isSelected('flip-mirror-substrate') || isHovered('flip-mirror-substrate')) && (
              <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.18, 0.20, 32]} />
                <meshBasicMaterial color={isSelected('flip-mirror-substrate') ? '#06b6d4' : '#f59e0b'} side={2} />
              </mesh>
            )}
          </group>
        )}
      </group>

      {/* 4. Mode Switch Lever & Indicator on side */}
      {isComponentVisible('flip-mirror-switch-lever') && (
        <group position={[-0.45 - explodedOffset * 0.4, 0, 0]} onClick={toggleFlipMirror}>
          {/* External hub */}
          <mesh
            onClick={(e) => handleClick(e, 'flip-mirror-switch-lever')}
            onPointerOver={(e) => handlePointerOver(e, 'flip-mirror-switch-lever')}
            onPointerOut={handlePointerOut}
            material={materials.machinedAluminum}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.07, 0.07, 0.08, 20]} />
          </mesh>
          {/* Lever handle with knurled red/teal ball */}
          <mesh position={[0, isSpec ? 0.14 : -0.14, 0]} material={materials.stainlessSteel}>
            <cylinderGeometry args={[0.02, 0.02, 0.24, 16]} />
          </mesh>
          <mesh position={[0, isSpec ? 0.26 : -0.26, 0]} material={materials.brass}>
            <sphereGeometry args={[0.04, 16, 16]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
