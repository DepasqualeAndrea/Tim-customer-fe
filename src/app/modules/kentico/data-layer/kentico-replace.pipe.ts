import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'replace',
    standalone: false
})
export class KenticoReplacePipe implements PipeTransform  {

  constructor() {}

  transform(value: string, ...args: any[]): string {
    if(!value) {
      return '';
    }
    return this.replaceWithArgValues(value, args[0])
  }

  private replaceWithArgValues(source: string, argObj: object): string {
    let result = source;
    Object.entries(argObj).forEach(entry => {
      const name: string = entry[0];
      const value: string = entry[1];
      const toReplace: RegExp = new RegExp('\{\{\s*' + name + '\s*\}\}', 'gi');
      result = result.replace(toReplace, value);
    });
    return result;
  }
}
