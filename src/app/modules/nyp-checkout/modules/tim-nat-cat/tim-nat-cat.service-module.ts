import { NgModule } from "@angular/core";
import { TimNatCatCheckoutResolver } from "./services/checkout.resolver";
import { TimNatCatCheckoutService } from "./services/checkout.service";

@NgModule({
  providers: [
    TimNatCatCheckoutService,
    TimNatCatCheckoutResolver
  ]
})
export class TimNatCatServiceModule {}
