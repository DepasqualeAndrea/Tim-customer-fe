import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuardLogin } from '@services';
import { ContattiContainerComponent } from './components/public/contatti/contatti-container.component';
import { CookiesComponent } from './components/public/cookies/cookies.component';
import { MainDefaultComponent } from './components/public/main-default/main.default.component';

import { NotFoundComponent } from './components/public/not-found/not-found.component';
import { PrivacyComponent } from './components/public/privacy/privacy.component';


import { SupportComponent } from './components/public/support/support.component';
import { TermsComponent } from './components/public/terms/terms.component';

import { ProductsContainerComponent } from './components/public/products-container/products-container.component';
import { BaseUrlGuard } from './core/services/base-url.guard';
import { TENANT_MODULES_ROUTES } from './core/services/tenant-module-load.service';
import { RoutingGuard } from './routing.guard';
import { RedirectComponent } from './shared/redirect/redirect.component';
import { ArticleDetailComponent } from './components/public/chi-siamo/article-detail/article-detail.component';
import { ComplaintsContainerComponent } from './components/public/complaints/complaints-container.component';
import { TimDistanceSellInformativeComponent } from './components/public/conditions/tim-distance-sell-informative/tim-distance-sell-informative.component';
import { ContinueCheckoutComponent } from './components/public/continue-checkout/continue-checkout.component';
import { SupportByProductComponent } from './components/public/support/support-by-product/support-by-product.component';
import { ReverseRoutingGuard } from './reverse-routing.guard';

const routes: Routes = [
  ...TENANT_MODULES_ROUTES,
  {
    path: '', component: MainDefaultComponent, canActivate: [BaseUrlGuard], children: [

      { path: 'cookies', component: CookiesComponent },
      { path: 'privacy', component: PrivacyComponent },


      { path: 'continue-checkout', component: ContinueCheckoutComponent },
      {
        path: '', canActivate: [AuthGuardLogin], children: [
          { path: 'nyp-checkout', loadChildren: () => import('./modules/nyp-checkout/nyp-checkout.module').then(m => m.NypCheckoutModule), canActivate: [RoutingGuard], data: { allowedTenants: ['tim-broker-customers_db'] }, },
          { path: 'nyp-private-area', loadChildren: () => import('./modules/nyp-checkout/modules/nyp-private-area/nyp-private-area.module').then(m => m.NypPrivateAreaModule), canActivate: [RoutingGuard], data: { allowedTenants: ['tim-broker-customers_db'] }, },



          { path: '', redirectTo: 'products', pathMatch: 'full' },

          /* This page was dismissed by TIM, we keep it because you never know...
            {path: 'main-page', component: MainPageComponent, canActivate: [RoutingGuard], data: {allowedTenants: ['tim-broker-customers_db']}},*/

          { path: 'assistenza', component: SupportComponent, canActivate: [ReverseRoutingGuard], data: { preventedTenants: ['tim-broker-customers_db'] } },
          { path: 'assistenza/:id', component: SupportByProductComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['tim-broker-employees_db'] } },
          { path: 'faq', component: SupportComponent },
          { path: 'help', component: SupportComponent },

          { path: 'notfound', component: NotFoundComponent },
          { path: 'termini-condizioni', component: TermsComponent },
          { path: 'informativa-vendita-distanza', component: TimDistanceSellInformativeComponent },
          { path: 'contatti', component: ContattiContainerComponent },
          { path: 'reclami', component: ComplaintsContainerComponent },


          { path: 'products', component: ProductsContainerComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['tim-broker-employees_db', 'tim-broker-customers_db'] } },
          { path: 'chi-siamo/:article', component: ArticleDetailComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['tim-broker-customers_db'] } },

          { path: 'redirect-page', component: RedirectComponent },

          { path: '**', redirectTo: '/notfound' }
        ]
      }
    ]
  }
];

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',

  errorHandler: e => console.error(e),
  enableTracing: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
  providers: [BaseUrlGuard],
})

export class RoutingModule {
}
