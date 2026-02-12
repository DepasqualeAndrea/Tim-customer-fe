import {Injectable} from '@angular/core';
import {KenticoItemStateRegister} from './kentico-item-state-register.service';
import {Observable, of, zip} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {switchMap} from 'rxjs/operators';
import {KenticoProxyService} from './kentico.proxy.service';
import {KenticoItemState} from './kentico-item-state.enum';
import {LinkedItemsConverter} from './converters/elements/LinkedItems.converter';
import {RichTextElementConverter} from './converters/elements/RichTextElement.converter';
import {KenticoConfigurator} from '../kentico-configurator.service';
import {KenticoItemConverter} from './converters/items/kentico-item.converter';
import {AssetConverter} from './converters/elements/asset.converter';
import {KenticoTcpConnectionService} from './kentico-tcp-connection.service';

@Injectable({
  providedIn: 'root'
})
export class KenticoTranslateService {

  constructor(
    protected kenticoTenantConfigurator: KenticoConfigurator,
    protected converter: KenticoItemConverter,
    protected kenticoProxy: KenticoProxyService,
    protected stateRegister: KenticoItemStateRegister,
    protected cache: TranslateService,
    protected kenticoTcpConnectionService: KenticoTcpConnectionService
    )
  {
    this.converter.setConverter('modular_content', new LinkedItemsConverter(this.converter));
    this.converter.setConverter('rich_text', new RichTextElementConverter());
    this.converter.setConverter('asset', new AssetConverter());
  }


  private getMajorAndMinor(contentItemId: string): string[] {
    let indexOfDot: number = contentItemId.indexOf('.');
    let dotExisting: boolean = true;
    if(indexOfDot < 0) {
      indexOfDot = contentItemId.length;
      dotExisting = false;
    }
    const majorId: string = contentItemId.substring(0, indexOfDot);
    let minorId = '';
    if(dotExisting) {
      minorId = contentItemId.substring(indexOfDot + 1);
    }

    return [majorId, minorId];
  }

  /**
   * get an item or and element from cache. returns null if no item or element has been found
   * @param contentItemId is a string representing ad item id (e.g.: 'checkout') or an element (e.g.: 'checkout.mandatory_fields')
   * @param obj is the source from which and item or element is searched
   */
  private getAvailable(contentItemId: string, obj?: object): object {
    const target: object = obj || this.cache.store.translations[this.cache.currentLang];
    const subs: string [] = this.getMajorAndMinor(contentItemId);
    const majorId = subs[0];
    const minorId = subs[1];
    const isMinorEmpty: boolean = minorId.length === 0;
    let result: object = null;

    Object.entries(target).forEach(entry => {
      const name = entry[0];
      const value = entry[1];
      if(name === majorId) {
        if(isMinorEmpty) {
          result = value;
        } else if (typeof value !== 'object') {
          result = null;
        } else {
          result = this.getAvailable(minorId, value);
        }
      }
    });

    return result;
  }

  /**
   * gets an item or an element value from cache and returns an observable
   * @param contentId
   */
  private getFromCache(contentId: string): Observable<any> {
    const availableObj: object = this.getAvailable(contentId);
    if(!availableObj) {
      return of("");
    }

    return of(availableObj);
  }


  /**
   * Call kentico services and save the result into cache, then return the item.
   * This method starts a connection as soon as possible: when too many connections are opened, a new connection will be in wainting state so it's not immediately resolved.
   * When an already opened connection resolves (=closes) then a waiting connection, if any, will start (=opens)
   * @param contentId
   */
  private updateAndGet(contentId: string): Observable<any> {
    const majorItem: string = this.getMajorAndMinor(contentId)[0];
    const lang: string = this.cache.currentLang;
    this.stateRegister.setState(majorItem, KenticoItemState.Requested);

    const kenticoCall: Observable<any> = this.kenticoProxy.getItem(majorItem)
      .pipe(
        switchMap(item => {
          const convertedItem: object = this.converter.convertItem(item);

          this.cache.setTranslation(lang, {[majorItem]: convertedItem},true);
          this.stateRegister.setState(majorItem, KenticoItemState.Cached);
          return this.getFromCache(contentId);
        })
      );

    // send request to KenticoTcpConnection Manager:
    //    - if connection opens then call kentico (executes kenticoCall)
    //    - otherwise return a waiting connection observable that will re-request once another connection closes
    return this.kenticoTcpConnectionService.request(kenticoCall);

  }

  /**
   * When an item has been requested but kentico didn't reply yet, this item is not contained into cache.
   * Instead of calling kentico again, it observes the state of this item: when cached gets and returns it from cache
   * @param itemname
   */
  private getFromCacheWhenGot(itemname: string): Observable<any> {
    const majorItem: string = this.getMajorAndMinor(itemname)[0];
    return this.stateRegister.getObservableState(majorItem).pipe(switchMap(() => this.getFromCache(itemname)));
  }

  /**
   * Get an item or a element (e.g.: 'checkout', 'checkout.mandatory_fields').
   * By current item state (not cached, not cached or requested) get it from cache, from kentico services
   * or wait until items gets available from cache (a getItem on this element has already been requested but not available yet)   *
   * @param contentItemId (e.g.: 'checkout', 'checkout.mandatory_fields').
   */
  getItem<T>(contentItemId: string): Observable<T> {
    if (this.stateRegister.getState(contentItemId) === KenticoItemState.ToBeRequested) {
      return this.updateAndGet(contentItemId);
    } else if (this.stateRegister.getState(contentItemId) === KenticoItemState.Cached) {
      return this.getFromCache(contentItemId);
    } else if (this.stateRegister.getState(contentItemId) === KenticoItemState.Requested) {
      return this.getFromCacheWhenGot(contentItemId);
    }
  }

  /**
   * read the state of all registered content item and for each one call getItem on it. This will update all items that are not cached
   */
  resolveAll(): void {
    const obsItems: Observable<any>[] = [];
    this.kenticoTenantConfigurator.getAllContentItemCodenames().forEach(item => obsItems.push(this.getItem(item)));
    zip(...obsItems).subscribe();
  }


}
