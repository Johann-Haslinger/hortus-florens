import React, { useContext, useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import { Entity, EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { ItemGroupFacet, TitleFacet, TitleProps } from '../../app/GameFacets';
import { NameFacet, OrderFacet, Tags } from '@leanscope/ecs-models';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { ITEM_GROUPS, StoryGuid } from '../../types/enums';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { motion } from 'framer-motion';
import { AXE_ICON_INVENTORY, HOE_ICON_INVENTORY } from '../../assets/items/inventory';

const StyledImportantItemSlot = styled.div<{ isSelected: boolean }>`
  ${tw`m-2.5  border-[3px] p-1 hover:p-[1px] hover:bg-opacity-10 transition-all size-[6.7rem] bg-[rgb(189,156,114)] bg-opacity-30 backdrop-blur-xl border-[rgb(189,156,114)] rounded-2xl flex items-center justify-center`}
`;

const ImportantItemSlot = (props: { entity?: Entity }) => {
  const { entity } = props;
  const [isSelected] = useEntityHasTags(entity, Tags.SELECTED);

  const handleSelectTool = () => {

    entity?.addTag(Tags.SELECTED);
  };

  return (
    <StyledImportantItemSlot onClick={handleSelectTool} isSelected={false}>
      {entity && <>{entity.get(TitleFacet)?.props.title}</>}
    </StyledImportantItemSlot>
  );
};

const StyledToolSlot = styled.div<{ isSelected: boolean }>`
  ${tw`m-2 border-[3px] p-1 hover:p-[1px] hover:bg-opacity-10 transition-all size-20 bg-[rgb(189,156,114)] bg-opacity-30 backdrop-blur-xl border-[rgb(189,156,114)] rounded-2xl flex items-center justify-center`}
`;

const ToolSlot = (props: { entity?: Entity }) => {
  const { entity } = props;
  const [tools] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === ITEM_GROUPS.TOOLS);
  const [isSelected] = useEntityHasTags(entity, Tags.SELECTED);

  const handleSelectTool = () => {
    tools.forEach((tool) => tool.removeTag(Tags.SELECTED));
    entity?.addTag(Tags.SELECTED);
  };

  return (
    <StyledToolSlot onClick={handleSelectTool} isSelected={false}>
      {entity && (
        <>
          {entity.get(TitleFacet)?.props.title === 'axe' && <img src={AXE_ICON_INVENTORY} />}
          {entity.get(TitleFacet)?.props.title === 'hoe' && <img src={HOE_ICON_INVENTORY} />}
        </>
      )}
    </StyledToolSlot>
  );
};

const StyledCropSlot = styled.div<{ isSelected: boolean }>`
  ${tw`m-1 border-[3px] p-1 hover:p-[1px] hover:bg-opacity-10 transition-all size-[3.9rem] bg-[rgb(189,156,114)] bg-opacity-30 backdrop-blur-xl border-[rgb(189,156,114)] rounded-2xl flex items-center justify-center`}
`;

const CropSlot = (props: { entity?: Entity }) => {
  const { entity } = props;
  const [crops] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === ITEM_GROUPS.CROPS);
  const [isSelected] = useEntityHasTags(entity, Tags.SELECTED);

  const handleSelectTool = () => {
    crops.forEach((item) => item.removeTag(Tags.SELECTED));
    entity?.addTag(Tags.SELECTED);
  };

  return (
    <StyledCropSlot onClick={handleSelectTool} isSelected={false}>
      {entity && <>{entity.get(TitleFacet)?.props.title}</>}
    </StyledCropSlot>
  );
};

const StyledInventoryPositioner = styled.div`
  ${tw`fixed  z-[500] top-1/2 transform -translate-x-1/2 -translate-y-1/2 left-1/2`}
`;
const StyledInevntoryContainer = styled.div`
  ${tw`w-fit shadow-2xl flex shadow-[rgba(164,125,95,0.41)] h-fit    p-2.5    bg-[rgb(228,208,171)]    rounded-3xl`}
`;

const StyledBackgroundDimmer = styled.div<{ isVisible: boolean }>`
  ${({ isVisible }) => (isVisible ? tw`opacity-25` : tw`opacity-0`)}
  ${tw`fixed top-0 transition-all left-0 w-full h-full bg-black  z-[400]`}
`;

const StyledCropsGrid = styled.div`
  ${tw`grid h-fit mx-1.5 py-1.5 w-fit grid-cols-3`}
`;

const StyledToolsGrid = styled.div`
  ${tw`h-fit py-0.5 w-fit `}
`;

const Inventory = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isInventoryVisible = useIsStoryCurrent(StoryGuid.OBSERVING_INVENTORY);
  const inventoryRef = useRef<HTMLDivElement>(null);
  const [toolItems] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === ITEM_GROUPS.TOOLS);
  const [cropItems] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === ITEM_GROUPS.CROPS);
  const [importantItems] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === ITEM_GROUPS.IMPORTANT_ITEMS);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inventoryRef.current && !inventoryRef.current.contains(e.target as Node)) {
        lsc.stories.transitTo(StoryGuid.PLAY_GAME);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInventoryVisible) {
        lsc.stories.transitTo(StoryGuid.PLAY_GAME);
      } else if (e.key === 'e') {
        lsc.stories.transitTo(StoryGuid.OBSERVING_INVENTORY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInventoryVisible]);

  return (
    <>
      <StyledBackgroundDimmer isVisible={isInventoryVisible} />
      <StyledInventoryPositioner>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isInventoryVisible ? 1 : 0, scale: isInventoryVisible ? 1 : 0.8 }}
          style={{ height: 'full', width: 'full' }}
        >
          <StyledInevntoryContainer ref={inventoryRef}>
            <StyledCropsGrid>
              {Array.from({ length: 15 }).map((_, i) => (
                <CropSlot key={i} entity={cropItems[i] ? cropItems[i] : undefined} />
              ))}
            </StyledCropsGrid>
            <StyledToolsGrid>
              {Array.from({ length: 4 }).map((_, i) => (
                <ToolSlot key={i} entity={toolItems[i] ? toolItems[i] : undefined} />
              ))}
            </StyledToolsGrid>
            <div>
              {Array.from({ length: 3 }).map((_, i) => (
                <ImportantItemSlot key={i} entity={importantItems[i] ? importantItems[i] : undefined} />
              ))}
            </div>
          </StyledInevntoryContainer>
        </motion.div>
      </StyledInventoryPositioner>
    </>
  );
};

export default Inventory;
