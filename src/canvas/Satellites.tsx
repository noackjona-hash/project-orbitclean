import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Satellites() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [satData, setSatData] = useState<any[]>([]);
  const count = 1000;
  const dummy = new THREE.Object3D();
  const apiKey = '0IC3jrF6f7bgnalFEJ54RyR71wzxmZ11ZfcwH6ml';
  const color = new THREE.Color();

  const positionsRef = useRef<THREE.Vector3[]>(Array.from({ length: count }, () => new THREE.Vector3()));

  useEffect(() => {
    fetch(`https://api.nasa.gov/techport/api/projects?api_key=${apiKey}`)
      .then((res) => res.json())
      .catch(() => {})
      .finally(() => {
        const generatedSats = Array.from({ length: count }).map((_, index) => {
          const orbitType = index % 3;
          let inc = 53;
          let baseR = 2.4;

          if (orbitType === 1) {
            inc = 98;
            baseR = 2.7;
          } else if (orbitType === 2) {
            inc = 28;
            baseR = 3.1;
          }

          return {
            INCLINATION: inc + Math.random() * 0.5,
            ECCENTRICITY: 0.0001 + Math.random() * 0.002,
            MEAN_MOTION: 14.0 + Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2,
            baseRadius: baseR,
            id: index,
            destroyed: false
          };
        });
        setSatData(generatedSats);
      });
  }, []);

  useFrame((state) => {
    if (!meshRef.current || satData.length === 0) return;

    const time = state.clock.getElapsedTime();
    let stateChanged = false;
    let destroyedCount = 0;

    satData.forEach((sat) => {
      const inclination = (sat.INCLINATION * Math.PI) / 180;
      const r = sat.baseRadius + (sat.ECCENTRICITY * 10);
      const speed = 0.1 + (sat.MEAN_MOTION / 60);
      const angle = sat.phase + time * speed;

      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle) * Math.sin(inclination);
      const z = r * Math.sin(angle) * Math.cos(inclination);

      positionsRef.current[sat.id].set(x, y, z);

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(sat.destroyed ? 0.15 : 0.05);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(sat.id, dummy.matrix);

      color.set(sat.destroyed ? '#ff4d4d' : '#33ffd0');
      meshRef.current!.setColorAt(sat.id, color);
      
      if (sat.destroyed) destroyedCount++;
    });

    for (let i = 0; i < count; i++) {
      if (!satData[i].destroyed) continue;
      const posA = positionsRef.current[i];

      for (let j = 0; j < count; j++) {
        if (i === j || satData[j].destroyed) continue;
        const posB = positionsRef.current[j];
        
        if (posA.distanceToSquared(posB) < 0.015) {
          satData[j].destroyed = true;
          stateChanged = true;
        }
      }
    }

    if (stateChanged) {
      setSatData([...satData]);
    }

    window.dispatchEvent(new CustomEvent('sat-update', { detail: destroyedCount }));

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  const handleMeshClick = (e: any) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    if (instanceId === undefined) return;

    setSatData((prev) =>
      prev.map((sat) => (sat.id === instanceId ? { ...sat, destroyed: true } : sat))
    );
  };

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[null as any, null as any, count]} 
      onClick={handleMeshClick}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}