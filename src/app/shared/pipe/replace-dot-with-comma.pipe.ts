import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replacedotwithcomma',
    standalone: false
})
export class ReplaceDotWithComma implements PipeTransform {
  transform(data: any) {
    return data.toString().replace('.', ',');
  }
}
