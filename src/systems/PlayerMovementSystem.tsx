import { useEntities } from '@leanscope/ecs-engine';
import { TextTypeFacet, PositionFacet } from '@leanscope/ecs-models';
import { useRef, useEffect } from 'react';
import { useFrame } from 'react-three-fiber';
import { VALID_TERRAIN_TILES, PLAYER_SPEED, TILE_SIZE } from '../base/constants';
import { TerrainTiles, AdditionalTags } from '../base/enums';
import { usePlayer } from '../hooks/usePlayer';

const PlayerMovementSystem = () => {
  const { playerEntity, playerPositionX, playerPositionY } = usePlayer();
  const [tiles] = useEntities((e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TerrainTiles) || ''));

  const previousPositionRef = useRef([1, 1]);

  const smoothness = 0.2;
  const movementRef = useRef([0, 0]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === 's') {
        movementRef.current[1] = -PLAYER_SPEED;
      }
      if (key === 'w') {
        movementRef.current[1] = PLAYER_SPEED;
      }

      if (key === 'a') {
        movementRef.current[0] = -PLAYER_SPEED;
      }
      if (key === 'd') {
        movementRef.current[0] = PLAYER_SPEED;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === 's' || key === 'w') {
        movementRef.current[1] = 0;
      }

      if (key === 'a' || key === 'd') {
        movementRef.current[0] = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerPositionX, playerPositionY, tiles]);

  useFrame(({ camera }) => {
    const [x, y] = [playerPositionX, playerPositionY];
    const [dx, dy] = movementRef.current;

    const smoothX = x + dx * smoothness;
    const smoothY = y + dy * smoothness;
    camera.position.x = smoothX;
    camera.position.y = smoothY;

    playerEntity?.add(new PositionFacet({ positionX: smoothX, positionY: smoothY, positionZ: 0 }));

    const playerTile = tiles.find((tile) => {
      const tileLeft = tile.get(PositionFacet)?.props.positionX! - TILE_SIZE / 2;
      const tileRight = tile.get(PositionFacet)?.props.positionX! + TILE_SIZE / 2;
      const tileTop = tile.get(PositionFacet)?.props.positionY! - TILE_SIZE / 2;
      const tileBottom = tile.get(PositionFacet)?.props.positionY! + TILE_SIZE / 2;

      const correctFactor = 1.125;
      const playerX = smoothX * correctFactor;
      const playerY = smoothY * correctFactor;

      return playerX >= tileLeft && playerX <= tileRight && playerY >= tileTop && playerY <= tileBottom;
    });

    tiles.forEach((tile) => {
      tile.removeTag(AdditionalTags.PLAYER_TILE);
    });
    playerTile?.addTag(AdditionalTags.PLAYER_TILE);

    previousPositionRef.current = [smoothX, smoothY];
  });

  return null;
};

export default PlayerMovementSystem;
