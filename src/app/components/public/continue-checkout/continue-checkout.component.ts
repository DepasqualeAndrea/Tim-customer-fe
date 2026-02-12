import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService, DataService, InsurancesService } from '@services';
import { ExternalPlatformResponseOrder } from '../../../core/models/externalCheckout/external-platform-response-order.model';
import { MyRouter } from '../../../app.module';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-continue-checkout',
  templateUrl: './continue-checkout.component.html',
  styleUrls: ['./continue-checkout.component.scss']
})
export class ContinueCheckoutComponent implements OnInit {

  private responseOrder: ExternalPlatformResponseOrder;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private nypInsurancesService: NypInsurancesService,
    private router: Router
  ) {

  }

  ngOnInit() {
    const jwt: string = this.activatedRoute.snapshot.queryParamMap.get("order");
    this.responseOrder = jwt_decode(jwt) as ExternalPlatformResponseOrder;
    this.nypInsurancesService.getProduct(this.responseOrder.productId + '').subscribe((product) => {
      this.dataService.setResponseOrder(this.responseOrder.responseOrder);
      this.dataService.setProduct(product);

      return this.router.navigate(['apertura']);
    });
  }


}
