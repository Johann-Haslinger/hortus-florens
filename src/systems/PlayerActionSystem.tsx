import React from 'react';
import { Entity, EntityProps, useEntities, useEntity } from '@leanscope/ecs-engine';
import { PositionFacet, PositionProps, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { useContext, useEffect, useState } from 'react';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { TimeFacet, ItemGroupFacet, TitleFacet, HealthFacet, TileCropFacet } from '../app/GameFacets';
import { TILE_SIZE, VALID_TERRAIN_TILES } from '../base/constants';
import { TERRAIN_TILES, GAME_TAGS, TOOL_NAMES, SEED_NAMES, ITEM_GROUPS } from '../base/enums';

const findPlayerTile = (playerX: number, playerY: number, tiles: readonly Entity[]): Entity | undefined => {
  return tiles.find((tile) => {
    const tileLeft = tile.get(PositionFacet)?.props.positionX! - TILE_SIZE / 2;
    const tileRight = tile.get(PositionFacet)?.props.positionX! + TILE_SIZE / 2;
    const tileTop = tile.get(PositionFacet)?.props.positionY! - TILE_SIZE / 2;
    const tileBottom = tile.get(PositionFacet)?.props.positionY! + TILE_SIZE / 2;

    return playerX >= tileLeft && playerX <= tileRight && playerY >= tileTop && playerY <= tileBottom;
  });
};

const handleHoeUse = (playerTile: Entity | undefined) => {
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.GRASS) {
    playerTile.add(new TextTypeFacet({ type: TERRAIN_TILES.FARMLAND }));
  }
};

const handleWateringCanUse = (playerTile: Entity | undefined) => {
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.FARMLAND) {
    playerTile.addTag(GAME_TAGS.WATERD);
  }
};

const handleToolUse = (playerTile: Entity | undefined, toolName: TOOL_NAMES) => {
  switch (toolName) {
    case TOOL_NAMES.HOE:
      handleHoeUse(playerTile);
      break;
    case TOOL_NAMES.WATERING_CAN:
      handleWateringCanUse(playerTile);
      break;

    default:
      break;
  }
};

const handleSeedUse = (playerTile: Entity | undefined, seedName: SEED_NAMES, handleRemoveEntity: (itemGroup: SEED_NAMES) => void) => {
  const hasTileSeed = playerTile?.get(TileCropFacet)?.props.tileCropName !== undefined;

  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.FARMLAND && !hasTileSeed) {
    playerTile.add(new TileCropFacet({ tileCropName: seedName, growthStage: 1 }));
    handleRemoveEntity(seedName);
  }
};

const PlayerActionSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [playerTile, setPlayerTile] = useState<Entity | undefined>(undefined);
  const [tiles] = useEntities((e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TERRAIN_TILES) || ''));
  const [items] = useEntities((e) => e.has(ItemGroupFacet));
  const [playerEntity] = useEntity((e) => e.has(HealthFacet) && e.has(PositionFacet));
  const positionX = playerEntity?.get(PositionFacet)?.props.positionX;
  const positionY = playerEntity?.get(PositionFacet)?.props.positionY;

  const [selectedItem] = useEntity((e) => e.has(ItemGroupFacet) && e.hasTag(Tags.SELECTED));
  const selectedItemName = selectedItem?.get(TitleFacet)?.props.title;
  const selectedItemGroup = selectedItem?.get(ItemGroupFacet)?.props.group;



  const handleRemoveSelectedItem = (itemTitle: SEED_NAMES) => {
    const sameItems = items.filter((item) => item.get(TitleFacet)?.props.title === itemTitle);
    const notSelectedItems = sameItems.filter((item) => !item.hasTag(Tags.SELECTED));

    if (notSelectedItems.length === 0) {
      lsc.engine.removeEntity(sameItems[0]);
    } else {
      lsc.engine.removeEntity(notSelectedItems[0]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        switch (selectedItemGroup) {
          case ITEM_GROUPS.TOOLS:
            handleToolUse(playerTile, selectedItemName as TOOL_NAMES);
            break;
          case ITEM_GROUPS.SEEDS:
            handleSeedUse(playerTile, selectedItemName as SEED_NAMES, handleRemoveSelectedItem);
            break;
          case ITEM_GROUPS.CROPS:
            break;

          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, playerTile]);

  useEffect(() => {
    if (positionX !== undefined && positionY !== undefined) {
      setPlayerTile(findPlayerTile(positionX, positionY, tiles));
    }
  }, [positionX, positionY, tiles]);

  return <></>;
};

export default PlayerActionSystem;
