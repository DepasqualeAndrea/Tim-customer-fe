import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, CheckoutService, DataService, InsurancesService } from '@services';
import { PREVENTIVATORE_URL_KEY } from '../../preventivatore/preventivatore/preventivatore.component';
import { CHECKOUT_OPENED } from '../services/checkout.resolver';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from '../../kentico/data-layer/kentico-translate.service';
import { NypCheckoutService, NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-payment-callback-done',
  templateUrl: './checkout-payment-callback-done.component.html',
  styleUrls: ['./checkout-payment-callback-done.component.scss']
})
export class CheckoutPaymentCallbackDoneComponent implements OnInit {

  kenticoSiaDone: string;

  constructor(private route: ActivatedRoute,
    private nypCheckoutService: NypCheckoutService,
    private dataService: DataService,
    private router: Router,
    private nypInsuranceService: NypInsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('checkout').pipe(take(1)).subscribe(item => {
      this.kenticoSiaDone = item.payment_done.value;
    });
    localStorage.removeItem(PREVENTIVATORE_URL_KEY);
    localStorage.removeItem(CHECKOUT_OPENED);
    this.route.queryParams
      .subscribe(params => {
        if (params.order) {
          this.nypCheckoutService.getOrder(params.order).subscribe(order => {
            this.dataService.setResponseOrder(order);
            this.nypInsuranceService.getProducts().subscribe(res => {
              this.dataService.setProduct(res.products.find(product => product.product_code === order.line_items[0].product.product_code));
              return this.router.navigate(['checkout']);
            });
          }, (err) => {
            if (err.status === 401) {
              this.router.navigate(['/login'], {
                queryParams: {
                  return: this.route.snapshot.url[0].path
                }
              });
            }
          });
        }
      }
      );
  }

}
