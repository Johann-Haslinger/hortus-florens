import { AXE_ICON_INVENTORY, HOE_ICON_INVENTORY, WHEAT_SEED_ICON_INVENTORY } from "../assets/items/inventory";
import { SEED_NAMES, TOOL_NAMES } from "../base/enums";

export const findInventoryIconForItem = (toolName: TOOL_NAMES | SEED_NAMES) => {
  switch (toolName) {

    // Tools
    case TOOL_NAMES.AXE:
      return <img src={AXE_ICON_INVENTORY} />;
    case TOOL_NAMES.HOE:
      return <img src={HOE_ICON_INVENTORY} />;
    case TOOL_NAMES.WATERING_CAN:
      return "W";

    // Seeds
    case SEED_NAMES.WHEAT_SEED:
      return <img src={WHEAT_SEED_ICON_INVENTORY} />;
    default:
      return '';
  }
}
