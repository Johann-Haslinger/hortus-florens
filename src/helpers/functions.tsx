import {
  APPLE_ICON_INVENTORY,
  AXE_ICON_INVENTORY,
  HOE_ICON_INVENTORY,
  WEED_ICON_INVENTORY,
  WHEAT_ICON_INVENTORY,
  WHEAT_SEED_ICON_INVENTORY,
} from '../assets/items/inventory';
import { TILE_SIZE } from '../base/constants';
import { CropNames, EnvironmentObjects, FruitNames, ItemGroups, OtherItemNames, SeedNames, ToolNames, WeedNames } from '../base/enums';

export const findInventoryIconForItem = (
  itemName: ToolNames | SeedNames | CropNames | FruitNames | OtherItemNames,
  itemGroup: ItemGroups,
) => {
  switch (itemGroup) {
    case ItemGroups.TOOLS:
      switch (itemName) {
        case ToolNames.AXE:
          return <img src={AXE_ICON_INVENTORY} alt="axe" />;
        case ToolNames.HOE:
          return <img src={HOE_ICON_INVENTORY} alt="hoe" />;
        case ToolNames.WATERING_CAN:
          return 'W';
        default:
          return null;
      }
    case ItemGroups.SEEDS:
      switch (itemName) {
        case SeedNames.WHEAT_SEED:
          return <img src={WHEAT_SEED_ICON_INVENTORY} alt="wheat seed" />;
        default:
          return null;
      }
    case ItemGroups.CROPS:
      switch (itemName) {
        case CropNames.WHEAT:
          return <img src={WHEAT_ICON_INVENTORY} alt="wheat" />;
        default:
          return null;
      }
    case ItemGroups.FRUITS:
      switch (itemName) {
        case FruitNames.APPLE:
          return <img src={APPLE_ICON_INVENTORY} alt="apple" />;
        default:
          return null;
      }
    case ItemGroups.OTHER:
      switch (itemName) {
        case OtherItemNames.WEED:
          return <img src={WEED_ICON_INVENTORY} alt="weed" />;
        default:
          return null;
      }

    default:
      return null;
  }
};


export const findEnvotonmentObjectSizeArgs = (object: EnvironmentObjects): [number, number, number] => {
  switch (object) {
    case EnvironmentObjects.TREE:
      return [TILE_SIZE * 2.5, TILE_SIZE * 2.5, 0];

    case EnvironmentObjects.FLOWER:
      return [TILE_SIZE, TILE_SIZE * 1.5, 0];
    default:
      return [TILE_SIZE, TILE_SIZE, 0];
  }
};
