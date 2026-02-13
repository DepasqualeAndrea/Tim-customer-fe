import { CustomPipeModule } from './shared/pipe/CustomPipes.module';
import { ApplicationRef, Compiler, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, Injectable, Injector, NgModule, Type, inject, provideAppInitializer } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { ErrorsHandler } from './core/errors-handler/errors-handler';
import { FilterClaims } from './shared/pipe/claims.pipe';

import { SharedModule } from './shared/shared.module';
import { AuthGuardLogin, AuthService, CheckoutService, DataService, InsurancesService, JwtHelperService, PreviousRouteService, ProductsService, SharingDataService, UserService, UtilsService, DiscountCodeService } from '@services';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/public/not-found/not-found.component';
import { SecurityModule } from './modules/security/security.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { SharedService } from './shared/shared.service';
import { FooterComponent } from './components/public/footer/footer.component';
import { CustomDatepickerI18n, I18n, NgbDateParserFormatterService } from './shared/ngb-date-parser-formatter.service';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, Title } from '@angular/platform-browser';

import { ConfigurationService } from './core/services/configuration.service';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { PrivateAreaModule } from './modules/private-area/private-area.module';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';

import { environment } from 'environments/environment';
import { UserMockService } from './core/services/mock/user.mock.service';
import { ConfigurationMockService } from './core/services/mock/configuration.mock.service';
import { InsurancesMockService } from './core/services/mock/insurances.mock.service';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { MainDefaultComponent } from './components/public/main-default/main.default.component';
import { SupportComponent } from './components/public/support/support.component';
import { TokenInterceptor } from './core/services/token.interceptor';
import { InjectableProviderService } from './core/services/injectable-provider.service';
import { NgbDatepickerLocalization } from './core/services/ngbd-datepicker-localization.service';
import { ComponentLoaderModule } from './modules/tenants/component-loader/component-loader.module';
// import { AuthGuardLoginCB } from './core/services/auth-guard-login-cb.service';
// import { AuthGuardLoginCse } from './core/services/auth-guard-login-cse.service';

import { ContattiContainerComponent } from './components/public/contatti/contatti-container.component';

import * as Hammer from 'hammerjs';
import { ChildrenOutletContexts, NavigationExtras, Route, Router, ROUTES, Routes, UrlHandlingStrategy, UrlSerializer, UrlTree } from '@angular/router';
import { Location } from '@angular/common';
import { ContinueCheckoutComponent } from './components/public/continue-checkout/continue-checkout.component';
import { ProductsContainerComponent } from './components/public/products-container/products-container.component';

import { ChiSiamoTimMybrokerComponent } from './components/public/chi-siamo/chi-siamo-tim-mybroker/chi-siamo-tim-mybroker.component';
import { FooterTimMybrokerComponent } from './components/public/footer/footer-tim-mybroker/footer-tim-mybroker.component'; import { TermsTimComponent } from './components/public/terms/terms-tim/terms-tim.component';
import { CookiesTimComponent } from './components/public/cookies/cookies-tim/cookies-tim.component';
import { SupportTimComponent } from './components/public/support/support-tim/support-tim.component';
import { SupportByProductComponent } from './components/public/support/support-by-product/support-by-product.component';
import { ChiSiamoTimMybrokerCustomersComponent } from './components/public/chi-siamo/chi-siamo-tim-mybroker-customers/chi-siamo-tim-mybroker-customers.component';
import { SupportBodyComponent } from './components/public/support/support-tim/support-body/support-body.component';
import { AuthGuardLoginTimCustomers } from './core/services/auth-guard-login-tim-customers.service';
import { NavbarTimCustomersComponent } from './components/public/navbar/navbar-tim/navbar-tim-customers/navbar-tim-customers.component';
import { PrivacyTimComponent } from './components/public/privacy/privacy-tim/privacy-tim.component';

import { ComplaintsContainerComponent } from './components/public/complaints/complaints-container.component';
import { TimDistanceSellInformativeComponent } from './components/public/conditions/tim-distance-sell-informative/tim-distance-sell-informative.component';
import { LoaderLegacyComponent } from './components/public/loader-legacy/loader-legacy.component';
import { ArticleDetailComponent } from './components/public/chi-siamo/article-detail/article-detail.component';
import { TimCustomersContactsFormComponent } from './components/public/contatti/tim/tim-customers-contacts-form/tim-customers-contacts-form.component';
import { CookiesPreferencesComponent } from './components/public/cookies-preferences/cookies-preferences.component';
import { CookiesPreferencesChoiseComponent } from './components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ModalPrivacyComponent } from './components/public/privacy/modal-privacy/modal-privacy.component';
import { EstimatesMockService } from './core/services/mock/estimates.mock.service';

import { RoutingModule } from './routing.module';


import { FooterBasicComponent } from './components/public/footer/footer-basic/footer-basic.component';
import { HybridDecrypt, NypConfigurationService, NypHttpClientModule, NypRegisterEnvironment, NypUserService } from '@NYP/ngx-multitenant-core';
import { SessionIdInterceptor } from './core/services/sessionid.interceptor';

NypRegisterEnvironment(environment);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

// create a function outside in the class module
export function setupApp(setup: ConfigurationService) {
  return () => setup.setupApp();
}

export const insurancesServiceFactory = (
  http: HttpClient,
  dataService: DataService,
  injectableProviderService: InjectableProviderService
) => {
  if (environment.mockAll) {
    return new InsurancesMockService(http, dataService);
  } else {
    return injectableProviderService.buildService(InsurancesService, http, dataService) || new InsurancesService(http, dataService);
  }
};

const cookieConfig: NgcCookieConsentConfig = {
  autoOpen: false,
  autoAttach: false,
  cookie: {
    domain: location.hostname,
    name: 'eu_cookies_consent_2_0',
    expiryDays: 365
  },
  palette: null,
  theme: 'edgeless',
  type: 'info',
  layout: 'my-custom-layout',
  layouts: {
    'my-custom-layout': ''
  },
  content: {
    message: null,
    dismiss: null
  }
};

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    let options = {};

    if (element.attributes['data-mc-options']) {
      try {
        const parseOptions = JSON.parse(element.attributes['data-mc-options'].nodeValue);
        options = parseOptions;
      } catch (err) {
        console.error('An error occurred when attempting to parse Hammer.js options: ', err);
      }
    }

    const mc = new Hammer(element, options);

    // keep default angular config
    mc.get('pinch').set({ enable: true });
    mc.get('rotate').set({ enable: true });

    // retain support for angular overrides object
    for (const eventName in this.overrides) {
      if (eventName) {
        mc.get(eventName).set(this.overrides[eventName]);
      }
    }
    return mc;
  }
}

class MyUrlHandlingStrategy extends UrlHandlingStrategy {
  extract(url: UrlTree): UrlTree {
    return url;
  }

  merge(newUrlPart: UrlTree, rawUrl: UrlTree): UrlTree {
    newUrlPart.queryParams = { ...newUrlPart.queryParams, ...rawUrl.queryParams };
    return newUrlPart;
  }

  shouldProcessUrl(url: UrlTree): boolean {
    return true;
  }
}

export class MyRouter extends Router {
  constructor(rootComponentType: Type<any>, urlSerializer: UrlSerializer,
    rootContexts: ChildrenOutletContexts, location: Location, injector: Injector,
    compiler: Compiler, config: Routes) {
    super(rootComponentType, urlSerializer, rootContexts, location, injector, compiler, config);
  }

  navigateByUrl(url: string | UrlTree, extras: NavigationExtras = { queryParamsHandling: 'merge' }): Promise<boolean> {
    // console.trace('Custom router navigation', url)
    extras.queryParamsHandling = 'merge';
    return super.navigateByUrl(url, extras);
  }
}

function flatten<T>(arr: T[][]): T[] {
  return Array.prototype.concat.apply([], arr);
}

export function routerFactory(rootComponentType: Type<any>, urlSerializer: UrlSerializer,
  rootContexts: ChildrenOutletContexts, location: Location, injector: Injector,
  compiler: Compiler, config: Route[][]): Router {
  return new MyRouter(
    rootComponentType,
    urlSerializer,
    rootContexts,
    location,
    injector,
    compiler,
    flatten(config)
  );
}

export function windowFactory() {
  return window;
}

@NgModule({
  declarations: [
    AppComponent,

    NotFoundComponent,
    FilterClaims,
    FooterComponent,
    ProductsContainerComponent,

    ContattiContainerComponent,
    ContinueCheckoutComponent,
    ChiSiamoTimMybrokerComponent,
    FooterTimMybrokerComponent,
    TermsTimComponent,
    CookiesTimComponent,
    ChiSiamoTimMybrokerCustomersComponent,
    SupportBodyComponent,
    NavbarTimCustomersComponent,
    PrivacyTimComponent,
    ComplaintsContainerComponent,
    TimDistanceSellInformativeComponent,
    LoaderLegacyComponent,
    ArticleDetailComponent,
    TimCustomersContactsFormComponent,
    CookiesPreferencesComponent,
    CookiesPreferencesChoiseComponent,


    ModalPrivacyComponent,
    FooterBasicComponent,
    MainDefaultComponent,
    SupportComponent,
    SupportTimComponent,
    SupportByProductComponent
  ],
  imports: [
    NypHttpClientModule,
    ComponentLoaderModule,
    BrowserModule,
    SharedModule,
    CheckoutModule,
    PrivateAreaModule,
    SecurityModule,
    CustomPipeModule,
    RoutingModule,
    PerfectScrollbarModule,
    NgxPaginationModule,


    NgOtpInputModule,
    BlockUIModule.forRoot({
      delayStop: 200,
      template: LoaderLegacyComponent
    }),
    BlockUIHttpModule.forRoot({ blockAllRequestsInProgress: true }),
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 8000,
      positionClass: 'toast-top-full-width',
      preventDuplicates: true,
      closeButton: true,
    }),
    NgcCookieConsentModule.forRoot(cookieConfig),
    ScrollToModule.forRoot(),

  ],
  providers: [
    NypHttpClientModule,
    NypUserService,
    NypConfigurationService,
    Title,
    AuthService,
    AuthGuardLogin,
    JwtHelperService,
    AuthGuardLoginTimCustomers,

    HybridDecrypt,
    {
      provide: InsurancesService,
      useFactory: insurancesServiceFactory,
      deps: [HttpClient, DataService, InjectableProviderService]
    },
    {
      provide: UserService,
      useClass: environment.mockTenant || environment.mockAll ? UserMockService : UserService
    },
    DataService,
    ProductsService,
    PreviousRouteService,
    SharingDataService,
    CheckoutService,
    UtilsService,
    SharedService,
    DiscountCodeService,
    {
      provide: ConfigurationService,
      useClass: environment.mockAll ? ConfigurationMockService : ConfigurationService
    },
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionIdInterceptor,
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: NgbDateParserFormatter, useClass: NgbDateParserFormatterService },
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    provideAppInitializer(() => {
      const initializerFn = (setupApp)(inject(ConfigurationService));
      return initializerFn();
    }),
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerLocalization },
    { provide: 'BusinessFormCountryService', useExisting: UserService },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    {
      provide: Router,
      useFactory: routerFactory,
      deps: [ApplicationRef, UrlSerializer, ChildrenOutletContexts, Location, Injector, Compiler, ROUTES]
    },
    { provide: UrlHandlingStrategy, useClass: MyUrlHandlingStrategy },
    { provide: 'windowObject', useFactory: windowFactory },
    EstimatesMockService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule {


}
