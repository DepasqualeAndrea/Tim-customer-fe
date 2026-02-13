import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepComponent} from '../checkout-step.component';
import {CheckoutStepService} from '../../services/checkout-step.service';
import {RequestOrder, ResponseOrder} from '@model';
import {AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import * as moment from 'moment';
import {AccetableAnswers, CheckoutQuestion} from '../../checkout.model';
import {CheckoutSurveyProduct} from './checkout-step-survey.model';
import {DataService} from '@services';
import {ComponentFeaturesService} from '../../../../core/services/componentFeatures.service';
import {CheckoutStepPaymentDocumentsAcceptance} from '../checkout-step-payment/checkout-step-payment.model';
import {CheckoutStepPaymentDocumentsAcceptanceComponent} from '../checkout-step-payment/checkout-step-payment-documents-acceptance/checkout-step-payment-documents-acceptance.component';
import { ChangeStatusService } from 'app/core/services/change-status.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {take} from 'rxjs/operators';
import {CheckoutLinearStepperService} from '../../checkout-linear-stepper/services/checkout-linear-stepper.service';
import { ActivatedRoute } from '@angular/router';
import { KenticoTranslateService } from './../../../kentico/data-layer/kentico-translate.service';
import {
  PreventivatoreDynamicSharedFunctions
} from "../../../preventivatore/preventivatore-dynamic/services/content/preventivatore-dynamic-shared-functions";
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';

function preventCheckoutValidator(control: AbstractControl): ValidationErrors {
  const answer: AccetableAnswers = control.value;
  if (!answer) {
    return null;
  }
  return (answer.rule && answer.rule === 'prevent_checkout') ? {prevent_checkout: true} : null;
}


@Component({
    selector: 'app-checkout-step-survey',
    templateUrl: './checkout-step-survey.component.html',
    styleUrls: ['./checkout-step-survey.component.scss'],
    standalone: false
})
export class CheckoutStepSurveyComponent extends CheckoutStepComponent implements OnInit {

  @ViewChild('documentAcceptanceCard') documentAcceptanceCard: CheckoutStepPaymentDocumentsAcceptanceComponent;

  documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  product: any;
  questionList = [];
  answerList: AccetableAnswers[];
  today = moment().format('DD/MM/YYYY');
  form: UntypedFormGroup;
  needExtraQuestion = false;
  kenticoGeneralDescriptionContentId: string = null;
  kenticoTitleContentId = 'checkout.survey';
  kenticoResponsibilityContentId = 'checkout.survey_responsibility';
  kenticoFranchiseInformationContentId: string = null;
  requiredFieldsHidden = false;
  brandIcon: string;

  constructor(
    checkoutStepService: CheckoutStepService,
    private formBuilder: UntypedFormBuilder,
    public dataService: DataService,
    private changeStatusService: ChangeStatusService,
    componentFeaturesService: ComponentFeaturesService,
    private checkoutLinearStepperService: CheckoutLinearStepperService,
    private route: ActivatedRoute,
    private kenticoTranslateService: KenticoTranslateService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
  ) {
    super(checkoutStepService, componentFeaturesService);
  }

  ngOnInit() {
    this.product = this.currentStep.product;
    this.documentsAcceptance = (this.currentStep.product as any).documentsAcceptance;
    this.getKenticoTitleContentId();
    this.getKenticoGeneralDescriptionContentId();
    this.getKenticoResponsibilityContentId();
    this.getKenticoFranchiseInformationContentId();
    this.hideRequiredFields();

    this.questionList = Object.values(this.currentStep.product.questions);
    this.answerList = this.fromServerAnswerToAcceptableAnswer(this.dataService.getResponseOrder(), this.currentStep.product as CheckoutSurveyProduct);

    this.form = new UntypedFormGroup({
      requireAcknowledgmentQuestion: new UntypedFormControl((<CheckoutSurveyProduct>this.currentStep.product).requireAcknowledgmentQuestion),
      questions: this.formBuilder.array(this.questionList.map(question => {
        const found: AccetableAnswers = this.answerList.find(awr => awr && awr.question_id === question.id);
        const accepted: AccetableAnswers = found ? question.acceptable_answers.find(awr => awr.id === found.id) : null;
        this.checkControlAnswerCustom(question);
        return this.formBuilder.group({
          content: new UntypedFormControl(question.content),
          acceptedAnswer: new UntypedFormControl(accepted, [Validators.required, preventCheckoutValidator]),
          answers: this.formBuilder.array(question.acceptable_answers.sort((a, b) => a.value.localeCompare(b.value)).reverse().map(answer => {
            return this.formBuilder.group({
              answerObject: new UntypedFormControl(Object.assign(answer, {serverId: found && found.serverId || null})),
              questionId: new UntypedFormControl(answer.question_id),
              id: new UntypedFormControl(answer.id),
              value: new UntypedFormControl(answer.value),
              rule: new UntypedFormControl(answer.rule),
            });
          }))
        });
      }))
    }, Validators.required);
    this.checkQuestionPetCivibank();
    this.onQuestionChange();
    this.changeStatusProposalStep();
    if (this.dataService.isTenant('santa-lucia_db')) {
      this.getBrandIcon();
    }
  }

  ngAfterViewInit() {
    if (this.route.snapshot.parent.routeConfig.path === 'checkout') {
      this.checkoutLinearStepperService.componentFactories$
      .pipe(untilDestroyed(this), take(1)).subscribe(componentFactories => {
        this.createComponentsFromComponentFactories(
          componentFactories,
          this.dataService.getResponseProduct().product_code
        );
      });

    this.checkoutLinearStepperService.state$.pipe(untilDestroyed(this)).subscribe(state => {
      this.updateComponentProperties(state);
    });
    this.checkoutLinearStepperService.loadTemplateComponents();
    this.checkoutLinearStepperService.sendState();
    }
  }

  onQuestionChange() {
    const questions: UntypedFormArray = this.form.controls.questions as UntypedFormArray;
    const answers: AccetableAnswers[] = this.fromFormArrayToAnswers(questions);
    this.needExtraQuestion = answers.some(answer => answer && answer.rule === 'requires_acknowledgement');
    this.computeRequiredAcknowledgementQuestion(this.needExtraQuestion);
  }

  private changeStatusProposalStep() {
    if (this.dataService.tenantInfo.tenant === 'banca-sella_db') {
      this.changeStatusService.setResponseOrder(this.dataService.getResponseOrder());
      this.changeStatusService.changeStatusToProposal();
    }
  }

  fromFormArrayToAnswers(questions: UntypedFormArray): AccetableAnswers[] {
    const output: AccetableAnswers[] = [];
    for (let i = 0; i < questions.length; i++) {
      output.push(<AccetableAnswers>questions.at(i).value.acceptedAnswer);
    }
    return output;
  }

  fromServerAnswerToAcceptableAnswer(responseOrder: ResponseOrder, product: CheckoutSurveyProduct): AccetableAnswers[] {
    const answers = responseOrder.line_items[0].answers || [];
    return (product.answers || this.getQuestionIdsFromOriginalProduct(product)).map(answer => {
      const serverAnswer = answers.find(awr => awr.question_id === answer.question_id);
      return Object.assign({}, answer, {serverId: serverAnswer && serverAnswer.id || undefined});
    });
  }

  getQuestionIdsFromOriginalProduct(product: CheckoutSurveyProduct) {
    const questionId = [];
    if (product.originalProduct && product.originalProduct.questions) {
      product.originalProduct.questions.forEach(question => {
        questionId.push({question_id: question.id});
      });
    }
    return questionId;
  }

  createRequestOrder(): RequestOrder {
    const ro = {
      order: {
        line_items_attributes: {
          '0': {
            id: null,
            answers_attributes: {}
          }
        }
      }
    };
    const answers: AccetableAnswers[] = this.fromFormArrayToAnswers(this.form.controls.questions as UntypedFormArray);
    ro.order.line_items_attributes['0'].id = this.currentStep.product.lineItemId;
    ro.order.line_items_attributes['0'].answers_attributes = answers.reduce((acc, answer, index) => {
      acc['' + index] = answer && {question_id: answer.question_id, answer_id: answer.id, id: answer.serverId};
      return acc;
    }, {});
    return <RequestOrder>ro;
  }

  handlePrevStep(): void {
    return this.saveProduct() && super.handlePrevStep();
  }

  handleNextStep(): void {
    if (this.currentStep.product.code === 'tim-my-home' || this.currentStep.product.code === 'customers-tim-pet' || this.currentStep.product.code === 'ehealth-quixa-homage' || this.currentStep.product.code === 'ehealth-quixa-standard'
      || this.currentStep.product.code === 'tim-my-sci') {    
      const form: any = {
        paymentmethod: '',
        mypet_pet_type: this.dataService.getParams().kindSelected !== undefined ? this.dataService.getParams().kindSelected : '',
        codice_sconto: 'no',
        sci_numassicurati: this.dataService.getParams().insuredNumber !== undefined ? this.dataService.getParams().insuredNumber : 0,
        sci_min14: this.dataService.getParams().insuredMinors !== undefined ? this.dataService.getParams().insuredMinors : false,
        sci_polizza: this.dataService.getParams().proposalName !== undefined ? this.dataService.getParams().proposalName : '',
      }
      const number = this.currentStep.product.order.id + '';
      let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.currentStep.product, 1, number, {}, form, 'tim broker', '');
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);  
    }
    
    return this.saveProduct() && super.handleNextStep();
  }

  saveProduct(): CheckoutSurveyProduct {
    const surveyProduct = {
      answers: this.fromFormArrayToAnswers(this.form.controls.questions as UntypedFormArray),
      requireAcknowledgmentQuestion: this.form.controls.requireAcknowledgmentQuestion.value
    };
    const currentStepProduct = this.currentStep.product = Object.assign({}, this.currentStep.product, surveyProduct);
    if (this.shouldCheckDocumentAcceptance()) {
      return Object.assign({}, currentStepProduct,
        {documentsAcceptance: this.documentsAcceptance});
    }
    return currentStepProduct;
  }

  getFormQuestions(): UntypedFormArray {
    return this.form.controls.questions as UntypedFormArray;
  }

  computeRequiredAcknowledgementQuestion(needExtraQuestion: boolean) {
    if (!needExtraQuestion) {
      this.form.controls.requireAcknowledgmentQuestion.patchValue(null);
      this.form.controls.requireAcknowledgmentQuestion.setValidators(null);
    } else {
      this.form.controls.requireAcknowledgmentQuestion.setValidators([Validators.required]);
    }
    this.form.controls.requireAcknowledgmentQuestion.updateValueAndValidity();
  }

  handleDocumentAcceptanceChange(docAcceptance: CheckoutStepPaymentDocumentsAcceptance) {
    this.documentsAcceptance = docAcceptance;
  }

  shouldCheckDocumentAcceptance(): boolean {
    return this.currentStep.product.code === 'covea-tires-covered-homage' || this.currentStep.product.code === 'nobis-covid-homage';
  }

  getDocumentAcceptanceValidation(): boolean {
    if (this.documentAcceptanceCard === undefined) {
      return false;
    } else {
      return this.documentAcceptanceCard.form.valid;
    }
  }

  isStepValid(): boolean {
    if (this.shouldCheckDocumentAcceptance()) {
      const isDocumentValid = this.getDocumentAcceptanceValidation();
      const isFormValid = this.form.valid;
      const validStep = isFormValid && isDocumentValid;
      return validStep;
    }
    return this.form.valid;
  }

  checkControlAnswerCustom(question: CheckoutQuestion) {
    const getNameControl = question.content.split('|||')[1];
    if (getNameControl) {
      question.content = question.content.split('|||')[0];
      const responseOrder = this.dataService.getResponseOrder();
      this[getNameControl](responseOrder, question);
    }
  }

  // don't clear, need in method checkControlAnswerCustom()
  checkAddons(responseOrder: ResponseOrder, question: CheckoutQuestion) {
    question.acceptable_answers.forEach(answer => {
      switch (answer.value) {
        case 'si':
          if (!responseOrder.line_items[0].addons.some(addon => addon.code === 'IDNR00102')) {
            answer.rule = 'prevent_checkout';
          }
          break;
        case 'no':
          if (responseOrder.line_items[0].addons.some(addon => addon.code === 'IDNR00102')) {
            answer.rule = 'prevent_checkout';
          }
          break;
      }
    });
  }

  // don't clear, need in method checkControlAnswerCustom()
  checkPricePetCivibank(responseOrder: ResponseOrder, question: CheckoutQuestion) {
    question.acceptable_answers.forEach(answer => {
      switch (answer.value) {
        case 'sino ad € 200,00':
          if (Number(responseOrder.data.quotation_response.additional_data.datiContratto.premio_lordo_totale_annuo.replace(',', '.')) > 200) {
            answer.rule = 'prevent_checkout';
          }
          break;
        case 'sino ad € 500,00':
          if (Number(responseOrder.data.quotation_response.additional_data.datiContratto.premio_lordo_totale_annuo.replace(',', '.')) > 500) {
            answer.rule = 'prevent_checkout';
          }
          break;
      }
    });
  }

  checkQuestionPetCivibank() {
    const questions = this.form.controls.questions as UntypedFormArray;
    for (const question of questions.controls) {
      const answers = question.get('answers') as UntypedFormArray;
      const isQuestionPrice = answers.controls.some(answer => answer.value.value === 'sino ad € 200,00');
      if (isQuestionPrice) {
        answers.controls.sort((a, b) => {
          return a.value.id - b.value.id;
        });
      }
    }

  }

  private getKenticoGeneralDescriptionContentId() {
    this.componentFeaturesService.useComponent('checkout-step-survey');
    this.componentFeaturesService.useRule('general-description');
    const itemId: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);

    if (!!itemId) {
      this.kenticoGeneralDescriptionContentId = itemId;
    }
  }

  private getKenticoTitleContentId() {
    this.componentFeaturesService.useComponent('checkout-step-survey');
    this.componentFeaturesService.useRule('title');
    const itemId: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);

    if (!!itemId) {
      this.kenticoTitleContentId = itemId;
    }
  }

  private getKenticoResponsibilityContentId() {
    this.componentFeaturesService.useComponent('checkout-step-survey');
    this.componentFeaturesService.useRule('survey-responsibility');
    const itemId: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);

    if (!!itemId) {
      this.kenticoResponsibilityContentId = itemId;
    }
  }

  private getKenticoFranchiseInformationContentId() {
    this.componentFeaturesService.useComponent('checkout-step-survey');
    this.componentFeaturesService.useRule('survey-franchise-information');
    const itemId: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);

    if (!!itemId) {
      this.kenticoFranchiseInformationContentId = itemId;
    }
  }

  private hideRequiredFields() {
    this.componentFeaturesService.useComponent('checkout-step-survey');
    this.componentFeaturesService.useRule('hide-required-fields');
    this.requiredFieldsHidden = this.componentFeaturesService.isRuleEnabled();
  }
  
  getBrandIcon() {
    this.kenticoTranslateService.getItem<any>('navbar').subscribe((item) => {
    });
  }

  isEmptyText(text: string): boolean {
    return PreventivatoreDynamicSharedFunctions.isEmptyText(text);
  }
}
