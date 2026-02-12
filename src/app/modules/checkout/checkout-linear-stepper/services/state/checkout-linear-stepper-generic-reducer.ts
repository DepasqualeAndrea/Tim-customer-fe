import { CheckoutLinearStepperGenericState } from './checkout-linear-stepper-generic-state.model';
import { CheckoutProduct, CheckoutProductCostItemType } from 'app/modules/checkout/checkout.model';
import { CheckoutStep, CheckoutStepPriceChange } from 'app/modules/checkout/checkout-step/checkout-step.model';
import { ResponseOrder } from 'app/core/models/order.model';
import { CheckoutStepPaymentPromoCode } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment.model';
import _ from 'lodash';

export class CheckoutLinearStepperGenericReducer {
    protected state: CheckoutLinearStepperGenericState;
    protected common(actionName: string, payload: any) {
        switch (actionName) {
            case 'setProduct':
                this.state = this.setProduct(this.state, payload);
                break;
            case 'setResolvedSteps':
                this.state = this.setResolvedSteps(this.state, payload);
                break;
            case 'setLoading':
                this.state = this.setLoading(this.state, payload);
                break;
            case 'setStepsAndCurrentStep':
                this.state = this.setStepsAndCurrentStep(this.state, payload.steps, payload.currentStep);
                break;
            case 'setResponseOrder':
                this.state = this.setOrderNumber(this.state, payload);
                this.state = this.setResponseOrder(this.state, payload);
                break;
            case 'setCostItem':
                this.state = this.setResponseOrder(this.state, payload);
                break;
            case 'setPromoCode':
                this.state = this.setPromoCode(this.state, payload);
                break;
            case 'setCurrentUrl':
                this.state = this.setCurrentUrl(this.state, payload);
                break;
            case 'setProperty':
                this.state = this.updateProperty(this.state, payload);
                break;
        }
        return this.state;
    }
    public setProduct(state: CheckoutLinearStepperGenericState
        , checkoutProduct: CheckoutProduct): CheckoutLinearStepperGenericState {
        state.model.product = checkoutProduct;
        return state;
    }
    public setResolvedSteps(state: CheckoutLinearStepperGenericState
        , resolvedSteps: CheckoutStep[]): CheckoutLinearStepperGenericState {
        state.resolvedSteps = resolvedSteps;
        return state;
    }
    public setLoading(state: CheckoutLinearStepperGenericState
        , loading: boolean): CheckoutLinearStepperGenericState {
        state.loading = loading;
        return state;
    }
    public setStepsAndCurrentStep(state: CheckoutLinearStepperGenericState
        , steps: CheckoutStep[]
        , currentStep: CheckoutStep): CheckoutLinearStepperGenericState {
        state.model.steps = steps;
        state.model.currentStep = currentStep;
        return state;
    }
    public setResponseOrder(state: CheckoutLinearStepperGenericState, responseOrder: ResponseOrder): CheckoutLinearStepperGenericState {
        // Object.assign(state.model.product.order, responseOrder);
        return state;
    }
    public setCostItem(state: CheckoutLinearStepperGenericState, priceChange: CheckoutStepPriceChange): CheckoutLinearStepperGenericState {
        if (priceChange) {

            state.model.product.costItems = (priceChange.costItems || state.model.product.costItems).map(item => {
                if (item.type === CheckoutProductCostItemType.total) {
                    return Object.assign({}, item, { amount: priceChange.current });
                }
                return item;
            });
        }
        state.model.priceChange = priceChange;
        return state;
    }
    public setPromoCode(state: CheckoutLinearStepperGenericState, promoCode: CheckoutStepPaymentPromoCode) {
        state.payment = Object.assign({}, state.payment);
        state.payment.promoCode = promoCode;
        return state;
    }
    private setOrderNumber(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
        state.order = Object.assign({}, state.order);
        state.order.number = order.number;
        return state;
    }
    private setCurrentUrl(state: CheckoutLinearStepperGenericState, payload: { url: string }): CheckoutLinearStepperGenericState {
        state.currentUrl = payload.url;
        return state;
    }
    private updateProperty(state: CheckoutLinearStepperGenericState, payload: {property: string, value: any}) {
        if (payload.property.includes('.')) {
          _.set(state, payload.property, payload.value)
        } else {
          state[payload.property] = payload.value;
        }
        return state;
      }
}
