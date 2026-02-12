import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SportInsuredItems, IOrderRequest, IOrderResponse, IProduct, IQandA, RecursivePartial, UpdateOrderRequest } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_SPORT_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { TimSportCheckoutService, } from './checkout.service';

@Injectable({
  providedIn: 'root'
})
export class TimSportApiService {
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
        map(response => response.find(product => product.code == TIM_SPORT_PRODUCT_NAME)),
        filter(sport => !!sport?.code),
        take(1),
        map(sport => {
          sport
            .packets
            .map(packet => packet
              .warranties
              .sort((a, b) => translationPosition[a.translationCode] - translationPosition[b.translationCode])
            );
          return sport;
        }),
        tap(sport => this.nypDataService.CurrentProduct$.next(sport)),
      );
  }

  public getOrder(idOrder: string): Observable<RecursivePartial<IOrderResponse<SportInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<SportInsuredItems>> }>(this.PATHS.GET_ORDER + idOrder)
      .pipe(
        map(response => response.data),
        map(response => {
          response.insurancePremium = Number(response?.orderItem?.[0]?.price || 0);
          return response;
        }),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(() => TimSportCheckoutService.loadFieldToRecover()),
      );
  }

  public getOrderById(idOrder: string): Observable<RecursivePartial<IOrderResponse<SportInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<SportInsuredItems>> }>(this.PATHS.GET_ORDER_ID + idOrder)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(response => TimSportCheckoutService.fieldsToRecover = response.fieldToRecover as FieldsToRecover),
        tap(() => TimSportCheckoutService.loadFieldToRecover())
      );
  }

  public putOrder(data: RecursivePartial<UpdateOrderRequest<SportInsuredItems>> = {}): Observable<RecursivePartial<IOrderResponse<SportInsuredItems>>> {
    const fields2recover = TimSportCheckoutService.persistFieldToRecover();

    data = {
      customerId: data.customerId ?? this.nypDataService.Order$.value?.customerId,
      productId: data.productId ?? this.nypDataService.Order$.value?.productId,
      packet: data.packet ?? this.nypDataService.Order$.value?.packet?.data,
      orderCode: data.orderCode ?? this.nypDataService.Order$.value?.orderCode,
      price: data.price ?? +this.nypDataService.Order$.value?.orderItem?.[0]?.price,
      insuredItems: (data.insuredItems ?? this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item) as RecursivePartial<SportInsuredItems>,
      paymentType: data.paymentType ?? this.nypDataService.Order$.value?.paymentType,
      anagState: data.anagState ?? this.nypDataService.Order$.value?.anagStates?.state,
      chosenWarranties: data.chosenWarranties ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.warranties,
      packetCombination: data.packetCombination ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.packetCombination,
    };

    return this.httpClient.put<{ data: RecursivePartial<IOrderResponse<SportInsuredItems>> }>(this.PATHS.PUT_ORDER + data?.orderCode, {
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
            price: data?.price ?? this.nypDataService.Order$.value?.orderItem?.[0]?.price,
            insured_item: {
              ...data.insuredItems,
              seller_code: data.insuredItems?.seller_code ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as SportInsuredItems).seller_code
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
            warranties: data?.chosenWarranties || this.nypDataService.Order$.value.packet.data.warranties || [],
            packetCombination: data?.packetCombination,
          }
        }
      }
    } as RecursivePartial<IOrderRequest<SportInsuredItems>>)
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
        questionId: rnr.questionId,
        answerId: rnr.answerId,
      }))
    });
  }

  public quote(body: RecursivePartial<{ data: { customerId: number; orderId: string; productId: number; } }>): Observable<RecursivePartial<IOrderResponse<SportInsuredItems>>> {
    return this.httpClient.post<{ data: RecursivePartial<IOrderResponse<SportInsuredItems>> }>(this.PATHS.POST_QUOTE, body)
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
