import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service'
import { Component, OnInit } from '@angular/core'
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component'
import { CONSTANTS } from 'app/app.constants'
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service'
import { DataService, InsurancesService, UserService } from '@services'
import { take } from 'rxjs/operators'
import { PaymentStatus } from './payment-statuses.enum'
import moment from 'moment'
import { NypUserService } from '@NYP/ngx-multitenant-core'

@Component({
    selector: 'app-policy-detail-recap-basic-pet-paychecks-charge-history',
    templateUrl: './policy-detail-recap-basic-pet-paychecks-charge-history.component.html',
    styleUrls: ['./policy-detail-recap-basic-pet-paychecks-charge-history.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicPetPaychecksChargeHistoryComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  duration: string;
  hasNoPaymentCC: boolean
  paymentHistory: any[]
  formattedExpirationDate: string
  formattedStartDate: string
  petKind: string
  petName: string
  petKindLabel: string

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private nypUserService: NypUserService,
    private insurancesService: InsurancesService
  ) {
    super();
  }

  ngOnInit() {
    this.formatDates(this.policy)
    this.setDuration(this.policy)
    this.setPayment(this.policy)
    this.setPetInfos(this.policy)
  }

  public isCertificateMissing(policy): boolean {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING
  }

  public infoPackageDownload() {
    this.componentFeaturesService.getComponent('policy-detail')
    this.componentFeaturesService.useRule('info-package-download')
    return this.componentFeaturesService.isRuleEnabled()
  }

  private setDuration(policy): void {
    if (policy.product.payment_methods[0].type === 'Spree::Gateway::BraintreeRecurrent' || policy.product.payment_methods[0].type === 'Spree::PaymentMethod::NoPaymentCreditCard') {
      this.kenticoTranslateService.getItem<any>('private_area.monthly_duration_type').pipe().subscribe(item => {
        this.duration = item.value
      });
    }
  }

  private setPayment(policy): void {
    const noPaymentId = policy?.product?.payment_methods?.find(paymentMethod =>
      paymentMethod.type === 'Spree::PaymentMethod::NoPaymentCreditCard'
    ).id

    const policyPayment = policy.wallets?.payment_source?.find(payment => payment.id === policy.paymentMethod?.id);

    this.hasNoPaymentCC = policyPayment ? (noPaymentId === policyPayment?.payment_method_id) : false;

    if (this.hasNoPaymentCC)
      this.setPayments(policy.id)
  }

  private setPayments(policyId: string | number): void {
    this.insurancesService.getMyPetPaymentHistory(policyId).pipe(take(1)).subscribe(payments => {
      this.paymentHistory = payments
    })
  }

  private formatDates(policy): void {
    this.formattedExpirationDate = moment(policy.expirationDate).subtract(1, 'day').endOf('day').format('DD/MM/YYYY, HH:mm')
    this.formattedStartDate = moment(policy.startDate).subtract(1, 'day').format('DD/MM/YYYY, 24:mm')
  }

  public hasPaymentHistory(): boolean {
    return this.paymentHistory && this.paymentHistory.length > 0
  }

  public getStatus(code: string): string {
    return PaymentStatus[code]
  }

  private setPetInfos(policy): void {
    const insuredPet = policy.insuredEntities.pets[0]
    this.petKind = insuredPet.kind
    this.petName = insuredPet.name
    this.petKindLabel = policy.pet_properties.kinds[this.petKind]
  }

}

