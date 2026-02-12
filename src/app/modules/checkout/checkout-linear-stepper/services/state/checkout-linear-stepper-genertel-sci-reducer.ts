import { CheckoutLinearStepperGenericReducer } from './checkout-linear-stepper-generic-reducer';
import { CheckoutLinearStepperReducer } from './checkout-linear-stepper-reducer';
import { CheckoutLinearStepperGenericState } from './checkout-linear-stepper-generic-state.model';
import { CheckoutStep } from 'app/modules/checkout/checkout-step/checkout-step.model';
import { CheckoutLinearStepperCommonReducer } from './checkout-linear-stepper-common-reducer';
import { ResponseOrder } from '@model';
import { CheckoutSciContent } from '../content/checkout-sci-content.model';

export class CheckoutLinearStepperGenertelSciReducer extends CheckoutLinearStepperGenericReducer implements CheckoutLinearStepperReducer {

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
      case 'setOrderChange':
        this.state = this.changeOrderNumber(this.state, payload);
        break;
    }
    return super.common(actionName, payload);
  }

  private setScrollElement(state: any, currentStep: CheckoutStep) {
    state.scroll.scrollToElement = false;
    if (currentStep.name !== 'address') {
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

  private setContent(state: CheckoutLinearStepperGenericState, content: CheckoutSciContent): CheckoutLinearStepperGenericState {
    return state;
  }

  // private setContentHeader(state: CheckoutLinearStepperGenericState, content: CheckoutSciContent): CheckoutLinearStepperGenericState {
  //   state.checkout_header.title = content.checkout_header.title;
  //   state.checkout_header.partner_text = content.checkout_header.partner_text;
  //   state.checkout_header.partner_icon = content.checkout_header.partner_icon;
  //   return state;
  // }

  // private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState, content: CheckoutSciContent): CheckoutLinearStepperGenericState {
  //   state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
  //   if (this.state.model && this.state.model.product) {
  //     const product = this.state.model.product;
  //     state.cost_item.cost_detail_list = CheckoutLinearStepperCommonReducer.getCostItemDetailsByProduct(product.code, state.cost_item.cost_detail_by_product);
  //   }
  //   return state;
  // }

  // private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutSciContent) {
  //   state = this.setContentInsuranceInfo(state, content);
  //   state = this.setContentInsuranceHolder(state, content);
  //   state = this.setContentSurvey(state, content);
  //   state.completed_steps = Object.assign({}, state.completed_steps);
  //   return state;
  // }

  // private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutSciContent) {
  //   state.uncompleted_step_titles = [
  //     {
  //       name: 'insurance-info',
  //       title: content.card_insured.title
  //     },
  //     {
  //       name: 'address',
  //       title: content.card_contractor.title
  //     },
  //     {
  //       name: 'survey',
  //       title: content.card_survey.title
  //     },
  //     {
  //       name: 'payment',
  //       title: content.card_payment.title
  //     }
  //   ];
  //   return state;
  // }

  // private setContentInsuranceInfo(state: CheckoutLinearStepperGenericState, content: CheckoutSciContent): CheckoutLinearStepperGenericState {
  //   state.completed_steps.insurance_info.title = content.card_insured.title;
  //   state.completed_steps.insurance_info.display_data[0].label = content.card_insured.package;
  //   state.completed_steps.insurance_info.display_data[1].label = content.card_insured.insured_subjects;
  //   return state;
  // }

  // private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutSciContent): CheckoutLinearStepperGenericState {
  //   state.completed_steps.insurance_holder.title = content.card_contractor.title;
  //   state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
  //   return state;
  // }
  // private setContentSurvey(state: CheckoutLinearStepperGenericState, content: CheckoutSciContent): CheckoutLinearStepperGenericState {
  //   state.completed_steps.insurance_survey.title = content.card_survey.title;
  //   state.completed_steps.insurance_survey.card_icon = content.card_survey.image;
  //   state.completed_steps.insurance_survey.state = content.card_survey.status;
  //   state.completed_steps.insurance_survey.description = content.card_survey.description;
  //   return state;
  // }

  private setOrder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    return state;
  }

  private changeOrderNumber(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    if (!!state.order && !!order) {
      state.order.number = order.number;
      state.model.product.orderId = order.number;
    }
    return state;
  }

  // private setHeader(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
  //   return state;
  // }

  // private setCompletedSteps(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
  //   state = this.setHeader(state, order);
  //   state = this.setInsured(state, order);
  //   state = this.setHolder(state, order);
  //   state = this.setSurvey(state, order);
  //   state.completed_steps = Object.assign({}, state.completed_steps);
  //   return state;
  // }

  private setInsured(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    return state;
  }

  private setHolder(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    return state;
  }

  private setSurvey(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    return state;
  }

  public setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    // state.cost_item.informative_set = state.model && state.model.product.code === 'ergo-mountain-gold'
    //   ? state.cost_item.informative_set_gold
    //   : state.cost_item.informative_set_silver;
    // if (order.state === 'complete') {
    //   state.cost_item = null;
    //   return state;
    // }
    // return CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
    return
  }

  private setUncompletedSteps(state: CheckoutLinearStepperGenericState, uncompletedSteps: any) {
    // const uncompletedStepNames = uncompletedSteps.map(x => x.name);
    // const allowedUncompletedSteps = ['insurance-info', 'address', 'survey', 'payment'];
    // const stepsFiltered = [];
    // uncompletedStepNames.forEach((step) => {
    //   if (allowedUncompletedSteps.some((allowedStep) => step === allowedStep)) {
    //     const stepTitle = state.uncompleted_step_titles.find(s => s.name === step).title;
    //     switch (step) {
    //       case 'address':
    //         state.completed_steps.insurance_holder.visible = false;
    //         stepsFiltered.push(stepTitle);
    //         break;
    //       case 'survey':
    //         state.completed_steps.insurance_survey.visible = false;
    //         stepsFiltered.push(stepTitle);
    //         break;
    //       case 'payment':
    //         stepsFiltered.push(stepTitle);
    //         break;
    //     }
    //   }
    // });
    // state.uncompleted_steps = Object.assign([], stepsFiltered);
    return state;
  }

  private setCompletedStepsVisibility(state: CheckoutLinearStepperGenericState, completed_steps: [{ name: string, stepnum: number }]) {
    // state.completed_steps.insurance_info.visible = false;
    // state.completed_steps.insurance_survey.visible = false;
    // state.completed_steps.insurance_holder.visible = false;
    // if (this.state.model.currentStep.name !== 'complete') {
    //   completed_steps.forEach(step => {
    //     switch (step.name) {
    //       case 'insurance-info':
    //         state.completed_steps.insurance_info.visible = true;
    //         break;
    //       case 'address':
    //         state.completed_steps.insurance_holder.visible = true;
    //         break;
    //       case 'survey':
    //         state.completed_steps.insurance_survey.visible = true;
    //         break;
    //     }
    //   });
    // }
    // const existAddressStep = state.model.steps.some(step => step.name === 'address');
    // if (!existAddressStep && this.state.model.currentStep.stepnum > 1 && this.state.model.currentStep.name !== 'complete') {
    //   state.completed_steps.insurance_holder.visible = true;
    // }
    // if (this.state.model.currentStep.stepnum === 1) {
    //   state.completed_steps.insurance_holder.visible = false;
    // }

    // state.completed_steps = Object.assign({}, state.completed_steps);
    return state;
  }

  getState() {
    return this.state;
  }

}