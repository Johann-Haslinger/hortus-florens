import { Entity, EntityProps, useEntities, useEntity } from '@leanscope/ecs-engine';
import { PositionFacet, PositionProps, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import PlayerSprite from './PlayerSprite';
import { VALID_TERRAIN_TILES, TILE_SIZE } from '../../base/constants';
import { useContext, useEffect, useState } from 'react';
import { ItemGroupFacet, TileCropFacet, TitleFacet } from '../../app/GameFacets';
import { TERRAIN_TILES, ITEM_GROUPS, TOOL_NAMES, GAME_TAGS, SEED_NAMES, CROP_NAMES } from '../../base/enums';
import { LeanScopeClientContext } from '@leanscope/api-client/node';

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
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.GRASS) {
    playerTile.add(new TextTypeFacet({ type: TERRAIN_TILES.FARMLAND }));
  }
};

const handleWateringCanUse = (playerTile: Entity | undefined) => {
  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.FARMLAND) {
    playerTile.addTag(GAME_TAGS.WATERD);
  }
};

const handleToolUse = (playerTile: Entity | undefined, toolName: TOOL_NAMES) => {
  switch (toolName) {
    case TOOL_NAMES.HOE:
      handleHoeUse(playerTile);
      break;
    case TOOL_NAMES.WATERING_CAN:
      handleWateringCanUse(playerTile);
      break;

    default:
      break;
  }
};

const handleSeedUse = (playerTile: Entity | undefined, seedName: SEED_NAMES, handleRemoveEntity: (itemGroup: SEED_NAMES) => void) => {
  handleRemoveEntity(seedName);

  if (playerTile && playerTile.get(TextTypeFacet)?.props.type === TERRAIN_TILES.FARMLAND) {
    console.log('seedName', seedName);
    playerTile.add(new TileCropFacet({ tileCropName: seedName, growthStage: 0 }));
  }
};

const Player = (props: PositionProps & EntityProps) => {
  const { positionX, positionY } = props;
  const lsc = useContext(LeanScopeClientContext);
  const [playerTile, setPlayerTile] = useState<Entity | undefined>(undefined);
  const [tiles] = useEntities((e) => VALID_TERRAIN_TILES.includes((e.get(TextTypeFacet)?.props.type as TERRAIN_TILES) || ''));
  const [items] = useEntities((e) => e.has(ItemGroupFacet));

  const [selectedItem] = useEntity((e) => e.has(ItemGroupFacet) && e.hasTag(Tags.SELECTED));
  const selectedItemName = selectedItem?.get(TitleFacet)?.props.title;
  const selectedItemGroup = selectedItem?.get(ItemGroupFacet)?.props.group;

  const handleRemoveSelectedItem = (itemTitle: SEED_NAMES) => {
    const sameItems = items.filter((item) => item.get(TitleFacet)?.props.title === itemTitle);
    const notSelectedItems = sameItems.filter((item) => !item.hasTag(Tags.SELECTED));

    if (notSelectedItems.length === 0) {
      lsc.engine.removeEntity(sameItems[0]);
    } else {
      lsc.engine.removeEntity(notSelectedItems[0]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        switch (selectedItemGroup) {
          case ITEM_GROUPS.TOOLS:
            handleToolUse(playerTile, selectedItemName as TOOL_NAMES);
            break;
          case ITEM_GROUPS.SEEDS:
            handleSeedUse(playerTile, selectedItemName as SEED_NAMES, handleRemoveSelectedItem);
            break;
          case ITEM_GROUPS.CROPS:
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
  }, [selectedItem, playerTile]);

  useEffect(() => {
    setPlayerTile(findPlayerTile(positionX, positionY, tiles));
  }, [positionX, positionY, tiles]);

  return <PlayerSprite {...props} />;
};
export default Player;
