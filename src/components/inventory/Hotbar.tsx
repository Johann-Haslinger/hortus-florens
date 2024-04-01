import { Entity, EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { NameFacet, OrderFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { ItemGroupFacet, TitleFacet, TitleProps } from '../../app/GameFacets';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { HOE_ICON_INVENTORY, AXE_ICON_INVENTORY } from '../../assets/items/inventory';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { STORY_GUID, TOOL_NAMES } from '../../base/enums';
import { motion } from 'framer-motion';
import { findInventoryIconForItem } from '../../helpers/functions';

// bg-[rgb(189,156,114)]
// border-[rgb(164,125,95)]

const StyledSelectedIconWrappper = styled.div`
  ${tw`p-1 size-24 bg-[rgb(228,208,171)] border-[6px] backdrop-blur-xl border-[rgb(189,156,114)] rounded-2xl flex items-center justify-center`}
`;

const SelectedItemIcon = (props: TitleProps & EntityProps) => {
  const { title: name } = props;

  return <StyledSelectedIconWrappper>{findInventoryIconForItem(name as TOOL_NAMES)}</StyledSelectedIconWrappper>;
};

const StyledHotbarWrapper = styled.div`
  ${tw`flex bottom-0 left-0 fixed z-[300] m-6  items-center w-full h-24 `}
`;

const Hotbar = () => {
  const [items] = useEntities((e) => e.has(ItemGroupFacet));
  const [tools] = useEntities((e) => e.has(ItemGroupFacet) && e.get(ItemGroupFacet)?.props.group === 'tools');
  const isHotbarVisible = true;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedItem = items.find((e) => e.hasTag(Tags.SELECTED));
      const selectedItemOrder = selectedItem?.get(OrderFacet)?.props.orderIndex;

      if (selectedItem && isHotbarVisible) {
        let newTool: Entity | undefined;

        if (e.key === 'ArrowLeft') {
          newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === (selectedItemOrder || 2) - 1);
          if (!newTool) {
            newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === items.length);
          }
        } else if (e.key === 'ArrowRight') {
          newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === (selectedItemOrder || 0) + 1);
          if (!newTool) {
            newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === 1);
          }
        }

        if (newTool) {
          selectedItem.removeTag(Tags.SELECTED);
          newTool.addTag(Tags.SELECTED);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [items, isHotbarVisible]);

  return (
    <StyledHotbarWrapper>
      <motion.div initial={{ opacity: 1, scale: 1 }} animate={{ opacity: isHotbarVisible ? 1 : 0, scale: isHotbarVisible ? 1 : 0.9 }}>
        <EntityPropsMapper
          query={(e) => e.hasTag(Tags.SELECTED) && e.has(ItemGroupFacet)}
          get={[[TitleFacet], []]}
          onMatch={SelectedItemIcon}
        />
      </motion.div>
    </StyledHotbarWrapper>
  );
};

export default Hotbar;
