import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutStates, Question, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { TimSportApiService } from '../../services/api.service';
import { TimSportCheckoutService } from '../../services/checkout.service';
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";
import { AdobeAnalyticsDatalayerService } from "app/core/services/adobe_analytics/adobe-init-datalayer.service";
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { take } from 'rxjs/operators';

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
  ]
})
export class CheckoutStepSurveyComponent implements OnInit {
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  titleStates: CheckoutStates[] = ['address'];
  summaryStates: CheckoutStates[] = ['consensuses'];
  questions: RecursivePartial<Question[]>;
  form: FormGroup;
  public readonly errors = {};

  constructor(
    private formBuilder: FormBuilder,
    public checkoutService: TimSportCheckoutService,
    private apiService: TimSportApiService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.nypDataService.CurrentProduct$.subscribe(res => {
      this.questions = res.questions;

      const formElements = {};
      res.questions.forEach(question => {
        formElements[question.id] = [null, [Validators.required, Validators.pattern('Si')]];
        this.errors[question.id] = {};
      });

      this.form = this.formBuilder.group(formElements);

      this.form.valueChanges.subscribe(vc => {
        Object.entries(vc)
          .forEach(([k, v]) => {
            this.errors[k] = {};
            this.errors[k][v] = v != 'Si' ? 'tim_sport.survey_message_error' : undefined;
          });
      });
    });
  }

  handleNextStep(): void {
    const surveyRequest =
      Object.entries(this.form.controls)
        .map(([k, v]) => ({
          questionId: +k,
          answerId: this.questions?.find(q => q.id == +k)?.answers?.find(a => a.value == v?.value)?.id
        }));
    this.apiService.postSurvey(surveyRequest).subscribe(() => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continuaStep3_test').textContent.toLowerCase().replace(/\s/g, '');
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.nypDataService.CurrentState$.next('consensuses')
    });
  }

  handlePrevStep(): void {
    this.nypDataService.CurrentState$.next('insurance-info');
  }
}