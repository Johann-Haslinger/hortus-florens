import styled from '@emotion/styled';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, TextTypeFacet } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import { TileCropFacet, TitleFacet, TreeFruitFacet } from '../../app/GameFacets';
import { VALID_TERRAIN_TILES } from '../../base/constants';
import { EnvironmentObjects, TerrainTiles } from '../../base/enums';
import AudioSystem from '../../systems/AudioSystem';
import CropGrowingSystem from '../../systems/CropGrowingSystem';
import EnironmentObjectsInitializationSystem from '../../systems/EnironmentObjectsInitializationSystem';
import TimeCicleSystem from '../../systems/TimeCicleSystem';
import Player from '../player/Player';
import TreeTile from './eviromentObjects/TreeTile';
import WeedTile from './eviromentObjects/WeedTile';
import FullScreenCanvas from './FullscreenCanvas';
import TerrainTile from './TerrainTile';
import TimeDisplayer from './TimeDisplayer';

const StyledMapContainer = styled.div`
  ${tw`w-screen h-screen`}
`;

const Map = () => {
  return (
    <StyledMapContainer>
      <EnironmentObjectsInitializationSystem />
      <CropGrowingSystem />
      <TimeCicleSystem />
      <TimeDisplayer />

      <AudioSystem />

      <FullScreenCanvas>
        <EntityPropsMapper
          query={(e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TerrainTiles) || '')}
          get={[[TextTypeFacet, PositionFacet, IdentifierFacet, TileCropFacet], []]}
          onMatch={TerrainTile}
        />

        <EntityPropsMapper
          query={(e) => e.get(TextTypeFacet)?.props.type === EnvironmentObjects.WEED}
          get={[[TextTypeFacet, PositionFacet, IdentifierFacet, TitleFacet], []]}
          onMatch={WeedTile}
        />
        <EntityPropsMapper
          query={(e) => e.get(TextTypeFacet)?.props.type === EnvironmentObjects.TREE}
          get={[[TextTypeFacet, PositionFacet, IdentifierFacet, TitleFacet, TreeFruitFacet], []]}
          onMatch={TreeTile}
        />
        <EntityPropsMapper
          query={(e) => e.get(TextTypeFacet)?.props.type === 'player'}
          get={[[TextTypeFacet, PositionFacet], []]}
          onMatch={Player}
        />
      </FullScreenCanvas>
    </StyledMapContainer>
  );
};

export default Map;
