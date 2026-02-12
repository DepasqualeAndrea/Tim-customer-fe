import {KenticoTranslateService} from './data-layer/kentico-translate.service';
import {KenticoConfigurator} from './kentico-configurator.service';
import {KenticoItemConverter} from './data-layer/converters/items/kentico-item.converter';
import {KenticoProxyService} from './data-layer/kentico.proxy.service';
import {KenticoItemStateRegister} from './data-layer/kentico-item-state-register.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {ContentItem, Elements} from 'kentico-cloud-delivery';
import {Injectable} from '@angular/core';
import {KenticoModule} from './kentico.module';
import {KenticoTcpConnectionService} from './data-layer/kentico-tcp-connection.service';

@Injectable({
  providedIn: 'root'
})
export class KenticoPipeTranslateService extends KenticoTranslateService {
  constructor(
    protected kenticoTenantConfigurator: KenticoConfigurator,
    protected converter: KenticoItemConverter,
    protected kenticoProxy: KenticoProxyService,
    protected stateRegister: KenticoItemStateRegister,
    protected cache: TranslateService,
    protected kenticoTcpConnectionService: KenticoTcpConnectionService
  ) {
    super(kenticoTenantConfigurator, converter, kenticoProxy, stateRegister, cache, kenticoTcpConnectionService);
  }



  getItem<T>(contentItemId: string): Observable<T> {
    return super.getItem<T>(contentItemId).pipe(
      catchError((err) => {
        console.error(err);
        return of(null)
      }),
      switchMap((value: T) => {
        // value is a contentItem
        if(!!(value as any).value) {
          return of((value as any).value);
        }
        //value is already a string (legacy behavior with it.json)
        if(typeof value === 'string') {
          return of(value);
        }

        return of("");
      })
    );
  }
}
