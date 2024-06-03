import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { v4 } from 'uuid';
import { SoundEffectFacet, TimeFacet } from '../app/GameFacets';
import { START_TIME } from '../base/constants';
import { GameTags } from '../base/enums';

const GameEntitiesInitializationSystem = () => {
  return (
    <div>
      <EntityCreator
        facets={[new IdentifierFacet({ guid: v4() }), new TimeFacet({ time: START_TIME, day: 0 })]}
        tags={[GameTags.GAME_OBJECT]}
      />
      <EntityCreator
        facets={[new IdentifierFacet({ guid: v4() }), new SoundEffectFacet({ soundEffect: null })]}
        tags={[GameTags.GAME_OBJECT]}
      />
    </div>
  );
};

export default GameEntitiesInitializationSystem;
