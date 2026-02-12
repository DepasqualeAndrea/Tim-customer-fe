import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutStates, Question, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { TimBillProtectionApiService } from '../../services/api.service';
import { TimBillProtectionCheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-checkout-step-survey',
  templateUrl: './checkout-step-survey.component.html',
  styleUrls: ['./checkout-step-survey.component.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss']
})
export class CheckoutStepSurveyComponent implements OnInit {
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  titleStates: CheckoutStates[] = ['insurance-info', 'login-register', 'address'];
  summaryStates: CheckoutStates[] = ['consensuses'];
  questions: RecursivePartial<Question[]>;
  form: FormGroup;
  public readonly errors = {};

  constructor(
    private formBuilder: FormBuilder,
    public checkoutService: TimBillProtectionCheckoutService,
    private apiService: TimBillProtectionApiService,
    public nypDataService: NypDataService,
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
            this.errors[k][v] = v != 'Si' ? 'tim_bill_protection.survey_message_error' : undefined;
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
    this.apiService.postSurvey(surveyRequest).subscribe(() => this.nypDataService.CurrentState$.next('consensuses'));
  }

  handlePrevStep(): void {
    this.nypDataService.CurrentState$.next('insurance-info');
  }
}