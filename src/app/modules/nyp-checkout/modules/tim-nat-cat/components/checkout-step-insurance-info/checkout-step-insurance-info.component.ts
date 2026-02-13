import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { TimNatCatCheckoutService } from '../../services/checkout.service';


@Component({
    selector: 'app-checkout-step-insurance-info',
    templateUrl: './checkout-step-insurance-info.component.html',
    styleUrls: ['./checkout-step-insurance-info.component.scss', '../../../../styles/checkout-forms.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {
  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly summaryStates: CheckoutStates[] = ['insurance-info', 'address', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  kenticoContent: any;
  previousInsuranceInfoState: any;

  constructor(private kenticoTranslateService: KenticoTranslateService, public checkoutService: TimNatCatCheckoutService){}

  ngOnInit(): void {
    this.kenticoTranslateService.getItem<any>('checkout_customers_nat_cat').subscribe(item => {
      this.kenticoContent = item;
    });
  }

  manageWarrantyConfStep(event: any){
    this.previousInsuranceInfoState = event;
  }
}
