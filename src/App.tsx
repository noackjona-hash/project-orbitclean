import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Scene from './canvas/Scene';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={2.5} />
        <Scene />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={20} />
      </Canvas>

      <div style={{
        position: 'absolute', top: '20px', left: '20px', color: 'white',
        pointerEvents: 'none', textShadow: '0px 2px 4px rgba(0,0,0,0.8)'
      }}>
        <h1 style={{ fontSize: '24px', margin: '0' }}>Project OrbitClean</h1>
        <p style={{ fontSize: '14px', opacity: 0.7 }}>Active Satellites Tracked: 1,000</p>
      </div>
    </div>
  );
}