import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { AuthGuardLogin } from '@services';
import { MainDefaultComponent } from 'app/components/public/main-default/main.default.component';
import { PreventivatoreRedirectComponent } from './preventivatore-redirect.component';

/* 
export function matcherRegex(url: UrlSegment[]) {
  const path = url.map(u => u.path).join('/');
  const match = new RegExp(/^(?:assicurazione|servizio)-([^/]+)(?:\/promo)?$/).exec(path);
  return match ? {
    consumed: url,
    posParams: {
      alias: new UrlSegment(match[1], {})
    }
  } : null;
}

const routes: Routes = [
  {
    path: 'preventivatore', component: MainDefaultComponent, children: [
      // for urls in preventivatore;code=PRODUCT_CODE
      {
        path: '', component: PreventivatoreLoaderComponent, canActivate: [AuthGuardLogin], children: [
          {path: 'promo', component: PreventivatoreLoaderComponent}
        ]
      },
      // for urls in preventivatore/code/PRODUCT_CODE
      {path: 'code/:code', component: PreventivatoreLoaderComponent, canActivate: [AuthGuardLogin]},
      // for urls in preventivatore/PRODUCT_ID
      {path: ':id', component: PreventivatoreLoaderComponent, canActivate: [AuthGuardLogin]},
    ]
  },
  {
    matcher: matcherRegex, component: MainDefaultComponent, children: [
      {
        path: '', component: PreventivatoreLoaderComponent, canActivate: [AuthGuardLogin], children: [
          {path: 'promo', component: PreventivatoreLoaderComponent}
        ]
      }
    ]
  },
  {
    path: 'product-landing', component: MainDefaultComponent, children: [
      {path: '', component: ProductLandingComponent}
    ]
  },
  // Activation Page - To remove on intesa pet module
  {path: 'policy-activated', component: ActivatedPolicyComponent}
]; 
*/

const routes: Routes = [
  {
    path: 'preventivatore', component: MainDefaultComponent, children: [
      // for urls in preventivatore;code=PRODUCT_CODE
      {
        path: '', component: PreventivatoreRedirectComponent, canActivate: [AuthGuardLogin]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreventivatoreRoutingModule {
}
