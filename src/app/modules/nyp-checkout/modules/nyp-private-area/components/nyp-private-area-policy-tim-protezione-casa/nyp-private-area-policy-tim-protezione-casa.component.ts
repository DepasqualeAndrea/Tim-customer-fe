import { NypIadPolicyService } from '@NYP/ngx-multitenant-core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NypPolicy } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_PROTEZIONE_CASA_KENTICO_NAME, TIM_PROTEZIONE_CASA_KENTICO_SLUG } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TimProtezioneCasaApiService } from '../../../tim-protezione-casa/services/api.service';

@Component({
    selector: 'app-nyp-private-area-policy-tim-protezione-casa',
    templateUrl: './nyp-private-area-policy-tim-protezione-casa.component.html',
    styleUrls: ['./nyp-private-area-policy-tim-protezione-casa.component.scss'],
    standalone: false
})
export class NypPrivateAreaPolicyTimProtezioneCasaComponent implements OnInit {
  public Warranties$: Observable<string[]>;

  @Input() public policy: NypPolicy;
  @Output() openModalWithdrawalEvent = new EventEmitter<void>();
  @Output() openModalCancelationEvent = new EventEmitter<void>();

  duration: string;
  formattedExpirationDate: string;
  formattedStartDate: string;
  public policyStatus: string;

  constructor(
    public kenticoTranslateService: KenticoTranslateService,
    private apiService: TimProtezioneCasaApiService,
    private componentFeaturesService: ComponentFeaturesService,
    private nypIadPolicyService: NypIadPolicyService,
    private nypDataService: NypDataService,

  ) {
  }
  ngOnInit() {
    this.formatDates(this.policy);
    this.setDuration(this.policy);

    this.Warranties$ = this.nypDataService
      .downloadKenticoContent(TIM_PROTEZIONE_CASA_KENTICO_NAME, TIM_PROTEZIONE_CASA_KENTICO_SLUG)
      .pipe(
        mergeMap(() => this.apiService.getOrderById(this.policy?.order_id)),
        map(order => order?.orderItem[0]?.instance?.chosenWarranties?.data?.warranties?.map(w => `${w.translationCode}`)),
      );
  }
  private static readonly PolicyStatus: { [key: string]: { code: string, description: string } } = {
    'active': { code: 'nyp_data_service.policy_status_active', description: 'Attiva' },
    'verified': { code: 'nyp_data_service.policy_status_verified', description: 'In attesa di attivazione' },
    'draft': { code: 'nyp_data_service.policy_status_draft', description: 'In attesa di verifica' },
    'expired': { code: 'nyp_data_service.policy_status_expired', description: 'Scaduta' },
    'canceled': { code: 'nyp_data_service.policy_status_canceled', description: 'Annullata' },
    'suspended': { code: 'nyp_data_service.policy_status_suspended', description: 'Sospesa' },
  };

  getPolicyStatus(policy: NypPolicy): string {
    const policyStatusObject = NypPrivateAreaPolicyTimProtezioneCasaComponent.PolicyStatus[policy.status];
    return policyStatusObject ? policyStatusObject.description : '';
  }
  getStatusColorClass(policy: NypPolicy): string[] {
    switch (policy.status) {
      case 'active':
        return ['active'];
      case 'verified':
      case 'draft':
        return ['verified'];
      case 'expired':
      case 'canceled':
      case 'suspended':
        return ['expired'];
      default:
        return [];
    }
  }
  public isCertificateMissing(policy): boolean {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  public infoPackageDownload() {
    this.componentFeaturesService.getComponent('policy-detail');
    this.componentFeaturesService.useRule('info-package-download');
    return this.componentFeaturesService.isRuleEnabled();
  }

  private setDuration(policy): void {
    if (policy.product.payment_methods[0].type === 'Spree::Gateway::BraintreeRecurrent' || policy.product.payment_methods[0].type === 'Spree::PaymentMethod::NoPaymentCreditCard') {
      this.kenticoTranslateService.getItem<any>('private_area.yearly_duration_type').pipe().subscribe(item => {
        this.duration = item.value;
      });
    }
  }

  private formatDates(policy): void {
    this.formattedExpirationDate = moment(policy.expiration_date).format('DD/MM/YYYY');
    this.formattedStartDate = moment(policy.start_date).format('DD/MM/YYYY');
  }

  downloadFile(policy) {
    this.nypIadPolicyService.getDocument(policy.policy_number).subscribe(res => {
      const source = `data:application/pdf;base64,${res.file}`;
      const link = document.createElement("a");

      link.href = source;
      link.download = res.fileName;

      link.click();
    });
  }

  openModalWithdrawal() {
    if (this.policy.actions_availability.withdrawable) {
      this.openModalWithdrawalEvent.emit();
    }
  }

  openModalCancelation() {
    if (this.policy.actions_availability.deactivable) {
      this.openModalCancelationEvent.emit();
    }
  }

}

