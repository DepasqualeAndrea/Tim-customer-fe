import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NetCyberBusinessCheckoutService } from '../../services/checkout.service';
import { NetCyberBusinessService } from '../../services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
  selector: 'app-checkout-step-insurance-info',
  templateUrl: './checkout-step-insurance-info.component.html',
  styleUrls: ['./checkout-step-insurance-info.component.scss', '../../../../styles/checkout-forms.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {
  public Order$ = this.nypDataService.Order$;
  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly summaryStates: CheckoutStates[] = ['insurance-info', 'address', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  kenticoContent: any;
  previousInsuranceInfoState: any;
  price: string | number;

  constructor(private kenticoTranslateService: KenticoTranslateService,public nypDataService: NypDataService,public checkoutService: NetCyberBusinessCheckoutService, private apiService: NetCyberBusinessService){}

  ngOnInit(): void {
    this.kenticoTranslateService.getItem<any>('checkout_customers_net_cyber_business').subscribe(item => {
      this.kenticoContent = item;
    });

    this.checkoutService.InsuranceInfoState$.subscribe(state => {
    });

    
  }

  getPrice(): number {
    const orderItem = this.Order$.value?.orderItem[0];
    const packet = this.Order$.value?.packet;

    if (orderItem?.instance?.quotation?.data?.[0]?.total) {
      return Number(orderItem.instance.quotation.data[0].total) || 0;
    }

    const packetDuration = packet?.data?.['packet_duration']?.['packet_duration'];
    if (Array.isArray(packetDuration) && packetDuration.length > 0) {
      const selectedDuration = packetDuration[0] || packetDuration[1];
      return Number(selectedDuration?.price) || 0;
    }

    return 0;
  }

  manageWarrantyConfStep(event: any){
    this.previousInsuranceInfoState = event;
  }

}