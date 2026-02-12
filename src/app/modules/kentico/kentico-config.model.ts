import {KenticoAbstractService} from './data-layer/kentico-abstract.service';
import {KenticoNull} from './data-layer/kentico-services/kentico-null.service';
import {KenticoApikeyMapItem} from './kentico-apikey-map-item.model';
import {KenticoApiServiceMapItem} from './kentico-api-service-map-item.model';

export class KenticoConfig {
  language: string = 'it_IT';
  defaultService: KenticoAbstractService = new KenticoNull();
  genericApiMap: KenticoApikeyMapItem = KenticoApikeyMapItem.create<string, string>();                                  // maps content item to kentico api key
  genericApiServiceMap: KenticoApiServiceMapItem = KenticoApiServiceMapItem.create<string, KenticoAbstractService>();   // maps api key to a concrete service
  maxConnections: number = 2;
}
