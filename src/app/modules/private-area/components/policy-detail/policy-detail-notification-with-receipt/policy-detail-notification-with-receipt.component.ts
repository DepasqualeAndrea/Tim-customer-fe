import { NypExternalClaimService, NypIadOrderService, NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService, InsurancesService, UserService } from '@services';
import { ExternalClaimService } from 'app/core/services/claims/external-claim.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { ModalService } from 'app/core/services/modal.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { Policy } from 'app/modules/private-area/private-area.model';
import { BlockUIService } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { LoaderService } from '../../../../../core/services/loader.service';
import { PolicyDetailAbstractComponent } from '../policy-detail-abstract/policy-detail-abstract.component';

@Component({
    selector: 'app-policy-detail-notification-with-receipt',
    templateUrl: './policy-detail-notification-with-receipt.component.html',
    styleUrls: ['./policy-detail-notification-with-receipt.component.scss'],
    standalone: false
})
export class PolicyDetailNotificationWithReceiptComponent extends PolicyDetailAbstractComponent implements OnInit {

  @Input() policy: Policy;
  icon: string;
  label: string

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
    braintree3DSecurePaymentService: Braintree3DSecurePaymentService,
    blockUiService: BlockUIService,
    loaderService: LoaderService,
    nypExternalClaimService: NypExternalClaimService,
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
      apiService,
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.setContent();
  }

  private setContent() {
    this.kenticoTranslateService.getItem<any>('private_area.info_subscription_uncharged_icon').pipe(take(1)).subscribe(icon => {
      this.icon = icon.value[0].url;
    })
  }

  hasCertificate(): boolean {
    return this.payments.some(pay => !!pay.certificate_url);
  }

}
