import {Compiler, Component, Injector, Input, NgModuleRef, ViewEncapsulation} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-how-works-cb',
  templateUrl: './how-works-cb.component.html',
  styleUrls: ['./how-works-cb.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HowWorksCbComponent {

  @Input() productInformation;

  constructor() {
  }

}
