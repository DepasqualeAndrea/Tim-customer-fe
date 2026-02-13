import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { CheckoutLinearStepperBaseComponent } from '../checkout-linear-stepper-base/checkout-linear-stepper-base.component';

@Component({
    selector: 'app-checkout-cost-item-details',
    templateUrl: './checkout-cost-item-details.component.html',
    styleUrls: ['./checkout-cost-item-details.component.scss'],
    standalone: false
})
export class CheckoutCostItemDetailsComponent extends CheckoutLinearStepperBaseComponent implements OnInit {

  public isCollapsed = true;
  hideDate: boolean;
  isPriceForHospitalDesioCivibank: boolean;

  constructor(
    ref: ChangeDetectorRef,
    private dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService
    ) {
    super(ref);
  }

  ngOnInit() {
    this.hideDate = this.getHideDate();
    this.getTitlePrice();
  }
  getTitlePrice():  boolean {
    this.isPriceForHospitalDesioCivibank = (this.dataService.product.product_code.includes('virtualhospital') || this.dataService.isTenant('banco-desio_db') || this.dataService.isTenant('civibank_db')) ? true : false;
    return  this.isPriceForHospitalDesioCivibank;
  }

  private getHideDate(): boolean{
    let hd: boolean = false;
    this.componentFeaturesService.useComponent('quotator');
    this.componentFeaturesService.useRule('hide-date');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      hd = !!constraints.includes(this.dataService.product.product_code);
    }
    return hd;
  }

}
