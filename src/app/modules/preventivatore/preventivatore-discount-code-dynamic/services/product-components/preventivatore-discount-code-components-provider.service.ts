
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { GenericDiscountCodeComponentProviderService } from './generic-discount-code-component-provider.service';
import { PreventivatoreDiscountCodeComponentProvider } from './preventivatore-discount-code-component-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreDiscountCodeComponentsProviderService {
  constructor(
    private genericDiscountCodeComponentProviderService: GenericDiscountCodeComponentProviderService
  ) { }

  getProvider(productCodes: string[]): PreventivatoreDiscountCodeComponentProvider {
    if (this.isTiresCovered(productCodes) || this.isCovidCovered(productCodes)) {
      return this.genericDiscountCodeComponentProviderService;
    }
  }

  private isTiresCovered(productCodes: string[]) {
    const containsTiresCovered = productCodes.some(x => x === 'covea-tires-covered-homage');
    return containsTiresCovered;
  }

  private isCovidCovered(productCodes: string[]) {
    const containsCovidCovered = productCodes.some(x => x === 'nobis-covid-homage');
    return containsCovidCovered;
  }
}
