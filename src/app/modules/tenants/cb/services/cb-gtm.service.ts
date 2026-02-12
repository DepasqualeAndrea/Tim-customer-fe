import {ErrorHandler, Injectable} from '@angular/core';
import {GtmHandlerService} from '../../../../core/services/gtm/gtm-handler.service';
import {GTMTrigger} from '../../../../core/models/gtm/gtm-settings.model';
import {GtmService} from '../../../../core/services/gtm/gtm.service';
import {GtmPageInfoStrategy} from '../../../../core/services/gtm/gtm-page-info-strategy.interface';
import {Router} from '@angular/router';
import {AuthService} from '@services';
import {ErrorsHandler} from '../../../../core/errors-handler/errors-handler';
import {CbErrors} from './cb-errors.model';
import {CbHumanGtmErrorStrategy} from './cb-human-gtm-error-strategy.service';
import {ErrorCodes} from '../../../../shared/errors/error-codes.model';
import {CbSystemGenericGtmErrorStrategy} from './cb-system-generic-gtm-error-strategy.service';

class PageView {
  event: string = 'virtualPageview';
  virtualUrl: string;
  virtualTitle: string;
  userID: number;
  segment: string = '';
}
class MappedPage {
  url: string;
  title: string;

  constructor(url: string, title: string) {
    this.url = url;
    this.title = title;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CbGtmService implements GtmPageInfoStrategy {
  private urlMap: Map<string, MappedPage> = new Map<string, MappedPage>();

  constructor(
    private gtmHandler: GtmHandlerService,
    private router: Router,
    private gtmService: GtmService,
    private authService: AuthService,
    private errorHandler: ErrorHandler
  ) {

  }

  private addPageInfo(url: string, service: GtmService, userId?: number) {
    const page: PageView = new PageView();
    if(!this.urlMap.has(url)) {
      return;
    }
    const virtualPage: MappedPage = this.urlMap.get(url);
    page.virtualUrl = virtualPage.url;
    page.virtualTitle = virtualPage.title;
    page.userID = !!userId ? userId : NaN;
    page.segment = 'To understand how to fill';

    service.add(page);
  }
  private initUrls() {
    this.urlMap.set('/preventivatore/5-6', new MappedPage('/sport', 'Protezione CheBanca! - Sport'));
    this.urlMap.set('/preventivatore/4-7', new MappedPage('/bike', 'Protezione CheBanca! - Bike'));
    this.urlMap.set('/preventivatore/1', new MappedPage('/motor', 'Protezione CheBanca! - Motor'));
    this.urlMap.set('/preventivatore/2-3', new MappedPage('/viaggi', 'Protezione CheBanca! - Viaggi'));
    this.urlMap.set('/preventivatore/8', new MappedPage('/casa', 'Protezione CheBanca! - Casa'));
    this.urlMap.set('/assistenza', new MappedPage('/assistenza', 'Protezione CheBanca! - Assistenza'));
    this.urlMap.set('/apertura/insurance-info', new MappedPage('/wizard/step1', 'Protezione CheBanca! - Wizard step 1'));
    this.urlMap.set('/apertura/address', new MappedPage('/wizard/step2', 'Protezione CheBanca! - Wizard step 2'));
    this.urlMap.set('/apertura/survey', new MappedPage('/wizard/step3', 'Protezione CheBanca! - Wizard step 3'));
    this.urlMap.set('/apertura/payment', new MappedPage('/wizard/step4', 'Protezione CheBanca! - Wizard step 4'));
    this.urlMap.set('/apertura/confirm', new MappedPage('/wizard/step5', 'Protezione CheBanca! - Wizard step 5'));
    this.urlMap.set('/apertura/complete', new MappedPage('/wizard/step6', 'Protezione CheBanca! - Wizard step 6'));
    this.urlMap.set('/private-area/user-details', new MappedPage('/profilo-cliente', 'Protezione CheBanca! - Profilo Cliente'));


  }

  fill(): void {
    this.addPageInfo(this.router.url, this.gtmService, this.authService.loggedUser.id);
  }

  public setupGtm() {
    this.gtmHandler.setCurrentTenant("chebanca");
    this.initUrls();
    this.gtmHandler.setPageInfoStrategy(this);

    this.gtmHandler.addException(GTMTrigger.Routing, /preventivatore\/9-10/);
    this.gtmHandler.addException(GTMTrigger.Routing, /preventivatore\/11-12/);
    this.gtmHandler.addException(GTMTrigger.Routing, /preventivatore\/13-14/);
    this.gtmHandler.addException(GTMTrigger.Routing, /landing-page/);
    this.gtmHandler.addException(GTMTrigger.Routing, /prodotti/);

    (new CbErrors()).initErrorCodes();
    (this.errorHandler as ErrorsHandler).addCustomStrategy(ErrorCodes.HUMAN_FORM, new CbHumanGtmErrorStrategy(this.gtmHandler));
    (this.errorHandler as ErrorsHandler).addCustomStrategy(ErrorCodes.HUMAN_GENERIC, new CbHumanGtmErrorStrategy(this.gtmHandler));
    (this.errorHandler as ErrorsHandler).addCustomStrategy(ErrorCodes.SYSTEM_GENERIC, new CbSystemGenericGtmErrorStrategy(this.gtmHandler));
  }
}
