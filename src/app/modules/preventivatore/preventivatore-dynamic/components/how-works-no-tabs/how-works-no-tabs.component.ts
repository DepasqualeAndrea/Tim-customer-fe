import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-how-works-no-tabs',
    templateUrl: './how-works-no-tabs.component.html',
    styleUrls: ['./how-works-no-tabs.component.scss'],
    standalone: false
})
export class HowWorksNoTabsComponent  extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
