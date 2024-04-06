import { EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps, TextTypeProps, PositionProps } from '@leanscope/ecs-models';
import React, { useRef } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import { Group, Object3DEventMap } from 'three';
import { TreeFruitProps, TreeFruitFacet, TitleProps } from '../../../app/GameFacets';
import { TREE_DEAD_TILE, WEED_TILE_1, WEED_TILE_2 } from '../../../assets/environmentObjects';
import { TILE_SIZE } from '../../../base/constants';
import { ENVIRONMENT_OBJECTS, GAME_TAGS, WEED_NAMES } from '../../../base/enums';
import { findEnvotonmentObjectSizeArgs } from '../../../helpers/functions';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

const findWeedTexture = (weed: WEED_NAMES) => {
  switch (weed) {
    case WEED_NAMES.WEED_1:
      return WEED_TILE_1;
    case WEED_NAMES.WEED_2:
      return WEED_TILE_2;
    default:
      return WEED_TILE_1;
  }
};

const WeedTile = (props: IdentifierProps & TextTypeProps & PositionProps & TitleProps) => {
  const { positionX, positionY, type, title } = props;
  const tileTexture = useLoader(THREE.TextureLoader, findWeedTexture(title as WEED_NAMES));
  const meshRef = useRef<THREE.MeshBasicMaterial>(null);

  return (
    <Box position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={findEnvotonmentObjectSizeArgs(type as ENVIRONMENT_OBJECTS)}>
      <meshBasicMaterial ref={meshRef} map={tileTexture} transparent />
    </Box>
  );
};

export default WeedTile;
