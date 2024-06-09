import { useContext, useEffect } from 'react';
import { useSelectedItem } from '../hooks/useSelectedItem';
import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity, useEntity } from '@leanscope/ecs-engine';
import { TextTypeFacet, PositionFacet } from '@leanscope/ecs-models';
import { SoundEffectFacet, HealthFacet, TreeFruitFacet } from '../app/GameFacets';
import { TILE_SIZE } from '../base/constants';
import { TerrainTiles, SoundEffects, AdditionalTags, EnvironmentObjects, ToolNames } from '../base/enums';
import { LeanScopeClientContext } from '@leanscope/api-client/node';

const handleHoeUse = (playerTile: Entity | undefined, soundEffectEntity: Entity) => {
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TerrainTiles.GRASS) {
    soundEffectEntity.add(new SoundEffectFacet({ soundEffect: SoundEffects.HOE }));
    playerTile.add(new TextTypeFacet({ type: TerrainTiles.FARMLAND }));
  }
};

const handleWateringCanUse = (playerTile: Entity | undefined, soundEffectEntity: Entity) => {
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TerrainTiles.FARMLAND) {
    soundEffectEntity.add(new SoundEffectFacet({ soundEffect: SoundEffects.WATERING_CAN }));
    playerTile.addTag(AdditionalTags.WATERD);
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
      if (treeEntity.hasTag(AdditionalTags.HITED)) {
        treeEntity.remove(TreeFruitFacet);
        treeEntity.addTag(AdditionalTags.CUT);
      } else {
        treeEntity.addTag(AdditionalTags.HITED);
      }
    }
  }
};

const PlayerToolUseSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [soundEffectEntity] = useEntity((e) => e.has(SoundEffectFacet));
  const [playerTile] = useEntity((e) => e.has(PositionFacet) && e.has(AdditionalTags.PLAYER_TILE));
  const { selectedItemName } = useSelectedItem();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === ' ') {
        if (soundEffectEntity) {
          switch (selectedItemName) {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lsc, soundEffectEntity, playerTile, selectedItemName]);

  return null;
};

export default PlayerToolUseSystem;
