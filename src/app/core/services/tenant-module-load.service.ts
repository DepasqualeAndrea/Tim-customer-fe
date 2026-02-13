import { createNgModuleRef, Injectable, Injector, NgModule } from '@angular/core';
import { DataService } from './data.service';

const tenantModulesMap: { [tenantCode: string]: Promise<any> } = {

  'tim-broker-customers_db': import('../../modules/tenants/tim/tim-customers.module').then(m => m.TimCustomersModule)
};

export const TENANT_MODULES_ROUTES = [

  { path: 'config-tim-customers', loadChildren: () => tenantModulesMap['tim-broker-customers_db'] }
];

@Injectable({ providedIn: 'root' })
export class TenantModuleLoadService {

  constructor(
    private injector: Injector,
    private dataService: DataService,
  ) {
  }

  async loadTenantModule(): Promise<NgModule> {
    const tenantModule = tenantModulesMap[this.dataService.tenantInfo.tenant];

    if (!tenantModule) {
      console.warn(`Tenant module for ${this.dataService.tenantInfo.tenant} not found.`);
      return;
    }

    const moduleToLoad = await tenantModule;
    return this.doLoadModule(moduleToLoad);
  }

  private async doLoadModule(moduleToLoad): Promise<NgModule> {
    return new Promise((resolve, reject) => {
      try {
        resolve(createNgModuleRef(moduleToLoad, this.injector).instance);
      } catch (e) {
        console.error('Error loading module', e);
        reject(e);
      }
    });
  }

}
