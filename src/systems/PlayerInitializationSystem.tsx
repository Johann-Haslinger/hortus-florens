import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { HealthFacet } from '../app/GameFacets';
import { GAME_TAGS } from '../base/enums';
import { PLAYER_START_POSITION } from '../base/constants';

const PlayerInitializationSystem = () => {
  return (
    <EntityCreator
      facets={[
        new PositionFacet({ positionX: PLAYER_START_POSITION.x,  positionY: PLAYER_START_POSITION.y, positionZ: 0 }),
        new TextTypeFacet({ type: 'player' }),
        new HealthFacet({ healthValue: [100, 100] }),
        new IdentifierFacet({ guid: 'player' }),
      ]}
      tags={[Tags.CURRENT, GAME_TAGS.PLAYER]}
    />
  );
};

export default PlayerInitializationSystem;
