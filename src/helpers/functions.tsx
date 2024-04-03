import { APPLE_ICON_INVENTORY, AXE_ICON_INVENTORY, HOE_ICON_INVENTORY, WHEAT_ICON_INVENTORY, WHEAT_SEED_ICON_INVENTORY } from '../assets/items/inventory';
import { CROP_NAMES, FRUIT_NAMES, ITEM_GROUPS, SEED_NAMES, TOOL_NAMES } from '../base/enums';

export const findInventoryIconForItem = (itemName: TOOL_NAMES | SEED_NAMES | CROP_NAMES | FRUIT_NAMES, itemGroup: ITEM_GROUPS) => {
  switch (itemGroup) {
    case ITEM_GROUPS.TOOLS:
      switch (itemName) {
        case TOOL_NAMES.AXE:
          return <img src={AXE_ICON_INVENTORY} alt="axe" />;
        case TOOL_NAMES.HOE:
          return <img src={HOE_ICON_INVENTORY} alt="hoe" />;
        case TOOL_NAMES.WATERING_CAN:
          return "W";
        default:
          return null;
      }
    case ITEM_GROUPS.SEEDS:
      switch (itemName) {
        case SEED_NAMES.WHEAT_SEED:
          return <img src={WHEAT_SEED_ICON_INVENTORY} alt="wheat seed" />;
        default:
          return null;
      }
    case ITEM_GROUPS.CROPS:
      switch (itemName) {
        case CROP_NAMES.WHEAT:
          return <img src={WHEAT_ICON_INVENTORY} alt="wheat" />;
        default:
          return null;
      }
    case ITEM_GROUPS.FRUITS:
      switch (itemName) {
        case FRUIT_NAMES.APPLE:
          return <img src={APPLE_ICON_INVENTORY} alt="apple" />;
        default:
          return null;
      }
    default:
      return null;
  }
};
