import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTelescope } from '../../context/TelescopeContext';
import { createTelescopeMaterials } from './materials';
import { ObjectiveAssembly } from './subassemblies/ObjectiveAssembly';
import { OpticalTubeAssembly } from './subassemblies/OpticalTubeAssembly';
import { SteeringMechanism } from './subassemblies/SteeringMechanism';
import { FlipMirrorAssembly } from './subassemblies/FlipMirrorAssembly';
import { ScientificCmosCamera } from './subassemblies/ScientificCmosCamera';
import { DslrCamera } from './subassemblies/DslrCamera';
import { SpectroscopyModule3D } from './subassemblies/SpectroscopyModule3D';
import { MountAndTripod } from './subassemblies/MountAndTripod';
import { OpticalRayTracer } from './OpticalRayTracer';

export const TelescopeModel: React.FC = () => {
  const { 
    detailLevel, 
    cameraType, 
    viewMode, 
    explodedProgress, 
    activeSubassembly,
    showWireframeOverlay,
    showCenterlines,
    showDimensions
  } = useTelescope();

  // Procedural PBR & CAD materials
  const materials = useMemo(() => {
    return createTelescopeMaterials(detailLevel, viewMode, showWireframeOverlay);
  }, [detailLevel, viewMode, showWireframeOverlay]);

  // Subassembly isolation logic
  const isSubActive = (sub: string) => {
    return activeSubassembly === 'all' || activeSubassembly === sub;
  };

  // Centerline line object
  const centerlineObj = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0, 4.0),
      new THREE.Vector3(0, 0, -3.2),
    ];
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineDashedMaterial({ color: '#06b6d4', dashSize: 0.15, gapSize: 0.08 });
    const line = new THREE.Line(geom, mat);
    line.computeLineDistances();
    return line;
  }, []);

  return (
    <group position={[0, 0.4, 0]}>
      {/* 1. Optical Centerline Reference */}
      {(showCenterlines || detailLevel === 'cad') && (
        <group>
          <primitive object={centerlineObj} />
          {/* Focal plane marker */}
          <group position={[0, 0, -2.17]}>
            <ringGeometry args={[0.3, 0.31, 32]} />
            <meshBasicMaterial color="#f59e0b" side={2} />
          </group>
        </group>
      )}

      {/* 2. Objective Subassembly */}
      {isSubActive('objective') && (
        <ObjectiveAssembly materials={materials} explodedOffset={explodedProgress} />
      )}

      {/* 3. Optical Tube & Internal Baffles */}
      {isSubActive('optical-tube') && (
        <OpticalTubeAssembly materials={materials} explodedOffset={explodedProgress} />
      )}

      {/* 4. Adjustable Steering Lens Mechanism */}
      {isSubActive('steering') && (
        <SteeringMechanism materials={materials} explodedOffset={explodedProgress} />
      )}

      {/* 5. Flip-Mirror Housing */}
      {isSubActive('flip-mirror') && (
        <FlipMirrorAssembly materials={materials} explodedOffset={explodedProgress} />
      )}

      {/* 6. Camera Subassemblies (Scientific CMOS / DSLR / Both Cameras) */}
      {isSubActive('camera') && (
        <>
          {cameraType === 'scientific-cmos' && (
            <ScientificCmosCamera materials={materials} explodedOffset={explodedProgress} />
          )}

          {cameraType === 'dslr' && (
            <DslrCamera materials={materials} explodedOffset={explodedProgress} />
          )}

          {cameraType === 'both' && (
            <group>
              {/* Primary port: Scientific CMOS */}
              <group position={[0, 0, 0]}>
                <ScientificCmosCamera materials={materials} explodedOffset={explodedProgress} />
              </group>
              {/* Secondary comparison offset: DSLR Camera shown alongside */}
              <group position={[1.4, 0, 0]}>
                <DslrCamera materials={materials} explodedOffset={explodedProgress} />
              </group>
            </group>
          )}
        </>
      )}

      {/* 7. Spectroscopy Module (90-degree port) */}
      {isSubActive('spectroscopy') && (
        <SpectroscopyModule3D materials={materials} explodedOffset={explodedProgress} />
      )}

      {/* 8. Mount and Tripod System */}
      {isSubActive('mount') && (
        <MountAndTripod materials={materials} explodedOffset={explodedProgress} />
      )}

      {/* 9. Optical Ray Simulation */}
      <OpticalRayTracer />

      {/* 10. CAD Dimension Annotations (in CAD mode or if showDimensions is checked) */}
      {(detailLevel === 'cad' || showDimensions) && (
        <group>
          {/* Main tube diameter callout indicator */}
          <group position={[0, 0.72, 1.1]}>
            <mesh>
              <boxGeometry args={[0.02, 0.15, 0.02]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.02, 0.02, 1.2]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>

          {/* Objective aperture callout */}
          <group position={[0, 0.65, 3.1]}>
            <mesh>
              <boxGeometry args={[0.02, 0.12, 0.02]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
