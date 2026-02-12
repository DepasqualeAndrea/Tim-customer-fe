import {KenticoElementConverterInterface} from './kentico-element-converter.interface';

class AssetImage {
  url: string;
  description: string;

  constructor(url: string, description: string) {
    this.url = url;
    this.description = description;
  }
}

export class AssetConverter implements KenticoElementConverterInterface<any> {

  convertElement(obj: any): object {
    const images: AssetImage[] = [];
    if(Array.isArray(obj.value)) {
      obj.value.forEach(image => {
        images.push(new AssetImage(image.url || null, image.description || null));
      })
    }
    Object.assign(obj, {images: images});
    return obj;
  }

}
