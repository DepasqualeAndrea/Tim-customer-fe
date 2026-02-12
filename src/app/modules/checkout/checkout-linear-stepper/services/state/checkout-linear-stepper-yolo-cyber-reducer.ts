import { ResponseOrder } from "@model";
import { CheckoutStep } from "app/modules/checkout/checkout-step/checkout-step.model";
import { CheckoutYoloCyberContent } from "../content/checkout-yolo-cyber-content.model";
import { CheckoutLinearStepperCommonReducer } from "./checkout-linear-stepper-common-reducer";
import { CheckoutLinearStepperGenericReducer } from "./checkout-linear-stepper-generic-reducer";
import { CheckoutLinearStepperGenericState } from "./checkout-linear-stepper-generic-state.model";
import { CheckoutLinearStepperReducer } from "./checkout-linear-stepper-reducer";


export class CheckoutLinearStepperYoloCyberReducer extends CheckoutLinearStepperGenericReducer
implements CheckoutLinearStepperReducer {

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
                    display_data: [{
                        label: null,
                        value: null
                    }, {
                        label: null,
                        value: null
                    }],
                    icon_technical_contact: null,
                    title_technical_contact: null,
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
                product: null, steps: []
                , currentStep: null, priceChange: null
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
            case 'setCompany':
                this.state = this.setCompany(this.state, payload);
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
    private setContent(state: CheckoutLinearStepperGenericState
        , content: CheckoutYoloCyberContent): CheckoutLinearStepperGenericState {
        state = this.setCostItemDetailsContent(state, content);
        state = this.setContentCompletedSteps(state, content);
        state = this.setContentHeader(state, content);
        state = this.setUncompletedStepTitles(state, content);
        return state;
    }
    private setContentHeader(state: CheckoutLinearStepperGenericState
        , content: CheckoutYoloCyberContent): CheckoutLinearStepperGenericState {
        state.checkout_header.title = content.checkout_header.title;
        state.checkout_header.partner_text = content.checkout_header.partner_text;
        state.checkout_header.partner_icon = content.checkout_header.partner_icon;
        return state;
    }

    private setCostItemDetailsContent(state: CheckoutLinearStepperGenericState
        , content: CheckoutYoloCyberContent): CheckoutLinearStepperGenericState {
        state.cost_item = Object.assign({}, state.cost_item, content.cost_item);
        if (this.state.model && this.state.model.product) {
            state.cost_item.cost_detail_list = this.getCostItemDetails(this.state.model.product.code, state.cost_item.cost_detail_by_product);
        }
        return state;
    }

    private getCostItemDetails(code: string, costdetails: any) {
        if (code && costdetails) {
            return costdetails[code.replace(/-/g, '')];
        }
        return null;
    }

    private setContentCompletedSteps(state: CheckoutLinearStepperGenericState, content: CheckoutYoloCyberContent) {
        state = this.setContentInsuranceInfo(state, content);
        state = this.setContentInsuranceHolder(state, content);
        state = this.setContentSurvey(state, content);
        state.completed_steps = Object.assign({}, state.completed_steps);
        return state;
    }

    private setUncompletedStepTitles(state: CheckoutLinearStepperGenericState, content: CheckoutYoloCyberContent) {
        state.uncompleted_step_titles = [
            {
                name: 'insurance-info',
                title: content.card_company.title
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

    private setContentInsuranceInfo(state: CheckoutLinearStepperGenericState, content: CheckoutYoloCyberContent): CheckoutLinearStepperGenericState {
        state.completed_steps.insurance_info.display_data[0].label = content.card_company.revenue;
        state.completed_steps.insurance_info.display_data[1].label = content.card_company.payment;
        state.completed_steps.insurance_info.icon_technical_contact = content.card_company.icon_technical_contact;
        state.completed_steps.insurance_info.title_technical_contact = content.card_company.title_technical_contact;
        return state;
    }
    private setContentInsuranceHolder(state: CheckoutLinearStepperGenericState, content: CheckoutYoloCyberContent): CheckoutLinearStepperGenericState {
        state.completed_steps.insurance_holder.title = content.card_contractor.title;
        state.completed_steps.insurance_holder.card_icon = content.card_contractor.image;
        return state;
    }
    private setContentSurvey(state: CheckoutLinearStepperGenericState, content: CheckoutYoloCyberContent): CheckoutLinearStepperGenericState {
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
        state = this.setCompany(state, order);
        return state;
    }
    private setHeader(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
        state.checkout_header = Object.assign({}, state.checkout_header);
        state.checkout_header.product_name = state.model.product.name;
        state.checkout_header.partner_name = state.model.product.originalProduct.provider.name;
        return state;
    }


    private setCompany(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
        const lineItem = order.line_items[0];
        const displayData = state.completed_steps.insurance_info.display_data;
        const methodPayment = lineItem.payment_frequency.includes('M') ? 'Mensile' : lineItem.payment_frequency.includes('Y') ? 'Annuale' : null;
        const revenueRange = lineItem.variant.option_values.find(pres => pres.option_type_name === 'maximal').presentation === '1000000' ? 'Fino a 1.000.000 €' :
                             lineItem.variant.option_values.find(pres => pres.option_type_name === 'maximal').presentation === '5000000' ? 'Da 1.000.001 € a 5.000.000 €' : 'Da 5.000.001 € a 20.000.000 €';
        displayData[0].value = revenueRange;
        displayData[1].value = methodPayment;
        state.completed_steps.insurance_info.it_contact = lineItem.insurance_info.it_contact;
        state.completed_steps.insurance_info.title = state.model.product.name
        state.completed_steps.insurance_info.product_icon = state.model.product.image;
        return state;
    }

    private setCompletedSteps(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
        state = this.setCompany(state, order);
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
            order.bill_address.company,
            order.bill_address.vatcode,
            order.bill_address.address1 + ', ' + order.bill_address.zipcode + ' ' + order.bill_address.city,
        ];
        return state;
    }
    private setSurvey(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
        return state;
    }
    private setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
        if (order.state === 'complete' && !window.matchMedia('(min-width: 576px)').matches) {
            state.cost_item = null;
            return state;
        }
        const AnnualPricetoMonth = order.line_items[0].price*12;
        Object.assign(state.cost_item, {paymentDuration : 'cyber-cart'})
        if (order.adjustment_total == '0.0') {
            if(order.line_items[0].payment_frequency === 'M'){
                state.cost_item.price_frequency_monthly = (order.currency === 'EUR' ? '€' : null) + Number(order.line_items[0].price).toFixed(2).replace('.', ',');
                state.cost_item.price_frequency_annual = (order.currency === 'EUR' ? '€' : null) + Number(AnnualPricetoMonth).toFixed(2).replace('.', ',');
            }
            else{
                state.cost_item.price_frequency_annual = (order.currency === 'EUR' ? '€' : null) + Number(order.line_items[0].price).toFixed(2).replace('.', ',');
            }
        }
        else {
            if(order.line_items[0].payment_frequency === 'M'){
                state.cost_item.price_frequency_monthly = (order.currency === 'EUR' ? '€' : null) + Number(order.total).toFixed(2).replace('.', ',');
                const AnnualPricetoMonth = order.total*12;
                state.cost_item.price_frequency_annual = (order.currency === 'EUR' ? '€' : null) + Number(AnnualPricetoMonth).toFixed(2).replace('.', ',');
            }
            else{
                const AnnualPricetoMonth = order.total;
                state.cost_item.price_frequency_annual = (order.currency === 'EUR' ? '€' : null) + Number(AnnualPricetoMonth).toFixed(2).replace('.', ',');
            }
          }
        return CheckoutLinearStepperCommonReducer.setCostItemDetail(state, order);
    }

    private setUncompletedSteps(state: CheckoutLinearStepperGenericState, uncompleted_step_titles: any) {
        const uncompletedStepNames = uncompleted_step_titles.map(x => x.name);
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
