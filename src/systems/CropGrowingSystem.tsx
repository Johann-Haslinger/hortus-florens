import { Entity, UpdateOnRenderSystem, useEntities, useEntity } from '@leanscope/ecs-engine';
import React, { useEffect } from 'react';
import { TileCropFacet, TimeFacet } from '../app/GameFacets';
import { GAME_TAGS } from '../base/enums';

const CropGrowingSystem = () => {
  const [timeEntity] = useEntity((e) => e.has(TimeFacet));
  const [tileEntitiesWithCrops] = useEntities((e) => e.has(TileCropFacet));
  const currentTime = timeEntity?.get(TimeFacet)?.props.time || 1

  const handleIncreaseGrowthStage = () => {
    tileEntitiesWithCrops.filter((e)=> e.hasTag(GAME_TAGS.WATERD)).forEach((entity) => {
      if (entity.get(TileCropFacet)?.props.growthStage && entity.get(TileCropFacet)!.props.growthStage < 3) {
        entity.remove(GAME_TAGS.WATERD);
        entity.add(
          new TileCropFacet({
            growthStage: entity.get(TileCropFacet)!.props.growthStage + 1,
            tileCropName: entity.get(TileCropFacet)!.props.tileCropName,
          }),
        );
      }
    });
  };

  useEffect(() => {
    if (currentTime >= 0 && currentTime < 1) {
      handleIncreaseGrowthStage();
    }
  }, [currentTime]);

  return <></>;
};

export default CropGrowingSystem;

// export class CropGrowingSystem extends UpdateOnRenderSystem {
//   constructor() {
//     super(CropGrowingSystem.name, (e) => e.has(TileCropFacet) && e.hasTag(GAME_TAGS.WATERD));
//   }
//   protected handleIncreaseGrowthStage(entity: Entity): void {
//     if (entity.get(TileCropFacet)?.props.growthStage && entity.get(TileCropFacet)!.props.growthStage < 3) {
//       entity.remove(GAME_TAGS.WATERD);
//       entity.add(
//         new TileCropFacet({
//           growthStage: entity.get(TileCropFacet)!.props.growthStage + 1,
//           tileCropName: entity.get(TileCropFacet)!.props.tileCropName,
//         }),
//       );
//     }
//   }

//   protected updateEntity(entity: Entity, _dt: number): void {
//     const timeEntity = this.engine.entities.find((e) => e.has(TimeFacet) && e.hasTag(GAME_TAGS.GAME_OBJECT));
//     const currentTime = timeEntity?.get(TimeFacet)?.props.time || 1;

//     // create a system semaphore to indicate, that this system is working on the entity
//     // to avoid re-entries

//     if (entity.hasTag(this.constructor.name)) {
//       return;
//     }

//     if (currentTime >= 0 && currentTime < 1) {
//       this.handleIncreaseGrowthStage(entity);
//     }

//     entity.addTag(this.constructor.name);
//   }
// }
