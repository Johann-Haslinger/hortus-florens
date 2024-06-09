import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntities, useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { v4 } from 'uuid';
import { ItemGroupFacet, SoundEffectFacet, TileCropFacet, TitleFacet } from '../app/GameFacets';
import { INITIAL_CROP_GROWTH_STAGE, MAX_CROP_GROWTH_STAGE } from '../base/constants';
import {
  AdditionalTags,
  CropNames,
  EnvironmentObjects,
  ItemGroups,
  OtherItemNames,
  SeedNames,
  SoundEffects,
  TerrainTiles,
} from '../base/enums';
import { useSelectedItem } from '../hooks/useSelectedItem';

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
  const hitedTrees = lsc.engine.entities.filter((e) => e.hasTag(AdditionalTags.HITED));
  hitedTrees.forEach((tree) => {
    tree.removeTag(AdditionalTags.HITED);
  });
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
  const [playerTile] = useEntity((e) => e.has(PositionFacet) && e.has(AdditionalTags.PLAYER_TILE));
  const [items] = useEntities((e) => e.has(ItemGroupFacet));
  const [soundEffectEntity] = useEntity((e) => e.has(SoundEffectFacet));
  const { selectedItemName, selectedItemGroup, selectedItem } = useSelectedItem();

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

        switch (selectedItemGroup) {
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

  return null;
};

export default PlayerActionSystem;
