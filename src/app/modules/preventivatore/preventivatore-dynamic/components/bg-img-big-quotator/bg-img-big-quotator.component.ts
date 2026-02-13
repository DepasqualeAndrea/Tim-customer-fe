import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-bg-img-big-quotator',
    templateUrl: './bg-img-big-quotator.component.html',
    styleUrls: ['./bg-img-big-quotator.component.scss'],
    standalone: false
})
export class BgImgBigQuotatorComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
