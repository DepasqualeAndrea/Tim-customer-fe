import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-quotation-redirect-button',
  templateUrl: './quotation-redirect-button.component.html',
  styleUrls: ['./quotation-redirect-button.component.scss']
})
export class QuotationRedirectButtonComponent  extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
