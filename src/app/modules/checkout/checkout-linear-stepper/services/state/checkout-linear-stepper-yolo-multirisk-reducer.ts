import { CheckoutStep } from "app/modules/checkout/checkout-step/checkout-step.model";
import { CheckoutLinearStepperGenericReducer } from "./checkout-linear-stepper-generic-reducer";
import { CheckoutLinearStepperGenericState } from "./checkout-linear-stepper-generic-state.model";
import { CheckoutLinearStepperReducer } from "./checkout-linear-stepper-reducer";
import { ResponseOrder } from '@model';
import { CheckoutYoloMultiriskContent } from "../content/checkout-yolo-multirisk-content.model";
import { CheckoutLinearStepperCommonReducer } from "./checkout-linear-stepper-common-reducer";
import moment from "moment";
import _ from "lodash";

export class CheckoutLinearStepperYoloMultiriskReducer extends CheckoutLinearStepperGenericReducer implements CheckoutLinearStepperReducer {

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
      },
      completed_steps: {
        cost_item: {},
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
            }
          ],
          edit: true
        },
        insurance_holder: {
          visible: false,
          edit: true
        },
        insurance_survey: {
          visible: false,
          edit: true
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
      payment: null,
      collaboration_section: {
        title: null,
        image: null
      }
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
      case 'setProperty':
        this.state = this.updateStateProperty(this.state, payload);
        break;
      case 'setCostItemInfoDataWithAddons':
        this.state = this.updateCostItem(this.state, payload);
        break;
      case 'setCostItemInfoDataBuilding':
        this.state = this.updateDataBuilding(this.state, payload);
        break;
      case 'setCostItemInfoRecap':
        this.state = this.updateInfoRecap(this.state, payload);
        break;
      case 'setCostItemShoppingCartInfo':
        this.state = this.updateShoppingCartInfo(this.state, payload);
        break;
      case 'setCostItemPayment':
        this.state = this.updateShoppingCartPaymentMode(this.state, payload);
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

  private setContent(state: CheckoutLinearStepperGenericState, content: CheckoutYoloMultiriskContent): CheckoutLinearStepperGenericState {
    state = this.setUncompletedStepTitles(state, content);
    state = this.setCostItemDetailsContent(state, content);
    state = this.setContentCompletedSteps(state, content);
    return state;
  }


  private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutYoloMultiriskContent) {
    state = this.setContentInsuranceHolder(state, content);
    state = this.setContentSurvey(state, content);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutYoloMultiriskContent) {
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


  private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutYoloMultiriskContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_holder.title = content.card_contractor.title;
    state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
    return state;
  }
  private setContentSurvey(state: CheckoutLinearStepperGenericState, content: CheckoutYoloMultiriskContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_survey.title = content.card_survey.title;
    state.completed_steps.insurance_survey.card_icon = content.card_survey.image;
    return state;
  }

  private setOrder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state = this.setCostItemDetail(state, order);
    state = this.setCompletedSteps(state, order);
    // state = this.setHeader(state, order);
    state = this.setScrollElementFromOrder(state, order);
    return state;
  }


  private setCompletedSteps(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
    state = this.setHolder(state, order);
    state = this.setSurvey(state, order);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }


  setDuration(order: ResponseOrder) {
    const lineItem = order.line_items[0];
    const x = moment(lineItem.expiration_date).diff(moment(lineItem.start_date), 'days');
      return moment.duration(x, 'days').locale('it').humanize();
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
   if (order.state === 'complete') {
    //  state.cost_item = null;
    //  return state;
      state.cost_item.complete_step = true;
    } else {
      state.cost_item.complete_step = false;
    }
    switch (order.state) {
      case 'address':
        state.cost_item.complete_step_address = true;
            break;
      case 'survey':
              state.cost_item.complete_step_address = true;
            break;
      case 'payment':
            state.cost_item.complete_step_address = true;
            state.cost_item.complete_step_payment = true;
            state.cost_item.calculate_price = order.data.total;
            break;
      case 'complete':
            state.cost_item.complete_step_address = true;
            state.cost_item.complete_step_payment = true;
            state.cost_item.calculate_price = order.data.total;
            state.cost_item.policy_startDate = moment(order.line_items[0].start_date).format('DD/MM/YYYY');
            state.cost_item.policy_endDate = moment(order.line_items[0].start_date).add(1, 'y').format('DD/MM/YYYY');
            break;
      default:
            state.cost_item.complete_step_address = false;
    }
    CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
    state.cost_item.name = order.line_items[0].variant.name;
    state.completed_steps.cost_item = state.cost_item;
    return state;
  }

  public setCostItemDetailsContent(state: CheckoutLinearStepperGenericState, content: CheckoutYoloMultiriskContent): CheckoutLinearStepperGenericState {
    state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
    if (this.state.model && this.state.model.product) {
      state.cost_item.cost_detail_list = CheckoutLinearStepperCommonReducer.getCostItemDetailsByProduct(this.state.model.product.code, state.cost_item.cost_detail_by_product);
    }
    state.completed_steps.cost_item = state.cost_item;
    return state;
  }

  private updateStateProperty(state: CheckoutLinearStepperGenericState, payload: {property: string, value: any}) {
    if (payload.property.includes('.')) {
      _.set(state, payload.property, payload.value);
    } else {
      state[payload.property] = payload.value;
    }
    return state;
  }

  private setUncompletedSteps(state: CheckoutLinearStepperGenericState, uncompletedSteps: any) {
    const uncompletedStepNames = uncompletedSteps.map(x => x.name);
    const allowedUncompletedSteps = ['address', 'survey', 'payment'];
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
      state.completed_steps.insurance_info.visible = false;
      state.completed_steps = Object.assign({}, state.completed_steps);
      const addressTitle = state.uncompleted_step_titles.find(s => s.name === 'address').title;
      state.uncompleted_steps =  Object.assign([], state.uncompleted_steps.filter(x => !x.includes(addressTitle)));
    }
    return state;
  }

  getState() {
    return this.state;
  }

  private updateCostItem(state: CheckoutLinearStepperGenericState, payload: any) {
    /*
    const addons = payload.addons || (payload.data && payload.data.quotation_response.addons);
    if (addons) {
      state = this.setCostItemListAddons(state, addons);
    }
    */
    state.cost_item.cost_detail_list = CheckoutLinearStepperCommonReducer.getCostItemDetailsByProduct(state.model.product.code, state.cost_item.cost_detail_by_product);
    state.cost_item.employees_number = payload.employees_number;
    state.cost_item.beds_number = payload.beds_number;
    state.cost_item.building_type = payload.building_type;
    state.cost_item.province = payload.province;
    state.completed_steps.cost_item = state.cost_item;
    return state;
  }

  private updateDataBuilding(state: CheckoutLinearStepperGenericState, payload: any) {
    state.cost_item.address_building = payload;
    return state;
  }

  private updateInfoRecap(state: CheckoutLinearStepperGenericState, payload: any) {
    state.cost_item.recap_info = payload;
    return state;
  }

  private updateShoppingCartInfo(state: CheckoutLinearStepperGenericState, payload: any){
    state.cost_item.shopping_cart_annual_premium = payload.total;
    return state;
  }
  private updateShoppingCartPaymentMode(state: CheckoutLinearStepperGenericState, payload: any){
    if (payload === 'M') {
      state.cost_item.monthly =  payload;
      state.cost_item.half_yearly =  false;
    } else if (payload === 'S') {
      state.cost_item.half_yearly =  payload;
      state.cost_item.monthly =  false;
      state.cost_item.annual =  false;

    } else if (payload === 'Y') {
      state.cost_item.half_yearly =  false;
      state.cost_item.monthly =  false;
    }
    return state;
  }

}
