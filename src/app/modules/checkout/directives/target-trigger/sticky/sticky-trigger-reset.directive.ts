import {Directive, ElementRef} from '@angular/core';
import {StickyTrigger} from './sticky-trigger';
import {TargetTriggerService} from '../target-trigger.service';
import {Target} from '../target';
import {StickyTargetDirective} from './sticky-target.directive';

@Directive({
    selector: '[stickyTriggerReset]',
    standalone: false
})
export class StickyTriggerResetDirective extends StickyTrigger {
  customizeEvents(events: string[]): void {
    events.push('mouseup', 'touchend');
  }

  trigger(target: StickyTargetDirective, eventName: string): void {
    if (eventName === 'mouseup' || eventName === 'touchend') {
      target.trigger(true);
    }
  }


}
