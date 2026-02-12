import {CheckoutLinearStepperGenericReducer} from './checkout-linear-stepper-generic-reducer';
import {CheckoutLinearStepperReducer} from './checkout-linear-stepper-reducer';
import {CheckoutLinearStepperGenericState} from './checkout-linear-stepper-generic-state.model';
import {CheckoutSerenetaContent} from '../content/checkout-sereneta-content.model';
import {ResponseOrder} from 'app/core/models/order.model';
import {CheckoutStep} from 'app/modules/checkout/checkout-step/checkout-step.model';
import {CheckoutLinearStepperCommonReducer} from './checkout-linear-stepper-common-reducer';
import * as moment from 'moment';

export class CheckoutLinearStepperCseSerenetaReducer extends CheckoutLinearStepperGenericReducer
  implements CheckoutLinearStepperReducer {
  public getInitialState() {
    this.state = this.getEmptyState();
    return this.state;
  }

  public reduce(actionName: string, payload: any) {
    switch (actionName) {
      case 'setContent':
        this.state = this.setContent(this.state, payload);
        break;
      case 'setResponseOrder':
        this.state = this.setOrder(this.state, payload);
        break;
      case 'setInsured':
        this.state = this.setInsured(this.state, payload);
        break;
      case 'setContractor':
        this.state = this.setHolder(this.state, payload);
        break;
      case 'setSurvey':
        this.state = this.setSurvey(this.state, payload);
        break;
      case 'setUncompletedSteps':
        this.state = this.setUncompletedSteps(this.state, payload);
        break;
      case 'setCompletedStepsVisibility':
        this.state = this.setCompletedStepsVisibility(this.state, payload);
        break;
      case 'setStepsAndCurrentStep':
        this.state = this.setScrollElement(this.state, payload.currentStep);
        break;
    }
    return super.common(actionName, payload);
  }

  getState() {
    return this.state;
  }

  private getEmptyState(): CheckoutLinearStepperGenericState {
    const initialState = {
      checkout_header: {
        visible: true,
        title: null,
        product_name: null,
        partner_text: null,
        partner_name: null,
        partner_icon: null,

      },
      completed_steps: {
        insurance_info: {
          visible: false,
          content: null,
          title: null,
          product_icon: null,
          kentico_insurance_info: {
            age_insurance_holder_value: null
          },
          display_data: []
        },
        insurance_holder: {
          visible: false,
        },
        insurance_survey: {
          visible: false,
        }
      },
      scroll: {
        scrollToElement: true
      },
      uncompleted_steps: [],
      uncompleted_step_titles: [],
      loading: true,
      model: {
        product: null, steps: []
        , currentStep: null, priceChange: null
      },
      cost_item: null,
      order: null,
      payment: null

    };
    return initialState;
  }

  private setScrollElement(state: any, currentStep: CheckoutStep) {
    state.scroll.scrollToElement = false;
    if (!window.matchMedia('(min-width: 576px)').matches) {
      state.scroll.scrollToElement = true;
    }
    state.scroll = Object.assign({}, state.scroll);
    return state;
  }

  private setScrollElementFromOrder(state: any, order: ResponseOrder) {
    state.scroll.scrollToElement = false;
    if (order.bill_address && order.bill_address.taxcode) {
      state.scroll.scrollToElement = true;
    }
    state.scroll = Object.assign({}, state.scroll);
    return state;
  }

  private setContent(state: CheckoutLinearStepperGenericState
    , content: CheckoutSerenetaContent): CheckoutLinearStepperGenericState {
    state = this.setCostItemDetailsContent(state, content);
    state = this.setContentCompletedSteps(state, content);
    state = this.setContentHeader(state, content);
    state = this.setUncompletedStepTitles(state, content);
    return state;
  }

  private setContentHeader(state: CheckoutLinearStepperGenericState
    , content: CheckoutSerenetaContent): CheckoutLinearStepperGenericState {
    state.checkout_header.title = content.checkout_header.title;
    state.checkout_header.partner_text = content.checkout_header.partner_text;
    state.checkout_header.partner_icon = content.checkout_header.partner_icon;
    return state;
  }

  private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState
    , content: CheckoutSerenetaContent): CheckoutLinearStepperGenericState {
    state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
    if (this.state.model && this.state.model.product) {
      state.cost_item.cost_detail_list = this.getCostItemDetails(this.state.model.product.code, state.cost_item.cost_detail_by_product);
    }
    return state;
  }

  private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutSerenetaContent) {
    state = this.setContentInsuranceInfo(state, content);
    state = this.setContentInsuranceHolder(state, content);
    state = this.setContentSurvey(state, content);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutSerenetaContent) {
    state.uncompleted_step_titles = [
      {
        name: 'insurance-info',
        title: content.card_sereneta.title
      },
      {
        name: 'address',
        title: content.card_contractor.title
      },
      {
        name: 'survey',
        title: content.card_survey.title
      },
      {
        name: 'payment',
        title: content.card_payment.title
      }
    ];
    return state;
  }

  private setContentInsuranceInfo(state: CheckoutLinearStepperGenericState, content: CheckoutSerenetaContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_info.title = content.card_sereneta.title;
    state.completed_steps.insurance_info.display_data[0] = {label: content.card_sereneta.name_insurance_holder};
    state.completed_steps.insurance_info.display_data[1] = {label: content.card_sereneta.surname_insurance_holder};
    state.completed_steps.insurance_info.display_data[2] = {label: content.card_sereneta.age_insurance_holder_label};
    state.completed_steps.insurance_info.display_data[3] = {label: content.card_sereneta.duration_insurance_label, value: content.card_sereneta.duration_insurance_value};

    state.completed_steps.insurance_info.kentico_insurance_info.age_insurance_holder_value = content.card_sereneta.age_insurance_holder_value;


    return state;
  }

  private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutSerenetaContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_holder.title = content.card_contractor.title;
    state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
    return state;
  }

  private setContentSurvey(state: CheckoutLinearStepperGenericState, content: CheckoutSerenetaContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_survey.title = content.card_survey.title;
    state.completed_steps.insurance_survey.card_icon = content.card_survey.image;
    state.completed_steps.insurance_survey.state = content.card_survey.status;
    state.completed_steps.insurance_survey.description = content.card_survey.description;
    return state;
  }

  private setOrder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state = this.setCostItemDetail(state, order);
    state = this.setCompletedSteps(state, order);
    state = this.setHeader(state, order);
    state = this.setScrollElementFromOrder(state, order);
    state = this.setInsured(state, order);
    return state;
  }

  private setHeader(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state.checkout_header = Object.assign({}, state.checkout_header);
    state.checkout_header.product_name = state.model.product.name;
    state.checkout_header.partner_name = state.model.product.originalProduct.provider.name;
    return state;
  }

  private setInsured(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    const lineItem = order.line_items[0];
    if (lineItem.insured_entities.insurance_holders.length === 0 && !order.bill_address) {
      return state;
    }
    const insuranceHolder = lineItem.insured_entities.insurance_holders.length !== 0 ? lineItem.insured_entities.insurance_holders[0] : order.bill_address;

    const displayData = state.completed_steps.insurance_info.display_data;
    displayData[0].value = insuranceHolder.firstname;
    displayData[1].value = insuranceHolder.lastname;
    displayData[2].value = this.calculateAge(insuranceHolder.birth_date) + ' ' + state.completed_steps.insurance_info.kentico_insurance_info.age_insurance_holder_value;

    state.completed_steps.insurance_info.product_icon = state.model.product.image;
    return state;

  }

  private setCompletedSteps(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
    state = this.setHolder(state, order);
    state = this.setSurvey(state, order);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setHolder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {

    if (!order.bill_address) {
      state.completed_steps.insurance_holder.visible = false;
      return state;
    }
    state.completed_steps.insurance_holder.display_data = [
      order.bill_address.firstname + ' ' + order.bill_address.lastname,
      order.bill_address.taxcode,
      order.bill_address.address1 + ', ' + order.bill_address.city,
    ];
    return state;
  }

  private setSurvey(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    return state;
  }

  private setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    if (order.state === 'complete' && !window.matchMedia('(min-width: 576px)').matches) {
      state.cost_item = null;
      return state;
    }
    return CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
  }

  private getCostItemDetails(code: string, costdetails: any) {
    if (code && costdetails) {
      return costdetails[code.replace(/-/g, '')];
    }
    return null;
  }

  private convertDateFormat(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }

  private setUncompletedSteps(state: CheckoutLinearStepperGenericState, uncompletedSteps: any) {
    const uncompletedStepNames = uncompletedSteps.map(x => x.name);
    const allowedUncompletedSteps = ['payment', 'insurance-info', 'address', 'survey'];
    const stepsFiltered = [];
    uncompletedStepNames.forEach(step => {
      if (allowedUncompletedSteps.some(allowedStep => step === allowedStep)) {
        const stepTitle = state.uncompleted_step_titles.find(s => s.name === step).title;
        switch (step) {
          case 'address':
            state.completed_steps.insurance_holder.visible = false;
            stepsFiltered.push(stepTitle);
            break;
          case 'survey':
            state.completed_steps.insurance_survey.visible = false;
            stepsFiltered.push(stepTitle);
            break;
          case 'payment':
            stepsFiltered.push(stepTitle);
            break;
        }
      }
    });
    state.uncompleted_steps = Object.assign([], stepsFiltered);
    return state;
  }

  private setCompletedStepsVisibility(state: CheckoutLinearStepperGenericState, completed_steps: [{ name: string, stepnum: number }]) {
    state.completed_steps.insurance_info.visible = false;
    state.completed_steps.insurance_survey.visible = false;
    state.completed_steps.insurance_holder.visible = false;
    if (this.state.model.currentStep.name !== 'complete') {
      completed_steps.forEach(step => {
        switch (step.name) {
          case 'insurance-info':
            state.completed_steps.insurance_info.visible = true;
            break;
          case 'address':
            state.completed_steps.insurance_holder.visible = true;
            break;
          case 'survey':
            state.completed_steps.insurance_survey.visible = true;
            break;
        }
      });
    }
    const existAddressStep = state.model.steps.some(step => step.name === 'address');
    if (!existAddressStep && this.state.model.currentStep.stepnum > 1 && this.state.model.currentStep.name !== 'complete') {
      state.completed_steps.insurance_holder.visible = true;
    }
    if (this.state.model.currentStep.stepnum === 1) {
      state.completed_steps.insurance_holder.visible = false;
    }
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private calculateAge(birthdate: any): number {
    return moment().diff(birthdate, 'years');
  }
}
