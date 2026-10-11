import React from 'react';
import * as THREE from 'three';
import { MaterialPalette } from '../materials';
import { useTelescope } from '../../../context/TelescopeContext';

interface SubassemblyProps {
  materials: MaterialPalette;
  explodedOffset: number;
}

export const SteeringMechanism: React.FC<SubassemblyProps> = ({ materials, explodedOffset }) => {
  const { 
    selectedComponentId, 
    setSelectedComponentId, 
    hoveredComponentId, 
    setHoveredComponentId,
    isComponentVisible,
    steeringTilt,
    detailLevel
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

  // Base position for steering assembly along optical axis (Z ~ -0.85)
  const baseZ = -0.85;
  // Convert steering tilt from degrees to radians
  const tiltRad = (steeringTilt * Math.PI) / 180;

  return (
    <group position={[0, 0, baseZ]}>
      {/* 1. Rigid Housing & Support Bracket */}
      {isComponentVisible('steering-support-bracket') && (
        <group position={[-explodedOffset * 0.5, 0, 0]}>
          <mesh
            onClick={(e) => handleClick(e, 'steering-support-bracket')}
            onPointerOver={(e) => handlePointerOver(e, 'steering-support-bracket')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
          >
            {/* CNC bracket housing block with cylindrical optical tunnel */}
            <boxGeometry args={[0.9, 0.9, 0.35]} />
          </mesh>
          {/* Central clearance bore for beam */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.tubeInner}>
            <cylinderGeometry args={[0.32, 0.32, 0.36, 32]} />
          </mesh>
          {/* Fastening bolts (4 corners) */}
          {[
            [-0.38, 0.38],
            [0.38, 0.38],
            [-0.38, -0.38],
            [0.38, -0.38],
          ].map(([bx, by], idx) => (
            <mesh key={idx} position={[bx, by, 0.17]} material={materials.stainlessSteel}>
              <cylinderGeometry args={[0.02, 0.02, 0.04, 12]} />
            </mesh>
          ))}
        </group>
      )}

      {/* 2. Gimbal Pivot Shaft & Bearings (horizontal axis along X) */}
      {isComponentVisible('steering-pivot-shaft') && (
        <group position={[0, explodedOffset * 0.4, 0]}>
          {/* Main pivot cross-pin through the gimbal */}
          <mesh
            onClick={(e) => handleClick(e, 'steering-pivot-shaft')}
            onPointerOver={(e) => handlePointerOver(e, 'steering-pivot-shaft')}
            onPointerOut={handlePointerOut}
            material={materials.stainlessSteel}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.025, 0.025, 0.72, 16]} />
          </mesh>
          {/* Dual miniature ABEC-7 ball bearing races at pivots */}
          <mesh position={[-0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.brass}>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          </mesh>
          <mesh position={[0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.brass}>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          </mesh>
        </group>
      )}

      {/* DYNAMIC ROTATING GIMBAL CRADLE + STEERING LENS (Rotates with tiltRad around X axis!) */}
      <group rotation={[tiltRad, 0, 0]}>
        {/* 3. Gimbal Lens Cradle & Delrin Buffer */}
        {isComponentVisible('steering-lens-holder') && (
          <group position={[explodedOffset * 0.45, 0, 0]}>
            <mesh
              onClick={(e) => handleClick(e, 'steering-lens-holder')}
              onPointerOver={(e) => handlePointerOver(e, 'steering-lens-holder')}
              onPointerOut={handlePointerOut}
              material={materials.machinedAluminum}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.26, 0.04, 16, 36]} />
            </mesh>
            {/* Gimbal trunnion side ear mounts */}
            <mesh position={[-0.30, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.machinedAluminum}>
              <cylinderGeometry args={[0.035, 0.035, 0.08, 16]} />
            </mesh>
            <mesh position={[0.30, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.machinedAluminum}>
              <cylinderGeometry args={[0.035, 0.035, 0.08, 16]} />
            </mesh>
          </group>
        )}

        {/* 4. Realistic Curved Optical Steering Lens */}
        {isComponentVisible('steering-lens') && (
          <group position={[explodedOffset * 0.6, 0, 0]}>
            <mesh
              onClick={(e) => handleClick(e, 'steering-lens')}
              onPointerOver={(e) => handlePointerOver(e, 'steering-lens')}
              onPointerOut={handlePointerOut}
              material={materials.glassCrown}
              rotation={[Math.PI / 2, 0, 0]}
            >
              {/* Meniscus lens with realistic curved optical surfaces */}
              <cylinderGeometry args={[0.23, 0.22, 0.045, 36]} />
            </mesh>
            {/* Optical lens highlight ring if selected */}
            {(isSelected('steering-lens') || isHovered('steering-lens')) && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.21, 0.24, 36]} />
                <meshBasicMaterial color={isSelected('steering-lens') ? '#06b6d4' : '#f59e0b'} side={2} />
              </mesh>
            )}
          </group>
        )}
      </group>

      {/* 5. Differential Micrometer / Actuator Leadscrew (at bottom) */}
      {isComponentVisible('steering-actuator-micrometer') && (
        <group position={[0, -0.46 - explodedOffset * 0.45, 0.05]}>
          <mesh
            onClick={(e) => handleClick(e, 'steering-actuator-micrometer')}
            onPointerOver={(e) => handlePointerOver(e, 'steering-actuator-micrometer')}
            onPointerOut={handlePointerOut}
            material={materials.stainlessSteel}
          >
            {/* Actuator body barrel */}
            <cylinderGeometry args={[0.06, 0.06, 0.22, 24]} />
          </mesh>
          {/* Knurled micrometer thimble */}
          <mesh position={[0, -0.14, 0]} material={materials.brass}>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 24]} />
          </mesh>
          {/* Contact push-rod engaging the gimbal trunnion */}
          <mesh position={[0, 0.14, 0]} material={materials.stainlessSteel}>
            <cylinderGeometry args={[0.02, 0.02, 0.10, 16]} />
          </mesh>
        </group>
      )}

      {/* 6. Digital Shaft Angle Encoder */}
      {isComponentVisible('steering-encoder') && (
        <group position={[0.42 + explodedOffset * 0.7, 0, 0]}>
          <mesh
            onClick={(e) => handleClick(e, 'steering-encoder')}
            onPointerOver={(e) => handlePointerOver(e, 'steering-encoder')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
          >
            <boxGeometry args={[0.12, 0.16, 0.14]} />
          </mesh>
          {/* Feedback PCB board with status LED */}
          <mesh position={[0.065, 0, 0]} material={materials.pcbGreen}>
            <boxGeometry args={[0.01, 0.14, 0.12]} />
          </mesh>
          <mesh position={[0.072, 0.04, 0.03]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      )}

      {/* Live Tilt Angle readout indicator in 3D CAD mode */}
      {detailLevel === 'cad' && (
        <group position={[0, 0.55, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.35, 0.1, 0.02)]} />
            <lineBasicMaterial color="#38bdf8" />
          </lineSegments>
        </group>
      )}
    </group>
  );
};
