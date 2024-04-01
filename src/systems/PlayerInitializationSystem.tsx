import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { HealthFacet } from '../app/GameFacets';

const PlayerInitializationSystem = () => {
  return (
    <EntityCreator
      facets={[
        new PositionFacet({ positionX: 3, positionY: 3, positionZ: 0 }),
        new TextTypeFacet({ type: 'player' }),
        new HealthFacet({ healthValue: [100, 100] }),
        new IdentifierFacet({ guid: 'player' }),
      ]}
      tags={[Tags.CURRENT]}
    />
  );
};

export default PlayerInitializationSystem;
