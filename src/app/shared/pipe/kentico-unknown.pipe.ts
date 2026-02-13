import { Pipe, PipeTransform, Injector } from '@angular/core';
import { KenticoUnknownPipeMap } from './services/kentico-unknown-pipe-map.service';

@Pipe({
    name: 'kenticounknown',
    standalone: false
})
export class KenticoUnknownPipe implements PipeTransform {
    constructor(private mapper: KenticoUnknownPipeMap) {}

    transform(value: any, ...args: any[]) {
        const register: boolean = args.length > 0;
        const name: string = args[0];

        if(!value) {
          // unknown if value is null
          if(register) {
            this.mapper.setResult(name, true);
          }
          return "";
        } else {
          if(register) {
            this.mapper.setResult(name, false);
          }
          return value;
        }

    }

}
