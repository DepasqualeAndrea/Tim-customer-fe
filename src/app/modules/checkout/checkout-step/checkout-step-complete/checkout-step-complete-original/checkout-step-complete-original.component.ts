import { ComponentFeaturesService } from './../../../../../core/services/componentFeatures.service';
import { ComponentFeatures } from './../../../../../core/models/componentfeatures/componentfeatures.model';
import { Component, OnInit } from '@angular/core';
import { RequestOrder } from '@model';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { InsurancesService, AuthService, DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import { CheckoutStepCompleteAbstractComponent } from '../checkout-step-complete-abstract';
import { RouterService } from 'app/core/services/router.service';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-checkout-step-complete-original',
    templateUrl: './checkout-step-complete-original.component.html',
    styleUrls: ['./checkout-step-complete-original.component.scss'],
    standalone: false
})
export class CheckoutStepCompleteOriginalComponent extends CheckoutStepCompleteAbstractComponent implements OnInit {

  constructor(checkoutStepService: CheckoutStepService,
    insurancesService: InsurancesService,
    nypInsuranceService: NypInsurancesService,
    authService: AuthService,
    dataService: DataService,
    public routerService: RouterService,
    kenticoTranslateService: KenticoTranslateService,
    componentFeaturesService: ComponentFeaturesService
  ) {
    super(checkoutStepService, insurancesService, nypInsuranceService, authService, dataService, kenticoTranslateService, componentFeaturesService);
  }


  ngOnInit() {
    super.ngOnInit();
    this.thankYouPageContent();
    this.kenticoTranslateService.getItem<any>('checkout.purchase_complete_icon').pipe(take(1)).subscribe(item => {
      this.cart = item.images[0].url;
    });
  }

  private thankYouPageContent(): void {
    this.kenticoTranslateService.getItem<any>('thank_you_page_precise_time').pipe(take(1)).subscribe(item => {
      this.ty_image = item.thank_you_page.ty_page_image.thumbnail.value[0].url;
      this.externalLink = item.thank_you_page.thank_you_page_external_link ? item.thank_you_page.thank_you_page_external_link.text.value : null
    });
  }

  public goToBaseUrl(): void {
    this.routerService.navigateBaseUrl();
  }

  public openExternalLink(): void {
    const value: string = this.externalLink;
    window.open(value, '_blank');
  }

  createRequestOrder(): RequestOrder {
    return undefined;
  }

}
