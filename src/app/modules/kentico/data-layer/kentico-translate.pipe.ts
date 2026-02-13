import {Pipe, PipeTransform} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {KenticoPipeTranslateService} from '../kentico-pipe-translate.service';

@Pipe({
    name: 'translate',
    standalone: false
})
export class KenticoTranslatePipe implements PipeTransform  {

  constructor(private kenticoTranslateService: KenticoPipeTranslateService) {
  }

  transform(value: string, ...args: any[]): Observable<any> {
    if(!value) {
      return of("");
    }

    return this.kenticoTranslateService.getItem<string>(value).pipe(
      map(translated => {
        if(!!args && args.length >= 1) {
          return this.replaceWithArgValues(translated, args[0]);
        } else {
          return translated;
        }
      })
    );


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
