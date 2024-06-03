import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntities, useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { v4 } from 'uuid';
import { HealthFacet, ItemGroupFacet, SoundEffectFacet, TileCropFacet, TitleFacet, TreeFruitFacet } from '../app/GameFacets';
import {
  INITIAL_CROP_GROWTH_STAGE,
  INITIAL_FRUIT_GROWTH_STAGE,
  MAX_CROP_GROWTH_STAGE,
  MAX_TREE_FRUIT_GROWTH_STAGE,
  TILE_SIZE,
} from '../base/constants';
import {
  CropNames,
  EnvironmentObjects,
  FruitNames,
  GameTags,
  ItemGroups,
  OtherItemNames,
  SeedNames,
  SoundEffects,
  TerrainTiles,
  ToolNames,
} from '../base/enums';

const handleHoeUse = (playerTile: Entity | undefined, soundEffectEntity: Entity) => {
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TerrainTiles.GRASS) {
    soundEffectEntity.add(new SoundEffectFacet({ soundEffect: SoundEffects.HOE }));
    playerTile.add(new TextTypeFacet({ type: TerrainTiles.FARMLAND }));
  }
};

const handleWateringCanUse = (playerTile: Entity | undefined, soundEffectEntity: Entity) => {
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TerrainTiles.FARMLAND) {
    soundEffectEntity.add(new SoundEffectFacet({ soundEffect: SoundEffects.WATERING_CAN }));
    playerTile.addTag(GameTags.WATERD);
  }
};

const handleAxeUse = (lsc: ILeanScopeClient, soundEffectEntity: Entity) => {
  const treeEntities = lsc.engine.entities.filter((e) => e.get(TextTypeFacet)?.props.type === EnvironmentObjects.TREE);
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
      soundEffectEntity.add(new SoundEffectFacet({ soundEffect: SoundEffects.AXE }));
      if (treeEntity.hasTag(GameTags.HITED)) {
        treeEntity.remove(TreeFruitFacet);
        treeEntity.addTag(GameTags.CUT);
      } else {
        treeEntity.addTag(GameTags.HITED);
      }
    }
  }
};

const handleToolUse = (
  playerTile: Entity | undefined,
  toolName: ToolNames,
  lsc: ILeanScopeClient,
  soundEffectEntity: Entity | undefined,
) => {
  if (soundEffectEntity) {
    switch (toolName) {
      case ToolNames.HOE:
        handleHoeUse(playerTile, soundEffectEntity);
        break;
      case ToolNames.WATERING_CAN:
        handleWateringCanUse(playerTile, soundEffectEntity);
        break;
      case ToolNames.AXE:
        handleAxeUse(lsc, soundEffectEntity);
        break;

      default:
        break;
    }
  }
};

const handleSeedUse = (
  playerTile: Entity | undefined,
  seedName: SeedNames,
  handleRemoveEntity: (itemGroup: SeedNames) => void,
  soundEffectEntity?: Entity,
) => {
  const hasTileSeed = playerTile?.get(TileCropFacet)?.props.tileCropName !== undefined;

  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TerrainTiles.FARMLAND && !hasTileSeed) {
    soundEffectEntity?.add(new SoundEffectFacet({ soundEffect: SoundEffects.PLANT_SEED }));
    playerTile.add(new TileCropFacet({ tileCropName: seedName, growthStage: INITIAL_CROP_GROWTH_STAGE }));
    handleRemoveEntity(seedName);
  }
};

const handleTryReapCrop = (playerTile: Entity | undefined, lsc: ILeanScopeClient): boolean => {
  const soundEffectEntity = lsc.engine.entities.find((e) => e.has(SoundEffectFacet));
  if (playerTile && playerTile.get(TileCropFacet)?.props.growthStage === MAX_CROP_GROWTH_STAGE) {
    soundEffectEntity?.add(new SoundEffectFacet({ soundEffect: SoundEffects.ITEM_COLLECT }));
    switch (playerTile.get(TileCropFacet)?.props.tileCropName) {
      case SeedNames.WHEAT_SEED:
        for (let i = 0; i < 3; i++) {
          const wheatSeedEntity = new Entity();
          lsc.engine.addEntity(wheatSeedEntity);
          wheatSeedEntity.addComponent(new IdentifierFacet({ guid: v4() }));
          wheatSeedEntity.addComponent(new TitleFacet({ title: CropNames.WHEAT }));
          wheatSeedEntity.addComponent(new ItemGroupFacet({ group: ItemGroups.CROPS }));
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
  const hitedTrees = lsc.engine.entities.filter((e) => e.hasTag(GameTags.HITED));
  hitedTrees.forEach((tree) => {
    tree.removeTag(GameTags.HITED);
  });
};

const handleTryReapFruit = (selectedTool: ToolNames, lsc: ILeanScopeClient): boolean => {
  const treeEntities = lsc.engine.entities.filter((e) => e.get(TextTypeFacet)?.props.type === EnvironmentObjects.TREE);
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
        case FruitNames.APPLE:
          for (let i = 0; i < 3; i++) {
            const appleItemEntity = new Entity();
            lsc.engine.addEntity(appleItemEntity);
            appleItemEntity.addComponent(new IdentifierFacet({ guid: v4() }));
            appleItemEntity.addComponent(new TitleFacet({ title: FruitNames.APPLE }));
            appleItemEntity.addComponent(new ItemGroupFacet({ group: ItemGroups.FRUITS }));
          }
          break;

        default:
          break;
      }

      treeEntity.add(new TreeFruitFacet({ growthStage: INITIAL_FRUIT_GROWTH_STAGE, fruitName: FruitNames.APPLE }));
      if (selectedTool !== ToolNames.AXE) return true;
    }
  }
  return false;
};

const handleTryPickUpWeeds = (playerTile: Entity | undefined, lsc: ILeanScopeClient): boolean => {
  const soundEffectEntity = lsc.engine.entities.find((e) => e.has(SoundEffectFacet));
  const weedEntities = lsc.engine.entities.filter((e) => e.get(TextTypeFacet)?.props.type === EnvironmentObjects.WEED);
  const weedEntityOnPlayerPosition = weedEntities.find(
    (e) =>
      e.get(PositionFacet)?.props.positionX === playerTile?.get(PositionFacet)?.props.positionX &&
      e.get(PositionFacet)?.props.positionY === playerTile?.get(PositionFacet)?.props.positionY,
  );

  if (weedEntityOnPlayerPosition) {
    soundEffectEntity?.add(new SoundEffectFacet({ soundEffect: SoundEffects.ITEM_COLLECT }));
    const newWeedItemEntity = new Entity();
    lsc.engine.addEntity(newWeedItemEntity);
    newWeedItemEntity.addComponent(new IdentifierFacet({ guid: v4() }));
    newWeedItemEntity.addComponent(new TitleFacet({ title: OtherItemNames.WEED }));
    newWeedItemEntity.addComponent(new ItemGroupFacet({ group: ItemGroups.OTHER }));

    lsc.engine.removeEntity(weedEntityOnPlayerPosition);

    return true;
  }
  return false;
};

const PlayerActionSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [playerTile] = useEntity((e) => e.has(PositionFacet) && e.has(GameTags.PLAYER_TILE));
  const [items] = useEntities((e) => e.has(ItemGroupFacet));
  const [soundEffectEntity] = useEntity((e) => e.has(SoundEffectFacet));

  const [selectedItem] = useEntity((e) => e.has(ItemGroupFacet) && e.hasTag(Tags.SELECTED));
  const selectedItemName = selectedItem?.get(TitleFacet)?.props.title;
  const selectedItemGroup = selectedItem?.get(ItemGroupFacet)?.props.group;

  const handleRemoveSelectedItem = (itemTitle: SeedNames) => {
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
      if (e.key === 'e') {
        if (handleTryPickUpWeeds(playerTile, lsc)) {
          return;
        }
        if (handleTryReapCrop(playerTile, lsc)) {
          return;
        }
        if (handleTryReapFruit(selectedItemName as ToolNames, lsc)) {
          return;
        }
        switch (selectedItemGroup) {
          case ItemGroups.TOOLS:
            handleToolUse(playerTile, selectedItemName as ToolNames, lsc, soundEffectEntity);
            break;
          case ItemGroups.SEEDS:
            handleSeedUse(playerTile, selectedItemName as SeedNames, handleRemoveSelectedItem, soundEffectEntity);
            break;
          case ItemGroups.CROPS:
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
