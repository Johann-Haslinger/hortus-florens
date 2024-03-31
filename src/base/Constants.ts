export const TILE_SIZE = 0.9;
export enum TileTypes {
  DIRT = 'dirt',
  GRASS = 'grass',
  WATER = 'water',
}
export const WALKABLE_TILES = [TileTypes.GRASS, TileTypes.DIRT];

export enum TOOL_NAMES {
  AXE = 'axe',
  PICKAXE = 'pickaxe',
  SHOVEL = 'shovel',
  HOE = 'hoe',
}

export enum ITEM_GROUPS {
  TOOLS = 'tools',
  WEAPONS = 'weapons',
  FOOD = 'food',
  CROPS = 'crops',
}

export enum TERRAIN_TILES {
  WATER = 'water',
  GRASS = 'grass',
  DIRT = 'dirt',
  FARMLAND = 'farmland',
}
export const VALID_TERRAIN_TILES = [TERRAIN_TILES.WATER, TERRAIN_TILES.DIRT, TERRAIN_TILES.GRASS, TERRAIN_TILES.FARMLAND];
