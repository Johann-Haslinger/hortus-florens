import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, TextTypeFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { v4 } from 'uuid';
import { TitleFacet, TreeFruitFacet } from '../app/GameFacets';
import { MAX_TREE_FRUIT_GROWTH_STAGE } from '../base/constants';
import { EnvironmentObjects, FlowerNames, FruitNames, RockNames, TreeNames, WeedNames } from '../base/enums';
import { mapData } from '../components/map/mapData';

const EnironmentObjectsInitializationSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    if (lsc) {
      mapData.forEach((row, y) => {
        row.forEach((tile, x) => {
          if (tile.enviromentObject !== '') {
            const newntity = new Entity();
            lsc.engine.addEntity(newntity);
            newntity.add(new IdentifierFacet({ guid: v4() }));
            newntity.add(new PositionFacet({ positionX: x, positionY: mapData.length - y, positionZ: 0 }));

            if (tile.enviromentObject === EnvironmentObjects.TREE) {
              newntity.add(new TextTypeFacet({ type: tile.enviromentObject }));
              newntity.add(new TitleFacet({ title: TreeNames.APPLE }));
              newntity.add(new TreeFruitFacet({ fruitName: FruitNames.APPLE, growthStage: MAX_TREE_FRUIT_GROWTH_STAGE }));
            }

            if (tile.enviromentObject === FlowerNames.SUNFLOWER) {
              newntity.add(new TextTypeFacet({ type: EnvironmentObjects.FLOWER }));
              newntity.add(new TitleFacet({ title: FlowerNames.SUNFLOWER }));
            }

            if (tile.enviromentObject === RockNames.STONE_1) {
              newntity.add(new TextTypeFacet({ type: EnvironmentObjects.ROCK }));
              newntity.add(new TitleFacet({ title: RockNames.STONE_1 }));
            }
            if (tile.enviromentObject === WeedNames.WEED_1 || tile.enviromentObject === WeedNames.WEED_2) {
              newntity.add(new TextTypeFacet({ type: EnvironmentObjects.WEED }));
              newntity.add(new TitleFacet({ title: tile.enviromentObject }));
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

  return null;
};

export default EnironmentObjectsInitializationSystem;
