import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useContext, useEffect } from 'react';
import { v4 } from 'uuid';
import { mapData } from '../components/map/mapData';

const TilesInitializationSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    if (lsc) {
      mapData.forEach((row, y) => {
        row.forEach(
          (tile, x) =>
            tile.terrainType !== '' &&
            lsc.entities.create({
              positionX: x,
              positionY: mapData.length - y,
              positionZ: 0,

              type: tile.terrainType,
              guid: v4(),
            }),
        );
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

export default TilesInitializationSystem;
