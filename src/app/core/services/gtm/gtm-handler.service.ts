import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AuthStatus} from '../auth-status.interface';
import {gtm_settings, GTMTrigger} from 'app/core/models/gtm/gtm-settings.model';
import {GtmService} from './gtm.service';
import {AuthService} from '@services';
import { GtmModelHandler } from './gtm-model-handler.interface';
import {GtmPageInfoStrategy} from './gtm-page-info-strategy.interface';

@Injectable({
  providedIn: 'root',
  deps: [GtmService]
})
export class GtmHandlerService {
  private navigationEnd_callback: (e: NavigationEnd, gtmService: GtmService, auth: AuthStatus) => void;
  private infoPageFiller: GtmPageInfoStrategy;

  constructor(
    private router: Router,
    private gtmService: GtmService,
    private authService: AuthService
  ) {
    // set default fn function that calls setPageInfo function
    this.setNavigationEndCallbackFn(this.setPageInfoIntoDataLayer);
    this.handleNavigationEnd();
    gtm_settings.serviceUp = true;
  }

  public setCurrentTenant(tenant: string, business: boolean = false) {
    gtm_settings.currentTenant = tenant;
    gtm_settings.businessTenant = business;
  }

  public requireTenant(tenant: string) {
    gtm_settings.requiredTenant = tenant;
  }

  public setEcommerceType(type: string) {
    gtm_settings.type = type;
  }

  public checkTenant(): boolean {
    return gtm_settings.checkTenant();
  }

  /**
   * Enable one or more options to activate gtm
   * @param options GTMTrigger options list
   * @see GTMTrigger
   */
  public enableFor(...options: GTMTrigger[]) {
    options.forEach(option => {
      gtm_settings.triggers.set(option, true);
    });
  }

  /**
   * Disable one or more enabled options to activate gtm
   * @param option GTMTrigger options list
   * @see GTMTrigger
   */
  public disableFor(...options: GTMTrigger[]) {
    options.forEach(option => {
      gtm_settings.triggers.set(option, false);
    });
  }

  /**
   * return true if specified gtm trigger is enabled
   * @param option is the GTMTrigger
   * @see GTMTrigger
   */
  public isEnabledFor(option: GTMTrigger): boolean {
    return gtm_settings.triggers.has(option) && gtm_settings.triggers.get(option);
  }

  /**
   * Get the object that can access to the model to push
   */
  public getModelHandler(): GtmModelHandler {
    return this.gtmService;
  }

  /**
   * although a trigger is enabled, there can be one or more urls that are exceptions
   * for that trigger and, in these cases, pushing will be disabled.
   * This method allows to define exceptions
   * @param trigger
   * @param regexp
   */
  public addException(trigger: GTMTrigger, regexp: RegExp) {
    if (!gtm_settings.exceptions.has(trigger)) {
      gtm_settings.exceptions.set(trigger, []);
    }

    const triggerExceptions: RegExp[] = gtm_settings.exceptions.get(trigger);
    triggerExceptions.push(regexp);
  }

  public setPageInfoStrategy(strategy: GtmPageInfoStrategy) {
    this.infoPageFiller = strategy;
  }
  /**
   * Set the object model with default values: pageName, deviceType and loggedIn info.
   */
  public setPageInfoIntoDataLayer() {
    if (!!this.infoPageFiller) {
      this.infoPageFiller.fill();
    }
  }

  /**
   * Push currentSateModel on DataLayer object if pushing by service is enabled
   * @param reset if true (default), after pushing the model is reset
   */
  public push(reset: boolean = true) {
    const servicePushEnabled: boolean = gtm_settings.triggers.get(GTMTrigger.Service) || false;
    if (servicePushEnabled && !this.isException(GTMTrigger.Service) && this.checkTenant()) {
      this.gtmService.push(reset);
    }
  }

  /**
   * Handle multiple items to push, resets currentStateModel after each push to avoid pushing unwanted properties
   * @param events - spreadArray of events to be pushed
   */
  multiPush(...items) {
    this.requireTenant(gtm_settings.currentTenant); // force activation
    items.forEach(e => {
      this.getModelHandler().overwrite(e);
      this.push(true);
    });
  }

  /**
   * Set a function that will be called on navigationEnd event.
   * By default, if not specified, it will be called gtmPageInfoFn defined in gtm-settings.
   * @param fn
   * @see gtm_settings.model
   */
  public setNavigationEndCallbackFn(fn: (e: NavigationEnd, gtmService: GtmService, auth: AuthStatus) => void) {
    this.navigationEnd_callback = fn;
  }

  private getCurrentRouteUrl(): string {
    const url: string = this.router.url;
    const slashIndex: number = url.indexOf('/');
    return url.substring(slashIndex + 1);
  }

  public isException(trigger: GTMTrigger): boolean {
    const url: string = this.getCurrentRouteUrl();
    let exception = false;
    const exceptionExpressions: RegExp[] = gtm_settings.exceptions.get(trigger) || [];
    exceptionExpressions.forEach(expr => exception = exception || expr.test(url));
    return exception;
  }

  private handleNavigationEnd() {
    // Handles multiple instance of this service
    if (!gtm_settings.serviceUp) {
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd && !!this.navigationEnd_callback) {
          const navEndEvent: NavigationEnd = <NavigationEnd>e;
          if (this.isEnabledFor(GTMTrigger.Routing) && !this.isException(GTMTrigger.Routing)) {
            this.requireTenant(gtm_settings.currentTenant);     // force activation
            this.navigationEnd_callback.apply(this, [navEndEvent, this.gtmService, this.authService]);
            this.gtmService.push();
          }
        }
      });
    }
  }
}
