import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { RequestOrder } from '@model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { CheckoutService } from 'app/core/services/checkout.service';
import {PreventivatoreAbstractComponent} from '../../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-modal-rc-monopattino-bici-coverages',
  templateUrl: './modal-rc-monopattino-bici-coverages.component.html',
  styleUrls: ['./modal-rc-monopattino-bici-coverages.component.scss']
})
export class ModalRcMonopattinoBiciCoveragesComponent extends PreventivatoreAbstractComponent implements OnInit {

  @Input() content: any;
  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();


  constructor(
    ref: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private checkoutService: CheckoutService,
    private dataService: DataService,
    private router: Router
  ) {
    super(ref);
  }

  ngOnInit() {
  }

  getVariantId(product: any, sku: string) {
    return product.variants.find(variant => variant.sku === sku).id;
  }

  getVariantPrice(sku: string) {
    return this.product.variants.find((variant) => variant.sku === sku).price.toFixed(2).toString().split('.')[0];
  }

  getVariantPriceDecimal(sku: string) {
    const price = this.product.variants.find((variant) => variant.sku === sku).price.toFixed(2).toString().split('.')[1];
    if (price === '00') {
      return undefined;
    } else {
      return price;
    }
  }

  createOrderObj(sku: string) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.getVariantId(this.product, sku),
            quantity: 1
          }
        }
      }
    };
  }

  checkout(sku: string) {
    const order = this.createOrderObj(sku);
    this.sendCheckoutAction(order);
    this.checkoutService.addToChart(<RequestOrder>order).subscribe(res => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      this.activeModal.close();
      return this.router.navigate(['checkout']);
   
   
      
  })}


  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product',
      payload: {
        product: this.product,
        order: order,
        router: 'checkout'
      }
    };
    this.sendActionEvent(action);
  }

}  

