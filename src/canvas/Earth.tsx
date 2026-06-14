import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);

  // useFrame läuft in einer Schleife (60 FPS) und lässt die Erde rotieren
    useFrame((_, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.05;
        }
    });

  return (
    <mesh ref={earthRef}>
      {/* Eine Kugel mit Radius 2 und 64 Segmenten für ein rundes Aussehen */}
      <sphereGeometry args={[2, 64, 64]} />
      {/* Ein Standard-Material, das auf Licht reagiert. Vorerst bläulich, bis wir Texturen laden */}
      <meshStandardMaterial 
        color="#1d3557" 
        wireframe={false} 
        roughness={0.6}
      />
    </mesh>
  );
}