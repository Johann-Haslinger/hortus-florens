import React from 'react';
import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, StoryFacet, Tags } from '@leanscope/ecs-models';
import { STORY_GUID } from '../base/enums';

const StoryInitializationSystem = () => {
  return (
    <>
      <EntityCreator
        facetClasses={[StoryFacet]}
        facets={[
          new IdentifierFacet({
            guid: STORY_GUID.PLAY_GAME,
            displayName: STORY_GUID.PLAY_GAME,
          }),
        ]}
        tags={[Tags.CURRENT]}
      />
      <EntityCreator
        facetClasses={[StoryFacet]}
        facets={[
          new IdentifierFacet({
            guid: STORY_GUID.PAUSE_GAME,
            displayName: STORY_GUID.PAUSE_GAME,
          }),
        ]}
      />
      <EntityCreator
        facetClasses={[StoryFacet]}
        facets={[
          new IdentifierFacet({
            guid: STORY_GUID.OBSERVING_INVENTORY,
            displayName: STORY_GUID.OBSERVING_INVENTORY,
          }),
        ]}
      />
    </>
  );
};

export default StoryInitializationSystem;
