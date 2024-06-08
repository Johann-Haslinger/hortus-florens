import { EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps, PositionProps, TextTypeProps } from '@leanscope/ecs-models';
import { Box } from '@react-three/drei';
import { Fragment, useRef } from 'react';
import { useFrame, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { Group, Object3DEventMap } from 'three';
import { TreeFruitFacet, TreeFruitProps } from '../../../app/GameFacets';
import { TREE_DEAD_TILE, TREE_TILE } from '../../../assets/environmentObjects';
import { TREE_FRUIT_APPLE } from '../../../assets/environmentObjects/fruits';
import { TILE_SIZE } from '../../../base/constants';
import { AdditionalTags, EnvironmentObjects, FruitNames } from '../../../base/enums';
import { findEnvotonmentObjectSizeArgs } from '../../../helpers/functions';

const findFruitTexture = (fruit: FruitNames) => {
  switch (fruit) {
    case FruitNames.APPLE:
      return TREE_FRUIT_APPLE;
    default:
      return TREE_FRUIT_APPLE;
  }
};

const TreeTile = (props: IdentifierProps & TextTypeProps & PositionProps & EntityProps & TreeFruitProps) => {
  const { positionX, positionY, type, entity, fruitName, growthStage } = props;
  const tileTexture = useLoader(THREE.TextureLoader, TREE_TILE);
  const cutTreeTexture = useLoader(THREE.TextureLoader, TREE_DEAD_TILE);
  const fruitTexture = useLoader(THREE.TextureLoader, findFruitTexture(fruitName));
  const meshRef = useRef<THREE.MeshBasicMaterial>(null);
  const fruitRef = useRef<Group<Object3DEventMap>>(null);

  useFrame(() => {
    if (type == EnvironmentObjects.TREE) {
      if (entity.hasTag(AdditionalTags.CUT)) {
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
    <Fragment>
      <Box
        receiveShadow={false}
        castShadow={false}
        position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]}
        args={findEnvotonmentObjectSizeArgs(type as EnvironmentObjects)}
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
          [positionX * TILE_SIZE - TILE_SIZE / 2.5, positionY * TILE_SIZE + TILE_SIZE / 12, 0],
          [positionX * TILE_SIZE + TILE_SIZE / 3, positionY * TILE_SIZE + TILE_SIZE / 12, 0],
          [positionX * TILE_SIZE, positionY * TILE_SIZE + TILE_SIZE / 1.5, 0],
        ].map((position, idx) => (
          <Box key={idx} position={new THREE.Vector3(position[0], position[1], position[2])} args={[TILE_SIZE / 2, TILE_SIZE / 2, 0]}>
            <meshBasicMaterial transparent map={fruitTexture} />
          </Box>
        ))}
      </group>
    </Fragment>
  );
};

export default TreeTile;
