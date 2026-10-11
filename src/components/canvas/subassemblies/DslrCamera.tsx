import React from 'react';
import * as THREE from 'three';
import { MaterialPalette } from '../materials';
import { useTelescope } from '../../../context/TelescopeContext';

interface SubassemblyProps {
  materials: MaterialPalette;
  explodedOffset: number;
}

export const DslrCamera: React.FC<SubassemblyProps> = ({ materials, explodedOffset }) => {
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

  // Base Z coordinate behind flip mirror
  const baseZ = -1.95;

  return (
    <group position={[0, 0, baseZ]}>
      {/* 1. T-Ring Bayonet Mount */}
      {isComponentVisible('dslr-t-ring') && (
        <group position={[0, 0, -explodedOffset * 0.8]}>
          <mesh
            onClick={(e) => handleClick(e, 'dslr-t-ring')}
            onPointerOver={(e) => handlePointerOver(e, 'dslr-t-ring')}
            onPointerOut={handlePointerOut}
            material={materials.machinedAluminum}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.34, 0.35, 0.12, 32]} />
          </mesh>
          {/* Bayonet 3-lug flange */}
          <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]} material={materials.stainlessSteel}>
            <torusGeometry args={[0.33, 0.02, 12, 3]} />
          </mesh>
        </group>
      )}

      {/* 2. Mechanical Shutter Unit */}
      {isComponentVisible('dslr-shutter-mechanism') && (
        <group position={[0, 0, -0.15 - explodedOffset * 1.25]}>
          <mesh
            onClick={(e) => handleClick(e, 'dslr-shutter-mechanism')}
            onPointerOver={(e) => handlePointerOver(e, 'dslr-shutter-mechanism')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
          >
            <boxGeometry args={[0.42, 0.34, 0.02]} />
          </mesh>
          {/* Carbon fiber shutter blades */}
          <mesh position={[0, 0, 0.012]} material={materials.magnesiumBody}>
            <boxGeometry args={[0.32, 0.22, 0.005]} />
          </mesh>
        </group>
      )}

      {/* 3. Astro-Modified IR/Cut Filter */}
      {isComponentVisible('dslr-ir-cut-filter') && (
        <group position={[0, 0, -0.22 - explodedOffset * 1.40]}>
          <mesh
            onClick={(e) => handleClick(e, 'dslr-ir-cut-filter')}
            onPointerOver={(e) => handlePointerOver(e, 'dslr-ir-cut-filter')}
            onPointerOut={handlePointerOut}
            material={materials.filterSolarERF}
          >
            <boxGeometry args={[0.36, 0.26, 0.01]} />
          </mesh>
        </group>
      )}

      {/* 4. Full-Frame CMOS Sensor Package (36 x 24 mm) */}
      {isComponentVisible('dslr-sensor-assembly') && (
        <group position={[0, 0, -0.28 - explodedOffset * 1.50]}>
          {/* Ceramic sensor substrate */}
          <mesh material={materials.anodizedBlack}>
            <boxGeometry args={[0.48, 0.38, 0.04]} />
          </mesh>
          {/* Active 36x24mm silicon die */}
          <mesh
            onClick={(e) => handleClick(e, 'dslr-sensor-assembly')}
            onPointerOver={(e) => handlePointerOver(e, 'dslr-sensor-assembly')}
            onPointerOut={handlePointerOut}
            position={[0, 0, 0.022]}
            material={materials.sensorSilicon}
          >
            <boxGeometry args={[0.36, 0.24, 0.005]} />
          </mesh>
          {(isSelected('dslr-sensor-assembly') || isHovered('dslr-sensor-assembly')) && (
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.38, 0.26]} />
              <meshBasicMaterial color={isSelected('dslr-sensor-assembly') ? '#06b6d4' : '#f59e0b'} wireframe />
            </mesh>
          )}
        </group>
      )}

      {/* 5. Main DSP & Dual SD Card Board */}
      {isComponentVisible('dslr-main-board') && (
        <group position={[0, 0, -0.40 - explodedOffset * 1.65]}>
          <mesh
            onClick={(e) => handleClick(e, 'dslr-main-board')}
            onPointerOver={(e) => handlePointerOver(e, 'dslr-main-board')}
            onPointerOut={handlePointerOut}
            material={materials.pcbGreen}
          >
            <boxGeometry args={[0.65, 0.45, 0.02]} />
          </mesh>
          {/* Image processing BIONZ/DIGIC DSP package */}
          <mesh position={[-0.10, 0, 0.02]} material={materials.anodizedBlack}>
            <boxGeometry args={[0.15, 0.15, 0.02]} />
          </mesh>
        </group>
      )}

      {/* 6. Magnesium Alloy DSLR Camera Body Shell */}
      {isComponentVisible('dslr-body-shell') && (
        <group position={[0, 0, -0.24 - explodedOffset * 1.30]}>
          {/* Main camera body block */}
          <mesh
            onClick={(e) => handleClick(e, 'dslr-body-shell')}
            onPointerOver={(e) => handlePointerOver(e, 'dslr-body-shell')}
            onPointerOut={handlePointerOut}
            material={materials.magnesiumBody}
          >
            <boxGeometry args={[0.78, 0.56, 0.36]} />
          </mesh>
          {/* Right handgrip extrusion */}
          <mesh position={[0.42, -0.02, 0.06]} material={materials.tubeInner}>
            <boxGeometry args={[0.16, 0.52, 0.26]} />
          </mesh>
          {/* Top pentaprism / EVF hump */}
          <mesh position={[0, 0.35, 0]} material={materials.magnesiumBody}>
            <coneGeometry args={[0.22, 0.20, 4]} />
          </mesh>
          {/* Top mode command dial */}
          <mesh position={[-0.28, 0.30, 0]} material={materials.machinedAluminum}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 24]} />
          </mesh>
          {/* Shutter button */}
          <mesh position={[0.34, 0.30, 0.10]} material={materials.stainlessSteel}>
            <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
