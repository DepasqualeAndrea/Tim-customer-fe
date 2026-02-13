import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { CheckoutStates, Question, RecursivePartial } from "app/modules/nyp-checkout/models/api.model";
import { NypDataService } from "app/modules/nyp-checkout/services/nyp-data.service";
import moment from "moment";
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { AdobeAnalyticsDatalayerService } from '../../../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { take } from 'rxjs/operators';
import { TimProtezioneViaggiRoamingApiService } from "../../services/api.service";

@Component({
    selector: "app-checkout-step-survey",
    templateUrl: "./checkout-step-survey.component.html",
    styleUrls: [
        "./checkout-step-survey.component.scss",
        "../../../../../../styles/checkout-forms.scss",
        "../../../../../../styles/size.scss",
        "../../../../../../styles/colors.scss",
        "../../../../../../styles/text.scss",
        "../../../../../../styles/common.scss",
    ],
    standalone: false
})
export class CheckoutStepSurveyComponent implements OnInit {
  @Input("state") public state: CheckoutStates;
  @ViewChild("innerhide") public HIDE;

  titleStates: CheckoutStates[] = [
    "insurance-info",
    "login-register",
    "address",
  ];
  summaryStates: CheckoutStates[] = ["consensuses"];
  questions: RecursivePartial<Question[]>;
  today = moment().format("DD/MM/YYYY");
  form: UntypedFormGroup;
  public readonly errors = {};

  constructor(
    private formBuilder: UntypedFormBuilder,
    public nypDataService: NypDataService,
    private apiService: TimProtezioneViaggiRoamingApiService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
  const currentProduct = this.nypDataService.CurrentProduct$.value;

  if (currentProduct && currentProduct.questions) {
    this.initializeForm(currentProduct);
  } else {
    this.apiService.getProduct().pipe(take(1)).subscribe((product) => {
      if (product) {
        this.nypDataService.CurrentProduct$.next(product);
        this.initializeForm(product);
      }
    });
  }

  this.nypDataService.CurrentProduct$.subscribe((res) => {
    if (res && res.questions) {
      this.questions = res.questions;
      console.log("CurrentProduct$", res);
      if (!this.form) {
        this.initializeForm(res);
      }
    }
  });
}

private initializeForm(product: any): void {
  this.questions = product.questions;

  const formElements = {};
  product.questions.forEach((question) => {
    formElements[question.id] = [
      null,
      [Validators.required]
    ];
    this.errors[question.id] = {};
  });

  this.form = this.formBuilder.group(formElements);
  this.form.valueChanges.subscribe((vc) => {
    this.updateErrors(vc);
  });

  setTimeout(() => {
    this.updateErrors(this.form.value);
  });
}

  updateErrors(formValues): void {
    Object.entries(formValues).forEach(([k, v]) => {
      this.errors[k] = {};
      if (v) {
        const question = this.questions.find(q => q.id.toString() === k);
        if (question) {
          const selectedAnswer = question.answers.find(answer => answer.value === v);
          if (selectedAnswer) {
            const hasPreventCheckout = typeof selectedAnswer.rule === 'object' && selectedAnswer.rule !== null && (selectedAnswer.rule as any).prevent_checkout === true;

            this.errors[k][v] = hasPreventCheckout
              ? "tim_protezione_viaggi.survey_message_error"
              : undefined;
          }
        }
      }
    });
  }

  get hasErrors(): boolean {
    for (const questionId in this.errors) {
      for (const answerValue in this.errors[questionId]) {
        if (this.errors[questionId][answerValue]) {
          return true;
        }
      }
    }
    return false;
  }

  get canContinue(): boolean {
    return this.form.valid && !this.hasErrors;
  }

  handleNextStep(): void {
    const surveyRequest =
      Object.entries(this.form.controls)
        .map(([k, v]) => ({
          questionId: +k,
          answerId: this.questions?.find(q => q.id == +k)?.answers?.find(a => a.value == v?.value)?.id
        }));
    let digitalData: digitalData = window['digitalData'];
    this.kenticoTranslateService.getItem<any>('tim_protezione_viaggi').pipe(take(1)).subscribe(item => {
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
    });
    this.apiService.postSurvey(surveyRequest).subscribe(() => this.nypDataService.CurrentState$.next('consensuses'));
  }

  /*handlePrevStep(): void {
    this.backHandlerService.handleBackNavigation();
  }*/
}
