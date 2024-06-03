import { useEntities, useEntity } from '@leanscope/ecs-engine';
import { useEffect } from 'react';
import { TileCropFacet, TimeFacet } from '../app/GameFacets';
import { GameTags } from '../base/enums';

const CropGrowingSystem = () => {
  const [timeEntity] = useEntity((e) => e.has(TimeFacet));
  const [tileEntitiesWithCrops] = useEntities((e) => e.has(TileCropFacet));
  const currentTime = timeEntity?.get(TimeFacet)?.props.time || 1;

  const handleIncreaseGrowthStage = () => {
    tileEntitiesWithCrops
      .filter((e) => e.hasTag(GameTags.WATERD))
      .forEach((entity) => {
        if (entity.get(TileCropFacet)?.props.growthStage && entity.get(TileCropFacet)!.props.growthStage < 3) {
          entity.remove(GameTags.WATERD);
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

  return null;
};

export default CropGrowingSystem;
