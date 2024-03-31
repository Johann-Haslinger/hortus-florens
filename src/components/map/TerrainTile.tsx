import { IdentifierProps, PositionFacet, PositionProps, Tags, TextTypeFacet, TextTypeProps } from '@leanscope/ecs-models';
import { TERRAIN_TILES, TILE_SIZE, VALID_TERRAIN_TILES } from '../../base/Constants';
import { Entity, EntityProps, useEntities, useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { useEffect, useRef, useState } from 'react';
import { BufferGeometry, Material, Mesh, MeshBasicMaterial, NormalBufferAttributes, Object3DEventMap } from 'three';
import { useFrame } from '@react-three/fiber';
import {
  GRASS_TILE_1,
  GRASS_TILE_2,
  GRASS_TILE_3,
  GRASS_TILE_4,
  GRASS_TILE_TL,
  GRASS_TILE_TR,
  GRASS_TILE_BL,
  GRASS_TILE_BR,
  GRASS_TILE_B,
  GRASS_TILE_L,
  GRASS_TILE_R,
  GRASS_TILE_T,
  FARMLAND_TILE,
} from '../../assets/tiles';
import { Canvas, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { Box } from '@react-three/drei';

const selectImageForTileType = (tile: Entity, tiles: readonly Entity[]): string => {
  const { positionX, positionY } = tile.get(PositionFacet)?.props!;

  const rightNeighbor = tiles.find(
    (t) => t.get(PositionFacet)?.props.positionX === positionX + 1 && t.get(PositionFacet)?.props.positionY === positionY,
  );
  const leftNeighbor = tiles.find(
    (t) => t.get(PositionFacet)?.props.positionX === positionX - 1 && t.get(PositionFacet)?.props.positionY === positionY,
  );

  const topNeighbor = tiles.find(
    (t) => t.get(PositionFacet)?.props.positionX === positionX && t.get(PositionFacet)?.props.positionY === positionY + 1,
  );
  const bottomNeighbor = tiles.find(
    (t) => t.get(PositionFacet)?.props.positionX === positionX && t.get(PositionFacet)?.props.positionY === positionY - 1,
  );

  const randomNum = (Math.floor(positionX / 3) % 4) + (Math.floor(positionY / 3) % 4) + 1;

  if (rightNeighbor && leftNeighbor && topNeighbor && !bottomNeighbor) {
    return GRASS_TILE_B;
  }
  if (rightNeighbor && leftNeighbor && !topNeighbor && bottomNeighbor) {
    return GRASS_TILE_T;
  }
  if (rightNeighbor && !leftNeighbor && topNeighbor && bottomNeighbor) {
    return GRASS_TILE_L;
  }
  if (!rightNeighbor && leftNeighbor && topNeighbor && bottomNeighbor) {
    return GRASS_TILE_R;
  }
  if (rightNeighbor && !leftNeighbor && !topNeighbor && bottomNeighbor) {
    return GRASS_TILE_TL;
  }
  if (!rightNeighbor && leftNeighbor && !topNeighbor && bottomNeighbor) {
    return GRASS_TILE_TR;
  }
  if (rightNeighbor && !leftNeighbor && topNeighbor && !bottomNeighbor) {
    return GRASS_TILE_BL;
  }
  if (!rightNeighbor && leftNeighbor && topNeighbor && !bottomNeighbor) {
    return GRASS_TILE_BR;
  }

  if (rightNeighbor && leftNeighbor && topNeighbor && bottomNeighbor) {
    if (tile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.GRASS) {
      return randomNum === 0 ? GRASS_TILE_1 : randomNum === 1 ? GRASS_TILE_2 : randomNum === 2 ? GRASS_TILE_3 : GRASS_TILE_4;
    } else if (tile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.FARMLAND) {
      return FARMLAND_TILE;
    } else {
      return GRASS_TILE_1;
    }
  }

  return GRASS_TILE_1;
};

const TerrainTile = (props: IdentifierProps & TextTypeProps & PositionProps & EntityProps) => {
  const { positionX, positionY, type, entity } = props;
  const [tiles] = useEntities((e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TERRAIN_TILES) || ''));

  const texture = useLoader(THREE.TextureLoader, selectImageForTileType(entity, tiles));
  const meshRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);

  useFrame(() => {});

  return (
    <Box ref={meshRef} position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={[TILE_SIZE, TILE_SIZE, 0]}>
      <meshBasicMaterial ref={materialRef} map={texture} transparent />
    </Box>
  );
};

export default TerrainTile;
