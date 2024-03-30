import { PropsWithChildren,} from 'react';
import { Canvas, useThree } from '@react-three/fiber';

const FullScreenCanvas: React.FC<PropsWithChildren> = ({ children }) => {

  return (
    <Canvas

      style={{
        backgroundColor: 'rgb(101,130,85)',

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
