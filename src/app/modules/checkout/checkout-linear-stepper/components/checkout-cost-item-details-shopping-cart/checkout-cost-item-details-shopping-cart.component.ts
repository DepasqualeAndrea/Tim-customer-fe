import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { CheckoutLinearStepperBaseComponent } from '../checkout-linear-stepper-base/checkout-linear-stepper-base.component';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { FTTH_QUERY_PARAM } from '../../../../../shared/shared-queryparam-keys';
import { ProductConsistencyService } from '../../../../../core/services/product-consistency.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutStepService } from '../../../services/checkout-step.service';
import moment from 'moment';

@Component({
  selector: 'app-checkout-cost-item-details-shopping-cart',
  templateUrl: './checkout-cost-item-details-shopping-cart.component.html',
  styleUrls: ['./checkout-cost-item-details-shopping-cart.component.scss']
})
export class CheckoutCostItemDetailsShoppingCartComponent extends CheckoutLinearStepperBaseComponent implements OnInit, AfterViewChecked {

  tenant: string;
  product: string;
  isTooltipEnabled: boolean;
  annualPrice: boolean;
  hideDate: boolean;
  coverageList: string[];
  private startDateModified: boolean = false;

  constructor(
    ref: ChangeDetectorRef,
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private consistencyService: ProductConsistencyService,
    private route: ActivatedRoute,
    public checkoutStepService: CheckoutStepService
  ) {
    super(ref);
  }

  ngOnInit() {
    console.log("---", this.dataService.product.product_code);
    this.annualPrice = this.annualPrize();
    this.tenant = this.dataService.tenantInfo.tenant;
    this.product = this.dataService.product.product_code;
    this.isTooltipEnabled = this.getTooltipPrice();
    this.hideDate = this.getHideDate();
    this.coverageList = JSON.parse(localStorage.getItem('ProposalCostDetailList'));
    this.modifyStartDate();
  }

  ngAfterViewChecked() {
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (!this.consistencyService.isUserLoggedInWithSso && queryParamMap.has(FTTH_QUERY_PARAM)) {
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.price',
        value: '€0,00'
      });
    }
  }

  private getTooltipPrice(): boolean {
    this.componentFeaturesService.useComponent('quotator');
    this.componentFeaturesService.useRule('tooltip-price');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      return !!constraints.includes(this.dataService.product.product_code);
    }
  }

  private getHideDate(): boolean {
    let hd: boolean = false;
    this.componentFeaturesService.useComponent('quotator');
    this.componentFeaturesService.useRule('hide-date');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      hd = !!constraints.includes(this.dataService.product.product_code);
    }
    return hd;
  }

  private annualPrize(): boolean {
    /* this.data.useComponent('quotator');
    this.data.useRule('annual-prize');
    return this.data.isRuleEnabled(); */
    return true;
  }

  private modifyStartDate() {
    if (!this.startDateModified) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      this.data.policy_startDate = currentDate.toLocaleDateString();
      this.startDateModified = true;
    }
  }

  public getStartDate(): Date {
    return new Date(this.data?.policy_startDate?.split("/").reverse().join("-"));
  }

  public getLastDate(): Date {
    if (this.data && this.data.policy_endDate) {
      let str = this.data.policy_startDate;
      let replaceDate = str.split("/").reverse().join("-");
      let endDate = new Date(replaceDate);
      if (this.dataService.product.product_code === 'ge-travel-plus') {
        endDate.setDate(endDate.getDate() - 1);
      } else if (['tim-for-ski-silver', 'tim-for-ski-gold', 'tim-for-ski-platinum'].some(code => code == this.dataService.product.product_code)) {
        endDate.setDate(
          endDate.getDate() + (
            !isNaN(this.dataService?.requestOrder?.order?.line_items_attributes[0]?.days_number - 1)
              ? this.dataService?.requestOrder?.order?.line_items_attributes[0]?.days_number - 1
              : JSON.parse(localStorage.getItem('reqOrder'))?.order.line_items_attributes[0].days_number - 1
          )
        ); //the latter is working
        console.log(endDate)
      }
      this.dataService.skiPolicyDates = { start: this.data.policy_startDate.split("/").reverse().join("-"), end: endDate.toISOString().split('T')[0] };
      return endDate;
    }
  }
  public startDateLessOneDay(startDate: Date): any {
    return moment(startDate).subtract(1, "days");
  }
}
