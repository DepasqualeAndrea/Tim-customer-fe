
import { ComponentFactory } from '@angular/core';
import { PreventivatoreDiscountCodeAbstractComponent } from '../components/preventivatore-abstract/preventivatore-discount-code-abstract.component';

export interface ComponentDataFactory {
   componentFactory: ComponentFactory<PreventivatoreDiscountCodeAbstractComponent>;
   data: any;
}