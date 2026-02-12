import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NypPrivateAreaListElementComponent } from './components/nyp-private-area-list-element/nyp-private-area-list-element.component';
import { NypPrivateAreaListComponent } from './components/nyp-private-area-list/nyp-private-area-list.component';
import { NypPrivateAreaMyPendingPoliciesListComponent } from './components/nyp-private-area-my-pending-policies-list/nyp-private-area-my-pending-policies-list.component';
import { NypPrivateAreaPolicyCustomerTimPetComponent } from './components/nyp-private-area-policy-customer-tim-pet/nyp-private-area-policy-customer-tim-pet.component';
import { NypPrivateAreaPolicyDetailComponent } from './components/nyp-private-area-policy-detail/nyp-private-area-policy-detail.component';
import { NypPrivateAreaPolicyEhealthQuixaStandardComponent } from './components/nyp-private-area-policy-ehealth-quixa-standard/nyp-private-area-policy-ehealth-quixa-standard.component';
import { NypPrivateAreaPolicyTimBillProtectionComponent } from './components/nyp-private-area-policy-tim-bill-protection/nyp-private-area-policy-tim-bill-protection.component';
import { NypPrivateAreaPolicyTimForSkiComponent } from './components/nyp-private-area-policy-tim-for-ski/nyp-private-area-policy-tim-for-ski.component';
import { NypPrivateAreaPolicyTimProtezioneCasaComponent } from './components/nyp-private-area-policy-tim-protezione-casa/nyp-private-area-policy-tim-protezione-casa.component';
import { NypPrivateAreaUserDetailComponent } from './components/nyp-private-area-user-detail/nyp-private-area-user-detail.component';
import { NypPolicyDetailModalCancelationSuccessComponent } from './modal/nyp-policy-detail-modal-cancelation-success/nyp-policy-detail-modal-cancelation-success.component';
import { NypPolicyDetailModalCancelationComponent } from './modal/nyp-policy-detail-modal-cancelation/nyp-policy-detail-modal-cancelation.component';
import { NypPolicyDetailModalWithdrawalComponent } from './modal/nyp-policy-detail-modal-withdrawal/nyp-policy-detail-modal-withdrawal.component';
import { AfterStripeUpdatePaymentGuard } from './services/after-stripe-update-payment.guard';
import { NypConfirmChangePaymentMethodComponent } from './modal/nyp-confirm-change-payment-method/nyp-confirm-change-payment-method.component';
import { NypPrivateAreaPolicyDetailPaymentComponent } from './components/nyp-private-area-policy-detail-payment/nyp-private-area-policy-detail-payment.component';
import { NypPrivateAreaPolicyTimProtezioneViaggiRoamingComponent } from './components/nyp-private-area-policy-tim-protezione-viaggi-roaming/nyp-private-area-policy-tim-protezione-viaggi-roaming.component';
import { NypPrivateAreaPolicyTimProtezioneViaggiBreveComponent } from './components/nyp-private-area-policy-tim-protezione-viaggi-breve/nyp-private-area-policy-tim-protezione-viaggi-breve.component';
import { NypPrivateAreaPolicyTimProtezioneViaggiAnnualeComponent } from './components/nyp-private-area-policy-tim-protezione-viaggi-annuale/nyp-private-area-policy-tim-protezione-viaggi-annualecomponent';
import { NypPrivateAreaPolicyTimSportComponent } from './components/nyp-private-area-policy-tim-sport/nyp-private-area-policy-tim-sport.component';
import { NypPrivateAreaPolicyTimBillProtectorComponent } from './components/nyp-private-area-policy-tim-bill-protector/nyp-private-area-policy-tim-bill-protector.component';
import { NypPrivateAreaPolicyNetCyberConsumerComponent } from './components/nyp-private-area-policy-net-cyber-consumer/nyp-private-area-policy-net-cyber-consumer.component';


@NgModule({
  declarations: [
    NypPrivateAreaListComponent,
    NypPrivateAreaListElementComponent,
    NypPrivateAreaPolicyCustomerTimPetComponent,
    NypPrivateAreaPolicyEhealthQuixaStandardComponent,
    NypPrivateAreaPolicyTimForSkiComponent,
    NypPrivateAreaPolicyTimBillProtectionComponent,
    NypPrivateAreaPolicyTimProtezioneCasaComponent,
    NypPrivateAreaPolicyTimProtezioneViaggiRoamingComponent,
    NypPrivateAreaPolicyTimProtezioneViaggiBreveComponent,
    NypPrivateAreaPolicyTimProtezioneViaggiAnnualeComponent,
    NypPrivateAreaPolicyTimSportComponent,
    NypPrivateAreaPolicyDetailComponent,
    NypPolicyDetailModalWithdrawalComponent,
    NypPolicyDetailModalCancelationComponent,
    NypPolicyDetailModalCancelationSuccessComponent,
    NypPrivateAreaMyPendingPoliciesListComponent,
    NypPrivateAreaUserDetailComponent,
    NypConfirmChangePaymentMethodComponent,
    NypPrivateAreaPolicyDetailPaymentComponent,
    NypPrivateAreaPolicyTimBillProtectorComponent,
    NypPrivateAreaPolicyNetCyberConsumerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '', children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: NypPrivateAreaListComponent },
        { path: 'detail', component: NypPrivateAreaPolicyDetailComponent },
        { path: 'payment_updated', canActivate: [AfterStripeUpdatePaymentGuard], children: [] }
      ]
    }]),
  ]
})
export class NypPrivateAreaModule { }
