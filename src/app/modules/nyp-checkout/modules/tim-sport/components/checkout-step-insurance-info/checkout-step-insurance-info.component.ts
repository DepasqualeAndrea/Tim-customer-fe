import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, } from '@angular/forms';
import { AuthService, DataService } from '@services';
import { CheckoutStates} from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { TimSportApiService } from '../../services/api.service';
import { TimSportCheckoutService } from '../../services/checkout.service';
import { environment } from 'environments/environment';
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";
import { AdobeAnalyticsDatalayerService } from "app/core/services/adobe_analytics/adobe-init-datalayer.service";
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';

@Component({
    selector: 'app-checkout-step-insurance-info',
    templateUrl: './checkout-step-insurance-info.component.html',
    styleUrls: ['./checkout-step-insurance-info.component.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {
  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly titleStates: CheckoutStates[] = [];
  public readonly summaryStates: CheckoutStates[] = ['survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  @Input('isMobileView') public isMobileView: boolean = false;

  public readonly KenticoPrefix = 'insurance_info';
  public warranties: any[] = [];
  public Order$ = this.nypDataService.Order$;


  constructor(
    private formBuilder: UntypedFormBuilder,
    public nypUserService: NypUserService,
    public dataService: DataService,
    public checkoutService: TimSportCheckoutService,
    private apiService: TimSportApiService,
    private authService: AuthService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.warranties = this.Order$?.value.packet.data.warranties || [];
  }
  handleNextStep(): void {
    this.adobeAnalyticsDataLayerService.adobeTrackClick();
    this.nypDataService.CurrentState$.next('login-register');
  }

}
