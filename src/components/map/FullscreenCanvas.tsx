import { PropsWithChildren } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { NoToneMapping } from 'three';

const FullScreenCanvas: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Canvas
      gl={{ antialias: true, toneMapping: NoToneMapping, }}
      linear
     shadows={"soft"}
      style={{
        backgroundColor: 'rgb(144,206,187)',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
      <perspectiveCamera position={[0, 0, 2]} />
    </Canvas>
  );
};

export default FullScreenCanvas;
