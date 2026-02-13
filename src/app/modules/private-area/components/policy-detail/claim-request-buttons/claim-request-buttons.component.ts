import { NypExternalClaimService, NypIadOrderService, NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService, InsurancesService, UserService } from '@services';
import { ExternalClaimService } from 'app/core/services/claims/external-claim.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { ModalService } from 'app/core/services/modal.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { BlockUIService } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../../core/services/loader.service';
import { PolicyDetailAbstractComponent } from '../policy-detail-abstract/policy-detail-abstract.component';

@Component({
    selector: 'app-claim-request-buttons',
    templateUrl: './claim-request-buttons.component.html',
    styleUrls: ['./claim-request-buttons.component.scss'],
    standalone: false
})
export class ClaimRequestButtonsComponent extends PolicyDetailAbstractComponent implements OnInit, OnDestroy {

  constructor(
    route: ActivatedRoute,
    modalService: NgbModal,
    insurancesService: InsurancesService,
    nypInsurancesService: NypInsurancesService,
    dataService: DataService,
    userService: UserService,
    nypUserService: NypUserService,
    toastrService: ToastrService,
    router: Router,
    kenticoTranslateService: KenticoTranslateService,
    componentFeaturesService: ComponentFeaturesService,
    authService: AuthService,
    externalClaimService: ExternalClaimService,
    nypExternalClaimService: NypExternalClaimService,
    braintree3DSecurePaymentService: Braintree3DSecurePaymentService,
    blockUiService: BlockUIService,
    loaderService: LoaderService,
    modService: ModalService,
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
      apiService
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.getProviderImage(this.policy.product.id);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  openPerAddonClaim() {
    const product = this.policy.product.product_code;
    if (product.includes('hpet')) {
      const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'policyDetailModalClaimAttachments';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'policyData': this.policy };
    } else {
      const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'policyPerAddonClaim';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'policyData': this.policy };
    }
  }

  openSendRequestClaim() {
    const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    (<ContainerComponent>modalRef.componentInstance).type = 'policyModalRequest';
    (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'policyData': this.policy };
  }

}

