import { GenericComponentProviderService } from './generic-component-provider.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreComponentsProviderService {
  constructor(
    private genericComponentProviderService: GenericComponentProviderService,
    @Inject(Injector) private injector: Injector
  ) { }

  private productComponentsProviderMap: Map<string, any> = new Map<string, any>();

  setProvider(productCodes: string[], componentsLayoutProvider: any) {
    productCodes.map(pc => this.productComponentsProviderMap.set(pc, componentsLayoutProvider));
  }

  getProvider(productCodes: string[]): PreventivatoreComponentProvider {
    const componentProvider = this.productComponentsProviderMap.get(productCodes[0]) || this.productComponentsProviderMap.get(productCodes[1]);
    if (!!componentProvider) {
      return this.injector.get(componentProvider);
    }
    if (this.isIntesaPet(productCodes)) { // ? REMOVE (for piacenza and fca other than intesa)
      return this.genericComponentProviderService;
    }
    if (this.isBpcSereneta(productCodes)) {
      return this.genericComponentProviderService;
    }
    if (this.isBpcSmartphone(productCodes)) {
      return this.genericComponentProviderService;
    }
    if (this.isPaiAccident(productCodes)) {
      return this.genericComponentProviderService;
    }
    if (this.isBike(productCodes)) {
      return this.genericComponentProviderService;
    }
    if (this.isCovidStandard(productCodes)) {
      return this.genericComponentProviderService;
    }
    if (this.isTiresStandardPlus(productCodes)) {
      return this.genericComponentProviderService;
    }
  }

  private isIntesaPet(productCodes: string[]) {
    const containsPetSilver = productCodes.some(x => x === 'net-pet-silver');
    const containsPetGold = productCodes.some(x => x === 'net-pet-gold');
    return containsPetSilver || containsPetGold;
  }

  private isBpcSereneta(productCodes: string[]) {
    const containsBpcSereneta = productCodes.some(x => x === 'sara-sereneta');
    return containsBpcSereneta;
  }

  private isBpcSmartphone(productCodes: string[]) {
    const containsBpcSmartphone = productCodes.some(x => x === 'chubb-devices');
    return containsBpcSmartphone;
  }

  private isPaiAccident(productCodes: string[]) {
    const containsAccident = productCodes.some(x => x === 'pai-personal-accident');
    const containsAccidentExtra = productCodes.some(x => x === 'pai-personal-accident-extra');
    return containsAccident || containsAccidentExtra;
  }

  private isBike(productCodes: string[]) {
    const containsBikeEasy = productCodes.some(x => x === 'ea-bike-easy');
    const containsBikeTop = productCodes.some(x => x === 'ea-bike-top');
    return containsBikeEasy || containsBikeTop;
  }

  private isCovidStandard(productCodes: string[]) {
    const containsCovidStd = productCodes.some(x => x === 'nobis-covid-standard');
    return containsCovidStd;
  }

  private isTiresStandardPlus(productCodes: string[]) {
    const containsTiresStandard = productCodes.some(x => x === 'covea-tires-covered-standard');
    const containsTiresPlus = productCodes.some(x => x === 'covea-tires-covered-plus');
    return containsTiresStandard || containsTiresPlus;
  }

}
