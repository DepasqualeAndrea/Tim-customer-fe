import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterClaims',
    standalone: false
})
export class FilterClaims implements PipeTransform {
  transform(data: any, filter: any) {
    return data.filter(el => filter.indexOf(el.status) > -1 );
  }
}
