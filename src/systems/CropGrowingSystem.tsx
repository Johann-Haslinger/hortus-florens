import { useEntities, useEntity } from '@leanscope/ecs-engine';
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
