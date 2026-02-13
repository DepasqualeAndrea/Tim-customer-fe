import { Component, OnInit } from '@angular/core';
import { PreventivatoreDiscountCodeAbstractComponent } from '../preventivatore-abstract/preventivatore-discount-code-abstract.component';


@Component({
    selector: 'app-bg-img-hero-dc',
    templateUrl: './bg-img-hero-dc.component.html',
    styleUrls: ['./bg-img-hero-dc.component.scss'],
    standalone: false
})
export class BgImgHeroDCComponent extends PreventivatoreDiscountCodeAbstractComponent implements OnInit {

  ngOnInit() {
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
