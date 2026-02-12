import { CheckoutLinearStepperGenericState } from './checkout-linear-stepper-generic-state.model';
import { ResponseOrder } from '@model';
import * as moment from 'moment';

export class CheckoutLinearStepperCommonReducer {

  public static setCostItemDetail(state: CheckoutLinearStepperGenericState, order: ResponseOrder): CheckoutLinearStepperGenericState {
    const totalWithoutAdjustment: number = order.item_total;
    const lineItem = order.line_items[0];
    const expirationDate = new Date(lineItem.expiration_date);
    const formattedExpirationDate = this.convertDateFormat(expirationDate);
    const startDate = new Date(lineItem.start_date);
    const formattedStartDate = this.convertDateFormat(startDate);
    const currencySymbol = order.currency === 'EUR' ? '€' : null;
    const formattedTotal = currencySymbol + order.total.toFixed(2).replace('.', ',');
    const discountValue = !!order.adjustment_total ? +order.adjustment_total : null;
    const formattedDiscountValue = !!discountValue ? currencySymbol + discountValue.toFixed(2).replace('.', ',') : null;
    const formattedOriginalTotal = currencySymbol + totalWithoutAdjustment.toFixed(2).replace('.', ',');
    const informativeSet = state.cost_item.informative_set;
    const informativeSetLink = state.model.product.originalProduct.information_package;
    let promotionName = '';
    state.cost_item.payment_frequency = lineItem.payment_frequency;
    if (!!state.payment && !!state.payment.promoCode && !!state.payment.promoCode.promotion_name) {
      promotionName = state.payment.promoCode.promotion_name;
    }

    state.cost_item = Object.assign({}, state.cost_item);
    if (!!informativeSet && !!informativeSetLink) {
      state.cost_item.informative_set = this.replaceInformationPackageLink(informativeSet, informativeSetLink);
    }
    state.cost_item.is_discount_container_visible = !!order.adjustment_total;
    state.cost_item.promo_title = state.cost_item.promo_prefix + ' ' + promotionName;
    if (!!state.cost_item.recurrent_installment_unit) {
      state.cost_item.price = currencySymbol + (order.total * state.cost_item.recurrent_installment_unit).toFixed(2).replace('.', ',');
      state.cost_item.recurrent_installment_price = formattedTotal;
    } else {
      state.cost_item.price = formattedTotal;
    }
    state.cost_item.discount = formattedDiscountValue;
    state.cost_item.original_price = formattedOriginalTotal;
    state.cost_item.policy_startDate = formattedStartDate;
    state.cost_item.policy_endDate = formattedExpirationDate;
    state.cost_item.visible = true;
    if (!!state.cost_item.cost_detail_by_product) {
      state.cost_item.product_name = state.model.product.name;
      state.cost_item.cost_detail_list = this.getCostItemDetailsByProduct(state.model.product.code, state.cost_item.cost_detail_by_product);
    } else if (!!state.cost_item.cost_detail_by_variant) {
      const product = state.model.product;
      const variantSku = product.originalProduct.variants.find(variant => variant.id === product.variantId).sku;
      state.cost_item.product_name = product.name;
      state.cost_item.cost_detail_list = this.getCostItemDetailsByVariant(variantSku, state.cost_item.cost_detail_by_variant);
    } else if (!!state.cost_item.const_detail_coverage_options && (state.model.product.name === 'VirtualHospital.blue - Annuale' || 'VirtualHospital.blue - Mensile')) {
      state.cost_item.product_name = state.model.product.originalProduct.title;
    }
    return state;
  }

  public static convertDateFormat(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }

  public static convertDateAssuranceFormat(date: Date): string {
    const dateMoment = moment(date).subtract(1, 'd');
    const assuranceDate = new Date(dateMoment.format());
    return `${this.convertDateFormat(assuranceDate)} 24:00`;
  }

  public static getCostItemDetailsByProduct(code: string, costdetails: any) {
    if (code && costdetails) {
      return costdetails[code.replace(/-/g, '')];
    }
    return null;
  }

  public static getCostItemDetailsByVariant(sku: string, costdetails: any) {
    if (sku && costdetails) {
      return costdetails[sku.toLowerCase()];
    }
    return null;
  }

  public static replaceInformationPackageLink(text: string, informationPackage: string) {
    return text.replace(/http:\/\/\{\{\s*information_package\s*\}\}/gi, informationPackage);
  }
  public static setCostTimDiscount(state: CheckoutLinearStepperGenericState, order: ResponseOrder) {
    if (order.common_original_total && order.common_adjustment_total) {
      const totalWithoutAdjustment: number = order.common_original_total;
      const currencySymbol = order.currency === 'EUR' ? '€' : null;
      const discountValue = !!order.common_adjustment_total ? +order.common_adjustment_total : null;
      const formattedDiscountValue = !!discountValue ? currencySymbol + discountValue.toFixed(2).replace('.', ',') : null;
      const formattedOriginalTotal = currencySymbol + totalWithoutAdjustment.toFixed(2).replace('.', ',');
      state.cost_item.discount = formattedDiscountValue;
      state.cost_item.original_price = formattedOriginalTotal;
      return state;
    }
    return state;
  }




}
