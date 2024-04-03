import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, TextTypeFacet } from '@leanscope/ecs-models';
import React, { useContext } from 'react';
import { ENVIRONMENT_OBJECTS, FRUIT_NAMES, GAME_TAGS, TREE_NAMES } from '../base/enums';
import { v4 } from 'uuid';
import { TitleFacet, TreeFruitFacet } from '../app/GameFacets';

const EnironmentObjectsInitializationSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  return (
    <>
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new PositionFacet({ positionX: 6, positionY: 6, positionZ: 0 }),
          new TextTypeFacet({ type: ENVIRONMENT_OBJECTS.TREE }),
          new TitleFacet({ title: TREE_NAMES.APPLE }),
          new TreeFruitFacet({ fruitName: FRUIT_NAMES.APPLE, growthStage: 4 }),
        ]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new PositionFacet({ positionX: 4, positionY: 7, positionZ: 0 }),
          new TextTypeFacet({ type: ENVIRONMENT_OBJECTS.TREE }),
          new TitleFacet({ title: TREE_NAMES.APPLE }),
          new TreeFruitFacet({ fruitName: FRUIT_NAMES.APPLE, growthStage: 4 }),
        ]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new PositionFacet({ positionX: 5, positionY: 5, positionZ: 0 }),
          new TextTypeFacet({ type: ENVIRONMENT_OBJECTS.TREE }),
          new TreeFruitFacet({ fruitName: FRUIT_NAMES.APPLE, growthStage: 4 }),
        ]}
      />
    </>
  );
};

export default EnironmentObjectsInitializationSystem;
