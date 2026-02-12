import { createNgModuleRef, Injectable, Injector, NgModule } from '@angular/core';
import { DataService } from './data.service';

const tenantModulesMap: { [tenantCode: string]: Promise<any> } = {
  'chebanca_db': import('../../modules/tenants/cb/cb.module').then(m => m.CbModule),
  'conte_pet_db': import('../../modules/tenants/ct/ct.module').then(m => m.CtModule),
  'conte_viaggi_db': import('../../modules/tenants/ct/ct.module').then(m => m.CtModule),
  'yolodb': import('../../modules/tenants/y/y.module').then(m => m.YModule),
  'intesa_db': import('../../modules/tenants/intesa/intesa.module').then(m => m.IntesaModule),
  'net-ins-it-it_db': import('../../modules/tenants/net-insurance/net-insurance.module').then(m => m.NetInsuranceModule),
  'yolo-crif_db': import('../../modules/tenants/crif/crif.module').then(m => m.CRIFModule),
  'bancapc-it-it_db': import('../../modules/tenants/cse/cse.module').then(m => m.CseModule),
  'intesa-pet_db': import('../../modules/tenants/intesa-pet/intesa-pet.module').then(m => m.IntesaPetModule),
  'mopar_db': import('../../modules/tenants/mopar/mopar.module').then(m => m.MoparModule),
  'tim-broker-employees_db': import('../../modules/tenants/tim/tim-employees.module').then(m => m.TimEmployeesModule),
  'tim-broker-customers_db': import('../../modules/tenants/tim/tim-customers.module').then(m => m.TimCustomersModule),
  'default_tenant': import('../../modules/tenants/default/tenant-default.module').then(m => m.TenantDefault),
  'fallback_tenant': import('../../modules/tenants/y/y.module').then(m => m.YModule),
};

export const TENANT_MODULES_ROUTES = [
  { path: 'config-cb', loadChildren: () => tenantModulesMap['chebanca_db'] },
  { path: 'config-ct-pet', loadChildren: () => tenantModulesMap['conte_pet_db'] },
  { path: 'config-ct-viaggi', loadChildren: () => tenantModulesMap['conte_viaggi_db'] },
  { path: 'config-y', loadChildren: () => tenantModulesMap['yolodb'] },
  { path: 'config-intesa', loadChildren: () => tenantModulesMap['intesa_db'] },
  { path: 'config-net-insurance', loadChildren: () => tenantModulesMap['net-ins-it-it_db'] },
  { path: 'config-pmi', loadChildren: () => tenantModulesMap['yolo-pmi_db'] },
  { path: 'config-crif', loadChildren: () => tenantModulesMap['yolo-crif_db'] },
  { path: 'config-mediaworld', loadChildren: () => tenantModulesMap['mediaworld-bs-it-it_db'] },
  { path: 'config-cse', loadChildren: () => tenantModulesMap['bancapc-it-it_db'] },
  { path: 'config-intesa-pet', loadChildren: () => tenantModulesMap['intesa-pet_db'] },
  { path: 'config-wind', loadChildren: () => tenantModulesMap['wind_db'] },
  { path: 'config-justeat', loadChildren: () => tenantModulesMap['justeat_db'] },
  { path: 'config-fca', loadChildren: () => tenantModulesMap['fca-bank_db'] },
  { path: 'config-leasys', loadChildren: () => tenantModulesMap['leasys_db'] },
  { path: 'config-mopar', loadChildren: () => tenantModulesMap['mopar_db'] },
  { path: 'config-ravenna', loadChildren: () => tenantModulesMap['ravenna_db'] },
  { path: 'config-imola', loadChildren: () => tenantModulesMap['imola_db'] },
  { path: 'config-lucca', loadChildren: () => tenantModulesMap['lucca_db'] },
  { path: 'config-civibank', loadChildren: () => tenantModulesMap['civibank_db'] },
  { path: 'config-tim-employees', loadChildren: () => tenantModulesMap['tim-broker-employees_db'] },
  { path: 'config-tim-customers', loadChildren: () => tenantModulesMap['tim-broker-customers_db'] },
  { path: 'config-imagin', loadChildren: () => tenantModulesMap['imagin-es-es_db'] },
  { path: 'config-helbiz', loadChildren: () => tenantModulesMap['helbiz_db'] },
  { path: 'config-default', loadChildren: () => tenantModulesMap['default_tenant'] },
  { path: 'config-fallback', loadChildren: () => tenantModulesMap['fallback_tenant'] },
  { path: 'config-illimity', loadChildren: () => tenantModulesMap['illimity_db'] },
  { path: 'config-genertel', loadChildren: () => tenantModulesMap['genertel_db'] },
  { path: 'config-banca-sella', loadChildren: () => tenantModulesMap['banca-sella_db'] },
  { path: 'config-banco-desio', loadChildren: () => tenantModulesMap['banco-desio_db'] },
  { path: 'config-santa-lucia', loadChildren: () => tenantModulesMap['santa-lucia_db'] }
];

@Injectable({ providedIn: 'root' })
export class TenantModuleLoadService {

  constructor(
    private injector: Injector,
    private dataService: DataService,
  ) {
  }

  async loadTenantModule(): Promise<NgModule> {
    const defaultTenant = tenantModulesMap['default_tenant'];
    if (!defaultTenant) {
      return;
    }

    const tenantModule = tenantModulesMap[this.dataService.tenantInfo.tenant] || tenantModulesMap['fallback_tenant'];
    if (!tenantModule) {
      return;
    }
    const moduleToLoad = await tenantModule;
    const defautlLoad = await defaultTenant;
    return this.doLoadModule(defautlLoad).then(() => this.doLoadModule(moduleToLoad));
  }

  private async doLoadModule(moduleToLoad): Promise<NgModule> {
    return new Promise((resolve, reject) => {
      resolve(createNgModuleRef(moduleToLoad, this.injector).instance),
        reject(err => console.error(err));
    });
  }

}
