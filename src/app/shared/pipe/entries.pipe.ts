import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'entries', pure: true,
    standalone: false
})
export class EntriesPipe implements PipeTransform {
  transform(value: any): any {
    if (value !== null && value !== undefined) {
      return Object.entries(value);
    }
    return [];

  }
}
