import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-checkout-cost-item-download-preventivo',
  templateUrl: './checkout-cost-item-download-preventivo.component.html',
  styleUrls: ['./checkout-cost-item-download-preventivo.component.scss']
})
export class CheckoutCostItemDownloadPreventivoComponent {

  @Input() data: any;

  constructor() {
  }

}
