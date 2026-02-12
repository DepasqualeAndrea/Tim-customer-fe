import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BillProtectionInsuredItems, ForSkiInsuredItems, IOrderManagerRequest, IOrderRequest, IOrderResponse, IProduct, NypPendingPolicy, NypPolicy, NypPolicyResponseBE_NOFE, OrderItemPendingPolicy, ProtezioneCasaInsuredItems, RecursivePartial, TransactionPendingPolicy, ViaggiAnnualeInsuredItems, ViaggiBreveInsuredItems, ViaggiRoamingInsuredItems } from 'app/modules/nyp-checkout/models/api.model';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { NypDataService } from './nyp-data.service';
import { POLICY_STATUS } from '@NYP/ngx-multitenant-core';
import { ImageHelper } from 'app/shared/helpers/image.helper';

@Injectable({ providedIn: 'root' })
export class NypApiService {
  private readonly PATHS = {
    GET_PRODUCT: '/api/latest/products',
    POST_ORDER: '/api/latest/order',
    WITHDRAW_POLICY: '/api/latest/withdraw',
    DEACTIVATE_POLICY: 'api/latest/deactivate',
    POST_LEGACY_REQUEST: '/api/latest/order/legacyRequest/',
    GET_POLICY: '/api/v1/policy',
    GET_PENDING_POLICY: '/api/v1/pending-payments',
  }

  private readonly POLICY_STATUS_MAPPER: { [key: string]: string | undefined } = {
    // verified & unverified ?
    'Draft': POLICY_STATUS.VERIFIED,
    'Verified': POLICY_STATUS.VERIFIED,
    'Active': POLICY_STATUS.ACTIVE,
    'Failed': undefined,
    'Suspended': POLICY_STATUS.SUSPENDED,
    'Revoked': POLICY_STATUS.CANCELED,
    'Expired': POLICY_STATUS.EXPIRED,
    'Renewed': POLICY_STATUS.ACTIVE,
    'Withdrawn': POLICY_STATUS.CANCELED,
    'Canceled': POLICY_STATUS.CANCELED,
  };

  constructor(private httpClient: HttpClient, private nypDataService: NypDataService) { }

  public getProduct(): Observable<RecursivePartial<IProduct[]>> {
    return this.httpClient.get<{ data: RecursivePartial<IProduct[]> }>(this.PATHS.GET_PRODUCT)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Products$.next(response)),
      );
  }

  public legacyRequest(orderCode: string, payload: IOrderManagerRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.PATHS.POST_LEGACY_REQUEST}${orderCode}`, payload);
  }

  public postOrder(data: { customerId: number, productId: number, packetId: number, daysNumber?: number, quantity?: number, isSeasonal?: boolean, totalPriceSeasonal?: number, firstDay?: Date, lastDay?: Date, destination?: string, totalDays?: number, start_date?: any, expiration_date?: any, overSeventy?: string, underSeventy?: string, destinatioCode?: string, destinationName?: string, }): Observable<RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems | BillProtectionInsuredItems | ForSkiInsuredItems | ViaggiRoamingInsuredItems | ViaggiBreveInsuredItems>>> {
    return this.httpClient.post<{ data: RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems | BillProtectionInsuredItems | ForSkiInsuredItems | ViaggiRoamingInsuredItems | ViaggiBreveInsuredItems>> }>(this.PATHS.POST_ORDER, {
      data: {
        customerId: data?.customerId ?? 1,
        createdBy: `${data?.customerId ?? 1}`,
        updatedBy: `${data?.customerId ?? 1}`,
        anagState: "Draft",
        orderItem: [
          {
            product_id: data?.productId,
            packetId: data?.packetId,
            insured_item: {
              days_number: data?.daysNumber,
              destination: data?.destination ?? this.nypDataService.Order$.value?.orderItem[0]?.insured_item.destination,
              overSeventy: data.overSeventy ?? this.nypDataService.Order$.value?.orderItem[0]?.insured_item.overSeventy,
              underSeventy: data.underSeventy ?? this.nypDataService.Order$.value?.orderItem[0]?.insured_item.underSeventy,

            },
            quantity: data?.quantity,
            days: data?.daysNumber,
            isSeasonal: data?.isSeasonal,
            totalPriceSeasonal: data?.totalPriceSeasonal,
            firstDay: data?.firstDay,
            lastDay: data?.lastDay,
            totalDays: data?.totalDays,
            start_date: data?.start_date ?? this.nypDataService.Order$.value?.orderItem[0]?.start_date,
            destination: data?.destination ?? this.nypDataService.Order$.value?.orderItem[0]?.destination,

          }
        ],
        paymentType: "Paypal",
        product_id: data?.productId,
        packetId: data?.packetId,
      }
    } as RecursivePartial<IOrderRequest<ProtezioneCasaInsuredItems | BillProtectionInsuredItems | ForSkiInsuredItems | ViaggiRoamingInsuredItems>>)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(response => this.nypDataService.CurrentProduct$.pipe(
          filter(currentProduct => !!currentProduct?.code),
          take(1),
        ).subscribe(),
        ),
      );
  }

  public withdraw(policy_id: number | string, message: string): Observable<any> {
    return this.httpClient.post<any>(`${this.PATHS.WITHDRAW_POLICY}`, { policy_id: policy_id, message: message });
  }

  public deactivatePolicy(policyId: string | number): Observable<any> {
    return this.httpClient.post<any>(`${this.PATHS.DEACTIVATE_POLICY}/${policyId}`, {});
  }

  public getPolicies(): Observable<NypPolicy[]> {
    return this.httpClient.get<{ data: NypPolicyResponseBE_NOFE[] }>(this.PATHS.GET_POLICY)
      .pipe(
        take(1),
        map(response => response.data.map((insurance: NypPolicyResponseBE_NOFE) => ({
          id: insurance.id,
          order_id: insurance.orderId,
          policy_number: insurance.policyCode,
          master_policy_number: insurance.masterPolicyNumber,
          external_id: insurance?.externalCode,
          quantity: insurance.quantity,
          start_date: insurance.startDate,
          expiration_date: insurance.endDate,
          insured_is_contractor: insurance.insuredIsContractor,
          papery_docs: false, //non c'è ancora
          withdrawal_requested: false, //non c'è ancora,
          refund_requested: false, //non c'è ancora,
          replace_enqueued_at: null, // non c'è ancora,
          subscription_state: null, // non c'è ancora,
          payment_frequency: insurance.payment.paymentFrequency,
          days_number: null, // non c'è ancora,
          appliances_properties: null, // non c'è ancora,
          pet_properties: null, // non c'è ancora, forse servirà uno switch
          house_properties: null, // non c'è ancora,
          status: insurance.state.state,
          actions_availability: {     // TESTING DA MODIFICARE IN SEGUITO
            deactivable: insurance.isDeactivable,
            //     reactivable: false,
            //     suspendable: false,
            withdrawable: insurance.isWithdrawable,
            //     renewable: false,
            //     downsellable: false,
            //     markable_as_unrenewable: false,
            //     silent_renewable: true,
            //     claim_eligible: true,
            //     deactivate_and_withdraw: false,
            //     recisionable: false,
            //     refundable: false,
            //     coupon_used: false
          }, // non c'è ancora, sembra non usato
          insurance_info: {}, // non c'è ancora,
          installments: {}, // non c'è ancora, sembra non usato
          certificate: insurance.certificateLink, //diverso per ogni prodotto, non c'è ancora
          information_package_url: insurance.product.packets?.[0]?.information_package,
          adequacy_survey_url: null,
          name: insurance.product.productDescription,
          state: null, // non c'è ancora
          marked_as_renewable: insurance.markedAsRenewable,
          price: insurance.insurancePremium, //insurancePremium
          // claim: {            // TESTING DA MODIFICARE IN SEGUITO
          //     can_open: true,
          //     type: "modal",
          //     content: null
          // },
          answers: [],
          insured_entities: {
            pets: [{
              kind: insurance.payment.paymentSources?.[0]?.insuredItem?.kind,
              microchip_code: insurance.payment.paymentSources?.[0]?.insuredItem?.microchip_code,
              birth_date: insurance.payment.paymentSources?.[0]?.insuredItem?.birth_date,
              name: insurance.payment.paymentSources?.[0]?.insuredItem?.name
            }]
          },
          orderCode: insurance.payment?.paymentSources?.filter((pay: any) => !!pay?.orderId)?.pop()?.orderId,
          subscription: insurance.subscription,
          receipt_certificates: null,
          total_addons_price: null,
          variant: {},
          addons: (insurance.payment.paymentSources?.[0]?.quotation?.addons || []).map((addons: any) => ({
            id: addons.id,
            net: addons.net,
            tax: addons.tax,
            name: addons.name,
            price: addons.price,
            maximal: addons.maximal,
            taxable: addons.taxable,
            selected: addons.selected,
            commission: addons.commission,
            description: addons.description

          })),
          completed_at: insurance.createdAt, //da modificare con completed_at
          order_number: insurance.orderCode,
          only_contractor: false,
          maximum_insurable: 1,
          payment: {
            paymemt_method_id: insurance.payment.paymentSources?.paymentMethodId,
            payment_Trx: insurance.payment.paymentTrx,
            payment_token: insurance.payment.paymentToken,
            payment_sources: insurance.payment.paymentSources?.map((source: any) => ({
              id: source?.id_cc,
              billingId: source?.billingId,
              payment_method_id: source?.paymentMethodId,
              paymentMethod: source?.paymentMethod,
              type: source?.cc_type,
              policy_token: source?.policy_token,
              credit_token: source?.creditToken,
              lastDigits: source?.numberCard,
              expiration: source?.cardMonth + "/" + source?.cardYear,
              holder: source?.cardName,
              order_id: source?.orderId,
              policy_code: source?.policyCode,
              customer_id: source?.customerId,
              amount: source?.amount,
              payments: [{
                price: insurance.product.price,
                state: source?.paymentStatus,
                current_billing_date: source?.currentBillingDate
              }]
            })) || []
          },
          product: {
            id: insurance.product.id,
            product_code: insurance.product.code,
            sku: insurance.product.packets?.[0]?.sku,     //"genertel-rca",
            name: insurance.product.productDescription, //"RCA Digital Classic",
            title_prod: "",
            short_description: insurance.product.short_description,
            description: insurance.product.description,
            conditions: insurance.product.conditions,
            information_package: insurance.product.information_package,  //"https://fca-bank-integration.s3.amazonaws.com/spree/products/information_packages/000/000/012/original/GT_FCA_Auto_Digital_Classic.pdf?1675869750",
            conditions_package: insurance.product.conditions_package,//"https://fca-bank-integration.s3.amazonaws.com/spree/products/conditions_packages/000/000/012/original/Furgoni___Van_Digital_Classic.pdf?1618586701",
            display_price: insurance.product.display_price,
            price: insurance.product.price,
            only_contractor: insurance.product.only_contractor,
            maximum_insurable: insurance.product.maximum_insurable,
            can_open_claim: insurance.product.can_open_claim,
            holder_maximum_age: insurance.product.holder_maximum_age,
            holder_minimum_age: insurance.product.holder_minimum_age,
            show_in_dashboard: insurance.product.show_in_dashboard,
            show_as_recommended: false,
            business: insurance.product.business,
            hide_policy: false,
            images: (insurance.product?.images?.images || []).map((image: any) => ({
              id: null,
              mini_url: image.mini_url,
              large_url: image.large_url,
              small_url: image.small_url,
              image_type: image.image_type,
              product_url: image.product_url,
              original_url: image.original_url,
            })),
            payment_methods: [{
              id: insurance.payment.paymentSources?.[0]?.paymentMethodId, // 2
              name: insurance.product.productsPaymentMethods?.[0]?.paymentMethod.paymentMethod, // "Braintree"
              type: insurance.payment.paymentSources?.[0]?.paymentMethodsType//"Solidus::Gateway::BraintreeGateway"
            }],
            addons: [],
            recurring: insurance.product.recurring,
            properties: [],
            type: "Genertel::RcAuto::Product",
            category: null,
            categories: []
          },
          renew_candidate: null,
        })
        ) as any as NypPolicy[]),
        map(response => response.map(policy => Object.assign(policy, {
          canOpenClaim: [POLICY_STATUS.VERIFIED, POLICY_STATUS.CANCELED, POLICY_STATUS.UNVERIFIED].some(status => status == policy.status),
          status: this.POLICY_STATUS_MAPPER[policy.status] ?? '',
          imageUrl: ImageHelper.computeImage(policy.product),
        }))),
        map(insurances => insurances.sort((a, b) => b.completed_at.localeCompare(a.completed_at))),
        map(insurances => insurances?.length > 0 ? insurances : undefined),
      );
  }
  public getPendingPolicies(): Observable<NypPendingPolicy[]> {
    return this.httpClient.get<{ [key: string]: { orderItem: OrderItemPendingPolicy, transactions: TransactionPendingPolicy[] } }>(this.PATHS.GET_PENDING_POLICY)
      .pipe(
        take(1),
        //map(response => {
        //  const res: NypPendingPolicy[] = [];
        //
        //  Object.entries(response)
        //    .forEach(([k,v]) => {
        //      res.push({
        //        policyCode: k,
        //        orderItem: v.orderItem,
        //        transactions: v.transactions,
        //      })
        //    })
        //
        //  return res;
        //}),
        map(response => Object.entries(response)
          .map(([k, v]) => ({
            policyCode: k,
            orderItem: v.orderItem,
            transactions: v.transactions,
          }))
        ),
        map(insurances => insurances.sort((a, b) => a.orderItem.id - b.orderItem.id)),
        map(insurances => insurances?.length > 0 ? insurances : undefined),
      );
  }
}
