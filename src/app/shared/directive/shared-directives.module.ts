import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatterDirective } from './directives/phone-formatter.directive';
import { GenderDirective } from './directives/gender.directive';

@NgModule({
  declarations: [
    PhoneFormatterDirective,
    GenderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PhoneFormatterDirective,
    GenderDirective
  ]
})
export class SharedDirectivesModule { }
