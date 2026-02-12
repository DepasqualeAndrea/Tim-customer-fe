import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ForSkiInsuredItems, IOrderManagerRequest, IOrderRequest, IOrderResponse, IProduct, IQandA, RecursivePartial, UpdateOrderRequest } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_FOR_SKI_GOLD_PRODUCT_NAME, TIM_FOR_SKI_PLATINUM_PRODUCT_NAME, TIM_FOR_SKI_SILVER_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { TimForSkiCheckoutService, } from './checkout.service';
import { DataService } from '@services';

@Injectable({
  providedIn: 'root'
})
export class TimForSkiApiService {
  private readonly PATHS = {
    GET_PRODUCT: '/api/latest/products',
    POST_ORDER: '/api/latest/order',
    PUT_ORDER: '/api/latest/order/',
    GET_ORDER: '/api/latest/order/',
    GET_ORDER_ID: '/api/latest/orderId/',
    POST_QUOTE: '/api/latest/quote',
    POST_SURVEY: '/api/latest/survey',
    POST_WALLET: 'v1/wallet',
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
    private dataService: DataService,
  ) { }

  public pay(card: any): Observable<any> {
    const paymentIds: { [key: number]: string } = { 1: 'SINGLE', 2: 'RECURRENT' };
    const cardIds: { [key: string]: string } = { 1: 'CC', 2: 'CC' };
    const pitype: { [key: string]: string } = { 'PPAL': 'PPAL' };

    return this.httpClient.post<any>(this.PATHS.POST_WALLET, {
      amount: card.amount,
      currency: "EUR",
      paymentFrequency: paymentIds[card.payment_method_id],
      cardType: pitype[card.pitype] || cardIds[card.payment_method_id],
      billingId: card.billing_id,
      orderId: card.order_number,
      policyId: null
    });
  }
  public getProduct(productCode: string = (TIM_FOR_SKI_SILVER_PRODUCT_NAME || TIM_FOR_SKI_GOLD_PRODUCT_NAME || TIM_FOR_SKI_PLATINUM_PRODUCT_NAME)): Observable<RecursivePartial<IProduct>> {
    const translationPosition = {
      'nyp_products_data.w_responsabilita_civile_t': 1,
      'nyp_products_data.w_rimborso_spese_mediche_da_infortunio_t': 2,
      'nyp_products_data.w_invalidita_permanente_e_decesso_da_infortunio_t': 3,
      'nyp_products_data.w_rimborso_spese_recupero_e_salvataggio_t': 4,
      'nyp_products_data.w_rimborso_costi_t': 5,
      'nyp_products_data.w_tutela_legale_t': 6,

    };
    return this.nypDataService.Products$
      .pipe(
        map(response => response.find(product => product.code == productCode)),
        filter(ski => !!ski?.code),
        take(1),
        map(ski => {
          ski
            .packets
            .map(packet => packet
              .warranties
              .sort((a, b) => translationPosition[a.translationCode] - translationPosition[b.translationCode])
            );
          return ski;
        }),
        tap(ski => this.nypDataService.CurrentProduct$.next(ski)),
      );
  }

  public getOrder(idOrder: string): Observable<RecursivePartial<IOrderResponse<ForSkiInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<ForSkiInsuredItems>> }>(this.PATHS.GET_ORDER + idOrder)
      .pipe(
        map(response => response.data),
        map(response => {
          response.insurancePremium = Number(response?.orderItem?.[0]?.price || 0);
          return response;
        }),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(() => TimForSkiCheckoutService.loadFieldToRecover()),
        tap(() => {
          this.nypDataService.Order$.value.fieldToRecover?.nonStatic?.
            filter((l: [string, any]) => l?.[0]?.includes?.('dataService.'))?.
            forEach((l: [string, any]) => {
              const [name, value] = [l?.[0]?.split?.('dataService.')?.[1], l?.[1]];
              this.dataService[name] = value;
            });
        }),
      );
  }

  public getOrderById(idOrder: string): Observable<RecursivePartial<IOrderResponse<ForSkiInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<ForSkiInsuredItems>> }>(this.PATHS.GET_ORDER_ID + idOrder)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(response => TimForSkiCheckoutService.fieldsToRecover = response.fieldToRecover as FieldsToRecover),
        tap(() => TimForSkiCheckoutService.loadFieldToRecover())
      );
  }
  private formatBirthDate(date: string | { year: number; month: number; day: number }): string {
    if (typeof date === 'string') {
      return date.replace(/\//g, '-');
    }

    const { year, month, day } = date;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  public putOrder(data: RecursivePartial<UpdateOrderRequest<ForSkiInsuredItems>> = {}): Observable<RecursivePartial<IOrderResponse<ForSkiInsuredItems>>> {
    const fields2recover = TimForSkiCheckoutService.persistFieldToRecover();
    fields2recover.nonStatic.push(
      ['dataService.firstDay', this.dataService.firstDay],
      ['dataService.lastDay', this.dataService.lastDay],
    );

    data = {
      customerId: data.customerId ?? this.nypDataService.Order$.value?.customerId,
      productId: data.productId ?? this.nypDataService.Order$.value?.productId,
      packet: data.packet ?? this.nypDataService.Order$.value?.packet?.data,
      orderCode: data.orderCode ?? this.nypDataService.Order$.value?.orderCode,
      price: data.price ?? +this.nypDataService.Order$.value?.orderItem?.[0]?.price,
      insuredItems: (data.insuredItems ?? this.nypDataService.Order$.value?.orderItem?.[0].insured_item) as RecursivePartial<RecursivePartial<ForSkiInsuredItems>>,
      paymentType: data.paymentType ?? this.nypDataService.Order$.value?.paymentType,
      anagState: data.anagState ?? this.nypDataService.Order$.value?.anagStates?.state,
      chosenWarranties: data.chosenWarranties ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.warranties,
      packetCombination: data.packetCombination ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.packetCombination,
    };

    return this.httpClient.put<{ data: RecursivePartial<IOrderResponse<ForSkiInsuredItems>> }>(
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
            quantity: data?.quantity ?? this.nypDataService.Order$.value.orderItem[0].quantity,
            insured_item: {
              ...data.insuredItems,
              seller_code: data.insuredItems?.seller_code ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as ForSkiInsuredItems).seller_code
            },
          }],
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
      } as RecursivePartial<IOrderRequest<ForSkiInsuredItems>>)
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

  public quote(body: RecursivePartial<{ data: { customerId: number; orderId: string; productId: number; } }>): Observable<RecursivePartial<IOrderResponse<ForSkiInsuredItems>>> {
    return this.httpClient.post<{ data: RecursivePartial<IOrderResponse<ForSkiInsuredItems>> }>(this.PATHS.POST_QUOTE, body)
      .pipe(
        map(response => response.data),
      );
  }

}
