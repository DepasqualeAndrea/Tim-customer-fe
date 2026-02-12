import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyBrokerRedirectComponent } from "app/components/public/internal-redirect/mybroker/mybroker-redirect.component";

const routes: Routes = [
  {path: '', component: MyBrokerRedirectComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyBrokerRedirectRoutingModule {
}
