import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Areas,
  BikeQuotationRequest,
  BikeQuotationResponse,
  ClaimReport,
  Claims,
  ClaimsWrapper,
  Country,
  CyberRequest,
  DasQuotationRequest,
  DasQuotationResponse,
  EhealthStdRequest,
  GenericRequest, HomeRequestQuote,
  InsuranceWrapper, MotorRequestQuote,
  MotorSetUpRequest,
  PetHelvetiaRequest,
  Pets,
  PolicyNotificationSummary,
  PolicyNotificationType,
  PolicyPayments,
  Product,
  ProductsList,
  ProvidersQuoteRequest, ProvidersQuoteRequestHomeProposal, ProvidersQuoteRequestMotor, Quotes,
  RCRequest,
  ReplacementRequest,
  ReplacementRequestWithIBAN,
  RequestWithdraw,
  RequestWithdrawIBAN,
  SunnyQuotationRequest,
  SunnyQuotationResponse,
  TimMyHomeRequestQuote,
  ViaggiQuotationRequest,
  ViaggiQuotationResponse
} from '@model';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { Cacheable } from 'ngx-cacheable';
import * as moment from 'moment';
import { map, tap } from 'rxjs/operators';
import { Policy } from '../../modules/private-area/private-area.model';
import { PolicyDetailModal } from 'app/modules/private-area/components/policy-detail/model/policy-detail-modal.model';
import { PetsCollection } from 'app/modules/preventivatore/preventivatore-dynamic/components/quotator-multiple-pet/quotator-multiple-pet.types';

@Injectable()
export class InsurancesService {

  private productsSubject: BehaviorSubject<any>;

  private countryMap: Map<string, string> = new Map<string, string>();

  constructor(protected http: HttpClient, protected dataService: DataService) {
    this.countryMap.set('Vaticano', 'Città del Vaticano');
    this.countryMap.set('Gran Bretagna', 'Regno Unito');
    this.countryMap.set('San Marino', 'Repubblica di San Marino');
  }


  requestPaperyDoc(insuranceId: string): Observable<Policy> {
    throw new Error("requestPaperyDoc")
  }

  getQuotes(): Observable<Quotes> {
    throw new Error("requestPaperyDoc")
  }

  @Cacheable()
  getProducts(): Observable<ProductsList> {
    throw new Error("getProducts")
  }

  getCertificate(url: string): Observable<Blob> {
    throw new Error("getCertificate")
  }

  submitClaims(claims: Claims): Observable<Claims> {
    throw new Error("submitClaims")
  }

  getClaimsFromProviders(): Observable<ClaimsWrapper> {
    throw new Error("getClaimsFromProviders")
  }

  getClaimsById(id): Observable<Claims> {
    throw new Error("getClaimsById")
  }

  submitSportQuotation(submitQuotation: any): Observable<any> {
    throw new Error("submitSportQuotation")
  }

  submitSantaLuciaSportQuotation(submitQuotation: any): Observable<any> {
    throw new Error("submitSantaLuciaSportQuotation")
  }

  submitCbSportQuotation(submitQuotation: any): Observable<any> {
    throw new Error("submitCbSportQuotation")
  }

  submitCbSkiQuotation(submitQuotation: any): Observable<any> {
    throw new Error("submitCbSkiQuotation")
  }

  submitCbSkiGenertelQuotation(submitQuotation: any): Observable<any> {
    throw new Error("submitCbSkiGenertelQuotation")
  }

  submitCbSkiSeasonalQuotation(submitQuotation: any): Observable<any> {
    throw new Error("submitCbSkiSeasonalQuotation")
  }

  submitCbHolidayHouseQuotation(submitQuotation: any): Observable<any> {
    throw new Error("submitCbHolidayHouseQuotation")
  }

  submitBikeCbQuotation(submitQuotation: BikeQuotationRequest): Observable<BikeQuotationResponse> {
    throw new Error("submitBikeCbQuotation")
  }

  submitViaggiQuotation(submitViaggiCb: ViaggiQuotationRequest): Observable<ViaggiQuotationResponse> {
    throw new Error("submitViaggiQuotation")
  }

  submitMotorGenertelQuotation(motorRequest: MotorRequestQuote): Observable<any> {
    throw new Error("submitMotorGenertelQuotation")
  }

  submitHomeGenertelQuotation(homeRequest: HomeRequestQuote): Observable<any> {
    throw new Error("submitHomeGenertelQuotation")
  }


  getMotorSetUps(motorSetUpRequest: MotorSetUpRequest): Observable<any> {
    throw new Error("getMotorSetUps")
  }

  submitSunnyQuotation(sunnyQuotation: SunnyQuotationRequest): Observable<SunnyQuotationResponse> {
    throw new Error("submitSunnyQuotation")
  }

  submitDasQuotation(dasQuotation: DasQuotationRequest): Observable<DasQuotationResponse> {
    throw new Error("submitDasQuotation")
  }

  submitNetInsuranceQuotation(submitQuotation: any): Observable<any> {
    throw new Error("submitNetInsuranceQuotation")
  }

  submitTravelHelvetiaInsuranceQuotation(travelRequest: ProvidersQuoteRequest): Observable<any> {
    throw new Error("submisubmitTravelHelvetiaInsuranceQuotationtSportQuotation")
  }

  submitGenertelMotorInsuranceQuotation(request: ProvidersQuoteRequestMotor): Observable<any> {
    throw new Error("submitGenertelMotorInsuranceQuotation")
  }

  submitGenertelMotorWarrantiesProposals(request: ProvidersQuoteRequestMotor, proposalName: string): Observable<any> {
    throw new Error("submitGenertelMotorWarrantiesProposals")
  }


  submitGenertelHomeWarrantiesProposals(request: ProvidersQuoteRequestHomeProposal, proposalName: string): Observable<any> {
    throw new Error("submitGenertelHomeWarrantiesProposals")
  }

  submitPetHelvetiaInsuranceQuotation(petRequest: PetHelvetiaRequest): Observable<any> {
    throw new Error("submitPetHelvetiaInsuranceQuotation")
  }

  submitRCFcaInsuranceQuotation(rcRequest: RCRequest): Observable<any> {
    throw new Error("submitRCFcaInsuranceQuotation")
  }

  submitCyberQuotation(cyberRequest: CyberRequest): Observable<any> {
    throw new Error("submitCyberQuotation")
  }

  getGenericDocumentAcceptance(id: number): Observable<any> {
    throw new Error("getGenericDocumentAcceptance")
  }


  getGenericDocumentInformation(id: number): Observable<any> {
    throw new Error("getGenericDocumentInformation")
  }

  getRecommendedProducts(userId: number, numberProducts: number): Observable<any> {
    throw new Error("getRecommendedProducts")
  }

  @Cacheable()
  getCbHolidayHouseCountries(): Observable<Country[]> {
    throw new Error("getCbHolidayHouseCountries")
  }

  getTravelPackDestinations(): Observable<Country[]> {
    throw new Error("getTravelPackDestinations")
  }

  getTravelHelvetiaDestinations(): Observable<Areas[]> {
    throw new Error("getTravelHelvetiaDestinations")
  }

  getPetsHelvetia(): Observable<PetsCollection> {
    throw new Error("getPetsHelvetia")
  }

  changeWalletSource(policyId: number | string, paymentSourceId: number | string): Observable<HttpResponse<any>> {
    throw new Error("changeWalletSource")
  }

  changeWalletPaymentSubscription(policyId: number | string, nonce: string, walletId): Observable<HttpResponse<any>> {
    throw new Error("changeWalletPaymentSubscription")
  }

  getSiaPaymentRedirect(request: any, payment_method_id: string): Observable<any> {
    throw new Error("getSiaPaymentRedirect")
  }

  getSiaPaymentRedirectManageCard(request: any, payment_method_id: string): Observable<any> {
    throw new Error("getSiaPaymentRedirectManageCard")
  }

  getMyDocuments(): Observable<any> {
    throw new Error("getMyDocuments")
  }

  getFilteredDocuments(policyNumber: number, document: string): Observable<any> {
    throw new Error("getFilteredDocuments")
  }

  getPolicyNumber(policyNumber: number): Observable<any> {
    throw new Error("getPolicyNumber")
  }

  updateAppliances(policyId: number | string, body: any): Observable<any> {
    throw new Error("updateAppliances")
  }

  getApplianceBrands(): Observable<any> {
    throw new Error("getApplianceBrands")
  }

  replacement(policyId: number | string, request: ReplacementRequest): Observable<HttpResponse<any>> {
    throw new Error("replacement")
  }

  replacementWithIBAN(policyId: number | string, request: ReplacementRequestWithIBAN): Observable<HttpResponse<any>> {
    throw new Error("replacementWithIBAN")
  }

  deactivate(policyId: number | string): Observable<HttpResponse<any>> {
    throw new Error("deactivate")
  }

  withdrawWithIBAN(policyId: number | string, request: RequestWithdrawIBAN): Observable<HttpResponse<any>> {
    throw new Error("withdrawWithIBAN")
  }

  withdrawScreen(policyId: number | string, reason: PolicyDetailModal): Observable<HttpResponse<any>> {
    throw new Error("withdrawScreen")
  }

  refund(policyId: number | string, reason: PolicyDetailModal): Observable<HttpResponse<any>> {
    throw new Error("refund")
  }

  withdrawWithMoreInfo(policyId: number | string, request: RequestWithdraw): Observable<HttpResponse<any>> {
    throw new Error("withdrawWithMoreInfo")
  }

  genericRequest(policyId: number | string, request: GenericRequest): Observable<HttpResponse<any>> {
    throw new Error("genericRequest")
  }

  renew(policyId: number, renewingPolicy): Observable<HttpResponse<any>> {
    throw new Error("renew")
  }


  orderProductsByShowcaseIndex = (productsList: ProductsList) => {
    productsList.products.sort((a: Product, b: Product) => this.getShowCasePropertyProductOrder(a) - this.getShowCasePropertyProductOrder(b));
    return productsList;
  }

  getShowCasePropertyProductOrder(product: Product): number {
    const showcaseProperty = product.properties.find(this.findShowcaseIndex);
    return showcaseProperty ? parseInt(showcaseProperty.value, 10) : 0;
  }

  findShowcaseIndex(property) {
    return property.name === 'showcase_index';
  }

  getClaimEventList(productCode: string) {
    switch (productCode) {
      case 'ge-travel-plus':
      case 'ge-travel-premium':
        return [
          'Rimborso spese di ricovero da infortunio',
          'Rimborso spese di ricovero da malattia improvvisa',
          'Diaria da ricovero',
          'Ritardo bagaglio',
          'Ritardo volo',
          'Cancellazione volo',
          'Responsabilità civile'
        ];
      case 'ge-sport-plus':
      case 'ge-sport-premium':
        return [
          'Infortuni sportivi',
          'Diaria da ricovero',
          'Rimborso abbonamento palestra',
          'Rimborso danni all\'attrezzatura sportiva',
          'Responsabilità Civile',
        ];
      case 'ge-bike-plus':
      case 'ge-bike-premium':
        return [
          'Infortunio bike',
          'Spesa di ricerca e soccorso',
          'Responsabilità Civile',
        ];
      case 'ge-ski-plus':
      case 'ge-ski-premium':
      case 'ge-ski-seasonal-plus':
      case 'ge-ski-seasonal-premium':
        return [
          'Infortuni sportivi',
          'Diaria da ricovero',
          'Responsabilità Civile',
          'Invalidità permanente o decesso da infortunio',
          'Rimborso danni all\'attrezzatura sportiva',
          'Rimborso skipass e lezioni di sci',
          'Spesa di ricerca e soccorso'
        ];
      case 'ge-holiday-house-plus':
      case 'ge-holiday-house-premium':
        return [
          'Rimborso per annullamento o interruzzione viaggio',
          'Rimborso furto bagagli',
          'Rimborso per atti disonesti e fraudolenti',
          'Responsabilità Civile',
        ];
    }
  }

  uploadFileToPolicy(policyId: number, file: File): Observable<any> {
    throw new Error("uploadFileToPolicy")
  }

  getRcPowerSupplies(): Observable<any> {
    throw new Error("getRcPowerSupplies")
  }

  getRcCarBrands(): Observable<any> {
    throw new Error("getRcCarBrands")
  }

  getRcDisplacements(): Observable<any> {
    throw new Error("getRcDisplacements")
  }

  updateTimEmployeesCheckoutTimestamp(lineItemId: number): Observable<any> {
    throw new Error("updateTimEmployeesCheckoutTimestamp")
  }

  getMyPetPaymentHistory(lineItemId: string | number): Observable<any> {
    throw new Error("getMyPetPaymentHistory")
  }

  public genertelContractFind(payload: CertificateFindPayload): Observable<any> {
    throw new Error("genertelContractFind")
  }

  public genertelContractCorrection(payload: CertificateCorrectionPayload): Observable<any> {
    throw new Error("genertelContractCorrection")
  }

  public sendGenertelLegalAttachments(payload: { email: string, name: string }): Observable<null> {
    throw new Error("sendGenertelLegalAttachments")
  }

  public checkZipCode(zipCode: any, cityId: any, validateAll: boolean = false): Observable<any> {
    throw new Error("checkZipCode")
  }

  getBsBillList(): Observable<any> {
    throw new Error("getBsBillList")
  }

  submitPayment(payload: any): Observable<any> {
    throw new Error("submitPayment")
  }

  pollingRsa(payload: any): Observable<any> {
    throw new Error("pollingRsa")
  }

  storePayment(payload: object): Observable<any> {
    throw new Error("storePayment")
  }

  resumeEstimates(estimateId: string, status: string): Observable<any> {
    throw new Error("resumeEstimates")
  }

  sendAttachments(linkObj: object): Observable<any> {
    throw new Error("sendAttachments")
  }

  estimatesMultirisk(orderId: number): Observable<any> {
    throw new Error("estimatesMultirisk")
  }

}
