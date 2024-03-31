import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PositionFacet, PositionProps, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { Entity, EntityProps, useEntities, useEntity } from '@leanscope/ecs-engine';
import { VALID_TERRAIN_TILES, TILE_SIZE, WALKABLE_TILES, TERRAIN_TILES } from '../../base/Constants';

const checkCanMoveRight = (playerX: number, playerY: number, tiles: readonly Entity[]): boolean => {
  const playerTile = tiles.find((tile) => {
    const tileLeft = tile.get(PositionFacet)?.props.positionX! - TILE_SIZE / 2;
    const tileRight = tile.get(PositionFacet)?.props.positionX! + TILE_SIZE / 2;
    const tileTop = tile.get(PositionFacet)?.props.positionY! - TILE_SIZE / 2;
    const tileBottom = tile.get(PositionFacet)?.props.positionY! + TILE_SIZE / 2;

    return playerX + TILE_SIZE / 2 >= tileLeft && playerX + TILE_SIZE / 2 <= tileRight && playerY >= tileTop && playerY <= tileBottom;
  });

  if (playerTile) {
    const currentTileY = playerTile.get(PositionFacet)?.props.positionY!;
    const currentTileX = playerTile.get(PositionFacet)?.props.positionX!;
    const tilesInRow = tiles.filter((tile) => tile.get(PositionFacet)?.props.positionY === currentTileY);

    const nextTile = tilesInRow.find((tile) => tile.get(PositionFacet)?.props.positionX! > currentTileX);

    if (nextTile && (nextTile.get(TextTypeFacet)?.props.type as TERRAIN_TILES) == TERRAIN_TILES.WATER) {
      return false;
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
  const [tiles] = useEntities((e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TERRAIN_TILES) || ''));

  const { entity, positionX, positionY } = props;
  const previousPositionRef = useRef([1, 1]);
  const speed = 0.1;
  const smoothness = 0.2;
  const movementRef = useRef([0, 0]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === 's') {
        movementRef.current[1] = -speed;
      }
      if (key === 'w') {
        movementRef.current[1] = speed;
      }

      if (key === 'a' && checkCanMoveLeft(positionX, positionY, tiles) == true) {
        movementRef.current[0] = -speed;
      }
      if (key === 'd' && checkCanMoveRight(positionX, positionY, tiles) == true) {
        movementRef.current[0] = speed;
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
      if (checkCanMoveRight(positionX, positionY, tiles) == false) {
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

    previousPositionRef.current = [smoothX, smoothY];
  });

  return (
    <mesh position={[positionX, positionY, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.1]} />
      <meshBasicMaterial color="black" />
    </mesh>
  );
};

export default PlayerSprite;
