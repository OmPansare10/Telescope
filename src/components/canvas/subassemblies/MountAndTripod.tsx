import React from 'react';
import * as THREE from 'three';
import { MaterialPalette } from '../materials';
import { useTelescope } from '../../../context/TelescopeContext';

interface SubassemblyProps {
  materials: MaterialPalette;
  explodedOffset: number;
}

export const MountAndTripod: React.FC<SubassemblyProps> = ({ materials, explodedOffset }) => {
  const { 
    selectedComponentId, 
    setSelectedComponentId, 
    hoveredComponentId, 
    setHoveredComponentId,
    isComponentVisible
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

  // Base position centered under dovetail (Y ~ -0.9, Z ~ 1.1)
  const baseY = -0.9;
  const baseZ = 1.1;

  return (
    <group position={[0, baseY, baseZ]}>
      {/* 1. Dovetail Clamp Saddle */}
      {isComponentVisible('mount-saddle') && (
        <group position={[0, -explodedOffset * 0.4, 0]}>
          <mesh
            onClick={(e) => handleClick(e, 'mount-saddle')}
            onPointerOver={(e) => handlePointerOver(e, 'mount-saddle')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
          >
            <boxGeometry args={[0.32, 0.12, 0.85]} />
          </mesh>
          {/* Brass clamp knobs */}
          <mesh position={[0.20, 0, 0.25]} rotation={[0, 0, Math.PI / 2]} material={materials.brass}>
            <cylinderGeometry args={[0.06, 0.06, 0.10, 16]} />
          </mesh>
          <mesh position={[0.20, 0, -0.25]} rotation={[0, 0, Math.PI / 2]} material={materials.brass}>
            <cylinderGeometry args={[0.06, 0.06, 0.10, 16]} />
          </mesh>
        </group>
      )}

      {/* 2. Altitude Worm Gear Drive Housing */}
      {isComponentVisible('mount-altitude-axis') && (
        <group position={[0, -0.22 - explodedOffset * 0.7, 0]}>
          <mesh
            onClick={(e) => handleClick(e, 'mount-altitude-axis')}
            onPointerOver={(e) => handlePointerOver(e, 'mount-altitude-axis')}
            onPointerOut={handlePointerOut}
            material={materials.machinedAluminum}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.26, 0.26, 0.38, 32]} />
          </mesh>
          {/* Setting circle scale ring */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.anodizedBlack}>
            <torusGeometry args={[0.27, 0.02, 12, 32]} />
          </mesh>
          {/* Altitude slow-motion clutch knob */}
          <mesh position={[-0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.brass}>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
          </mesh>
        </group>
      )}

      {/* 3. Azimuth Rotary Base & Pier Adapter */}
      {isComponentVisible('mount-azimuth-axis') && (
        <group position={[0, -0.52 - explodedOffset * 1.0, 0]}>
          <mesh
            onClick={(e) => handleClick(e, 'mount-azimuth-axis')}
            onPointerOver={(e) => handlePointerOver(e, 'mount-azimuth-axis')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
          >
            <cylinderGeometry args={[0.34, 0.38, 0.26, 32]} />
          </mesh>
          {/* Pier extension flange */}
          <mesh position={[0, -0.16, 0]} material={materials.machinedAluminum}>
            <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
          </mesh>
          {/* Bubble level */}
          <mesh position={[0.26, 0.10, 0.12]}>
            <cylinderGeometry args={[0.03, 0.03, 0.015, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      )}

      {/* 4. Triangular Accessory Tray & Spreader Clamp */}
      {isComponentVisible('tripod-spreader') && (
        <group position={[0, -1.35 - explodedOffset * 1.3, 0]}>
          <mesh
            onClick={(e) => handleClick(e, 'tripod-spreader')}
            onPointerOver={(e) => handlePointerOver(e, 'tripod-spreader')}
            onPointerOut={handlePointerOut}
            material={materials.machinedAluminum}
          >
            {/* Triangular tray profile */}
            <cylinderGeometry args={[0.62, 0.62, 0.04, 3]} />
          </mesh>
          {/* Central locking tension star knob */}
          <mesh position={[0, 0.06, 0]} material={materials.brass}>
            <cylinderGeometry args={[0.09, 0.09, 0.06, 6]} />
          </mesh>
        </group>
      )}

      {/* 5. Dual Stainless Steel Tripod Legs */}
      {isComponentVisible('tripod-legs') && (
        <group position={[0, -0.70 - explodedOffset * 1.6, 0]}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => {
            const legSpread = 0.45;
            const legLen = 2.4;
            const legTilt = 0.28; // rad outward splay
            return (
              <group key={idx} rotation={[0, angle, 0]}>
                <group position={[legSpread, 0, 0]} rotation={[0, 0, -legTilt]}>
                  {/* Upper stainless leg tube */}
                  <mesh
                    onClick={(e) => handleClick(e, 'tripod-legs')}
                    onPointerOver={(e) => handlePointerOver(e, 'tripod-legs')}
                    onPointerOut={handlePointerOut}
                    position={[0, -legLen * 0.35, 0]}
                    material={materials.stainlessSteel}
                  >
                    <cylinderGeometry args={[0.045, 0.045, legLen * 0.7, 16]} />
                  </mesh>
                  {/* Quick-lock collar clamp */}
                  <mesh position={[0, -legLen * 0.7, 0]} material={materials.anodizedBlack}>
                    <cylinderGeometry args={[0.055, 0.055, 0.12, 16]} />
                  </mesh>
                  {/* Lower extendable inner tube */}
                  <mesh position={[0, -legLen * 0.95, 0]} material={materials.machinedAluminum}>
                    <cylinderGeometry args={[0.038, 0.038, legLen * 0.5, 16]} />
                  </mesh>
                  {/* Rubber / carbide ground foot */}
                  <mesh position={[0, -legLen * 1.2, 0]} material={materials.tubeInner}>
                    <coneGeometry args={[0.05, 0.12, 16]} />
                  </mesh>
                </group>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
