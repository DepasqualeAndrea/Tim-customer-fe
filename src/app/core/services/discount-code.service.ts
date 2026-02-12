import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError, concatMap, first, switchMap, takeWhile } from 'rxjs/operators';
import { from, of, pipe } from 'rxjs';
import * as moment from 'moment';
import { DiscountCodeAuthorizationResult } from './discount-code-authorization-result.enum';
import { DiscountCouponValidationResponseModel, COUPON_CODE_LOCAL_STORAGE } from '../models/discount-coupon.model';
import { Injectable } from "@angular/core";


@Injectable()
export class DiscountCodeService {
  constructor(
    protected http: HttpClient
  ) { }

  getCouponAuthorizationResult(couponsQueryString: string): Observable<DiscountCodeAuthorizationResult> {
    if (!!couponsQueryString) {
      const coupons = couponsQueryString.split(';');
      return this.getCouponAuthorizationResultArray(coupons);
    }
    return this.getAuthorizationResultFromSavedCoupon();
  }

  private getAuthorizationResultFromSavedCoupon(): Observable<DiscountCodeAuthorizationResult> {
    const isCouponSaved = this.isCouponSaved();
    if (isCouponSaved) {
      const todayDate = new Date();
      const savedCoupon = this.getCouponFromLocalStorage();
      const isDateValid = this.validateCreationDate(savedCoupon.session_started_at, todayDate);
      if (!isDateValid) {
        this.removeCouponOnLocalStorage();
        return of(DiscountCodeAuthorizationResult.UnauthorizedNoCouponCodeSupplied);
      }
      return this.getAndValidateSavedCoupon().pipe(map(couponModel => this.getAuthorizationResult(couponModel)));
    }
    return of(DiscountCodeAuthorizationResult.UnauthorizedNoCouponCodeSupplied);
  }

  private isCouponSaved(): boolean {
    const token = this.getCouponFromLocalStorage();
    return !!token;
  }
  private getAuthorizationResult(couponModel: DiscountCouponValidationResponseModel): DiscountCodeAuthorizationResult {
    if (!!couponModel) {
      return DiscountCodeAuthorizationResult.AuthorizedCouponCodeSupplied;
    }
    return DiscountCodeAuthorizationResult.UnAuthorizedCodeConsumed;
  }
  getDiscountTokenValidation(discountCode: string): Observable<DiscountCouponValidationResponseModel> {
    throw new Error("getDiscountTokenValidation")
  }

  validateCouponCode(code: string): Observable<DiscountCouponValidationResponseModel> {
    return this.getDiscountTokenValidation(code)
      .pipe(
        catchError(err => {
          return of(null);
        })
        , map(couponModel => this.checkCouponIsNotConsumed(couponModel))
        , map(couponModel => this.saveCouponModel(couponModel))
      );
  }
  checkCouponIsNotConsumed(couponModel: DiscountCouponValidationResponseModel): DiscountCouponValidationResponseModel {
    if (!couponModel || !!couponModel.consumed_at) {
      return null;
    }
    return couponModel;
  }
  checkCouponIsDefined(couponModel: DiscountCouponValidationResponseModel): boolean {
    return !!couponModel;
  }
  unloadCouponWhenIsNotValid(couponModel: DiscountCouponValidationResponseModel): DiscountCouponValidationResponseModel {
    if (!couponModel) {
      this.removeCouponOnLocalStorage();
      return null;
    }
    return couponModel;
  }
  saveCouponModel(couponModel: DiscountCouponValidationResponseModel): DiscountCouponValidationResponseModel {
    if (!couponModel) {
      return this.unloadCouponWhenIsNotValid(couponModel);
    }
    const creationDate = new Date;
    couponModel.session_started_at = creationDate;
    this.saveCouponOnLocalStorage(couponModel);
    return couponModel;
  }
  public removeCouponOnLocalStorage() {
    localStorage.removeItem(COUPON_CODE_LOCAL_STORAGE);
  }
  public saveCouponOnLocalStorage(couponModel: DiscountCouponValidationResponseModel) {
    localStorage.setItem(COUPON_CODE_LOCAL_STORAGE, JSON.stringify(couponModel));
  }
  public getCouponFromLocalStorage() {
    const savedCouponCode = JSON.parse(localStorage.getItem(COUPON_CODE_LOCAL_STORAGE)) as DiscountCouponValidationResponseModel;
    return savedCouponCode;
  }
  getAndValidateSavedCoupon(): Observable<DiscountCouponValidationResponseModel> {
    const savedCouponCode = this.getCouponFromLocalStorage();
    if (!savedCouponCode) {
      return of(null);
    }
    const todayDate = new Date();
    const isDateValid = this.validateCreationDate(savedCouponCode.session_started_at, todayDate);
    if (isDateValid) {
      return this.validateCouponCode(savedCouponCode.code)
        .pipe(map(couponModel => this.checkCouponIsNotConsumed(couponModel))
          , map(couponModel => this.unloadCouponWhenIsNotValid(couponModel))
        );
    }
    this.removeCouponOnLocalStorage();
    return of(null);
  }

  isAuthorized(): Observable<boolean> {
    return this.getAndValidateSavedCoupon().pipe(map((coupon) => !!coupon));
  }

  public validateCreationDate(creationDate: Date, todayDate: Date) {
    const minutes = 60;
    const momentTodayDate = moment(todayDate);
    const momentCreationDate = moment(creationDate);
    const duration = moment.duration(momentTodayDate.diff(momentCreationDate));
    const diffBetweenDates = duration.asMinutes();
    if (diffBetweenDates <= minutes) {
      return true;
    }
  }
  getSavedCoupon(): DiscountCouponValidationResponseModel {
    return this.getCouponFromLocalStorage();
  }

  private getCouponAuthorizationResultArray(coupons: string[]): Observable<DiscountCodeAuthorizationResult> {
    return this.someCouponIsValid(coupons).pipe(
      map(result => {
        if (result) {
          return DiscountCodeAuthorizationResult.AuthorizedCouponCodeSupplied;
        }
        return DiscountCodeAuthorizationResult.UnAuthorizedCodeConsumed;
      })
    );
  }

  private someCouponIsValid(coupons: string[]): Observable<boolean> {
    return from(coupons).pipe(
      concatMap(coupon => this.validateCouponCode(coupon)),
      first(coupon => !!coupon && coupon.consumed_at === null),
      switchMap(isDefined => of(this.checkCouponIsDefined(isDefined))),
      catchError(err => of(null)),
    )
  }
}
