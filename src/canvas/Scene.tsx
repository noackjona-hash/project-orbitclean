import Earth from './Earth';
import Satellites from './Satellites';

export default function Scene() {
  return (
    <group>
      <Earth />
      <Satellites />
    </group>
  );
}