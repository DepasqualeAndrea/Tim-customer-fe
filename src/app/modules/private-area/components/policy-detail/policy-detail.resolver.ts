import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Policy } from '../../private-area.model';
import { Injectable } from '@angular/core';
import { map, mergeMap, take } from 'rxjs/operators';
import { forkJoin, zip } from 'rxjs';
import * as moment from 'moment';
import { Insurance } from '@model';
import { ImageHelper } from '../../../../shared/helpers/image.helper';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { NypCheckoutService, NypInsurancesService, NypUserService, POLICY_STATUS } from '@NYP/ngx-multitenant-core';
import { DataService } from '@services';

@Injectable()
export class PolicyDetailResolver  {

  paymentUnknown = {
    amount: 'unknown',
    id: 9999,
    number: 'unknown',
    order_id: 99999,
    payment_method_id: 9999,
    source_id: 999,
    source_type: 'unknown',
    state: 'unknown',
  };


  constructor(
    private nypInsurancesService: NypInsurancesService,
    protected nypUserService: NypUserService,
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<Policy>> | Promise<Observable<Policy>> | Observable<Policy> {
    const products = NypInsurancesService.products;
    console.log(products)
    const id = route.paramMap.get('id');
    const policyReq = this.nypInsurancesService.getInsuranceById(parseInt(id, 10));
    const labelStatusTranslationReq = this.getlabelStatusTranslation();

    return forkJoin([policyReq, labelStatusTranslationReq])
      .pipe(mergeMap(([policy, labelStatusTranslation]) => {
        const paymentId = policy.product.payment_methods?.find(v => v)?.id;
        const payment = { payment_methods: policy.product.payment_methods?.filter(pm => pm.id == paymentId) };

        DataService.POLICY_PAYMENT_ID = paymentId;

        const requests = [of(policy), of(policy.payment), /* of(payment),  */ of(labelStatusTranslation)];
        return forkJoin(requests);
      }))
      .pipe(map(([policy, wallets, /* paymentMethods, */ labelStatusTranslation]) => {
        let response = this.convertPolicy(policy, wallets, /* paymentMethods, */ labelStatusTranslation, products);
        console.log(response)
        return response;
      }));
  }

  convertPolicy(policy: any, wallets: any, /* paymentMethods: any, */ labelStatusTranslation: any, products: any): Policy {
    if (policy.product.product_code == 'ehealth-quixa-homage')
      policy.product.product_code = 'ehealth-quixa-standard';
    else if (policy.product.product_code == 'tim-my-sci')
      policy.product.product_code = 'tim-for-ski-silver';

    const product = products?.products?.find(product => product?.product_code == policy.product.product_code) ?? policy.product;
    console.log(product)
    console.log(policy)

    if (policy.payment === null) {
      policy.payment = this.paymentUnknown;
    }
    /* const paymentMethod = this.isBankTransferPaymentMethod(policy.payment.payment_method_id, paymentMethods, bankTransferName)
      ? this.createBankTransferPaymentMethod(paymentMethods, bankTransferName)
      : this.computePaymentMethodFromPayment(policy.payment, wallets); */


    return {
      id: policy.id,
      order_id: policy.order_id,
      addons: policy.addons,
      name: policy.product.name,
      imageUrl: ImageHelper.computeImage(policy.product),
      policyNumber: policy.policy_number,
      masterPolicyNumber: policy.master_policy_number,
      status: policy.status,
      statusLabel: this.computeStatusLabel(policy.status, labelStatusTranslation),
      paymentMethod: /* paymentMethod ? paymentMethod : {} */policy.payment.payment_sources[0].paymentMethod === 'NOPAY' ? policy.payment.payment_sources[0].paymentMethod : null,
      /*       price: policy.payment.amount, */
      price: policy.payment.amount || policy.price,
      currency: 'EUR',
      startDate: moment(policy.start_date).toDate(),
      expirationDate: moment(policy.expiration_date).toDate(),
      completedAt: moment(policy.completed_at).toDate(),
      certificateUrl: policy.certificate,
      surveyUrl: policy.adequacy_survey_url,
      orderCode: policy.orderCode,
      setInfoUrl: policy.information_package_url,
      canOpenClaim: this.isClaimEligible(policy, product),
      product: policy.product,
      insured_is_contractor: policy.insured_is_contractor,
      insuredEntities: policy.insured_entities,
      variant: policy.variant,
      insurance_info: policy.insurance_info,
      pet_properties: policy.pet_properties,
      appliance_properties: policy.appliances_properties,
      actions: policy.actions_availability,// policy.actions_availability,
      wallets: wallets,
      renewCandidate: policy.renew_candidate,
      papery_docs: policy.papery_docs || false,
      external_id: policy.external_id,
      subscription: policy.subscription,
      installments: policy.installments,
      payment_frequency: policy.payment_frequency,
      refund_requested: policy.refund_requested,
      withdrawal_requested: policy.withdrawal_requested,
      total_addons_price: policy.total_addons_price,
      payments: policy.payment?.payment_sources[0]?.payments?.[0],
      payment_sources: policy.payment?.payment_sources,
    };
  }

  isClaimEligible(insurance: Insurance, product): boolean {
    // if (insurance.actions_availability) {
    if (product?.actions_availability && [POLICY_STATUS.VERIFIED, POLICY_STATUS.CANCELED, POLICY_STATUS.UNVERIFIED].some(status => status == insurance.status)) {
      // return insurance.actions_availability.claim_eligible;
      return false;
    }
    return true;
    //return insurance.claim.can_open;
    // return product?.claim?.can_open || product?.claim?.can_open_claim // da controllare
  }


  public computePaymentMethodFromPayment(payment, wallets) {
    if (!!payment.payment_source && !!payment.payment_source.type
      && payment.payment_source.type.includes('PaypalBraintree')) {
      const paymentSource = payment.payment_source;
      return {
        id: paymentSource.id,
        type: paymentSource.cc_type,
        holder: paymentSource.name,
        email: paymentSource.data && paymentSource.data.email,
        lastDigits: paymentSource.last_digits,
        expiration: `${paymentSource.month}/${paymentSource.year}`,
        sourceType: paymentSource.type
      };
    }
    return this.computePaymentMethod(payment.source_id, wallets);
  }

  private computePaymentMethod(source_id: number, wallets: any): any {
    let wallet = wallets.payment_sources?.find(w => w.id === source_id);
    if (wallet === undefined) {
      wallet = this.paymentUnknown;
    }
    return {
      id: wallet.id,
      type: wallet.cc_type,
      holder: wallet.name,
      email: wallet.data && wallet.data.email,
      lastDigits: wallet.last_digits,
      expiration: `${wallet.month}/${wallet.year}`,
    };
  }

  private getlabelStatusTranslation(): Observable<any> {
    const labelStatusTranslations = [
      this.kenticoTranslateService.getItem<any>('private_area.status_active').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem<any>('private_area.status_verified').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem<any>('private_area.status_unverified').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem<any>('private_area.status_expired').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem<any>('private_area.status_canceled').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem<any>('private_area.status_suspended').pipe(map<any, string>(item => item.value)),
    ];
    return zip(...labelStatusTranslations).pipe(take(1));
  }

  private computeStatusLabel(status: string, labelStatusTranslation: any): string {
    const statusLabels = labelStatusTranslation;
    switch (status) {
      case 'active':
        return statusLabels[0];
      case 'verified':
        return statusLabels[1];
      case 'draft':
        return statusLabels[2];
      case 'expired':
        return statusLabels[3];
      case 'canceled':
        return statusLabels[4];
      case 'suspended':
        return statusLabels[5];
      default:
        break;
    }
  }
  /* 
    isBankTransferPaymentMethod(policyPaymentIdNumber, paymentMethods, bankTransferName): boolean {
      const bankTransfer = paymentMethods.payment_methods.find(paymentMethod =>
        (paymentMethod.name === bankTransferName && paymentMethod.id === policyPaymentIdNumber)
      );
      return !!bankTransfer
        ? (bankTransfer.name === bankTransferName && bankTransfer.id === policyPaymentIdNumber)
        : false;
    }
  
    createBankTransferPaymentMethod(paymentMethods, bankTransferName) {
      const bankTransferPaymentMethod = paymentMethods.payment_methods.find(paymentMethod =>
        paymentMethod.name === bankTransferName
      );
      return {
        id: bankTransferPaymentMethod.id,
        name: bankTransferPaymentMethod.name,
        type: bankTransferPaymentMethod.type,
      };
    } */

}
