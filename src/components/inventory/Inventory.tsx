import React, { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import { Entity, EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { ItemGroupFacet, TitleFacet, TitleProps } from '../../app/GameFacets';
import { ITEM_GROUPS } from '../../base/Constants';
import { NameFacet, OrderFacet, Tags } from '@leanscope/ecs-models';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';

const StyledToolSlot = styled.div<{ isSelected: boolean }>`
  ${tw`w-16 m-1 rounded-2xl  h-16 bg-gray-800 text-white flex justify-center items-center`}
  ${({ isSelected }) => isSelected && tw`bg-green-500`}
`;

const ToolSlot = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const [tools] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === ITEM_GROUPS.TOOLS);
  const [isSelected] = useEntityHasTags(entity, Tags.SELECTED);

  const handleSelectTool = () => {
    tools.forEach((tool) => tool.removeTag(Tags.SELECTED));
    entity.addTag(Tags.SELECTED);
  };

  return (
    <StyledToolSlot onClick={handleSelectTool} isSelected={isSelected}>
      {title}
    </StyledToolSlot>
  );
};

const StyledInevntoryContainer = styled.div`
  ${tw`w-96 h-80 fixed z-[500] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-30 rounded-2xl`}
`;

const Inventory = () => {
  const [isVisible, setIsVisible] = useState(false);

  const inventoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inventoryRef.current && !inventoryRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  } ,[]); 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  return (
    isVisible && (
      <StyledInevntoryContainer ref={inventoryRef}>
        <EntityPropsMapper
          query={(e) => e.get(ItemGroupFacet)?.props.group === ITEM_GROUPS.TOOLS}
          get={[[TitleFacet], []]}
          sort={(a, b) => (a.get(OrderFacet)?.props.orderIndex ?? 0) - (b.get(OrderFacet)?.props.orderIndex ?? 0)}
          onMatch={ToolSlot} // ToolIcon is a component that displays the tool icon
        />
      </StyledInevntoryContainer>
    )
  );
};

export default Inventory;
