import { Type } from '@angular/core';
import { PolicyDetailBasicTimBillProtectionComponent } from 'app/modules/nyp-checkout/modules/tim-bill-protection/components/policy-detail-basic-tim-bill-protection/policy-detail-basic-tim-bill-protection.component';
import { PolicyDetailBasicTimProtezioneCasaComponent } from 'app/modules/nyp-checkout/modules/tim-protezione-casa/components/policy-detail-basic-tim-protezione-casa/policy-detail-basic-tim-protezione-casa.component';
import { PolicyDetailBasicTimMyHomeComponent } from './policy-detail-basic-tim-my-home/policy-detail-basic-tim-my-home.component';
import { PolicyDetailBasicTimMySciComponent } from './policy-detail-basic-tim-my-sci/policy-detail-basic-tim-my-sci.component';
import { PolicyDetailRecapAppliancesComponent } from './policy-detail-recap-appliances/policy-detail-recap-appliances.component';
import { PolicyDetailRecapBasicBaggageLossComponent } from './policy-detail-recap-basic-baggage-loss/policy-detail-recap-basic-baggage-loss.component';
import { PolicyDetailRecapBasicBikeComponent } from './policy-detail-recap-basic-bike/policy-detail-recap-basic-bike.component';
import { PolicyDetailRecapBasicCareComponent } from './policy-detail-recap-basic-care/policy-detail-recap-basic-care.component';
import { PolicyDetailRecapBasicCovidComponent } from './policy-detail-recap-basic-covid/policy-detail-recap-basic-covid.component';
import { PolicyDetailRecapBasicCyberComponent } from './policy-detail-recap-basic-cyber/policy-detail-recap-basic-cyber.component';
import { PolicyDetailRecapBasicEhealthComponent } from './policy-detail-recap-basic-ehealth/policy-detail-recap-basic-ehealth.component';
import { PolicyDetailRecapBasicFreeTiresComponent } from './policy-detail-recap-basic-free-tires/policy-detail-recap-basic-free-tires.component';
import { PolicyDetailRecapBasicGosafeComponent } from './policy-detail-recap-basic-gosafe/policy-detail-recap-basic-gosafe.component';
import { PolicyDetailRecapBasicPaiComponent } from './policy-detail-recap-basic-pai/policy-detail-recap-basic-pai.component';
import { PolicyDetailRecapBasicPetPaychecksChargeHistoryComponent } from './policy-detail-recap-basic-pet-paychecks-charge-history/policy-detail-recap-basic-pet-paychecks-charge-history.component';
import { PolicyDetailRecapBasicPetWithPaymentRecoveryComponent } from './policy-detail-recap-basic-pet-with-payment-recovery/policy-detail-recap-basic-pet-with-payment-recovery.component';
import { PolicyDetailRecapBasicPetComponent } from './policy-detail-recap-basic-pet/policy-detail-recap-basic-pet.component';
import { PolicyDetailRecapBasicRcScooterBikeComponent } from './policy-detail-recap-basic-rc-scooter-bike/policy-detail-recap-basic-rc-scooter-bike.component';
import { PolicyDetailRecapBasicRcaComponent } from './policy-detail-recap-basic-rca/policy-detail-recap-basic-rca.component';
import { PolicyDetailRecapBasicSciComponent } from './policy-detail-recap-basic-sci/policy-detail-recap-basic-sci.component';
import { PolicyDetailRecapBasicSerenetaComponent } from './policy-detail-recap-basic-sereneta/policy-detail-recap-basic-sereneta.component';
import { PolicyDetailRecapBasicSmartphoneComponent } from './policy-detail-recap-basic-smartphone/policy-detail-recap-basic-smartphone.component';
import {
  PolicyDetailRecapBasicTimMyPetComponent
} from "./policy-detail-recap-basic-tim-my-pet/policy-detail-recap-basic-tim-my-pet.component";
import { PolicyDetailRecapBasicTravelComponent } from './policy-detail-recap-basic-travel/policy-detail-recap-basic-travel.component';
import { PolicyDetailRecapBasicTutelaLegaleComponent } from './policy-detail-recap-basic-tutela-legale/policy-detail-recap-basic-tutela-legale.component';
import { PolicyDetailRecapDefaultComponent } from './policy-detail-recap-default/policy-detail-recap-default.component';
import { PolicyDetailRecapDevicesComponent } from './policy-detail-recap-devices/policy-detail-recap-devices.component';
import { PolicyDetailRecapDynamicComponent } from './policy-detail-recap-dynamic.component';
import { PolicyDetailRecapBasicErgoSciComponent } from './policy-detail-recap-ergo-sci/policy-detail-recap-basic-ergo-sci.component';
import { PolicyDetailRecapInsuredSubjectsComponent } from './policy-detail-recap-insured-subjects/policy-detail-recap-insured-subjects.component';
import { PolicyDetailRecapLegalProtectionComponent } from './policy-detail-recap-legal-protection/policy-detail-recap-legal-protection/policy-detail-recap-legal-protection.component';
import { PolicyDetailRecapNetComponent } from './policy-detail-recap-net/policy-detail-recap-net.component';
import { PolicyDetailRecapPetComponent } from './policy-detail-recap-pet/policy-detail-recap-pet.component';
import { PolicyDetailRecapScreenProtectionComponent } from './policy-detail-recap-screen-protection/policy-detail-recap-screen-protection.component';
import { PolicyDetailRecapTravelComponent } from './policy-detail-recap-travel/policy-detail-recap-travel.component';


export const PolicyDetailRecapItems: { [key: string]: Type<PolicyDetailRecapDynamicComponent> } = {
  'default': PolicyDetailRecapDefaultComponent,
  'ea-bike-easy': PolicyDetailRecapInsuredSubjectsComponent,
  'ea-bike-top': PolicyDetailRecapInsuredSubjectsComponent,
  'axa-europ-travel': PolicyDetailRecapInsuredSubjectsComponent,
  'cc-appliances': PolicyDetailRecapAppliancesComponent,
  'cc-devices': PolicyDetailRecapDevicesComponent,
  'axa-flight': PolicyDetailRecapTravelComponent,
  'erv-mountain-gold': PolicyDetailRecapInsuredSubjectsComponent,
  'erv-mountain-silver': PolicyDetailRecapInsuredSubjectsComponent,
  'ba-dentist': PolicyDetailRecapInsuredSubjectsComponent,
  'chubb-work': PolicyDetailRecapInsuredSubjectsComponent,
  'chubb-mobility': PolicyDetailRecapInsuredSubjectsComponent,
  'sa-pet-silver': PolicyDetailRecapPetComponent,
  'sa-pet-gold': PolicyDetailRecapPetComponent,
  'esqui-gold': PolicyDetailRecapInsuredSubjectsComponent,
  'esqui-silver': PolicyDetailRecapInsuredSubjectsComponent,
  'das-legalprotection': PolicyDetailRecapLegalProtectionComponent,
  'trvlpcknet': PolicyDetailRecapNetComponent,
  'sprtpcknet': PolicyDetailRecapNetComponent,
};

export const PolicyDetailBasicRecapItems: { [key: string]: Type<PolicyDetailRecapDynamicComponent> } = {
  'default': PolicyDetailRecapDefaultComponent,
  'net-pet-gold': PolicyDetailRecapBasicPetComponent,
  'net-pet-silver': PolicyDetailRecapBasicPetComponent,
  'net-pet': PolicyDetailRecapBasicPetComponent,
  'yolo-for-pet': PolicyDetailRecapBasicPetComponent,
  'sara-sereneta': PolicyDetailRecapBasicSerenetaComponent,
  'chubb-devices': PolicyDetailRecapBasicSmartphoneComponent,
  'cc-devices': PolicyDetailRecapBasicSmartphoneComponent,
  'rbm-pandemic': PolicyDetailRecapBasicCareComponent,
  'ea-bike-top': PolicyDetailRecapBasicBikeComponent,
  'ea-bike-easy': PolicyDetailRecapBasicBikeComponent,
  'erv-mountain-gold': PolicyDetailRecapBasicSciComponent,
  'erv-mountain-silver': PolicyDetailRecapBasicSciComponent,
  'net-gosafe': PolicyDetailRecapBasicGosafeComponent,
  'pai-personal-accident': PolicyDetailRecapBasicPaiComponent,
  'pai-personal-accident-extra': PolicyDetailRecapBasicPaiComponent,
  'covea-tires-covered-homage': PolicyDetailRecapBasicFreeTiresComponent,
  'covea-tires-covered-standard': PolicyDetailRecapBasicFreeTiresComponent,
  'covea-tires-covered-plus': PolicyDetailRecapBasicFreeTiresComponent,
  'nobis-covid-homage': PolicyDetailRecapBasicCovidComponent,
  'nobis-covid-standard': PolicyDetailRecapBasicCovidComponent,
  'ehealth-quixa-homage': PolicyDetailRecapBasicEhealthComponent,
  'ehealth-quixa-standard': PolicyDetailRecapBasicEhealthComponent,
  'tim-my-home': PolicyDetailBasicTimMyHomeComponent,
  'tim-protezione-casa': PolicyDetailBasicTimProtezioneCasaComponent,
  'tim-bill-protection': PolicyDetailBasicTimBillProtectionComponent,
  'htrv-premium': PolicyDetailRecapBasicTravelComponent,
  'htrv-basic': PolicyDetailRecapBasicTravelComponent,
  'covea-baggage-loss': PolicyDetailRecapBasicBaggageLossComponent,
  'genertel-rca': PolicyDetailRecapBasicRcaComponent,
  'tim-my-pet': PolicyDetailRecapBasicPetPaychecksChargeHistoryComponent,
  'hpet-basic': PolicyDetailRecapBasicPetWithPaymentRecoveryComponent,
  'hpet-prestige': PolicyDetailRecapBasicPetWithPaymentRecoveryComponent,
  'hpet-vip': PolicyDetailRecapBasicPetWithPaymentRecoveryComponent,
  'das-legalprotection': PolicyDetailRecapBasicTutelaLegaleComponent,
  'net-cyber-gold': PolicyDetailRecapBasicCyberComponent,
  'net-cyber-platinum': PolicyDetailRecapBasicCyberComponent,
  'covea-baggage-loss-long-term': PolicyDetailRecapBasicBaggageLossComponent,
  'customers-tim-pet': PolicyDetailRecapBasicTimMyPetComponent,
  'rc-scooter-bike': PolicyDetailRecapBasicRcScooterBikeComponent,
  'ergo-mountain-silver': PolicyDetailRecapBasicErgoSciComponent,
  'ergo-mountain-gold': PolicyDetailRecapBasicErgoSciComponent,
  'tim-my-sci': PolicyDetailBasicTimMySciComponent,
  'screen-protection': PolicyDetailRecapScreenProtectionComponent
};
