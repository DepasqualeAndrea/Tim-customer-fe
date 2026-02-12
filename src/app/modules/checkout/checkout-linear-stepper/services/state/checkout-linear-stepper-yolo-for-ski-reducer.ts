import { CheckoutLinearStepperGenericReducer } from './checkout-linear-stepper-generic-reducer';
import { CheckoutLinearStepperReducer } from './checkout-linear-stepper-reducer';
import { CheckoutLinearStepperGenericState } from './checkout-linear-stepper-generic-state.model';
import { CheckoutStep } from 'app/modules/checkout/checkout-step/checkout-step.model';
import { CheckoutLinearStepperCommonReducer } from './checkout-linear-stepper-common-reducer';
import { LineFirstItem, ResponseOrder } from '@model';
import moment from 'moment';
import { CheckoutYoloForSkiContent } from '../content/checkout-yolo-for-ski-content.model';
import { TimeHelper } from 'app/shared/helpers/time.helper';

export class CheckoutLinearStepperYoloForSkiReducer extends CheckoutLinearStepperGenericReducer implements CheckoutLinearStepperReducer {

  public getInitialState() {
    this.state = this.getEmptyState();
    return this.state;
  }

  private getEmptyState(): CheckoutLinearStepperGenericState {
    const initialState = {
      checkout_header: {
        visible: true,
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
          display_data: [
            {
              label: null,
              value: null
            },
            {
              label: null,
              value: null
            }
          ]
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
      case 'setCurrentUrl':
        this.state = this.showInsuranceInfoWhenLoginRegister(this.state, payload);
        break;
    }
    return super.common(actionName, payload);
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

  private setContent(state: CheckoutLinearStepperGenericState, content: CheckoutYoloForSkiContent): CheckoutLinearStepperGenericState {
    state = this.setUncompletedStepTitles(state, content);
    state = this.setCostItemDetailsContent(state, content);
    state = this.setContentCompletedSteps(state, content);
    state = this.setContentHeader(state, content);
    return state;
  }

  private setContentHeader(state: CheckoutLinearStepperGenericState, content: CheckoutYoloForSkiContent): CheckoutLinearStepperGenericState {
    state.checkout_header.title = content.checkout_header.title;
    state.checkout_header.secondary_title = content.checkout_header.secondary_title;
    state.checkout_header.partner_text = content.checkout_header.partner_text;
    state.checkout_header.partner_icon = content.checkout_header.partner_icon;
    return state;
  }

  private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState, content: CheckoutYoloForSkiContent): CheckoutLinearStepperGenericState {
    state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
    if (this.state.model && this.state.model.product) {
      const product = this.state.model.product;
      state.cost_item.cost_detail_list = CheckoutLinearStepperCommonReducer.getCostItemDetailsByProduct(product.code, state.cost_item.cost_detail_by_product);
    }
    return state;
  }

  private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutYoloForSkiContent) {
    state = this.setContentInsuranceInfo(state, content);
    state = this.setContentInsuranceHolder(state, content);
    state = this.setContentSurvey(state, content);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutYoloForSkiContent) {
    state.uncompleted_step_titles = [
      {
        name: 'insurance-info',
        title: content.card_insured.title
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

  private setContentInsuranceInfo(state: CheckoutLinearStepperGenericState, content: CheckoutYoloForSkiContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_info.title = content.card_insured.title;
    state.completed_steps.insurance_info.display_data[0].label = content.card_insured.package;
    state.completed_steps.insurance_info.display_data[1].label = content.card_insured.insured_subjects;
    return state;
  }

  private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutYoloForSkiContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_holder.title = content.card_contractor.title;
    state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
    return state;
  }
  private setContentSurvey(state: CheckoutLinearStepperGenericState, content: CheckoutYoloForSkiContent): CheckoutLinearStepperGenericState {
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
    state = this.setInsured(state, order);
    state = this.setHolder(state, order);
    state = this.setSurvey(state, order);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setInsured(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    const lineItem = order.line_items[0];
    const displayData = state.completed_steps.insurance_info.display_data;
    displayData[0].value = lineItem.variant.option_values[0].presentation;
    displayData[1].value = lineItem.quantity;
    state.completed_steps.insurance_info.product_icon = state.model.product.image;
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

  public setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    // state.cost_item.informative_set = state.cost_item.informative_set;
    if (order.state === 'complete' && !window.matchMedia('(min-width: 576px)').matches) {
      state.cost_item = null;
      return state;
    }
    if (!this.isSeasonal(order)) {
      const startDate = moment().format('MM/DD/YYYY');
      state.model.product.order.line_items[0].start_date = startDate;
      state.model.product.order.line_items[0].start_date = new Date(startDate);
      state.model.product.order.line_items[0].expiration_date = new Date(moment(startDate).add(state.model.product.order.line_items[0].days_number - 1, 'days').format('MM/DD/YYYY'));
    }
    CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
    if (this.isSeasonal(order)) {
      state.cost_item.activate_from = true;
      state.cost_item.duration_policy = true;
      this.state = this.setDatesLabels(state, order);
    }
    state.cost_item.product_name = state.model.product.originalProduct.properties.find(p => p.name === 'uniq_name').value
    state.cost_item.product_name_package = state.model.product.name;
    this.setCostItemMobile(state, order)
    return state
  }

  private setCostItemMobile(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState  {
    const [lineItem] = order.line_items;
    state.cost_item.mobileDetailList = [] as {label: string, value: any, list?: string[]}[]
    state.cost_item.mobileDetailList.push( {
      label: state.cost_item.duration,
      value: this.isSeasonal(order)
        ? lineItem.variant.option_values[0].presentation
        : this.computeDaysLabel(lineItem, state)
    })
    state.cost_item.mobileDetailList.push( {
      label: state.cost_item.package,
      value: state.model.product.name,
      list: state.cost_item.cost_detail_list
    })
    state.cost_item.mobileDetailList.push( {label: state.cost_item.insureds, value: lineItem.quantity})
    state.cost_item.mobileDetailList.push( {
      label: state.cost_item.place,
      value: state.cost_item.italy
    })
    state.cost_item.mobileDetailList.push( {
      label: state.cost_item.startDate,
      value: state.cost_item.policy_startDate
    })
    state.cost_item.insuranceHolders = lineItem.insured_entities.insurance_holders.map(h => ({
      name: h.firstname,
      surname: h.lastname,
      birthDate: moment(h.birth_date).format('DD/MM/YYYY')
    }))
    return state
  }

  private computeDaysLabel(lineItem: LineFirstItem, state: CheckoutLinearStepperGenericState): string {
    return lineItem.days_number + ' ' + (lineItem.days_number === 1
      ? state.cost_item.day
      : state.cost_item.days)
  }

  private setDatesLabels(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
    if (this.seasonHasEnded(order)) {
      state.cost_item.policy_validity = `-`;
      return state;
    }
    if (!this.seasonHasStarted(order)) {
      const seasonEnd = order.line_items[0].variant.product_properties.season_end_date;
      const seasonStart = order.line_items[0].variant.product_properties.season_start_date;
      state.cost_item.policy_validity = `Stagionale (${seasonStart}-${seasonEnd})`;
      return state;
    }
    if (this.seasonHasStarted(order)) {
      const seasonEnd = order.line_items[0].variant.product_properties.season_end_date;
      state.cost_item.policy_validity = `Stagionale (fino al ${seasonEnd})`;
      return state;
    }
  }

  private isSeasonal(order: ResponseOrder): boolean {
    return order.line_items[0].variant.name === 'Seasonal'
  }

  private seasonHasEnded(order: ResponseOrder): boolean {
    const seasonEnd = order.line_items[0].variant.product_properties.season_end_date;
    return moment().isAfter(moment(TimeHelper.inverPositionDayMonth(seasonEnd, 'MM/DD/YYYY', '/')));
  }

  private seasonHasStarted(order: ResponseOrder): boolean {
    const seasonStart = order.line_items[0].variant.product_properties.season_start_date;
    return moment(TimeHelper.inverPositionDayMonth(seasonStart, 'MM/DD/YYYY', '/')).isBefore(moment());
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

  private showInsuranceInfoWhenLoginRegister(state: CheckoutLinearStepperGenericState, payload: { url: string }): CheckoutLinearStepperGenericState {
    const isLoginRegister = payload.url && payload.url.includes('login-register');
    if (isLoginRegister && this.state.model.currentStep.stepnum === 1) {
      state.completed_steps.insurance_info.visible = true;
      state.completed_steps = Object.assign({}, state.completed_steps);
      const addressTitle = state.uncompleted_step_titles.find(s => s.name === 'address').title;
      state.uncompleted_steps =  Object.assign([], state.uncompleted_steps.filter(x => !x.includes(addressTitle)));
    }
    return state;
  }

  getState() {
    return this.state;
  }

}
