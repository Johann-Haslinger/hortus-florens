import { IdentifierProps, PositionProps, Tags, TextTypeProps } from '@leanscope/ecs-models';
import { TERRAIN_TILES, TILE_SIZE } from '../../base/Constants';
import { EntityProps } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { useEffect, useRef } from 'react';
import { BufferGeometry, Material, Mesh, MeshBasicMaterial, NormalBufferAttributes, Object3DEventMap } from 'three';
import { useFrame } from '@react-three/fiber';

const TerrainTile = (props: IdentifierProps & TextTypeProps & PositionProps & EntityProps) => {
  const { positionX, positionY, type, entity } = props;

  const [isSelected] = useEntityHasTags(entity, Tags.SELECTED);

  const meshRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);


  useFrame(() => {
  
    if (materialRef.current && isSelected) {
      materialRef.current.color.set('red');
    } else if (materialRef.current) {
      materialRef.current.color.set(
        type === TERRAIN_TILES.GRASS
          ? 'green'
          : type === TERRAIN_TILES.WATER
          ? 'blue'
          : type === TERRAIN_TILES.DIRT
          ? 'gray'
          : type === TERRAIN_TILES.FARMLAND
          ? 'yellow'
          : 'black',
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[positionX * TILE_SIZE, positionY * TILE_SIZE, 0]}>
      <boxGeometry args={[TILE_SIZE, TILE_SIZE, 0]} />

      <meshBasicMaterial ref={materialRef} />
    </mesh>
  );
};

export default TerrainTile;
