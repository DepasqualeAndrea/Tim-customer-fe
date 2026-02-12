import {StickyBarCyAttribute} from './sticky-bar-cy-attribute.model';

export class StickyBarCyStepAttributes {
  private attributes: Map<string, StickyBarCyAttribute> = new Map<string, StickyBarCyAttribute>();

  public setAttribute(id: string, block: string, element: string, ...params: string[]): StickyBarCyStepAttributes {
    const attr: StickyBarCyAttribute = new StickyBarCyAttribute();
    attr.block = block;
    attr.element = element;
    attr.params = params;

    this.attributes.set(id, attr);
    return this;
  }

  public getAttribute(id: string): StickyBarCyAttribute {
    return this.attributes.get(id);
  }
}
