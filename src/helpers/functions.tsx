import { AXE_ICON_INVENTORY, HOE_ICON_INVENTORY } from "../assets/items/inventory";
import { TOOL_NAMES } from "../base/enums";

export const findInventoryIconForTool = (toolName: TOOL_NAMES) => {
  switch (toolName) {
    case TOOL_NAMES.AXE:
      return <img src={AXE_ICON_INVENTORY} />;
    case TOOL_NAMES.HOE:
      return <img src={HOE_ICON_INVENTORY} />;
    case TOOL_NAMES.WATERING_CAN:
      return "W";
    default:
      return '';
  }
}
