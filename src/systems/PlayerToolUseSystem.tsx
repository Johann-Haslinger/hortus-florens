import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntity } from '@leanscope/ecs-engine';
import { PositionFacet, TextTypeFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { SoundEffectFacet, TreeFruitFacet } from '../app/GameFacets';
import { AdditionalTags, EnvironmentObjects, SoundEffects, TerrainTiles, ToolNames } from '../base/enums';
import { useSelectedItem } from '../hooks/useSelectedItem';

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
  const collidingWithPlayerTree = lsc.engine.entities.find(
    (e) => e.has(AdditionalTags.COLLIDING_WITH_PLAYER) && e.get(TextTypeFacet)?.props.type === EnvironmentObjects.TREE,
  );

  if (collidingWithPlayerTree) {
    soundEffectEntity.add(new SoundEffectFacet({ soundEffect: SoundEffects.AXE }));
    if (collidingWithPlayerTree.hasTag(AdditionalTags.HITED)) {
      collidingWithPlayerTree.remove(TreeFruitFacet);
      collidingWithPlayerTree.addTag(AdditionalTags.CUT);
    } else {
      collidingWithPlayerTree.addTag(AdditionalTags.HITED);
    }

    const treeFruitProps = collidingWithPlayerTree?.get(TreeFruitFacet)?.props;

    if (treeFruitProps) {
      const { growthStage, fruitName } = treeFruitProps;
      if (growthStage === 4) {
        collidingWithPlayerTree.add(new TreeFruitFacet({ growthStage: 0, fruitName }));

        for (let i = 0; i < 3; i++) {
          const newWorldAppleItems = new Entity();
          lsc.engine.addEntity(newWorldAppleItems);
        
        }
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
