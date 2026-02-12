import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "app/shared/shared.module";
import { SecurityModule } from "app/modules/security/security.module";
import { SellerCodeServiceModule } from "./seller-code.service-module";
import { NypStripeModule } from "../../../nyp-stripe.module";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([]),
    SecurityModule,
    NgbModule,
    SellerCodeServiceModule,
    NypStripeModule,
  ],
  exports: [],
  providers: [],
})
export class SellerCodeModule {}
