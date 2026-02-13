import {Component, Input, OnInit} from '@angular/core';
import {PreventivatoreComponent} from '../preventivatore/preventivatore.component';
import {RequestCheckout, RequestOrder} from '../../../core/models/order.model';
import {PreventivatoreConstants} from '../PreventivatoreConstants';
import {finalize} from 'rxjs/operators';
import {ExternalPlatformRequestOrder} from '../../../core/models/externalCheckout/external-platform-request-order.model';

@Component({
    selector: 'app-quotator-simple-ct',
    templateUrl: './quotator-simple-ct.component.html',
    styleUrls: ['../preventivatoreCT.component.scss'],
    standalone: false
})
export class QuotatorSimpleCtComponent extends PreventivatoreComponent implements OnInit {

  @Input() product;

  ngOnInit() {
    this.utm_source_prev = this.route.snapshot.queryParamMap.get('utm_source');
    this.telemarketer = parseInt(this.route.snapshot.queryParamMap.get('telemarketer'), 10);
  }

  checkoutCt() {
    const order = this.createOrderObj(this.product);
    const orderWithUtm = this.checkoutService.addUtmSource(order, this.utm_source_prev, this.telemarketer);

    this.checkoutService.redirectExternalCheckout(orderWithUtm, this.product);
  }

  createOrderObj(product): RequestOrder {
    return {
      order: {
        line_items_attributes: {
          '0': {
            variant_id: product.master_variant,
            quantity: 1,
            addon_ids: []
          }
        }
      }
    };
  }

}
