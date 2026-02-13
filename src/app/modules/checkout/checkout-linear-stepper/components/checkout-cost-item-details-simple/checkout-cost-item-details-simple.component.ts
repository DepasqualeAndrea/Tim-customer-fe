import {Component, ChangeDetectorRef} from '@angular/core';
import {CheckoutLinearStepperBaseComponent} from '../checkout-linear-stepper-base/checkout-linear-stepper-base.component';
import {DataService} from '@services';
import {ComponentFeaturesService} from '../../../../../core/services/componentFeatures.service';

@Component({
    selector: 'app-checkout-cost-item-details-simple',
    templateUrl: './checkout-cost-item-details-simple.component.html',
    styleUrls: ['./checkout-cost-item-details-simple.component.scss'],
    standalone: false
})
export class CheckoutCostItemDetailsSimpleComponent extends CheckoutLinearStepperBaseComponent {

  public isCollapsed = true;
  hideAddons = false;

  constructor(
    ref: ChangeDetectorRef,
    private dataService: DataService,
    public componentFeaturesService: ComponentFeaturesService
  ) {
    super(ref);
    this.hideAddons = this.getRulesHideAddons();
  }

  getRulesHideAddons(): boolean {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('hide-addons-shopping-cart');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      return constraints.includes(this.dataService.getResponseProduct().product_code);
    }
    return false;
  }

}
