import { Injectable } from "@angular/core";
import {CustomPipeModule} from '../CustomPipes.module'
import { KenticoPipeStorageService } from './kentico-pipe-storage.service';

@Injectable({
    providedIn: 'root'
})
export class KenticoUnknownPipeMap {
    private pipeName: string = 'kenticounknown';

    constructor(private kenticoPipeStorage: KenticoPipeStorageService) {}

    getResult(pipeValueId: string): Boolean {
        return this.kenticoPipeStorage.readMap(this.pipeName, pipeValueId);
    }

    setResult(pipeValueId: string, result: boolean) {
        this.kenticoPipeStorage.registerResult(this.pipeName, pipeValueId, result);
    }
    
}