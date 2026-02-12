import {Injectable} from '@angular/core';
import {KenticoAbstractService} from './kentico-abstract.service';
import {ContentItem} from 'kentico-cloud-delivery';
import {Observable, of} from 'rxjs';
import {KenticoModule} from '../kentico.module';
import {KenticoConfigurator} from '../kentico-configurator.service';

@Injectable({
  providedIn: 'root'
})
export class KenticoProxyService extends KenticoAbstractService {

  constructor(
    protected kenticoTenantConfigurator: KenticoConfigurator
  ) {
    super(kenticoTenantConfigurator, null, null, null, null);
  }

  initDeliveryClient() {
    return null;
  }


  private getService(contentItemId: string): KenticoAbstractService {
    let service: KenticoAbstractService = this.kenticoTenantConfigurator.getServiceFor(contentItemId);
    if(!service) {
      service = this.kenticoTenantConfigurator.getDefaultService();
    }

    return service;
  }

  getItem<T extends ContentItem>(contentItemId: string): Observable<T> {
    try {
      return this.getService(contentItemId).getItem(contentItemId);
    } catch (e) {
      console.error(e);
      return of(null);
    }
  }

}

