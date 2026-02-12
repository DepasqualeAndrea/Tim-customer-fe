import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrderRequest, IOrderResponse, IProduct, IQandA, ProtezioneCasaInsuredItems, RecursivePartial, UpdateOrderRequest } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_PROTEZIONE_CASA_KENTICO_NAME, TIM_PROTEZIONE_CASA_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { TimProtezioneCasaCheckoutService } from './checkout.service';

@Injectable({
  providedIn: 'root'
})
export class TimProtezioneCasaApiService {
  private readonly PATHS = {
    PUT_ORDER: '/api/latest/order/',
    GET_ORDER: '/api/latest/order/',
    GET_ORDER_ID: '/api/latest/orderId/',
    POST_QUOTE: '/api/latest/quote',
    POST_SURVEY: '/api/latest/survey',
  }
  constructor(
    private httpClient: HttpClient,
    private nypDataService: NypDataService,
  ) { }

  public getProduct(): Observable<RecursivePartial<IProduct>> {
    const translationPosition = {
      "tim_protezione_casa.insurance_info_p_photovoltaic_w_demage_system_t": 8,
      "tim_protezione_casa.insurance_info_p_photovoltaic_w_failure_to_use_t": 9,
      "tim_protezione_casa.insurance_info_p_photovoltaic_w_theft_t": 10,
      "tim_protezione_casa.insurance_info_p_smart_w_injury_t": 1,
      "tim_protezione_casa.insurance_info_p_smart_w_personal_life_t": 2,
      "tim_protezione_casa.insurance_info_p_smart_w_properties_t": 3,
      "tim_protezione_casa.insurance_info_p_smart_w_choosable_t": 4,
      "tim_protezione_casa.insurance_info_p_deluxe_w_injury_t": 1,
      "tim_protezione_casa.insurance_info_p_deluxe_w_personal_life_t": 2,
      "tim_protezione_casa.insurance_info_p_deluxe_w_properties_t": 3,
      "tim_protezione_casa.insurance_info_p_deluxe_w_demage_to_contents_t": 4,
      "tim_protezione_casa.insurance_info_p_deluxe_w_demage_to_the_building_t": 5,
      "tim_protezione_casa.insurance_info_p_deluxe_w_theft_t": 6,
      "tim_protezione_casa.insurance_info_p_deluxe_w_choosable_t": 7,
    };
    return this.nypDataService.Products$
      .pipe(
        map(response => response.find(product => product.code == TIM_PROTEZIONE_CASA_PRODUCT_NAME)),
        filter(protezioneCasa => !!protezioneCasa?.code),
        take(1),
        tap(protezioneCasa => {
          const deferenziato = JSON.parse(JSON.stringify(protezioneCasa));

          deferenziato.packets.forEach(packet => {
            const sortWarranties = packet.warranties
              .map(warranty => {
                warranty.translationCode = `${TIM_PROTEZIONE_CASA_KENTICO_NAME}.${warranty.translationCode}`;
                return warranty;
              })
              .sort((a, b) => translationPosition[a.translationCode] - translationPosition[b.translationCode]);

            packet.warranties = sortWarranties;
          });

          this.nypDataService.CurrentProduct$.next(deferenziato);
        }),
      );
  }

  public getOrderByCode(orderCode: string): Observable<RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>> }>(this.PATHS.GET_ORDER + orderCode)
      .pipe(
        map(response => response.data),
        map(response => {
          response.insurancePremium = Number(response?.orderItem?.[0]?.price || 0);
          return response;
        }),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(response => TimProtezioneCasaCheckoutService.fieldsToRecover = response.fieldToRecover as FieldsToRecover),
        tap(() => TimProtezioneCasaCheckoutService.loadFieldToRecover())
      );
  }

  public getOrderById(idOrder: number): Observable<RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>> }>(this.PATHS.GET_ORDER_ID + idOrder)
      .pipe(
        map(response => response.data),
        map(response => {
          response.insurancePremium = Number(response?.orderItem?.[0]?.price || 0);
          return response;
        }),
        tap(response => this.nypDataService.Order$.next(response)),
        tap(() => TimProtezioneCasaCheckoutService.loadFieldToRecover())
      );
  }

  public putOrder(data: RecursivePartial<UpdateOrderRequest<ProtezioneCasaInsuredItems>> = {}): Observable<RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>>> {
    const fields2recover = TimProtezioneCasaCheckoutService.persistFieldToRecover();

    data = {
      customerId: data.customerId ?? this.nypDataService.Order$.value?.customerId,
      productId: data.productId ?? this.nypDataService.Order$.value?.productId,
      packet: data.packet ?? this.nypDataService.Order$.value?.packet?.data,
      orderCode: data.orderCode ?? this.nypDataService.Order$.value?.orderCode,
      price: data.price ?? +this.nypDataService.Order$.value?.orderItem?.[0]?.price,
      insuredItems: (data.insuredItems ?? this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item) as RecursivePartial<ProtezioneCasaInsuredItems>,
      paymentType: data.paymentType ?? this.nypDataService.Order$.value?.paymentType,
      anagState: data.anagState ?? this.nypDataService.Order$.value?.anagStates?.state,
      chosenWarranties: data.chosenWarranties ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.warranties,
      packetCombination: data.packetCombination ?? this.nypDataService.Order$.value?.orderItem?.[0]?.instance?.chosenWarranties?.data?.packetCombination,
    };

    return this.httpClient.put<{ data: RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>> }>(this.PATHS.PUT_ORDER + data?.orderCode, {
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
              address: data?.insuredItems?.address ?? "",
              city: data?.insuredItems?.city ?? "",
              house_number: data?.insuredItems?.house_number ?? "",
              owner_type: data?.insuredItems?.owner_type ?? "Proprietario",
              state_id: data?.insuredItems?.state_id ?? 0,
              country_id: data?.insuredItems?.country_id ?? 0,
              usage: data?.insuredItems?.usage ?? "Altro",
              zipcode: data?.insuredItems?.zipcode ?? "",
              state: data?.insuredItems?.state ?? "",
              stateAbbr: data?.insuredItems?.stateAbbr ?? "",
              seller_code: data.insuredItems?.seller_code ?? (this.nypDataService.Order$.value?.orderItem?.[0]?.insured_item as ProtezioneCasaInsuredItems).seller_code
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
    } as RecursivePartial<IOrderRequest<ProtezioneCasaInsuredItems>>)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
      );
  }

  // private formatPostalCode(postalCode: string | number | null | undefined): number {
  //   if (!postalCode) return 0;

  //   let cleanCode = postalCode.toString().trim();
  //   cleanCode = cleanCode.replace(/\D/g, '');
  //   if (!cleanCode) return 0;
  //   const paddedCode = cleanCode.padStart(5, '0');
  //   console.log('Formatted postal code:', paddedCode);
  //   return parseInt(paddedCode, 5);
  // }

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

  public quote(body: RecursivePartial<{ data: { customerId: number; orderId: string; productId: number; } }>): Observable<RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>>> {
    return this.httpClient.post<{ data: RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>> }>(this.PATHS.POST_QUOTE, body)
      .pipe(
        map(response => response.data),
      );
  }
}
