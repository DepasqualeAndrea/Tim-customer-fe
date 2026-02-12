import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {ComponentFactory} from '@angular/core';

export interface PreventivatoreComponentProvider {

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[];

}
