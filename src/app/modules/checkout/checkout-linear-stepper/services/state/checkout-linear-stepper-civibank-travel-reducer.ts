import {CheckoutLinearStepperGenericReducer} from './checkout-linear-stepper-generic-reducer';
import {CheckoutLinearStepperReducer} from './checkout-linear-stepper-reducer';
import {CheckoutLinearStepperGenericState} from './checkout-linear-stepper-generic-state.model';
import {CheckoutStep} from 'app/modules/checkout/checkout-step/checkout-step.model';
import {CheckoutLinearStepperCommonReducer} from './checkout-linear-stepper-common-reducer';
import {ResponseOrder} from '@model';
import {CheckoutTravelContent} from '../content/checkout-travel-content.model';
import * as moment from 'moment';

export class CheckoutLinearStepperCivibankTravelReducer extends CheckoutLinearStepperGenericReducer implements CheckoutLinearStepperReducer {

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
      case 'setCurrentUrl':
        this.state = this.showInsuranceInfoWhenLoginRegister(this.state, payload);
        break;
      case 'setCostItemAfterSelectedAddons':
        this.state = this.updateCostItem(this.state, payload);
        break;
    }
    return super.common(actionName, payload);
  }

  public setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    if (order.state === 'complete' && !window.matchMedia('(min-width: 576px)').matches) {
      state.cost_item = null;
      return state;
    }
    state = this.setCostItemListAddons(state, order.line_items[0].addons);
    state = CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
    state.cost_item.policy_endDate = moment(order.line_items[0].expiration_date).subtract(1, 'd').format('DD/MM/YYYY');
    return state;
  }

  getState() {
    return this.state;
  }

  getCurrenySymbol(state: CheckoutLinearStepperGenericState) {
    return state.model.product.order.currency === 'EUR' ? '€' : null;
  }

  private setCostItemListAddons(state: CheckoutLinearStepperGenericState, addons: any) {
    const htrvPremium = [];
    const htrvBasic = [];

    state.cost_item.cost_detail_with_code_by_product.htrvpremium.forEach(item => {
      addons.forEach(addon => {
        if (addon.code === item.code_option_package.value || addon.cod_garanzia === item.code_option_package.value) {
          let massimale = '';
          if (((addon.massimale && addon.massimale !== '0') || (addon.maximal && addon.maximal !== 0)) && addon.cod_garanzia !== 'IVNR00104') {
            massimale = '(massimale ' + (addon.massimale ? Intl.NumberFormat().format(addon.massimale) : Intl.NumberFormat().format(addon.maximal)) + this.getCurrenySymbol(state) + ')';
          }
          htrvPremium.push(item.description_option_package.value + ' ' + massimale);
          return;
        }
      });
    });

    state.cost_item.cost_detail_with_code_by_product.htrvbasic.forEach(item => {
      addons.forEach(addon => {
        if (addon.code === item.code_option_package.value || addon.cod_garanzia === item.code_option_package.value) {
          let massimale = '';
          if ((addon.massimale && addon.massimale !== '0') || (addon.maximal && addon.maximal !== 0)) {
            massimale = '(massimale ' + (addon.massimale ? Intl.NumberFormat().format(addon.massimale) : Intl.NumberFormat().format(addon.maximal)) + this.getCurrenySymbol(state) + ')';
          }
          htrvBasic.push(item.description_option_package.value + ' ' + massimale);
          return;
        }
      });
    });

    state.cost_item.cost_detail_by_product = {
      htrvpremium: htrvPremium,
      htrvbasic: htrvBasic,
    };
    return state;
  }

  private updateCostItem(state: CheckoutLinearStepperGenericState, payload: any) {
    state = this.setCostItemListAddons(state, payload.additional_data.listaGaranzie);
    state.cost_item.cost_detail_list = CheckoutLinearStepperCommonReducer.getCostItemDetailsByProduct(state.model.product.code, state.cost_item.cost_detail_by_product);
    state.cost_item.price = this.getCurrenySymbol(state) + payload.total.replace('.', ',');
    return state;
  }

  private joinDestinationsString(destinations: any) {
    let destinationsString = '';
    destinations.forEach((dest, i) => {
      destinationsString = destinationsString + (i === 0 ? '' : ', ') + dest.country;
    });
    return destinationsString;
  }

  private getEmptyState(): CheckoutLinearStepperGenericState {
    return {
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
          insured_is_contractor: null,
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
          ],
          travel_title: null,
          insuredSubjects: [
            {
              name: null,
              taxcode: null
            },
            {
              insured: null
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

  private setContent(state: CheckoutLinearStepperGenericState, content: CheckoutTravelContent): CheckoutLinearStepperGenericState {
    state = this.setUncompletedStepTitles(state, content);
    state = this.setCostItemDetailsContent(state, content);
    state = this.setContentCompletedSteps(state, content);
    state = this.setContentHeader(state, content);
    return state;
  }

  private setContentHeader(state: CheckoutLinearStepperGenericState, content: CheckoutTravelContent): CheckoutLinearStepperGenericState {
    state.checkout_header.title = content.checkout_header.title;
    state.checkout_header.extra_title = content.checkout_header.extra_title;
    state.checkout_header.secondary_title = content.checkout_header.secondary_title;
    state.checkout_header.partner_text = content.checkout_header.partner_text;
    state.checkout_header.partner_icon = content.checkout_header.partner_icon;
    return state;
  }

  private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState, content: CheckoutTravelContent): CheckoutLinearStepperGenericState {
    state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
    if (this.state.model && this.state.model.product) {
      const product = this.state.model.product;
      state.cost_item.cost_detail_list = CheckoutLinearStepperCommonReducer.getCostItemDetailsByProduct(product.code, state.cost_item.cost_detail_by_product);
    }
    return state;
  }

  private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutTravelContent) {
    state = this.setContentInsuranceInfo(state, content);
    state = this.setContentInsuranceHolder(state, content);
    state = this.setContentSurvey(state, content);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutTravelContent) {
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
      // {
      //   name: 'payment',
      //   title: content.card_payment.title
      // }
    ];
    return state;
  }

  private setContentInsuranceInfo(state: CheckoutLinearStepperGenericState, content: CheckoutTravelContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_info.title = content.card_insured.title;
    state.completed_steps.insurance_info.display_data[0].label = content.card_insured.destination;
    state.completed_steps.insurance_info.display_data[1].label = content.card_insured.travel_start_date;
    state.completed_steps.insurance_info.display_data[2].label = content.card_insured.travel_end_date;
    state.completed_steps.insurance_info.display_data[3].label = content.card_insured.insured_number;

    state.completed_steps.insurance_info.travel_title = content.card_insured.traveler_number;
    return state;
  }

  private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutTravelContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_holder.title = content.card_contractor.title;
    state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
    return state;
  }

  private setContentSurvey(state: CheckoutLinearStepperGenericState, content: CheckoutTravelContent): CheckoutLinearStepperGenericState {
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
    const insuredSubjects = state.completed_steps.insurance_info.insuredSubjects;
    const contractor = order.bill_address;
    displayData[0].value = this.joinDestinationsString(lineItem.insurance_info.destinations);
    displayData[1].value = moment(lineItem.start_date).format('DD/MM/YYYY');
    displayData[2].value = moment(lineItem.expiration_date).subtract(1, 's').format('DD/MM/YYYY');
    displayData[3].value = lineItem.quantity;

    if (contractor) {
      insuredSubjects[0].name = contractor.firstname + ' ' + order.bill_address.lastname;
      insuredSubjects[0].taxcode = contractor.taxcode;
      insuredSubjects[1].insured = lineItem.insured_entities.insurance_holders.map(item => {
        const insured = {
          insuredname: item.firstname + ' ' + item.lastname,
          insuredtaxcode: item.taxcode
        };
        return insured;
      });
    }

    state.completed_steps.insurance_info.product_icon = state.model.product.image;
    return state;
  }

  private setHolder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    if (!order.bill_address) {
      state.completed_steps.insurance_holder.visible = false;
      return state;
    }

    state.completed_steps.insurance_info.insured_is_contractor = order.line_items[0].insured_is_contractor;

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
    const allowedUncompletedSteps = ['insurance-info', 'address', 'survey'];
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
          // case 'payment':
          //   stepsFiltered.push(stepTitle);
          //   break;
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
      state.uncompleted_steps = Object.assign([], state.uncompleted_steps.filter(x => !x.includes(addressTitle)));
    }
    return state;
  }
}
