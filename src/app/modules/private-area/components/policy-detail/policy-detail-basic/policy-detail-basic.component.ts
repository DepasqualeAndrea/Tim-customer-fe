import { NypExternalClaimService, NypIadOrderService, NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService, InsurancesService, UserService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { ModalService } from 'app/core/services/modal.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { Policy } from 'app/modules/private-area/private-area.model';
import moment from 'moment';
import { BlockUIService } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ExternalClaimService } from '../../../../../core/services/claims/external-claim.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { PolicyDetailAbstractComponent } from '../policy-detail-abstract/policy-detail-abstract.component';

@Component({
  selector: 'app-policy-detail-basic',
  templateUrl: './policy-detail-basic.component.html',
  styleUrls: ['./policy-detail-basic.component.scss']
})
export class PolicyDetailBasicComponent extends PolicyDetailAbstractComponent implements OnInit, OnDestroy {

  @Input() policy: Policy;
  @Input() disclaimer3DSecure: any;
  paperCopyTxt: string;
  order: any;

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
    this.getProviderImage(this.policy.product.id);
    // this.getPaperCopyText();
    this.checkIfIsSkiPolicyActive();

  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getPaperCopyText() {
    this.kenticoTranslateService.getItem<any>('private_area').pipe().subscribe(item => {
      console.log(item.paper_copy_txt.value);
      this.paperCopyTxt = item.paper_copy_txt.value;
    });
  }

  checkAvailabilityWithdrawOrDeactivation(): boolean {
    const policyStartDate = moment(this.policy.startDate);
    const now = moment(new Date());
    const duration = moment.duration(now.diff(policyStartDate));
    const daysDiff = duration.asDays();
    /* //console.log(daysDiff, "difference in days")



    // const orderVariant = this.order.line_items[0].variant.id

    const product_code = this.policy.product.product_code
    if (['tim-for-ski-silver', 'tim-for-ski-gold', 'tim-for-ski-platinum'].includes(product_code)) {
      // orderVariant == 12 NB da modificare appena si la getOrder(orderCode) va
      const limitSeasonalDate = new Date("2024/05/15")
      if ((this.policy.expirationDate.toString() === limitSeasonalDate.toString()) && (daysDiff <= 14)) {
        return true
      }
      return false
    }
    else */
    return (this.policy.actions.deactivate_and_withdraw || this.policy.actions.withdrawable);
  }
}

