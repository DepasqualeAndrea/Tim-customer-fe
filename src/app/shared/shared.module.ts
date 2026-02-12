import { NavbarMenuComponent } from './../components/public/navbar/navbar-menu/navbar-menu.component';
import { ConsentFormComponent } from './consent-form/consent-form.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from './loading/loading.component';
import { SharedService } from './shared.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { DynamicSectionComponent } from './dynamic-section/dynamic-section.component';
import { RecommendedProductsComponent } from 'app/components/public/products/recommended-products/recommended-products.component';
import { RouterModule } from '@angular/router';
import { NavbarCbComponent } from 'app/components/public/navbar/navbar-cb/navbar-cb.component';
import { NavbarComponent } from 'app/components/public/navbar/navbar.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NavbarCbLinksUserComponent } from 'app/components/public/navbar/navbar-cb/navbar-cb-links-user/navbar-cb-links-user.component';
import { RecommandedProductsCardComponent } from './recommanded-products-card/recommanded-products-card.component';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipe/safe.pipe';
import { NavbarLogoComponent } from 'app/components/public/navbar/navbar-logo/navbar-logo.component';
// import { CUSTOM_COMPILER_TOKEN, createCompiler, SharedConstants } from './shared.constants';
import { CustomPipeModule } from './pipe/CustomPipes.module';
import { KenticoEmptyPipe } from './pipe/kentico-empty.pipe';
import { KenticoUnknownPipe } from './pipe/kentico-unknown.pipe';

import { BusinessFormComponent } from './business-form/business-form.component';
import { ComponentLoaderModule } from 'app/modules/tenants/component-loader/component-loader.module';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { LandingPageComponent } from 'app/components/public/landing-page/landingpage.component';
import { SharedRoutingModule } from './shared-routing.module';

import { RedirectComponent } from './redirect/redirect.component';
import { CustomCurrencyPipe } from './pipe/currency.pipe';

import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { CaptchaService } from './captcha.service';
import { ContactsFormComponent } from './contact-form/contacts-form.component';
import { CyPipe } from './pipe/cy.pipe';
import { InternalHeaderComponent } from 'app/components/public/internal-header/internal-header.component';
import { GtmEventDirective } from 'app/core/models/gtm/gtm-event.directive';
import { KenticoModule } from '../modules/kentico/kentico.module';
import { RecommandedProductsCardBasicComponent } from './recommanded-products-card-basic/recommanded-products-card-basic.component';
import { NavbarPcComponent } from 'app/components/public/navbar/navbar-pc/navbar-pc.component';
import { HomeContainerComponent } from '../components/public/homepage/home-container/home-container.component';
import { ChangeCountryComponent } from '../components/public/change-country/change-country.component';
import { PrivatiComponent } from '../components/public/migration/privati/privati.component';
import { NavbarPetExclusiveComponent } from 'app/components/public/navbar/navbar-pet-exclusive/navbar-pet-exclusive.component';
import { LandingPageRedirectComponent } from 'app/components/public/landing-page/landing-page-redirect/landing-page-redirect.component';
import { NavbarTimComponent } from 'app/components/public/navbar/navbar-tim/navbar-tim.component';
import { NavbarTimEmployeesComponent } from 'app/components/public/navbar/navbar-tim/navbar-tim-employees/navbar-tim-employees.component';
import { LandingPageTimEmployeesComponent } from 'app/components/public/landing-page/landing-page-tim/landing-page-tim-employees.component';
import { SupportHeaderComponent } from 'app/components/public/support/support-tim/support-header/support-header.component';
import { SupportBreadcrumComponent } from 'app/components/public/support/support-tim/support-breadcrum/support-breadcrum.component';
import { LandingPageTimCustomersComponent } from 'app/components/public/landing-page/landing-page-tim-customers/landing-page-tim-customers.component';
import { DecimalMaskDirective } from './directory/decimal-mask.directive';
import { ControlMaxPriceDirective } from './directory/control-max-price.directive';
import { FeatureToggleDirective } from './directory/feature.directive';
import { ReplaceDotWithComma } from './pipe/replace-dot-with-comma.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ModalOpenerDirective } from 'app/modules/security/directives/modals/modal-opener.directive';
import { EntriesPipe } from './pipe/entries.pipe';
import { CurrencySymbolComma } from './pipe/currencySymbolComma.pipe';
import { GenerateAnnualPricePipe } from './pipe/generate-annual-price.pipe';
// import { InvisibleReCaptchaComponent } from './invisible-re-captcha/invisible-re-captcha.component';
import { KenticoPipe } from './pipe/kentico.pipe';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarViaggiBreveComponent } from 'app/modules/nyp-checkout/modules/tim-protezione-viaggi/modules/tim-protezione-viaggi-breve/calendar/calendar-viaggi-breve.component';
import { CalendarViaggiRoamingComponent } from 'app/modules/nyp-checkout/modules/tim-protezione-viaggi/modules/tim-protezione-viaggi-roaming/calendar/calendar-viaggi-roaming.component';
import { ToFormattedDatePipe } from './pipe/to-formatted-date.pipe';
import { ControlIsInvalidPipe } from './pipe/control-is-invalid.pipe';
import { PacketSelectorComponent } from 'app/components/public/packet-selector/packet-selector.component';
import { PacketPriceDisplayComponent } from 'app/components/public/packet-price-display/packet-price-display.component';
import { HasLongTextAnswersPipe } from './pipe/has-long-text-answers.pipe';
@NgModule({
  declarations: [
    ConsentFormComponent,
    LoadingComponent,
    DynamicSectionComponent,
    RecommendedProductsComponent,
    // NavbarYPrivateAreaComponent,
    NavbarComponent,
    //  NavbarYComponent,
    //  NavbarBsComponent,
    NavbarCbComponent,
    NavbarCbLinksUserComponent,
    NavbarPcComponent,
    //  NavbarLeasysComponent,
    NavbarLogoComponent,
    NavbarMenuComponent,
    //   NavbarFcaComponent,
    NavbarTimComponent,
    NavbarTimEmployeesComponent,
    NavbarPetExclusiveComponent,
    //    NavbarSantaluciaComponent,
    RecommandedProductsCardComponent,
    SafePipe,
    CustomCurrencyPipe,
    ReplaceDotWithComma,
    CyPipe,
    BusinessFormComponent,
    LandingPageComponent,
    //  LandingPageIntesaComponent,
    //   LandingPageCBComponent,
    LandingPageTimEmployeesComponent,
    LandingPageTimCustomersComponent,
    RedirectComponent,
    //  LandingpageMediaworldComponent,
    ContactsFormComponent,
    InternalHeaderComponent,
    GtmEventDirective,
    RecommandedProductsCardBasicComponent,
    ChangeCountryComponent,
    HomeContainerComponent,
    PrivatiComponent,
    //   LandingPageFCAComponent,
    //  LandingPageImaginComponent,
    // SupportMoparComponent,
    // SupportFcaComponent,
    //   NavbarRavennaComponent,
    LandingPageRedirectComponent,
    SupportHeaderComponent,
    SupportBreadcrumComponent,
    DecimalMaskDirective,
    ControlMaxPriceDirective,
    FeatureToggleDirective,
    //   NavbarGenertelSimpleComponent,
    ModalOpenerDirective,
    EntriesPipe,
    CurrencySymbolComma,
    // InvisibleReCaptchaComponent,
    KenticoPipe,
    CalendarComponent,
    CalendarViaggiBreveComponent,
    CalendarViaggiRoamingComponent,
    PacketSelectorComponent,
    PacketPriceDisplayComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    KenticoModule,
    RouterModule,
    NgbModule,
    ScrollToModule.forRoot(),
    CustomPipeModule,
    ComponentLoaderModule,
    SharedRoutingModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  exports: [
    FormsModule,
    ConsentFormComponent,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingComponent,
    KenticoModule,
    DynamicSectionComponent,
    RecommendedProductsComponent,
    //   NavbarYPrivateAreaComponent,
    NavbarComponent,
    //   NavbarYComponent,
    NavbarCbComponent,
    NavbarPcComponent,
    NavbarTimComponent,
    NavbarTimEmployeesComponent,
    RecommandedProductsCardComponent,
    SafePipe,
    CustomCurrencyPipe,
    GenerateAnnualPricePipe,
    ReplaceDotWithComma,
    CyPipe,
    KenticoEmptyPipe,
    KenticoUnknownPipe,
    BusinessFormComponent,
    ContainerComponent,
    RecaptchaFormsModule,
    RecaptchaModule,
    ContactsFormComponent,
    InternalHeaderComponent,
    GtmEventDirective,
    RecommandedProductsCardBasicComponent,
    HomeContainerComponent,
    ChangeCountryComponent,
    // PrivatiComponent,
    // SupportMoparComponent,
    // SupportFcaComponent,
    //  NavbarRavennaComponent,
    SupportHeaderComponent,
    SupportBreadcrumComponent,
    DecimalMaskDirective,
    ControlMaxPriceDirective,
    FeatureToggleDirective,
    //  NavbarGenertelSimpleComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ModalOpenerDirective,
    EntriesPipe,
    //  NavbarSantaluciaComponent,
    CurrencySymbolComma,
    // InvisibleReCaptchaComponent,
    KenticoPipe,
    CalendarComponent,
    CalendarViaggiBreveComponent,
    CalendarViaggiRoamingComponent,
    ToFormattedDatePipe,
    ControlIsInvalidPipe,
    PacketSelectorComponent,
    PacketPriceDisplayComponent,
    HasLongTextAnswersPipe,
  ],
  providers: [
    SharedService,
    NgbCarouselConfig,
    // { provide: CUSTOM_COMPILER_TOKEN, useFactory: createCompiler },
    // SharedConstants,
    CaptchaService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
