import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {Observable, of} from 'rxjs';
import {LineFirstItem} from '@model';
import {CheckoutCardInsuredSubjectsComponent} from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {CheckoutPeriod, CheckoutProductCostItem, CheckoutProductCostItemType} from 'app/modules/checkout/checkout.model';
import {CheckoutCardPeriodComponent} from 'app/modules/checkout/checkout-card/checkout-card-period/checkout-card-period.component';
import {CheckoutCardAddonsComponent} from 'app/modules/checkout/checkout-card/checkout-card-addons/checkout-card-addons.component';
import {DataService} from '@services';
import {CheckoutStepService} from 'app/modules/checkout/services/checkout-step.service';

@Component({
  selector: 'app-checkout-step-insurance-info-my-mobility',
  templateUrl: './checkout-step-insurance-info-my-mobility.component.html',
  styleUrls: ['./checkout-step-insurance-info-my-mobility.component.scss']
})
export class CheckoutStepInsuranceInfoMyMobilityComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardPeriodComponent;
  @ViewChild('insuredSubjectsCard') insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;
  @ViewChild('checkoutCardAddons') addonsCard: CheckoutCardAddonsComponent;

  selectedAddons: Array<any> = [];

  constructor(
    private checkoutStepService: CheckoutStepService,
    private dataService: DataService,
  ) {
    super();
  }

  ngOnInit() {
    this.resetCostItems();
  }

  private resetCostItems(): void {
    this.product.costItems = this.product.costItems.filter(ci => ci.type !== CheckoutProductCostItemType.regular && ci.type !== CheckoutProductCostItemType.discount);
    const totalItem: CheckoutProductCostItem = this.product.costItems.filter(item => item.type === CheckoutProductCostItemType.total)[0];
    totalItem.amount = 0;
  }

  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.product.costItems.some(ci => ci.type === CheckoutProductCostItemType.regular));
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject = null;
    this.product.selected_addons = this.selectedAddons;
    return Object.assign(this.product, period, {insuredSubjects});
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    lineItem.addon_ids = this.selectedAddons.map(addon => addon.id);
    lineItem.insurance_info_attributes = this.dataService.requestOrder.order.line_items_attributes['0'].insurance_info_attributes;
  }

  handleSelectedAddon(addon) {
    if (addon.selected && !this.selectedAddons.some(ci => ci.id === addon.id)) {
      this.product.costItems.unshift({
        name: addon.name,
        amount: addon.Amount,
        type: CheckoutProductCostItemType.regular
      });
      this.selectedAddons.push(addon);
    } else if (!addon.ProductMandatory) {
      // if not mandatory and repeted I remove it
      this.selectedAddons = this.selectedAddons.filter(sa => sa.id !== addon.id);
      this.product.costItems = this.product.costItems.filter(ci => ci.name !== addon.name);
    } else if (!this.selectedAddons.some(sa => sa.Module === addon.Module && sa.id !== addon.id)) {
      // if mandatory and repeted and there is other in the same category
      this.selectedAddons = this.selectedAddons.filter(sa => sa.id !== addon.id);
      this.product.costItems = this.product.costItems.filter(ci => ci.name !== addon.name);
    }
    this.checkoutStepService.potentialPriceChange({
      current: this.checkoutStepService.recalculateCostItems(this.product.costItems),
      previous: 0,
      reason: '',
      costItems: this.product.costItems
    });
  }
}
