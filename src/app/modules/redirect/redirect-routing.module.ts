import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: 'mybroker', 
    loadChildren: () => import('./mybroker/redirect-mybroker-routing.module').then(m => m.MyBrokerRedirectRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedirectRoutingModule {
}
