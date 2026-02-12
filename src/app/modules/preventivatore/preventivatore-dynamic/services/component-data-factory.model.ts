import { PreventivatoreAbstractComponent } from '../components/preventivatore-abstract/preventivatore-abstract.component';
import { ComponentFactory } from '@angular/core';

export interface ComponentDataFactory {
   componentFactory: ComponentFactory<PreventivatoreAbstractComponent>;
   data: any;
}