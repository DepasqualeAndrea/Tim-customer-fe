import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-bg-img-quote',
  templateUrl: './bg-img-quote.component.html',
  styleUrls: ['./bg-img-quote.component.scss']
})
export class BgImgQuoteComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
