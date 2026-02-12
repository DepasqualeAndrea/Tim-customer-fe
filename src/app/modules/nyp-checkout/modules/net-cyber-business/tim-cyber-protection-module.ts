import { NgModule } from "@angular/core";
import { NetCyberBusinessCheckoutService } from "./services/checkout.service";
import { NetCyberBusinessCheckoutResolver } from "./services/checkout.resolver";


@NgModule({
  providers: [
    NetCyberBusinessCheckoutService,
    NetCyberBusinessCheckoutResolver
  ]
})
export class NetCyberServiceModule {}
