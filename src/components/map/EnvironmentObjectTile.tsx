import React, { useRef } from 'react';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps, TextTypeProps, PositionProps } from '@leanscope/ecs-models';
import { useFrame, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { ENVIRONMENT_OBJECTS, FLOWER_NAMES, FRUIT_NAMES, GAME_TAGS, ROCK_NAMES, WEED_NAMES } from '../../base/enums';
import { STONE_TILE_1, SUNFLOWER_TILE, TREE_DEAD_TILE, TREE_TILE, WEED_TILE_1, WEED_TILE_2 } from '../../assets/environmentObjects';
import { Box } from '@react-three/drei';
import { TILE_SIZE } from '../../base/constants';
import { TitleFacet, TreeFruitFacet, TreeFruitProps } from '../../app/GameFacets';
import { TREE_FRUIT_APPLE } from '../../assets/environmentObjects/fruits';
import { Group, Object3DEventMap } from 'three';

const findEnvotonmentObjectTexture = (object: ENVIRONMENT_OBJECTS, entity: Entity): string => {
  const name = entity.get(TitleFacet)?.props.title;

  switch (object) {
    case ENVIRONMENT_OBJECTS.TREE:
      if (entity.hasTag(GAME_TAGS.CUT)) return TREE_DEAD_TILE;

      return TREE_TILE;
    case ENVIRONMENT_OBJECTS.ROCK:
      switch (name) {
        case ROCK_NAMES.STONE_1:
          return STONE_TILE_1;
        default:
          return '';
      }
    case ENVIRONMENT_OBJECTS.FLOWER:
      switch (name) {
        case FLOWER_NAMES.SUNFLOWER:
          return SUNFLOWER_TILE;
        default:
          return '';
      }
    case ENVIRONMENT_OBJECTS.WEED:
      switch (name) {
        case WEED_NAMES.WEED_1:
          return WEED_TILE_1;
        case WEED_NAMES.WEED_2:
          return WEED_TILE_2;
        default:
          return '';
      }
    case ENVIRONMENT_OBJECTS.BUSH:
    default:
      return '';
  }
};

const findEnvotonmentObjectSizeArgs = (object: ENVIRONMENT_OBJECTS): [number, number, number] => {
  switch (object) {
    case ENVIRONMENT_OBJECTS.TREE:
      return [TILE_SIZE * 2.5, TILE_SIZE * 2.5, 0];

    case ENVIRONMENT_OBJECTS.FLOWER:
      return [TILE_SIZE, TILE_SIZE * 1.5, 0];
    default:
      return [TILE_SIZE, TILE_SIZE, 0];
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
      if (fruitRef.current && entity.has(TreeFruitFacet)) {
        fruitRef.current.visible = growthStage === 4;
      } else if (fruitRef.current) {
        fruitRef.current.visible = false;
      }
    }
  });

  return (
    <>
      <Box
        receiveShadow={false}
        castShadow={false}
        position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]}
        args={findEnvotonmentObjectSizeArgs(type as ENVIRONMENT_OBJECTS)}
      >
        <meshBasicMaterial
          polygonOffset={true}
          alphaTest={1}
          depthWrite={false}
          clipShadows={false}
          premultipliedAlpha={true}
          ref={meshRef}
          map={tileTexture}
          transparent
        />
      </Box>

      <group visible={false} ref={fruitRef}>
        {[
          [positionX * TILE_SIZE - TILE_SIZE / 2, positionY * TILE_SIZE, 0],
          [positionX * TILE_SIZE + TILE_SIZE / 3, positionY * TILE_SIZE + TILE_SIZE / 6, 0],
          [positionX * TILE_SIZE, positionY * TILE_SIZE + TILE_SIZE / 1.4, 0],
        ].map((position, idx) => (
          <Box key={idx} position={new THREE.Vector3(position[0], position[1], position[2])} args={[TILE_SIZE / 2, TILE_SIZE / 2, 0]}>
            <meshBasicMaterial transparent map={fruitTexture} />
          </Box>
        ))}
      </group>
    </>
  );
};

export default EnvironmentObjectTile;
