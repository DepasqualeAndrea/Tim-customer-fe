import { ResponseOrder } from '@model';
import { CheckoutTimCustomersContent } from '../content/checkout-tim-customers-content.model';
import { CheckoutLinearStepperCommonReducer } from './checkout-linear-stepper-common-reducer';
import { CheckoutLinearStepperGenericReducer } from './checkout-linear-stepper-generic-reducer';
import { CheckoutLinearStepperGenericState } from './checkout-linear-stepper-generic-state.model';
import { CheckoutLinearStepperReducer } from './checkout-linear-stepper-reducer';

export class CheckoutLinearStepperEhealthStandardReducer extends CheckoutLinearStepperGenericReducer implements CheckoutLinearStepperReducer {

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
      model: {
        product: null,
        steps: null,
        currentStep: null,
        priceChange: null
      },
      scroll: {
        scrollToElement: true
      },
      completed_steps: {
        insurance_holder: {
          visible: false,
          layout: null
        },
      },
      order: {
        number: null
      },
      payment: {
        promoCode: null
      },
      uncompleted_steps: [],
      uncompleted_step_titles: [],
      loading: true,
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
      case 'setUncompletedSteps':
        this.state = this.setUncompletedSteps(this.state, payload);
      break;
      case 'setCompletedStepsVisibility':
        this.state = this.setCompletedStepsVisibility(this.state, payload);
        break;
    }
    return super.common(actionName, payload);
  }

  private setContent(state: CheckoutLinearStepperGenericState, content: CheckoutTimCustomersContent): CheckoutLinearStepperGenericState {
    state = this.setContentHeader(state, content);
    state = this.setCostItemDetailsContent(state, content);
    state = this.setContentInsuranceHolder(state, content);
    state = this.setContentCompletedSteps(state, content);
    state = this.setUncompletedStepTitles(state, content);
    return state;
  }

  private setContentHeader(state: CheckoutLinearStepperGenericState, content: CheckoutTimCustomersContent): CheckoutLinearStepperGenericState {
    state.checkout_header.title = content.checkout_header.title;
    state.checkout_header.secondary_title = content.checkout_header.secondary_title;
    state.checkout_header.partner_text = content.checkout_header.partner_text;
    state.checkout_header.partner_icon = content.checkout_header.partner_icon;
    return state;
  }

  private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState, content: CheckoutTimCustomersContent): CheckoutLinearStepperGenericState {
    state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
    if (this.state.model && this.state.model.product) {
        state.cost_item.cost_detail_list = this.getCostItemDetails(this.state.model.product.code, state.cost_item.cost_detail_by_product);
      }
    return state;
  }

  private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutTimCustomersContent) {
    state = this.setContentInsuranceHolder(state, content);
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
}

private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutTimCustomersContent) {
  state.uncompleted_step_titles = [

    {
      name: 'address',
      title: content.card_contractor.title
    },
    {
      name: 'payment',
      title: content.card_payment.title
    }
  ];
  return state;
}

  private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutTimCustomersContent): CheckoutLinearStepperGenericState {
    state.completed_steps.insurance_holder.title = content.card_contractor.title;
    state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
    return state;
}

  private setOrder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state = this.setCostItemDetail(state, order);
    state = this.setCompletedSteps(state, order);
    state = this.setHeader(state, order);
    state = this.setScrollElementFromOrder(state, order);
    return state;
  }

  private setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    if (order.state === 'complete' && !window.matchMedia('(min-width: 576px)').matches) {
        state.cost_item = null;
        return state;
    }
    const costItemDetail = CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
    const priceFromState = state.cost_item.priceFromQuote;
    const priceFormatted = '€' + priceFromState.toFixed(2).replace('.', ',');
    costItemDetail.cost_item.price = priceFormatted;
    return costItemDetail;
  }

  private setCompletedSteps(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
    state = this.setHolder(state, order);
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

private getCostItemDetails(code: string, costdetails: any) {
    if (code && costdetails) {
      return costdetails[code.replace(/-/g, '')];
    }
    return null;
  }

private setUncompletedSteps(state: CheckoutLinearStepperGenericState, uncompleted_step_titles: any) {
  const uncompletedStepNames = uncompleted_step_titles.map(x => x.name);
  const allowedUncompletedSteps = ['address', 'payment'];
  const stepsFiltered = [];
  uncompletedStepNames.forEach(step => {
    if (allowedUncompletedSteps.some(allowedStep => step === allowedStep)) {
      const stepTitle = state.uncompleted_step_titles.find(s => s.name === step).title;
      switch (step) {
        case 'address':
          state.completed_steps.insurance_holder.visible = false;
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
    state.completed_steps.insurance_holder.visible = false;
    if (this.state.model.currentStep.name !== 'complete') {
        completed_steps.forEach(step => {
            switch (step.name) {
              case 'address':
              state.completed_steps.insurance_holder.visible = true;
              state.completed_steps.insurance_holder.layout = 'simple';
              break;
            }
        });
    }
    const existAddressStep = state.model.steps.some(step => step.name === 'address');
    if (!existAddressStep && this.state.model.currentStep.stepnum > 1 && this.state.model.currentStep.name !== 'complete') {
      state.completed_steps.insurance_holder.visible = true;
    }
    state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

}
