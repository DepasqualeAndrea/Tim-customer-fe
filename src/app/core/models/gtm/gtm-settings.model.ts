import { GA4ModelTemplate, GTMModelDefaultTemplate } from './gtm-template.model';
export enum GTMTrigger {
  Routing = 1,
  Events = 2,
  Service = 3,
}

export enum EcommerceType {
  Default = 'UA',
  UniversalAnalytics = 'UA',
  GoogleAnalytics4 = 'GA4'
}

export class GTMSettings {
  public triggers: Map<GTMTrigger, boolean> = new Map<GTMTrigger, boolean>();
  public serviceUp: boolean = false;
  public businessTenant: boolean = false;
  public currentTenant: string = null;
  public requiredTenant: string = null;
  public routerUrlExceptions: RegExp[] = [];
  public exceptions: Map<GTMTrigger, RegExp[]> = new Map<GTMTrigger, RegExp[]>();
  public type: string = EcommerceType.Default;

  public checkTenant(): boolean {
    return !!this.currentTenant && !!this.requiredTenant && this.requiredTenant.toLowerCase().includes(this.currentTenant.toLowerCase());
  }


}

export const gtm_settings: GTMSettings = new GTMSettings();
