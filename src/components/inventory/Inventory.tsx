import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntities, useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { Tags } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { ItemGroupFacet, SoundEffectFacet, TitleFacet } from '../../app/GameFacets';
import { CropNames, FruitNames, ItemGroups, SeedNames, SoundEffects, Stories, ToolNames } from '../../base/enums';
import { findInventoryIconForItem } from '../../helpers/functions';

const StyledImportantItemSlot = styled.div<{ isSelected: boolean }>`
  ${tw`m-2.5     p-1 hover:p-[1px] hover:bg-opacity-10 transition-all size-[6.7rem] bg-[rgb(189,156,114)] bg-opacity-30 backdrop-blur-xl border-[rgb(189,156,114)] rounded-2xl flex items-center justify-center`}
`;

const ImportantItemSlot = (props: { entity?: Entity }) => {
  const { entity } = props;

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
  ${tw`m-2 p-1  hover:bg-opacity-10 transition-all size-20 bg-[rgb(189,156,114)] bg-opacity-30 backdrop-blur-xl border-[rgb(189,156,114)] rounded-2xl flex items-center justify-center`}
  ${({ isSelected }) => isSelected && tw`border-[rgb(189,156,114)] border-[3px]`}
`;

const ToolSlot = (props: { entity?: Entity; soundEffectEntity?: Entity }) => {
  const { entity, soundEffectEntity } = props;
  const [items] = useEntities((e) => e.has(ItemGroupFacet));
  const [isSelected] = useEntityHasTags(entity, Tags.SELECTED);

  const handleSelectTool = () => {
    items.forEach((item) => item.removeTag(Tags.SELECTED));
    if (entity?.hasTag(Tags.SELECTED)) {
      entity.removeTag(Tags.SELECTED);
    } else {
      soundEffectEntity?.add(new SoundEffectFacet({ soundEffect: SoundEffects.ITEM_SELECT }));
      entity?.addTag(Tags.SELECTED);
    }
  };

  return (
    <StyledToolSlot onClick={handleSelectTool} isSelected={isSelected}>
      {entity && <>{findInventoryIconForItem(entity.get(TitleFacet)?.props.title as ToolNames, ItemGroups.TOOLS)}</>}
    </StyledToolSlot>
  );
};

const StyledNormalItem = styled.div<{ isSelected: boolean }>`
  ${tw`m-1  p-1  hover:bg-opacity-10 transition-all size-[3.9rem] bg-[rgb(189,156,114)] bg-opacity-30 backdrop-blur-xl border-[rgb(189,156,114)] rounded-xl flex items-center justify-center`}
  ${({ isSelected }) => isSelected && tw`border-[rgb(189,156,114)] border-[3px]`}
`;

const StyledValueText = styled.p<{ isSelected: boolean }>`
  ${tw` absolute transition-all text-xs font-bold italic text-white`}
  ${({ isSelected }) => (isSelected ? tw` ml-10 mt-10` : tw` ml-11 mt-11`)}
`;

const NormalItem = (props: { entity?: Entity; soundEffectEntity?: Entity }) => {
  const { entity, soundEffectEntity } = props;
  const title = entity?.get(TitleFacet)?.props.title;
  const itemGroup = entity?.get(ItemGroupFacet)?.props.group;
  const [items] = useEntities((e) => e.has(ItemGroupFacet));
  const [isSelected] = useEntityHasTags(entity, Tags.SELECTED);
  const value = entity
    ? items.filter((e) => e.get(TitleFacet)?.props.title === title && e.get(ItemGroupFacet)?.props.group == itemGroup).length
    : 0;

  const handleSelectTool = () => {
    items.forEach((item) => item.removeTag(Tags.SELECTED));
    if (entity?.hasTag(Tags.SELECTED)) {
      entity.removeTag(Tags.SELECTED);
    } else {
      soundEffectEntity?.add(new SoundEffectFacet({ soundEffect: SoundEffects.ITEM_SELECT }));
      entity?.addTag(Tags.SELECTED);
    }
  };

  return (
    <StyledNormalItem onClick={handleSelectTool} isSelected={isSelected && entity !== undefined}>
      {entity && <>{findInventoryIconForItem(title as SeedNames | CropNames | FruitNames, itemGroup as ItemGroups)}</>}
      {value > 1 && <StyledValueText isSelected={isSelected}>{value}</StyledValueText>}
    </StyledNormalItem>
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

const StyledNormalItemsGrid = styled.div`
  ${tw`grid h-fit mx-1.5 py-1.5 w-fit grid-cols-3`}
`;

const StyledToolsGrid = styled.div`
  ${tw`h-fit py-0.5 w-fit `}
`;

const Inventory = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isInventoryVisible = useIsStoryCurrent(Stories.OBSERVING_INVENTORY);
  const inventoryRef = useRef<HTMLDivElement>(null);
  const [toolItems] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === ItemGroups.TOOLS);
  const [normalItems] = useEntities(
    (e) =>
      e.has(ItemGroupFacet) &&
      e.get(ItemGroupFacet)?.props.group !== ItemGroups.TOOLS &&
      e.get(ItemGroupFacet)?.props.group !== ItemGroups.IMPORTANT_ITEMS,
  );
  const [importantItems] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === ItemGroups.IMPORTANT_ITEMS);
  const filteredItems = normalItems.filter((entity, index, self) => {
    const title = entity?.get(TitleFacet)?.props.title;
    const itemGroup = entity?.get(ItemGroupFacet)?.props.group;
    return self.findIndex((e) => e?.get(TitleFacet)?.props.title === title && e.get(ItemGroupFacet)?.props.group == itemGroup) === index;
  });
  const [soundEffectEntity] = useEntity((e) => e.has(SoundEffectFacet));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInventoryVisible) {
        lsc.stories.transitTo(Stories.PLAY_GAME);
      } else if (e.key === 'i') {
        lsc.stories.transitTo(Stories.OBSERVING_INVENTORY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInventoryVisible]);

  useEffect(() => {
    if (isInventoryVisible) {
      soundEffectEntity?.add(new SoundEffectFacet({ soundEffect: SoundEffects.OPEN_INVENTORY }));
    } else {
      soundEffectEntity?.add(new SoundEffectFacet({ soundEffect: SoundEffects.CLOSE_INVENTORY }));
    }
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
            <StyledNormalItemsGrid>
              {Array.from({ length: 15 }).map((_, i) => (
                <NormalItem soundEffectEntity={soundEffectEntity} key={i} entity={filteredItems[i] ? filteredItems[i] : undefined} />
              ))}
            </StyledNormalItemsGrid>
            <StyledToolsGrid>
              {Array.from({ length: 4 }).map((_, i) => (
                <ToolSlot key={i} soundEffectEntity={soundEffectEntity} entity={toolItems[i] ? toolItems[i] : undefined} />
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
