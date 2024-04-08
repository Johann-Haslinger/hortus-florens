import React from 'react';
import { Entity, EntityProps, useEntities, useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, PositionProps, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { useContext, useEffect, useState } from 'react';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { TimeFacet, ItemGroupFacet, TitleFacet, HealthFacet, TileCropFacet, TreeFruitFacet, SoundEffectFacet } from '../app/GameFacets';
import {
  INITIAL_CROP_GROWTH_STAGE,
  INITIAL_FRUIT_GROWTH_STAGE,
  MAX_CROP_GROWTH_STAGE,
  MAX_TREE_FRUIT_GROWTH_STAGE,
  TILE_SIZE,
  VALID_TERRAIN_TILES,
} from '../base/constants';
import {
  TERRAIN_TILES,
  GAME_TAGS,
  TOOL_NAMES,
  SEED_NAMES,
  ITEM_GROUPS,
  CROP_NAMES,
  ENVIRONMENT_OBJECTS,
  FRUIT_NAMES,
  OTHER_ITEM_NAMES,
  SOUND_EFFECTS,
} from '../base/enums';
import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { v4 } from 'uuid';

const handleHoeUse = (playerTile: Entity | undefined, soundEffectEntity: Entity) => {
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.GRASS) {
    soundEffectEntity.add(new SoundEffectFacet({ soundEffect: SOUND_EFFECTS.HOE }));
    playerTile.add(new TextTypeFacet({ type: TERRAIN_TILES.FARMLAND }));
  }
};

const handleWateringCanUse = (playerTile: Entity | undefined, soundEffectEntity: Entity) => {
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.FARMLAND) {
    soundEffectEntity.add(new SoundEffectFacet({ soundEffect: SOUND_EFFECTS.WATERING_CAN }));
    playerTile.addTag(GAME_TAGS.WATERD);
  }
};

const handleAxeUse = (lsc: ILeanScopeClient, soundEffectEntity: Entity) => {
  const treeEntities = lsc.engine.entities.filter((e) => e.get(TextTypeFacet)?.props.type === ENVIRONMENT_OBJECTS.TREE);
  const playerEntity = lsc.engine.entities.find((e) => e.has(HealthFacet) && e.has(PositionFacet));
  const positionX = playerEntity?.get(PositionFacet)?.props.positionX;
  const positionY = playerEntity?.get(PositionFacet)?.props.positionY;

  if (positionX && positionY) {
    const treeEntity = treeEntities.find((tree) => {
      const treeLeft = tree.get(PositionFacet)?.props.positionX! - TILE_SIZE;
      const treeRight = tree.get(PositionFacet)?.props.positionX! + TILE_SIZE;
      const treeTop = tree.get(PositionFacet)?.props.positionY! - TILE_SIZE * 2;
      const treeBottom = tree.get(PositionFacet)?.props.positionY! + TILE_SIZE;

      return positionX >= treeLeft && positionX <= treeRight && positionY >= treeTop && positionY <= treeBottom;
    });

    if (treeEntity) {
      soundEffectEntity.add(new SoundEffectFacet({ soundEffect: SOUND_EFFECTS.AXE }));
      if (treeEntity.hasTag(GAME_TAGS.HITED)) {
        treeEntity.remove(TreeFruitFacet);
        treeEntity.addTag(GAME_TAGS.CUT);
      } else {
        treeEntity.addTag(GAME_TAGS.HITED);
      }
    }
  }
};

const handleToolUse = (
  playerTile: Entity | undefined,
  toolName: TOOL_NAMES,
  lsc: ILeanScopeClient,
  soundEffectEntity: Entity | undefined,
) => {
  if (soundEffectEntity) {
    switch (toolName) {
      case TOOL_NAMES.HOE:
        handleHoeUse(playerTile, soundEffectEntity);
        break;
      case TOOL_NAMES.WATERING_CAN:
        handleWateringCanUse(playerTile, soundEffectEntity);
        break;
      case TOOL_NAMES.AXE:
        handleAxeUse(lsc, soundEffectEntity);
        break;

      default:
        break;
    }
  }
};

const handleSeedUse = (playerTile: Entity | undefined, seedName: SEED_NAMES, handleRemoveEntity: (itemGroup: SEED_NAMES) => void) => {
  const hasTileSeed = playerTile?.get(TileCropFacet)?.props.tileCropName !== undefined;

  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.FARMLAND && !hasTileSeed) {
    playerTile.add(new TileCropFacet({ tileCropName: seedName, growthStage: INITIAL_CROP_GROWTH_STAGE }));
    handleRemoveEntity(seedName);
  }
};

const handleTryReapCrop = (playerTile: Entity | undefined, lsc: ILeanScopeClient): boolean => {
  const soundEffectEntity = lsc.engine.entities.find((e) => e.has(SoundEffectFacet));
  if (playerTile && playerTile.get(TileCropFacet)?.props.growthStage === MAX_CROP_GROWTH_STAGE) {
    soundEffectEntity?.add(new SoundEffectFacet({ soundEffect: SOUND_EFFECTS.ITEM_COLLECT }));
    switch (playerTile.get(TileCropFacet)?.props.tileCropName) {
      case SEED_NAMES.WHEAT_SEED:
        for (let i = 0; i < 3; i++) {
          const wheatSeedEntity = new Entity();
          lsc.engine.addEntity(wheatSeedEntity);
          wheatSeedEntity.addComponent(new IdentifierFacet({ guid: v4() }));
          wheatSeedEntity.addComponent(new TitleFacet({ title: CROP_NAMES.WHEAT }));
          wheatSeedEntity.addComponent(new ItemGroupFacet({ group: ITEM_GROUPS.CROPS }));
        }
        break;

      default:
        break;
    }
    playerTile.remove(TileCropFacet);
    return true;
  }
  return false;
};

const removeHits = (lsc: ILeanScopeClient) => {
  const hitedTrees = lsc.engine.entities.filter((e) => e.hasTag(GAME_TAGS.HITED));
  hitedTrees.forEach((tree) => {
    tree.removeTag(GAME_TAGS.HITED);
  });
};

const handleTryReapFruit = (selectedTool: TOOL_NAMES, lsc: ILeanScopeClient): boolean => {
  const treeEntities = lsc.engine.entities.filter((e) => e.get(TextTypeFacet)?.props.type === ENVIRONMENT_OBJECTS.TREE);
  const playerEntity = lsc.engine.entities.find((e) => e.has(HealthFacet) && e.has(PositionFacet));
  const positionX = playerEntity?.get(PositionFacet)?.props.positionX;
  const positionY = playerEntity?.get(PositionFacet)?.props.positionY;

  if (positionX && positionY) {
    const treeEntity = treeEntities.find((tree) => {
      const treeLeft = tree.get(PositionFacet)?.props.positionX! - TILE_SIZE;
      const treeRight = tree.get(PositionFacet)?.props.positionX! + TILE_SIZE;
      const treeTop = tree.get(PositionFacet)?.props.positionY! - TILE_SIZE * 2;
      const treeBottom = tree.get(PositionFacet)?.props.positionY! + TILE_SIZE;

      return positionX >= treeLeft && positionX <= treeRight && positionY >= treeTop && positionY <= treeBottom;
    });

    if (treeEntity && treeEntity.get(TreeFruitFacet)?.props.growthStage === MAX_TREE_FRUIT_GROWTH_STAGE) {
      switch (treeEntity.get(TreeFruitFacet)?.props.fruitName) {
        case FRUIT_NAMES.APPLE:
          for (let i = 0; i < 3; i++) {
            const appleItemEntity = new Entity();
            lsc.engine.addEntity(appleItemEntity);
            appleItemEntity.addComponent(new IdentifierFacet({ guid: v4() }));
            appleItemEntity.addComponent(new TitleFacet({ title: FRUIT_NAMES.APPLE }));
            appleItemEntity.addComponent(new ItemGroupFacet({ group: ITEM_GROUPS.FRUITS }));
          }
          break;

        default:
          break;
      }

      treeEntity.add(new TreeFruitFacet({ growthStage: INITIAL_FRUIT_GROWTH_STAGE, fruitName: FRUIT_NAMES.APPLE }));
      if (selectedTool !== TOOL_NAMES.AXE) return true;
    }
  }
  return false;
};

const handleTryPickUpWeeds = (playerTile: Entity | undefined, lsc: ILeanScopeClient): boolean => {
  const soundEffectEntity = lsc.engine.entities.find((e) => e.has(SoundEffectFacet));
  const weedEntities = lsc.engine.entities.filter((e) => e.get(TextTypeFacet)?.props.type === ENVIRONMENT_OBJECTS.WEED);
  const weedEntityOnPlayerPosition = weedEntities.find(
    (e) =>
      e.get(PositionFacet)?.props.positionX === playerTile?.get(PositionFacet)?.props.positionX &&
      e.get(PositionFacet)?.props.positionY === playerTile?.get(PositionFacet)?.props.positionY,
  );

  if (weedEntityOnPlayerPosition) {
    soundEffectEntity?.add(new SoundEffectFacet({ soundEffect: SOUND_EFFECTS.ITEM_COLLECT }));
    const newWeedItemEntity = new Entity();
    lsc.engine.addEntity(newWeedItemEntity);
    newWeedItemEntity.addComponent(new IdentifierFacet({ guid: v4() }));
    newWeedItemEntity.addComponent(new TitleFacet({ title: OTHER_ITEM_NAMES.WEED }));
    newWeedItemEntity.addComponent(new ItemGroupFacet({ group: ITEM_GROUPS.OTHER }));

    lsc.engine.removeEntity(weedEntityOnPlayerPosition);

    return true;
  }
  return false;
};

const PlayerActionSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [playerTile] = useEntity((e) => e.has(PositionFacet) && e.has(GAME_TAGS.PLAYER_TILE));
  const [items] = useEntities((e) => e.has(ItemGroupFacet));
  const [soundEffectEntity] = useEntity((e) => e.has(SoundEffectFacet));

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
        if (handleTryPickUpWeeds(playerTile, lsc)) {
          return;
        }
        if (handleTryReapCrop(playerTile, lsc)) {
          return;
        }
        if (handleTryReapFruit(selectedItemName as TOOL_NAMES, lsc)) {
          return;
        }
        switch (selectedItemGroup) {
          case ITEM_GROUPS.TOOLS:
            handleToolUse(playerTile, selectedItemName as TOOL_NAMES, lsc, soundEffectEntity);
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
      setTimeout(() => {
        removeHits(lsc);
      }, 8000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, playerTile]);

  return <></>;
};

export default PlayerActionSystem;
