import { PropsWithChildren } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { NoToneMapping } from 'three';

const FullScreenCanvas: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Canvas
      gl={{ antialias: true, toneMapping: NoToneMapping }}
      linear
      style={{
        backgroundColor: 'rgb(144,206,187)',
        width: '100%',
        height: '100%',
      }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {children}
      <perspectiveCamera position={[0, 0, 5]} />
    </Canvas>
  );
};

export default FullScreenCanvas;
