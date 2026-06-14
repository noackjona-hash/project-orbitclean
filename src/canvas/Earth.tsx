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
      earthRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group pointerEvents="none">
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial map={colorMap} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.03, 32, 32]} />
        <meshBasicMaterial color="#4da6ff" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}