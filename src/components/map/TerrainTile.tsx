import { IdentifierProps, PositionFacet, PositionProps, Tags, TextTypeFacet, TextTypeProps } from '@leanscope/ecs-models';
import { TILE_SIZE, VALID_TERRAIN_TILES } from '../../base/constants';
import { Entity, EntityProps, useEntities, useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { useEffect, useRef, useState } from 'react';
import { BufferGeometry, Material, Mesh, MeshBasicMaterial, NormalBufferAttributes, Object3DEventMap } from 'three';
import { useFrame } from '@react-three/fiber';
import React from 'react';
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
  GRASS_TILE_CORNER_TL,
  GRASS_TILE_CORNER_TR,
  GRASS_TILE_CORNER_BL,
  GRASS_TILE_CORNER_BR,
  FARMLAND_TILE,
  FARMLAND_TILE_B,
  FARMLAND_TILE_BR,
  FARMLAND_TILE_T,
  FARMLAND_TILE_L,
  FARMLAND_TILE_R,
  FARMLAND_TILE_BL,
  FARMLAND_TILE_TR,
  FARMLAND_TILE_TL,
  FARMLAND_TILE_LR,
  FARMLAND_TILE_TB,
  FARMLAND_TILE_ROUNDED_B,
  FARMLAND_TILE_ROUNDED_L,
  FARMLAND_TILE_ROUNDED_R,
  FARMLAND_TILE_ROUNDED_T,
  FARMLAND_TILE_ROUNDED,
  FARMLAND_TILE_CORNER_BL,
  FARMLAND_TILE_CORNER_BR,
  FARMLAND_TILE_CORNER_TL,
  FARMLAND_TILE_CORNER_TR,
  FARMLAND_TILE_CORNER_TLRBLR,
  FARMLAND_TILE_CORNER_TLR,
  FARMLAND_TILE_CORNER_BLR,
  FARMLAND_TILE_CORNER_TLRBR,
  FARMLAND_TILE_CORNER_TLBR,
  FARMLAND_TILE_CORNER_TLBL,
  FARMLAND_TILE_CORNER_TLBLR,
  FARMLAND_TILE_CORNER_TRBR,
  FARMLAND_TILE_CORNER_TRBL,
  FARMLAND_TILE_BR_CORNER_BR,
  FARMLAND_TILE_BL_CORNER_BL,
  FARMLAND_TILE_TR_CORNER_TR,
  FARMLAND_TILE_TL_CORNER_TL,
  FARMLAND_TILE_CORNER_TRBLR,
  FARMLAND_TILE_CORNER_TLRBL,
  FARMLAND_TILE_L_CORNER_TR,
  FARMLAND_TILE_L_CORNER_BR,
  FARMLAND_TILE_L_CORNER_TRBR,
  FARMLAND_TILE_R_CORNER_TL,
  FARMLAND_TILE_R_CORNER_BL,
  FARMLAND_TILE_R_CORNER_TLBL,
  FARMLAND_TILE_T_CORNER_BL,
  FARMLAND_TILE_T_CORNER_BR,
  FARMLAND_TILE_T_CORNER_BLR,
  FARMLAND_TILE_B_CORNER_TL,
  FARMLAND_TILE_B_CORNER_TR,
  FARMLAND_TILE_B_CORNER_TLR,
  FARMLAND_TILE_BLANK,
} from '../../assets/tiles';
import { Canvas, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { Box } from '@react-three/drei';
import { GAME_TAGS, TERRAIN_TILES } from '../../base/enums';
import { TimeFacet } from '../../app/GameFacets';
import { FARMLAND_WATERD, WHEAT_SEED } from '../../assets/seeds';

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
  const topLeftNeighbor = tiles.find(
    (t) => t.get(PositionFacet)?.props.positionX === positionX - 1 && t.get(PositionFacet)?.props.positionY === positionY + 1,
  );
  const topRightNeighbor = tiles.find(
    (t) => t.get(PositionFacet)?.props.positionX === positionX + 1 && t.get(PositionFacet)?.props.positionY === positionY + 1,
  );
  const bottomLeftNeighbor = tiles.find(
    (t) => t.get(PositionFacet)?.props.positionX === positionX - 1 && t.get(PositionFacet)?.props.positionY === positionY - 1,
  );
  const bottomRightNeighbor = tiles.find(
    (t) => t.get(PositionFacet)?.props.positionX === positionX + 1 && t.get(PositionFacet)?.props.positionY === positionY - 1,
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
  if (rightNeighbor && leftNeighbor && topNeighbor && bottomNeighbor && !topLeftNeighbor) {
    return GRASS_TILE_CORNER_BL;
  }
  if (rightNeighbor && leftNeighbor && topNeighbor && bottomNeighbor && !topRightNeighbor) {
    return GRASS_TILE_CORNER_BR;
  }
  if (rightNeighbor && leftNeighbor && topNeighbor && bottomNeighbor && !bottomLeftNeighbor) {
    return GRASS_TILE_CORNER_TL;
  }
  if (rightNeighbor && leftNeighbor && topNeighbor && bottomNeighbor && !bottomRightNeighbor) {
    return GRASS_TILE_CORNER_TR;
  }

  if (
    rightNeighbor &&
    leftNeighbor &&
    topNeighbor &&
    bottomNeighbor &&
    topLeftNeighbor &&
    topRightNeighbor &&
    bottomLeftNeighbor &&
    bottomRightNeighbor
  ) {
    const leftNeighborType = leftNeighbor.get(TextTypeFacet)?.props.type;
    const rightNeighborType = rightNeighbor.get(TextTypeFacet)?.props.type;
    const topNeighborType = topNeighbor.get(TextTypeFacet)?.props.type;
    const bottomNeighborType = bottomNeighbor.get(TextTypeFacet)?.props.type;

    const topLeftNeighborType = topLeftNeighbor.get(TextTypeFacet)?.props.type;
    const topRightNeighborType = topRightNeighbor.get(TextTypeFacet)?.props.type;
    const bottomLeftNeighborType = bottomLeftNeighbor.get(TextTypeFacet)?.props.type;
    const bottomRightNeighborType = bottomRightNeighbor.get(TextTypeFacet)?.props.type;

    if (tile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.GRASS) {
      return randomNum === 0 ? GRASS_TILE_1 : randomNum === 1 ? GRASS_TILE_2 : randomNum === 2 ? GRASS_TILE_3 : GRASS_TILE_4;
    } else if (tile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.FARMLAND) {
      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_ROUNDED;
      }

      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_ROUNDED_T;
      }
      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_ROUNDED_B;
      }
      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_ROUNDED_L;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_ROUNDED_R;
      }
      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_LR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_TB;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_T_CORNER_BL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_T_CORNER_BR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_T_CORNER_BLR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.GRASS &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_B_CORNER_TL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.GRASS &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_B_CORNER_TR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.GRASS &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_B_CORNER_TLR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_L_CORNER_TR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_L_CORNER_BR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_L_CORNER_TRBR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_R_CORNER_TL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_R_CORNER_BL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_R_CORNER_TLBL;
      }

      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TLRBLR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_BR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_BL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TLBR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TRBL;
      }

      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TLBL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TRBR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_BLR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TLR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TLBL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TRBR;
      }

      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TRBLR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TLBLR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TLRBR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.GRASS &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS &&
        bottomRightNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TLRBL;
      }

      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_TL_CORNER_TL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_TR_CORNER_TR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.GRASS &&
        topRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_BL_CORNER_BL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.GRASS &&
        topLeftNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_BR_CORNER_BR;
      }

      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topLeftNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        topRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomLeftNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_BL;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomRightNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_CORNER_BR;
      }
      if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE;
      } else if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_B;
      } else if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_T;
      } else if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_R;
      } else if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_L;
      } else if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_TR;
      } else if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.GRASS &&
        bottomNeighborType === TERRAIN_TILES.FARMLAND
      ) {
        return FARMLAND_TILE_TL;
      } else if (
        leftNeighborType === TERRAIN_TILES.FARMLAND &&
        rightNeighborType === TERRAIN_TILES.GRASS &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_BR;
      } else if (
        leftNeighborType === TERRAIN_TILES.GRASS &&
        rightNeighborType === TERRAIN_TILES.FARMLAND &&
        topNeighborType === TERRAIN_TILES.FARMLAND &&
        bottomNeighborType === TERRAIN_TILES.GRASS
      ) {
        return FARMLAND_TILE_BL;
      } else {
        return FARMLAND_TILE;
      }
    } else {
      return GRASS_TILE_1;
    }
  }

  return GRASS_TILE_1;
};

const TerrainTile = (props: IdentifierProps & TextTypeProps & PositionProps & EntityProps) => {
  const { positionX, positionY, type, entity } = props;
  const [tiles] = useEntities((e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TERRAIN_TILES) || ''));
  const [isWaterd] = useEntityHasTags(entity, GAME_TAGS.WATERD);
  const terrainTexture = useLoader(THREE.TextureLoader, selectImageForTileType(entity, tiles));
  const waterdFarmlandTexture = useLoader(THREE.TextureLoader, FARMLAND_WATERD);

  const seedTexture = useLoader(THREE.TextureLoader, WHEAT_SEED);
  const meshRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const seedRef = useRef<MeshBasicMaterial>(null);
  const textureRef = useRef<MeshBasicMaterial>(null);

  const tileCropName = entity.get(TimeFacet)?.props.tileCropName;
  const growthStage = entity.get(TimeFacet)?.props.growthStage;

  useFrame(() => {
    if (isWaterd && materialRef.current) {
      materialRef.current.opacity = 1;
    } else if (materialRef.current) {
      materialRef.current.opacity = 0;
    }
    if (seedRef.current && materialRef.current && entity.get(TimeFacet)?.props.tileCropName) {
      seedRef.current.opacity = 1;

    } else if (seedRef.current && materialRef.current ) {
      seedRef.current.opacity = 0;

    }
  });

  return (
    <>
      <Box ref={meshRef} position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={[TILE_SIZE, TILE_SIZE, 0]}>
        <meshBasicMaterial map={terrainTexture} transparent />
      </Box>
      <Box position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={[TILE_SIZE, TILE_SIZE, 0]}>
        <meshBasicMaterial map={waterdFarmlandTexture} ref={materialRef} transparent />
      </Box>
      <Box position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={[TILE_SIZE, TILE_SIZE, 0]}>
        <meshBasicMaterial ref={seedRef} map={seedTexture} alphaTest={0.5} transparent />
      </Box>
    </>
  );
};

export default TerrainTile;
