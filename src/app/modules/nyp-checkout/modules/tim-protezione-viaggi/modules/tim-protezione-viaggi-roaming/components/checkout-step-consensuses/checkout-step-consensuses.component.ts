import {
  NypCheckoutService,
  NypIadDocumentaryService,
} from "@NYP/ngx-multitenant-core";
import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthService, DataService } from "@services";
import { ComponentFeaturesService } from "app/core/services/componentFeatures.service";
import {
  CheckoutStepPaymentDocumentsAcceptance,
  CheckoutStepPaymentProduct,
  CheckoutStepPaymentPromoCode,
} from "app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment.model";
import { CheckoutStates } from "app/modules/nyp-checkout/models/api.model";
import { NypDataService } from "app/modules/nyp-checkout/services/nyp-data.service";
import { FormHumanError } from "app/shared/errors/form-human-error.model";
import { KenticoPipe } from "app/shared/pipe/kentico.pipe";
import { ToastrService } from "ngx-toastr";
import { concat } from "rxjs";
import { filter, map, mergeMap, take, tap } from "rxjs/operators";
import { TimProtezioneViaggiRoamingApiService } from "../../services/api.service";
import { NYP_KENTICO_NAME } from "app/modules/nyp-checkout/nyp-checkout.module";
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from '../../../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { SellerCodeConfig } from "app/modules/nyp-checkout/modules/nyp-stripe/components/seller-code/seller-code.component";

@Component({
    selector: "app-checkout-step-consensuses",
    templateUrl: "./checkout-step-consensuses.component.html",
    styleUrls: [
        "./checkout-step-consensuses.component.scss",
        "../../../../../../styles/checkout-forms.scss",
        "../../../../../../styles/size.scss",
        "../../../../../../styles/colors.scss",
        "../../../../../../styles/text.scss",
        "../../../../../../styles/common.scss",
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class CheckoutStepConsensusesComponent implements OnInit {
  public readonly pageStates: CheckoutStates[] = ["consensuses"];
  public isMobile: boolean = window.innerWidth < 768;
  @HostListener("window:resize", ["$event"])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
  }
  @Input("state") public state: CheckoutStates;
  @ViewChild("innerhide") public HIDE;

  titleStates: CheckoutStates[] = [
    "insurance-info",
    "login-register",
    "address",
    "survey",
  ];
  summaryStates: CheckoutStates[] = [];

  private readonly COMPONENT_FEATURE_NAME = "checkout-step-payment";
  private readonly DOUBLE_INFO_SET_RULE = "double-info-set";
  private readonly HIDE_PROMO_CODE_RULE = "hide-promo-code";
  public doubleSetInfo: string;
  public product: CheckoutStepPaymentProduct;
  public documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  public promoCode: CheckoutStepPaymentPromoCode;
  public documentsAcceptancesForm: UntypedFormGroup;
  private latestForm: { uno: boolean; due: boolean /* tre: boolean */ } = {
    uno: false,
    due: false /* tre: false */,
  };

  public disableDocuments: boolean = false;
  public hidePromoCode: boolean = false;
  public productPaymentMethod: number[] = [];
  public sellerCodeConfig: SellerCodeConfig;

  public get FormEnabled(): boolean {
    return (
      this.documentsAcceptancesForm.controls["uno"].value &&
      this.documentsAcceptancesForm.controls["due"].value
    );
  }

  constructor(
    public componentFeaturesService: ComponentFeaturesService,
    public dataService: DataService,
    private toastr: ToastrService,
    protected nypCheckoutService: NypCheckoutService,
    private apiService: TimProtezioneViaggiRoamingApiService,
    private formBuilder: UntypedFormBuilder,
    private kentico: KenticoPipe,
    public nypDataService: NypDataService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
    private authService: AuthService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,

  ) { }

  ngOnInit(): void {
    this.documentsAcceptancesForm = this.formBuilder.group({
      uno: [false, Validators.required],
      due: [false, Validators.required],
      // tre: [false, Validators.required],
    });

    this.initSellerCodeConfig();

    this.documentsAcceptancesForm.valueChanges.subscribe(
      (value: { uno: boolean; due: boolean /*tre: boolean */ }) => {
        const regex = /href=\"(.*?)\"/gm;

        Object.entries(value).forEach(([k, v]) => {
          if (this.latestForm[k] != v && !!v) {
            let source: string;
            let currentRgx;
            const links = [];

            switch (k) {
              case "uno":
                {
                  source = this.kentico.transform(
                    "tim_protezione_viaggi.documents_set_informativo_roaming_viaggi"
                  );
                }
                break;
              case "due":
                {
                  source = this.kentico.transform(
                    "tim_protezione_viaggi.documents_acceptance_checkbox_2_viaggi"
                  );
                }
                break;
              // case 'tre': {
              //   source = this.kentico.transform('tim_bill_protection.checkbox_documents_acceptance_3_bp');
              // }; break;
            }

            while ((currentRgx = regex.exec(source)) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (currentRgx.index === regex.lastIndex) regex.lastIndex++;

              if (currentRgx?.length == 2)
                links.push(currentRgx[1]?.split("?")?.[0]);
            }

            concat(
              ...links.map((doc) =>
                this.nypIadDocumentaryService
                  .downloadFileFromUrl({
                    filename: doc?.split("/")?.pop(),
                    remoteUrl: doc,
                  })
                  .pipe(
                    map((r) => ({
                      content: r,
                      filename: doc?.split("/")?.pop(),
                    }))
                  )
              )
            ).subscribe((b) => saveAs(b.content, b.filename));
          }
        });

        let digitalData: digitalData = window['digitalData'];
        const condition = `${value?.uno ? 'Accetto uno' : ''} ${value?.due ? 'Accetto due' : ''}`;
        digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + condition;
        this.adobeAnalyticsDataLayerService.adobeTrackClick();
        this.latestForm = value;
      }
    );

    this.nypDataService.CurrentState$.pipe(
      filter((state) => this.pageStates.includes(state))
    ).subscribe(() => {
      this.getComponentFeaturesRules();
      // this.checkPaymentFail();
    });
  }

  private initSellerCodeConfig(): void {
    this.nypDataService.Order$.subscribe((res) => {
      const currentInsuredItems = res.orderItem[0]?.insured_item;

      this.sellerCodeConfig = {
        apiService: this.apiService,
        insuredItems: currentInsuredItems
      };
    });
  }

  private getComponentFeaturesRules(): void {
    this.componentFeaturesService.useComponent(this.COMPONENT_FEATURE_NAME);
    this.setDoubleInformativeSet();
    this.getHidePromoCode();
  }

  private setDoubleInformativeSet(): void {
    this.componentFeaturesService.useRule(this.DOUBLE_INFO_SET_RULE);
  }
  public getHidePromoCode() {
    this.componentFeaturesService.useComponent(this.COMPONENT_FEATURE_NAME);
    this.componentFeaturesService.useRule(this.HIDE_PROMO_CODE_RULE);
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.hidePromoCode = this.componentFeaturesService.isRuleEnabled();
    }
  }

  public handleApplyPromoCode(promoCode: CheckoutStepPaymentPromoCode) {
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + "Applica codice promo" + promoCode;
    this.adobeAnalyticsDataLayerService.adobeTrackClick();
    this.nypCheckoutService
      .applyCouponCode(
        this.nypDataService.Order$.value.id,
        promoCode.value,
        this.nypDataService.Order$.value.orderCode,
        this.nypDataService.Order$.value.orderItem?.[0]?.id
      )
      .pipe(
        tap(
          (response) =>
          (this.promoCode = Object.assign({}, promoCode, {
            applied: true,
            promotion_name: response.promotion_name,
          }))
        ),
        mergeMap(() =>
          this.apiService.getOrder(this.nypDataService.Order$.value.orderCode)
        )
      )
      .subscribe(
        (response) => {
          this.toastr.success(
            this.kentico.transform(NYP_KENTICO_NAME + ".promo_code_success")
          );
        },
        (error) => {
          this.toastr.error(
            this.kentico.transform(NYP_KENTICO_NAME + ".promo_code_error")
          );
          throw new FormHumanError("Invalid promo code");
        }
      );
  }

  handlePrevStep(): void {
    //this.nypDataService.CurrentState$.next('insurance-info');
  }

  //TODO: adding gup pay
  public handleNextStep() {
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = 'Continua';
    this.adobeAnalyticsDataLayerService.adobeTrackClick();
    this.nypDataService.CurrentState$.next('payment');
  }
}
