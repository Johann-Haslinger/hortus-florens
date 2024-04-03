import React from 'react';
import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { ItemGroupFacet, TitleFacet } from '../app/GameFacets';
import { CROP_NAMES, ITEM_GROUPS, SEED_NAMES, TOOL_NAMES } from '../base/enums';
import { v4 } from 'uuid';

const ItemsInitializationSystem = () => {
  return (
    <>
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ITEM_GROUPS.TOOLS }),
          new TitleFacet({ title: TOOL_NAMES.AXE }),
          new OrderFacet({ orderIndex: 1 }),
        ]}
        tags={[Tags.SELECTED]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ITEM_GROUPS.TOOLS }),
          new TitleFacet({ title: TOOL_NAMES.HOE }),
          new OrderFacet({ orderIndex: 2 }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ITEM_GROUPS.TOOLS }),
          new TitleFacet({ title: TOOL_NAMES.WATERING_CAN }),
          new OrderFacet({ orderIndex: 3 }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ITEM_GROUPS.SEEDS }),
          new TitleFacet({ title: SEED_NAMES.WHEAT_SEED }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ITEM_GROUPS.SEEDS }),
          new TitleFacet({ title: SEED_NAMES.WHEAT_SEED }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ITEM_GROUPS.CROPS }),
          new TitleFacet({ title: CROP_NAMES.WHEAT }),
        ]}
        tags={[]}
      />
    </>
  );
};

export default ItemsInitializationSystem;
