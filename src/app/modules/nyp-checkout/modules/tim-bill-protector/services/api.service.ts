import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BillProtectorInsuredItems, IOrderRequest, IOrderResponse, IProduct, IQandA, RecursivePartial, UpdateOrderRequest } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_BILL_PROTECTOR_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { TimBillProtectorCheckoutService, } from './checkout.service';

@Injectable({
  providedIn: 'root'
})
export class TimBillProtectorApiService {
  private readonly PATHS = {
    GET_PRODUCT: '/api/latest/products',
    POST_ORDER: '/api/latest/order',
    PUT_ORDER: '/api/latest/order/',
    GET_ORDER: '/api/latest/order/',
    GET_ORDER_ID: '/api/latest/orderId/',
    POST_QUOTE: '/api/latest/quote',
    POST_SURVEY: '/api/latest/survey',
    GET_CHECK_EXISTING_POLICY: '/api/latest/order/checkExistingPolicy/{orderCode}',
  }

  constructor(
    private httpClient: HttpClient,
    private nypDataService: NypDataService,
  ) { }

  public getProduct(): Observable<RecursivePartial<IProduct>> {
    const translationPosition = {
      'nyp_products_data.w_morte_t': 4,
      'nyp_products_data.w_invalidita_permanente_totale_t': 3,
      'nyp_products_data.w_inabilita_temporanea_totale_t': 2,
      'nyp_products_data.w_ricovero_ospedaliero_t': 1,
    };
    return this.nypDataService.Products$
      .pipe(
        map(response => response.find(product => product.code == TIM_BILL_PROTECTOR_PRODUCT_NAME)),
        filter(billProtector => !!billProtector?.code),
        take(1),
        map(billProtector => {
          billProtector
            .packets
            .map(packet => packet
              .warranties
              .sort((a, b) => translationPosition[a.translationCode] - translationPosition[b.translationCode])
            );
          return billProtector;
        }),
        tap(billProtector => this.nypDataService.CurrentProduct$.next(billProtector)),
      );
  }

  public getOrder(idOrder: string): Observable<RecursivePartial<IOrderResponse<BillProtectorInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<BillProtectorInsuredItems>> }>(this.PATHS.GET_ORDER + idOrder)
      .pipe(
        map(response => response.data),
        map(response => {
          response.insurancePremium = Number(response?.orderItem?.[0]?.price || 0);
          return response;
        }),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(() => TimBillProtectorCheckoutService.loadFieldToRecover()),
      );
  }

  public getOrderById(idOrder: string): Observable<RecursivePartial<IOrderResponse<BillProtectorInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<BillProtectorInsuredItems>> }>(this.PATHS.GET_ORDER_ID + idOrder)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(response => TimBillProtectorCheckoutService.fieldsToRecover = response.fieldToRecover as FieldsToRecover),
        tap(() => TimBillProtectorCheckoutService.loadFieldToRecover())
      );
  }

  public putOrder(data: RecursivePartial<UpdateOrderRequest<BillProtectorInsuredItems>> = {}): Observable<RecursivePartial<IOrderResponse<BillProtectorInsuredItems>>> {
    const fields2recover = TimBillProtectorCheckoutService.persistFieldToRecover();

    data = {
      customerId: data.customerId ?? this.nypDataService.Order$.value?.customerId,
      productId: data.productId ?? this.nypDataService.Order$.value?.productId,
      packet: data.packet ?? TimBillProtectorCheckoutService.ChosenPackets$.value.packet,
      orderCode: data.orderCode ?? this.nypDataService.Order$.value?.orderCode,
      price: data.price ?? +TimBillProtectorCheckoutService.ChosenPackets$.value.price,
      insuredItems: (data.insuredItems ?? this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item) as RecursivePartial<BillProtectorInsuredItems>,
      paymentType: data.paymentType ?? this.nypDataService.Order$.value?.paymentType,
      anagState: data.anagState ?? this.nypDataService.Order$.value?.anagStates?.state,
      chosenWarranties: data.chosenWarranties ?? TimBillProtectorCheckoutService.ChosenPackets$.value.warranties,
      packetCombination: data.packetCombination ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.packetCombination,
    };

    return this.httpClient.put<{ data: RecursivePartial<IOrderResponse<BillProtectorInsuredItems>> }>(this.PATHS.PUT_ORDER + data?.orderCode, {
      data: {
        customerId: data?.customerId ?? 1,
        createdBy: `${data?.customerId ?? 1}`,
        updatedBy: `${data?.customerId ?? 1}`,
        anagState: data?.anagState,
        fieldToRecover: fields2recover,
        orderItem: [
          {
            product_id: data?.productId,
            packetId: data?.packet?.id,
            price: data?.price,
            insured_item: {
              identity_document_type: data?.insuredItems?.identity_document_type ?? '',
              identity_document_number: data?.insuredItems?.identity_document_number ?? '',
              identity_document_issue_date: data?.insuredItems?.identity_document_issue_date ?? '',
              identity_document_issuer: data?.insuredItems?.identity_document_issuer ?? '',
              identity_document_issuer_state: data?.insuredItems?.identity_document_issuer_state ?? '',
              identity_document_issuer_city: data?.insuredItems?.identity_document_issuer_city ?? '',
              politically_exposed: data?.insuredItems?.politically_exposed ?? false,
              beneficiaries_type: data?.insuredItems?.beneficiaries_type ?? '',
              beneficiaries: data?.insuredItems?.beneficiaries?.length > 0 ? data?.insuredItems?.beneficiaries : undefined,
              oppucation_type: data?.insuredItems?.oppucation_type ?? undefined,
              occupation_time: data?.insuredItems?.occupation_time ?? undefined,
              seller_code: data.insuredItems?.seller_code ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as BillProtectorInsuredItems).seller_code
            },
            quantity: 1,
          }
        ],
        paymentType: data?.paymentType,
        product_id: data?.productId,
        packetId: data?.packet?.id,
        chosenWarranties: {
          data: {
            informativa: data?.packet?.configuration?.packetDoc,
            packetId: data?.packet?.id,
            emission: data?.packet?.configuration?.emission,
            warranties: data?.chosenWarranties,
            packetCombination: data?.packetCombination,
          }
        }
      }
    } as RecursivePartial<IOrderRequest<BillProtectorInsuredItems>>)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
      );
  }

  public postSurvey(reqNres: IQandA[]): Observable<void> {
    return this.httpClient.post<void>(this.PATHS.POST_SURVEY, {
      data: reqNres.map(rnr => ({
        orderCode: this.nypDataService.Order$.value.orderCode,
        orderItemId: this.nypDataService.Order$.value.orderItem[0].id,
        customerId: this.nypDataService.Order$.value.customerId,
        productId: this.nypDataService.Order$.value.productId,
        questionId: rnr.questionId,
        answerId: rnr.answerId,
      }))
    });
  }

  public quote(body: RecursivePartial<{ data: { customerId: number; orderId: string; productId: number; } }>): Observable<RecursivePartial<IOrderResponse<BillProtectorInsuredItems>>> {
    return this.httpClient.post<{ data: RecursivePartial<IOrderResponse<BillProtectorInsuredItems>> }>(this.PATHS.POST_QUOTE, body)
      .pipe(
        map(response => response.data),
      );
  }

  public checkExistingPolicy(): Observable<{ data: string }> {
    const orderId = this.nypDataService.OrderCode;
    if (!orderId) {
      throw new Error('OrderCode non è definito o è vuoto.');
    }
    const url = this.PATHS.GET_CHECK_EXISTING_POLICY.replace('{orderCode}', orderId);
    return this.httpClient.get<{ data: string }>(url).pipe(
      map(response => response)
    );
  }

}
