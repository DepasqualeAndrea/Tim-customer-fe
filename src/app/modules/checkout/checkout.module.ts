import { CheckoutStepInsuranceInfoBaggageLossLongTermComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-baggage-loss-long-term/checkout-step-insurance-info-baggage-loss-long-term.component';
import { CheckoutLinearStepperCompleteMyPetComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-my-pet/checkout-linear-stepper-complete-my-pet.component';
import { CheckoutStepInsuranceInfoMyPetComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-my-pet/checkout-step-insurance-info-my-pet.component';
import { CheckoutCardInsuranceInfoRecapComponent } from './checkout-card/checkout-card-recap/checkout-card-insurance-info-recap/checkout-card-insurance-info-recap.component';
import { CheckoutStepInsuranceInfoBaggageLossComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-baggage-loss/checkout-step-insurance-info-baggage-loss.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutStepBarComponent } from './checkout-step-bar/checkout-step-bar.component';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutStepInsuranceInfoComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { CheckoutStepAddressComponent } from './checkout-step/checkout-step-address/checkout-step-address.component';
import { CheckoutStepSurveyComponent } from './checkout-step/checkout-step-survey/checkout-step-survey.component';
import { CheckoutStepPaymentComponent } from './checkout-step/checkout-step-payment/checkout-step-payment.component';
import { CheckoutShoppingCartComponent } from './checkout-shopping-cart/checkout-shopping-cart.component';
import { CheckoutCardTransportComponent } from './checkout-card/checkout-card-transport/checkout-card-transport.component';
import { CheckoutStepInsuranceInfoChubbMobilityComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-chubb-mobility/checkout-step-insurance-info-chubb-mobility.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutCardInsuredSubjectsComponent } from './checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import { CheckoutCardRecapComponent } from './checkout-card/checkout-card-recap/checkout-card-recap.component';
import { CheckoutCardRecapSurveyComponent } from './checkout-card/checkout-card-recap/checkout-card-survey-recap/checkout-card-survey-recap.component';
import { CheckoutCardContraenteRecapComponent } from './checkout-card/checkout-card-recap/checkout-card-contraente-recap/checkout-card-contraente-recap.component';
import { AddressFormComponent } from './checkout-step/checkout-step-address/components/address-form/address-form.component';
import { CheckoutStepCompleteComponent } from './checkout-step/checkout-step-complete/checkout-step-complete.component';
import { CheckoutCardRecapInsuredSubjectsComponent } from './checkout-card/checkout-card-recap/checkout-card-recap-insured-subjects/checkout-card-recap-insured-subjects.component';
import { CheckoutStepPaymentPromoCodeComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-promo-code/checkout-step-payment-promo-code.component';
import { CheckoutStepPaymentDocumentsAcceptanceComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-documents-acceptance/checkout-step-payment-documents-acceptance.component';
import { CheckoutStepConfirmComponent } from './checkout-step/checkout-step-confirm/checkout-step-confirm.component';
import { CheckoutStepInsuranceInfoViaggiGoldComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-viaggi-gold/checkout-step-insurance-info-viaggi-gold.component';
import { CheckoutStepInsuranceInfoBikeGoldComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-bike-gold/checkout-step-insurance-info-bike-gold.component';
import { CheckoutStepInsuranceInfoSportGoldComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-sport-gold/checkout-step-insurance-info-sport-gold.component';
import { CheckoutStepInsuranceInfoElettrodomesticiComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-elettrodomestici/checkout-step-insurance-info-elettrodomestici.component';
import { CheckoutStepInsuranceInfoSmartphoneComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-smartphone/checkout-step-insurance-info-smartphone.component';
import { CheckoutStepInsuranceInfoSciComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-sci/checkout-step-insurance-info-sci.component';
import { CheckoutStepInsuranceInfoSunnyComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-sunny/checkout-step-insurance-info-sunny.component';
import { CheckoutStepInsuranceInfoMyMobilityComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-my-mobility/checkout-step-insurance-info-my-mobility.component';
import { CheckoutStepInsuranceInfoViaggiEuropaComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-viaggi-europa/checkout-step-insurance-info-viaggi-europa.component';
import { CheckoutStepInsuranceInfoProtezioneVoloComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-protezione-volo/checkout-step-insurance-info-protezione-volo.component';
import { CheckoutStepInsuranceInfoAnnullamentoViaggioComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-annullamento-viaggio/checkout-step-insurance-info-annullamento-viaggio.component';
import { CheckoutStepInsuranceInfoLavoriCasaComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-lavori-casa/checkout-step-insurance-info-lavori-casa.component';
import { CheckoutStepInsuranceInfoMiFidoComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-mi-fido/checkout-step-insurance-info-mi-fido.component';
import { CheckoutCardWorkPerformanceComponent } from './checkout-card/checkout-card-work-performance/checkout-card-work-performance.component';
import { CheckoutStepInsuranceInfoBikeEasyComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-bike-easy/checkout-step-insurance-info-bike-easy.component';
import { CheckoutStepInsuranceInfoBikeTopComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-bike-top/checkout-step-insurance-info-bike-top.component';
import { CheckoutStepInsuranceInfoViaggiAxaFlightComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-viaggi-axa-flight/checkout-step-insurance-info-viaggi-axa-flight.component';
import { CheckoutStepInsuranceInfoChubbSportComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-chubb-sport/checkout-step-insurance-info-chubb-sport.component';
import { PaymentManagementModule } from '../payment-management/payment-management.module';
import { ApplianceManagementModule } from '../appliance-management/appliance-management.module';
import { CheckoutCardAddonsComponent } from './checkout-card/checkout-card-addons/checkout-card-addons.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { SecurityModule } from '../security/security.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { CheckoutStepInsuranceInfoSkiComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-ski/checkout-step-insurance-info-ski.component';
import { CheckoutStepInsuranceInfoEsquiComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-esqui/checkout-step-insurance-info-esqui.component';
import { CheckoutStepInsuranceInfoHolidayHomeComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-holiday-home/checkout-step-insurance-info-holiday-home.component';
import { CheckoutCardDateTimeComponent } from './checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import { CheckoutCardPeriodComponent } from './checkout-card/checkout-card-period/checkout-card-period.component';
import { CheckoutCardHouseAddressComponent } from './checkout-card/checkout-card-house-address/checkout-card-house-address.component';
import { CustomPipeModule } from 'app/shared/pipe/CustomPipes.module';
import { CheckoutCardGuaranteesComponent } from './checkout-card-guarantees/checkout-card-guarantees/checkout-card-guarantees.component';
import { CheckoutStepInsuranceInfoLegalProtectionComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-legal-protection/checkout-step-insurance-info-legal-protection.component';
import { CheckoutGuard } from './checkout-guard';
import { AddressBusinessFormComponent } from './checkout-step/checkout-step-address/components/business-form/address-business-form.component';
import { CheckoutStepInsuranceInfoTravelPackComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-travel-pack/checkout-step-insurance-info-travel-pack.component';
import { CheckoutStepInsuranceInfoSportPackComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-sport-pack/checkout-step-insurance-info-sport-pack.component';
import { CheckoutCardRecapCompleteComponent } from './checkout-card/checkout-card-recap-complete/checkout-card-recap-complete.component';
import { CheckoutShoppingCartPaymentDetailsComponent } from './checkout-shopping-cart-payment-details/checkout-shopping-cart-payment-details.component';
import { CheckoutStepInsuranceInfoChubbDeporteComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-chubb-deporte/checkout-step-insurance-info-chubb-deporte.component';
import { CheckoutStepInsuranceInfoChubbDeporteRecComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-chubb-deporte-rec/checkout-step-insurance-info-chubb-deporte-rec.component';
import { CheckoutStepInsuranceInfoSerenityComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-serenity/checkout-step-insurance-info-serenity.component';
import { CostLineGeneratorService } from './services/cost-line-generators/cost-line-generator.service';
import { CheckoutStepInsuranceInfoIntesaPetComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-intesa-pet/checkout-step-insurance-info-intesa-pet.component';
import { CheckoutStepInsuranceInfoYoloCareComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-yolo-care/checkout-step-insurance-info-yolo-care.component';
import { CheckoutHeaderComponent } from './checkout-linear-stepper/components/checkout-header/checkout-header.component';
import { CheckoutLinearStepperComponent } from './checkout-linear-stepper/checkout-linear-stepper.component';
import { CheckoutLinearStepperBaseComponent } from './checkout-linear-stepper/components/checkout-linear-stepper-base/checkout-linear-stepper-base.component';
import { CheckoutLinearStepperInsuranceInfoComponent } from './checkout-linear-stepper/components/checkout-linear-stepper-insurance-info/checkout-linear-stepper-insurance-info.component';
import { InsuranceInfoCompletedComponent } from './checkout-linear-stepper/components/insurance-completed-steps/insurance-info-completed/insurance-info-completed.component';
import { InsuranceHolderCompletedComponent } from './checkout-linear-stepper/components/insurance-completed-steps/insurance-holder-completed/insurance-holder-completed.component';
import { InsuranceSurveyCompletedComponent } from './checkout-linear-stepper/components/insurance-completed-steps/insurance-survey-completed/insurance-survey-completed.component';
import { InsuranceUncompletedStepComponent } from './checkout-linear-stepper/components/insurance-uncompleted-step/insurance-uncompleted-step.component';
import { BackNextControllerComponent } from './checkout-linear-stepper/components/back-next-controller/back-next-controller.component';
import { CheckoutCostItemDetailsComponent } from './checkout-linear-stepper/components/checkout-cost-item-details/checkout-cost-item-details.component';
import { InsuranceUncompletedStepsComponent } from './checkout-linear-stepper/components/insurance-uncompleted-steps/insurance-uncompleted-steps.component';
import { InsuranceCompletedStepsComponent } from './checkout-linear-stepper/components/insurance-completed-steps/insurance-completed-steps.component';
import { InsurancePaymentCompletedComponent } from './checkout-linear-stepper/components/insurance-completed-steps/insurance-payment-completed/insurance-payment-completed.component';
import { CheckoutLinearStepperCompleteComponent } from './checkout-step/checkout-step-complete/checkout-linear-stepper-complete/checkout-linear-stepper-complete.component';
import { CheckoutLinearStepperPaymentComponent } from './checkout-step/checkout-step-payment/checkout-linear-stepper-payment/checkout-linear-stepper-payment.component';
import { StickyTriggerResetDirective } from './directives/target-trigger/sticky/sticky-trigger-reset.directive';
import { StickyTriggerControlDirective } from './directives/target-trigger/sticky/sticky-trigger-control.directive';
import { StickyTargetDirective } from './directives/target-trigger/sticky/sticky-target.directive';
import { CheckoutStepPaymentOriginalComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-original/checkout-step-payment-original.component';
import { CheckoutCostItemDetailsShoppingCartComponent } from './checkout-linear-stepper/components/checkout-cost-item-details-shopping-cart/checkout-cost-item-details-shopping-cart.component';
import { CheckoutStepCompleteOriginalComponent } from './checkout-step/checkout-step-complete/checkout-step-complete-original/checkout-step-complete-original.component';
import { CheckoutStepInsuranceInfoSaraSerenetaComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-sara-sereneta/checkout-step-insurance-info-sara-sereneta.component';
import { CheckoutStickyBarComponent } from './checkout-sticky-bar/checkout-sticky-bar.component';
import { CheckoutStepInsuranceInfoPersonalAccidentComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-personal-accident/checkout-step-insurance-info-personal-accident.component';
import { CheckoutStepInsuranceInfoCoveredTiresComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-covered-tires/checkout-step-insurance-info-covered-tires.component';
import { CheckoutStepInsuranceInfoCovidComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-covid/checkout-step-insurance-info-covid.component';
import { AddressFormTimComponent } from './checkout-step/checkout-step-address/components/address-form-tim/address-form-tim.component';
import { CheckoutLinearStepperCompleteTimHomageComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-tim-homage/checkout-linear-stepper-complete-tim-homage.component';
import { CheckoutCardAddonsWithLimitComponent } from './checkout-card/checkout-card-addons-with-limit/checkout-card-addons-with-limit.component';
import { CheckoutStepInsuranceInfoTravelComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-travel/checkout-step-insurance-info-travel.component';
import { CheckoutStepInsuranceInfoEhealthComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-ehealth/checkout-step-insurance-info-ehealth.component';
import { CheckoutStepInsuranceInfoRcaFcaComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-rca-fca/checkout-step-insurance-info-rca-fca.component';
import { CheckoutLinearStepperCompleteFcaRcAutoComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-fca-rc-auto/checkout-linear-stepper-complete-fca-rc-auto.component';
import { AddressFormCivibankComponent } from './checkout-step/checkout-step-address/components/address-form-civibank/address-form-civibank.component';
import { CheckoutStepInsuranceInfoPetCivibankComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-pet-civibank/checkout-step-insurance-info-pet-civibank.component';
import { CheckoutCardInsuredPetComponent } from './checkout-card/checkout-card-insured-pet/checkout-card-insured-pet.component';
import { CheckoutCardInsuredShipmentComponent } from './checkout-card/checkout-card-insured-shipment/checkout-card-insured-shipment.component';
import { CheckoutPaymentCallbackDoneComponent } from './checkout-payment-callback-done/checkout-payment-callback-done.component';
import { AddressFormTimEmployeesComponent } from './checkout-step/checkout-step-address/components/address-form-tim/address-form-tim-employees/address-form-tim-employees.component';
import { CheckoutStepLdapLoginComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-ldap-login/checkout-step-ldap-login.component';
import { CheckoutLinearStepperPaymentRedirectSiaComponent } from './checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-sia/checkout-linear-stepper-payment-redirect-sia.component';
import { CheckoutPaymentCallbackFailComponent } from './checkout-payment-callback-fail/checkout-payment-callback-fail.component';
import { CheckoutLinearStepperPaymentRedirectComponent } from './checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect.component';
import { CheckoutLinearStepperNoPaymentComponent } from './checkout-step/checkout-step-payment/checkout-linear-stepper-no-payment/checkout-linear-stepper-no-payment.component';
import { CheckoutLinearStepperCompletePmiComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-pmi/checkout-linear-stepper-complete-pmi.component';
import { CheckoutLinearStepperCompletePreciseTimeComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-precise-time/checkout-linear-stepper-complete-precise-time.component';
import { CheckoutStepInsuranceInfoYoloCyberComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-yolo-cyber/checkout-step-insurance-info-yolo-cyber.component';
import { LoginRegisterTimRetireesComponent } from './login-register/tim-retirees/login-register-tim-retirees/login-register-tim-retirees.component';
import { CheckoutStepInsuranceInfoGeMotorComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-ge-motor/checkout-step-insurance-info-ge-motor.component';
import { CheckoutCardInsuranceInfoAutoFormComponent } from './checkout-card/checkout-card-insurance-info-auto-form/checkout-card-insurance-info-auto-form.component';
import { CheckoutCardInsuranceInfoAutoProposalComponent } from './checkout-card/checkout-card-insurance-info-auto-proposal/checkout-card-insurance-info-auto-proposal.component';
import { CheckoutLinearStepperPaymentRedirectGupComponent } from './checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/checkout-linear-stepper-payment-redirect-gup.component';
import { PaymentWalletListGupComponent } from './checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/payment-wallet-list-gup/payment-wallet-list-gup.component';
import { InsuranceInfoModalAutoProposalComponent } from './checkout-card/checkout-card-insurance-info-auto-proposal/insurance-info-modal-auto-proposal/insurance-info-modal-auto-proposal.component';
import { CheckoutCardInsuranceInfoMotorOptionalWarrantiesComponent } from './checkout-card/checkout-card-insurance-info-motor-optional-warranties/checkout-card-insurance-info-motor-optional-warranties.component';
import { LoginRegisterTimCustomersComponent } from './login-register/tim-customers/login-register-tim-customers/login-register-tim-customers.component';
import { CheckoutInsuranceInfoRecapMotorProposalsComponent } from './checkout-card/checkout-card-recap/checkout-insurance-info-recap-motor-proposals/checkout-insurance-info-recap-motor-proposals.component';
import { AddressFormGeMotorComponent } from './checkout-step/checkout-step-address/components/address-form-ge-motor/address-form-ge-motor.component';
import { CheckoutInsuranceInfoMotorModalOptionalWarrantiesComponent } from './checkout-card/checkout-card-insurance-info-motor-optional-warranties/checkout-insurance-info-motor-modal-optional-warranties/checkout-insurance-info-motor-modal-optional-warranties.component';
import { CheckoutCostItemDownloadPreventivoComponent } from './checkout-linear-stepper/components/checkout-cost-item-details-shopping-cart/checkout-cost-item-download-preventivo/checkout-cost-item-download-preventivo.component';
import { CheckoutInsuranceInfoMotorModalDetailsWarrantiesComponent } from './checkout-card/checkout-card-insurance-info-motor-optional-warranties/checkout-insurance-info-motor-modal-details-warranties/checkout-insurance-info-motor-modal-details-warranties.component';
import { CheckoutStepInsuranceInfoGeHomeComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-ge-home/checkout-step-insurance-info-ge-home.component';
import { CheckoutCardInsuranceInfoHomeDataComponent } from './checkout-card/checkout-card-insurance-info-home-data/checkout-card-insurance-info-home-data.component';
import { CheckoutCardInsuranceInfoHomeProposalComponent } from './checkout-card/checkout-card-insurance-info-home-proposal/checkout-card-insurance-info-home-proposal.component';
import { CheckoutCardInsuranceInfoHomeOptionalWarrantiesComponent } from './checkout-card/checkout-card-insurance-info-home-optional-warranties/checkout-card-insurance-info-home-optional-warranties.component';
import { LoginRegisterTimCustomersCheckoutComponent } from './login-register/tim-customers/login-register-tim-customers-checkout/login-register-tim-customers-checkout.component';
import { CheckoutInsuranceInfoPetModalOptionalWarrantiesComponent } from './checkout-card/checkout-card-insured-pet/checkout-insurance-info-pet-modal-optional-warranties/checkout-insurance-info-pet-modal-optional-warranties.component';
import { RedirectCheckoutComponent } from './redirect-checkout/redirect-checkout.component';
import { CheckoutSuccessPaymentGupComponent } from './checkout-success-payment-gup/checkout-success-payment-gup.component';
import { CheckoutFailPaymentGupComponent } from './checkout-fail-payment-gup/checkout-fail-payment-gup.component';
import { CheckoutStepInsuranceInfoTimMyHomeComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-tim-my-home/checkout-step-insurance-info-tim-my-home.component';
import { CheckoutCardInsuranceInfoTimMyHomeDataComponent } from './checkout-card/checkout-card-insurance-info-tim-my-home-data/checkout-card-insurance-info-tim-my-home-data.component';
import { CheckoutCardInsuranceInfoTimMyHomeProposalComponent } from './checkout-card/checkout-card-insurance-info-tim-my-home-proposal/checkout-card-insurance-info-tim-my-home-proposal.component';
import { CheckoutCardInsuranceInfoTimMyHomeOptionaWarrantiesComponent } from './checkout-card/checkout-card-insurance-info-tim-my-home-optiona-warranties/checkout-card-insurance-info-tim-my-home-optiona-warranties.component';
import { InsuranceInfoModalTimMyHomeProposalComponent } from './checkout-card/checkout-card-insurance-info-tim-my-home-proposal/insurance-info-modal-tim-my-home-proposal/insurance-info-modal-tim-my-home-proposal.component';
import { ModalOwnerAdressFormComponent } from './checkout-step/checkout-step-address/components/address-form-ge-motor/modal-owner-adress-form/modal-owner-adress-form.component';
import { TimMyHomeLinkedAddonModalComponent } from './checkout-card/checkout-card-insurance-info-tim-my-home-optiona-warranties/tim-my-home-linked-addon-modal/tim-my-home-linked-addon-modal.component';
import { CheckoutLinearStepperCompleteSimpleComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-simple.component.ts/checkout-linear-stepper-complete-simple.component';
import { ModalPaymentWalletListGupComponent } from './checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/modal-payment-wallet-list-gup/modal-payment-wallet-list-gup.component';
import { CheckoutInsuranceInfoRecapTimMyHomeProposalsComponent } from './checkout-card/checkout-card-recap/checkout-insurance-info-recap-tim-my-home-proposals/checkout-insurance-info-recap-tim-my-home-proposals.component';
import { CheckoutStepPaymentDocumentsAcceptanceAltComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-documents-acceptance-alt/checkout-step-payment-documents-acceptance-alt.component';
import { CheckoutStepInsuranceInfoCustomersTimPetComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-customers-tim-pet/checkout-step-insurance-info-customers-tim-pet.component';
import { CheckoutLinearStepperCompleteTimPaymentComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-tim-payment/checkout-linear-stepper-complete-tim-payment.component';
import { CheckoutCardInsuranceInfoHomeOptionalWarrantiesModalComponent } from './checkout-card/checkout-card-insurance-info-home-optional-warranties/checkout-card-insurance-info-home-optional-warranties-modal/checkout-card-insurance-info-home-optional-warranties-modal.component';
import { CheckoutStepInsuranceInfoScooterBikeComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-scooter-bike/checkout-step-insurance-info-scooter-bike.component';
import { CheckoutStepPaymentCarrefourConsentComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-carrefour-consent/checkout-step-payment-carrefour-consent.component';
import { CheckoutStepInsuranceInfoGenertelSciComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-genertel-sci/checkout-step-insurance-info-genertel-sci.component';
import { AddressFormGenertelSciComponent } from './checkout-step/checkout-step-address/components/address-form-genertel-sci/address-form-genertel-sci.component';
import { CheckoutStepPaymentGenertelSciComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-genertel-sci/checkout-step-payment-genertel-sci.component';
import { SignUpGenertelComponent } from '../security/components/register/sign-up-genertel/sign-up-genertel.component';
import { CheckoutLinearStepperCompleteGenertelSciComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-genertel-sci/checkout-linear-stepper-complete-genertel-sci.component';
import { EstimateRedirectCheckoutComponent } from './estimate-redirect-checkout/estimate-redirect-checkout.component';
import { CheckoutStepInsuranceInfoTimMySciComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-tim-my-sci/checkout-step-insurance-info-tim-my-sci.component';
import { CheckoutCardInsuranceInfoTimMySciDurationComponent } from './checkout-card/checkout-card-insurance-infot-tim-my-sci-suration/checkout-card-insurance-info-tim-my-sci-duration.component';
import { CheckoutCardInsuranceInfoTimMySciProposalComponent } from './checkout-card/checkout-card-insurance-info-tim-my-sci-proposal/checkout-card-insurance-info-tim-my-sci-proposal.component';
import { CheckoutCardInsuranceInfoTimMySciNumberInsuredComponent } from './checkout-card/checkout-card-insurance-info-tim-my-sci-number-insured/checkout-card-insurance-info-tim-my-sci-number-insured.component';
import { CheckoutCardInsuranceInfoTimMySciDataInsuredComponent } from './checkout-card/checkout-card-insurance-info-tim-my-sci-data-insured/checkout-card-insurance-info-tim-my-sci-data-insured.component';
import { PaymentBankAccountComponent } from './checkout-step/checkout-step-payment/payment-bank-account/payment-bank-account.component';
import { CheckoutStepPaymentBankAccountComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-bank-account/checkout-step-payment-bank-account.component';
import { OtpModalVerifyComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-bank-account/otp-modal-verify/otp-modal-verify.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { PushModalVerifyComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-bank-account/push-modal-verify/push-modal-verify.component';
import { CheckoutInsuranceInfoRecapTimMySciComponent } from './checkout-card/checkout-card-recap/checkout-insurance-info-recap-tim-my-sci/checkout-insurance-info-recap-tim-my-sci.component';
import { InsuranceInfoModalTimMySciProposalComponent } from './checkout-card/checkout-card-insurance-info-tim-my-sci-proposal/insurance-info-modal-tim-my-sci-proposal/insurance-info-modal-tim-my-sci-proposal.component';
import { CheckoutLinearStepperCompleteMySciComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-my-sci/checkout-linear-stepper-complete-my-sci.component';
import { CheckoutLinearStepperCompleteTimHomeComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-tim-home/checkout-linear-stepper-complete-tim-home.component';
import { CheckoutCardInsuranceInfoTimPetProposalComponent } from './checkout-card/checkout-card-insurance-info-tim-pet-proposal/checkout-card-insurance-info-tim-pet-proposal.component';
import { CheckoutCardInsuranceInfoTimPetInsuredTypeAnimalComponent } from './checkout-card/checkout-card-insurance-info-tim-pet-insured-type-animal/checkout-card-insurance-info-tim-pet-insured-type-animal.component';
import { CheckoutLinearStepperCompleteCustomersTimPetComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-customers-tim-pet/checkout-linear-stepper-complete-customers-tim-pet.component';
import { InsuranceInfoModalTimMyPetProposalComponent } from './checkout-card/checkout-card-insurance-info-tim-pet-proposal/insurance-info-modal-tim-my-pet-proposal/insurance-info-modal-tim-my-pet-proposal.component';
import { CheckoutInsuranceInfoRecapTimPetComponent } from './checkout-card/checkout-card-recap/checkout-insurance-info-recap-tim-pet/checkout-insurance-info-recap-tim-pet.component';
import { CheckoutStepInsuranceInfoTimMotorComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-tim-motor/checkout-step-insurance-info-tim-motor.component';
import { CheckoutStepOutsideSourceComponent } from './checkout-step/checkout-step-outside-source/checkout-step-outside-source/checkout-step-outside-source.component';
import { CheckoutLinearStepperCompleteTimMotorComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-tim-motor/checkout-linear-stepper-complete-tim-motor.component';
import { CheckoutLoginRegisterStepComponent } from './login-register/checkout-login-register-step/checkout-login-register-step.component';
import { CheckoutStepInsuranceInfoSportComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-sport/checkout-step-insurance-info-sport.component';
import { CheckoutCardInstantDateComponent } from './checkout-card/checkout-card-instant-date/checkout-card-instant-date.component';
import { CheckoutCardInsuredSubjectsAgeComponent } from './checkout-card/checkout-card-insured-subjects-age/checkout-card-insured-subjects-age.component';
import { CheckoutCollaborationSectionComponent } from './checkout-linear-stepper/components/checkout-collaboration-section/checkout-collaboration-section.component';
import { CheckoutStepInsuranceInfoHandlerComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-handler/checkout-step-insurance-info-handler.component';
import { CheckoutCostItemDetailsSimpleComponent } from './checkout-linear-stepper/components/checkout-cost-item-details-simple/checkout-cost-item-details-simple.component';
import { CheckoutCardInsuredSubjectsInfoComponent } from './checkout-card/checkout-card-insured-subjects-info/checkout-card-insured-subjects-info.component';
import { ModalScreenProtectionPromoCodeComponent } from './modal-screen-protection/modal-screen-protection-promo-code/modal-screen-protection-promo-code.component';
import { CheckoutStepInsuranceInfoScreenProtectionComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-screen-protection/checkout-step-insurance-info-screen-protection.component';
import { CheckoutLinearStepperCompleteScreenProtectionComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-screen-protection/checkout-linear-stepper-complete-screen-protection.component';
import { ScreenProtectionAskWithdrawalModalComponent } from './modal-screen-protection/screen-protection-ask-withdrawal-modal/screen-protection-ask-withdrawal-modal.component';
import { CheckoutStepInsuranceInfoYoloForSkiComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-yolo-for-ski/checkout-step-insurance-info-yolo-for-ski.component';
import { CheckoutCardDateTimeYoloForSkiComponent } from './checkout-card/checkout-card-date-time-yolo-for-ski/checkout-card-date-time-yolo-for-ski.component';
import { CostItemListComponent } from './checkout-linear-stepper/components/cost-item-list/cost-item-list.component';
import { CheckoutStepInsuranceInfoYMultiriskMainComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk-main/checkout-step-insurance-info-y-multirisk-main.component';
import { CheckoutStepInsuranceInfoYMultiriskResponsabilitaCivileComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-responsabilita-civile/checkout-step-insurance-info-y-multirisk-responsabilita-civile.component';
import { CheckoutStepInsuranceInfoYMultiriskTutelaLegaleComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-tutela-legale/checkout-step-insurance-info-y-multirisk-tutela-legale.component';
import { CheckoutMultiriskAddonRecapComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk-main/checkout-multirisk-addon-recap/checkout-multirisk-addon-recap.component';
import { CheckoutStepInsuranceInfoYMultiriskFormComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-form/checkout-step-insurance-info-y-multirisk-form.component';
import { CheckoutStepInsuranceInfoYMultiriskDataInsuredComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-data-insured/checkout-step-insurance-info-y-multirisk-data-insured.component';
import { CheckoutStepInsuranceInfoYMultiriskStartPriceComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-start-price/checkout-step-insurance-info-y-multirisk-start-price.component';
import { CheckoutLinearStepperPaymentRedirectHelbizComponent } from './checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-helbiz/checkout-linear-stepper-payment-redirect-helbiz.component';
import { CheckoutStepInsuranceInfoYMultiriskFurtoRapinaComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-furto-rapina/checkout-step-insurance-info-y-multirisk-furto-rapina.component';
import { ModalFurtoERapinaComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-furto-rapina/modal-furto-e-rapina/modal-furto-e-rapina.component';
import { CheckoutCostItemDetailsMultiriskShoppingCartComponent } from './checkout-linear-stepper/components/checkout-cost-item-details-shopping-cart/checkout-cost-item-details-multirisk-shopping-cart/checkout-cost-item-details-multirisk-shopping-cart.component';
import { CheckoutStepInsuranceInfoYMultiriskIncendioComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-incendio/checkout-step-insurance-info-y-multirisk-incendio.component';
import { ModalAddonsYMultiriskComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/modal-addons-y-multirisk/modal-addons-y-multirisk.component';
import { CheckoutCostItemDetailsMultiriskShoppingCartModalComponent } from './checkout-linear-stepper/components/checkout-cost-item-details-shopping-cart/checkout-cost-item-details-multirisk-shopping-cart/checkout-cost-item-details-multirisk-shopping-cart-modal/checkout-cost-item-details-multirisk-shopping-cart-modal.component';
import { ModalAdditionalWarrentyYMultiriskComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/modal-additional-warrenty-y-multirisk/modal-additional-warrenty-y-multirisk.component';
import { ModalAbbinamentoYMultiriskComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/modal-abbinamento-y-multirisk/modal-abbinamento-y-multirisk.component';
import { ModalAbbinamentoFurtoYMultiriskComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-y-multirisk/modal-abbinamento-furto-y-multirisk/modal-abbinamento-furto-y-multirisk.component';
import { SuccessModalAddressMultiriskComponent } from './success-modal-address-multirisk/success-modal-address-multirisk.component';
import { CheckoutStepPaymentMultiriskComponent } from './checkout-step/checkout-step-payment/checkout-step-payment-multirisk/checkout-step-payment-multirisk.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CheckoutStepInsuranceInfoWinterSportComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-winter-sport/checkout-step-insurance-info-winter-sport.component';
import { CheckoutStepInsuranceInfoTimForSkiComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-tim-for-ski/checkout-step-insurance-info-tim-for-ski.component';
import { CheckoutLinearStepperCompleteTimForSkiComponent } from './checkout-step/checkout-step-complete/stepper-complete-layouts/checkout-linear-stepper-complete-tim-for-ski/checkout-linear-stepper-complete-tim-for-ski.component';


@NgModule({
  declarations: [
    StickyTriggerResetDirective,
    StickyTriggerControlDirective,
    StickyTargetDirective,
    CheckoutComponent,
    CheckoutStepBarComponent,
    CheckoutStepInsuranceInfoComponent,
    CheckoutStepAddressComponent,
    CheckoutStepSurveyComponent,
    CheckoutStepPaymentComponent,
    CheckoutShoppingCartComponent,
    CheckoutCardTransportComponent,
    CheckoutStepInsuranceInfoChubbMobilityComponent,
    CheckoutCardInsuredSubjectsComponent,
    CheckoutCardRecapComponent,
    CheckoutCardRecapSurveyComponent,
    CheckoutCardContraenteRecapComponent,
    CheckoutCardAddonsComponent,
    CheckoutCardDateTimeComponent,
    CheckoutCardPeriodComponent,
    CheckoutCardHouseAddressComponent,
    AddressFormComponent,
    CheckoutCardRecapInsuredSubjectsComponent,
    CheckoutStepCompleteComponent,
    CheckoutStepPaymentPromoCodeComponent,
    CheckoutStepPaymentDocumentsAcceptanceComponent,
    CheckoutStepConfirmComponent,
    CheckoutStepInsuranceInfoViaggiGoldComponent,
    CheckoutStepInsuranceInfoBikeGoldComponent,
    CheckoutStepInsuranceInfoSportGoldComponent,
    CheckoutStepInsuranceInfoElettrodomesticiComponent,
    CheckoutStepInsuranceInfoSmartphoneComponent,
    CheckoutStepInsuranceInfoSciComponent,
    CheckoutStepInsuranceInfoSunnyComponent,
    CheckoutStepInsuranceInfoMyMobilityComponent,
    CheckoutStepInsuranceInfoViaggiEuropaComponent,
    CheckoutStepInsuranceInfoProtezioneVoloComponent,
    CheckoutStepInsuranceInfoAnnullamentoViaggioComponent,
    CheckoutStepInsuranceInfoLavoriCasaComponent,
    CheckoutStepInsuranceInfoMiFidoComponent,
    CheckoutCardWorkPerformanceComponent,
    CheckoutStepInsuranceInfoBikeEasyComponent,
    CheckoutStepInsuranceInfoBikeTopComponent,
    CheckoutStepInsuranceInfoViaggiAxaFlightComponent,
    CheckoutStepInsuranceInfoChubbSportComponent,
    LoginRegisterComponent,
    CheckoutStepInsuranceInfoSkiComponent,
    CheckoutStepInsuranceInfoEsquiComponent,
    CheckoutStepInsuranceInfoSkiComponent,
    CheckoutStepInsuranceInfoHolidayHomeComponent,
    LoginRegisterComponent,
    CheckoutCardGuaranteesComponent,
    CheckoutStepInsuranceInfoLegalProtectionComponent,
    CheckoutStepInsuranceInfoTravelPackComponent,
    CheckoutStepInsuranceInfoSportPackComponent,
    CheckoutStepInsuranceInfoYoloCareComponent,
    AddressBusinessFormComponent,
    CheckoutCardRecapCompleteComponent,
    CheckoutShoppingCartPaymentDetailsComponent,
    CheckoutStepInsuranceInfoChubbDeporteComponent,
    CheckoutStepInsuranceInfoChubbDeporteRecComponent,
    CheckoutStepInsuranceInfoSerenityComponent,
    CheckoutStepInsuranceInfoIntesaPetComponent,
    CheckoutLinearStepperComponent,
    CheckoutLinearStepperBaseComponent,
    CheckoutLinearStepperInsuranceInfoComponent,
    InsuranceInfoCompletedComponent,
    InsuranceHolderCompletedComponent,
    InsuranceSurveyCompletedComponent,
    InsurancePaymentCompletedComponent,
    InsuranceUncompletedStepComponent,
    BackNextControllerComponent,
    CheckoutHeaderComponent,
    CheckoutCostItemDetailsComponent,
    InsuranceUncompletedStepsComponent,
    InsuranceCompletedStepsComponent,
    CheckoutLinearStepperCompleteComponent,
    CheckoutLinearStepperPaymentComponent,
    CheckoutStepPaymentOriginalComponent,
    CheckoutCostItemDetailsShoppingCartComponent,
    CheckoutStepCompleteOriginalComponent,
    CheckoutStepInsuranceInfoSaraSerenetaComponent,
    CheckoutStickyBarComponent,
    CheckoutStepInsuranceInfoPersonalAccidentComponent,
    CheckoutStepInsuranceInfoCoveredTiresComponent,
    CheckoutStepInsuranceInfoCovidComponent,
    AddressFormTimComponent,
    CheckoutLinearStepperCompleteTimHomageComponent,
    CheckoutStepInsuranceInfoTravelComponent,
    CheckoutCardAddonsWithLimitComponent,
    CheckoutLinearStepperPaymentRedirectComponent,
    CheckoutLinearStepperPaymentRedirectSiaComponent,
    CheckoutStepInsuranceInfoEhealthComponent,
    CheckoutStepInsuranceInfoBaggageLossComponent,
    CheckoutCardInsuranceInfoRecapComponent,
    CheckoutStepInsuranceInfoRcaFcaComponent,
    CheckoutLinearStepperCompleteFcaRcAutoComponent,
    AddressFormCivibankComponent,
    CheckoutStepInsuranceInfoPetCivibankComponent,
    CheckoutCardInsuredPetComponent,
    CheckoutCardInsuredShipmentComponent,
    CheckoutPaymentCallbackDoneComponent,
    CheckoutPaymentCallbackFailComponent,
    CheckoutStepInsuranceInfoMyPetComponent,
    AddressFormTimEmployeesComponent,
    CheckoutStepLdapLoginComponent,
    CheckoutLinearStepperCompleteMyPetComponent,
    CheckoutLinearStepperNoPaymentComponent,
    CheckoutLinearStepperCompletePmiComponent,
    CheckoutLinearStepperCompletePreciseTimeComponent,
    CheckoutStepInsuranceInfoYoloCyberComponent,
    LoginRegisterTimRetireesComponent,
    CheckoutStepInsuranceInfoGeMotorComponent,
    CheckoutCardInsuranceInfoAutoFormComponent,
    CheckoutCardInsuranceInfoAutoProposalComponent,
    CheckoutLinearStepperPaymentRedirectGupComponent,
    PaymentWalletListGupComponent,
    InsuranceInfoModalAutoProposalComponent,
    CheckoutCardInsuranceInfoMotorOptionalWarrantiesComponent,
    LoginRegisterTimCustomersComponent,
    CheckoutInsuranceInfoRecapMotorProposalsComponent,
    AddressFormGeMotorComponent,
    CheckoutInsuranceInfoMotorModalOptionalWarrantiesComponent,
    CheckoutStepInsuranceInfoBaggageLossLongTermComponent,
    CheckoutCostItemDownloadPreventivoComponent,
    CheckoutInsuranceInfoMotorModalDetailsWarrantiesComponent,
    CheckoutStepInsuranceInfoGeHomeComponent,
    CheckoutCardInsuranceInfoHomeDataComponent,
    CheckoutCardInsuranceInfoHomeProposalComponent,
    CheckoutCardInsuranceInfoHomeOptionalWarrantiesComponent,
    LoginRegisterTimCustomersCheckoutComponent,
    CheckoutInsuranceInfoPetModalOptionalWarrantiesComponent,
    RedirectCheckoutComponent,
    CheckoutSuccessPaymentGupComponent,
    CheckoutFailPaymentGupComponent,
    CheckoutStepInsuranceInfoTimMyHomeComponent,
    CheckoutCardInsuranceInfoTimMyHomeDataComponent,
    CheckoutCardInsuranceInfoTimMyHomeProposalComponent,
    CheckoutCardInsuranceInfoTimMyHomeOptionaWarrantiesComponent,
    InsuranceInfoModalTimMyHomeProposalComponent,
    ModalOwnerAdressFormComponent,
    TimMyHomeLinkedAddonModalComponent,
    CheckoutLinearStepperCompleteSimpleComponent,
    ModalPaymentWalletListGupComponent,
    CheckoutInsuranceInfoRecapTimMyHomeProposalsComponent,
    CheckoutStepPaymentDocumentsAcceptanceAltComponent,
    CheckoutStepInsuranceInfoCustomersTimPetComponent,
    CheckoutLinearStepperCompleteTimPaymentComponent,
    CheckoutCardInsuranceInfoHomeOptionalWarrantiesModalComponent,
    CheckoutStepInsuranceInfoScooterBikeComponent,
    CheckoutStepPaymentCarrefourConsentComponent,
    CheckoutStepInsuranceInfoGenertelSciComponent,
    AddressFormGenertelSciComponent,
    CheckoutStepPaymentGenertelSciComponent,
    SignUpGenertelComponent,
    CheckoutLinearStepperCompleteGenertelSciComponent,
    PaymentBankAccountComponent,
    CheckoutStepPaymentBankAccountComponent,
    OtpModalVerifyComponent,
    PushModalVerifyComponent,
    CheckoutStepInsuranceInfoTimMySciComponent,
    CheckoutCardInsuranceInfoTimMySciDurationComponent,
    CheckoutCardInsuranceInfoTimMySciNumberInsuredComponent,
    CheckoutCardInsuranceInfoTimMySciDataInsuredComponent,
    CheckoutCardInsuranceInfoTimMySciProposalComponent,
    InsuranceInfoModalTimMySciProposalComponent,
    CheckoutInsuranceInfoRecapTimMySciComponent,
    CheckoutLinearStepperCompleteMySciComponent,
    CheckoutLinearStepperCompleteTimHomeComponent,
    CheckoutCardInsuranceInfoTimPetProposalComponent,
    CheckoutCardInsuranceInfoTimPetInsuredTypeAnimalComponent,
    CheckoutLinearStepperCompleteCustomersTimPetComponent,
    InsuranceInfoModalTimMyPetProposalComponent,
    CheckoutInsuranceInfoRecapTimPetComponent,
    CheckoutStepInsuranceInfoTimMotorComponent,
    CheckoutStepOutsideSourceComponent,
    CheckoutLinearStepperCompleteTimMotorComponent,
    CheckoutLoginRegisterStepComponent,
    CheckoutStepInsuranceInfoSportComponent,
    CheckoutCardInstantDateComponent,
    CheckoutCardInsuredSubjectsAgeComponent,
    CheckoutCollaborationSectionComponent,
    CheckoutStepInsuranceInfoHandlerComponent,
    CheckoutCostItemDetailsSimpleComponent,
    CheckoutCardInsuredSubjectsInfoComponent,
    ModalScreenProtectionPromoCodeComponent,
    CheckoutStepInsuranceInfoScreenProtectionComponent,
    CheckoutLinearStepperCompleteScreenProtectionComponent,
    ScreenProtectionAskWithdrawalModalComponent,
    CheckoutStepInsuranceInfoYoloForSkiComponent,
    CheckoutCardDateTimeYoloForSkiComponent,
    CheckoutStepInsuranceInfoYMultiriskMainComponent,
    ScreenProtectionAskWithdrawalModalComponent,
    CheckoutStepInsuranceInfoYMultiriskResponsabilitaCivileComponent,
    CheckoutStepInsuranceInfoYMultiriskTutelaLegaleComponent,
    CheckoutStepInsuranceInfoYMultiriskFormComponent,
    CheckoutStepInsuranceInfoYMultiriskStartPriceComponent,
    CheckoutLinearStepperPaymentRedirectHelbizComponent,
    CheckoutMultiriskAddonRecapComponent,
    CheckoutStepInsuranceInfoYMultiriskFurtoRapinaComponent,
    ModalFurtoERapinaComponent,
    CheckoutStepInsuranceInfoYMultiriskIncendioComponent,
    ModalAddonsYMultiriskComponent,
    CheckoutCostItemDetailsMultiriskShoppingCartComponent,
    CheckoutCostItemDetailsMultiriskShoppingCartModalComponent,
    ModalAdditionalWarrentyYMultiriskComponent,
    ModalAbbinamentoYMultiriskComponent,
    ModalAbbinamentoFurtoYMultiriskComponent,
    CheckoutStepInsuranceInfoYMultiriskDataInsuredComponent,
    SuccessModalAddressMultiriskComponent,
    CheckoutStepPaymentMultiriskComponent,
    CheckoutLinearStepperPaymentRedirectHelbizComponent,
    CheckoutStepInsuranceInfoYoloForSkiComponent,
    CheckoutCardDateTimeYoloForSkiComponent,
    CheckoutStepInsuranceInfoWinterSportComponent,
    CostItemListComponent,
    CheckoutStepInsuranceInfoTimForSkiComponent,
    CheckoutLinearStepperCompleteTimForSkiComponent,
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    ReactiveFormsModule,
    PaymentManagementModule,
    ApplianceManagementModule,
    FormsModule,
    SharedModule,
    SecurityModule,
    NgbModule,
    ScrollToModule.forRoot(),
    CustomPipeModule,
    NgOtpInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule
  ],
  providers: [
    NgbActiveModal, CheckoutGuard, CostLineGeneratorService
  ]
})
export class CheckoutModule {
}
