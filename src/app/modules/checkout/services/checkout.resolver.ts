import { NypIadOrderService } from '@NYP/ngx-multitenant-core';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Image, ResponseOrder } from '@model';
import { CheckoutService, DataService } from '@services';
import { PREVENTIVATORE_URL_KEY } from 'app/modules/preventivatore/preventivatore/preventivatore.component';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { KenticoTranslateService } from '../../kentico/data-layer/kentico-translate.service';
import { CheckoutRouteInput } from '../checkout-routing.model';
import { CheckoutStep } from '../checkout-step/checkout-step.model';
import { CheckoutProduct, CheckoutProductCostItem } from '../checkout.model';
import { ProductCheckoutStepService } from '../product-checkout-step-controllers/product-checkout-step.service';
import { CheckoutStepService } from './checkout-step.service';
import { CostLineGeneratorService } from './cost-line-generators/cost-line-generator.service';
import { costLineItemGeneratorFactory } from './cost-line-generators/line-generator-factory';

export const CHECKOUT_OPENED = 'CHECKOUT_OPENED_RESOLVER';
const ORDER_LOCALSTORAGE_KEY = 'order';

@Injectable()
export class CheckoutResolver  {
  constructor(
    private dataService: DataService,
    private router: Router,
    private location: Location,
    private toastrService: ToastrService,
    private checkoutService: CheckoutService,
    private kenticoTranslateService: KenticoTranslateService,
    private productCheckoutStepService: ProductCheckoutStepService,
    private costLineGeneratorService: CostLineGeneratorService,
    private nypIadOrderService: NypIadOrderService,
    private checkoutStepService: CheckoutStepService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CheckoutRouteInput> {
    const yin = this.dataService.Yin;

    if (!!yin?.orderNumber) {
      return this.nypIadOrderService.getOrder(yin.orderNumber).
        pipe(
          tap((order: any) => {
            if (!order.field_to_recover) {
              alert('No data has been provided from the operator.');
              throw new Error('No data has been provided from the operator.');
            };

            this.dataService.fieldsToRecover = order.fieldToRecover ?? order.field_to_recover;
            this.dataService.loadFieldToRecover();
            this.dataService.price = order.item_total;
            this.dataService.CheckoutLinearStepperService__ORDER = this.dataService.requestOrder;

            this.dataService.setResponseOrder(order);
          }),
          mergeMap((order: any) => {
            const ongoingCheckoutData = this.checkoutService.getOngoingCheckoutData(false);
            return this.resolveCheckoutRouteInputFromOrder(order, ongoingCheckoutData)
          }),
          /*  tap((coseDiSopra: any) => {
             this.checkoutStepService.completeStep(
               { "step": { "name": "survey", "stepnum": 3, "completed": false, "previous": { "name": "address", "stepnum": 2, "completed": true, "previous": { "name": "insurance-info", "stepnum": 1, "completed": true } } }, "confirm": false } as any
             );
           }), */
        );

    }

    try {
      const ongoingCheckoutData = this.checkoutService.getOngoingCheckoutData(false);
      if (ongoingCheckoutData && !ongoingCheckoutData.fromQuotator) {
        this.checkoutService.cancelOngoingCheckout();
      }
      if (ongoingCheckoutData) {
        this.dataService.setResponseOrder(ongoingCheckoutData.responseOrder);
        this.dataService.setProduct(ongoingCheckoutData.product);
        this.dataService.setOrderAttributes(ongoingCheckoutData.quotationOrderAttributes);
      }

      window.onbeforeunload = () => {
        localStorage.removeItem(CHECKOUT_OPENED);
      };

      const orderFromLocalStorage = JSON.parse(localStorage.getItem(ORDER_LOCALSTORAGE_KEY))
      const checkoutOpened = !!localStorage.getItem(PREVENTIVATORE_URL_KEY) && !!localStorage.getItem(CHECKOUT_OPENED)

      if (!!orderFromLocalStorage && checkoutOpened) {
        return this.resolveCheckoutRouteInputFromOrder(orderFromLocalStorage, ongoingCheckoutData)
      } else {
        const order = this.dataService.getResponseOrder();
        return this.resolveCheckoutRouteInputFromOrder(order, ongoingCheckoutData)
      }
    } catch (e) {
      console.error(e);
      this.kenticoTranslateService.getItem<any>('toasts.cannot_continue_checkout').pipe(take(1)).subscribe(
        toastMessage => this.toastrService.error(toastMessage.value)
      );
      this.router.navigate(['/']);
    }
  }

  private resolveCheckoutRouteInputFromOrder(order: ResponseOrder, ongoingCheckoutData) {
    return this.loadCostItemsLabel(order)
      .pipe(switchMap((labelCostItems) => {
        const refreshUrl: string = localStorage.getItem(PREVENTIVATORE_URL_KEY);
        const opened: string = localStorage.getItem(CHECKOUT_OPENED);
        if (refreshUrl && opened) {
          localStorage.removeItem(ORDER_LOCALSTORAGE_KEY)
          localStorage.removeItem(PREVENTIVATORE_URL_KEY);
          localStorage.removeItem(CHECKOUT_OPENED);
          const indexOfSlash = refreshUrl.indexOf('/');
          if (indexOfSlash >= 0) {
            this.router.navigateByUrl(refreshUrl);
          } else {
            const indexOfsemicolon = refreshUrl.indexOf(';');
            if (indexOfsemicolon < 0) {
              this.router.navigate(['/']);
            } else {
              const baseRefreshUrl = refreshUrl.substring(0, indexOfsemicolon);
              let code = refreshUrl.substring(indexOfsemicolon + 1);
              code = code.substring(code.indexOf('=') + 1);
              this.router.navigate([baseRefreshUrl, { code }]);
            }
          }
          return null;
        }

        const responseOrder: ResponseOrder = this.dataService.getResponseOrder();
        const unknownProduct: any = this.dataService.getResponseProduct();
        responseOrder.payment_methods = unknownProduct.payment_methods;
        const product: CheckoutProduct = this.computeCheckoutProduct(unknownProduct, responseOrder, labelCostItems);
        const steps: CheckoutStep[] = this.computeSteps(product, responseOrder);

        localStorage.setItem(CHECKOUT_OPENED, 'opened');
        const inputData = {
          steps,
          product,
          ongoingRequestOrder: (ongoingCheckoutData || {} as any).requestOrder,
          responseOrder: responseOrder
        };
        this.productCheckoutStepService
          .getProductCheckoutController()
          .getProductCheckoutStateController()
          .setCheckoutRouteInput(inputData);
        return of(inputData);
      }));
  }

  findImageByTypes(images: Image[], ...types): Image {
    for (let i = 0; i < types.length; i++) {
      const image = this.findImageByType(images, types[i]);
      if (image) {
        return image;
      }
    }
  }

  findImageByType(images: Image[], type: string): Image {
    return images.find(image => image.image_type === type);
  }

  private loadCostItemsLabel(order: ResponseOrder): Observable<string[]> {
    return this.costLineGeneratorService
      .getCostItemLabels(order);
  }

  private computeSteps(product: CheckoutProduct, responseOrder: ResponseOrder): CheckoutStep[] {
    let stateIndex = responseOrder.checkout_steps.findIndex(step => step === responseOrder.state);
    if (localStorage.getItem('stateCheckout')) {
      stateIndex = responseOrder.checkout_steps.findIndex(step => step === localStorage.getItem('stateCheckout'));
      localStorage.removeItem('stateCheckout');
    }
    return responseOrder.checkout_steps.map((step, idx) => {
      return ({
        name: step.replace('_', '-'),
        stepnum: idx + 1,
        product,
        completed: idx < stateIndex
      });
    });
  }

  private computeCheckoutProduct(unknownProduct: any, responseOrder: ResponseOrder, labelCostItems: string[]): CheckoutProduct {
    const lineItem = responseOrder.line_items[0];
    const startDate = lineItem.start_date && moment(lineItem.start_date).toDate();
    const endDate = lineItem.expiration_date && moment(lineItem.expiration_date).toDate();
    const duration = lineItem.variant.option_values.length && lineItem.variant.option_values[0].duration || moment(endDate).diff(startDate, 'days');
    const durationUnit = lineItem.variant.option_values.length && lineItem.variant.option_values[0].option_type_name || 'days';
    return {
      id: unknownProduct.id,
      orderId: responseOrder.number,
      lineItemId: lineItem.id,
      variantId: lineItem.variant.id,
      code: unknownProduct.product_code,
      name: unknownProduct.name,
      image: this.computeImage(unknownProduct),
      currency: { code: responseOrder.currency },
      quantity: lineItem.quantity,
      shipmentQuantity: lineItem.shipmentQuantity,
      extra: Object.assign({}, responseOrder.extra),
      costItems: this.computeCostItems(unknownProduct, responseOrder, labelCostItems),
      order: Object.assign({}, responseOrder),
      questions: Object.assign({}, unknownProduct.questions),
      originalProduct: unknownProduct,
      paymentMethods: Object.assign([], responseOrder.payment_methods),
      duration,
      durationUnit,
      startDate,
      endDate
    };
  }

  private computeImage(unknownProduct: any): string {
    const img = this.findImageByTypes(unknownProduct.images, 'fp_image', 'default', 'common_image');
    return img && ('' + (img.small_url || img.product_url || img.original_url || img.mini_url || img.large_url));
  }

  private computeCostItems(product: any, responseOrder: ResponseOrder, labelCostItems: string[]): CheckoutProductCostItem[] {
    const costLineItemGenerator = costLineItemGeneratorFactory(product, responseOrder);
    return costLineItemGenerator.computeCostItems(labelCostItems);
  }
}

