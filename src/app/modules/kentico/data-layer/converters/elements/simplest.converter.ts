import {KenticoElementConverterInterface} from './kentico-element-converter.interface';

export class SimplestConverter implements KenticoElementConverterInterface<any> {
  convertElement(obj: any): object {
    return obj;
  }

}
