import { EnvironmentObjects, TerrainTiles, TileTypes } from './enums';

export const TILE_SIZE = 0.9;
export const WALKABLE_TILES = [TileTypes.GRASS, TileTypes.DIRT];
export const VALID_TERRAIN_TILES = [TerrainTiles.WATER, TerrainTiles.DIRT, TerrainTiles.GRASS, TerrainTiles.FARMLAND, TerrainTiles.HILL];
export const VALID_ENVITONMENT_OBJECTS_TILES = [
  EnvironmentObjects.TREE,
  EnvironmentObjects.ROCK,
  EnvironmentObjects.BUSH,
  EnvironmentObjects.FLOWER,
  EnvironmentObjects.WEED,
];
export const TIME_SPEED = 100;
export const START_TIME = 8;
export const MAX_TREE_FRUIT_GROWTH_STAGE = 4;
export const MAX_CROP_GROWTH_STAGE = 3;
export const INITIAL_CROP_GROWTH_STAGE = 2;
export const INITIAL_FRUIT_GROWTH_STAGE = 1;
export const PLAYER_SPEED = 0.2;
export const PLAYER_START_POSITION = { x: 12, y: 4 };
export const PLAYER_SIZE = { width: TILE_SIZE / 2, height: TILE_SIZE / 2 };