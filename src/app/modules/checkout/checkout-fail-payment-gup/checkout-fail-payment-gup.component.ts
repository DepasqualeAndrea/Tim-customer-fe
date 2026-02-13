import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService, DataService, InsurancesService } from '@services';
import { PREVENTIVATORE_URL_KEY } from 'app/modules/preventivatore/preventivatore/preventivatore.component';
import { CHECKOUT_OPENED } from '../services/checkout.resolver';
import { NypCheckoutService, NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-checkout-fail-payment-gup',
    templateUrl: './checkout-fail-payment-gup.component.html',
    styleUrls: ['./checkout-fail-payment-gup.component.scss'],
    standalone: false
})
export class CheckoutFailPaymentGupComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private nypCheckoutService: NypCheckoutService,
    private dataService: DataService,
    private router: Router,
    private nypInsuranceService: NypInsurancesService,
  ) { }

  ngOnInit() {
    this.dataService.loadFieldToRecover();

    localStorage.removeItem(PREVENTIVATORE_URL_KEY);
    localStorage.removeItem(CHECKOUT_OPENED);
    localStorage.setItem('stateCheckout', 'payment');

    this.route.queryParams
      .subscribe(params => {
        if (params.order) {
          this.nypCheckoutService.failedOrder(params.order, localStorage.getItem('version')).subscribe()
          this.nypCheckoutService.getOrder(params.order).subscribe(order => {
            this.dataService.setResponseOrder(order);
            this.dataService.price = order.total
            this.nypInsuranceService.getProducts().subscribe(res => {
              this.dataService.setProduct(res.products.find(product => product.product_code === order.line_items[0].product.product_code));
              return this.router.navigate(['checkout']);
            });
          });
        }
      }
      );
  }

}
