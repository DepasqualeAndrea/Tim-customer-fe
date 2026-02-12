import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { ResponseOrder } from '@model';
import { CheckoutStep } from 'app/modules/checkout/checkout-step/checkout-step.model';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import _ from 'lodash';
import * as moment from 'moment';
import { CheckoutCustomersTimPetContent } from '../content/checkout-customers-tim-pet-content.model';
import { CheckoutLinearStepperCommonReducer } from './checkout-linear-stepper-common-reducer';
import { CheckoutLinearStepperGenericReducer } from './checkout-linear-stepper-generic-reducer';
import { CheckoutLinearStepperGenericState } from './checkout-linear-stepper-generic-state.model';
import { CheckoutLinearStepperReducer } from './checkout-linear-stepper-reducer';

export class CheckoutLinearStepperCustomersTimPetReducer extends CheckoutLinearStepperGenericReducer implements CheckoutLinearStepperReducer {

  getState() {
    return this.state;
  }

  public getInitialState() {
    this.state = this.getEmptyState();
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
          selected_pet_type: null,
          display_data: [{
            label: null,
            value: null
          }, {
            label: null,
            value: null
          }, {
            label: null,
            value: null
          }, {
            label: null,
            value: null
          }]
        },
        insurance_holder: {
          visible: false,
          layout: null
        },
        insurance_survey: {
          visible: false,
          layout: null
        }
      },
      scroll: {
        scrollToElement: true
      },
      uncompleted_steps: [],
      uncompleted_step_titles: [],
      loading: true,
      model: {
        product: null,
        steps: [],
        currentStep: null,
        priceChange: null
      },
      cost_item: null,
      order: null,
      payment: null
    };
    return initialState;
  }

  public reduce(actionName: string, payload: any) {
    switch (actionName) {
      case 'setContent':
        this.state = this.setContent(this.state, payload);
        break;
      case 'setResponseOrder':
        this.state = this.setOrder(this.state, payload);
        break;
      case 'setPet':
        this.state = this.setPet(this.state, payload);
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
      case 'setProperty':
        this.state = this.updateStateProperty(this.state, payload);
        break;
    }
    return super.common(actionName, payload);
  }

  private setScrollElement(state: any, currentStep: CheckoutStep) {
    state.scroll.scrollToElement = false;
    if (!window.matchMedia('(min-width: 576px)').matches) {
      state.scroll.scrollToElement = true;
    }
    state.scroll = Object.assign({}, state.scroll);
    return state;
  }

  private setContent(state: CheckoutLinearStepperGenericState, content: CheckoutCustomersTimPetContent): CheckoutLinearStepperGenericState {
    state = this.setUncompletedStepTitles(state, content);
    state = this.setCostItemDetailsContent(state, content);
    state = this.setContentCompletedSteps(state, content);
    state = this.setContentHeader(state, content);
    return state;
  }

  private setContentHeader(state: CheckoutLinearStepperGenericState, content: CheckoutCustomersTimPetContent): CheckoutLinearStepperGenericState {
    state.checkout_header.title = content.checkout_header.title;
    state.checkout_header.secondary_title = content.checkout_header.secondary_title;
    state.checkout_header.partner_text = content.checkout_header.partner_text;
    state.checkout_header.partner_icon = content.checkout_header.partner_icon;
    return state;
  }

  private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState, content: CheckoutCustomersTimPetContent): CheckoutLinearStepperGenericState {
    state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
    state.cost_item.product_name = state.model.product && state.model.product.name;
    return state;
  }

  private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutCustomersTimPetContent) {
    state = this.setContentInsuranceInfo(state, content);
    // state = this.setInsuranceInfoPet(state, content);
    state = this.setContentInsuranceHolder(state, content);
    state = this.setContentSurvey(state, content);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutCustomersTimPetContent) {
    state.uncompleted_step_titles = [
      {
        name: 'insurance-info'
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

  private setContentInsuranceInfo(state: CheckoutLinearStepperGenericState, content: CheckoutCustomersTimPetContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_info.display_data[0].label = content.card_pet.pet_type_label;
    state.completed_steps.insurance_info.display_data[1].value = content.card_pet.pet_type_image;
    state.completed_steps.insurance_info.display_data[1].label = content.card_pet.pet_type_alt;

    state.completed_steps.insurance_info.display_data[2].label = content.card_pet.choose_policy_label;
    state.completed_steps.insurance_info.display_data[3].value = content.card_pet.choose_policy_image;
    state.completed_steps.insurance_info.display_data[3].label = content.card_pet.choose_policy_alt;

    return state;
  }

  private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutCustomersTimPetContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_holder.title = content.card_contractor.title;
    state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
    return state;
  }

  private setContentSurvey(state: CheckoutLinearStepperGenericState, content: CheckoutCustomersTimPetContent): CheckoutLinearStepperGenericState {
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
    return state;
  }

  private setPet(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    const lineItem = order.line_items[0];
    if (!lineItem.insured_entities || !lineItem.insured_entities.pets) {
      state.completed_steps.insurance_info.visible = false;
      return state;
    }
    if (lineItem.insured_entities && lineItem.insured_entities.pets) {
      const insuredPet = lineItem.insured_entities.pets;
      if (!insuredPet[0]) {
        state.completed_steps.insurance_info.visible = false;
        return state;
      }
      state.completed_steps.insurance_info.selected_pet_type = insuredPet[0].kind;
      const selectedPetType = state.completed_steps.insurance_info.selected_pet_type;
      if (selectedPetType) {
        const petKinds = Object.keys(lineItem.pet_properties.kinds).map(k => ({ key: k, value: lineItem.pet_properties.kinds[k] }))
        state.completed_steps.insurance_info.display_data[0].value = petKinds.find(p => p.key === selectedPetType).value;
      }
    }
    return state;
  }

  private setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    if (order.state === 'complete' && !window.matchMedia('(min-width: 576px)').matches) {
      state.cost_item = null;
      return state;
    }
    state = CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
    state = CheckoutLinearStepperCommonReducer.setCostTimDiscount(state, order);
    state.cost_item.policy_endDate = TimeHelper.fromNgbDateStrucutreToStringLocale(
      TimeHelper.fromDateToNgbDate(moment(new Date(order.line_items[0].expiration_date)).toDate())
    );
    if (order.state === 'insurance_info') {
      state.cost_item.price = '-,-- €';
    } else {
      state.cost_item.price = this.formatPrice(order.total);
    }
    if (order.state === 'address') {
      state.cost_item.cost_detail_list = JSON.parse(localStorage.getItem('ProposalCostDetailList'));
    }
    if (order.state === 'complete') {
      state.completed_steps.insurance_info.customers_tim_pet_recap = true;
      state.cost_item.cost_detail_list = JSON.parse(localStorage.getItem('ProposalCostDetailList'));
      localStorage.removeItem('ProposalCostDetailList');
    }
    return state;
  }

  private formatPrice(price: number): string {
    return formatCurrency(
      price,
      'it_IT',
      getCurrencySymbol('EUR', 'narrow'),
      'EUR',
      '0.2-2'
    )
  }

  private setCompletedSteps(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
    state = this.setPet(state, order);
    state = this.setHolder(state, order);
    state = this.setSurvey(state, order);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setHeader(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    if (order.state === 'complete') {
      state.checkout_header.title = state.checkout_header.secondary_title;
    }
    state.checkout_header = Object.assign({}, state.checkout_header);
    state.checkout_header.product_name = state.model.product.name;
    state.checkout_header.partner_name = state.model.product.originalProduct.provider.name;
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

  private setHolder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    if (!order.bill_address) {
      state.completed_steps.insurance_holder.visible = false;
      return state;
    }
    state.completed_steps.insurance_holder.display_data = [
      order.bill_address.firstname + ' ' + order.bill_address.lastname,
      order.bill_address.taxcode,
      order.bill_address.city,
    ];
    return state;
  }

  private setSurvey(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    return state;
  }

  private setUncompletedSteps(state: CheckoutLinearStepperGenericState, uncompleted_step_titles: any) {
    const uncompletedStepNames = uncompleted_step_titles.map(x => x.name);
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
    state.completed_steps.insurance_info.customers_tim_pet_recap = false;
    if (this.state.model.currentStep.name !== 'complete') {
      completed_steps.forEach(step => {
        switch (step.name) {
          case 'insurance-info':
            state.completed_steps.insurance_info.visible = false;
            state.completed_steps.insurance_info.customers_tim_pet_recap = true;
            break;
          case 'address':
            state.completed_steps.insurance_holder.visible = true;
            state.completed_steps.insurance_holder.layout = 'simple';
            break;
          case 'survey':
            state.completed_steps.insurance_survey.visible = true;
            state.completed_steps.insurance_survey.layout = 'simple';
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

  private updateStateProperty(state: CheckoutLinearStepperGenericState, payload: { property: string, value: any }) {
    if (payload.property.includes('.')) {
      _.set(state, payload.property, payload.value)
    } else {
      state[payload.property] = payload.value;
    }
    return state;
  }

}
