import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

export function toFormattedDate(value: string): string {
  if(value && moment(value).isValid()){
    return moment(value).format('DD-MM-YYYY');
  } 
  return value;
}

@Pipe({
    name: 'toFormattedDate',
    standalone: false
})
export class ToFormattedDatePipe implements PipeTransform {

  transform(value: string): string {
    return toFormattedDate(value);
  }

}
