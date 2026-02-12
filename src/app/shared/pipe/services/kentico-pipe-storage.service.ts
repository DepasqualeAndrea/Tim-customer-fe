import { Injectable } from "@angular/core";
import {CustomPipeModule} from '../CustomPipes.module'

@Injectable({
    providedIn: 'root'
})
export class KenticoPipeStorageService {
    map2: {[pipeName:string]: {[pipeValueId: string]: Boolean}} = {};
    maps: Array<KenticoData<Boolean>> = new Array();

    constructor() {}

    private findMap(pipeName: string) : Map<string, Boolean> {
        const data: KenticoData<Boolean> = this.maps.find(d => d.pipeName === pipeName);
        if(!data)
            return null;

        return data.map;
    }

    registerResult(pipeName: string, pipeValueId: string, result: boolean) {
        const map: Map<string, Boolean> = this.findMap(pipeName);
        if(!map) {
            this.maps.push(new KenticoData(pipeName));
            this.registerResult(pipeName, pipeValueId, result);
            return;
        }

        map.set(pipeValueId, result);
    }

    readMap(pipeName: string, pipeValueId: string) : Boolean {
        const map: Map<string, Boolean> = this.findMap(pipeName);
        return map && map.get(pipeValueId);
    }
}

class KenticoData<DataType> {
    pipeName: string;
    map: Map<string, DataType> = new Map<string, DataType>();

    constructor(pipeName: string) {
        this.pipeName = pipeName;
    }
}



