import React from 'react';
import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, Tags, TextTypeFacet } from '@leanscope/ecs-models';
import { ItemGroupFacet, TitleFacet } from '../app/GameFacets';
import { CropNames, FruitNames, ItemGroups, SeedNames, ToolNames } from '../base/enums';
import { v4 } from 'uuid';

const ItemsInitializationSystem = () => {
  return (
    <>
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ItemGroups.TOOLS }),
          new TitleFacet({ title: ToolNames.AXE }),
          new OrderFacet({ orderIndex: 1 }),
        ]}
        tags={[Tags.SELECTED]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ItemGroups.TOOLS }),
          new TitleFacet({ title: ToolNames.HOE }),
          new OrderFacet({ orderIndex: 2 }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ItemGroups.TOOLS }),
          new TitleFacet({ title: ToolNames.WATERING_CAN }),
          new OrderFacet({ orderIndex: 3 }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ItemGroups.SEEDS }),
          new TitleFacet({ title: SeedNames.WHEAT_SEED }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ItemGroups.SEEDS }),
          new TitleFacet({ title: SeedNames.WHEAT_SEED }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ItemGroups.CROPS }),
          new TitleFacet({ title: CropNames.WHEAT }),
        ]}
        tags={[]}
      />
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ItemGroups.FRUITS }),
          new TitleFacet({ title: FruitNames.APPLE }),
        ]}
        tags={[]}
      />
       <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4() }),
          new ItemGroupFacet({ group: ItemGroups.FRUITS }),
          new TitleFacet({ title: FruitNames.APPLE }),
        ]}
        tags={[]}
      />
    </>
  );
};

export default ItemsInitializationSystem;
