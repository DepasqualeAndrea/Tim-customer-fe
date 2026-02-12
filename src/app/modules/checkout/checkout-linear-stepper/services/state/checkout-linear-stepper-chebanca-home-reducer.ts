import {CheckoutLinearStepperGenericReducer} from './checkout-linear-stepper-generic-reducer';
import {CheckoutLinearStepperReducer} from './checkout-linear-stepper-reducer';
import {CheckoutLinearStepperGenericState} from './checkout-linear-stepper-generic-state.model';
import {CheckoutStep} from 'app/modules/checkout/checkout-step/checkout-step.model';
import {CheckoutLinearStepperCommonReducer} from './checkout-linear-stepper-common-reducer';
import {ResponseOrder} from '@model';
import {CheckoutChebancaHomeContent} from '../content/checkout-chebanca-home-content-model';
import {CheckoutGeHomeContent} from '../content/checkout-ge-home-content.model';
import {getCurrencySymbol} from "@angular/common";

export class CheckoutLinearStepperChebancaHomeReducer extends CheckoutLinearStepperGenericReducer implements CheckoutLinearStepperReducer {

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
      case 'setCostItemAfterSelectedAddonsHome':
        this.state = this.updateCostItem(this.state, payload);
        break;
    }
    return super.common(actionName, payload);
  }

  public setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state.cost_item.icon_download = state.cost_item.download_icon;
    const price = order.line_items[0].price;
    if (order.estimate && order.estimate.document_url) {
      state.cost_item.document_url = order.estimate.document_url;
    }
    state.cost_item.checkout_step = order.state;
    state.cost_item.informative_set = state.cost_item.informative_home;
    if (order.state === 'complete') {
      state.cost_item = null;
      return state;
    }
    Object.assign(state.cost_item, { paymentDuration: 'ge-home-cart' });
    if (order.line_items[0].payment_frequency === 'M') {
      const AnnualPricetoMonth = order.line_items[0].price * 12;
      Object.assign(state.cost_item, {paymentDurationAnnual : 'ge-home-annual'});
      state.cost_item.price_frequency_monthly = (order.currency === 'EUR' ? '€' : null) + Number(price).toFixed(2).replace('.', ',');
      state.cost_item.price_frequency_annual = (order.currency === 'EUR' ? '€' : null) + AnnualPricetoMonth.toFixed(2).replace('.', ',');
    } else {
      state.cost_item.price_frequency_annual = (order.currency === 'EUR' ? '€' : null) + Number(price).toFixed(2).replace('.', ',');
    }
    this.updateCostItem(state, order);
    return CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
  }

  getState() {
    return this.state;
  }

  getCurrenySymbol(state: CheckoutLinearStepperGenericState) {
    return state.model.product.order.currency === 'EUR' ? '€' : null;
  }
  getCurrencySymbolDot(addon: number) {
    return new Intl.NumberFormat('it', {  style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0,  currency: 'EUR' }).format(addon);
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
        monthly_payment: null,
        annual_payment: null,
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

  private setContent(state: CheckoutLinearStepperGenericState, content: CheckoutChebancaHomeContent): CheckoutLinearStepperGenericState {
    state = this.setUncompletedStepTitles(state, content);
    state = this.setCostItemDetailsContent(state, content);
    state = this.setContentCompletedSteps(state, content);
    state = this.setContentHeader(state, content);
    return state;
  }

  private setContentHeader(state: CheckoutLinearStepperGenericState, content: CheckoutGeHomeContent): CheckoutLinearStepperGenericState {
    state.checkout_header.title = content.checkout_header.title;
    state.checkout_header.extra_title = content.checkout_header.extra_title;
    state.checkout_header.secondary_title = content.checkout_header.secondary_title;
    state.checkout_header.partner_text = content.checkout_header.partner_text;
    state.checkout_header.partner_icon = content.checkout_header.partner_icon;
    state.checkout_header.annual_payment = content.checkout_header.annual_payment;
    state.checkout_header.monthly_payment = content.checkout_header.monthly_payment;
    return state;
  }

  private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState, content: CheckoutChebancaHomeContent): CheckoutLinearStepperGenericState {
    state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
    if (this.state.model && this.state.model.product) {
      const product = this.state.model.product;
      state.cost_item.cost_detail_list = CheckoutLinearStepperCommonReducer.getCostItemDetailsByProduct(product.code, state.cost_item.cost_detail_by_product);
    }
    return state;
  }

  private setCostItemListAddons(state: CheckoutLinearStepperGenericState, addons: any) {

    const addonChoiseHome = [];

    state.cost_item.cost_detail_with_code_by_product.gehome.forEach(item => {
      addons.forEach(addon => {
        if (addon.id === item.code.value) {
          let massimale = '';
          if (addon.maximal && addon.maximal !== 0 && (addon.id === 'RC proprieta' || addon.id === 'RC conduzione' || addon.id === 'HOME Fabbricato Inc.')) {
            massimale = '(massimale ' + (addon.massimale ? addon.massimale : this.getCurrencySymbolDot(addon.maximal)) + this.getCurrenySymbol(state) + ')';
          }
          addonChoiseHome.push(item.name.value + ' ' + massimale);
          return;
        }
      });
    });

    state.cost_item.cost_detail_by_product = {
      gehome: addonChoiseHome
    };
    return state;
  }

  private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutChebancaHomeContent) {
    state = this.setContentInsuranceInfo(state, content);
    state = this.setContentInsuranceHolder(state, content);
    state = this.setContentSurvey(state, content);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutChebancaHomeContent) {
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

  private setContentInsuranceInfo(state: CheckoutLinearStepperGenericState, content: CheckoutChebancaHomeContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_info.title = content.card_insured.title;
    state.completed_steps.insurance_info.display_data[0].label = content.card_insured.metri_q;
    state.completed_steps.insurance_info.display_data[1].label = content.card_insured.province;
    state.completed_steps.insurance_info.display_data[2].label = content.card_insured.payment;
    state.completed_steps.insurance_info.display_data[3].label = content.card_contractor.image_recap_proposals;
    state.completed_steps.insurance_info.display_data[4].label = content.card_contractor.title_recap_proposals;
    state.completed_steps.insurance_info.display_data[5].label = content.card_contractor.title_recap_customized;
    state.completed_steps.insurance_info.display_data[6].label = content.card_contractor.image;
    return state;
  }

  private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutChebancaHomeContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_holder.title = content.card_contractor.title;
    state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
    return state;
  }

  private setContentSurvey(state: CheckoutLinearStepperGenericState, content: CheckoutChebancaHomeContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_survey.title = content.card_survey.title;
    state.completed_steps.insurance_survey.card_icon = content.card_survey.image;
    state.completed_steps.insurance_survey.state = content.card_survey.status;
    state.completed_steps.insurance_survey.description = content.card_survey.description;
    return state;
  }

  private setOrder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state = this.setCostItemDetail(state, order);
    state = this.setCompletedSteps(state, order);
    state = this.setScrollElementFromOrder(state, order);
    return state;
  }


  private setCompletedSteps(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
    state = this.setInsured(state, order);
    state = this.setHolder(state, order);
    state = this.setSurvey(state, order);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  private setInsured(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    const lineItem = order.line_items[0];
    const displayData = state.completed_steps.insurance_info.display_data;
    displayData[0].value = lineItem.insured_entities.house.sqm;
    displayData[1].value = lineItem.insured_entities.house.state.name;
    displayData[2].value = lineItem.payment_frequency === 'Y' ? state.checkout_header.annual_payment : state.checkout_header.monthly_payment;

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
    state.completed_steps.insurance_info.recap_cards = false;
    if (this.state.model.currentStep.name !== 'complete') {
      completed_steps.forEach(step => {
        switch (step.name) {
          case 'insurance-info':
            state.completed_steps.insurance_info.visible = true;
            state.completed_steps.insurance_info.recap_cards = true;
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

  private updateCostItem(state: CheckoutLinearStepperGenericState, payload: any) {
    const addons = payload.addons || (payload.data && payload.data.quotation_response.addons);
    if (addons) {
      state = this.setCostItemListAddons(state, addons);
    }
    state.cost_item.cost_detail_list = CheckoutLinearStepperCommonReducer.getCostItemDetailsByProduct(state.model.product.code, state.cost_item.cost_detail_by_product);
    state.cost_item.price = this.getCurrenySymbol(state) + payload.total;
    if (state.cost_item.price_frequency_annual && state.cost_item.price_frequency_monthly) {
      state.cost_item.price_frequency_annual = this.getCurrenySymbol(state) + (payload.total * 12).toFixed(2);
    } else {
      state.cost_item.price_frequency_annual = this.getCurrenySymbol(state) + (payload.total * 1).toFixed(2);
    }
    return state;
  }
}
