import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { State, City } from '@model';
import { AuthService, DataService } from '@services';
import { RecursivePartial, IOrderResponse } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { concat, take, toArray } from 'rxjs/operators';
import { NetCyberBusinessService } from '../../../services/api.service';
import { InsuranceInfoStates, NetCyberBusinessCheckoutService } from '../../../services/checkout.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsuranceInfoCustomRequestModalComponent } from '../../../modal/insurance-info-custom-request-modal/insurance-info-custom-request-modal.component';

@Component({
    selector: 'app-checkout-step-insurance-radio-options',
    templateUrl: './checkout-step-insurance-radio-options.component.html',
    styleUrls: ['./checkout-step-insurance-radio-options.component.scss'],
    standalone: false
})

export class CheckoutStepInsuranceRadioOptionsComponent implements OnChanges {

  @Input() kenticoContent: any;
  @Output() currentState: EventEmitter<string> = new EventEmitter();

  isMobile: boolean = window.innerWidth < 768;
  form: UntypedFormGroup;
  startingData: any;
  states: State[] = [];
  residentialCities: City[] = [];
  questions: any[] = [];
  mainQuestion: any;
  insuranceInfoState: InsuranceInfoStates = 'choicePacket';
  openedIndex: number | null = null;
  currentQuestionIndex = 0;
  allQuestions: any[] = [];

  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
  }

  constructor(
    private fb: UntypedFormBuilder,
    public nypDataService: NypDataService,
    public checkoutService: NetCyberBusinessCheckoutService,
    private apiService: NetCyberBusinessService,
    private authService: AuthService,
    private kenticoTranslateService: KenticoTranslateService,
    public modalService: NgbModal,
    public dataService: DataService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kenticoContent'] && this.kenticoContent?.questions?.length) {
      this.buildForm();
    }
  }

  ngOnInit(): void {
    this.getKenticoContent();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('checkout_customers_net_cyber_business.step_check_eligibility')
      .subscribe(response => {
        const item = response.insurance_info_check_eligibility;

        this.kenticoContent = {
          points: item.points?.value?.[0]?.url,
          img_error: item.img_error?.value?.[0]?.url,
          buttonBackImg: item.buttonbackimg?.value?.[0]?.url,
          buttonBackText: item.buttonBackText?.value || item.buttonbacktext?.value,
          buttonNextText: item.buttonNextText?.value || item.buttonnexttext?.value,
          question_1_id: item.question_1_id.value,
          question_1_name: item.question_1_name?.value,
          question_1_title: item.question_1_title?.value,
          question_1_answer_1_id: item.question_1_answer_1_id?.value,
          question_1_answer_1_value: item.question_1_answer_1_value?.value,
          question_1_answer_1_text: item.question_1_answer_1_text?.value,
          question_1_answer_1_checkout: item.question_1_answer_1_checkout?.value,
          question_1_answer_1_error_message: item.question_1_answer_1_error_message?.value,
          question_1_answer_2_id: item.question_1_answer_2_id?.value,
          question_1_answer_2_value: item.question_1_answer_2_value?.value,
          question_1_answer_2_text: item.question_1_answer_2_text?.value,
          question_1_answer_2_checkout: item.question_1_answer_2_checkout?.value,
          question_1_answer_2_error_message: item.question_1_answer_2_error_message?.value,
          modal_request_custom_template: item.modal_request_custom_template
        };

        this.getQuestions();
        this.setMainQuestion();
        this.allQuestions = [...this.mainQuestion, ...this.questions];
        this.buildForm();
      });
  }

  areAllQuestionsAnswered(): boolean {
    return this.questions.every(q => {
      return this.form.get(q.id.toString())?.value != null;
    });
  }

  isNonEmptyObject(obj: any): boolean {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length > 0;
  }

  sanitizeId(questionId: string, answerId: string): string {
    return `${questionId}-${answerId}`.replace(/[^a-zA-Z0-9-]/g, '');
  }


  getCheckedStyle(id: string): boolean {
    if (!this.form) return false;
    const questionId = id.split('-')[0];
    const answerId = id.split('-').slice(1).join('-');
    return this.form.get(questionId)?.value === answerId;
  }

  setMainQuestion(): void {
    if (this.questions && this.questions.length > 0) {
      this.mainQuestion = [{
        id: this.questions[0].id,
        name: this.questions[0].name,
        title: this.questions[0].title,
        answers: this.questions[0].answers
      }];
    }
  }

  getQuestions() {
    const questions = [];
    let i = 1;

    while (this.kenticoContent[`question_${i}_id`]) {
      const question = {
        id: this.kenticoContent[`question_${i}_id`],
        name: this.kenticoContent[`question_${i}_name`],
        title: this.kenticoContent[`question_${i}_title`],
        answers: []
      };

      let j = 1;
      while (this.kenticoContent[`question_${i}_answer_${j}_id`]) {
        question.answers.push({
          id: this.kenticoContent[`question_${i}_answer_${j}_id`],
          value: this.kenticoContent[`question_${i}_answer_${j}_value`] === 'true',
          text: this.kenticoContent[`question_${i}_answer_${j}_text`],
          checkout: this.kenticoContent[`question_${i}_answer_${j}_checkout`] === 'true',
          error_message: this.kenticoContent[`question_${i}_answer_${j}_error_message`]
        });
        j++;
      }

      questions.push(question);
      i++;
    }

    this.questions = questions
  }

  buildForm(): void {
    const group: any = {};
    this.questions.forEach(question => {
      group[question.id] = [null, Validators.required];
    });

    this.form = this.fb.group(group);
  }


  handlePrevStep(): void {
    this.nypDataService.Quote$.next(undefined);
    if (this.form) {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        control?.reset();
        control?.clearValidators();
        control?.updateValueAndValidity();
      });
    }
    this.checkoutService.InsuranceInfoState$.next('choicePacket');
  }

  handleNextStep() {

    if (!this.form.valid) {
      return;
    }


    const insuredItem = {
      number_employees_exceeded: true
    }

    this.updateOrder(insuredItem).subscribe(() => {
      this.currentState.emit(this.checkoutService.InsuranceInfoState$.value);
      this.checkoutService.InsuranceInfoState$.next('paymentSplitSelection');
    });
  }

  onAnswerSelected(questionIndex: number, answer: any): void {
    if (answer.checkout === false) {
      return;
    }
    if (questionIndex < this.allQuestions.length - 1) {
      this.currentQuestionIndex = questionIndex + 1;
    }
  }

  shouldShowQuestion(index: number): boolean {
    return index <= this.currentQuestionIndex;
  }

  getCurrentQuestion(): any {
    return this.allQuestions[this.currentQuestionIndex];
  }

  isQuestionAnswered(questionId: string): boolean {
    return this.form.get(questionId)?.value != null;
  }

  hasError(questionId: string, answerId?: string): boolean {
    if (answerId) {
      const question = this.allQuestions.find(q => q.id === questionId);
      if (!question) return false;
      const answer = question.answers.find((a: any) => a.id === answerId);
      return answer && answer.checkout === false;
    } else {
      const question = this.allQuestions.find(q => q.id === questionId);
      if (!question) return false;
      const selectedAnswerId = this.form.get(questionId)?.value;
      if (!selectedAnswerId) return false;
      const answer = question.answers.find((a: any) => a.id === selectedAnswerId);
      return answer && answer.checkout === false;
    }
  }

  getErrorMessage(questionId: string): string {
    const question = this.allQuestions.find(q => q.id === questionId);
    if (!question) return '';
    const selectedAnswerId = this.form.get(questionId)?.value;
    if (!selectedAnswerId) return '';
    const answer = question.answers.find((a: any) => a.id === selectedAnswerId);
    return answer?.error_message || '';
  }

  hasWrongAnswers(): boolean {
    for (const question of this.allQuestions) {
      const selectedAnswerId = this.form.get(question.id)?.value;
      if (selectedAnswerId) {
        const answer = question.answers.find((a: any) => a.id === selectedAnswerId);
        if (answer && answer.checkout === false) {
          return true;
        }
      }
    }
    return false;
  }

  shouldShowNavigation(): boolean {
    return this.form.valid && this.areAllQuestionsAnswered() && !this.hasWrongAnswers();
  }

  updateOrder(insuredItems?: any): Observable<RecursivePartial<IOrderResponse<any>> | void> {
    return this.apiService.putOrder({
      orderCode: this.nypDataService.Order$.value.orderCode,
      customerId: this.authService.loggedUser?.id,
      productId: this.nypDataService.CurrentProduct$.value?.id,
      insuredItems: insuredItems,
      anagState: 'Draft'
    }).pipe(
      take(1)
    );
  }

    openCustomPolicyModal(): void {
      this.modalService.dismissAll();
      const modalRef = this.modalService.open(InsuranceInfoCustomRequestModalComponent, {
        size: 'lg',
        windowClass: 'modal-window',
        container: 'body' 
      });
      modalRef.componentInstance.kenticoContent = this.kenticoContent?.modal_request_custom_template?.modal_request_custom_template;
      modalRef.componentInstance.formSubmitted = false;
      if (modalRef.componentInstance.form) {
        modalRef.componentInstance.form.reset();
      }
      modalRef.componentInstance._modalRef = modalRef;
    }
}
