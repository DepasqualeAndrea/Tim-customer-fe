import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CheckoutStates, Question, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { TimCyberConsumerApiService } from '../../services/api.service';
import moment from 'moment';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import {AdobeAnalyticsDatalayerService} from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { take } from 'rxjs/operators';
import { TimCyberConsumerCheckoutService } from '../../services/checkout.service';

@Component({
    selector: 'app-checkout-step-survey',
    templateUrl: './checkout-step-survey.component.html',
    styleUrls: [
        "./checkout-step-survey.component.scss",
        "../../../../styles/checkout-forms.scss",
        "../../../../styles/size.scss",
        "../../../../styles/colors.scss",
        "../../../../styles/text.scss",
        "../../../../styles/common.scss",
    ],
    standalone: false
})
export class CheckoutStepSurveyComponent implements OnInit {
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  titleStates: CheckoutStates[] = [
    "insurance-info",
    "login-register",
    "address",
  ];
  summaryStates: CheckoutStates[] = ["consensuses"];
  questions: RecursivePartial<Question[]>;
  today = moment().format('DD/MM/YYYY');
  form: UntypedFormGroup;
  public readonly errors = {};

  constructor(
    private formBuilder: UntypedFormBuilder,
    public checkoutService: TimCyberConsumerCheckoutService,
    private apiService: TimCyberConsumerApiService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
  ) { }

  ngOnInit(): void {
    this.nypDataService.CurrentProduct$.subscribe(res => {

      if (!res || !res.questions) {
        console.error('Dati prodotto non validi o domande mancanti');
        return;
      }

      this.questions = res.questions;

      const formElements = {};
      res.questions.forEach(question => {

        formElements[question.id] = [null, [Validators.required, Validators.pattern(/^(Si)$/)]];
        this.errors[question.id] = {};
      });

      this.form = this.formBuilder.group(formElements);

      this.form.valueChanges.subscribe(vc => {
        Object.entries(vc).forEach(([k, v]) => {
          this.errors[k] = {};
          if (v) {
            const control = this.form.get(k);
            const isValid = control ? control.valid : true;
            this.errors[k][v] = !isValid ? 'Purtroppo il prodotto non è in linea con le esigenze del cliente e non è sottoscrivibile' : undefined;
          }
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
      let digitalData: digitalData = window['digitalData'];
      const buttonElement = document.getElementById('continuaStep3_test');
      if (buttonElement) {
        digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' +
          buttonElement.textContent.toLowerCase().replace(/\s/g, '');
      }
      digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
      // this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      // this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.apiService.postSurvey(surveyRequest).subscribe(() => this.nypDataService.CurrentState$.next('consensuses'));
}

handlePrevStep(): void {
  this.nypDataService.CurrentState$.next('address');
}

}

