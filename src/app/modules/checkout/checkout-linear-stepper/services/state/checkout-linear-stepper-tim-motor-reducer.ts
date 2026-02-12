import { ResponseOrder } from '@model';
import { CheckouTimMotorContent } from '../content/checkout-tim-motor-content.model';
import { CheckoutLinearStepperCommonReducer } from './checkout-linear-stepper-common-reducer';
import { CheckoutLinearStepperGenericReducer } from './checkout-linear-stepper-generic-reducer';
import { CheckoutLinearStepperGenericState } from './checkout-linear-stepper-generic-state.model';
import { CheckoutLinearStepperReducer } from './checkout-linear-stepper-reducer';

export class CheckoutLinearStepperTimMotor extends CheckoutLinearStepperGenericReducer implements CheckoutLinearStepperReducer {

  public getState() {
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
          }]
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
      case 'setCurrentUrl':
        this.state = this.setLayout(this.state, payload);
        break;
      case 'updateCostItem':
        this.state = this.setOrder(this.state, payload);
        break;
    }
    return super.common(actionName, payload);
  }

  private setContent(state: CheckoutLinearStepperGenericState, content: CheckouTimMotorContent): CheckoutLinearStepperGenericState {
    state = this.setCostItemDetailsContent(state, content);
    state = this.setContentHeader(state, content);
    return state;
  }

  private setContentHeader(state: CheckoutLinearStepperGenericState, content: CheckouTimMotorContent): CheckoutLinearStepperGenericState {
    state.checkout_header.title = content.checkout_header.title;
    state.checkout_header.partner_text = content.checkout_header.partner_text;
    state.checkout_header.partner_icon = content.checkout_header.partner_icon;
    return state;
  }

  private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState, content: CheckouTimMotorContent): CheckoutLinearStepperGenericState {
    state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
    state.cost_item.product_name = state.model.product && state.model.product.name;
    return state;
  }

  private setOrder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state = this.setHeader(state, order);
    state = this.setCostItemDetail(state, order);
    return state;
  }

  private setLayout(state: CheckoutLinearStepperGenericState, payload: { url: string }): CheckoutLinearStepperGenericState {
    if (payload.url && payload.url.includes('checkout/payment')) {
      state.layout = {
        container: '',
        header: 'full',
        completedSteps: 'none',
        uncompletedSteps: 'none',
        shoppingCart: 'full',
        costItemsDetails: 'full'
      }
    } else {
      state.layout = {
        container: 'full',
        header: 'full-row',
        completedSteps: 'none',
        uncompletedSteps: 'none',
        shoppingCart: 'none',
        costItemsDetails: 'none'
      }
    }
    return state;
  }

  private setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state.cost_item.product_name = order.line_items[0].variant.name;
    if (order.state === 'complete' && !window.matchMedia('(min-width: 576px)').matches) {
      state.cost_item = null;
      return state;
    }
    return CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
  }

  private setHeader(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    state.checkout_header = Object.assign({}, state.checkout_header);
    state.checkout_header.product_name = state.model.product.name;
    state.checkout_header.partner_name = state.model.product.originalProduct.provider.name;
    return state;
  }

}
