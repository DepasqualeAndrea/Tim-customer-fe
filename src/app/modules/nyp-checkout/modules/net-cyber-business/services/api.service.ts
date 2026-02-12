import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '@services';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { IOrderRequest, IOrderResponse, IProduct, IQandA, NetCyberBusinessInsuredItems, RecursivePartial, UpdateOrderRequest } from 'app/modules/nyp-checkout/models/api.model';
import { NET_CYBER_BUSINESS_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NetCyberBusinessCheckoutService } from './checkout.service';
import { FieldsToRecover } from '@NYP/ngx-multitenant-core';


@Injectable({
  providedIn: 'root'
})
export class NetCyberBusinessService {

  private readonly PATHS = {
    GET_PRODUCT: '/api/latest/products',
    POST_ORDER: '/api/latest/order',
    PUT_ORDER: '/api/latest/order/',
    GET_ORDER: '/api/latest/order/',
    GET_ORDER_ID: '/api/latest/orderId/',
    POST_QUOTE: '/api/latest/quote',
    POST_SURVEY: '/api/latest/survey',
  }


  constructor(
    private httpClient: HttpClient,
    private nypDataService: NypDataService,
    private dataService: DataService,
  ) { }


  public getProduct(): Observable<RecursivePartial<IProduct>> {
    return this.nypDataService.Products$
      .pipe(
        map(response => {
          const netCyberBusiness = response.find(product => product.code == NET_CYBER_BUSINESS_PRODUCT_NAME);
          this.dataService.setProduct(netCyberBusiness as any);
          return netCyberBusiness;
        }),
        filter(netCyberBusiness => !!netCyberBusiness?.code),
        take(1),
        tap(netCyberBusiness => this.nypDataService.CurrentProduct$.next(netCyberBusiness)),
      );
  }

  public getOrder(idOrder: string): Observable<RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>> }>(this.PATHS.GET_ORDER + idOrder)
      .pipe(
        map(response => response.data),
        map(response => {
          response.insurancePremium = Number(response?.orderItem?.[0]?.price || 0);
          return response;
        }),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(() => NetCyberBusinessCheckoutService.loadFieldToRecover()),
      );
  }

  public getOrderById(idOrder: string | number): Observable<RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>> }>(this.PATHS.GET_ORDER_ID + idOrder)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(response => NetCyberBusinessCheckoutService.fieldsToRecover = response.fieldToRecover as FieldsToRecover),
        tap(() => NetCyberBusinessCheckoutService.loadFieldToRecover())
      );
  }

  public putOrder(data: RecursivePartial<UpdateOrderRequest<NetCyberBusinessInsuredItems>> = {}): Observable<RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>>> {
    const fields2recover = NetCyberBusinessCheckoutService.persistFieldToRecover();

    data = {
      customerId: data.customerId ?? this.nypDataService.Order$.value?.customerId,
      productId: data.productId ?? this.nypDataService.Order$.value?.productId,
      packet: data.packet ?? this.nypDataService.Order$.value?.packet?.data,
      orderCode: data.orderCode ?? this.nypDataService.Order$.value?.orderCode,
      price: data.price ?? +this.nypDataService.Order$.value?.orderItem?.[0]?.price,
      insuredItems: {
        number_employees_exceeded: data.insuredItems?.number_employees_exceeded ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NetCyberBusinessInsuredItems).number_employees_exceeded,
        seller_code: data.insuredItems?.seller_code ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NetCyberBusinessInsuredItems).seller_code,
      },
      start_date: data.start_date ?? this.nypDataService.Order$.value.orderItem[0].insured_item.start_date,
      paymentType: data.paymentType ?? this.nypDataService.Order$.value?.paymentType,
      anagState: data.anagState ?? this.nypDataService.Order$.value?.anagStates?.state,
      chosenWarranties: data.chosenWarranties ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.warranties,
      packetCombination: data.packetCombination ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.packetCombination,
      packetDurationDescription: data.packetDurationDescription ?? this.nypDataService.Order$.value?.packetDurationDescription,
      paymentFrequency: data.paymentFrequency ?? (data.paymentFrequency || this.nypDataService.Order$.value?.paymentFrequency)
    };

    return this.httpClient.put<{ data: RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>> }>(
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
            start_date: data?.start_date
          }],
          paymentType: data?.paymentType,
          product_id: data?.productId,
          packetId: data?.packet?.id,
          packetDurationDescription: data?.packetDurationDescription,
          paymentFrequency: data?.paymentFrequency,
          ...data.chosenWarranties && {
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
        }
      } as RecursivePartial<IOrderRequest<NetCyberBusinessInsuredItems>>)
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

  public quote(body: RecursivePartial<{ data: { customerId: number; orderId: string | number; productId: number; } }>): Observable<RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>>> {
    return this.httpClient.post<{ data: RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>> }>(this.PATHS.POST_QUOTE, body)
      .pipe(map(response => response.data[0]));
  }


}



