import { NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CheckoutService } from '@services';
import { DataService } from 'app/core/services/data.service';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';

@Component({
  selector: 'app-checkout-step-outside-source',
  templateUrl: './checkout-step-outside-source.component.html',
  styleUrls: ['./checkout-step-outside-source.component.scss']
})
export class CheckoutStepOutsideSourceComponent implements OnInit {


  urlSafe: SafeResourceUrl;
  stopListening: Function;
  private externalUrl: string;

  constructor(
    public sanitizer: DomSanitizer,
    public dataService: DataService,
    private renderer: Renderer2,
    private router: Router,
    private nypCheckoutService: NypCheckoutService,
    private checkoutStepService: CheckoutStepService
  ) {
    this.stopListening = renderer.listen('window', 'message', this.handleMessage.bind(this));
  }

  ngOnInit() {
    let productCode = this.dataService.product.product_code;
    this.externalUrl = this.dataService.tenantInfo.iframeConfig[productCode] + this.dataService.responseOrder.number;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.externalUrl);
  }

  handleMessage(event: Event) {
    const message = event as MessageEvent;
    if (message) {
      this.nypCheckoutService.getOrder(this.dataService.responseOrder.number).subscribe(order => {
        this.checkoutStepService.setCustomReduce({ reduceKey: 'updateCostItem', payload: order });
        this.router.navigate(['/checkout/payment']);
      })
    }
  }

}
