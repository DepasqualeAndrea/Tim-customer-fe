import { YoloDataLayerEventObjGeneratorService } from './yolo-data-layer-event-obj-generator.service';
import {GtmService} from '../../../core/services/gtm/gtm.service';
import {Injectable} from '@angular/core';
import { GtmPageInfoStrategy } from 'app/core/services/gtm/gtm-page-info-strategy.interface';

@Injectable({
  providedIn: 'root'
})
export class YoloDataLayerGA4PageFiller implements GtmPageInfoStrategy {

  constructor(
    private gtmService: GtmService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService
  ) { }

  fill(): void {
    const dl = this.gtmEventGeneratorService.fillDataLayerBaseEvent();
    this.gtmService.overwrite(dl);
  }

}
