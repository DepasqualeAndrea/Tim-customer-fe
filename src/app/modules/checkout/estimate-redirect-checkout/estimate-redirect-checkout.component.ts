import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService, DataService, InsurancesService } from '@services';
import { PREVENTIVATORE_URL_KEY } from '../../preventivatore/preventivatore/preventivatore.component';
import { CHECKOUT_OPENED } from '../services/checkout.resolver';
import { NypCheckoutService, NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-estimate-redirect-checkout',
  templateUrl: './estimate-redirect-checkout.component.html',
  styleUrls: ['./estimate-redirect-checkout.component.scss']
})
export class EstimateRedirectCheckoutComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    protected nypCheckoutService: NypCheckoutService,
    private dataService: DataService,
    private router: Router,
    private nypInsuranceService: NypInsurancesService) { }

  ngOnInit() {
    localStorage.removeItem(PREVENTIVATORE_URL_KEY);
    localStorage.removeItem(CHECKOUT_OPENED);
    localStorage.setItem('redirect-checkout', JSON.stringify(true));
    const orderNumber = localStorage.getItem('order-number');
    this.nypCheckoutService.getOrder(orderNumber).subscribe(order => {
      this.dataService.setResponseOrder(order);
      this.nypInsuranceService.getProducts().subscribe(res => {
        this.dataService.setProduct(res.products.find(product => product.product_code === order.line_items[0].product.product_code));
        if (localStorage.getItem('motor-payment-modify') === 'modify') {
          this.router.navigate(['/checkout/insurance-info']);
        } else {
          this.router.navigate(['checkout']);
        }
        localStorage.removeItem('order-number');
        localStorage.removeItem('motor-payment-modify');
      });
    });
  }
}
