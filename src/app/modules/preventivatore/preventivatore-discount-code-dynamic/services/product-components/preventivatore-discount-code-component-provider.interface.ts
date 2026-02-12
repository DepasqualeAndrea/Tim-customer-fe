import {ComponentFactory} from '@angular/core';
import { PreventivatoreDiscountCodeAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-discount-code-abstract.component';

export interface PreventivatoreDiscountCodeComponentProvider {

  getBgImgHeroDCComponent(): ComponentFactory<PreventivatoreDiscountCodeAbstractComponent>;

  getHowWorksComponent(): ComponentFactory<PreventivatoreDiscountCodeAbstractComponent>;

  getWhatToKnowComponent(): ComponentFactory<PreventivatoreDiscountCodeAbstractComponent>;

}
