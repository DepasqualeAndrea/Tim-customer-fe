import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NetCyberBusinessCheckoutService } from '../../../services/checkout.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-checkout-step-insurance-info-product-info',
  templateUrl: './checkout-step-insurance-info-product-info.component.html',
  styleUrls: [
    './checkout-step-insurance-info-product-info.component.scss']
})

export class CheckoutStepInsuranceInfoProductInfoComponent implements OnInit {

  @Input() kenticoContent: ProductInfoStepController;
  @Input() price?: number | string;
  @Output() currentState: EventEmitter<string> = new EventEmitter();


  constructor(public checkoutService: NetCyberBusinessCheckoutService, private kenticoTranslateService: KenticoTranslateService) { }

  ngOnInit(): void {
    if (this.price === null) {
      this.price = '00.00';
    }

    this.getKenticoContent();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('checkout_customers_net_cyber_business.step_insurance_warranty')
      .subscribe(response => {
        const item = response.step_insurance_warranty;


        this.kenticoContent = {
          title: item.title?.value || '',
          subtitle: item.subtitle?.value || '',
          description: item.description?.value || '',
          currency: item.currency?.value || '€',
          month: item.month?.value || 'al mese',
          year: item.year?.value || '',
          iconList: item.iconlist?.value?.[0]?.url || '',
          detailOne: item.detailone?.value || '',
          detailTwo: item.detailtwo?.value || '',
          detailThree: item.detailthree?.value || '',
          detailFour: item.detailfour?.value || '',
          buttonBackImg: item.buttonbackimg?.value?.[0]?.url || '',
          buttonNextImg: item.buttonnextimg?.value?.[0]?.url || '',
          buttonBackText: item.buttonbacktext?.value || 'Indietro',
          buttonNextText: item.buttonnexttext?.value || 'CONFERMA E CONTINUA',
          product: item.product?.value || ''
        };
      });
  }

  getPriceIntegerPart(): string {
    if (this.price === null || this.price === undefined) return '0';
    const priceNumber = typeof this.price === 'string' ? parseFloat(this.price) : this.price;
    return Math.floor(priceNumber).toString();
  }

  getPriceDecimalPart(): string {
    if (this.price === null || this.price === undefined) return '00';
    const priceNumber = typeof this.price === 'string' ? parseFloat(this.price) : this.price;
    const decimalPart = (priceNumber % 1).toFixed(2).substring(2);
    return decimalPart.length === 1 ? decimalPart + '0' : decimalPart;
  }

  handleNextStep() {
    this.currentState.emit(this.checkoutService.InsuranceInfoState$.value);
    this.checkoutService.InsuranceInfoState$.next('choicePacket');
  }

}


export interface CoverageDetail {
  text: string;
}

export interface ProductInfoStepController {
  title?: string;
  subtitle?: string;
  description?: string;
  currency?: string;
  month?: string;
  year?: string;
  iconList?: string;
  policyCoverageDetails?: CoverageDetail[];
  detailOne?: string;
  detailTwo?: string;
  detailThree?: string;
  detailFour?: string;
  buttonBackImg?: string;
  buttonNextImg?: string;
  buttonBackText?: string;
  buttonNextText?: string;
  product?: string;
}