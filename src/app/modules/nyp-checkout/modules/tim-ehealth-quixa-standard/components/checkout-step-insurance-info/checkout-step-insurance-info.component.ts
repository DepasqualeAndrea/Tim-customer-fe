import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, } from '@angular/forms';
import { AuthService, DataService } from '@services';
import { CheckoutStates} from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { TimEhealthQuixaStandardCheckoutService } from '../../services/checkout.service';
import { TimEhealthQuixaStandardApiService } from '../../services/api.service';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import {digitalData} from '../../../../../../core/services/adobe_analytics/adobe-analytics-data.model';


@Component({
  selector: 'app-checkout-step-insurance-info',
  templateUrl: './checkout-step-insurance-info.component.html',
  styleUrls: ['./checkout-step-insurance-info.component.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss']
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {
  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly titleStates: CheckoutStates[] = [];
  public readonly summaryStates: CheckoutStates[] = ['address', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  @Input('isMobileView') public isMobileView: boolean = false;

  public readonly KenticoPrefix = 'insurance_info';
  public warranties: any[] = [];

  public Order$ = this.nypDataService.Order$;


  constructor(
    private formBuilder: FormBuilder,
    public nypUserService: NypUserService,
    public dataService: DataService,
    public checkoutService: TimEhealthQuixaStandardCheckoutService,
    private apiService: TimEhealthQuixaStandardApiService,
    private authService: AuthService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.warranties = this.Order$?.value?.packet?.data?.warranties?.sort((a, b) => {
      return a['position'] - b['position'];
    }) || [];
  }
  handleNextStep(): void {
    let digitalData: digitalData = window['digitalData'];
    digitalData.page.pageInfo.pageName = `${this.nypDataService.CurrentState$.value}_LoginPage`;
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    this.nypDataService.CurrentState$.next('login-register');
  }

}
