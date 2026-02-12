import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutStates, Question, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { TimBillProtectorApiService } from '../../services/api.service';
import { TimBillProtectorCheckoutService } from '../../services/checkout.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-step-survey',
  templateUrl: './checkout-step-survey.component.html',
  styleUrls: ['./checkout-step-survey.component.scss', '../../../../styles/checkout-forms.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss']
})
export class CheckoutStepSurveyComponent implements OnInit, OnDestroy {
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  titleStates: CheckoutStates[] = ['insurance-info', 'login-register', 'address'];
  summaryStates: CheckoutStates[] = ['consensuses'];
  questions: RecursivePartial<Question[]>;
  form: FormGroup;
  public readonly errors = {};

  private destroy$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    public checkoutService: TimBillProtectorCheckoutService,
    private apiService: TimBillProtectorApiService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.nypDataService.Order$.pipe(takeUntil(this.destroy$)).subscribe(chosen => {
      this.questions = chosen?.packet?.data?.['questions']?.filter(question => question !== null && question !== undefined);

      if (this.questions) {
        const formElements = {};
        this.questions.forEach((question) => {
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
      }
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
              ? "tim_bill_protector.survey_message_error"
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
    // Controllo di validazione prima di procedere (previene bypass rimozione disabled) mostra errore (caso di gestione estremo nel momento in cui viene rimosso il tag lato console browser)
    if (!this.canContinue) {
      this.toastr.error("Non è possibile proseguire, il form non è valido");
      console.error('Tentativo di submit non valido: form invalido o risposte con errori');
      return;
    }

    const surveyRequest =
      Object.entries(this.form.controls)
        .map(([k, v]) => ({
          questionId: +k,
          answerId: this.questions?.find(q => q.id == +k)?.answers?.find(a => a.value == v?.value)?.id
        }));
    this.apiService.postSurvey(surveyRequest).subscribe(() => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continuaStep3_test').textContent.toLowerCase().replace(/\s/g, '');
      digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      this.nypDataService.CurrentState$.next('consensuses')
    });
  }

  handlePrevStep(): void {
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('back-button').textContent.toLowerCase().replace(/\s/g, '');
    digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    this.nypDataService.CurrentState$.next('insurance-info');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
