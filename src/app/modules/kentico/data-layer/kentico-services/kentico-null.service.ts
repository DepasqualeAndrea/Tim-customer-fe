import {KenticoAbstractService} from '../kentico-abstract.service';
import {ContentItem, DeliveryClient} from 'kentico-cloud-delivery';
import {Observable, of} from 'rxjs';

export class KenticoNull extends KenticoAbstractService {

  constructor() {
    super(null, null, null, null, null);
  }

  protected initDeliveryClient(): DeliveryClient {
    return null;
  }


  listItems<T extends ContentItem>(contentTypeId: string): Observable<T[]> {
    return of(null);
  }

  filterItem<T extends ContentItem>(items: any, filterBy: string): T {
    return null;
  }

  getItem<T extends ContentItem>(contentItemId: string): Observable<T> {
    return of(null);
  }
}
