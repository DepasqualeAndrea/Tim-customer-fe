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
import { AuthGuardLogin, AuthService, CheckoutService, DataService, InsurancesService, JwtHelperService, PreviousRouteService, ProductsService, SharingDataService, UserService, UtilsService, DiscountCodeService, TokenTimEmployeesService } from '@services';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/public/not-found/not-found.component';
import { PreventivatoreModule } from './modules/preventivatore/preventivatore.module';
import { SecurityModule } from './modules/security/security.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { SharedService } from './shared/shared.service';
import { FooterComponent } from './components/public/footer/footer.component';
import { CustomDatepickerI18n, I18n, NgbDateParserFormatterService } from './shared/ngb-date-parser-formatter.service';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, Title } from '@angular/platform-browser';

import { ChiSiamoComponent } from './components/public/chi-siamo/chi-siamo.component';
import { ProductsComponent } from './components/public/products/products.component';
import { VariantSelectComponent } from './components/public/variant-select/variant-select.component';
import { NewsComponent } from './components/public/news/news.component';
import { CookiesComponent } from './components/public/cookies/cookies.component';
import { PrivacyComponent } from './components/public/privacy/privacy.component';
import { TermsComponent } from './components/public/terms/terms.component';
import { ArticleComponent } from './components/public/news/article/article.component';
import { ConfigurationService } from './core/services/configuration.service';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatrixViewComponent } from './components/public/products/matrix-view/matrix-view.component';
import { SliderViewComponent } from './components/public/products/slider-view/slider-view.component';
import { FilterViewComponent } from './components/public/products/filter-view/filter-view.component';
import { HowWorksComponent } from './components/public/products/how-works/how-works.component';
import { DownloadAppComponent } from './components/public/products/download-app/download-app.component';
import { PartnerSliderComponent } from './components/public/products/partner-slider/partner-slider.component';
import { HeaderComponent } from './components/public/products/header/header.component';
import { HeaderCbComponent } from './components/public/products/header-cb/header-cb.component';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { PrivateAreaModule } from './modules/private-area/private-area.module';
import { PartnerPrevCbComponent } from './components/public/products/partner-prev-cb/partner-prev-cb.component';
import { ClarityComponent } from './components/public/clarity/clarity.component';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { WhyEnsureComponent } from './components/public/why-ensure/why-ensure.component';
import { environment } from 'environments/environment';
import { UserMockService } from './core/services/mock/user.mock.service';
import { ConfigurationMockService } from './core/services/mock/configuration.mock.service';
import { InsurancesMockService } from './core/services/mock/insurances.mock.service';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { MainDefaultComponent } from './components/public/main-default/main.default.component';
import { ChatComponent } from './components/public/chat/chat.component';
import { TermsYComponent } from './components/public/terms/terms-y/terms-y.component';
import { OverviewComponent } from './components/public/overview/overview.component';
import { ArchitectureApiComponent } from './components/public/overview/architecture-api/architecture-api.component';
import { HomepageYComponent } from './components/public/homepage/homepage-y/homepage-y.component';
import { InvestitoriComponent } from './components/public/investors/investors.component';
import { TheteamComponent } from './components/public/theteam/default/theteam.component';
import { DataPlatformComponent } from './components/public/b2b/data-platform/data-platform.component';
import { DataManagementPlatformComponent } from './components/public/b2b/data-management-platform/data-management-platform.component';
import { AdministrationComponent } from './components/public/administration/administration.component';
import { ArchitectureComponent } from './components/public/overview/architecture/architecture.component';
import { FunctionalitiesComponent } from './components/public/overview/functionalities/functionalities.component';
import { SolutionsComponent } from './components/public/overview/solutions/solutions.component';
import { MobileDownloadComponent } from './components/public/mobile-download/mobile-download.component';
import { SupportComponent } from './components/public/support/support.component';
import { SupportYComponent } from './components/public/support/support-y/support-y.component';
import { SupportGenericComponent } from './components/public/support/support-generic/support-generic.component';
import { BigCompaniesComponent } from './components/public/b2b/big-companies/big-companies.component';
import { BanksAndInsurancesComponent } from './components/public/b2b/banks-and-insurances/banks-and-insurances.component';

import { PressReviewComponent } from './components/public/rassegna-stampa/press-review.component';
import { TokenInterceptor } from './core/services/token.interceptor';
import { InjectableProviderService } from './core/services/injectable-provider.service';
import { NgbDatepickerLocalization } from './core/services/ngbd-datepicker-localization.service';
import { ComponentLoaderModule } from './modules/tenants/component-loader/component-loader.module';
import { AuthGuardLoginCB } from './core/services/auth-guard-login-cb.service';
import { AuthGuardLoginCse } from './core/services/auth-guard-login-cse.service';
import { ChiSiamoPageComponent } from './components/public/theteam/chi-siamo-page.component';
import { ContattiContainerComponent } from './components/public/contatti/contatti-container.component';

import * as Hammer from 'hammerjs';
import { ChildrenOutletContexts, NavigationExtras, Route, Router, ROUTES, Routes, UrlHandlingStrategy, UrlSerializer, UrlTree } from '@angular/router';
import { Location } from '@angular/common';
import { ContinueCheckoutComponent } from './components/public/continue-checkout/continue-checkout.component';
import { ProductsContainerComponent } from './components/public/products-container/products-container.component';
import { ProductsStandardContainerComponent } from './components/public/products-standard-container/products-standard-container.component';
import { ProductsTimEmployeesComponent } from './components/public/products-container/products-tim-employees/products-tim-employees.component';
import { ChiSiamoTimMybrokerComponent } from './components/public/chi-siamo/chi-siamo-tim-mybroker/chi-siamo-tim-mybroker.component';
import { FooterTimMybrokerComponent } from './components/public/footer/footer-tim-mybroker/footer-tim-mybroker.component';
import { AuthGuardLoginTimEmployees } from './core/services/auth-guard-login-tim-employees.service';
import { TermsTimComponent } from './components/public/terms/terms-tim/terms-tim.component';
import { CookiesTimComponent } from './components/public/cookies/cookies-tim/cookies-tim.component';
import { SupportTimComponent } from './components/public/support/support-tim/support-tim.component';
import { SupportByProductComponent } from './components/public/support/support-by-product/support-by-product.component';
import { ChiSiamoTimMybrokerCustomersComponent } from './components/public/chi-siamo/chi-siamo-tim-mybroker-customers/chi-siamo-tim-mybroker-customers.component';
import { SupportBodyComponent } from './components/public/support/support-tim/support-body/support-body.component';
import { AuthGuardLoginTimCustomers } from './core/services/auth-guard-login-tim-customers.service';
import { NavbarTimCustomersComponent } from './components/public/navbar/navbar-tim/navbar-tim-customers/navbar-tim-customers.component';
import { PrivacyTimComponent } from './components/public/privacy/privacy-tim/privacy-tim.component';
import { ProductsLeasysComponent } from './components/public/products-container/products-leasys/products-leasys.component';
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
import { GovernanceComponent } from './components/public/governance/governance.component';
import { InvestorGovernanceComponent } from './components/public/investor-governance/investor-governance.component';
import { NgxSplideModule } from 'ngx-splide';
import { RoutingModule } from './routing.module';
import { SocialLoginModule } from 'angularx-social-login';
import { ModalTerminiCondizioniInvestorComponent } from './components/public/investor-governance/modal-termini-condizioni-investor/modal-termini-condizioni-investor.component';
import { ScreenProtectionAskRefundModalComponent } from './modules/checkout/screen-protection-ask-refund-modal/screen-protection-ask-refund-modal.component';
import { RedirectModule } from './modules/redirect/redirect.module';
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

    this.urlHandlingStrategy = new MyUrlHandlingStrategy();
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
    ChiSiamoPageComponent,
    NotFoundComponent,
    FilterClaims,
    FooterComponent,
    ChiSiamoComponent,
    ProductsComponent,
    ProductsContainerComponent,
    ProductsStandardContainerComponent,


    ProductsTimEmployeesComponent,

    VariantSelectComponent,
    // NavbarComponent,
    NewsComponent,
    CookiesComponent,
    PrivacyComponent,
    TermsComponent,
    ArticleComponent,
    MatrixViewComponent,
    SliderViewComponent,
    FilterViewComponent,
    HowWorksComponent,
    DownloadAppComponent,
    PartnerSliderComponent,
    HeaderComponent,
    HeaderCbComponent,
    PartnerPrevCbComponent,
    ClarityComponent,
    WhyEnsureComponent,
    MainDefaultComponent,
    ChatComponent,
    TermsYComponent,
    OverviewComponent,
    ArchitectureComponent,
    ArchitectureApiComponent,
    HomepageYComponent,
    OverviewComponent,
    FunctionalitiesComponent,
    SolutionsComponent,
    InvestitoriComponent,
    TheteamComponent,
    AppComponent,
    DataPlatformComponent,
    DataManagementPlatformComponent,
    AdministrationComponent,
    MobileDownloadComponent,
    SupportComponent,
    SupportYComponent,
    SupportGenericComponent,
    SupportTimComponent,
    SupportByProductComponent,
    BigCompaniesComponent,
    BanksAndInsurancesComponent,


    PressReviewComponent,
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


    GovernanceComponent,
    InvestorGovernanceComponent,
    ModalTerminiCondizioniInvestorComponent,
    ScreenProtectionAskRefundModalComponent,
    FooterBasicComponent
  ],
  imports: [
    NypHttpClientModule,
    SocialLoginModule,
    ComponentLoaderModule,
    BrowserModule,
    SharedModule,
    CheckoutModule,
    PrivateAreaModule,
    PreventivatoreModule,
    SecurityModule,
    CustomPipeModule,
    RoutingModule,
    PerfectScrollbarModule,
    NgxPaginationModule,
    SlickCarouselModule,
    NgxSplideModule,
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
      // extendedTimeOut: 0, // set 0 to make toastr sticky
      positionClass: 'toast-top-full-width',
      preventDuplicates: true,
      closeButton: true,
    }),
    NgcCookieConsentModule.forRoot(cookieConfig),
    ScrollToModule.forRoot(),
    RedirectModule
  ],
  providers: [
    NypHttpClientModule,
    NypUserService,
    NypConfigurationService,
    Title,
    AuthService,
    AuthGuardLogin,



    JwtHelperService,


    AuthGuardLoginTimEmployees,
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
    TokenTimEmployeesService,
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
    { provide: 'windowObject', useFactory: windowFactory },
    EstimatesMockService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule {


}
