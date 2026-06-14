import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Satellites() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 100;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    // Wir holen uns die echten orbitalen Live-Daten von CelesTrak (Starlink-Satelliten)
    fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json')
      .then((response) => response.json())
      .then((data) => {
        if (!meshRef.current) return;

        // Wir nehmen die ersten 100 aktiven Satelliten aus der Liste
        const satellites = data.slice(0, count);

        satellites.forEach((sat: any, i: number) => {
          // Wir nutzen die echten Bahnneigungen (Inclination) und Exzentrizitäten
          const inclination = (sat.INCLINATION * Math.PI) / 180;
          const r = 2.5 + (sat.ECCENTRICITY * 0.5); // Flughöhe leicht über der Erde (Radius 2)
          const angle = Math.random() * Math.PI * 2;

          // Mathematische Umrechnung der orbitalen Neigung in 3D-Koordinaten
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle) * Math.sin(inclination);
          const z = r * Math.sin(angle) * Math.cos(inclination);

          dummy.position.set(x, y, z);
          dummy.scale.setScalar(0.04);
          dummy.updateMatrix();
          meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
      })
      .catch((err) => console.error("Fehler beim Laden der NASA/CelesTrak Daten:", err));
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ffcc" />
    </instancedMesh>
  );
}