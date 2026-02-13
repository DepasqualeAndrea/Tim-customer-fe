import { NavbarMenuComponent } from './../components/public/navbar/navbar-menu/navbar-menu.component';
import moment from 'moment';
import { BusinessFormComponent } from './business-form/business-form.component';
import { ConsentFormComponent } from './consent-form/consent-form.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from './loading/loading.component';
import { SharedService } from './shared.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { DynamicSectionComponent } from './dynamic-section/dynamic-section.component';

import { RouterModule } from '@angular/router';

import { NavbarComponent } from 'app/components/public/navbar/navbar.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { CommonModule } from '@angular/common';
import { SafePipe } from './pipe/safe.pipe';
import { NavbarLogoComponent } from 'app/components/public/navbar/navbar-logo/navbar-logo.component';
// import { CUSTOM_COMPILER_TOKEN, createCompiler, SharedConstants } from './shared.constants';
import { CustomPipeModule } from './pipe/CustomPipes.module';
import { KenticoEmptyPipe } from './pipe/kentico-empty.pipe';
import { KenticoUnknownPipe } from './pipe/kentico-unknown.pipe';
import { KenticoModule } from '../modules/kentico/kentico.module';


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

import { NavbarTimComponent } from 'app/components/public/navbar/navbar-tim/navbar-tim.component';
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
        NavbarComponent,
        BusinessFormComponent,
        NavbarLogoComponent,
        NavbarMenuComponent,
        NavbarTimComponent,
        SafePipe,
        CustomCurrencyPipe,
        ReplaceDotWithComma,
        CyPipe,
        LandingPageComponent,
        LandingPageTimCustomersComponent,
        RedirectComponent,
        ContactsFormComponent,
        SupportHeaderComponent,
        SupportBreadcrumComponent,
        DecimalMaskDirective,
        ControlMaxPriceDirective,
        FeatureToggleDirective,
        ModalOpenerDirective,
        EntriesPipe,
        CurrencySymbolComma,
        KenticoPipe,
        CalendarComponent,
        CalendarViaggiBreveComponent,
        CalendarViaggiRoamingComponent,
        PacketSelectorComponent,
        PacketPriceDisplayComponent,
    ],
    exports: [
        FormsModule,
        ConsentFormComponent,
        ReactiveFormsModule,
        LoadingComponent,
        KenticoModule,
        DynamicSectionComponent,
        SafePipe,
        CustomCurrencyPipe,
        GenerateAnnualPricePipe,
        ReplaceDotWithComma,
        CyPipe,
        KenticoEmptyPipe,
        KenticoUnknownPipe,
        RecaptchaFormsModule,
        RecaptchaModule,
        ContactsFormComponent,
        BusinessFormComponent,
        SupportHeaderComponent,
        SupportBreadcrumComponent,
        DecimalMaskDirective,
        ControlMaxPriceDirective,
        FeatureToggleDirective,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        ModalOpenerDirective,
        EntriesPipe,
        CurrencySymbolComma,
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [FormsModule,
        CommonModule,
        ReactiveFormsModule,
        KenticoModule,
        RouterModule,
        NgbModule,
        ScrollToModule,
        CustomPipeModule,
        SharedRoutingModule,
        RecaptchaFormsModule,
        RecaptchaModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule], providers: [
            SharedService,
            NgbCarouselConfig,
            // { provide: CUSTOM_COMPILER_TOKEN, useFactory: createCompiler },
            // SharedConstants,
            CaptchaService,
            provideHttpClient(withInterceptorsFromDi())
        ]
})
export class SharedModule { }
