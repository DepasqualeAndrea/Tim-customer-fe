import {Type} from '@angular/core';
import {KenticoAbstractService} from './data-layer/kentico-abstract.service';

export class KenticoServiceMapItem {
  contentItemId: string;
  kenticoService: Type<KenticoAbstractService>;
  constructor(itemId: string, kenticoService: Type<KenticoAbstractService>) {
    this.contentItemId = itemId;
    this.kenticoService = kenticoService;
  }
}
