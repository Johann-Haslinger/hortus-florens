import React, { useContext, useEffect } from 'react';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { mapData } from '../components/map/mapData';
import { ENVIRONMENT_OBJECTS } from '../base/enums';
import { v4 } from 'uuid';

const TilesInitializationSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    if (lsc) {
      mapData.forEach((tile) => {
        lsc.entities.create({
          positionX: tile.x,
          positionY: tile.y,
          positionZ: 0,

          type: tile.type,
          guid: tile.id,
          // tags: [Tags.SELECTED],
        });
      });
    }
    lsc.entities.create({
      positionX: 6,
      positionY: 6,
      positionZ: 0,
      type: ENVIRONMENT_OBJECTS.TREE,
      guid: v4(),
    });
    lsc.entities.create({
      positionX: 4,
      positionY: 7,
      positionZ: 0,
      type: ENVIRONMENT_OBJECTS.TREE,
      guid: v4(),
    });
    lsc.entities.create({
      positionX: 5,
      positionY: 5,
      positionZ: 0,
      type: ENVIRONMENT_OBJECTS.TREE,
      guid: v4(),
    });

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

export default TilesInitializationSystem;
