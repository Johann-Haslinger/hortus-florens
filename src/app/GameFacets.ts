import { Facet } from '../base/facet';
import { ITEM_GROUPS } from '../base/enums';

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

export interface itemGroup {
  group: ITEM_GROUPS;
}

export class ItemGroupFacet extends Facet<itemGroup> {
  constructor(props: itemGroup) {
    super(props);
  }
}
