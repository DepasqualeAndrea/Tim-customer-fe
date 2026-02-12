import { CheckoutLinearStepperGenericReducer } from './checkout-linear-stepper-generic-reducer';
import { CheckoutLinearStepperReducer } from './checkout-linear-stepper-reducer';
import { CheckoutLinearStepperGenericState } from './checkout-linear-stepper-generic-state.model';
import { CheckoutStep } from 'app/modules/checkout/checkout-step/checkout-step.model';
import { ResponseOrder } from '@model';
import { CheckoutTimMySciContent } from '../content/checkout-tim-my-sci-content.model';
import _ from 'lodash';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { CurrencyHelper } from 'app/shared/helpers/currency.helper';
import { CheckoutLinearStepperCommonReducer } from './checkout-linear-stepper-common-reducer';

export class CheckoutLinearStepperTimMySciReducer extends CheckoutLinearStepperGenericReducer implements CheckoutLinearStepperReducer {

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

  public setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state = CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
    state = CheckoutLinearStepperCommonReducer.setCostTimDiscount(state, order);
    state.cost_item.product_name = state.model.product.name;
    state.cost_item.informative_set = state.cost_item.informative_set;
    if (order.state === 'complete' && !window.matchMedia('(min-width: 576px)').matches) {
      state.cost_item = null;
      return state;
    }
    if (order.state === 'insurance_info') {
      state.cost_item.policy_startDate = '--/--/----';
      state.cost_item.policy_endDate = '--/--/----';
      state.cost_item.price = '-,-- €'
    } else {
      state.cost_item.price = CurrencyHelper.formatPrice(order.total);
    }
    if (order.state === 'address') {
      if (order.line_items[0].start_date) {
        let start_date_day = order.line_items[0].start_date.substring(8, 10);
        let start_date_month = order.line_items[0].start_date.substring(5, 7);
        let start_date_year = order.line_items[0].start_date.substring(0, 4);
        let start_date = start_date_day + "/" + start_date_month + "/" + start_date_year

        let end_Date_day = order.line_items[0].expiration_date.substring(8, 10);
        let end_Date_month = order.line_items[0].expiration_date.substring(5, 7);
        let end_Date_year = order.line_items[0].expiration_date.substring(0, 4);
        let end_Date = end_Date_day + "/" + end_Date_month + "/" + end_Date_year

        state.cost_item.policy_startDate = start_date
        state.cost_item.policy_endDate = end_Date
        state.cost_item.cost_detail_list = JSON.parse(localStorage.getItem('ProposalCostDetailList'));
      }
    }
    if (order.state === 'complete') {
      state.cost_item.policy_startDate = TimeHelper.fromNgbDateStrucutreToStringLocale(
        TimeHelper.fromDateToNgbDate(new Date(order.line_items[0].start_date))
      );
      state.cost_item.policy_endDate = TimeHelper.fromNgbDateStrucutreToStringLocale(
        TimeHelper.fromDateToNgbDate(new Date(order.line_items[0].expiration_date))
      );
      state.cost_item.cost_detail_list = JSON.parse(localStorage.getItem('ProposalCostDetailList'));
      localStorage.removeItem('ProposalCostDetailList')
    }
    return state
  }

  getState() {
    return this.state;
  }

  getCurrenySymbol(state: CheckoutLinearStepperGenericState) {
    return state.model.product.order.currency === 'EUR' ? '€' : null;
  }

  private getEmptyState(): CheckoutLinearStepperGenericState {
    const initialState = {
      checkout_header: {
        visible: true,
        extra_title: null,
        title: null,
        secondary_title: null,
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
          recap_cards: null,
          display_data: [
            {
              label: null,
              value: null
            },
            {
              label: null,
              value: null
            },
            {
              label: null,
              value: null
            },
            {
              label: null,
              value: null
            },
            {
              label: null,
              value: null
            },
            {
              label: null,
              value: null
            },
            {
              label: null,
              value: null
            },
            {
              label: null,
              value: null
            },
            {
              label: null,
              value: null
            },
          ]
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
      addons: null,
      payment: null
    };
    return initialState;
  }

  private setScrollElement(state: any, currentStep: CheckoutStep) {
    state.scroll.scrollToElement = false;
    if (currentStep.name !== 'confirm' && currentStep.name !== 'complete') {
      if (!window.matchMedia('(min-width: 576px)').matches) {
        state.scroll.scrollToElement = true;
      }
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

  private setContent(state: CheckoutLinearStepperGenericState, content: CheckoutTimMySciContent): CheckoutLinearStepperGenericState {
    state = this.setUncompletedStepTitles(state, content);
    state = this.setCostItemDetailsContent(state, content);
    state = this.setContentCompletedSteps(state, content);
    state = this.setContentHeader(state, content);
    return state;
  }

  private setContentHeader(state: CheckoutLinearStepperGenericState, content: CheckoutTimMySciContent): CheckoutLinearStepperGenericState {
    state.checkout_header.title = content.checkout_header.title;
    state.checkout_header.extra_title = content.checkout_header.extra_title;
    state.checkout_header.secondary_title = content.checkout_header.secondary_title;
    state.checkout_header.partner_text = content.checkout_header.partner_text;
    state.checkout_header.partner_icon = content.checkout_header.partner_icon;
    return state;
  }

  private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState, content: CheckoutTimMySciContent): CheckoutLinearStepperGenericState {
    state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
    return state;
  }

  private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutTimMySciContent) {
    state = this.setContentInsuranceInfo(state, content);
    state = this.setContentInsuranceHolder(state, content);
    state = this.setContentSurvey(state, content);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutTimMySciContent) {
    state.uncompleted_step_titles = [
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

  private setContentInsuranceInfo(state: CheckoutLinearStepperGenericState, content: CheckoutTimMySciContent): CheckoutLinearStepperGenericState {

    // Labels
    // [0] Numero assicurati / [2] Durata della polizza / [4] Scegli la tua polizza / [6] Dati assicurati
    state.completed_steps.insurance_info.display_data[0].label = content.card_contractor.insured_number;
    state.completed_steps.insurance_info.display_data[2].label = content.card_contractor.policy_duration;
    state.completed_steps.insurance_info.display_data[4].label = content.card_contractor.title_recap_proposals;
    state.completed_steps.insurance_info.display_data[6].label = content.card_contractor.insured_data;

    // Images
    // [1] Numero assicurati / [3] Durata della polizza / [5] Scegli la tua polizza / [7] Dati assicurati
    state.completed_steps.insurance_info.display_data[1].value = content.card_contractor.insured_number_image;
    state.completed_steps.insurance_info.display_data[1].label = content.card_contractor.insured_number_alt;
    state.completed_steps.insurance_info.display_data[3].value = content.card_contractor.policy_duration_image;
    state.completed_steps.insurance_info.display_data[3].label = content.card_contractor.policy_duration_alt;
    state.completed_steps.insurance_info.display_data[5].value = content.card_contractor.image_recap_proposals;
    state.completed_steps.insurance_info.display_data[5].label = content.card_contractor.image_alt_recap_proposals;
    state.completed_steps.insurance_info.display_data[7].value = content.card_contractor.insured_data_image;
    state.completed_steps.insurance_info.display_data[7].label = content.card_contractor.insured_data_alt;

    return state;
  }

  private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutTimMySciContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_holder.title = content.card_contractor.title;
    state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
    return state;
  }


  private setContentSurvey(state: CheckoutLinearStepperGenericState, content: CheckoutTimMySciContent): CheckoutLinearStepperGenericState {
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

  private setHeader(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    if (order.state === 'complete') {
      state.checkout_header.title = state.checkout_header.secondary_title;
    }
    state.checkout_header = Object.assign({}, state.checkout_header);
    state.checkout_header.product_name = state.model.product.name;
    state.checkout_header.partner_name = state.model.product.originalProduct.provider.name;
    return state;
  }

  private setCompletedSteps(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
    state = this.setHeader(state, order);
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

  private setUncompletedSteps(state: CheckoutLinearStepperGenericState, uncompletedSteps: any) {
    const uncompletedStepNames = uncompletedSteps.map(x => x.name);
    const allowedUncompletedSteps = ['insurance-info', 'address', 'survey', 'payment'];
    const stepsFiltered = [];
    uncompletedStepNames.forEach((step) => {
      if (allowedUncompletedSteps.some((allowedStep) => step === allowedStep)) {
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
    state.completed_steps.insurance_info.customers_tim_sci_recap = false;
    if (this.state.model.currentStep.name !== 'complete') {
      completed_steps.forEach(step => {
        switch (step.name) {
          case 'insurance-info':
            state.completed_steps.insurance_info.visible = false;
            state.completed_steps.insurance_info.customers_tim_sci_recap = true;
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
