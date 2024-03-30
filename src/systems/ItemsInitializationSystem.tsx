import React from 'react';
import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { ItemGroupFacet, TitleFacet } from '../app/GameFacets';
import { ITEM_GROUPS, TOOL_NAMES } from '../base/Constants';

const ItemsInitializationSystem = () => {
  return (
    <>
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: 'item1' }),
          new ItemGroupFacet({ group: ITEM_GROUPS.TOOLS }),
          new TitleFacet({ title: TOOL_NAMES.AXE }),
          new OrderFacet({ orderIndex: 1 }),
        ]}
        tags={[Tags.SELECTED]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: 'item2' }),
          new ItemGroupFacet({ group: ITEM_GROUPS.TOOLS }),
          new TitleFacet({ title: TOOL_NAMES.HOE }),
          new OrderFacet({ orderIndex: 2 }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: 'item3' }),
          new ItemGroupFacet({ group: ITEM_GROUPS.TOOLS }),
          new TitleFacet({ title: TOOL_NAMES.PICKAXE }),
          new OrderFacet({ orderIndex: 3 }),
        ]}
        tags={[]}
      />
    </>
  );
};

export default ItemsInitializationSystem;
