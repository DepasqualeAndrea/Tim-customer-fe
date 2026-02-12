import {Pipe, PipeTransform} from '@angular/core';
import {ContentItem} from 'kentico-cloud-delivery';

@Pipe({name: 'kenticovalue'})
export class KenticoValuePipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    if(!value || !(value instanceof ContentItem)) {
      console.log(value);
      return "";
    }

    return (value as any).value || "";


  }

}
