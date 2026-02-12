import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecommendedProductsComponent } from 'app/components/public/products/recommended-products/recommended-products.component';
import { AuthGuardPrivateArea } from 'app/core/services/auth-guard-private-area.service';
import { NypPrivateAreaMyPendingPoliciesListComponent } from '../nyp-checkout/modules/nyp-private-area/components/nyp-private-area-my-pending-policies-list/nyp-private-area-my-pending-policies-list.component';
import { NypPrivateAreaUserDetailComponent } from '../nyp-checkout/modules/nyp-private-area/components/nyp-private-area-user-detail/nyp-private-area-user-detail.component';
import { NypPrivateAreaResolver } from '../nyp-checkout/modules/nyp-private-area/services/nyp-private-area.resolver';
import { ClaimDetailComponent } from './components/claim-detail/claim-detail.component';
import { ClaimDetailResolver } from './components/claim-detail/claim-detail.resolver';
import { MyClaimsComponent } from './components/my-claims/my-claims.component';
import { MyDocumentsComponent } from './components/my-documents/my-documents.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { PolicyDetailComponent } from './components/policy-detail/policy-detail.component';
import { PolicyDetailResolver } from './components/policy-detail/policy-detail.resolver';
import { PrivateAreaHomePageComponent } from './components/private-area-home-page/private-area-home-page';
import { PrivateAreaMyQuotesComponent } from './components/private-area-my-quotes/private-area-my-quotes.component';
import { PrivateAreaComponent } from './private-area.component';

const routes: Routes = [
  {
    path: 'private-area',
    component: PrivateAreaComponent,
    canActivate: [AuthGuardPrivateArea],
    resolve: [NypPrivateAreaResolver],
    children: [
      {
        path: 'home',
        children: [
          { path: '', component: PrivateAreaHomePageComponent },
          { path: '', component: RecommendedProductsComponent, outlet: 'recommended' },
        ]
      },
      { path: 'my-policies', /* component: PrivateAreaMyPoliciesComponent */ loadChildren: () => import('app/modules/nyp-checkout/modules/nyp-private-area/nyp-private-area.module').then(m => m.NypPrivateAreaModule) },
      { path: 'user-details', component: NypPrivateAreaUserDetailComponent },
      { path: 'my-pending-policies', component: NypPrivateAreaMyPendingPoliciesListComponent },
      { path: 'user-details', component: NypPrivateAreaUserDetailComponent },
      { path: 'my-claims', component: MyClaimsComponent },
      { path: 'payment-methods', component: PaymentMethodsComponent },
      { path: 'my-documents', component: MyDocumentsComponent },
      { path: 'my-quotes', component: PrivateAreaMyQuotesComponent },
      { path: 'policy/:id', component: PolicyDetailComponent, resolve: { policy: PolicyDetailResolver }, runGuardsAndResolvers: 'always' },
      { path: 'claim/:id', component: ClaimDetailComponent, resolve: { claim: ClaimDetailResolver } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PolicyDetailResolver, ClaimDetailResolver]
})
export class PrivateAreaRoutingModule {

}
