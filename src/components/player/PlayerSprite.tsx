import { useContext, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PositionFacet, PositionProps, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { Entity, EntityProps, useEntities, useEntity } from '@leanscope/ecs-engine';
import { VALID_TERRAIN_TILES, TILE_SIZE, WALKABLE_TILES, PLAYER_SPEED } from '../../base/constants';
import { ENVIRONMENT_OBJECTS, GAME_TAGS, TERRAIN_TILES } from '../../base/enums';
import { Box } from '@react-three/drei';
import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';

const checkCanMoveRight = (playerX: number, playerY: number, tiles: readonly Entity[], lsc: ILeanScopeClient): boolean => {
  const playerTile = tiles.find((e) => e.hasTag(GAME_TAGS.PLAYER_TILE));

  if (playerTile) {
    const currentTileY = playerTile.get(PositionFacet)?.props.positionY!;
    const currentTileX = playerTile.get(PositionFacet)?.props.positionX!;
    // const tilesInRow = tiles.filter((tile) => tile.get(PositionFacet)?.props.positionY === currentTileY);
    const tilesInRow = tiles.filter(
      (tile) =>
        tile.get(PositionFacet)?.props.positionY! - TILE_SIZE / 2 <= playerY &&
        tile.get(PositionFacet)?.props.positionY! + TILE_SIZE / 2 >= playerY,
    );

    const nextTile = tilesInRow.find(
      (tile) => currentTileX ? tile.get(PositionFacet)?.props.positionX! !== currentTileX && tile.get(PositionFacet)?.props.positionX! > playerX : tile.get(PositionFacet)?.props.positionX! > playerX ,
    );
    // console.log('nextTile', nextTile);
    // console.log("tilesInRow", tilesInRow)
    if (nextTile && nextTile.get(TextTypeFacet)?.props.type !== "") {
      return true;
    }
  }

  return true;
};

const checkCanMoveLeft = (playerX: number, playerY: number, tiles: readonly Entity[]): boolean => {
  const playerTile = tiles.find((tile) => {
    const tileLeft = tile.get(PositionFacet)?.props.positionX! - TILE_SIZE / 2;
    const tileRight = tile.get(PositionFacet)?.props.positionX! + TILE_SIZE / 2;
    const tileTop = tile.get(PositionFacet)?.props.positionY! - TILE_SIZE / 2;
    const tileBottom = tile.get(PositionFacet)?.props.positionY! + TILE_SIZE / 2;

    return playerX - TILE_SIZE / 2 >= tileLeft && playerX - TILE_SIZE / 2 <= tileRight && playerY >= tileTop && playerY <= tileBottom;
  });

  if (playerTile) {
    const currentTileY = playerTile.get(PositionFacet)?.props.positionY!;
    const currentTileX = playerTile.get(PositionFacet)?.props.positionX!;
    const tilesInRow = tiles
      .filter((tile) => tile.get(PositionFacet)?.props.positionY === currentTileY)
      .sort((a, b) => a.get(PositionFacet)?.props.positionX! - b.get(PositionFacet)?.props.positionX!);

    const previousTile = tilesInRow.reverse().find((tile) => tile.get(PositionFacet)?.props.positionX! < currentTileX);

    if (previousTile && (previousTile.get(TextTypeFacet)?.props.type as TERRAIN_TILES) == TERRAIN_TILES.WATER) {
      return false;
    }
  }

  return true;
};

const PlayerSprite = (props: PositionProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const [tiles] = useEntities((e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TERRAIN_TILES) || ''));

  const { entity, positionX, positionY } = props;
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

      if (key === 'a' && checkCanMoveLeft(positionX, positionY, tiles) == true) {
        movementRef.current[0] = -PLAYER_SPEED;
      }
      if (key === 'd' && checkCanMoveRight(positionX, positionY, tiles, lsc) == true) {
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

    const handleKeyPress = () => {
      if (checkCanMoveRight(positionX, positionY, tiles, lsc) == false) {
        console.log('cannot move right');
        movementRef.current[0] = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [positionX, positionY, tiles]);

  useFrame(({ camera }) => {
    const [x, y] = [positionX, positionY];
    const [dx, dy] = movementRef.current;

    const smoothX = x + dx * smoothness;
    const smoothY = y + dy * smoothness;
    camera.position.x = smoothX;
    camera.position.y = smoothY;

    entity.add(new PositionFacet({ positionX: smoothX, positionY: smoothY, positionZ: 0 }));

    const playerTile = tiles.find((tile) => {
      const tileLeft = tile.get(PositionFacet)?.props.positionX! - TILE_SIZE / 2;
      const tileRight = tile.get(PositionFacet)?.props.positionX! + TILE_SIZE / 2;
      const tileTop = tile.get(PositionFacet)?.props.positionY! - TILE_SIZE / 2;
      const tileBottom = tile.get(PositionFacet)?.props.positionY! + TILE_SIZE / 2;

      const correctFactor = 1.12;
      const playerX = smoothX * correctFactor;
      const playerY = smoothY * correctFactor;

      return playerX >= tileLeft && playerX <= tileRight && playerY >= tileTop && playerY <= tileBottom;
    });

    tiles.forEach((tile) => {
      tile.removeTag(GAME_TAGS.PLAYER_TILE);
    });
    playerTile?.addTag(GAME_TAGS.PLAYER_TILE);

    previousPositionRef.current = [smoothX, smoothY];
  });

  return (
    <Box args={[TILE_SIZE / 2, TILE_SIZE / 2, 0]} position={[positionX, positionY, 0]}>
      <meshBasicMaterial depthTest={true} transparent color={'black'} />
    </Box>
  );
};

export default PlayerSprite;
