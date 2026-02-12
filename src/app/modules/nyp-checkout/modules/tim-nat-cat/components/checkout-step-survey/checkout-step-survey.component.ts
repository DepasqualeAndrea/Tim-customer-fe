import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutStates, Question, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import moment from 'moment';
import { TimNatCatService } from '../../services/api.service';

@Component({
  selector: 'app-checkout-step-survey',
  templateUrl: './checkout-step-survey.component.html',
  styleUrls: [
    './checkout-step-survey.component.scss',
    "../../../../styles/checkout-forms.scss",
    "../../../../styles/size.scss",
    "../../../../styles/colors.scss",
    "../../../../styles/text.scss",
    "../../../../styles/common.scss"
  ]
})
export class CheckoutStepSurveyComponent implements OnInit {

  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  questions: RecursivePartial<Question[]>;
  form: FormGroup;
  content: any;
  today = moment().format('DD/MM/YYYY');
  public readonly errors = {};
  titleStates: CheckoutStates[] = ["insurance-info","address","consensuses"];

  constructor(
    public nypDataService: NypDataService,
    private formBuilder: FormBuilder,
    private kenticoTranslateService: KenticoTranslateService,
    private apiService: TimNatCatService
  ) { }

  ngOnInit(): void {
    this.getKenticoContent();
    this.nypDataService.CurrentProduct$.subscribe(res => {
      if (!res || !res.questions) { return; }

      this.questions = res.questions;
      const formElements = {};
      res.questions.forEach(question => {
        formElements[question.id] = [null, [Validators.required, Validators.pattern(/^(Si)$/)]];
        this.errors[question.id] = {};
      });

      const orderCode = this.nypDataService.Order$.value.orderCode;
      this.apiService.getOrder(orderCode).subscribe(order => {
        const surveyResponses = order?.survey?.data;

        if (Array.isArray(surveyResponses)) {
          surveyResponses.forEach(response => {
            const question = this.questions?.find(q => q.id === response.questionId);
            const answer = question?.answers?.find(a => a.id === response.answerId);

            if (question && answer) {
              this.form.get(question.id.toString())?.setValue(answer.value);
            }
          });
        }
      });


      this.form = this.formBuilder.group(formElements);
      this.form.valueChanges.subscribe(vc => {
        Object.entries(vc).forEach(([k, v]) => {
          this.errors[k] = {};
          if (v) {
            const control = this.form.get(k);
            const isValid = control ? control.valid : true;
            this.errors[k][v] = !isValid ? 'Selezionando questa risposta la copertura risulta non adeguata alle tue esigenze, pertanto non è sottoscrivibile.' : undefined;
          }
        });
      });
    });
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('checkout_customers_nat_cat').subscribe(item => this.content = item);
  }

  handleNextStep(): void {
    const surveyRequest = Object.entries(this.form.controls).map(([k, v]) => ({
      questionId: +k,
      answerId: this.questions?.find(q => q.id == +k)?.answers?.find(a => a.value == v?.value)?.id
    }));

    this.apiService.postSurvey(surveyRequest).subscribe(() => {
      this.nypDataService.CurrentState$.next('consensuses');
    });
  }

  handlePrevStep(): void {
    this.nypDataService.CurrentState$.next('address');
  }

  getCheckedStyle(id: string): boolean {
    const el= document.getElementById(id) as HTMLInputElement;
    return el?.checked;
  }
}
