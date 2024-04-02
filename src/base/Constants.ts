import { AXE_ICON_INVENTORY, HOE_ICON_INVENTORY } from '../assets/items/inventory';
import { TILE_TYPES, TERRAIN_TILES, TOOL_NAMES, ENVIRONMENT_OBJECTS } from './enums';

export const TILE_SIZE = 0.9;
export const WALKABLE_TILES = [TILE_TYPES.GRASS, TILE_TYPES.DIRT];
export const VALID_TERRAIN_TILES = [TERRAIN_TILES.WATER, TERRAIN_TILES.DIRT, TERRAIN_TILES.GRASS, TERRAIN_TILES.FARMLAND];
export const VALID_ENVITONMENT_OBJECTS_TILES = [ENVIRONMENT_OBJECTS.TREE, ENVIRONMENT_OBJECTS.ROCK, ENVIRONMENT_OBJECTS.BUSH];
export const TIME_SPEED = 10;
export const START_TIME = 8;