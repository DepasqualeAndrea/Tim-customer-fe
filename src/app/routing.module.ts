import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuardLogin } from '@services';
import { AdministrationComponent } from './components/public/administration/administration.component';
import { BanksAndInsurancesComponent } from './components/public/b2b/banks-and-insurances/banks-and-insurances.component';
import { BigCompaniesComponent } from './components/public/b2b/big-companies/big-companies.component';
import { DataManagementPlatformComponent } from './components/public/b2b/data-management-platform/data-management-platform.component';
import { DataPlatformComponent } from './components/public/b2b/data-platform/data-platform.component';
import { ClarityComponent } from './components/public/clarity/clarity.component';
import { ContattiContainerComponent } from './components/public/contatti/contatti-container.component';
import { CookiesComponent } from './components/public/cookies/cookies.component';
import { HomeContainerComponent } from './components/public/homepage/home-container/home-container.component';
import { InvestitoriComponent } from './components/public/investors/investors.component';
import { MainDefaultComponent } from './components/public/main-default/main.default.component';
import { ArticleComponent } from './components/public/news/article/article.component';
import { NewsComponent } from './components/public/news/news.component';
import { NotFoundComponent } from './components/public/not-found/not-found.component';
import { OverviewComponent } from './components/public/overview/overview.component';
import { PrivacyComponent } from './components/public/privacy/privacy.component';
import { ProductsComponent } from './components/public/products/products.component';
import { PressReviewComponent } from './components/public/rassegna-stampa/press-review.component';
import { SupportComponent } from './components/public/support/support.component';
import { TermsComponent } from './components/public/terms/terms.component';
import { ChiSiamoPageComponent } from './components/public/theteam/chi-siamo-page.component';
import { VariantSelectComponent } from './components/public/variant-select/variant-select.component';
import { WhyEnsureComponent } from './components/public/why-ensure/why-ensure.component';
import { BaseUrlGuard } from './core/services/base-url.guard';
import { TENANT_MODULES_ROUTES } from './core/services/tenant-module-load.service';
import { RoutingGuard } from './routing.guard';
import { RedirectComponent } from './shared/redirect/redirect.component';
// import {PrivatiComponent} from './components/public/migration/privati/privati.component';
import { ArticleDetailComponent } from './components/public/chi-siamo/article-detail/article-detail.component';
import { ComplaintsContainerComponent } from './components/public/complaints/complaints-container.component';
import { TimDistanceSellInformativeComponent } from './components/public/conditions/tim-distance-sell-informative/tim-distance-sell-informative.component';
import { ContinueCheckoutComponent } from './components/public/continue-checkout/continue-checkout.component';
import { GovernanceComponent } from './components/public/governance/governance.component';
import { InvestorGovernanceComponent } from './components/public/investor-governance/investor-governance.component';
import { ProductsContainerComponent } from './components/public/products-container/products-container.component';
import { ProductsStandardContainerComponent } from './components/public/products-standard-container/products-standard-container.component';
import { SupportByProductComponent } from './components/public/support/support-by-product/support-by-product.component';
import { ReverseRoutingGuard } from './reverse-routing.guard';

const routes: Routes = [
  ...TENANT_MODULES_ROUTES,
  {
    path: '', component: MainDefaultComponent, canActivate: [BaseUrlGuard], children: [
      { path: 'cb', loadChildren: () => import('./modules/tenants/cb/cb-routing.module').then(m => m.CbRoutingModule) },
      { path: 'cookies', component: CookiesComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'trasparenza', component: ClarityComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['chebanca_db', 'ravenna_db', 'imola_db', 'lucca_db'] } },
      { path: 'vetrina', component: ProductsComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['bancapc-it-it_db', 'leasys_db', 'mopar-db', 'civibank_db', 'helbiz_db', 'banco-desio_db'] } },
      { path: 'continue-checkout', component: ContinueCheckoutComponent },
      {
        path: '', canActivate: [AuthGuardLogin], children: [
          { path: 'nyp-checkout', loadChildren: () => import('./modules/nyp-checkout/nyp-checkout.module').then(m => m.NypCheckoutModule), canActivate: [RoutingGuard], data: { allowedTenants: ['tim-broker-customers_db'] }, },
          { path: 'nyp-private-area', loadChildren: () => import('./modules/nyp-checkout/modules/nyp-private-area/nyp-private-area.module').then(m => m.NypPrivateAreaModule), canActivate: [RoutingGuard], data: { allowedTenants: ['tim-broker-customers_db'] }, },

          { path: 'redirect', loadChildren: () => import('./modules/redirect/redirect.module').then(m => m.RedirectModule) },

          { path: '', component: ProductsComponent },
          { path: 'home', component: HomeContainerComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'yolo-pmi_db', 'net-ins-it-it_db', 'intesa_db', 'leasys_db'] } },
          { path: 'homepage', component: ProductsComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'yolo-pmi_db'] } },
          { path: 'prodotti', component: ProductsComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'chebanca_db', 'bancapc-it-it_db', 'fca-bank_db', 'ravenna_db', 'imola_db', 'lucca_db', 'civibank_db', 'helbiz_db', 'imagin-es-es_db', 'banco-desio_db'] } },
          // {path: 'privati', component: PrivatiComponent, canActivate: [RoutingGuard], data: {allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'chebanca_db', 'bancapc-it-it_db', 'fca-bank_db', 'leasys_db', 'mopar_db', 'ravenna_db', 'imola_db', 'civibank_db', 'helbiz_db', 'banco-desio_db']}},
          { path: 'products', component: ProductsContainerComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['mopar_db', 'fca-bank_db', 'tim-broker-employees_db', 'leasys_db'] } },
          { path: 'products-std', component: ProductsStandardContainerComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['mopar_db'] } },
          /* This page was dismissed by TIM, we keep it because you never know...
            {path: 'main-page', component: MainPageComponent, canActivate: [RoutingGuard], data: {allowedTenants: ['tim-broker-customers_db']}},*/
          { path: 'news', component: NewsComponent },
          { path: 'assistenza', component: SupportComponent, canActivate: [ReverseRoutingGuard], data: { preventedTenants: ['tim-broker-customers_db'] } },
          { path: 'assistenza/:id', component: SupportByProductComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['tim-broker-employees_db'] } },
          { path: 'faq', component: SupportComponent },
          { path: 'help', component: SupportComponent },
          { path: 'scelta-variante', component: VariantSelectComponent },
          { path: 'why-ensure', component: WhyEnsureComponent },
          { path: 'notfound', component: NotFoundComponent },
          { path: 'termini-condizioni', component: TermsComponent },
          { path: 'informativa-vendita-distanza', component: TimDistanceSellInformativeComponent },
          { path: 'contatti', component: ContattiContainerComponent },
          { path: 'reclami', component: ComplaintsContainerComponent },
          { path: 'article', component: ArticleComponent },
          { path: 'articles', component: PressReviewComponent },
          { path: 'investitori', component: InvestitoriComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'intesa_db', 'yolo-pmi_db', 'pandemic-retail_db'] } },
          { path: 'intermediaries', component: IntermediariesYoloComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'intesa_db', 'yolo-pmi_db', 'pandemic-retail_db'] } },
          { path: 'governance', component: GovernanceComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-en-gb_db'] } },
          { path: 'investor', component: InvestorGovernanceComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-en-gb_db'] } },
          { path: 'chi-siamo', component: ChiSiamoPageComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'intesa_db', 'yolo-pmi_db', 'justeat_db', 'wind_db', 'intesa-pet_db', 'mediaworld-bs-it-it_db', 'net-ins-it-it_db', 'pandemic-retail_db', 'mopar_db', 'tim-broker-employees_db'] } },
          { path: 'chi-siamo/:article', component: ArticleDetailComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['tim-broker-customers_db'] } },
          { path: 'piattaforma-assicurativa-on-demand', component: OverviewComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'yolo-pmi_db', 'pandemic-retail_db'] } },
          { path: 'piattaforma-assicurativa-on-demand/banche-assicurazioni', component: BanksAndInsurancesComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'yolo-pmi_db', 'pandemic-retail_db'] } },
          { path: 'piattaforma-assicurativa-on-demand/white-label-and-end-to-end', component: DataPlatformComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'yolo-pmi_db', 'pandemic-retail_db'] } },
          { path: 'piattaforma-assicurativa-on-demand/data-management-platform', component: DataManagementPlatformComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'yolo-pmi_db', 'pandemic-retail_db'] } },
          { path: 'piattaforma-assicurativa-on-demand/grandi-imprese', component: BigCompaniesComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'yolo-pmi_db', 'pandemic-retail_db'] } },
          { path: 'consiglio-amministrazione', component: AdministrationComponent, canActivate: [RoutingGuard], data: { allowedTenants: ['yolodb', 'yolo-es-es_db', 'yolo-en-gb_db', 'yolo-crif_db', 'intesa_db', 'yolo-pmi_db', 'pandemic-retail_db'] } },
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
