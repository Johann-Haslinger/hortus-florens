import FullScreenCanvas from './FullscreenCanvas';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import { EntityPropsMapper, SystemCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, TextTypeFacet } from '@leanscope/ecs-models';
import TerrainTile from './TerrainTile';
import TilesInitializationSystem from '../../systems/TilesInitializationSystem';
import PlayerInitializationSystem from '../../systems/PlayerInitializationSystem';
import { TILE_SIZE, VALID_ENVITONMENT_OBJECTS_TILES, VALID_TERRAIN_TILES } from '../../base/constants';
import ItemsInitializationSystem from '../../systems/ItemsInitializationSystem';
import { ENVIRONMENT_OBJECTS, TERRAIN_TILES } from '../../base/enums';
import EnvironmentObjectTile from './EnvironmentObjectTile';
import PlayerActionSystem from '../../systems/PlayerActionSystem';
import PlayerSprite from '../player/PlayerSprite';
import TimeCicleSystem from '../../systems/TimeCicleSystem';
import TimeDisplayer from './TimeDisplayer';
import { TileCropFacet, TreeFruitFacet } from '../../app/GameFacets';
import CropGrowingSystem from '../../systems/CropGrowingSystem';
import EnironmentObjectsInitializationSystem from '../../systems/EnironmentObjectsInitializationSystem';

const StyledMapContainer = styled.div`
  ${tw`w-screen h-screen`}
`;

const Map = () => {

  return (
    <StyledMapContainer>
     
      <EnironmentObjectsInitializationSystem />
      <CropGrowingSystem />
      {/* <SystemCreator systemClass={CropGrowingSystem} /> */}
      <TimeCicleSystem />
      <TimeDisplayer />
      <PlayerActionSystem />
     
      <FullScreenCanvas>
        <EntityPropsMapper
          query={(e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TERRAIN_TILES) || '')}
          get={[[TextTypeFacet, PositionFacet, IdentifierFacet, TileCropFacet], []]}
          onMatch={TerrainTile}
        />
        <EntityPropsMapper
          query={(e) => VALID_ENVITONMENT_OBJECTS_TILES.includes((e.get(TextTypeFacet)?.props.type as ENVIRONMENT_OBJECTS) || '')}
          get={[[TextTypeFacet, PositionFacet, IdentifierFacet, TreeFruitFacet], []]}
          onMatch={EnvironmentObjectTile}
        />
        <EntityPropsMapper
          query={(e) => e.get(TextTypeFacet)?.props.type === 'player'}
          get={[[TextTypeFacet, PositionFacet], []]}
          onMatch={PlayerSprite}
          
        />
        
      </FullScreenCanvas>
    </StyledMapContainer>
  );
};

export default Map;
