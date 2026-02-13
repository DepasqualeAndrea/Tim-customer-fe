import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService, DataService, InsurancesService } from '@services';
import { PREVENTIVATORE_URL_KEY } from '../../preventivatore/preventivatore/preventivatore.component';
import { CHECKOUT_OPENED } from '../services/checkout.resolver';
import { NypCheckoutService, NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-redirect-checkout',
    templateUrl: './redirect-checkout.component.html',
    styleUrls: ['./redirect-checkout.component.scss'],
    standalone: false
})
export class RedirectCheckoutComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private nypCheckoutService: NypCheckoutService,
    private dataService: DataService,
    private router: Router,
    private nypInsurancesService: NypInsurancesService) {
  }

  ngOnInit() {
    localStorage.removeItem(PREVENTIVATORE_URL_KEY);
    localStorage.removeItem(CHECKOUT_OPENED);
    localStorage.setItem('redirect-checkout', JSON.stringify(true));
    this.route.queryParams
      .subscribe(params => {
        if (params.order) {
          this.nypCheckoutService.getOrder(params.order).subscribe(order => {
            this.dataService.setResponseOrder(order);
            this.nypInsurancesService.getProducts().subscribe(res => {
              this.dataService.setProduct(res.products.find(product => product.product_code === order.line_items[0].product.product_code));
              return this.router.navigate(['checkout']);
            });
          });
        }
      }
      );
  }
}
