import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  CheckoutInfoDataWithAddons,
  CheckoutStep,
  CheckoutStepOperation,
  CheckoutStepPriceChange
} from '../checkout-step/checkout-step.model';
import { CheckoutGtmService } from './checkout-gtm.service';
import { CheckoutStepPaymentPromoCode } from '../checkout-step/checkout-step-payment/checkout-step-payment.model';
import { CheckoutProductCostItem, CheckoutProductCostItemType } from '../checkout.model';
import { DataService, InsurancesService } from '@services';
import { HomeRequestQuote, ProvidersQuoteRequest, ProvidersQuoteRequestHome, ProvidersQuoteRequestMotor, ResponseOrder, TimMyHomeRequestQuote } from '@model';
import { delay, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

export enum StepAction {
  BACK, FORWARD
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutStepService {

  action: StepAction;
  orderUpdated = new Subject<void>();
  // YSD-2876 Paybylink health, al pagamento lo step viene letto prima della scrittura.
  // Caricare i figli solo dopo che step è stato caricato.
  private _isStep$: Subject<boolean> = new Subject<boolean>();
  public isStep$: Observable<boolean> = this._isStep$.pipe(delay(500));
  step: CheckoutStep;

  private checkoutStepAnnouncedSource = new Subject<CheckoutStep>();
  checkoutStepAnnounced$ = this.checkoutStepAnnouncedSource.asObservable();
  private checkoutStepCompletedSource = new Subject<CheckoutStepOperation>();
  checkoutStepCompleted$ = this.checkoutStepCompletedSource.asObservable();
  private checkoutStepBackSource = new Subject<CheckoutStepOperation>();
  checkoutStepBack$ = this.checkoutStepBackSource.asObservable();
  private checkoutStepPriceChangeSource = new Subject<CheckoutStepPriceChange>();
  checkoutStepPriceChange$ = this.checkoutStepPriceChangeSource.asObservable();
  private checkoutOrderChangeSource = new Subject<ResponseOrder>();
  checkoutOrderChange$ = this.checkoutOrderChangeSource.asObservable();

  private checkoutStepPriceChangeAfterSelectedAddons = new Subject<CheckoutStepPriceChange>();
  checkoutStepPriceChangeAfterSelectedAddons$ = this.checkoutStepPriceChangeAfterSelectedAddons.asObservable();
  private checkoutStepPriceChangeAfterSelectedAddonsMotor = new Subject<CheckoutStepPriceChange>();
  checkoutStepPriceChangeAfterSelectedAddonsMotor$ = this.checkoutStepPriceChangeAfterSelectedAddonsMotor.asObservable();
  private checkoutStepPriceChangeAfterSelectedAddonsHome = new Subject<CheckoutStepPriceChange>();
  checkoutStepPriceChangeAfterSelectedAddonsHome$ = this.checkoutStepPriceChangeAfterSelectedAddonsHome.asObservable();

  private checkoutStepChangeInfoDataWithAddons = new Subject<CheckoutInfoDataWithAddons>();
  checkoutStepChangeInfoDataWithAddons$ = this.checkoutStepChangeInfoDataWithAddons.asObservable();

  private checkoutStepChangeInfoDataBuilding = new Subject<any>();
  checkoutStepChangeInfoDataBuilding$ = this.checkoutStepChangeInfoDataBuilding.asObservable();

  private checkoutStepChangeInfoRecap = new Subject<any>();
  checkoutStepChangeInfoRecap$ = this.checkoutStepChangeInfoRecap.asObservable();

  private checkoutStepChangeShoppingCartInfo = new Subject<any>();
  checkoutStepChangeShoppingCartInfo$ = this.checkoutStepChangeShoppingCartInfo.asObservable();

  private _checkoutStepChangeShoppingCartPayment = new Subject<any>();
  checkoutStepChangeShoppingCartPayment$ = this._checkoutStepChangeShoppingCartPayment.asObservable();

  private checkoutStepPriceChangeInfo = new Subject<any>();
  checkoutStepPriceChangeInfo$ = this.checkoutStepPriceChangeInfo.asObservable();

  private checkoutCouponAppliedSource = new Subject<CheckoutStepPaymentPromoCode>();
  checkoutCouponApplied$ = this.checkoutCouponAppliedSource.asObservable();
  private afterCheckoutCouponAppliedSource = new Subject<any>();
  afterCheckoutCouponApplied$ = this.afterCheckoutCouponAppliedSource.asObservable();
  private checkoutSendFormSource = new Subject<UntypedFormGroup>();
  checkoutSendForm$ = this.checkoutSendFormSource.asObservable();

  private reducerPropertyUpdate = new Subject<any>();
  reducerPropertyUpdate$ = this.reducerPropertyUpdate.asObservable();

  private reducerSetStep = new Subject<string>();
  reducerSetStep$ = this.reducerSetStep.asObservable();

  private customReduce = new Subject<{ reduceKey: string, payload: any }>();
  customReduce$ = this.customReduce.asObservable();

  private _proposalSelectedTitle = new Subject<string>();
  proposalSelectedTitle = this._proposalSelectedTitle.asObservable();
  constructor(
    private checkoutGtmService: CheckoutGtmService,
    protected nypInsuranceService: NypInsurancesService,
    protected dataService: DataService,
    private insuranceService: InsurancesService) {
  }

  announceStep(step: CheckoutStep) {
    this.step = step;
    this.checkoutStepAnnouncedSource.next(step);
    this._isStep$.next(true);
  }

  backStep(stepOperation: CheckoutStepOperation): void {
    this.action = StepAction.BACK;
    this.checkoutStepBackSource.next(stepOperation);
  }

  completeStep(stepOperation: CheckoutStepOperation): void {
    this.action = StepAction.FORWARD;
    this.checkoutStepCompletedSource.next(stepOperation);
  }

  potentialPriceChange(change: CheckoutStepPriceChange) {
    this.checkoutStepPriceChangeSource.next(change);
  }

  public orderChange(change: ResponseOrder): void {
    this.checkoutOrderChangeSource.next(change);
  }

  priceChangeAfterSelectedAddons(travelRequest: ProvidersQuoteRequest) {
    this.insuranceService.submitTravelHelvetiaInsuranceQuotation(travelRequest).pipe(take(1)).subscribe(response => {
      if (response.token) {
        localStorage.setItem('token-dhi', response.token);
      }
      this.checkoutStepPriceChangeAfterSelectedAddons.next(response);
    });
  }

  priceChangeAfterSelectedAddonsMotor(request: ProvidersQuoteRequestMotor) {
    this.insuranceService.submitGenertelMotorInsuranceQuotation(request).pipe(take(1)).subscribe(response => {
      this.checkoutStepPriceChangeAfterSelectedAddonsMotor.next(response);
    });
  }

  priceChangeAfterSelectedAddonsHome(request: HomeRequestQuote) {
    this.insuranceService.submitHomeGenertelQuotation(request).pipe(take(1)).subscribe(response => {
      this.checkoutStepPriceChangeAfterSelectedAddonsHome.next(response);
    });
  }
  getPricesSelectedAddonsHome(request: HomeRequestQuote) {
    return this.insuranceService.submitHomeGenertelQuotation(request).pipe(take(1));
  }

  priceChangeAfterSelectedAddonsTimMyHome(request: TimMyHomeRequestQuote) {
    request["tenant"] = "tim-customers";
    this.dataService.timHomeQuotePayload = request
    this.nypInsuranceService.submitTimMyHomeQuotation(request).pipe(take(1)).subscribe(response => {
      this.checkoutStepPriceChangeAfterSelectedAddonsHome.next(response);
    });
  }

  public setReducerProperty(payload: { property: string, value: any }) {
    this.reducerPropertyUpdate.next(payload)
  }

  public changeInfoWithAddons(payload: CheckoutInfoDataWithAddons) {
    this.checkoutStepChangeInfoDataWithAddons.next(payload)
  }

  public changeInfoDataBuilding(payload: any) {
    this.checkoutStepChangeInfoDataBuilding.next(payload);
  }

  public changeRecapInfo(payload: any) {
    this.checkoutStepChangeInfoRecap.next(payload);
  }

  public changeShoppingCartInfo(payload: any) {
    this.checkoutStepChangeShoppingCartInfo.next(payload);
  }
  public changeShoppingCartPaymentMode(payload: any) {
    this._checkoutStepChangeShoppingCartPayment.next(payload);
  }

  public changePriceInfo(payload: any) {
    this.checkoutStepPriceChangeInfo.next(payload)
  }

  getSingleAddonQuotation(request: TimMyHomeRequestQuote): Observable<any> {
    request["tenant"] = "tim-customers";
    this.dataService.timHomeQuotePayload = request
    return this.nypInsuranceService.submitTimMyHomeQuotation(request).pipe(take(1));
  }

  public checkoutSendForm(form: UntypedFormGroup): void {
    this.checkoutSendFormSource.next(form);
  }

  private ongoingCheckoutData: any;
  public getOngoingCheckoutData(): any {
    return this.ongoingCheckoutData;
  }
  public setOngoingCheckoutData(data: any) {
    this.ongoingCheckoutData = data;
  }

  public setCurrentStep(stepName: string): void {
    this.reducerSetStep.next(stepName);
  }

  public setCustomReduce(request: { reduceKey: string, payload: any }): void {
    this.customReduce.next(request);
  }

  recalculateCostItems(costItems: CheckoutProductCostItem[], usePeriodMutiplicator: boolean = false, useInsuredMultiplicator: boolean = false): number {
    const total: number = costItems
      .filter(item => item.type === CheckoutProductCostItemType.regular || item.type === CheckoutProductCostItemType.discount)
      .reduce((acc, cur) => {
        let mult: number = usePeriodMutiplicator ? (cur.period || 1) : 1;
        mult *= useInsuredMultiplicator ? (cur.multiplicator || 1) : 1;

        return acc + cur.amount * mult;
      }, 0);

    return Math.max(0, total);
  }

  handleGtm() {
    this.checkoutGtmService.handleGtm(this.step);
  }

  couponApplied(promo: CheckoutStepPaymentPromoCode) {
    this.checkoutCouponAppliedSource.next(promo);
  }

  afterCouponApplied() {
    this.afterCheckoutCouponAppliedSource.next(null);
  }


}
