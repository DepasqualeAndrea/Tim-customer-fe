import { Component, OnInit } from '@angular/core';
import { InsurancesService, CheckoutService, DataService } from '@services';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { EstimatesMockService } from 'app/core/services/mock/estimates.mock.service';
import { ToastrService } from 'ngx-toastr';
import { CovidInfoStepController } from 'app/modules/checkout/product-checkout-step-controllers/fca-mopar-covid-free/covid-info-step-controller';
import { switchMap } from 'rxjs/operators';
import { NypCheckoutService, NypInsurancesService } from '@NYP/ngx-multitenant-core';


@Component({
    selector: 'app-my-quotes',
    templateUrl: './my-quotes.component.html',
    styleUrls: ['./my-quotes.component.scss'],
    standalone: false
})
export class MyQuotesComponent implements OnInit {

  quotes: any;
  noQuotes = false;

  constructor(private insurancesService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    private router: Router,
    protected nypCheckoutService: NypCheckoutService,
    private dataService: DataService,
    // private estimatesMockService: EstimatesMockService,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit() {
    this.insurancesService.getQuotes().subscribe(res => {
      this.quotes = res.estimates.sort((a, b) => b.created_at.localeCompare(a.created_at));
      if (!this.quotes || this.quotes.length === 0) {
        this.noQuotes = true;
      }
    });
    // MOCKED SERVICE TO USE WITH JSON-SERVER 'npm run start'
    // this.estimatesMockService.getMockedQuotes().subscribe(res => {
    //   this.quotes = res;
    // })
    localStorage.removeItem('Proposal');
    localStorage.removeItem('Customized');
  }

  getSmallImage(images) {
    if (images && images.length) {
      let imgs = _.find(images, ['image_type', 'fp_image']);
      if (!imgs) {
        imgs = _.find(images, ['image_type', 'default']) ? _.find(images, ['image_type', 'default']) : _.find(images, ['image_type', 'common_image']);
      }
      return imgs.small_url;
    } else {
      return '';
    }
  }

  redirectMotorHomeProduct(quote: any, modifyOrPayment?: string) {
    if (quote.product_name === 'Auto' || quote.product_name === 'Furgoni') {
      localStorage.setItem('Proposal', quote.product_name === 'Auto' ? 'Auto' : 'Furgoni');
      this.insurancesService.resumeEstimates(quote.id, modifyOrPayment).subscribe((data) => {
        if (modifyOrPayment === 'insurance_info') {
          localStorage.setItem('motor-payment-modify', 'modify');
          localStorage.setItem('order-number', quote.order_number);
        } else if (modifyOrPayment === 'payment') {
          localStorage.setItem('motor-payment-modify', 'payment');
          localStorage.setItem('order-number', quote.order_number);
        }
        this.router.navigate(['/estimate-redirect-checkout']);
      }, (err) => {
        console.log(err.status);
        if (err.status !== 200) {
          this.toastrService.error('Errore durante il caricamento delle informazioni. Riprovare tra poco.');
        }
      });
    } else {
      localStorage.setItem('Proposal', 'Casa');
      localStorage.setItem('motor-payment-modify', 'payment');
      localStorage.setItem('order-number', quote.order_number);
      this.router.navigate(['/estimate-redirect-checkout']);
    }
  }

  isForSale(quote): boolean {
    if (!this.dataService.isTenant('chebanca_db')) {
      return true;
    } else { return this.dataService.isTenant('chebanca_db') && quote.actions_availability.for_sale; }
  }

  redirectMultirisk(order_number: string) {
    this.nypCheckoutService.getOrder(order_number).pipe(switchMap(order => {
      this.dataService.setResponseOrder(order)
      return this.nypInsurancesService.getProduct(order.line_items[0].product.id)
    })).subscribe(product => {
      this.dataService.setProduct(product);
      this.router.navigate(['checkout/survey']);
    });
  }
}
