import FullScreenCanvas from './FullscreenCanvas';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import Player from '../player/Player';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, PositionFacet, TextTypeFacet } from '@leanscope/ecs-models';
import TerrainTile from './TerrainTile';
import TilesInitializationSystem from '../../systems/TilesInitializationSystem';
import PlayerInitializationSystem from '../../systems/PlayerInitializationSystem';
import { TERRAIN_TILES, VALID_TERRAIN_TILES } from '../../base/Constants';
import ItemsInitializationSystem from '../../systems/ItemsInitializationSystem';

const StyledMapContainer = styled.div`
  ${tw`w-screen h-screen`}
`;

const Map = () => {
  return (
    <StyledMapContainer>
      <FullScreenCanvas>
        <EntityPropsMapper
          query={(e) =>
            e.get(TextTypeFacet)?.props.type !== undefined &&
            [TERRAIN_TILES.GRASS, TERRAIN_TILES.WATER, TERRAIN_TILES.DIRT, TERRAIN_TILES.FARMLAND].includes(
              e.get(TextTypeFacet)?.props.type as TERRAIN_TILES,
            )
          }
          get={[[TextTypeFacet, PositionFacet, IdentifierFacet], []]}
          onMatch={TerrainTile}
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