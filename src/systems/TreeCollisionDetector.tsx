import { useEffect } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { useEntities } from '@leanscope/ecs-engine';
import { PositionFacet, TextTypeFacet } from '@leanscope/ecs-models';
import { AdditionalTags, EnvironmentObjects } from '../base/enums';
import { PLAYER_SIZE, TILE_SIZE } from '../base/constants';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const isColliding = (rect1: Rectangle, rect2: Rectangle) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

const TreeCollisionDetector = () => {
  const { playerPositionY, playerPositionX } = usePlayer();
  const [treeEntities] = useEntities((e) => e.get(TextTypeFacet)?.props.type === EnvironmentObjects.TREE);

  useEffect(() => {
    treeEntities.forEach((treeEntity) => {
      const objectPositionX = treeEntity.get(PositionFacet)?.props.positionX || 0;
      const objectPositionY = treeEntity.get(PositionFacet)?.props.positionY || 0;

      const playerRect = {
        x: playerPositionX,
        y: playerPositionY,
        width: PLAYER_SIZE.width,
        height: PLAYER_SIZE.height,
      };

      const objectRect = {
        x: objectPositionX,
        y: objectPositionY - 0.5,
        width: TILE_SIZE,
        height: TILE_SIZE,
      };

      const isCollidingWithPlayer = isColliding(playerRect, objectRect);

      if (isCollidingWithPlayer) {
        treeEntity.add(AdditionalTags.COLLIDING_WITH_PLAYER);
      } else {
        treeEntity.remove(AdditionalTags.COLLIDING_WITH_PLAYER);
      }
    });
  }, [playerPositionX, playerPositionY]);

  return null;
};

export default TreeCollisionDetector;
