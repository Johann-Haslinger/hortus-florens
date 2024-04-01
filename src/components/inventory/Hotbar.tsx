import { Entity, EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { NameFacet, OrderFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { ItemGroupFacet, TitleFacet, TitleProps } from '../../app/GameFacets';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { HOE_ICON_INVENTORY, AXE_ICON_INVENTORY } from '../../assets/items/inventory';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { StoryGuid, TOOL_NAMES } from '../../base/enums';
import { motion } from 'framer-motion';
import { findInventoryIconForTool } from '../../helpers/functions';

// bg-[rgb(189,156,114)]
// border-[rgb(164,125,95)]

const StyledToolIconWrapper = styled.div`
  ${tw`p-1 size-24 bg-[rgb(228,208,171)] border-[6px] backdrop-blur-xl border-[rgb(189,156,114)] rounded-2xl flex items-center justify-center`}
`;

const ToolIcon = (props: TitleProps & EntityProps) => {
  const { title: name } = props;

  return <StyledToolIconWrapper>{findInventoryIconForTool(name as TOOL_NAMES)}</StyledToolIconWrapper>;
};

const StyledHotbarWrapper = styled.div`
  ${tw`flex bottom-0 left-0 fixed z-[300] m-6  items-center w-full h-24 `}
`;

const Hotbar = () => {
  const [tools] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === 'tools');
  // const isHotbarVisible = useIsStoryCurrent(StoryGuid.PLAY_GAME);
  const isHotbarVisible = true;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedTool = tools.find((e) => e.hasTag(Tags.SELECTED));
      const selectedToolOrder = selectedTool?.get(OrderFacet)?.props.orderIndex;

      if (selectedTool && selectedToolOrder && isHotbarVisible) {
        let newTool: Entity | undefined;

        if (e.key === 'ArrowLeft') {
          newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === selectedToolOrder - 1);
          if (!newTool) {
            newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === tools.length);
          }
        } else if (e.key === 'ArrowRight') {
          newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === selectedToolOrder + 1);
          if (!newTool) {
            newTool = tools.find((e) => e.get(OrderFacet)?.props.orderIndex === 1);
          }
        }

        if (newTool) {
          selectedTool.removeTag(Tags.SELECTED);
          newTool.addTag(Tags.SELECTED);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tools, isHotbarVisible]);

  return (
    <StyledHotbarWrapper>
      <motion.div initial={{ opacity: 1, scale: 1 }} animate={{ opacity: isHotbarVisible ? 1 : 0, scale: isHotbarVisible ? 1 : 0.9 }}>
        <EntityPropsMapper
          query={(e) => e.hasTag(Tags.SELECTED) && e.get(ItemGroupFacet)?.props.group === 'tools'}
          get={[[TitleFacet], []]}
          onMatch={ToolIcon}
        />
      </motion.div>
    </StyledHotbarWrapper>
  );
};

export default Hotbar;
