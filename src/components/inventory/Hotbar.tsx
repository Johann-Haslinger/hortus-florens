import { Entity, EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { NameFacet, OrderFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { ItemGroupFacet, TitleFacet, TitleProps } from '../../app/GameFacets';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import { useEffect } from 'react';



const ToolIcon = (props: TitleProps & EntityProps) => {
  const { title: name } = props;
  return <div>{name}</div>;
};

const StyledHotbarWrapper = styled.div`
  ${tw`flex fixed z-[300] justify-center text-white items-center w-full h-16 bg-gray-800`}
`;

const Hotbar = () => {
  const [tools] = useEntities((e) => e.get(ItemGroupFacet)?.props.group === 'tools');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedTool = tools.find((e) => e.hasTag(Tags.SELECTED));
      const selectedToolOrder = selectedTool?.get(OrderFacet)?.props.orderIndex;

      if (selectedTool && selectedToolOrder) {
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
  }, [tools]);

  return (
    <StyledHotbarWrapper>
      <EntityPropsMapper
        query={(e) => e.hasTag(Tags.SELECTED) && e.get(ItemGroupFacet)?.props.group === 'tools'}
        get={[[TitleFacet], []]}
        onMatch={ToolIcon}
      />
    </StyledHotbarWrapper>
  );
};

export default Hotbar;
