import React from 'react';
import * as THREE from 'three';
import { MaterialPalette } from '../materials';
import { useTelescope } from '../../../context/TelescopeContext';

interface SubassemblyProps {
  materials: MaterialPalette;
  explodedOffset: number;
}

export const SpectroscopyModule3D: React.FC<SubassemblyProps> = ({ materials, explodedOffset }) => {
  const { 
    selectedComponentId, 
    setSelectedComponentId, 
    hoveredComponentId, 
    setHoveredComponentId,
    isComponentVisible,
    parameters
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

  // Base position: located on the 90-degree port of the flip-mirror cube (Z = -1.35, Y starts around +0.45)
  const baseZ = -1.35;
  const baseY = 0.45;

  // Grating rotation angle in radians
  const gratingAngleRad = (parameters.gratingAngle * Math.PI) / 180;

  return (
    <group position={[0, baseY, baseZ]}>
      {/* 1. Precision Bilateral Adjustable Entrance Slit */}
      {isComponentVisible('spec-entrance-slit') && (
        <group position={[0, 0.12 + explodedOffset * 0.7, 0]}>
          {/* Slit mounting ring */}
          <mesh
            onClick={(e) => handleClick(e, 'spec-entrance-slit')}
            onPointerOver={(e) => handlePointerOver(e, 'spec-entrance-slit')}
            onPointerOut={handlePointerOut}
            material={materials.machinedAluminum}
          >
            <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
          </mesh>
          {/* Bilateral ground razor jaws forming 25um slit */}
          <mesh position={[-0.06, 0.021, 0]} material={materials.stainlessSteel}>
            <boxGeometry args={[0.08, 0.005, 0.14]} />
          </mesh>
          <mesh position={[0.06, 0.021, 0]} material={materials.stainlessSteel}>
            <boxGeometry args={[0.08, 0.005, 0.14]} />
          </mesh>
          {(isSelected('spec-entrance-slit') || isHovered('spec-entrance-slit')) && (
            <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.18, 0.22, 32]} />
              <meshBasicMaterial color={isSelected('spec-entrance-slit') ? '#06b6d4' : '#f59e0b'} side={2} />
            </mesh>
          )}
        </group>
      )}

      {/* 2. Achromatic Collimator Lens (f = 140 mm) */}
      {isComponentVisible('spec-collimator-lens') && (
        <group position={[0, 0.32 + explodedOffset * 1.0, 0]}>
          <mesh
            onClick={(e) => handleClick(e, 'spec-collimator-lens')}
            onPointerOver={(e) => handlePointerOver(e, 'spec-collimator-lens')}
            onPointerOut={handlePointerOut}
            material={materials.glassCrown}
          >
            <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
          </mesh>
          {/* Lens cell ring */}
          <mesh material={materials.anodizedBlack}>
            <torusGeometry args={[0.19, 0.02, 12, 32]} />
          </mesh>
        </group>
      )}

      {/* 3. Holographic Diffraction Grating & Rotary Turret */}
      <group position={[0, 0.58 + explodedOffset * 1.35, 0]}>
        {/* Grating Rotary Turret (vernier stage) */}
        {isComponentVisible('spec-grating-turret') && (
          <group position={[0, -0.04, 0]}>
            <mesh
              onClick={(e) => handleClick(e, 'spec-grating-turret')}
              onPointerOver={(e) => handlePointerOver(e, 'spec-grating-turret')}
              onPointerOut={handlePointerOut}
              material={materials.brass}
            >
              <cylinderGeometry args={[0.24, 0.24, 0.05, 32]} />
            </mesh>
            {/* Worm gear adjustment wheel */}
            <mesh position={[0.26, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.machinedAluminum}>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 20]} />
            </mesh>
          </group>
        )}

        {/* 4. Diffraction Grating (Rotates with gratingAngleRad around Y axis) */}
        {isComponentVisible('spec-diffraction-grating') && (
          <group rotation={[0, gratingAngleRad, 0]}>
            {/* Grating Mount Frame */}
            <mesh material={materials.anodizedBlack}>
              <boxGeometry args={[0.28, 0.02, 0.28]} />
            </mesh>
            {/* Holographic 1800 l/mm reflective surface */}
            <mesh
              onClick={(e) => handleClick(e, 'spec-diffraction-grating')}
              onPointerOver={(e) => handlePointerOver(e, 'spec-diffraction-grating')}
              onPointerOut={handlePointerOut}
              position={[0, 0.015, 0]}
              material={materials.gratingHolographic}
            >
              <boxGeometry args={[0.24, 0.005, 0.24]} />
            </mesh>
            {(isSelected('spec-diffraction-grating') || isHovered('spec-diffraction-grating')) && (
              <mesh position={[0, 0.02, 0]}>
                <planeGeometry args={[0.26, 0.26]} />
                <meshBasicMaterial color={isSelected('spec-diffraction-grating') ? '#06b6d4' : '#f59e0b'} wireframe />
              </mesh>
            )}
          </group>
        )}
      </group>

      {/* 5. Spectrograph Imaging Camera Lens */}
      {isComponentVisible('spec-camera-lens') && (
        <group position={[0, 0.85 + explodedOffset * 1.6, 0]}>
          <mesh
            onClick={(e) => handleClick(e, 'spec-camera-lens')}
            onPointerOver={(e) => handlePointerOver(e, 'spec-camera-lens')}
            onPointerOut={handlePointerOut}
            material={materials.glassFlint}
          >
            <cylinderGeometry args={[0.16, 0.16, 0.035, 32]} />
          </mesh>
          <mesh material={materials.anodizedBlack}>
            <torusGeometry args={[0.17, 0.02, 12, 32]} />
          </mesh>
        </group>
      )}

      {/* 6. Scientific Linear / Area Spectral Detector */}
      {isComponentVisible('spec-linear-detector') && (
        <group position={[0, 1.05 + explodedOffset * 1.9, 0]}>
          {/* Detector PCB board */}
          <mesh material={materials.pcbGreen}>
            <boxGeometry args={[0.32, 0.02, 0.16]} />
          </mesh>
          {/* Linear Sensor Die (high aspect ratio) */}
          <mesh
            onClick={(e) => handleClick(e, 'spec-linear-detector')}
            onPointerOver={(e) => handlePointerOver(e, 'spec-linear-detector')}
            onPointerOut={handlePointerOut}
            position={[0, -0.015, 0]}
            material={materials.sensorSilicon}
          >
            <boxGeometry args={[0.26, 0.005, 0.06]} />
          </mesh>
          {/* USB breakout connector */}
          <mesh position={[0.15, 0.04, 0]} material={materials.stainlessSteel}>
            <boxGeometry args={[0.06, 0.04, 0.08]} />
          </mesh>
        </group>
      )}

      {/* 7. Spectrometer Light-Tight Chassis Box Shell */}
      {isComponentVisible('spec-housing') && (
        <group position={[0, 0.58 + explodedOffset * 0.5, 0]}>
          <mesh
            onClick={(e) => handleClick(e, 'spec-housing')}
            onPointerOver={(e) => handlePointerOver(e, 'spec-housing')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
          >
            {/* Main box chassis */}
            <boxGeometry args={[0.70, 1.08, 0.56]} />
          </mesh>
          {/* Internal hollow beam cavity */}
          <mesh material={materials.tubeInner}>
            <boxGeometry args={[0.64, 1.02, 0.50]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
