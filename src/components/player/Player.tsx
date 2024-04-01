import { Entity, EntityProps, useEntities, useEntity } from '@leanscope/ecs-engine';
import { PositionFacet, PositionProps, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import PlayerSprite from './PlayerSprite';
import { VALID_TERRAIN_TILES, TILE_SIZE } from '../../base/Constants';
import { useEffect, useState } from 'react';
import { ItemGroupFacet, TitleFacet } from '../../app/GameFacets';
import { TERRAIN_TILES, ITEM_GROUPS, TOOL_NAMES } from '../../types/enums';

const findPlayerTile = (playerX: number, playerY: number, tiles: readonly Entity[]): Entity | undefined => {
  return tiles.find((tile) => {
    const tileLeft = tile.get(PositionFacet)?.props.positionX! - TILE_SIZE / 2;
    const tileRight = tile.get(PositionFacet)?.props.positionX! + TILE_SIZE / 2;
    const tileTop = tile.get(PositionFacet)?.props.positionY! - TILE_SIZE / 2;
    const tileBottom = tile.get(PositionFacet)?.props.positionY! + TILE_SIZE / 2;

    return playerX >= tileLeft && playerX <= tileRight && playerY >= tileTop && playerY <= tileBottom;
  });
};

const handleHoeUse = (playerTile: Entity | undefined) => {
  console.log(playerTile?.get(PositionFacet)?.props.positionX, playerTile?.get(PositionFacet)?.props.positionY);
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.GRASS) {
    playerTile.add(new TextTypeFacet({ type: TERRAIN_TILES.FARMLAND }));
  }
};

const Player = (props: PositionProps & EntityProps) => {
  const { positionX, positionY } = props;
  const [playerTile, setPlayerTile] = useState<Entity | undefined>(undefined);
  const [tiles] = useEntities((e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TERRAIN_TILES) || ''));

  const [selectedTool] = useEntity((e) => e.get(ItemGroupFacet)?.props.group === ITEM_GROUPS.TOOLS && e.hasTag(Tags.SELECTED));
  const selectedToolName = selectedTool?.get(TitleFacet)?.props.title as TOOL_NAMES;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        switch (selectedToolName) {
          case TOOL_NAMES.HOE:
            console.log('hoe');
            handleHoeUse(playerTile);
            break;
          case TOOL_NAMES.AXE:
            console.log('axe');
            break;

          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTool, playerTile]);

  useEffect(() => {
    setPlayerTile(findPlayerTile(positionX, positionY, tiles));
  }, [positionX, positionY, tiles]);

  return <PlayerSprite {...props} />;
};
export default Player;
