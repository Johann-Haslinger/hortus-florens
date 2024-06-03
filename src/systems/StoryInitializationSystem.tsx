import React from 'react';
import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, StoryFacet, Tags } from '@leanscope/ecs-models';
import { Stories } from '../base/enums';

const StoryInitializationSystem = () => {
  return (
    <>
      <EntityCreator
        facetClasses={[StoryFacet]}
        facets={[
          new IdentifierFacet({
            guid: Stories.PLAY_GAME,
            displayName: Stories.PLAY_GAME,
          }),
        ]}
        tags={[Tags.CURRENT]}
      />
      <EntityCreator
        facetClasses={[StoryFacet]}
        facets={[
          new IdentifierFacet({
            guid: Stories.PAUSE_GAME,
            displayName: Stories.PAUSE_GAME,
          }),
        ]}
      />
      <EntityCreator
        facetClasses={[StoryFacet]}
        facets={[
          new IdentifierFacet({
            guid: Stories.OBSERVING_INVENTORY,
            displayName: Stories.OBSERVING_INVENTORY,
          }),
        ]}
      />
    </>
  );
};

export default StoryInitializationSystem;
