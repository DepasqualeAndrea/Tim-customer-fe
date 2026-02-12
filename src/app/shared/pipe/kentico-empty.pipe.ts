import { Pipe, PipeTransform, Injector } from '@angular/core';
import { KenticoEmptyPipeMap } from './services/kentico-empty-pipe-map.service';

@Pipe({name: 'kenticoempty'})
export class KenticoEmptyPipe implements PipeTransform {
    constructor(private mapper: KenticoEmptyPipeMap) {}

    transform(value: any, ...args: any[]) {
        const register: boolean = args.length > 0;
        const name: string = args[0];
        const emptyValue: boolean = !value || value.length === 0;


        if (register) {
            this.mapper.setResult(name, emptyValue);
        }

        return value;
    }

}
