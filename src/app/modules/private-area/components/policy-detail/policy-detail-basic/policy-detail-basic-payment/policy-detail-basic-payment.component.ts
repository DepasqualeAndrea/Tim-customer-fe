import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Policy, PolicyPaymentMethodType } from 'app/modules/private-area/private-area.model';
import { PaymentMethod } from '../../../../../payment-management/payment-management.model';
import { ComponentFeaturesService } from '../../../../../../core/services/componentFeatures.service';
import { DataService, InsurancesService } from '@services';

@Component({
  selector: 'app-policy-detail-basic-payment',
  templateUrl: './policy-detail-basic-payment.component.html',
  styleUrls: ['../policy-detail-basic.component.scss']
})

export class PolicyDetailBasicPaymentComponent {

  @Input() policy: Policy;
  @Input('paymentData') _;
  paymentData: {};
  @Input() cardNumbers: string;
  paymentMethods_: PaymentMethod[];
  @Input() set paymentMethods(value: any[]) {
    this.paymentMethods_ = value;
    if (Array.isArray(value) && value.length > 0)
      this.paymentData = {
        type: value[0].type,
        holder: value[0].holder,
        lastDigits: `************${value[0].lastDigits}`,
        expiration: value[0].expiration,
      }
    };
  @Input() paymentMethod: PaymentMethod;
  @Input() braintreePaymentMethodId: number;
  @Input() braintreePaymentMethodName: string;
  @Input() paypal: boolean;
  @Input() creditCard: boolean;
  @Input() disclaimer3DSecure: any;
  @Input() collapseWhenPaymentAdded: boolean;

  @Output() paymentMethodChanged: EventEmitter<PaymentMethod> = new EventEmitter<PaymentMethod>();
  @Output() paymentMethodAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() requestSavePolicyPaymentMethod: EventEmitter<void> = new EventEmitter<void>();

  editCollapsed = true;

  constructor(private componentFeaturesService: ComponentFeaturesService,
    private dataService: DataService,
    private insuranceService: InsurancesService,
    private elementRef: ElementRef) {


  }

  get paymentMethodTypes() {
    return PolicyPaymentMethodType;
  }

  handlePaymentMethodChanged(method: PaymentMethod): void {
    this.paymentMethodChanged.emit(method);
  }

  handlePaymentMethodAdded(item: any): void {
    this.paymentMethodAdded.emit(item);
  }

  savePolicyPaymentMethod(): void {
    this.requestSavePolicyPaymentMethod.emit();
  }

  isPaymentRecurrent(policy) {
    return !!policy.subscription;
  }

  isPaymentRedirect() {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('payment-redirect');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        return constraints.some((product) => this.policy.product.product_code.startsWith(product.productName));
      }
    }
  }

  changePayment() {
    const paymentMethod = this.policy.product.payment_methods.find(method => method.name.toLowerCase().includes('sia'));
    const request = { line_item_id: this.policy.id };
      this.insuranceService.getSiaPaymentRedirectManageCard(request, paymentMethod.id.toString()).subscribe(resp => {
      const containerHtmlSia = this.elementRef.nativeElement.querySelector('.container-html-sia-change-payment');
      containerHtmlSia.insertAdjacentHTML('beforeend', resp.body);
      document.forms['frm'].submit();
    });
  }

}
