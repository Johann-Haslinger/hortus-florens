import React, { useContext, useEffect } from 'react';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { mapData } from '../components/map/mapData';

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
