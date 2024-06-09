import { useEntity } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { ItemGroupFacet, TitleFacet } from '../app/GameFacets';

export const useSelectedItem = () => {
  const [selectedItem] = useEntity((e) => e.has(ItemGroupFacet) && e.hasTag(Tags.SELECTED));

  const selectedItemName = selectedItem?.get(TitleFacet)?.props.title;
  const selectedItemGroup = selectedItem?.get(ItemGroupFacet)?.props.group;

  return { selectedItem, selectedItemName, selectedItemGroup};
};
