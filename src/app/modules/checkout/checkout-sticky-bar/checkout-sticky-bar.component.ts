import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckoutStep } from '../checkout-step/checkout-step.model';
import { CheckoutStepService } from '../services/checkout-step.service';
import { StickyBarCyAttribute } from './sticky-bar-cy-attribute.model';
import { StickyBarCyStepAttributes } from './sticky-bar-cy-step-attributes.model';
import { CheckoutService, DataService } from '@services';
import { CheckoutProductCostItem, CheckoutProductCostItemType } from '../checkout.model';

@Component({
    selector: 'app-checkout-sticky-bar',
    templateUrl: './checkout-sticky-bar.component.html',
    styleUrls: ['./checkout-sticky-bar.component.scss'],
    standalone: false
})
export class CheckoutStickyBarComponent implements OnInit {

  @Input() currentStep: CheckoutStep;
  @Input() canContinue = false;
  @Input() continueButtonValue: string;
  @Output() next: EventEmitter<unknown> = new EventEmitter<unknown>();
  @Output() prev: EventEmitter<unknown> = new EventEmitter<unknown>();

  private stepCyMapping: Map<string, StickyBarCyStepAttributes> = new Map<string, StickyBarCyStepAttributes>();

  constructor(private checkoutStepService: CheckoutStepService, private checkoutService: CheckoutService, public dataService: DataService) {
    this.stepCyMapping.set('insurance-info', new StickyBarCyStepAttributes().setAttribute('continue', 'chekout-step-info', 'continue', 'button-mobile'));
    this.stepCyMapping.set('survey',
      new StickyBarCyStepAttributes()
        .setAttribute('back', 'chekout-step-survey', 'back', 'button')
        .setAttribute('continue', 'chekout-step-survey', 'continue', 'button')
    );
  }

  ngOnInit() {

  }

  getTotalCostInfo(): number {
    const totalItems: CheckoutProductCostItem[] = this.currentStep.product.costItems.filter(item =>
      item.type === CheckoutProductCostItemType.total
    ) || [];
    if (totalItems.length !== 1) {
      // THIS SHOULD NEVER HAPPEN
      // It happened.. :(
      return 0;
    } else {
      return !!totalItems[0].amount ? totalItems[0].amount : 0;
    }
  }
  getSubtotalCostInfo(): number {
    const discounterItems: CheckoutProductCostItem[] = this.currentStep.product.costItems.filter(item => item.type === CheckoutProductCostItemType.discount) || [];
    if (discounterItems.length === 0) {
      return undefined;
    }

    const totalAfterDiscount: number = this.getTotalCostInfo();
    return totalAfterDiscount + Math.abs(discounterItems[0].amount);
  }

  private hasCyAttribute(attributeId: string): boolean {
    if (!this.currentStep || !this.currentStep.name) {
      return false;
    }

    const attrs: StickyBarCyStepAttributes = this.stepCyMapping.get(this.currentStep.name);
    if (!attrs) {
      return false;
    }

    const attr = attrs.getAttribute(attributeId);
    return attr !== undefined && attr !== null;
  }

  getCyAttribute(attributeId: string): StickyBarCyAttribute {
    if (this.hasCyAttribute(attributeId)) {
      return this.stepCyMapping.get(this.currentStep.name).getAttribute(attributeId);
    } else {
      return { block: '', element: '', params: [] };
    }
  }

  callNext(): void {
    this.next.emit(null);
  }
  callPrev(): void {
    this.prev.emit(null);
  }

}
