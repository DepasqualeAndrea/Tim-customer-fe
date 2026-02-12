import { Component, OnInit } from '@angular/core';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { InsurancesService, AuthService, DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import { CheckoutStepCompleteAbstractComponent } from '../checkout-step-complete-abstract';
import { RequestOrder, ResponseOrder } from '@model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { FamilyRcValues } from 'app/modules/preventivatore/preventivatore-dynamic/components/quotator-rc-fca/rc-auto.enum';
import { ChangeStatusService } from '../../../../../core/services/change-status.service';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-linear-stepper-complete',
  templateUrl: './checkout-linear-stepper-complete.component.html',
  styleUrls: ['./checkout-linear-stepper-complete.component.scss']
})
export class CheckoutLinearStepperCompleteComponent extends CheckoutStepCompleteAbstractComponent implements OnInit {

  civibanklittleDescriptionEnabled: boolean;
  featureProducts: any;
  order: ResponseOrder;

  constructor(
    checkoutStepService: CheckoutStepService,
    insurancesService: InsurancesService,
    nypInsuranceService: NypInsurancesService,
    authService: AuthService,
    dataService: DataService,
    kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService,
    private changeStatusService: ChangeStatusService
  ) {
    super(checkoutStepService, insurancesService, nypInsuranceService, authService, dataService, kenticoTranslateService, componentFeaturesService);
  }

  startDate: string;
  endDate: string;
  showFamilyRcDisclaimer: boolean;
  startHoursMinutes: string;
  thank_you_image: string;
  thank_you_image_alt: string;
  littleDescriptionEnabled = true;

  thankYouPageLayoutEnabled = false;
  thankYouPageLayoutType: string;

  ngOnInit() {
    super.ngOnInit();
    this.order = this.dataService.getResponseOrder();
    this.civibanklittleDescriptionEnabled = this.civibankTravelThankYouPage();
    this.thankYouPageLayoutEnabled = this.isThankYouPageLayoutEnabled();
    if (this.isThankYouPageLayoutEnabled) {
      this.getCurrentProductThankYouPageLayout(this.currentStep.product.code);
    }
    this.componentFeaturesService.useComponent('checkout-linear-stepper-complete');
    this.componentFeaturesService.useRule('typ-little-description');
    this.littleDescriptionEnabled = this.componentFeaturesService.isRuleEnabled();
    this.startDate = this.getStartDate();
    this.endDate = this.getEndDate();
    this.startHoursMinutes = this.getStartHoursMinutes();
    this.showFamilyRcDisclaimer = this.hasRcFamilyInsurance();
    this.kenticoTranslateService.getItem<any>('checkout_pet').pipe(take(1)).subscribe(item => {
      this.thank_you_image = item?.thank_you_page?.ty_page_image?.thumbnail?.value[0]?.url;
      this.thank_you_image_alt = item?.thank_you_page?.ty_page_image?.thumbnail?.value[0]?.description;
    });
    if (this.currentStep.product.code === 'virtualhospital-annual' || this.currentStep.product.code === 'virtualhospital-monthly') {
      this.kenticoTranslateService.getItem<any>('checkout_telemedicina').pipe(take(1)).subscribe()
    }
  }

  civibankTravelThankYouPage() {
    this.componentFeaturesService.useComponent('stepper-complete-litle-button');
    this.componentFeaturesService.useRule('typ-little-description');
    this.littleDescriptionEnabled = this.componentFeaturesService.isRuleEnabled();
    this.featureProducts = this.componentFeaturesService.getConstraints().get('products') || [];
    if (this.featureProducts.includes(this.currentStep.product.code)) {
      return true;
    }
  }

  isThankYouPageLayoutEnabled(): boolean {
    this.componentFeaturesService.useComponent('checkout-linear-stepper-complete');
    this.componentFeaturesService.useRule('get-ty-page-layout');
    return this.componentFeaturesService.isRuleEnabled();
  }

  getCurrentProductThankYouPageLayout(productCode: string) {
    const kvProductLayouts = this.componentFeaturesService.getConstraints();
    kvProductLayouts.forEach((layoutType, code, map) => {
      if (code === productCode) {
        this.thankYouPageLayoutType = layoutType;
      }
    });
    if (!this.thankYouPageLayoutType) {
      this.thankYouPageLayoutEnabled = false;
    }
  }

  getStartDate() {
    const responseOrder = this.dataService.getResponseOrder();
    const startDate = new Date(responseOrder.line_items[0].start_date);
    const day = startDate.getDate().toString().padStart(2, '0');
    const month = (1 + startDate.getMonth()).toString().padStart(2, '0');
    const year = startDate.getFullYear();
    return day + '/' + month + '/' + year;
  }

  getEndDate() {
    const responseOrder = this.dataService.getResponseOrder();
    const endDate = new Date(responseOrder.line_items[0].expiration_date);
    const day = endDate.getDate().toString().padStart(2, '0');
    const month = (1 + endDate.getMonth()).toString().padStart(2, '0');
    const year = endDate.getFullYear();
    return day + '/' + month + '/' + year;
  }

  getStartHoursMinutes() {
    const responseOrder = this.dataService.getResponseOrder();
    const startDate = new Date(responseOrder.line_items[0].start_date);
    const hours = (startDate.getHours() < 10 ? '0' : '') + startDate.getHours().toString();
    const minutes = (startDate.getMinutes() < 10 ? '0' : '') + startDate.getMinutes().toString();
    return hours + ':' + minutes;
  }

  hasRcFamilyInsurance() {
    const responseOrder = this.dataService.getResponseOrder();
    return true;
  }

  createRequestOrder(): RequestOrder {
    return undefined;
  }

}
