import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutStates, Question, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { TimForSkiApiService } from '../../services/api.service';
import { TimForSkiCheckoutService } from '../../services/checkout.service';
import moment from 'moment';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-step-survey',
  templateUrl: './checkout-step-survey.component.html',
  styleUrls: ['./checkout-step-survey.component.scss',
    "../../../../styles/checkout-forms.scss",
    '../../../../styles/size.scss',
    '../../../../styles/colors.scss',
    '../../../../styles/text.scss',
    '../../../../styles/common.scss']
})
export class CheckoutStepSurveyComponent implements OnInit {
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  titleStates: CheckoutStates[] = ['insurance-info', 'login-register', 'address'];
  summaryStates: CheckoutStates[] = ['consensuses'];
  questions: RecursivePartial<Question[]>;
  today = moment().format('DD/MM/YYYY');
  form: FormGroup;
  public readonly errors = {};

  constructor(
    private formBuilder: FormBuilder,
    public checkoutService: TimForSkiCheckoutService,
    private apiService: TimForSkiApiService,
    public nypDataService: NypDataService,
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
      formElements[question.id] = [null, [Validators.required, Validators.pattern(/^(Si)$/)]];
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
            const control = this.form.get(k);
            const isValid = control ? control.valid : true;
            this.errors[k][v] = !isValid ? 'Purtroppo il prodotto non è in linea con le esigenze del cliente e non è sottoscrivibile' : undefined;
          }
        }
      }
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
      this.nypDataService.CurrentState$.next('consensuses')
    });
  }

  handlePrevStep(): void {
    this.nypDataService.CurrentState$.next('insurance-info');
  }
}
