import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, TextTypeFacet } from '@leanscope/ecs-models';
import React, { useContext, useEffect } from 'react';
import { ENVIRONMENT_OBJECTS, FLOWER_NAMES, FRUIT_NAMES, GAME_TAGS, ROCK_NAMES, TREE_NAMES, WEED_NAMES } from '../base/enums';
import { v4 } from 'uuid';
import { TitleFacet, TreeFruitFacet } from '../app/GameFacets';
import { mapData } from '../components/map/mapData';
import { MAX_TREE_FRUIT_GROWTH_STAGE } from '../base/constants';

const EnironmentObjectsInitializationSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    if (lsc) {
      mapData.reverse().forEach((row, y) => {
        row.forEach((tile, x) => {
          if (tile.enviromentObject !== '') {
            const newntity = new Entity();
            lsc.engine.addEntity(newntity);
            newntity.add(new IdentifierFacet({ guid: v4() }));
            newntity.add(new PositionFacet({ positionX: x, positionY: mapData.length - y, positionZ: 0 }));

            if (tile.enviromentObject === ENVIRONMENT_OBJECTS.TREE) {
              newntity.add(new TextTypeFacet({ type: tile.enviromentObject }));
              newntity.add(new TitleFacet({ title: TREE_NAMES.APPLE }));
              newntity.add(new TreeFruitFacet({ fruitName: FRUIT_NAMES.APPLE, growthStage: MAX_TREE_FRUIT_GROWTH_STAGE }));
            }

            if (tile.enviromentObject === FLOWER_NAMES.SUNFLOWER) {
              newntity.add(new TextTypeFacet({ type: ENVIRONMENT_OBJECTS.FLOWER }));
              newntity.add(new TitleFacet({ title: FLOWER_NAMES.SUNFLOWER }));
            }

            if (tile.enviromentObject === ROCK_NAMES.STONE_1) {
              newntity.add(new TextTypeFacet({ type: ENVIRONMENT_OBJECTS.ROCK }));
              newntity.add(new TitleFacet({ title: ROCK_NAMES.STONE_1 }));
            }
            if (tile.enviromentObject === WEED_NAMES.WEED_1 || tile.enviromentObject === WEED_NAMES.WEED_2) {
              newntity.add(new TextTypeFacet({ type: ENVIRONMENT_OBJECTS.WEED }));
              newntity.add(new TitleFacet({ title:tile.enviromentObject}));
            }
          }
        });
      });
    }

    return () => {
      if (lsc) {
        [...lsc.engine.entities].forEach((tile) => {
          lsc.engine.removeEntity(tile);
        });
      }
    };
  }, []);

  return <></>;
};

export default EnironmentObjectsInitializationSystem;
