import {KenticoElementConverterInterface} from './kentico-element-converter.interface';
import {Elements} from 'kentico-cloud-delivery/_es2015';
import {KenticoItemConverterInterface} from '../items/kentico-item-converter.interface';
import LinkedItemsElement = Elements.LinkedItemsElement;

export class LinkedItemsConverter implements KenticoElementConverterInterface<LinkedItemsElement> {

  constructor(private itemConverter: KenticoItemConverterInterface) {
  }

  convertElement(obj: Elements.LinkedItemsElement): object {
    const result: object = Object.assign({}, obj);
    obj.itemCodenames.forEach((codename, index) => {
      Object.assign(result, {[codename]: obj.value[index]});
    });

    obj.itemCodenames.forEach(codename => {
      result[codename] = this.itemConverter.convertItem(result[codename]);
    });

    return result;
  }

}
