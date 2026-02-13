import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuardPrivateArea } from 'app/core/services/auth-guard-private-area.service';
import { SharedModule } from '../../shared/shared.module';
import { ComponentLoaderModule } from '../tenants/component-loader/component-loader.module';

import { KenticoTranslatePipe } from '../kentico/data-layer/kentico-translate.pipe';
import { KenticoPipe } from 'app/shared/pipe/kentico.pipe';

import { ClaimDetailComponent } from './components/claim-detail/claim-detail.component';
import { MyClaimsPetComponent } from './components/my-claims/my-claims-pet/my-claims-pet.component';
import { MyClaimsComponent } from './components/my-claims/my-claims.component';
import { MyDocumentsComponent } from './components/my-documents/my-documents.component';
import { MyPoliciesDetailedComponent } from './components/my-policies/my-policies-detailed/my-policies-detailed.component';
import { MyPoliciesComponent } from './components/my-policies/my-policies.component';
import { MyQuotesComponent } from './components/my-quotes/my-quotes.component';
import { PaymentMethodsModalConfirmDeleteComponent } from './components/payment-methods/payment-methods-modal-confirm-delete/payment-methods-modal-confirm-delete.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { ModalWithdrawalSuccessNetComponent } from './components/policy-detail/modal-withdrawal-success-net/modal-withdrawal-success-net.component';
import { PolicyConfirmModalRequestComponent } from './components/policy-detail/policy-confim-modal-request/policy-confirm-modal-request.component';

import { PolicyConfirmModalClaimComponent } from './components/policy-detail/policy-confirm-modal-claim/policy-confirm-modal-claim.component';
import { PolicyDetailBasicPaymentComponent } from './components/policy-detail/policy-detail-basic/policy-detail-basic-payment/policy-detail-basic-payment.component';
import { PolicyDetailModalClaimTimForSkiOthersModalityComponent } from './components/policy-detail/policy-detail-full/policy-detail-modal-claim-tim-for-ski-others-modality/policy-detail-modal-claim-tim-for-ski-others-modality.component';
import { PolicyDetailReplacementModalComponent } from './components/policy-detail/policy-detail-full/policy-detail-replacement-modal/policy-detail-replacement-modal.component';
import { PolicyDetailReplacementSuccessHomeAnimalsModalComponent } from './components/policy-detail/policy-detail-full/policy-detail-replacement-success-home-animals-modal/policy-detail-replacement-success-home-animals-modal.component';
import { PolicyDetailReplacementSuccessNotInterestedModalComponent } from './components/policy-detail/policy-detail-full/policy-detail-replacement-success-not-interested-modal/policy-detail-replacement-success-not-interested-modal.component';
import { PolicyDetailListPaymentsComponent } from './components/policy-detail/policy-detail-list-payments/policy-detail-list-payments.component';

import { PolicyDetailModalCancelationSuccessComponent } from './components/policy-detail/policy-detail-modal-cancelation-success/policy-detail-modal-cancelation-success.component';
import { PolicyDetailModalCancelationComponent } from './components/policy-detail/policy-detail-modal-cancelation/policy-detail-modal-cancelation.component';
import { PolicyDetailModalCancellationMultiriskComponent } from './components/policy-detail/policy-detail-modal-cancellation-multirisk/policy-detail-modal-cancellation-multirisk.component';
import { PolicyDetailModalClaimAttachmentsComponent } from './components/policy-detail/policy-detail-modal-claim-attachments/policy-detail-modal-claim-attachments.component';

import { PolicyDetailModalClaimEsComponent } from './components/policy-detail/policy-detail-modal-claim-es/policy-detail-modal-claim-es.component';
import { PolicyDetailModalClaimPetFormComponent } from './components/policy-detail/policy-detail-modal-claim-pet-form/policy-detail-modal-claim-pet-form/policy-detail-modal-claim-pet-form.component';
import { PolicyDetailModalClaimSciComponent } from './components/policy-detail/policy-detail-modal-claim-sci/policy-detail-modal-claim-sci.component';
import { PolicyDetailModalClaimScooterBikeComponent } from './components/policy-detail/policy-detail-modal-claim-scooter-bike/policy-detail-modal-claim-scooter-bike.component';
import { PolicyDetailModalClaimTravelComponent } from './components/policy-detail/policy-detail-modal-claim-travel/policy-detail-modal-claim-travel.component';

import { PolicyDetailModalClaimComponent } from './components/policy-detail/policy-detail-modal-claim/policy-detail-modal-claim.component';

import { PolicyDetailModalSubmitMultiriskComponent } from './components/policy-detail/policy-detail-modal-submit-multirisk/policy-detail-modal-submit-multirisk.component';

import { PolicyDetailModalWithdrawalNewComponent } from './components/policy-detail/policy-detail-modal-withdrawal-new/policy-detail-modal-withdrawal-new.component';
import { PolicyDetailModalWithdrawalSuccessComponent } from './components/policy-detail/policy-detail-modal-withdrawal-success/policy-detail-modal-withdrawal-success.component';
import { PolicyDetailModalWithdrawalComponent } from './components/policy-detail/policy-detail-modal-withdrawal/policy-detail-modal-withdrawal.component';
import { PolicyDetailBasicTimMyHomeComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-basic-tim-my-home/policy-detail-basic-tim-my-home.component';
import { PolicyDetailBasicTimMySciComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-basic-tim-my-sci/policy-detail-basic-tim-my-sci.component';
import { PolicyDetailRecapAppliancesComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-appliances/policy-detail-recap-appliances.component';
import { PolicyDetailRecapBasicBaggageLossComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-baggage-loss/policy-detail-recap-basic-baggage-loss.component';
import { PolicyDetailRecapBasicBikeComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-bike/policy-detail-recap-basic-bike.component';
import { PolicyDetailRecapBasicCareComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-care/policy-detail-recap-basic-care.component';
import { PolicyDetailRecapBasicCovidComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-covid/policy-detail-recap-basic-covid.component';
import { PolicyDetailRecapBasicCyberComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-cyber/policy-detail-recap-basic-cyber.component';
import { PolicyDetailRecapBasicFreeTiresComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-free-tires/policy-detail-recap-basic-free-tires.component';
import { PolicyDetailRecapBasicGosafeComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-gosafe/policy-detail-recap-basic-gosafe.component';
import { PolicyDetailRecapBasicPaiComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-pai/policy-detail-recap-basic-pai.component';
import { PolicyDetailRecapBasicPetPaychecksChargeHistoryComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-pet-paychecks-charge-history/policy-detail-recap-basic-pet-paychecks-charge-history.component';
import { PolicyDetailRecapBasicPetWithPaymentRecoveryComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-pet-with-payment-recovery/policy-detail-recap-basic-pet-with-payment-recovery.component';
import { PolicyDetailRecapBasicPetComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-pet/policy-detail-recap-basic-pet.component';
import { PolicyDetailRecapBasicRcScooterBikeComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-rc-scooter-bike/policy-detail-recap-basic-rc-scooter-bike.component';
import { PolicyDetailRecapBasicRcaComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-rca/policy-detail-recap-basic-rca.component';
import { PolicyDetailRecapBasicSciComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-sci/policy-detail-recap-basic-sci.component';
import { PolicyDetailRecapBasicSerenetaComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-sereneta/policy-detail-recap-basic-sereneta.component';
import { PolicyDetailRecapBasicSmartphoneComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-smartphone/policy-detail-recap-basic-smartphone.component';
import { PolicyDetailRecapBasicTimMyPetComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-tim-my-pet/policy-detail-recap-basic-tim-my-pet.component';
import { PolicyDetailRecapBasicTutelaLegaleComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-basic-tutela-legale/policy-detail-recap-basic-tutela-legale.component';
import { PolicyDetailRecapDefaultComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-default/policy-detail-recap-default.component';
import { PolicyDetailRecapDevicesComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-devices/policy-detail-recap-devices.component';
import { PolicyDetailRecapBasicErgoSciComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-ergo-sci/policy-detail-recap-basic-ergo-sci.component';
import { PolicyDetailRecapInsuredSubjectsComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-insured-subjects/policy-detail-recap-insured-subjects.component';
import { PolicyDetailRecapLegalProtectionComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-legal-protection/policy-detail-recap-legal-protection/policy-detail-recap-legal-protection.component';
import { PolicyDetailRecapNetComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-net/policy-detail-recap-net.component';
import { PolicyDetailRecapPetComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-pet/policy-detail-recap-pet.component';
import { PolicyDetailRecapScreenProtectionComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-screen-protection/policy-detail-recap-screen-protection.component';
import { PolicyDetailRecapTravelComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recap-travel/policy-detail-recap-travel.component';
import { PolicyDetailRecapsCardAppliancesComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps-cards/policy-detail-recaps-card-appliances/policy-detail-recaps-card-appliances.component';
import { PolicyDetailRecapsCardDevicesComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps-cards/policy-detail-recaps-card-devices/policy-detail-recaps-card-devices.component';
import { PolicyDetailRecapsCardGeneralDataAltComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps-cards/policy-detail-recaps-card-general-data-alt/policy-detail-recaps-card-general-data-alt.component';
import { PolicyDetailRecapsCardGeneralDataDefaultComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps-cards/policy-detail-recaps-card-general-data-default/policy-detail-recaps-card-general-data-default.component';
import { PolicyDetailRecapsCardGeneralDataTravelComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps-cards/policy-detail-recaps-card-general-data-travel/policy-detail-recaps-card-general-data-travel.component';
import { PolicyDetailRecapsCardInsuredSubjectsComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps-cards/policy-detail-recaps-card-insured-subjects/policy-detail-recaps-card-insured-subjects.component';
import { PolicyDetailRecapsCardLegalProtectionComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps-cards/policy-detail-recaps-card-legal-protection/policy-detail-recaps-card-legal-protection/policy-detail-recaps-card-legal-protection.component';
import { PolicyDetailRecapsCardNetComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps-cards/policy-detail-recaps-card-net/policy-detail-recaps-card-net.component';
import { PolicyDetailRecapsCardPetsComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps-cards/policy-detail-recaps-card-pets/policy-detail-recaps-card-pets.component';
import { PolicyDetailRecapsComponent } from './components/policy-detail/policy-detail-recaps/policy-detail-recaps.component';
import { PolicyDetailComponent } from './components/policy-detail/policy-detail.component';
import { PolicyModalClaimReportComponent } from './components/policy-detail/policy-modal-claim-report/policy-modal-claim-report.component';
import { PolicyRedirectComponent } from './components/policy-detail/policy-redirect/policy-redirect.component';
import { PerAddonClaimOneBoxLayoutComponent } from './components/policy-detail/send-per-addon-claim/per-addon-claim-one-box-layout/per-addon-claim-one-box-layout.component';

import { SendPerAddonClaimComponent } from './components/policy-detail/send-per-addon-claim/send-per-addon-claim.component';
import { SendRequestModalComponent } from './components/policy-detail/send-request-modal/send-request-modal.component';
import { SunnyPolicyDetailModalClaimComponent } from './components/policy-detail/sunny-policy-detail-modal-claim/sunny-policy-detail-modal-claim.component';
import { PrivateAreaHomePageComponent } from './components/private-area-home-page/private-area-home-page';
import { PrivateAreaMyPoliciesComponent } from './components/private-area-my-policies/private-area-my-policies.component';
import { PrivateAreaMyQuotesComponent } from './components/private-area-my-quotes/private-area-my-quotes.component';
import { PrivateAreaUserDetailsComponent } from './components/private-area-user-details/private-area-user-details.component';
import { PrivateAreaSidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { DownloadExcelComponent } from './components/upload-download/download-excel/download-excel.component';
import { UploadDownloadComponent } from './components/upload-download/upload-download.component';
import { UploadExcelComponent } from './components/upload-download/upload-excel/upload-excel.component';
import { UserBusinessDetailsComponent } from './components/user-business-details/user-business-details.component';
import { UserDetailsNotEditableComponent } from './components/user-details-not-editable/user-details-not-editable.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

import { PrivateAreaRoutingModule } from './private-area-routing.module';
import { PrivateAreaComponent } from './private-area.component';

@NgModule({
    declarations: [
        MyPoliciesComponent,
        PolicyDetailComponent,
        PolicyDetailModalClaimComponent,
        PolicyConfirmModalClaimComponent,
        UserDetailsComponent,
        MyPoliciesDetailedComponent,
        MyClaimsComponent,
        MyDocumentsComponent,
        ClaimDetailComponent,
        PrivateAreaHomePageComponent,
        PrivateAreaSidebarMenuComponent,
        PrivateAreaComponent,
        PaymentMethodsComponent,
        PaymentMethodsModalConfirmDeleteComponent,
        PolicyDetailRecapsComponent,
        PolicyDetailRecapInsuredSubjectsComponent,
        PolicyDetailRecapDefaultComponent,
        PolicyDetailRecapAppliancesComponent,
        PolicyDetailRecapTravelComponent,
        PolicyDetailRecapPetComponent,
        PolicyDetailRecapBasicGosafeComponent,
        PolicyDetailRecapDevicesComponent,
        PolicyDetailModalCancelationComponent,
        PolicyDetailModalWithdrawalComponent,
        PolicyDetailModalCancelationSuccessComponent,
        PolicyDetailModalWithdrawalSuccessComponent,
        PolicyDetailRecapsCardInsuredSubjectsComponent,
        PolicyDetailRecapsCardDevicesComponent,
        PolicyDetailRecapsCardAppliancesComponent,
        PolicyDetailRecapsCardGeneralDataDefaultComponent,
        PolicyDetailRecapsCardGeneralDataAltComponent,
        PolicyDetailRecapsCardGeneralDataTravelComponent,
        PolicyDetailRecapsCardPetsComponent,

        PolicyDetailRecapLegalProtectionComponent,
        PolicyDetailRecapsCardLegalProtectionComponent,
        UserBusinessDetailsComponent,
        PrivateAreaUserDetailsComponent,
        PrivateAreaMyPoliciesComponent,
        PolicyDetailModalClaimPetFormComponent,
        SunnyPolicyDetailModalClaimComponent,
        PolicyDetailRecapNetComponent,
        PolicyDetailRecapsCardNetComponent,
        PolicyDetailRecapBasicPetComponent,
        PolicyDetailBasicPaymentComponent,
        PolicyRedirectComponent,
        UploadExcelComponent,
        DownloadExcelComponent,
        UploadDownloadComponent,
        PolicyDetailRecapBasicSerenetaComponent,
        PolicyDetailRecapBasicSmartphoneComponent,
        PolicyDetailRecapBasicPaiComponent,
        PolicyDetailRecapBasicFreeTiresComponent,
        PolicyDetailRecapBasicCareComponent,
        PolicyDetailRecapBasicBikeComponent,
        PolicyDetailRecapBasicSciComponent,
        MyClaimsPetComponent,
        PolicyDetailRecapBasicCovidComponent,

        PolicyDetailRecapBasicBaggageLossComponent,
        SendRequestModalComponent,
        PolicyConfirmModalRequestComponent,
        SendPerAddonClaimComponent,
        PerAddonClaimOneBoxLayoutComponent,

        UserDetailsNotEditableComponent,
        PolicyDetailRecapBasicRcaComponent,
        PolicyDetailListPaymentsComponent,
        PolicyDetailRecapBasicPetWithPaymentRecoveryComponent,
        PolicyDetailModalClaimAttachmentsComponent,
        PolicyDetailRecapBasicTutelaLegaleComponent,
        PolicyDetailRecapBasicPetPaychecksChargeHistoryComponent,
        PolicyDetailRecapBasicCyberComponent,
        MyQuotesComponent,
        PrivateAreaMyQuotesComponent,
        PolicyDetailModalWithdrawalNewComponent,
        PolicyDetailReplacementModalComponent,
        PolicyDetailBasicTimMyHomeComponent,
        PolicyDetailReplacementSuccessHomeAnimalsModalComponent,
        PolicyDetailReplacementSuccessNotInterestedModalComponent,
        PolicyDetailRecapBasicRcScooterBikeComponent,
        PolicyDetailModalClaimScooterBikeComponent,
        PolicyDetailRecapBasicErgoSciComponent,
        PolicyDetailModalClaimSciComponent,

        PolicyDetailModalClaimEsComponent,
        PolicyDetailBasicTimMySciComponent,

        PolicyDetailRecapBasicTimMyPetComponent,
        PolicyDetailModalClaimTravelComponent,
        PolicyDetailRecapScreenProtectionComponent,
        PolicyModalClaimReportComponent,
        PolicyDetailModalCancellationMultiriskComponent,
        PolicyDetailModalSubmitMultiriskComponent,

        ModalWithdrawalSuccessNetComponent,
        PolicyDetailModalClaimTimForSkiOthersModalityComponent,
    ],
    imports: [
        PrivateAreaRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        NgbModule,

        ComponentLoaderModule,
        //TimProtezioneCasaModule,
        //TimBillProtectionModule,
    ],
    providers: [
        AuthGuardPrivateArea,
        KenticoTranslatePipe,
        KenticoPipe
    ]
})
export class PrivateAreaModule {

}
