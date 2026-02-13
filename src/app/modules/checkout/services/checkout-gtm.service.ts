import { ProductData } from './../checkout.model';
import {Injectable} from '@angular/core';
import {CheckoutModule} from '../checkout.module';
import {CheckoutStep} from '../checkout-step/checkout-step.model';
import {GtmHandlerService} from 'app/core/services/gtm/gtm-handler.service';
import * as moment from 'moment';
import {DataService} from '@services';
import { gtm_settings } from 'app/core/models/gtm/gtm-settings.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGtmService {
  private gtm_stepEventMapper = [
    {stepName: 'insurance-info', eventName: 'preventivo calcolato', fn: this.allDataSet},
    {stepName: 'address', eventName: 'address', fn: this.allDataSet},
    {stepName: 'survey', eventName: 'survey', fn: this.eventUpdatePush},
    {stepName: 'payment', eventName: 'payment', fn: this.eventUpdatePush},
    {stepName: 'confirm', eventName: 'confirm', fn: this.lastUpdatePush}
  ];

  // fn to be executed as soon as we get to 'stepName'
  private gtmGA4_stepEventMapper = [
    {stepName: 'insurance-info', eventName: 'add_to_cart', fn: this.addToCartEvent},
    {stepName: 'address', eventName: 'begin_checkout', fn: this.beginCheckoutEvent},
    {stepName: 'survey', eventName: 'add_shipping_info', fn: this.addShippingInfoEvent},
    {stepName: 'payment', eventName: 'page_view', fn: this.fillPageView},
    {stepName: 'complete', eventName: 'purchase', fn: this.purchaseEvent}
  ];
  private step: CheckoutStep;

  constructor(
    private gtmService: GtmHandlerService,
    private dataService: DataService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService,
  ) {
  }

  handleGtm(step: CheckoutStep) {
    if (gtm_settings.type === 'GA4') {
      this.handleGA4(step);
    } else {
      if (!step) {
        console.warn('Cannot push GTM step for this step because no step has been set');
        return;
      }
      this.step = step;
      if (this.gtm_stepEventMapper.map(value => value.stepName).includes(this.step.name)) {
        const data: { eventName: string, fn: Function } = this.gtm_stepEventMapper.find(value => value.stepName === this.step.name);
        const productData: any = Object.assign({}, this.step.product, this.dataService.getResponseOrder() || {}, {gtmEvent: data.eventName});
        data.fn.apply(this, [productData]);
      }
    }
  }

  private handleGA4(step: CheckoutStep) {
    if (!step) {
      console.warn('Cannot push GTM step for this step because no step has been set');
      return;
    }
    this.step = step;
    if (this.gtmGA4_stepEventMapper.map(value => value.stepName).includes(this.step.name)) {
      const data: { eventName: string, fn: Function } = this.gtmGA4_stepEventMapper.find(value => value.stepName === this.step.name);
      const productData: any = Object.assign({}, this.step.product, this.dataService.getResponseOrder() || {});
      data.fn.apply(this, [productData]);
    }
  }

  private addToCartEvent(productData: ProductData) {
    const product = this.extractOriginalProduct(productData);
    this.gtmService.multiPush(
      this.gtmEventGeneratorService.updateDataLayerBaseEvent(product),
      this.gtmEventGeneratorService.resetEcommerce(),
      this.gtmEventGeneratorService.fillAddToCartEvent(productData)
    );
  }

  private fillPageView(productData: ProductData) {
    const product = this.extractOriginalProduct(productData);
    this.gtmService.multiPush(
      this.gtmEventGeneratorService.updateDataLayerBaseEvent(product),
    );
  }

  private beginCheckoutEvent(productData: ProductData) {
    const product = this.extractOriginalProduct(productData);
    this.gtmService.multiPush(
      this.gtmEventGeneratorService.updateDataLayerBaseEvent(product),
      this.gtmEventGeneratorService.resetEcommerce(),
      this.gtmEventGeneratorService.fillBeginCheckoutEvent(productData)
    );
  }

  private addShippingInfoEvent(productData: ProductData) {
    const product = this.extractOriginalProduct(productData);
    this.gtmService.multiPush(
      this.gtmEventGeneratorService.updateDataLayerBaseEvent(product),
      this.gtmEventGeneratorService.resetEcommerce(),
      this.gtmEventGeneratorService.fillAddShippingInfoEvent(productData)
    );
  }

  private purchaseEvent(productData: ProductData) {
    const product = this.extractOriginalProduct(productData);
    const payload = (productData as any).promoCode;
    this.gtmService.multiPush(
      this.gtmEventGeneratorService.updateDataLayerBaseEvent(product),
      this.gtmEventGeneratorService.resetEcommerce(),
      this.gtmEventGeneratorService.fillPurchaseEvent(productData, payload)
    );
  }

  private extractOriginalProduct(productData: ProductData) {
    const state = productData.state;
    const product = Object.assign({}, productData.originalProduct, {state});
    return product;
  }

  private allDataSet(product: any) {
    this.defineGTMDataLayer(product);
    this.gtmService.push(false);
  }

  private eventUpdatePush(update: { gtmEvent: string }) {
    this.gtmService.setPageInfoIntoDataLayer();
    this.gtmService.getModelHandler().overwrite({event: update.gtmEvent});
    this.gtmService.push(false);
  }

  private lastUpdatePush(update: { gtmEvent: string }) {
    this.gtmService.setPageInfoIntoDataLayer();
    this.gtmService.getModelHandler().overwrite({event: update.gtmEvent});
    this.gtmService.push(true);
  }

  private defineGTMDataLayer(product: any) {
    this.gtmService.setPageInfoIntoDataLayer();
    const product_startDate = moment(product.startDate);
    const product_endDate = moment(product.endDate);
    let categoryPage: string = product.order.line_items[0].variant.product_properties.category;
    if (!categoryPage || categoryPage.length === 0) {
      categoryPage = product.originalProduct.category || '';
    }

    const phoneBrand: string = product.order.line_items[0].insurance_info.covercare_brand || '';
    const phoneModel: string = product.order.line_items[0].insurance_info.covercare_model || '';

    this.gtmService.getModelHandler().overwrite({
      productName: product.name,
      categoryPage: categoryPage,
      daysCount: isNaN(product.duration) ? '0' : product.duration,
      peopleCount: product.quantity,
      price: product.order.line_items[0].price.toString() || '0',
      transactionTotal: product.order.total.toString() || '0',
      transactionId: product.order.number,
      startDate: product_startDate.isValid() ? product_startDate.format('YYYY-MM-DD') : '',
      endDate: product_endDate.isValid() ? product_endDate.format('YYYY-MM-DD') : '',
      phoneModel: phoneModel,
      phoneBrand: phoneBrand,
      transactionProducts: this.createTransactionProduct(product),
      event: product.gtmEvent
    });

  }

  private createTransactionProduct(product: any): { [key: string]: any }[] {
    const transactinoProducts: any[] = [];
    transactinoProducts.push({
      sku: product.order.line_items[0].variant.sku,
      category: product.originalProduct.category,
      name: product.name,
      price: product.order.line_items[0].price.toString() || '0',
      quantity: product.quantity
    });
    return transactinoProducts;
  }
}
