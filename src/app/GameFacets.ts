import { CropNames, FruitNames, ItemGroups, SeedNames, SoundEffects, TreeNames } from '../base/enums';
import { Facet } from '../base/facet';

export interface TypeProps {
  typeName: string;
}

export class TypeFacet extends Facet<TypeProps> {
  constructor(props: TypeProps) {
    super(props);
  }
}

export interface ValueProps {
  value: number;
}

export class ValueFacet extends Facet<ValueProps> {
  constructor(props: ValueProps) {
    super(props);
  }
}

export interface HealthProps {
  healthValue: Array<number>;
}

export class HealthFacet extends Facet<HealthProps> {
  constructor(props: HealthProps) {
    super(props);
  }
}

export interface TitleProps {
  title: string;
}

export class TitleFacet extends Facet<TitleProps> {
  constructor(props: TitleProps = { title: 'untitled' }) {
    super(props);
  }
}

export interface ItemGroupProps {
  group: ItemGroups;
}

export class ItemGroupFacet extends Facet<ItemGroupProps> {
  constructor(props: ItemGroupProps) {
    super(props);
  }
}

export interface TileCropProps {
  tileCropName: SeedNames;
  growthStage: number;
}

export class TileCropFacet extends Facet<TileCropProps> {
  constructor(props: TileCropProps) {
    super(props);
  }
}

export interface TreeFruitProps {
  fruitName: FruitNames;
  growthStage: number;
}

export class TreeFruitFacet extends Facet<TreeFruitProps> {
  constructor(props: TreeFruitProps) {
    super(props);
  }
}

export interface TimeProps {
  time: number;
  day: number;
}

export class TimeFacet extends Facet<TimeProps> {
  constructor(props: TimeProps) {
    super(props);
  }
}
export interface SoundEffectProps {
  soundEffect: SoundEffects | null;
}

export class SoundEffectFacet extends Facet<SoundEffectProps>{
  constructor(props: SoundEffectProps) {
    super(props);
  }
}