import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { IOrderResponse, NypPolicy } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_BILL_PROTECTION_2_PRODUCT_NAME, TIM_BILL_PROTECTION_PRODUCT_NAME, TIM_BILL_PROTECTOR_PRODUCT_NAME, TIM_PROTEZIONE_CASA_PRODUCT_NAME, TIM_SPORT_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { NypStripeService } from '../../../nyp-stripe/services/nyp-stripe.service';
import { NypPolicyDetailModalCancelationSuccessComponent } from '../../modal/nyp-policy-detail-modal-cancelation-success/nyp-policy-detail-modal-cancelation-success.component';
import { NypPolicyDetailModalCancelationComponent } from '../../modal/nyp-policy-detail-modal-cancelation/nyp-policy-detail-modal-cancelation.component';
import { NypPolicyDetailModalWithdrawalSuccessComponent } from '../../modal/nyp-policy-detail-modal-withdrawal-success/nyp-policy-detail-modal-withdrawal-success.component';
import { NypPolicyDetailModalWithdrawalComponent } from '../../modal/nyp-policy-detail-modal-withdrawal/nyp-policy-detail-modal-withdrawal.component';
import { PrivateAreaApiService } from '../../services/api.service';

@Component({
  selector: 'app-nyp-private-area-policy-detail',
  templateUrl: './nyp-private-area-policy-detail.component.html',
  styleUrls: ['./nyp-private-area-policy-detail.component.scss']
})
export class NypPrivateAreaPolicyDetailComponent {
  public readonly product: string;
  public order: IOrderResponse<any>
  public readonly policy: NypPolicy;
  public readonly paymentMethodUpdated: boolean;
  public readonly orderLoaded$ = new BehaviorSubject(undefined);

  constructor(
    private router: Router,
    protected modalService: NgbModal,
    protected nypInsurancesService: NypInsurancesService,
    public dataService: DataService,
    private apiService: NypApiService,
    public componentFeaturesService: ComponentFeaturesService,
    public stripeService: NypStripeService,
    private privateAreaApiService: PrivateAreaApiService,
  ) {
    this.policy = (this.router.getCurrentNavigation()?.extras?.state?.policy ?? history.state?.policy) as NypPolicy;
    this.paymentMethodUpdated = history.state?.sessionStatus;
    this.product = this.policy.product?.product_code;
    this.privateAreaApiService.getOrderById(this.policy.order_id).subscribe(
      (response: IOrderResponse<any>) => {
        this.order = response;
        this.orderLoaded$.next(true)
      });
  }

  updateSubscription(): void {
    this.stripeService
      .updateSubscription(this.policy.orderCode)
      .subscribe();
  }

  openModalCancelation(): void {
    const product = NypInsurancesService?.products?.products?.find(product => product?.product_code == this.policy.product.product_code);
    const modalRef = this.modalService.open(NypPolicyDetailModalCancelationComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    modalRef.componentInstance.policyData = this.policy;
    modalRef.result.then(result => {
      modalRef.dismiss();

      const rest: Observable<any> = [TIM_PROTEZIONE_CASA_PRODUCT_NAME, TIM_BILL_PROTECTION_PRODUCT_NAME, TIM_BILL_PROTECTION_2_PRODUCT_NAME, TIM_SPORT_PRODUCT_NAME, TIM_BILL_PROTECTOR_PRODUCT_NAME].includes(this.policy.product.product_code)
        ? this.apiService.deactivatePolicy(this.policy.policy_number)
        : this.nypInsurancesService.deactivate(this.policy.id, product?.deactivation?.deactivationType);

      rest.subscribe(res => {
        const modalRefSuccess = this.modalService.open(NypPolicyDetailModalCancelationSuccessComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
        modalRefSuccess.componentInstance.policyData = this.policy;
        modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
      });
    });
  }

  rerunGuradsAndResolvers() {
    const defaltOnSameUrlNavigation = this.router.onSameUrlNavigation;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(this.router.url, { replaceUrl: true });
    this.router.onSameUrlNavigation = defaltOnSameUrlNavigation;
  }
  openModalWithdrawal(): void {
    const tenant = this.dataService.tenantInfo.tenant;
    let modalRef: any;

    if (this.policy.product.product_code.includes('tim-for-ski')) {
      modalRef = this.modalService.open(NypPolicyDetailModalWithdrawalComponent, {
        size: 'lg',
        backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
        windowClass: 'modal-window',
        backdrop: 'static',
        keyboard: false,
        centered: true
      });
    } else {
      modalRef = this.modalService.open(NypPolicyDetailModalWithdrawalComponent, {
        size: 'lg',
        backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
        windowClass: 'modal-window'
      });
    }

    modalRef.componentInstance.policyData = this.policy;
    modalRef.result.then(result => {
      modalRef.dismiss();

      if (tenant === 'chebanca_db') {
        this.nypInsurancesService.withdrawWithIBAN(this.policy.id, result).subscribe(res => {
          const modalRefSuccess = this.modalService.open(NypPolicyDetailModalWithdrawalSuccessComponent, {
            size: 'lg',
            backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
            windowClass: 'modal-window'
          });
          modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
        });
      } else if (TIM_PROTEZIONE_CASA_PRODUCT_NAME.includes(this.policy?.product?.product_code) || TIM_BILL_PROTECTION_PRODUCT_NAME.includes(this.policy?.product?.product_code) || TIM_BILL_PROTECTION_2_PRODUCT_NAME.includes(this.policy?.product?.product_code) || TIM_SPORT_PRODUCT_NAME.includes(this.policy?.product?.product_code) || TIM_BILL_PROTECTOR_PRODUCT_NAME.includes(this.policy?.product?.product_code)) {
        this.apiService.withdraw(this.policy.id, result).subscribe(res => {
          const modalRefSuccess = this.modalService.open(NypPolicyDetailModalWithdrawalSuccessComponent, {
            size: 'lg',
            backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
            windowClass: 'modal-window'
          });
          modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
        });
      } else {
        this.nypInsurancesService.withdraw(this.policy.id, result).subscribe(res => {
          const modalRefSuccess = this.modalService.open(NypPolicyDetailModalWithdrawalSuccessComponent, {
            size: 'lg',
            backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
            windowClass: 'modal-window'
          });
          modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
        });
      }
    });
  }

}
