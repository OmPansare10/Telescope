import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTelescope } from '../../context/TelescopeContext';

export const OpticalRayTracer: React.FC = () => {
  const { 
    showRays, 
    isRayPlaying, 
    raySpeed, 
    steeringTilt, 
    convexLensPosition,
    flipMirrorPosition,
    detailLevel
  } = useTelescope();

  const photonGroupRef = useRef<THREE.Group>(null);

  // Optical coordinates:
  // Sun rays arrive from +Z (Z = 5.0) parallel with radius r = 0.42
  // Objective lens at Z = 2.9 (refracts and starts convergence)
  // Ring 1: Vertical Achromatic Doublet at Z = 1.8
  // Ring 2: 45° Convex Lens movable at Z = 0.5 + convexLensPosition
  // Steering lens at Z = -0.85
  // Flip mirror cube center at Z = -1.35
  // Camera sensor at Z = -2.17
  // Spectroscopy entrance slit at Y = 0.57, Z = -1.35; Grating at Y = 1.03; Detector at Y = 1.50

  const tiltRad = (steeringTilt * Math.PI) / 180;
  // Beam deflection caused by steering lens
  const beamDeflectionY = Math.tan(tiltRad * 0.8) * 0.8; 
  const convexLensZ = 0.5 + (convexLensPosition || 0);

  const isSpec = flipMirrorPosition === 'spectroscopy';

  // Build rays bundle (9 rays: central + 8 ring rays)
  const rayPaths = useMemo(() => {
    const paths = [];
    const rayAngles = [
      0,
      Math.PI / 4,
      Math.PI / 2,
      (3 * Math.PI) / 4,
      Math.PI,
      (5 * Math.PI) / 4,
      (3 * Math.PI) / 2,
      (7 * Math.PI) / 4,
    ];

    // Central ray
    const centerPoints: THREE.Vector3[] = [];
    centerPoints.push(new THREE.Vector3(0, 0, 4.8));
    centerPoints.push(new THREE.Vector3(0, 0, 2.9)); // At objective
    centerPoints.push(new THREE.Vector3(0, 0, 1.8)); // At Ring 1 (Vertical Achromatic Doublet)
    centerPoints.push(new THREE.Vector3(0, 0, convexLensZ)); // At Ring 2 (45° Convex Lens)
    centerPoints.push(new THREE.Vector3(0, 0, -0.85)); // At steering lens

    if (!isSpec) {
      // Straight through to camera sensor
      centerPoints.push(new THREE.Vector3(0, beamDeflectionY * 0.4, -1.35)); // At flip mirror
      centerPoints.push(new THREE.Vector3(0, beamDeflectionY, -2.17)); // At camera sensor
    } else {
      // Reflects 90 degrees up at flip mirror
      centerPoints.push(new THREE.Vector3(0, beamDeflectionY * 0.4, -1.35));
      centerPoints.push(new THREE.Vector3(0, 0.57, -1.35)); // Slit
      centerPoints.push(new THREE.Vector3(0, 1.03, -1.35)); // Grating
      centerPoints.push(new THREE.Vector3(0, 1.50, -1.35)); // Detector
    }
    paths.push({ points: centerPoints, color: '#ef4444' });

    // Outer bundle rays
    const outerR = 0.40;
    rayAngles.forEach((angle, i) => {
      const x0 = Math.cos(angle) * outerR;
      const y0 = Math.sin(angle) * outerR;

      // Convergence at Ring 1 (Vertical Achromatic Doublet at Z = 1.8)
      const xDoublet = x0 * 0.72;
      const yDoublet = y0 * 0.72;

      // Convergence at steering lens (ratio ~ 0.42)
      const xSteer = x0 * 0.42;
      const ySteer = y0 * 0.42;

      // Convergence at Ring 2 (45° Movable Convex Lens)
      const progressToSteer = Math.max(0, Math.min(1, (1.8 - convexLensZ) / (1.8 - (-0.85))));
      const xConvex = THREE.MathUtils.lerp(xDoublet, xSteer, progressToSteer);
      const yConvex = THREE.MathUtils.lerp(yDoublet, ySteer, progressToSteer);

      const points: THREE.Vector3[] = [];
      points.push(new THREE.Vector3(x0, y0, 4.8));
      points.push(new THREE.Vector3(x0, y0, 2.9)); // Objective
      points.push(new THREE.Vector3(xDoublet, yDoublet, 1.8)); // Ring 1: Vertical Achromatic Doublet
      points.push(new THREE.Vector3(xConvex, yConvex, convexLensZ)); // Ring 2: 45° Convex Lens
      points.push(new THREE.Vector3(xSteer, ySteer, -0.85)); // Steering lens

      if (!isSpec) {
        // Converges to focal spot on sensor
        const xMirror = xSteer * 0.45;
        const yMirror = ySteer * 0.45 + beamDeflectionY * 0.4;
        points.push(new THREE.Vector3(xMirror, yMirror, -1.35));
        
        // Spot on sensor plane
        const xSensor = (Math.cos(angle) * 0.02);
        const ySensor = (Math.sin(angle) * 0.02) + beamDeflectionY;
        points.push(new THREE.Vector3(xSensor, ySensor, -2.17));

        paths.push({ points, color: '#ef4444' });
      } else {
        // Converges to slit at flip mirror reflection
        points.push(new THREE.Vector3(xSteer * 0.45, ySteer * 0.45 + beamDeflectionY * 0.4, -1.35));
        points.push(new THREE.Vector3(xSteer * 0.1, 0.57, -1.35 + (ySteer * 0.1)));
        
        // Collimated onto grating
        points.push(new THREE.Vector3(xSteer * 0.35, 1.03, -1.35 + (ySteer * 0.35)));

        // Dispersed spectral rays from grating to detector (spectrum colors!)
        const spectralColors = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#3b82f6'];
        const specColor = spectralColors[i % spectralColors.length];
        const dispX = ((i - 4) / 4) * 0.12;
        points.push(new THREE.Vector3(dispX, 1.50, -1.35));

        paths.push({ points, color: specColor });
      }
    });

    return paths;
  }, [isSpec, beamDeflectionY]);

  // Animate photon pulses along ray paths
  useFrame((_, delta) => {
    if (!isRayPlaying || !photonGroupRef.current) return;
    const speed = delta * raySpeed * 1.5;
    photonGroupRef.current.children.forEach((child: any) => {
      if (child.userData?.progress !== undefined) {
        child.userData.progress = (child.userData.progress + speed) % 1.0;
        const curve = child.userData.curve as THREE.CatmullRomCurve3;
        if (curve) {
          const pt = curve.getPoint(child.userData.progress);
          child.position.copy(pt);
        }
      }
    });
  });

  if (!showRays) return null;

  return (
    <group>
      {/* 1. Static Ray Lines */}
      {rayPaths.map((ray, idx) => {
        const lineGeom = new THREE.BufferGeometry().setFromPoints(ray.points);
        const lineMat = new THREE.LineBasicMaterial({
          color: ray.color,
          transparent: true,
          opacity: detailLevel === 'cad' ? 0.9 : 0.75,
        });
        const lineObj = new THREE.Line(lineGeom, lineMat);
        return <primitive key={idx} object={lineObj} />;
      })}

      {/* 2. Focused Solar Image Spot on Sensor Plane (Updates with steering tilt!) */}
      {!isSpec && (
        <group position={[0, beamDeflectionY, -2.165]}>
          {/* Focused Solar Disc Disc */}
          <mesh>
            <circleGeometry args={[0.07, 32]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} />
          </mesh>
          {/* Sunspot marker on solar disc */}
          <mesh position={[0.02, 0.015, 0.001]}>
            <circleGeometry args={[0.012, 16]} />
            <meshBasicMaterial color="#1e1b4b" />
          </mesh>
          {/* Focal plane crosshair indicator */}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[0.08, 0.085, 32]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        </group>
      )}

      {/* 3. Dispersed Spectrum Band on Spectroscopy Detector */}
      {isSpec && (
        <group position={[0, 1.49, -1.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <planeGeometry args={[0.26, 0.04]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
          </mesh>
          {/* Absorption notch indicator for H-alpha 656.3 nm */}
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[0.008, 0.04]} />
            <meshBasicMaterial color="#050811" />
          </mesh>
        </group>
      )}

      {/* 4. Animated Photon Packets */}
      <group ref={photonGroupRef}>
        {rayPaths.map((ray, idx) => {
          const curve = new THREE.CatmullRomCurve3(ray.points);
          // 3 photons per ray path with staggered start phase
          return [0.1, 0.45, 0.8].map((phase, pIdx) => (
            <mesh 
              key={`${idx}-${pIdx}`} 
              userData={{ progress: phase, curve }}
            >
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ));
        })}
      </group>
    </group>
  );
};
