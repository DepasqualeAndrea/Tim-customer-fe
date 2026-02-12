import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrderManagerRequest, IOrderRequest, IOrderResponse, IProduct, IQandA, CyberCustomerInsuredItems, RecursivePartial, UpdateOrderRequest } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_CYBER_CONSUMER_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { TimCyberConsumerCheckoutService } from './checkout.service';

@Injectable({
  providedIn: 'root'
})
export class TimCyberConsumerApiService {
  private readonly PATHS = {
    GET_PRODUCT: '/api/latest/products',
    POST_ORDER: '/api/latest/order',
    PUT_ORDER: '/api/latest/order/',
    GET_ORDER: '/api/latest/order/',
    GET_ORDER_ID: '/api/latest/orderId/',
    POST_QUOTE: '/api/latest/quote',
    POST_SURVEY: '/api/latest/survey',
    GET_CHECK_EXISTING_POLICY: '/api/latest/order/checkExistingPolicy/{orderCode}'
  }

  public GET_EMISSIONBODY(orderCode: string, packetId: number): IOrderManagerRequest {
    return {
      "addons": null,
      "channel": 'legacy',
      "order":
      {
        "line_items_attributes":
        {
          "0":
          {
            "variant_id": packetId
          }
        }
      },
      "orderCode": orderCode,
      "payment_type": null,
      "state": "confirm",
      "version": "v2"
    }
  }

  constructor(
    private httpClient: HttpClient,
    private nypDataService: NypDataService,
  ) { }

  public getProduct(): Observable<RecursivePartial<IProduct>> {
    const translationPosition = {
      'nyp_products_data.w_morte_t': 1,
      'nyp_products_data.w_invalidita_permanente_totale_t': 2,
      'nyp_products_data.w_inabilita_temporanea_totale_t': 3,
      'nyp_products_data.w_ricovero_ospedaliero_t': 4,
    };
    return this.nypDataService.Products$
      .pipe(
        map(response => response.find(product => product.code == TIM_CYBER_CONSUMER_PRODUCT_NAME)),
        filter(CyberCustomer => !!CyberCustomer?.code),
        take(1),
        map(CyberCustomer => {
          CyberCustomer
            .packets
            .map(packet => packet
              .warranties
              .sort((a, b) => translationPosition[a.translationCode] - translationPosition[b.translationCode])
            );
          return CyberCustomer;
        }),
        tap(CyberCustomer => {
          this.nypDataService.CurrentProduct$.next(CyberCustomer);
          try { localStorage.setItem('product_code', CyberCustomer.code); } catch { }
        }),
      );
  }

  public getOrder(idOrder: string): Observable<RecursivePartial<IOrderResponse<CyberCustomerInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<CyberCustomerInsuredItems>> }>(this.PATHS.GET_ORDER + idOrder)
      .pipe(
        map(response => response.data),
        map(response => {
          response.insurancePremium = Number(response?.orderItem?.[0]?.price || 0);
          return response;
        }),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(() => TimCyberConsumerCheckoutService.loadFieldToRecover()),
      );
  }

  public getOrderById(idOrder: string | number): Observable<RecursivePartial<IOrderResponse<CyberCustomerInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<CyberCustomerInsuredItems>> }>(this.PATHS.GET_ORDER_ID + idOrder)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(response => TimCyberConsumerCheckoutService.fieldsToRecover = response.fieldToRecover as FieldsToRecover),
        tap(() => TimCyberConsumerCheckoutService.loadFieldToRecover())
      );
  }
  private formatBirthDate(date: string | { year: number; month: number; day: number }): string {
    if (typeof date === 'string') {
      return date.replace(/\//g, '-');
    }

    const { year, month, day } = date;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  public putOrder(data: RecursivePartial<UpdateOrderRequest<CyberCustomerInsuredItems>> = {}): Observable<RecursivePartial<IOrderResponse<CyberCustomerInsuredItems>>> {
    const fields2recover = TimCyberConsumerCheckoutService.persistFieldToRecover();

    data = {
      customerId: data.customerId ?? this.nypDataService.Order$.value?.customerId,
      productId: data.productId ?? this.nypDataService.Order$.value?.productId,
      packet: data.packet ?? this.nypDataService.Order$.value?.packet?.data,
      orderCode: data.orderCode ?? this.nypDataService.Order$.value?.orderCode,
      price: data.price ?? +this.nypDataService.Order$.value?.orderItem?.[0]?.price,
      insuredItems: {
        seller_code: data.insuredItems?.seller_code ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as CyberCustomerInsuredItems)?.seller_code
      },
      paymentType: data.paymentType ?? this.nypDataService.Order$.value?.paymentType,
      anagState: data.anagState ?? this.nypDataService.Order$.value?.anagStates?.state,
    };

    return this.httpClient.put<{ data: RecursivePartial<IOrderResponse<CyberCustomerInsuredItems>> }>(
      this.PATHS.PUT_ORDER + data?.orderCode,
      {
        data: {
          customerId: data?.customerId ?? 1,
          createdBy: `${data?.customerId ?? 1}`,
          updatedBy: `${data?.customerId ?? 1}`,
          anagState: data?.anagState,
          fieldToRecover: fields2recover,
          orderItem: [{
            product_id: data?.productId,
            packetId: data?.packet?.id,
            price: data?.price,
            quantity: 1,
            insured_item: data.insuredItems,
          }],
          paymentType: data?.paymentType,
          product_id: data?.productId,
          packetId: data?.packet?.id,
        }
      } as RecursivePartial<IOrderRequest<CyberCustomerInsuredItems>>)
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

  public quote(body: RecursivePartial<{ data: { customerId: number; orderId: string; productId: number; } }>): Observable<RecursivePartial<IOrderResponse<CyberCustomerInsuredItems>>> {
    return this.httpClient.post<{ data: RecursivePartial<IOrderResponse<CyberCustomerInsuredItems>> }>(this.PATHS.POST_QUOTE, body)
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
