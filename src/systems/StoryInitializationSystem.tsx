import React from 'react';
import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, StoryFacet, Tags } from '@leanscope/ecs-models';
import { StoryGuid } from '../types/enums';

const StoryInitializationSystem = () => {
  return (
    <>
      <EntityCreator
        facetClasses={[StoryFacet]}
        facets={[
          new IdentifierFacet({
            guid: StoryGuid.PLAY_GAME,
            displayName: StoryGuid.PLAY_GAME,
          }),
        ]}
        tags={[Tags.CURRENT]}
      />
      <EntityCreator
        facetClasses={[StoryFacet]}
        facets={[
          new IdentifierFacet({
            guid: StoryGuid.PAUSE_GAME,
            displayName: StoryGuid.PAUSE_GAME,
          }),
        ]}
      />
      <EntityCreator
        facetClasses={[StoryFacet]}
        facets={[
          new IdentifierFacet({
            guid: StoryGuid.OBSERVING_INVENTORY,
            displayName: StoryGuid.OBSERVING_INVENTORY,
          }),
        ]}
      />
    </>
  );
};

export default StoryInitializationSystem;
