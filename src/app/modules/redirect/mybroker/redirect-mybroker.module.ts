import { NgModule } from "@angular/core";
import { MyBrokerRedirectComponent } from "app/components/public/internal-redirect/internal-redirect.component";
import { MyBrokerRedirectRoutingModule } from "./redirect-mybroker-routing.module";

@NgModule({
  declarations: [
    MyBrokerRedirectComponent
  ],
  imports: [
    MyBrokerRedirectRoutingModule
  ]
})
export class RedirectModule {}
