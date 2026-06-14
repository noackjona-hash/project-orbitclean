import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Satellites() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [satData, setSatData] = useState<any[]>([]);
  const count = 100;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json'))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Netzwerk-Fehler beim Proxy');
      })
      .then((wrapper) => {
        const data = JSON.parse(wrapper.contents);
        if (!Array.isArray(data)) return;
        setSatData(data.slice(0, count));
      })
      .catch((err) => console.error("Fehler beim Laden der NASA/CelesTrak Daten:", err));
  }, []);

  useFrame((state) => {
    if (!meshRef.current || satData.length === 0) return;

    const time = state.clock.getElapsedTime();

    satData.forEach((sat, i) => {
      const inclination = (sat.INCLINATION * Math.PI) / 180;
      const r = 2.5 + (sat.ECCENTRICITY * 0.5);
      
      const speed = 0.2 + (sat.MEAN_MOTION ? sat.MEAN_MOTION / 50 : 0.1);
      const angle = (i / count) * Math.PI * 2 + time * speed;

      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle) * Math.sin(inclination);
      const z = r * Math.sin(angle) * Math.cos(inclination);

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.04);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ffcc" />
    </instancedMesh>
  );
}