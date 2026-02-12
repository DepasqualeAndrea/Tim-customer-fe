import { NypExternalClaimService, NypIadOrderService, NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService, InsurancesService, UserService } from '@services';
import { ModalService } from 'app/core/services/modal.service';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { BlockUIService } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ExternalClaimService } from '../../../../../core/services/claims/external-claim.service';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { PolicyDetailModal } from '../model/policy-detail-modal.model';
import { PolicyDetailAbstractComponent } from '../policy-detail-abstract/policy-detail-abstract.component';

@Component({
  selector: 'app-policy-detail-full',
  templateUrl: './policy-detail-full.component.html',
  styleUrls: ['./policy-detail-full.component.scss']
})
export class PolicyDetailFullComponent extends PolicyDetailAbstractComponent implements OnInit, AfterViewInit {

  showWallets = true;

  constructor(
    route: ActivatedRoute,
    modalService: NgbModal,
    insurancesService: InsurancesService,
    nypInsurancesService: NypInsurancesService,
    dataService: DataService,
    userService: UserService,
    nypUserService: NypUserService,
    nypExternalClaimService: NypExternalClaimService,
    toastrService: ToastrService,
    router: Router,
    kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService,
    authService: AuthService,
    externalClaimService: ExternalClaimService,
    braintree3DSecurePaymentService: Braintree3DSecurePaymentService,
    blockUiService: BlockUIService,
    loaderService: LoaderService,
    modService: ModalService,
    private toastService: ToastrService,
    nypIadOrderService: NypIadOrderService,
    apiService: NypApiService,
  ) {
    super(
      route,
      modalService,
      insurancesService,
      nypInsurancesService,
      dataService,
      userService,
      nypUserService,
      toastrService,
      router,
      kenticoTranslateService,
      componentFeaturesService,
      authService,
      externalClaimService,
      nypExternalClaimService,
      braintree3DSecurePaymentService,
      blockUiService,
      loaderService,
      modService,
      nypIadOrderService,
      apiService,
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.getProviderImage(this.policy.product.id);
    this.showPaymentMethods();
  }

  ngAfterViewInit() {
    setTimeout(() => this.modalSunny());
  }

  modalSunny() {
    const redirectUrl = localStorage.getItem('canOpenClaim');
    if (this.policy.product.product_code === 'satec-tua-sunny' && redirectUrl) {
      this.openModalClaim();
    }
  }

  handleResultModalWithdrawable(value: any) {
    this.insurancesService.withdrawScreen(this.policy.id, value).subscribe(res => {
      this.toastService.success('Rimborso richiesto con successo');
    }, error => {
      if (error.error.exception) {
        this.toastService.error(error.error.exception);
      } else {
        this.toastService.error(error.error.error);
      }
    }
    );
  }


  handleResultModalRefundable(value: PolicyDetailModal) {
    console.log('risulato modal:' + value);
    this.insurancesService.refund(this.policy.id, value).subscribe(res => {
      this.toastService.success('Rimborso richiesto con successo');
    }, error => {
      if (error.error.exception) {
        this.toastService.error(error.error.exception);
      } else {
        this.toastService.error(error.error.error);
      }

    }

    );
  }

  showPaymentMethods() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('get-different-braintree-payment-method');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('payment-method-name');
      if (constraints.includes('SellaPayment')) {
        return this.showWallets = false;
      }
    }
  }
  openModalOthersModality() {
    if (this.policy.product.product_code.includes('tim-for-ski')) {
      this.modService.openModalCentered('tim_for_ski_modal_open_claim', 'policyDetailModalClaimTimForSkiOthersModality');
    }
  }

  setTablePayments() {
    if (this.policy.product.product_code === 'net-multirisk-craft'
      || this.policy.product.product_code === 'net-multirisk-commerce') {
      return 'col-3';
    } else {
      return 'col-4';
    }
  }

  get checkCheBanca(): boolean {
    return this.dataService.tenantInfo.tenant === 'chebanca_db' && this.policy.product.product_code === 'ge-home';
  }
}
