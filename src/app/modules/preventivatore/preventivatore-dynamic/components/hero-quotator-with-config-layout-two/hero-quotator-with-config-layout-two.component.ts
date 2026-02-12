import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { DataService } from '@services';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-hero-quotator-with-config-layout-two',
  templateUrl: './hero-quotator-with-config-layout-two.component.html',
  styleUrls: ['./hero-quotator-with-config-layout-two.component.scss']
})
export class HeroQuotatorWithConfigLayoutTwoComponent extends PreventivatoreAbstractComponent {

  constructor(public dataService: DataService,
              ref: ChangeDetectorRef) {
    super(ref);
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
