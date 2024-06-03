import styled from '@emotion/styled';
import { Entity, useEntities, useEntity } from '@leanscope/ecs-engine';
import { OrderFacet, Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import tw from 'twin.macro';
import { ItemGroupFacet, TitleFacet } from '../../app/GameFacets';
import { ItemGroups, ToolNames } from '../../base/enums';
import { findInventoryIconForItem } from '../../helpers/functions';

const StyledSelectedIconWrappper = styled.div`
  ${tw`p-1 size-24 bg-[rgb(228,208,171)] border-[6px] backdrop-blur-xl border-[rgb(189,156,114)] rounded-2xl flex items-center justify-center`}
`;

const StyledValueText = styled.p`
  ${tw` absolute  text-base mt-[3.7rem] ml-[3.7rem] font-bold italic text-white`}
`;

const SelectedItemIcon = (props: { entity?: Entity }) => {
  const { entity } = props;
  const [items] = useEntities((e) => e.has(ItemGroupFacet));

  const itemGroup = entity?.get(ItemGroupFacet)?.props.group;
  const title = entity?.get(TitleFacet)?.props.title;
  const value = entity ? items.filter((e) => e.get(TitleFacet)?.props.title === title).length : 0;

  return (
    <StyledSelectedIconWrappper>
      {entity && findInventoryIconForItem(title as ToolNames, itemGroup as ItemGroups)}{' '}
      {value > 1 && <StyledValueText>{value}</StyledValueText>}
    </StyledSelectedIconWrappper>
  );
};

const StyledHotbarWrapper = styled.div`
  ${tw`flex bottom-0 left-0 fixed z-[300] m-6  items-center w-full h-24 `}
`;

const Hotbar = () => {
  const [items] = useEntities((e) => e.has(ItemGroupFacet));
  const [tools] = useEntities((e) => e.has(ItemGroupFacet) && e.get(ItemGroupFacet)?.props.group === ItemGroups.TOOLS);
  const [selectedItem] = useEntity((e) => e.has(Tags.SELECTED) && e.has(ItemGroupFacet));
  const isHotbarVisible = true;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedItem = items.find((e) => e.hasTag(Tags.SELECTED));
      const selectedItemOrder = selectedItem?.get(OrderFacet)?.props.orderIndex;

      let newTool: Entity | undefined;

      if (e.key === 'ArrowLeft') {
        console.log(selectedItemOrder);
        if (selectedItemOrder !== undefined) {
          newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === selectedItemOrder - 1);
          if (!newTool) {
            newTool = tools.find(
              (e) =>
                e.get(OrderFacet)?.props.orderIndex ===
                items.filter((item) => item.get(ItemGroupFacet)?.props.group == ItemGroups.TOOLS).length,
            );
          }
        } else {
          console.log('no order');
          newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (selectedItemOrder !== undefined) {
          newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === selectedItemOrder + 1);
          if (!newTool) {
            newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === 1);
          }
        } else {
          newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === 1);
        }
      }

      if (newTool) {
        selectedItem?.removeTag(Tags.SELECTED);
        console.log('new tool', newTool);
        newTool.addTag(Tags.SELECTED);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [items]);

  return (
    <StyledHotbarWrapper>
      <motion.div initial={{ opacity: 1, scale: 1 }} animate={{ opacity: isHotbarVisible ? 1 : 0, scale: isHotbarVisible ? 1 : 0.9 }}>
        <SelectedItemIcon entity={selectedItem} />
      </motion.div>
    </StyledHotbarWrapper>
  );
};

export default Hotbar;
