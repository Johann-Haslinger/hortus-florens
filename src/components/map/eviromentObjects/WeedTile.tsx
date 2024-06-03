import { IdentifierProps, PositionProps, TextTypeProps } from '@leanscope/ecs-models';
import { Box } from '@react-three/drei';
import { useRef } from 'react';
import { useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { TitleProps } from '../../../app/GameFacets';
import { WEED_TILE_1, WEED_TILE_2 } from '../../../assets/environmentObjects';
import { TILE_SIZE } from '../../../base/constants';
import { EnvironmentObjects, WeedNames } from '../../../base/enums';
import { findEnvotonmentObjectSizeArgs } from '../../../helpers/functions';

const findWeedTexture = (weed: WeedNames) => {
  switch (weed) {
    case WeedNames.WEED_1:
      return WEED_TILE_1;
    case WeedNames.WEED_2:
      return WEED_TILE_2;
    default:
      return WEED_TILE_1;
  }
};

const WeedTile = (props: IdentifierProps & TextTypeProps & PositionProps & TitleProps) => {
  const { positionX, positionY, type, title } = props;
  const tileTexture = useLoader(THREE.TextureLoader, findWeedTexture(title as WeedNames));
  const meshRef = useRef<THREE.MeshBasicMaterial>(null);

  return (
    <Box position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]} args={findEnvotonmentObjectSizeArgs(type as EnvironmentObjects)}>
      <meshBasicMaterial ref={meshRef} map={tileTexture} transparent />
    </Box>
  );
};

export default WeedTile;
