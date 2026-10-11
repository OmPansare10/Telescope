import React from 'react';
import { MaterialPalette } from '../materials';
import { useTelescope } from '../../../context/TelescopeContext';

interface SubassemblyProps {
  materials: MaterialPalette;
  explodedOffset: number;
}

export const ObjectiveAssembly: React.FC<SubassemblyProps> = ({ materials, explodedOffset }) => {
  const { 
    selectedComponentId, 
    setSelectedComponentId, 
    hoveredComponentId, 
    setHoveredComponentId,
    isComponentVisible,
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

  // Base coordinate along Z-axis (front of optical tube at +Z ~ 2.9 units in 3D world)
  const baseZ = 2.9;

  return (
    <group position={[0, 0, baseZ]}>
      {/* 1. Solar ERF Filter Glass */}
      {isComponentVisible('solar-filter-glass') && (
        <group position={[0, 0, 0.45 + explodedOffset * 1.8]}>
          <mesh
            onClick={(e) => handleClick(e, 'solar-filter-glass')}
            onPointerOver={(e) => handlePointerOver(e, 'solar-filter-glass')}
            onPointerOut={handlePointerOut}
            material={materials.filterSolarERF}
          >
            <cylinderGeometry args={[0.54, 0.54, 0.03, 48]} />
          </mesh>
          {(isSelected('solar-filter-glass') || isHovered('solar-filter-glass')) && (
            <mesh>
              <ringGeometry args={[0.52, 0.56, 48]} />
              <meshBasicMaterial color={isSelected('solar-filter-glass') ? '#06b6d4' : '#f59e0b'} side={2} />
            </mesh>
          )}
        </group>
      )}

      {/* 2. Solar Filter Cell & Retaining Bezel */}
      {isComponentVisible('solar-filter-cell') && (
        <group position={[0, 0, 0.40 + explodedOffset * 1.6]}>
          <mesh
            onClick={(e) => handleClick(e, 'solar-filter-cell')}
            onPointerOver={(e) => handlePointerOver(e, 'solar-filter-cell')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.56, 0.05, 16, 48]} />
          </mesh>
          {/* Bezel knurling rim */}
          <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={materials.machinedAluminum}>
            <cylinderGeometry args={[0.61, 0.61, 0.04, 32]} />
          </mesh>
        </group>
      )}

      {/* 3. Objective Lens 1 (Crown Glass - FCD100) */}
      {isComponentVisible('objective-lens-1') && (
        <group position={[0, 0, 0.25 + explodedOffset * 1.2]}>
          <mesh
            onClick={(e) => handleClick(e, 'objective-lens-1')}
            onPointerOver={(e) => handlePointerOver(e, 'objective-lens-1')}
            onPointerOut={handlePointerOut}
            material={materials.glassCrown}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.50, 0.51, 0.06, 48]} />
          </mesh>
          {(isSelected('objective-lens-1') || isHovered('objective-lens-1')) && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.49, 0.52, 48]} />
              <meshBasicMaterial color={isSelected('objective-lens-1') ? '#06b6d4' : '#f59e0b'} side={2} />
            </mesh>
          )}
        </group>
      )}

      {/* 4. Precision Air-Gap Spacer Ring */}
      {isComponentVisible('objective-spacer') && (
        <group position={[0, 0, 0.18 + explodedOffset * 0.95]}>
          <mesh
            onClick={(e) => handleClick(e, 'objective-spacer')}
            onPointerOver={(e) => handlePointerOver(e, 'objective-spacer')}
            onPointerOut={handlePointerOut}
            material={materials.brass}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.505, 0.015, 12, 48]} />
          </mesh>
          {detailLevel === 'cad' && (
            <mesh position={[0, 0.6, 0]}>
              {/* CAD provisional marker annotation */}
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>
          )}
        </group>
      )}

      {/* 5. Objective Lens 2 (Flint Glass - Lanthanum) */}
      {isComponentVisible('objective-lens-2') && (
        <group position={[0, 0, 0.11 + explodedOffset * 0.70]}>
          <mesh
            onClick={(e) => handleClick(e, 'objective-lens-2')}
            onPointerOver={(e) => handlePointerOver(e, 'objective-lens-2')}
            onPointerOut={handlePointerOut}
            material={materials.glassFlint}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.505, 0.495, 0.05, 48]} />
          </mesh>
          {(isSelected('objective-lens-2') || isHovered('objective-lens-2')) && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.49, 0.52, 48]} />
              <meshBasicMaterial color={isSelected('objective-lens-2') ? '#06b6d4' : '#f59e0b'} side={2} />
            </mesh>
          )}
        </group>
      )}

      {/* 6. Objective Cell Housing with Collimation Push-Pull Screws */}
      {isComponentVisible('objective-cell-housing') && (
        <group position={[0, 0, 0.02 + explodedOffset * 0.40]}>
          <mesh
            onClick={(e) => handleClick(e, 'objective-cell-housing')}
            onPointerOver={(e) => handlePointerOver(e, 'objective-cell-housing')}
            onPointerOut={handlePointerOut}
            material={materials.anodizedBlack}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.62, 0.62, 0.28, 48, 1, true]} />
          </mesh>
          {/* Cell front flange ring */}
          <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]} material={materials.machinedAluminum}>
            <torusGeometry args={[0.59, 0.03, 16, 48]} />
          </mesh>
          {/* 3 pairs of push-pull collimation screws around cell perimeter (120 deg apart) */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => {
            const r = 0.63;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            const x2 = Math.cos(angle + 0.1) * r;
            const y2 = Math.sin(angle + 0.1) * r;
            return (
              <group key={idx}>
                {/* Push screw */}
                <mesh position={[x, y, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={materials.stainlessSteel}>
                  <cylinderGeometry args={[0.015, 0.015, 0.08, 12]} />
                </mesh>
                {/* Pull locking screw */}
                <mesh position={[x2, y2, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={materials.brass}>
                  <cylinderGeometry args={[0.015, 0.015, 0.08, 12]} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
