import {Directive} from '@angular/core';
import {Target} from '../target';

@Directive({
  selector: '[stickyTarget]'
})
export class StickyTargetDirective extends Target {


  protected getState(): boolean {
    return super.getState();
  }

  protected setState(visible: boolean) {
    super.setState(visible);
  }

  trigger(visible: boolean): void {
    if(visible) {
      this.targetElement.classList.remove('d-none');
    } else {
      this.targetElement.classList.add('d-none');
    }

    this.setState(visible);
  }

}
