import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CheckoutStates, Question, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { TimProtezioneCasaApiService } from '../../services/api.service';
import { TimProtezioneCasaCheckoutService } from '../../services/checkout.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-checkout-step-survey',
    templateUrl: './checkout-step-survey.component.html',
    styleUrls: [
        './checkout-step-survey.component.scss',
        '../../../../styles/checkout-forms.scss',
        '../../../../styles/size.scss',
        '../../../../styles/colors.scss',
        '../../../../styles/text.scss',
        '../../../../styles/common.scss'
    ],
    standalone: false
})
export class CheckoutStepSurveyComponent implements OnInit {
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  titleStates: CheckoutStates[] = ['insurance-info', 'address'];
  summaryStates: CheckoutStates[] = ['consensuses'];
  questions: RecursivePartial<Question[]>;
  form: UntypedFormGroup;
  public readonly errors = {};

  constructor(
    private formBuilder: UntypedFormBuilder,
    public checkoutService: TimProtezioneCasaCheckoutService,
    private apiService: TimProtezioneCasaApiService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.nypDataService.CurrentProduct$.subscribe((res) => {
      this.questions = res.questions;
      console.log("CurrentProduct$", res);

      const formElements = {};
      res.questions.forEach((question) => {
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
              ? "tim_protezione_casa.survey_message_error"
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
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continuaStep3_test').textContent.toLowerCase().replace(/\s/g, '');
    // digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
    // this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    this.adobeAnalyticsDataLayerService.adobeTrackClick();
    this.apiService.postSurvey(surveyRequest).subscribe(() => this.nypDataService.CurrentState$.next('consensuses'));
  }

  handlePrevStep(): void {
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('back-button').textContent.toLowerCase().replace(/\s/g, '');
    digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    this.nypDataService.CurrentState$.next('address')
  }
}
