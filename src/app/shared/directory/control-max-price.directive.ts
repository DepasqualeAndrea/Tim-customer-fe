import {Directive, ElementRef, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
    selector: '[appControlMaxPrice]',
    standalone: false
})
export class ControlMaxPriceDirective {

  constructor(private el: ElementRef, public model: NgControl) {
  }

  @HostListener('input', ['$event']) onEvent($event) {
    const valArray = this.el.nativeElement.value.split(',');
    for (let i = 0; i < valArray.length; ++i) {
      valArray[i] = valArray[i].replace(/\D/g, '');
    }

    let newVal: string;

    if (Number(valArray[0].replace('.', '')) >= 10000) {
      newVal = '10.000';
      this.model.control.setValue(newVal);
    }

    if (Number(valArray[0]) === 0) {
      newVal = '';
      this.model.control.setValue(newVal);
    }

  }

}
