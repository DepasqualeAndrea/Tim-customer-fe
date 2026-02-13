import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-how-works-whithout-slider',
    templateUrl: './how-works-whithout-slider.component.html',
    styleUrls: ['./how-works-whithout-slider.component.scss'],
    standalone: false
})
export class HowWorksWhithoutSliderComponent extends PreventivatoreAbstractComponent  {

  constructor(ref: ChangeDetectorRef) {
    super(ref);
  }


}
