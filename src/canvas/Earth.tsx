import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const colorMap = useTexture('/textures/earth_map.jpg');

  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.ClampToEdgeWrapping;

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 128, 128]} />
      <meshBasicMaterial map={colorMap} />
    </mesh>
  );
}