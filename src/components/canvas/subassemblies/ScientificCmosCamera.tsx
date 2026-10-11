import React from 'react';
import * as THREE from 'three';
import { MaterialPalette } from '../materials';
import { useTelescope } from '../../../context/TelescopeContext';

interface SubassemblyProps {
  materials: MaterialPalette;
  explodedOffset: number;
}

export const ScientificCmosCamera: React.FC<SubassemblyProps> = ({ materials, explodedOffset }) => {
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

  // Base Z behind flip mirror (Z ~ -1.95)
  const baseZ = -1.95;

  return (
    <group position={[0, 0, baseZ]}>
      {/* 1. T2 / M48 Nosepiece Adapter */}
      {isComponentVisible('cmos-t2-adapter') && (
        <group position={[0, 0, -explodedOffset * 0.8]}>
          <mesh
            onClick={(e) => handleClick(e, 'cmos-t2-adapter')}
            onPointerOver={(e) => handlePointerOver(e, 'cmos-t2-adapter')}
            onPointerOut={handlePointerOut}
            material={materials.machinedAluminum}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.26, 0.28, 0.16, 32]} />
          </mesh>
          {/* Threaded collar */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.anodizedBlack}>
            <torusGeometry args={[0.27, 0.02, 12, 32]} />
          </mesh>
        </group>
      )}

      {/* 2. AR Protective Optical Window */}
      {isComponentVisible('cmos-optical-window') && (
        <group position={[0, 0, -0.10 - explodedOffset * 1.0]}>
          <mesh
            onClick={(e) => handleClick(e, 'cmos-optical-window')}
            onPointerOver={(e) => handlePointerOver(e, 'cmos-optical-window')}
            onPointerOut={handlePointerOut}
            material={materials.glassCrown}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
          </mesh>
        </group>
      )}

      {/* 3. Scientific CMOS Sensor Package & Sensor Plane */}
      {isComponentVisible('cmos-sensor-package') && (
        <group position={[0, 0, -0.22 - explodedOffset * 1.35]}>
          {/* Ceramic carrier package */}
          <mesh material={materials.anodizedBlack}>
            <boxGeometry args={[0.36, 0.28, 0.04]} />
          </mesh>
          {/* Active Silicon CMOS Die (23.5 x 15.6 mm scaled) */}
          <mesh
            onClick={(e) => handleClick(e, 'cmos-sensor-package')}
            onPointerOver={(e) => handlePointerOver(e, 'cmos-sensor-package')}
            onPointerOut={handlePointerOut}
            position={[0, 0, 0.022]}
            material={materials.sensorSilicon}
          >
            <boxGeometry args={[0.24, 0.16, 0.005]} />
          </mesh>
          {/* Golden bonding wires perimeter */}
          <mesh position={[0, 0, 0.021]} material={materials.brass}>
            <ringGeometry args={[0.13, 0.15, 4]} />
          </mesh>
          {(isSelected('cmos-sensor-package') || isHovered('cmos-sensor-package')) && (
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.26, 0.18]} />
              <meshBasicMaterial color={isSelected('cmos-sensor-package') ? '#06b6d4' : '#f59e0b'} wireframe />
            </mesh>
          )}
        </group>
      )}

      {/* 4. Dual-Stage Thermoelectric Peltier Cooling Element */}
      {isComponentVisible('cmos-peltier-cooler') && (
        <group position={[0, 0, -0.28 - explodedOffset * 1.50]}>
          <mesh
            onClick={(e) => handleClick(e, 'cmos-peltier-cooler')}
            onPointerOver={(e) => handlePointerOver(e, 'cmos-peltier-cooler')}
            onPointerOut={handlePointerOut}
            material={materials.machinedAluminum}
          >
            <boxGeometry args={[0.20, 0.20, 0.03]} />
          </mesh>
          {/* Ceramic cold/hot plates */}
          <mesh position={[0, 0, 0.018]} material={materials.stainlessSteel}>
            <boxGeometry args={[0.21, 0.21, 0.005]} />
          </mesh>
        </group>
      )}

      {/* 5. Copper Heat Pipes & Radiator Fin Stack */}
      {isComponentVisible('cmos-heat-sink') && (
        <group position={[0, 0, -0.38 - explodedOffset * 1.70]}>
          <mesh
            onClick={(e) => handleClick(e, 'cmos-heat-sink')}
            onPointerOver={(e) => handlePointerOver(e, 'cmos-heat-sink')}
            onPointerOut={handlePointerOut}
            material={materials.copper}
          >
            {/* Heat pipe block */}
            <boxGeometry args={[0.30, 0.30, 0.08]} />
          </mesh>
          {/* Miniature fan blades */}
          <mesh position={[0, 0, -0.06]} material={materials.anodizedBlack}>
            <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
          </mesh>
        </group>
      )}

      {/* 6. Processing FPGA & Frame Buffer PCB */}
      {isComponentVisible('cmos-pcb-mainboard') && (
        <group position={[0, 0, -0.50 - explodedOffset * 1.85]}>
          <mesh
            onClick={(e) => handleClick(e, 'cmos-pcb-mainboard')}
            onPointerOver={(e) => handlePointerOver(e, 'cmos-pcb-mainboard')}
            onPointerOut={handlePointerOut}
            material={materials.pcbGreen}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.38, 0.38, 0.02, 32]} />
          </mesh>
          {/* Surface mount FPGA IC chips */}
          <mesh position={[0, 0.05, 0.02]} material={materials.anodizedBlack}>
            <boxGeometry args={[0.10, 0.10, 0.02]} />
          </mesh>
          <mesh position={[0.12, -0.06, 0.02]} material={materials.anodizedBlack}>
            <boxGeometry args={[0.08, 0.06, 0.02]} />
          </mesh>
        </group>
      )}

      {/* 7. Scientific Camera Outer Cylinder Housing */}
      {isComponentVisible('cmos-outer-housing') && (
        <group position={[0, 0, -0.32 - explodedOffset * 1.20]}>
          <mesh
            onClick={(e) => handleClick(e, 'cmos-outer-housing')}
            onPointerOver={(e) => handlePointerOver(e, 'cmos-outer-housing')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlue}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.44, 0.44, 0.62, 36, 1, true]} />
          </mesh>
        </group>
      )}

      {/* 8. Locking USB 3.0 & DC 12V Rear Faceplate */}
      {isComponentVisible('cmos-usb3-connector') && (
        <group position={[0, 0, -0.64 - explodedOffset * 2.05]}>
          <mesh
            onClick={(e) => handleClick(e, 'cmos-usb3-connector')}
            onPointerOver={(e) => handlePointerOver(e, 'cmos-usb3-connector')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.44, 0.44, 0.04, 36]} />
          </mesh>
          {/* Industrial USB-B 3.0 port */}
          <mesh position={[-0.10, 0.02, -0.03]} material={materials.stainlessSteel}>
            <boxGeometry args={[0.10, 0.08, 0.05]} />
          </mesh>
          {/* DC 12V barrel socket */}
          <mesh position={[0.12, 0.02, -0.03]} rotation={[Math.PI / 2, 0, 0]} material={materials.brass}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
