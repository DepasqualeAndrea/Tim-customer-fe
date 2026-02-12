import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxBraintreeService } from './ngx-braintree.service';
import { ConfigureDropinService } from './configure-dropin.service';

import { NgxBraintreeComponent } from './ngx-braintree.component';
import { NgxBraintreeDirective } from './ngx-braintree.directive';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot()
  ],
  declarations: [NgxBraintreeComponent, NgxBraintreeDirective],
  exports: [
    NgxBraintreeComponent,
    NgxBraintreeDirective
  ],
  providers: [
    { provide: NgxBraintreeService, useClass: NgxBraintreeService },
    { provide: ConfigureDropinService, useClass: ConfigureDropinService }
  ]
})
export class NgxBraintreeModule { }
