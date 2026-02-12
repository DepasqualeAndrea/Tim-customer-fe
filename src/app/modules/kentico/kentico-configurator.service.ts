import {Injectable, Type} from '@angular/core';
import {KenticoAbstractService} from 'app/modules/kentico/data-layer/kentico-abstract.service';
import {KenticoItemStateRegister} from './data-layer/kentico-item-state-register.service';
import {KenticoItemState} from './data-layer/kentico-item-state.enum';
import {KenticoConfig} from './kentico-config.model';
import {KenticoServiceMapItem} from './kentico-service-map-item.model';
import {KenticoGenericService} from './data-layer/kentico-services/kentico-generic-service';
import {TypeResolver} from 'kentico-cloud-delivery';


@Injectable({providedIn: 'root'})
export class KenticoConfigurator {
  private static createRecordForKenticoTS(contentItemId: string, kenticoService: Type<KenticoAbstractService>): KenticoServiceMapItem {
    return new KenticoServiceMapItem(contentItemId, kenticoService);
  }

  private configuration: KenticoConfig = new KenticoConfig();

  constructor(
    private itemRegister: KenticoItemStateRegister
  ) {
  }

  private getMajorContentItem(contentId: string): string {
    let indexOfDot: number = contentId.indexOf('.');
    if (indexOfDot < 0) {
      indexOfDot = contentId.length;
    }
    return contentId.substring(0, indexOfDot);
  }

  private createKenticoServiceTo(apikey: string, resolvers?: TypeResolver[], previewApiKey?: string, usePreviewMode?: boolean): void {
    if(!apikey || this.configuration.genericApiServiceMap.has(apikey))
      return;
    this.configuration.genericApiServiceMap.set(apikey, new KenticoGenericService(this, apikey, resolvers, previewApiKey, usePreviewMode));
  }

  private linkCodenameToApi(codename: string, apikey: string): void {
    this.configuration.genericApiMap.set(codename, apikey);
    if (this.itemRegister.getState(codename) !== KenticoItemState.Cached) {
      this.itemRegister.setState(codename, KenticoItemState.ToBeRequested);
    }
  }

  register(codename: string, apikey: string, resolvers?: TypeResolver[], previewApiKey?: string, usePreviewMode?: boolean): void {
    const majorCodename: string = this.getMajorContentItem(codename);
    this.createKenticoServiceTo(apikey, resolvers, previewApiKey, usePreviewMode);
    this.linkCodenameToApi(majorCodename, apikey);
  }

  getServiceFor(contentItemId: string): KenticoAbstractService {
    const apikey: string = this.configuration.genericApiMap.get(contentItemId);
    if(!apikey) {
      return null;
    }

    const service: KenticoAbstractService = this.configuration.genericApiServiceMap.get(apikey);
    if(!service) {
      return null;
    }

    return service;
  }

  getDefaultService(): KenticoAbstractService {
    return this.configuration.defaultService;
  }
  setDefaultService(apikey: string): void {
    if(this.configuration.genericApiServiceMap.has(apikey)) {
      this.configuration.defaultService = this.configuration.genericApiServiceMap.get(apikey);
    }
  }

  setLanguage(lang: string) {
    this.configuration.language = lang;
  }
  getLanguage(): string {
    return this.configuration.language;
  }

  getAllContentItemCodenames(): string[] {
    return Array.from(this.configuration.genericApiMap.keys());
  }

  getMaxConnections(): number {
    return this.configuration.maxConnections;
  }
  setMaxConnections(connectionLimit: number) {
    this.configuration.maxConnections = Math.max(0, connectionLimit);
  }
}
