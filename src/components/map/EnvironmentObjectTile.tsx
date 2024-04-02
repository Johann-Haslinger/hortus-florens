import React, { useRef } from 'react';
import { EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps, TextTypeProps, PositionProps } from '@leanscope/ecs-models';
import { useFrame, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { ENVIRONMENT_OBJECTS } from '../../base/enums';
import { TREE_TILE } from '../../assets/environmentObjects';
import { Box } from '@react-three/drei';
import { TILE_SIZE } from '../../base/constants';

const findEnvotonmentObjectTexture = (object: ENVIRONMENT_OBJECTS): string => {
  switch (object) {
    case ENVIRONMENT_OBJECTS.TREE:
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
}

const EnvironmentObjectTile = (props: IdentifierProps & TextTypeProps & PositionProps & EntityProps) => {
  const { positionX, positionY, type, entity } = props;
  const tileTexture = useLoader(THREE.TextureLoader, findEnvotonmentObjectTexture(type as ENVIRONMENT_OBJECTS));
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {});

  return (
    <Box ref={meshRef} position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={findEnvotonmentObjectSizeArgs(type as ENVIRONMENT_OBJECTS)}>
      <meshBasicMaterial map={tileTexture} transparent />
    </Box>
  );
};

export default EnvironmentObjectTile;
