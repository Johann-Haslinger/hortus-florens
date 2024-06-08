import { EntityProps } from '@leanscope/ecs-engine';
import { PositionProps } from '@leanscope/ecs-models';
import { Box } from '@react-three/drei';
import { TILE_SIZE } from '../../base/constants';
import PlayerMovementSystem from '../../systems/PlayerMovementSystem';
import PlayerActionSystem from '../../systems/PlayerActionSystem';

const Player = (props: PositionProps & EntityProps) => {
  const { positionX, positionY } = props;

  return (
    <group>
      <PlayerMovementSystem />
      <PlayerActionSystem />

      <Box args={[TILE_SIZE / 2, TILE_SIZE / 2, 0]} position={[positionX, positionY, 0]}>
        <meshBasicMaterial depthTest={true} transparent color={'black'} />
      </Box>
    </group>
  );
};

export default Player;
