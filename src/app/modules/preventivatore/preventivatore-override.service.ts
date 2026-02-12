import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { PreventivatoreContentProviderService } from './preventivatore-dynamic/services/content/preventivatore-content-provider-service';
import { PreventivatoreTimCustomersMyHomeContentProviderService } from './preventivatore-dynamic/services/content/tim-customers/preventivatore-tim-customers-myhome-content-provider.service';
import { PreventivatoreComponentsProviderService } from './preventivatore-dynamic/services/product-components/preventivatore-components-provider.service';
import { TimCustomersLayoutComponentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/tim-customers-layout-component-provider.service';
import { Location } from '@angular/common'
import { PreventivatoreTimCustomersMyHomeFtthContentProviderService } from './preventivatore-dynamic/services/content/tim-customers/preventivatore-tim-customers-myhome-ftth-content-provider.service';
import { TimCustomersLayoutComponentProviderFtthService } from './preventivatore-dynamic/services/product-components/tim-customers-layout-component-ftth.provider.service';
import { FTTH_QUERY_PARAM } from 'app/shared/shared-queryparam-keys';

const OVERRIDE_RULE_NAME = 'preventivatore-override'

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreOverrideService {

  constructor(
    private preventivatoreContentProviderService: PreventivatoreContentProviderService,
    private preventivatoreComponentsLayoutProviderService: PreventivatoreComponentsProviderService,
    private componentFeatureService: ComponentFeaturesService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  public overridePreventivatoreRegistration(productCode: string): void {
    this.getProductOverride(productCode);
  }

  private getProductOverride(productCode: string): void {
    this.componentFeatureService.useComponent(OVERRIDE_RULE_NAME);
    this.componentFeatureService.useRule(productCode);
    if (this.componentFeatureService.isRuleEnabled()) {
      const functionName = this.componentFeatureService.getConstraints().get('function');
      const functionToApply = this.getFnCallback(functionName);
      if (functionToApply) {
        functionToApply.apply(this)
      }
    }
     else {
      return;
    }
  }

  // set in mongoDB, called by functionToApply.apply(this) in getProductOverride
  private setTimMyHomeOverride(): void {
    const queryParamMap = this.route.snapshot.queryParamMap
    if (queryParamMap.has(FTTH_QUERY_PARAM)) {
      this.location.replaceState('casa-ftth')
      this.preventivatoreComponentsLayoutProviderService.setProvider(['tim-my-home'], TimCustomersLayoutComponentProviderFtthService);
      this.preventivatoreContentProviderService.setProvider(['tim-my-home'], PreventivatoreTimCustomersMyHomeFtthContentProviderService);
    }
  }

  // Call this method to restore reducer and content service to the ones in the module
  public restoreTimMyHomeProviders() {
    this.preventivatoreComponentsLayoutProviderService.setProvider(['tim-my-home'], TimCustomersLayoutComponentProviderService);
    this.preventivatoreContentProviderService.setProvider(['tim-my-home'], PreventivatoreTimCustomersMyHomeContentProviderService);
  }

  private getFnCallback(functionName: string): Function {
    return PreventivatoreOverrideService.prototype[functionName];
  }

}
