import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Country, State, City, SocialAuth } from '@model';
import { catchError, map } from 'rxjs/operators';
import { Flags } from '@model';
import { DataService } from './data.service';
import { environment } from '../../../environments/environment';
import { Cacheable } from 'ngx-cacheable';
import { TenantUserProperties } from '../models/tenant-user-properties';
import { GenertelSciSignupRequest } from 'app/modules/security/components/register/sign-up-genertel/sign-up-generte-sci-request.model';
import { contractorIsAdultRequest, TaxcodeCalculationRequest } from './utils.model';
import { ComponentFeaturesService } from './componentFeatures.service';
import { NypHttpClientModule, NypUserService } from '@NYP/ngx-multitenant-core';
import { NypHttpClientServiceModule } from '@NYP/ngx-multitenant-core/lib/http-client/nyp-http-client.service.module';
import { ERANGE } from 'constants';

@Injectable({
  providedIn: NypHttpClientModule
})
export class UserService {
  constructor(
    protected http: HttpClient,
    public dataService: DataService,

    protected NypUserService: NypUserService,
    public componentFeaturesService: ComponentFeaturesService) { }

  socialAuth(socialAuth: SocialAuth): Observable<any> {
    throw new Error("socialAuth")
  }

  register(user: any, redirectTo: string = null): Observable<User> {
    throw new Error("register")
  }

  retireeRegister(user: any): Observable<User> {
    throw new Error("retireeRegister")
  }

  confirmUser(confirmationToken: string): Observable<User> {
    throw new Error("confirmUser")
  }

  login(credentials): Observable<User> {
    throw new Error("login")
  }

  userMigration(taxcode: any): Observable<any> {
    throw new Error("userMigration")
  }

  updateBusinessUser(userId: number, user: any): Observable<User> {
    throw new Error("updateBusinessUser")
  }

  getPropertyInFlagTag(flagProperties: string[], propertyName: string) {
    const flagProperty = flagProperties.find(property => property.startsWith(propertyName + ':'));
    if (!flagProperty) {
      return undefined;
    }
    const propertyItems = flagProperty.split(propertyName + ':');
    return propertyItems[1];
  }
  getAreas(): Observable<any> {
    throw new Error("getAreas")
  }
  getDataDropdown(): Observable<any> {
    throw new Error("getDataDropdown")
  }


  hasQuerylanguage() {
    this.componentFeaturesService.useComponent('genertel-endpoint-countries');
    this.componentFeaturesService.useRule('query-countries-language');
    return this.componentFeaturesService.isRuleEnabled();
  }

  @Cacheable()
  getEuropeCountries(): Observable<any> {
    throw new Error("getEuropeCountries")
  }

  getCitiesByCatastale(codCatastale: string): Observable<City> {
    throw new Error("getCitiesByCatastale")
  }

  taxcodeCalculation(insuredData: TaxcodeCalculationRequest): Observable<{ [taxcode: string]: string } | any> {
    throw new Error("taxcodeCalculation")
  }


  deletePaymentMethod(id: number): Observable<HttpResponse<any>> {
    throw new Error("deletePaymentMethod")
  }


  setWallet(payment: any): Observable<any> {
    throw new Error("setWallet")
  }

  setDefaultPayment(paymentId: number): Observable<any> {
    throw new Error("setDefaultPayment")
  }

  helbizPayment(payload): Observable<any> {
    throw new Error("helbizPayment")
  }

  ssoAuth(code): Observable<any> {
    throw new Error("ssoAuth")
  }

  ssoOauth(code, updateUser?: string): Observable<any> {
    throw new Error("ssoOauth")
  }

  ssoAuthSaml(code): Observable<any> {
    throw new Error("ssoAuthSaml")
  }

  sendContactRequest(contact: any): Observable<any> {
    throw new Error("sendContactRequest")
  }

  ldapAuth(userId: number, req: any): Observable<any> {
    throw new Error("ldapAuth")
  }

  ldapUpdate(req, userId): Observable<any> {
    throw new Error("ldapUpdate")
  }

  signupGenertelSci(req: GenertelSciSignupRequest): Observable<any> {
    throw new Error("signupGenertelSci")
  }

  ssoAuthGigya(token): Observable<any> {
    throw new Error("ssoAuthGigya")
  }
}
