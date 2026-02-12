import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrderRequest, IOrderResponse, IProduct, IQandA, NatCatnsuredItems, RecursivePartial, UpdateOrderRequest } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_NAT_CAT_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { TimNatCatCheckoutService } from './checkout.service';
import { DataService } from '@services';

@Injectable({
  providedIn: 'root'
})

export class TimNatCatService {
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
          const timNatCat = response.find(product => product.code == TIM_NAT_CAT_PRODUCT_NAME);
          this.dataService.setProduct(timNatCat as any);
          return timNatCat;
        }),
        filter(natCat => !!natCat?.code),
        take(1),
        tap(natCat => this.nypDataService.CurrentProduct$.next(natCat)),
      );
  }

  public getOrder(idOrder: string): Observable<RecursivePartial<IOrderResponse<NatCatnsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<NatCatnsuredItems>> }>(this.PATHS.GET_ORDER + idOrder)
      .pipe(
        map(response => response.data),
        map(response => {
          response.insurancePremium = Number(response?.orderItem?.[0]?.price || 0);
          return response;
        }),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(() => TimNatCatCheckoutService.loadFieldToRecover()),
      );
  }

  public getOrderById(idOrder: string): Observable<RecursivePartial<IOrderResponse<NatCatnsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<NatCatnsuredItems>> }>(this.PATHS.GET_ORDER_ID + idOrder)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(response => TimNatCatCheckoutService.fieldsToRecover = response.fieldToRecover as FieldsToRecover),
        tap(() => TimNatCatCheckoutService.loadFieldToRecover())
      );
  }

  public putOrder(data: RecursivePartial<UpdateOrderRequest<NatCatnsuredItems>> = {}): Observable<RecursivePartial<IOrderResponse<NatCatnsuredItems>>> {
    const fields2recover = TimNatCatCheckoutService.persistFieldToRecover();

    data = {
      customerId: data.customerId ?? this.nypDataService.Order$.value?.customerId,
      productId: data.productId ?? this.nypDataService.Order$.value?.productId,
      packet: data.packet ?? this.nypDataService.Order$.value?.packet?.data,
      orderCode: data.orderCode ?? this.nypDataService.Order$.value?.orderCode,
      price: data.price ?? +this.nypDataService.Order$.value?.orderItem?.[0]?.price,
      insuredItems: {
        contraenteProprietarioEConduttore: data.insuredItems?.contraenteProprietarioEConduttore ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).contraenteProprietarioEConduttore,
        cap: data.insuredItems?.cap ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).cap,
        indirizzo: data.insuredItems?.indirizzo ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).indirizzo,
        comune: data.insuredItems?.comune ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).comune,
        provincia: data.insuredItems?.provincia ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).provincia,
        provinciaAbbr: data.insuredItems?.provinciaAbbr ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).provinciaAbbr,
        materialeDiCostruzione: data.insuredItems?.materialeDiCostruzione ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).materialeDiCostruzione,
        annoDiCostruzione: data.insuredItems?.annoDiCostruzione ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).annoDiCostruzione,
        numeroPianiEdificio: data.insuredItems?.numeroPianiEdificio ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).numeroPianiEdificio,
        pianoPiuBassoOccupato: data.insuredItems?.pianoPiuBassoOccupato ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).pianoPiuBassoOccupato,
        seller_code: data.insuredItems?.seller_code ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as NatCatnsuredItems).seller_code
      },
      start_date: data.start_date ?? this.nypDataService.Order$.value.orderItem[0].insured_item.start_date,
      paymentType: data.paymentType ?? this.nypDataService.Order$.value?.paymentType,
      anagState: data.anagState ?? this.nypDataService.Order$.value?.anagStates?.state,
      chosenWarranties: data.chosenWarranties ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.warranties,
      packetCombination: data.packetCombination ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.packetCombination,
      packetDurationDescription: data.packetDurationDescription ?? this.nypDataService.Order$.value?.packetDurationDescription,
      paymentFrequency: data.paymentFrequency ?? this.nypDataService.Order$.value?.paymentFrequency
    };

    return this.httpClient.put<{ data: RecursivePartial<IOrderResponse<NatCatnsuredItems>> }>(
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
          ...data.chosenWarranties && {  chosenWarranties: {
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
      } as RecursivePartial<IOrderRequest<NatCatnsuredItems>>)
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

  public quote(body: RecursivePartial<{ data: { customerId: number; orderId: string | number; productId: number; } }>): Observable<RecursivePartial<IOrderResponse<NatCatnsuredItems>>> {
    return this.httpClient.post<{ data: RecursivePartial<IOrderResponse<NatCatnsuredItems>> }>(this.PATHS.POST_QUOTE, body)
    .pipe( map(response => response.data[0]));
  }

}
