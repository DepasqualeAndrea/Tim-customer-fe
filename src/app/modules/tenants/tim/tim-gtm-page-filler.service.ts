import { Injectable } from '@angular/core';
import { GtmPageInfoStrategy } from 'app/core/services/gtm/gtm-page-info-strategy.interface';

@Injectable({
    providedIn: 'root'
})
export class TimGtmPageFillerService implements GtmPageInfoStrategy {
    fill(): void {
        // TODO: Implement TIM specific GTM logic here
        // This replaces the deleted YoloDataLayerGA4PageFiller
    }
}
