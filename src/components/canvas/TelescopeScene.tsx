import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Grid } from '@react-three/drei';
import { TelescopeModel } from './TelescopeModel';
import { CameraRig } from './CameraRig';
import { useTelescope } from '../../context/TelescopeContext';

export const TelescopeScene: React.FC = () => {
  const { detailLevel } = useTelescope();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [4.2, 2.8, 4.5], fov: 42, near: 0.1, far: 100 }}
        shadows={detailLevel === 'photorealistic'}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#070b14']} />
        
        {/* Ambient lighting */}
        <ambientLight intensity={detailLevel === 'photorealistic' ? 0.7 : 0.9} />
        
        {/* Main Sun key light */}
        <directionalLight 
          position={[6, 8, 8]} 
          intensity={detailLevel === 'photorealistic' ? 2.2 : 1.6} 
          castShadow={detailLevel === 'photorealistic'} 
          shadow-mapSize={1024}
        />

        {/* Opposite fill light */}
        <directionalLight position={[-6, 4, -5]} intensity={0.8} />

        {/* Top cool rim light */}
        <directionalLight position={[0, 6, 0]} intensity={0.6} color="#38bdf8" />

        {/* Solar warm accent light from front */}
        <pointLight position={[0, 0, 5.5]} intensity={1.5} color="#f59e0b" distance={8} />

        <Suspense fallback={null}>
          <TelescopeModel />
          <CameraRig />
        </Suspense>

        <OrbitControls 
          enableDamping 
          dampingFactor={0.08}
          minDistance={1.2}
          maxDistance={18}
          target={[0, 0.4, 0.5]}
        />

        {/* Grid floor */}
        <Grid
          position={[0, -2.6, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#1e293b"
          sectionSize={2.0}
          sectionThickness={1.0}
          sectionColor="#334155"
          fadeDistance={18}
        />

        {/* Soft ground contact shadow */}
        {detailLevel === 'photorealistic' && (
          <ContactShadows 
            position={[0, -2.59, 0]} 
            opacity={0.65} 
            scale={12} 
            blur={2.0} 
            far={4.5} 
          />
        )}
      </Canvas>
    </div>
  );
};
