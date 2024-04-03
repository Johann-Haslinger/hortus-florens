import { EntityCreator } from '@leanscope/ecs-engine';
import React from 'react';
import { TimeFacet } from '../app/GameFacets';
import { GAME_TAGS } from '../base/enums';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { v4 } from 'uuid';
import { START_TIME } from '../base/constants';

const GameEntitiesInitializationSystem = () => {
  return (
    <>
      <EntityCreator facets={[new IdentifierFacet({ guid: v4() }), new TimeFacet({ time: START_TIME, day: 0 })]} tags={[GAME_TAGS.GAME_OBJECT]} />
    </>
  );
};

export default GameEntitiesInitializationSystem;
