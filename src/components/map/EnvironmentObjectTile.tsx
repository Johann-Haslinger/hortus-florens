import React, { useRef } from 'react';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps, TextTypeProps, PositionProps } from '@leanscope/ecs-models';
import { useFrame, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { ENVIRONMENT_OBJECTS, FRUIT_NAMES, GAME_TAGS } from '../../base/enums';
import { TREE_DEAD_TILE, TREE_TILE } from '../../assets/environmentObjects';
import { Box } from '@react-three/drei';
import { TILE_SIZE } from '../../base/constants';
import { TreeFruitFacet, TreeFruitProps } from '../../app/GameFacets';
import { TREE_FRUIT_APPLE } from '../../assets/environmentObjects/fruits';
import { Group, Object3DEventMap } from 'three';

const findEnvotonmentObjectTexture = (object: ENVIRONMENT_OBJECTS, entity: Entity): string => {
  switch (object) {
    case ENVIRONMENT_OBJECTS.TREE:
      if (entity.hasTag(GAME_TAGS.CUT)) return TREE_DEAD_TILE;

      return TREE_TILE;

    default:
      return '';
  }
};

const findEnvotonmentObjectSizeArgs = (object: ENVIRONMENT_OBJECTS): [number, number, number] => {
  switch (object) {
    case ENVIRONMENT_OBJECTS.TREE:
      return [TILE_SIZE * 2.5, TILE_SIZE * 2.5, 0];
    default:
      return [0, 0, 0];
  }
};

const findFruitTexture = (fruit: FRUIT_NAMES) => {
  switch (fruit) {
    case FRUIT_NAMES.APPLE:
      return TREE_FRUIT_APPLE;
    default:
      return TREE_FRUIT_APPLE;
  }
};

const EnvironmentObjectTile = (props: IdentifierProps & TextTypeProps & PositionProps & EntityProps & TreeFruitProps) => {
  const { positionX, positionY, type, entity, fruitName, growthStage } = props;
  const tileTexture = useLoader(THREE.TextureLoader, findEnvotonmentObjectTexture(type as ENVIRONMENT_OBJECTS, entity));
  const cutTreeTexture = useLoader(THREE.TextureLoader, TREE_DEAD_TILE);
  const fruitTexture = useLoader(THREE.TextureLoader, findFruitTexture(fruitName));
  const meshRef = useRef<THREE.MeshBasicMaterial>(null);
  const fruitRef = useRef<Group<Object3DEventMap>>(null);

  useFrame(() => {
    if (type == ENVIRONMENT_OBJECTS.TREE) {
      if (entity.hasTag(GAME_TAGS.CUT)) {
        meshRef.current!.map = cutTreeTexture;
      } else {
        meshRef.current!.map = tileTexture;
      }
      if (fruitRef.current) {
        fruitRef.current.visible = growthStage === 4;
      }
    }
  });

  return (
    <>
      <Box position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={findEnvotonmentObjectSizeArgs(type as ENVIRONMENT_OBJECTS)}>
        <meshBasicMaterial ref={meshRef} map={tileTexture} transparent />
      </Box>

      <group ref={fruitRef}>
        {[
          [positionX * TILE_SIZE - TILE_SIZE / 2, positionY * TILE_SIZE, 0],
          [positionX * TILE_SIZE + TILE_SIZE / 3, positionY * TILE_SIZE + TILE_SIZE / 6, 0],
          [positionX * TILE_SIZE, positionY * TILE_SIZE + TILE_SIZE / 1.5, 0],
        ].map((position, idx) => (
          <Box key={idx} position={new THREE.Vector3(position[0], position[1], position[2])} args={[TILE_SIZE / 4, TILE_SIZE / 4, 0]}>
            <meshBasicMaterial transparent map={fruitTexture} />
          </Box>
        ))}
      </group>
    </>
  );
};

export default EnvironmentObjectTile;
