import { Entity, EntityProps, useEntities } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { IdentifierProps, PositionFacet, PositionProps, TextTypeFacet, TextTypeProps } from '@leanscope/ecs-models';
import { Box } from '@react-three/drei';
import { Fragment } from 'react';
import { useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { TileCropFacet, TileCropProps } from '../../app/GameFacets';
import { FARMLAND_WATERD, WHEAT_CROP_STATE_1, WHEAT_CROP_STATE_2, WHEAT_CROP_STATE_3 } from '../../assets/crops';
import {
  FARMLAND_TILE,
  FARMLAND_TILE_B,
  FARMLAND_TILE_B_CORNER_TL,
  FARMLAND_TILE_B_CORNER_TLR,
  FARMLAND_TILE_B_CORNER_TR,
  FARMLAND_TILE_BL,
  FARMLAND_TILE_BL_CORNER_BL,
  FARMLAND_TILE_BR,
  FARMLAND_TILE_BR_CORNER_BR,
  FARMLAND_TILE_CORNER_BL,
  FARMLAND_TILE_CORNER_BLR,
  FARMLAND_TILE_CORNER_BR,
  FARMLAND_TILE_CORNER_TL,
  FARMLAND_TILE_CORNER_TLBL,
  FARMLAND_TILE_CORNER_TLBLR,
  FARMLAND_TILE_CORNER_TLBR,
  FARMLAND_TILE_CORNER_TLR,
  FARMLAND_TILE_CORNER_TLRBL,
  FARMLAND_TILE_CORNER_TLRBLR,
  FARMLAND_TILE_CORNER_TLRBR,
  FARMLAND_TILE_CORNER_TR,
  FARMLAND_TILE_CORNER_TRBL,
  FARMLAND_TILE_CORNER_TRBLR,
  FARMLAND_TILE_CORNER_TRBR,
  FARMLAND_TILE_L,
  FARMLAND_TILE_L_CORNER_BR,
  FARMLAND_TILE_L_CORNER_TR,
  FARMLAND_TILE_L_CORNER_TRBR,
  FARMLAND_TILE_LR,
  FARMLAND_TILE_R,
  FARMLAND_TILE_R_CORNER_BL,
  FARMLAND_TILE_R_CORNER_TL,
  FARMLAND_TILE_R_CORNER_TLBL,
  FARMLAND_TILE_ROUNDED,
  FARMLAND_TILE_ROUNDED_B,
  FARMLAND_TILE_ROUNDED_L,
  FARMLAND_TILE_ROUNDED_R,
  FARMLAND_TILE_ROUNDED_T,
  FARMLAND_TILE_T,
  FARMLAND_TILE_T_CORNER_BL,
  FARMLAND_TILE_T_CORNER_BLR,
  FARMLAND_TILE_T_CORNER_BR,
  FARMLAND_TILE_TB,
  FARMLAND_TILE_TL,
  FARMLAND_TILE_TL_CORNER_TL,
  FARMLAND_TILE_TR,
  FARMLAND_TILE_TR_CORNER_TR,
  GRASS_TILE_1,
  GRASS_TILE_2,
  GRASS_TILE_3,
  GRASS_TILE_4,
  GRASS_TILE_B,
  GRASS_TILE_BL,
  GRASS_TILE_BR,
  GRASS_TILE_CORNER_BL,
  GRASS_TILE_CORNER_BR,
  GRASS_TILE_CORNER_TL,
  GRASS_TILE_CORNER_TR,
  GRASS_TILE_L,
  GRASS_TILE_R,
  GRASS_TILE_T,
  GRASS_TILE_TL,
  GRASS_TILE_TR,
  HILL_TILE_B,
  HILL_TILE_BL,
  HILL_TILE_BR,
  HILL_TILE_CORNER_BL,
  HILL_TILE_CORNER_BR,
  HILL_TILE_CORNER_TL,
  HILL_TILE_CORNER_TR,
  HILL_TILE_L,
  HILL_TILE_R,
  HILL_TILE_T,
  HILL_TILE_TL,
  HILL_TILE_TR,
} from '../../assets/tiles';
import { TILE_SIZE, VALID_TERRAIN_TILES } from '../../base/constants';
import { AdditionalTags, SeedNames, TerrainTiles } from '../../base/enums';

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

    if (tile.get(TextTypeFacet)?.props.type === TerrainTiles.HILL) {
      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.HILL &&
        bottomLeftNeighborType === TerrainTiles.GRASS
      ) {
        return HILL_TILE_CORNER_BL;
      }
      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.HILL &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return HILL_TILE_CORNER_BR;
      }
      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.HILL &&
        topLeftNeighborType === TerrainTiles.GRASS
      ) {
        return HILL_TILE_CORNER_TL;
      }
      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.HILL &&
        topRightNeighborType === TerrainTiles.GRASS
      ) {
        return HILL_TILE_CORNER_TR;
      }

      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return HILL_TILE_BL;
      }
      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return HILL_TILE_BR;
      }
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.HILL
      ) {
        return HILL_TILE_TL;
      }
      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.HILL
      ) {
        return HILL_TILE_TR;
      }

      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.HILL
      ) {
        return randomNum === 0 ? GRASS_TILE_1 : randomNum === 1 ? GRASS_TILE_2 : randomNum === 2 ? GRASS_TILE_3 : GRASS_TILE_4;
      }
      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return HILL_TILE_B;
      }
      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.HILL
      ) {
        return HILL_TILE_T;
      }
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.HILL &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.HILL
      ) {
        return HILL_TILE_L;
      }
      if (
        leftNeighborType === TerrainTiles.HILL &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.HILL &&
        bottomNeighborType === TerrainTiles.HILL
      ) {
        return HILL_TILE_R;
      }
      return HILL_TILE_B;
    }

    if (tile.get(TextTypeFacet)?.props.type === TerrainTiles.GRASS) {
      return randomNum === 0 ? GRASS_TILE_1 : randomNum === 1 ? GRASS_TILE_2 : randomNum === 2 ? GRASS_TILE_3 : GRASS_TILE_4;
    } else if (tile.get(TextTypeFacet)?.props.type === TerrainTiles.FARMLAND) {
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_ROUNDED;
      }

      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_ROUNDED_T;
      }
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_ROUNDED_B;
      }
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_ROUNDED_L;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_ROUNDED_R;
      }
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_LR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_TB;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_T_CORNER_BL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_T_CORNER_BR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_T_CORNER_BLR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.GRASS &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_B_CORNER_TL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.GRASS &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_B_CORNER_TR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.GRASS &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_B_CORNER_TLR;
      }
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_L_CORNER_TR;
      }
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_L_CORNER_BR;
      }
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_L_CORNER_TRBR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_R_CORNER_TL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_R_CORNER_BL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_R_CORNER_TLBL;
      }

      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TLRBLR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_BR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_BL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TLBR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TRBL;
      }

      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TLBL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TRBR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_BLR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TLR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TLBL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TRBR;
      }

      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TRBLR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TLBLR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TLRBR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.GRASS &&
        bottomLeftNeighborType === TerrainTiles.GRASS &&
        bottomRightNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_CORNER_TLRBL;
      }

      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_TL_CORNER_TL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_TR_CORNER_TR;
      }
      if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.GRASS &&
        topRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_BL_CORNER_BL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.GRASS &&
        topLeftNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_BR_CORNER_BR;
      }

      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topLeftNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        topRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_TR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        bottomLeftNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_BL;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND &&
        bottomRightNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_CORNER_BR;
      }
      if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE;
      } else if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_B;
      } else if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_T;
      } else if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_R;
      } else if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_L;
      } else if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_TR;
      } else if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.GRASS &&
        bottomNeighborType === TerrainTiles.FARMLAND
      ) {
        return FARMLAND_TILE_TL;
      } else if (
        leftNeighborType === TerrainTiles.FARMLAND &&
        rightNeighborType === TerrainTiles.GRASS &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.GRASS
      ) {
        return FARMLAND_TILE_BR;
      } else if (
        leftNeighborType === TerrainTiles.GRASS &&
        rightNeighborType === TerrainTiles.FARMLAND &&
        topNeighborType === TerrainTiles.FARMLAND &&
        bottomNeighborType === TerrainTiles.GRASS
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

const selectCropImage = (tileCropName: SeedNames, growthStage: number): string => {
  switch (tileCropName) {
    case SeedNames.WHEAT_SEED:
      switch (growthStage) {
        case 1:
          return WHEAT_CROP_STATE_1;
        case 2:
          return WHEAT_CROP_STATE_2;
        case 3:
          return WHEAT_CROP_STATE_3;
        default:
          return WHEAT_CROP_STATE_1;
      }
    default:
      return WHEAT_CROP_STATE_1;
  }
};

const TerrainTile = (props: IdentifierProps & TextTypeProps & PositionProps & EntityProps & TileCropProps) => {
  const { positionX, positionY, entity, tileCropName, growthStage } = props;
  const [tiles] = useEntities((e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TerrainTiles) || ''));
  const [isTileWaterd] = useEntityHasTags(entity, AdditionalTags.WATERD);
  const terrainTexture = useLoader(THREE.TextureLoader, selectImageForTileType(entity, tiles));
  const waterdFarmlandTexture = useLoader(THREE.TextureLoader, FARMLAND_WATERD);
  const hasTileCrop = entity.has(TileCropFacet);
  const seedTexture = useLoader(THREE.TextureLoader, selectCropImage(tileCropName as SeedNames, growthStage));

  return (
    <Fragment>
      <Box position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={[TILE_SIZE, TILE_SIZE, 0]}>
        <meshBasicMaterial
          polygonOffset={true}
          alphaTest={1}
          depthWrite={false}
          clipShadows={false}
          premultipliedAlpha={true}
          map={terrainTexture}
          transparent
        />
      </Box>
      <Box position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={[TILE_SIZE, TILE_SIZE, 0]}>
        <meshBasicMaterial
          polygonOffset={true}
          alphaTest={1}
          depthWrite={false}
          clipShadows={false}
          premultipliedAlpha={true}
          map={waterdFarmlandTexture}
          opacity={isTileWaterd ? 1 : 0}
          transparent
        />
      </Box>
      <Box position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={[TILE_SIZE, TILE_SIZE, 0]}>
        <meshBasicMaterial
          polygonOffset={true}
          alphaTest={1}
          depthWrite={false}
          clipShadows={false}
          premultipliedAlpha={true}
          opacity={hasTileCrop ? 1 : 0}
          map={seedTexture}
          transparent
        />
      </Box>
    </Fragment>
  );
};

export default TerrainTile;
