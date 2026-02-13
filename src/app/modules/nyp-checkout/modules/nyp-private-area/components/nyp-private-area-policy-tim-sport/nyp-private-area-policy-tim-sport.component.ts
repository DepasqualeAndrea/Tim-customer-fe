import { NypIadPolicyService } from '@NYP/ngx-multitenant-core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NypPolicy } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_SPORT_KENTICO_NAME, TIM_SPORT_KENTICO_SLUG } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TimSportApiService } from '../../../tim-sport/services/api.service';
import { PrivateAreaApiService } from '../../services/api.service';
import { ExternalClaimUser } from 'app/core/models/claims/external-claim-user.model';
import { User } from '@model';
import { AuthService } from '@services';

@Component({
    selector: 'app-nyp-private-area-policy-tim-sport',
    templateUrl: './nyp-private-area-policy-tim-sport.component.html',
    styleUrls: ['./nyp-private-area-policy-tim-sport.component.scss'],
    standalone: false
})
export class NypPrivateAreaPolicyTimSportComponent implements OnInit {
  public Warranties$: Observable<string[]>;
  public Order$ = this.nypDataService.Order$;

  @Input() public policy: NypPolicy;
  @Output() openModalWithdrawalEvent = new EventEmitter<void>();
  @Output() openModalCancelationEvent = new EventEmitter<void>();

  duration: string;
  formattedExpirationDate: string;
  formattedStartDate: string;
  public policyStatus: string;
  public warranties: string[] = [];

  constructor(
    public kenticoTranslateService: KenticoTranslateService,
    private SportApiService: TimSportApiService,
    private apiService: PrivateAreaApiService,
    private componentFeaturesService: ComponentFeaturesService,
    private nypIadPolicyService: NypIadPolicyService,
    private nypDataService: NypDataService,
    private authService: AuthService,

  ) {
  }
  ngOnInit() {
    this.setDuration(this.policy);
    this.getWarranties();
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
    const policyStatusObject = NypPrivateAreaPolicyTimSportComponent.PolicyStatus[policy.status];
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
  private getNumeroCivicoFromAddress(address: string): string {
    const execResult: RegExpExecArray = /^([a-zA-Z\s]*)[\W\s]*(.*?[\d\s]+[\W+]*)$/.exec(address);
    if (!execResult) {
      return address;
    }

    return execResult[2];
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

  downloadClaim(policy, templateName: string) {

    this.apiService.createExternalClaim(policy, templateName).subscribe(res => {
      if (res.nome_file?.toLowerCase()?.includes('denuncia_infortuni') || res.nome_file?.toLowerCase()?.includes('denuncia_rc')) {
        const source = `data:application/pdf;base64,${res.file}`;
        const link = document.createElement("a");

        link.href = source;
        link.download = res.nome_file;

        link.click();
      } else {
        console.error('Document is not a denuncia_infortuni || denuncia_rc');
      }
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

  public getWarranties() {
    this.warranties = (this.nypDataService.Order$.value.packet.data.warranties.map(warranty => warranty.anagWarranty.name)).sort();
  }

}

