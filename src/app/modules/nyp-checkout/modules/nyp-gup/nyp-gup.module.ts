import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsAcceptanceComponent } from './components/documents-acceptance/documents-acceptance.component';
import { ModalWalletListGupComponent } from './components/modal-wallet-list-gup/modal-wallet-list-gup.component';
import { WalletListGupComponent } from './components/wallet-list-gup/wallet-list-gup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from "../../../../shared/shared.module";

@NgModule({
  declarations: [
    DocumentsAcceptanceComponent,
    ModalWalletListGupComponent,
    //PromoCodeComponent,
    WalletListGupComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
  ],
  exports: [
    DocumentsAcceptanceComponent,
    ModalWalletListGupComponent,
    //PromoCodeComponent,
    WalletListGupComponent,
  ],
})
export class NypGupModule { }
