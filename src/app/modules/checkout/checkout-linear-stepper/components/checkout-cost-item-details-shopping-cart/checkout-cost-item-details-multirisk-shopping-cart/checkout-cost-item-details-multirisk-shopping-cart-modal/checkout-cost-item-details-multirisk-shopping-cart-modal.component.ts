import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';

@Component({
  selector: 'app-checkout-cost-item-details-multirisk-shopping-cart-modal',
  templateUrl: './checkout-cost-item-details-multirisk-shopping-cart-modal.component.html',
  styleUrls: ['./checkout-cost-item-details-multirisk-shopping-cart-modal.component.scss']
})
export class CheckoutCostItemDetailsMultiriskShoppingCartModalComponent implements OnInit {
  @Input() kenticoContent: any;
  @Input() title: any;
  @Input() codice: any;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService) { }

  ngOnInit() {
  }

}
