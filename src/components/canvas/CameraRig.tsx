import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useTelescope } from '../../context/TelescopeContext';

export const CameraRig: React.FC = () => {
  const { currentPreset } = useTelescope();
  const { camera } = useThree();
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(4.2, 2.8, 4.5));
  const lookAtPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.4, 0.5));

  useEffect(() => {
    switch (currentPreset) {
      case 'front':
        targetPos.current.set(0, 0.4, 6.5);
        break;
      case 'side':
        targetPos.current.set(6.5, 0.4, 0.5);
        break;
      case 'top':
        targetPos.current.set(0, 7.5, 0.5);
        break;
      case 'rear':
        targetPos.current.set(0, 0.4, -5.5);
        break;
      case 'isometric':
      default:
        targetPos.current.set(4.2, 2.8, 4.5);
        break;
    }

    camera.position.copy(targetPos.current);
    camera.lookAt(lookAtPos.current);
  }, [currentPreset, camera]);

  return null;
};
