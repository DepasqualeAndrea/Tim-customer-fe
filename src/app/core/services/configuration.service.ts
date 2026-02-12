import { NypUserService } from '@NYP/ngx-multitenant-core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { KenticoConfigurator } from '../../modules/kentico/kentico-configurator.service';
import { DataService } from './data.service';
import { GtmInitDataLayerService } from './gtm/gtm-init-datalayer.service';
import { LocaleService } from './locale.service';
import { TenantModuleLoadService } from './tenant-module-load.service';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { REMOVE_TOKEN } from '../models/token-interceptor.model';
import { NypStripeModule } from 'app/modules/nyp-checkout/modules/nyp-stripe/nyp-stripe.module';
import jwtDecode from "jwt-decode";
import { TokenService } from './token.service';

@Injectable()
export class ConfigurationService {

  private featuresSubject: BehaviorSubject<any>;

  constructor(
    protected http: HttpClient,
    private dataService: DataService,
    private tenantModuleLoadService: TenantModuleLoadService,
    private gtmDataLayerService: GtmInitDataLayerService,
    private localeService: LocaleService,
    private kenticoTenantConfigurator: KenticoConfigurator,
    private nypUserService: NypUserService,
    private tokenService: TokenService
  ) {
  }

  setupApp(): Promise<any> {
    return this.tokenService.ensureValidToken()
      .then(() => this.nypUserService.getTenantInfo().toPromise())
      .then((info) => {
        delete info.data.kenticoApiKey;
        this.dataService.setTenantInfo(info.data);
        NypStripeModule.STRIPE_PUBLISHABLE_KEY = info?.data?.payments_providers_configurations[0]?.stripe.publishable_key;
        this.localeService.setupLocale();
        this.localeService.getMainLocale();
        this.kenticoTenantConfigurator.setLanguage(this.localeService.locale);
        return this.tenantModuleLoadService.loadTenantModule();
      })
      .catch((error) => {
        if (error.status === 401) {
          this.tokenService.removeTokens();
          location.reload();
        }
        throw error;
      });
  }
}
