import {Component, OnInit} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {Observable, Subscription} from 'rxjs';
import {CheckoutStepService} from '../../../services/checkout-step.service';
import {CheckoutProductCostItem, CheckoutProductCostItemType} from '../../../checkout.model';
import {CheckoutStepPriceChange} from '../../checkout-step.model';
import {Router} from '@angular/router';

@Component({
    selector: 'app-checkout-step-insurance-info-legal-protection',
    templateUrl: './checkout-step-insurance-info-legal-protection.component.html',
    styleUrls: [ './checkout-step-insurance-info-legal-protection.component.scss']
  })
export class CheckoutStepInsuranceInfoLegalProtectionComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {
    product: CheckoutStepInsuranceInfoProduct;
    private couponSubscription: Subscription;

    constructor(
      private checkoutStepService: CheckoutStepService,
      private router: Router)
    {
      super();
    }

    isFormValid(): boolean {
        return null;
    }
    computeProduct(): CheckoutStepInsuranceInfoProduct {
        return null;
    }
    onBeforeNextStep(): Observable<any> {
        return null;
    }
    ngOnInit() {
      this.couponSubscription = this.checkoutStepService.afterCheckoutCouponApplied$.subscribe(() => {
        // Getting data and validating it
        const discountItems: CheckoutProductCostItem[] = this.product.costItems.filter(item => item.type === CheckoutProductCostItemType.discount);
        const totalItem: CheckoutProductCostItem = this.product.costItems.find(item => item.type === CheckoutProductCostItemType.total);
        if(discountItems.length != 1 || !totalItem)
          return;

        // Check product type (yearly, monthly)
        let period: number = 1;
        const isMonthly: boolean = !!this.product.costItems.find(item => item.type === CheckoutProductCostItemType.monthlyPayment);
        if(isMonthly) {
          period = 12;
        }

        // update discountItem
        const discountItem: CheckoutProductCostItem = discountItems[0];
        discountItem.period = period;

        // update total
        const priceChange: CheckoutStepPriceChange =  {
          costItems: this.product.costItems,
          current: this.checkoutStepService.recalculateCostItems(this.product.costItems, true, false) / period,
          previous: 0,
          reason: ''
        };
        this.checkoutStepService.potentialPriceChange(priceChange);

        // clear subscription
        this.couponSubscription.unsubscribe();
      });
      this.router.navigate(["checkout/address"]);


    }
}
