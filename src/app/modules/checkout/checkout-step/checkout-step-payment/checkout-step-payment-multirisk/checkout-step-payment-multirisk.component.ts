import { ToastrService } from 'ngx-toastr';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheckoutStepService } from '../../../services/checkout-step.service';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { AuthService, CheckoutService, DataService, UserService } from '@services';
import { CheckoutStepPaymentComponentAbstract } from '../checkout-step-payment-abstract.component';
import { Observable, Subscription, zip } from 'rxjs';
import { LineFirstItem, LineItemsAttributes, RequestOrder, ResponseOrder } from '@model';
import { catchError, map, take } from 'rxjs/operators';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { CheckoutStepPaymentPromoCode } from '../checkout-step-payment.model';
import { CheckoutProductCostItem, CheckoutProductCostItemType } from '../../../checkout.model';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { BlockUIService } from 'ng-block-ui';
import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { CheckoutLinearStepperService } from "../../../checkout-linear-stepper/services/checkout-linear-stepper.service";
import { untilDestroyed } from "ngx-take-until-destroy";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import * as moment from 'moment';
import { NypCheckoutService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-step-payment-multirisk',
  templateUrl: './checkout-step-payment-multirisk.component.html',
  styleUrls: ['./checkout-step-payment-multirisk.component.scss']
})
export class CheckoutStepPaymentMultiriskComponent extends CheckoutStepPaymentComponentAbstract implements OnInit, OnDestroy {

  form: FormGroup;
  modalPayment: string = '';
  hidePromoCode: boolean;
  private promoSubscription: Subscription;
  collapsePaymentMethodsList = true;
  paymentChoice;
  minActivationDate: any;

  constructor(
    checkoutStepService: CheckoutStepService,
    checkoutService: CheckoutService,
    nypCheckoutService: NypCheckoutService,
    userService: UserService,
    nypUserService: NypUserService,
    dataService: DataService,
    authService: AuthService,
    componentFeaturesService: ComponentFeaturesService,
    private kenticoTranslateService: KenticoTranslateService,
    toastrService: ToastrService,
    braintree3DSecurePaymentService: Braintree3DSecurePaymentService,
    blockUIService: BlockUIService,
    loaderService: LoaderService,
    gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService,
    gtmHandlerService: GtmHandlerService,
    private checkoutLinearStepperService: CheckoutLinearStepperService,
    public route: ActivatedRoute) {
    super(checkoutStepService,
      checkoutService,
      nypCheckoutService,
      userService,
      nypUserService,
      dataService,
      authService,
      componentFeaturesService,
      toastrService,
      braintree3DSecurePaymentService,
      blockUIService,
      loaderService,
      gtmEventGeneratorService,
      gtmHandlerService,
      route);
  }


  ngOnInit() {
    super.ngOnInit();
    this.handlePromoCodeApplied();
    this.getHidePromoCode();

    this.form = new FormGroup({
      activationDate: new FormControl('', Validators.required),
    });

    this.minActivationDate = {
      year: +moment().format('YYYY'),
      month: +moment().format('MM'),
      day: +moment().add(1, 'd').format('DD')
    }
  }

  closeCollapseAfterAddingPm() {
    this.collapsePaymentMethodsList = true;
  }

  onPaymentChoice(event) {
    this.paymentChoice = event.target.value;
  }

  onAddNewPm() {
    this.collapsePaymentMethodsList = !this.collapsePaymentMethodsList;
    this.paymentChoice = null;
  }

  private handlePromoCodeApplied() {
    this.promoSubscription = this.checkoutStepService.checkoutCouponApplied$.subscribe(promo => {
      if (!this.product || !this.product.costItems || !this.product.order || !this.product.order.number)
        return;

      const orderNumber = this.product.order.number;
      const orderObs: Observable<ResponseOrder> = this.nypCheckoutService.getOrder(orderNumber);
      const contentObs: Observable<string> = this.kenticoTranslateService.getItem<string>('checkout.promo_prefix.value');

      zip(orderObs, contentObs)
        .pipe(
          map<[ResponseOrder, string], { content: string, response: ResponseOrder }>(value => { return { response: value[0], content: value[1] } })
        ).subscribe(value => {
          this.updateOrderWithPromo(promo, value.response, value.content);
        });

    });
  }

  private updateOrderWithPromo(promo: CheckoutStepPaymentPromoCode, responseOrder: ResponseOrder, prefix: string) {
    this.product.order = responseOrder;
    const newItems: any = this.createPromoItems(promo, responseOrder, prefix);
    this.product.costItems.splice(
      this.product.costItems.findIndex((item) => item.type === CheckoutProductCostItemType.total), 1,
      newItems.discount, newItems.total
    );

    this.checkoutStepService.afterCouponApplied();
  }

  private createPromoItems(promo: CheckoutStepPaymentPromoCode, responseOrder: ResponseOrder, prefix: string) {
    // create discount item
    const formattedPromoName = !!promo.promotion_name ? prefix + ' ' + promo.promotion_name : prefix;
    const promoAmount: number = !!responseOrder.adjustment_total ? +(+responseOrder.adjustment_total).toFixed(2) : null;
    const discountItem: CheckoutProductCostItem = this.createCostItem(formattedPromoName, promoAmount, CheckoutProductCostItemType.discount);

    // prepare to calculate new total
    const currentTotalArray = this.getCostItemsByType(CheckoutProductCostItemType.total);
    const costItemsWithDiscount: CheckoutProductCostItem[] = this.getCostItemsByType(CheckoutProductCostItemType.regular);
    costItemsWithDiscount.unshift(discountItem);

    // define total values
    let totalName: string = 'Totale';
    // for each costItem, get its total by mutiplying amount with period and insuranced
    let total: number = this.checkoutStepService.recalculateCostItems(costItemsWithDiscount, true, true);

    if (currentTotalArray.length === 1) {
      totalName = currentTotalArray[0].name || 'Totale';
    }

    const totalItem: CheckoutProductCostItem = this.createCostItem(totalName, total, CheckoutProductCostItemType.total);

    return {
      discount: discountItem,
      total: totalItem
    }
  }
  private createCostItem(name: string, amount: number, type: CheckoutProductCostItemType): CheckoutProductCostItem {
    return {
      amount: amount,
      name: name,
      type: type,
      multiplicator: 1,
      value: null
    }
  }
  private getCostItemsByType(type: CheckoutProductCostItemType): CheckoutProductCostItem[] {
    if (!this.product || !this.product.costItems) return [];
    return this.product.costItems.filter(item => item.type === type);
  }

  getHidePromoCode() {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('hide-promo-code');
    this.hidePromoCode = this.componentFeaturesService.isRuleEnabled();

    const constraints = this.componentFeaturesService.getConstraints().get('products');
    if (!!constraints) {
      this.hidePromoCode = constraints.some((product) => this.currentStep.product.code.startsWith(product));
    }
  }
  ngAfterViewInit() {
    if (this.route.snapshot.parent.routeConfig.path === 'checkout') {
      this.checkoutLinearStepperService.componentFactories$
        .pipe(untilDestroyed(this), take(1)).subscribe(componentFactories => {
          this.createComponentsFromComponentFactories(componentFactories, this.currentStep.product.code);
        });

      this.checkoutLinearStepperService.state$.pipe(untilDestroyed(this)).subscribe(state => {
        this.updateComponentProperties(state);
      });
      this.checkoutLinearStepperService.loadTemplateComponents();
      this.checkoutLinearStepperService.sendState();
    }
  }

  public switchModalPayment(modal: string) {
    this.modalPayment = modal;
    this.checkoutStepService.changeShoppingCartPaymentMode(this.modalPayment);
  }


  public nextStep() {
    if (this.form.valid) {
      if (this.modalPayment !== '') {
        this.checkoutService.setPaymentFrequency(this.product.order.id, this.modalPayment).pipe(
          catchError(err => {
            return Observable.throwError(err);
          }),
        ).subscribe(response => {
          const startDateVal = this.form.controls.activationDate.value;
          const startDate = (typeof (startDateVal) === 'string' ? moment(startDateVal, 'DD/MM/YYYY') : moment(TimeHelper.fromNgbDateToDate(startDateVal))).format('DD/MM/YYYY');
          const endDate = (typeof (startDateVal) === 'string' ? moment(startDateVal, 'DD/MM/YYYY').add(1, 'y') : moment(TimeHelper.fromNgbDateToDate(startDateVal)).add(1, 'y')).format('DD/MM/YYYY');
          const responseOrderFromStepAddress = JSON.parse(localStorage.getItem('responseOrderStepAddress'));
          const total = responseOrderFromStepAddress.total;
          const productName = responseOrderFromStepAddress.line_items[0].variant.name;
          const shoppingCartInfo = {
            policy_validity: startDate + ' - ' + endDate,
            product_name: productName,
            total: total
          }
          this.checkoutStepService.changeShoppingCartInfo(shoppingCartInfo);
          super.handleNextStep();
        });
      } else {
        this.toastrService.warning("Selezionare la modalità di pagamento.");
        return;
      }

    }
  }

  public checkValidField() {
    return super.canConfirm() && this.form.valid && this.modalPayment !== '';
  }

  createRequestOrder(): RequestOrder {
    if (this.checkoutStepService.step.name === 'confirm') {
      return;
    }
    const ro: RequestOrder = { order: {} };
    const responseOrder = this.dataService.getResponseOrder();
    if (this.paymentMethod) {
      ro.order.payments_attributes = [
        this.getPaymentAttributesFromPaymentMethod(this.paymentMethod)
      ];
    }

    const startDateVal = this.form.controls.activationDate.value;
    const startDate = (typeof (startDateVal) === 'string' ? moment(startDateVal, 'DD/MM/YYYY') : moment(TimeHelper.fromNgbDateToDate(startDateVal))).format('YYYY-MM-DD');
    ro.order.line_items_attributes = new LineItemsAttributes();
    ro.order.line_items_attributes[0] = {
      id: this.product.lineItemId,
      start_date: startDate,
    };
    return ro;
  }
}
