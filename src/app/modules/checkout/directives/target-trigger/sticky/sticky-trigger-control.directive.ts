import {Directive, ElementRef} from '@angular/core';
import {StickyTrigger} from './sticky-trigger';
import {TargetTriggerService} from '../target-trigger.service';
import {Target} from '../target';
import {StickyTargetDirective} from './sticky-target.directive';

@Directive({
    selector: '[stickyTriggerControl]',
    standalone: false
})
export class StickyTriggerControlDirective extends StickyTrigger {
  customizeEvents(events: string[]): void {
    events.push('focus', 'focusout');
  }

  trigger(target: StickyTargetDirective, eventName: string): void {
    if(eventName === 'focus') {
      target.trigger(false);
    } else if (eventName === 'focusout') {
      target.trigger(true);
    }
  }


}
