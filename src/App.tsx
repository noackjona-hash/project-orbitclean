import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './canvas/Earth';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Das 3D-Spielfeld */}
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        {/* Weltall-Hintergrund mit Sternen */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Beleuchtung */}
        <ambientLight intensity={0.3} /> {/* Grundhelligkeit im Schatten */}
        <directionalLight position={[5, 3, 5]} intensity={2.5} /> {/* Die "Sonne" */}

        {/* Unsere Erdkugel */}
        <Earth />

        {/* Ermöglicht das Drehen und Zoomen mit der Maus */}
        <OrbitControls enablePan={false} minDistance={3} maxDistance={15} />
      </Canvas>

      {/* Einfaches UI-Overlay für Stardance */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        pointerEvents: 'none',
        textShadow: '0px 2px 4px rgba(0,0,0,0.8)'
      }}>
        <h1 style={{ fontSize: '24px', margin: '0' }}>Project OrbitClean</h1>
        <p style={{ fontSize: '14px', opacity: 0.7 }}>Stardance Simulation Framework</p>
      </div>
    </div>
  );
}