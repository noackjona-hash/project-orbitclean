import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import Scene from './canvas/Scene';

export default function App() {
  const [destroyed, setDestroyed] = useState(0);

  useEffect(() => {
    const handleUpdate = (e: any) => setDestroyed(e.detail);
    window.addEventListener('sat-update', handleUpdate);
    return () => window.removeEventListener('sat-update', handleUpdate);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <Stars radius={120} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={3} maxDistance={20} />
      </Canvas>

      <div style={{
        position: 'absolute', top: '30px', left: '30px', color: 'white',
        pointerEvents: 'none', fontFamily: 'monospace', textShadow: '0px 2px 8px rgba(0,0,0,0.9)'
      }}>
        <h1 style={{ fontSize: '28px', margin: '0', letterSpacing: '2px', color: '#00ffcc' }}>PROJECT ORBITCLEAN</h1>
        <p style={{ fontSize: '12px', opacity: 0.5, marginBottom: '20px' }}>STARDANCE SIMULATION CORE v1.2.0</p>
        
        <div style={{ borderLeft: '3px solid #ff4d4d', paddingLeft: '15px', backgroundColor: 'rgba(255,77,77,0.05)', padding: '10px 15px', borderRadius: '0 4px 4px 0' }}>
          <div style={{ fontSize: '11px', opacity: 0.6, color: '#ff4d4d' }}>KESSLER CASCADE STATUS</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{((destroyed / 1000) * 100).toFixed(1)}% REACTION</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>DEBRIS CLOUD: <span style={{ color: '#ff4d4d' }}>{destroyed} UNITS</span></div>
        </div>
      </div>
    </div>
  );
}