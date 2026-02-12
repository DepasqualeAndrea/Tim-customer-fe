import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NypMainComponent } from './pages/nyp-main/nyp-main.component';
import { CheckoutDeactivateGuard } from './services/checkout-deactivate-guard.service';
import { ConfirmBackModalComponent } from './services/confirm-back-modal.component';
import { SharedModule } from 'app/shared/shared.module';
import { SellerCodeResolver } from './modules/nyp-stripe/components/seller-code/configuration/seller-code.resolver';

export const NYP_KENTICO_NAME: string = 'nyp_products_data';
export const NYP_KENTICO_SLUG: string = 'nyp_product_data';

export const TIM_PROTEZIONE_CASA_PRODUCT_NAME: string = 'tim-protezione-casa';
export const TIM_PROTEZIONE_CASA_KENTICO_NAME: string = 'tim_protezione_casa';
export const TIM_PROTEZIONE_CASA_KENTICO_SLUG: string = 'tim_protezione_casa';

export const TIM_BILL_PROTECTION_PRODUCT_NAME: string = 'tim-bill-protection';
export const TIM_BILL_PROTECTION_KENTICO_NAME: string = 'tim_bill_protection';
export const TIM_BILL_PROTECTION_KENTICO_SLUG: string = 'tim_bill_protection';

export const TIM_BILL_PROTECTION_2_PRODUCT_NAME: string = 'tim-bill-protection-II';
export const TIM_BILL_PROTECTION_2_KENTICO_NAME: string = 'tim_bill_protection';
export const TIM_BILL_PROTECTION_2_KENTICO_SLUG: string = 'tim_bill_protection';

export const TIM_BILL_PROTECTOR_PRODUCT_NAME: string = 'tim-bill-protector';
export const TIM_BILL_PROTECTOR_KENTICO_NAME: string = 'tim_bill_protector';
export const TIM_BILL_PROTECTOR_KENTICO_SLUG: string = 'tim_bill_protector';

export const TIM_MY_PET_PRODUCT_NAME: string = 'customers-tim-pet';
export const TIM_MY_PET_KENTICO_NAME: string = 'customers_tim_pet';
export const TIM_MY_PET_KENTICO_SLUG: string = 'customers_tim_pet';

export const TIM_FOR_SKI_MODULE_NAME: string = 'tim-for-ski';
export const TIM_FOR_SKI_SILVER_PRODUCT_NAME: string = 'tim-for-ski-silver';
export const TIM_FOR_SKI_GOLD_PRODUCT_NAME: string = 'tim-for-ski-gold';
export const TIM_FOR_SKI_PLATINUM_PRODUCT_NAME: string = 'tim-for-ski-platinum';
export const TIM_FOR_SKI_KENTICO_NAME: string = 'tim_for_ski';
export const TIM_FOR_SKI_KENTICO_SLUG: string = 'tim_for_ski';

export const TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME: string = 'ehealth-quixa-standard';
export const TIM_EHEALTH_QUIXA_STANDARD_KENTICO_NAME: string = 'tim_ehealth_quixa_standard';
export const TIM_EHEALTH_QUIXA_STANDARD_KENTICO_SLUG: string = 'tim_ehealth_quixa_standard';


export const TIM_PROTEZIONE_VIAGGI_MODULE_NAME = '!!!!!!RIMUOVIMI, DEVE ESSERE VERTICALE!!!!!!';
export const TIM_PROTEZIONE_VIAGGI_PRODUCT_NAME = '!!!!!!RIMUOVIMI, DEVE ESSERE VERTICALE!!!!!!';
export const TIM_PROTEZIONE_VIAGGI_ROAMING_MODULE_NAME: string = 'tim-protezione-viaggi-roaming';
export const TIM_PROTEZIONE_VIAGGI_ROAMING_PRODUCT_NAME: string = 'tim-protezione-viaggi-roaming';
export const TIM_PROTEZIONE_VIAGGI_BREVE_MODULE_NAME: string = 'tim-protezione-viaggi-breve';
export const TIM_PROTEZIONE_VIAGGI_EUROPE_BREVE_PRODUCT_NAME: string = 'tim-protezione-viaggi-europe';
export const TIM_PROTEZIONE_VIAGGI_WORLD_BREVE_PRODUCT_NAME: string = 'tim-protezione-viaggi-world';
export const TIM_PROTEZIONE_VIAGGI_ANNUALE_MODULE_NAME: string = 'tim-protezione-viaggi-annuale';
export const TIM_PROTEZIONE_VIAGGI_EUROPE_Y_ANNUALE_PRODUCT_NAME: string = 'tim-protezione-viaggi-europe-y';
export const TIM_PROTEZIONE_VIAGGI_WORLD_Y_ANNUALE_PRODUCT_NAME: string = 'tim-protezione-viaggi-world-y';
export const TIM_PROTEZIONE_VIAGGI_KENTICO_NAME: string = 'tim_protezione_viaggi';
export const TIM_PROTEZIONE_VIAGGI_KENTICO_SLUG: string = 'tim_protezione_viaggi';
export const MODALE_BROSWER_BACK: string = 'modale_broswer_back';

export const TIM_SPORT_PRODUCT_NAME: string = 'tim-sport';
export const TIM_SPORT_KENTICO_NAME: string = 'tim_sport';
export const TIM_SPORT_KENTICO_SLUG: string = 'tim_sport';

export const TIM_NAT_CAT_PRODUCT_NAME: string = 'tim-nat-cat';
export const TIM_NAT_CAT_KENTICO_SLUG: string = 'tim-nat-cat';
export const TIM_NAT_CAT_KENTICO_NAME: string = 'tim-nat-cat';

export const NET_CYBER_BUSINESS_PRODUCT_NAME: string = 'net-cyber-business';
export const NET_CYBER_BUSINESS_KENTICO_SLUG: string = 'net-cyber-business';
export const NET_CYBER_BUSINESS_KENTICO_NAME: string = 'net-cyber-business';

export const SELLER_CODE_KENTICO_SLUG: string = 'seller_code';
export const SELLER_CODE_KENTICO_NAME: string = 'seller_code';

export const TIM_CYBER_CONSUMER_PRODUCT_NAME: string = 'net-cyber-consumer';
export const TIM_CYBER_CONSUMER_KENTICO_SLUG: string = 'checkout_cyber_consumer';
export const TIM_CYBER_CONSUMER_KENTICO_NAME: string = 'checkout_cyber_consumer';



const routes: Routes = [
  {
    path: '', component: NypMainComponent,
    canDeactivate: [CheckoutDeactivateGuard],
    resolve: { input: SellerCodeResolver },
    children: [
      { path: TIM_PROTEZIONE_CASA_PRODUCT_NAME, loadChildren: () => import('./modules/tim-protezione-casa/tim-protezione-casa.module').then(m => m.TimProtezioneCasaModule) },
      { path: TIM_BILL_PROTECTION_PRODUCT_NAME, loadChildren: () => import('./modules/tim-bill-protection/tim-bill-protection.module').then(m => m.TimBillProtectionModule) },
      { path: TIM_BILL_PROTECTION_2_PRODUCT_NAME, loadChildren: () => import('./modules/tim-bill-protection-2/tim-bill-protection.module').then(m => m.TimBillProtectionModule) },
      { path: TIM_BILL_PROTECTOR_PRODUCT_NAME, loadChildren: () => import('./modules/tim-bill-protector/tim-bill-protector.module').then(m => m.TimBillProtectorModule) },

      { path: TIM_MY_PET_PRODUCT_NAME, loadChildren: () => import('./modules/tim-my-pet/tim-my-pet.module').then(m => m.TimMyPetModule) },
      { path: TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME, loadChildren: () => import('./modules/tim-ehealth-quixa-standard/tim-ehealth-quixa-standard.module').then(m => m.TimEhealthQuixaStandardModule) },

      { path: TIM_FOR_SKI_SILVER_PRODUCT_NAME, redirectTo: TIM_FOR_SKI_MODULE_NAME },
      { path: TIM_FOR_SKI_GOLD_PRODUCT_NAME, redirectTo: TIM_FOR_SKI_MODULE_NAME },
      { path: TIM_FOR_SKI_PLATINUM_PRODUCT_NAME, redirectTo: TIM_FOR_SKI_MODULE_NAME },
      { path: TIM_FOR_SKI_MODULE_NAME, loadChildren: () => import('./modules/tim-for-ski/tim-for-ski.module').then(m => m.TimForSkiModule) },

      { path: TIM_PROTEZIONE_VIAGGI_ROAMING_PRODUCT_NAME, redirectTo: TIM_PROTEZIONE_VIAGGI_ROAMING_MODULE_NAME },
      { path: TIM_PROTEZIONE_VIAGGI_ROAMING_MODULE_NAME, loadChildren: () => import('./modules/tim-protezione-viaggi/modules/tim-protezione-viaggi-roaming/tim-protezione-viaggi-roaming.module').then(m => m.TimProtezioneViaggiRoamingModule) },
      { path: TIM_PROTEZIONE_VIAGGI_EUROPE_BREVE_PRODUCT_NAME, redirectTo: TIM_PROTEZIONE_VIAGGI_BREVE_MODULE_NAME },
      { path: TIM_PROTEZIONE_VIAGGI_WORLD_BREVE_PRODUCT_NAME, redirectTo: TIM_PROTEZIONE_VIAGGI_BREVE_MODULE_NAME },
      { path: TIM_PROTEZIONE_VIAGGI_BREVE_MODULE_NAME, loadChildren: () => import('./modules/tim-protezione-viaggi/modules/tim-protezione-viaggi-breve/tim-protezione-viaggi-breve.module').then(m => m.TimProtezioneViaggiBreveModule) },
      { path: TIM_PROTEZIONE_VIAGGI_EUROPE_Y_ANNUALE_PRODUCT_NAME, redirectTo: TIM_PROTEZIONE_VIAGGI_ANNUALE_MODULE_NAME },
      { path: TIM_PROTEZIONE_VIAGGI_WORLD_Y_ANNUALE_PRODUCT_NAME, redirectTo: TIM_PROTEZIONE_VIAGGI_ANNUALE_MODULE_NAME },
      { path: TIM_PROTEZIONE_VIAGGI_ANNUALE_MODULE_NAME, loadChildren: () => import('./modules/tim-protezione-viaggi/modules/tim-protezione-viaggi-annuale/tim-protezione-viaggi-annuale.module').then(m => m.TimProtezioneViaggiAnnualeModule) },

      { path: TIM_SPORT_PRODUCT_NAME, loadChildren: () => import('./modules/tim-sport/tim-sport.module').then(m => m.TimSportModule) },

      { path: TIM_NAT_CAT_PRODUCT_NAME, loadChildren: () => import('./modules/tim-nat-cat/tim-nat-cat.module').then(m => m.TimNatCatModule) },

      { path: NET_CYBER_BUSINESS_PRODUCT_NAME, loadChildren: () => import('./modules/net-cyber-business/tim-cyber-protection.module').then(m => m.NetCyberBusinessModule) },

      { path: TIM_CYBER_CONSUMER_PRODUCT_NAME, loadChildren: () => import('./modules/net-cyber-consumer/tim-cyber-consumer.module').then(m => m.TimCyberConsumerModule) }
    ]
  },
];

export const NYP_ENABLED_PRODUCTS = [
  TIM_PROTEZIONE_CASA_PRODUCT_NAME,
  TIM_BILL_PROTECTION_PRODUCT_NAME,
  TIM_BILL_PROTECTION_2_PRODUCT_NAME,
  TIM_BILL_PROTECTOR_PRODUCT_NAME,

  TIM_MY_PET_PRODUCT_NAME,
  TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME,

  TIM_FOR_SKI_SILVER_PRODUCT_NAME,
  TIM_FOR_SKI_GOLD_PRODUCT_NAME,
  TIM_FOR_SKI_PLATINUM_PRODUCT_NAME,

  TIM_PROTEZIONE_VIAGGI_ROAMING_MODULE_NAME,
  TIM_PROTEZIONE_VIAGGI_ROAMING_PRODUCT_NAME,
  TIM_PROTEZIONE_VIAGGI_BREVE_MODULE_NAME,
  TIM_PROTEZIONE_VIAGGI_EUROPE_BREVE_PRODUCT_NAME,
  TIM_PROTEZIONE_VIAGGI_WORLD_BREVE_PRODUCT_NAME,
  TIM_PROTEZIONE_VIAGGI_ANNUALE_MODULE_NAME,
  TIM_PROTEZIONE_VIAGGI_EUROPE_Y_ANNUALE_PRODUCT_NAME,
  TIM_PROTEZIONE_VIAGGI_WORLD_Y_ANNUALE_PRODUCT_NAME,

  TIM_SPORT_PRODUCT_NAME,
  TIM_SPORT_KENTICO_NAME,
  TIM_SPORT_KENTICO_SLUG,

  TIM_NAT_CAT_PRODUCT_NAME,

  NET_CYBER_BUSINESS_PRODUCT_NAME,
  
  SELLER_CODE_KENTICO_NAME,

  TIM_CYBER_CONSUMER_PRODUCT_NAME
];

@NgModule({
  declarations: [
    NypMainComponent,
    ConfirmBackModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [
    CheckoutDeactivateGuard,
    SellerCodeResolver
  ],
  exports: [
  ],
})
export class NypCheckoutModule { }
