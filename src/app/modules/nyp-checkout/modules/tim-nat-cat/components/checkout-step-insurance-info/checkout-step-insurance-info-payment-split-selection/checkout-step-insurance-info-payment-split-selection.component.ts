import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsuranceInfoStates, TimNatCatCheckoutService } from '../../../services/checkout.service';
import { TimNatCatService } from '../../../services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-checkout-step-insurance-info-payment-split-selection',
  templateUrl: './checkout-step-insurance-info-payment-split-selection.component.html',
  styleUrls: [
    './checkout-step-insurance-info-payment-split-selection.component.scss',
    '../../../../../styles/checkout-forms.scss',
    '../../../../../styles/size.scss',
    '../../../../../styles/colors.scss',
    '../../../../../styles/text.scss',
    '../../../../../styles/common.scss'
  ]
})
export class CheckoutStepInsuranceInfoPaymentSplitSelectionComponent implements OnInit {

  insuranceInfoState: InsuranceInfoStates = 'paymentSplitSelection';

  @Input() kenticoContent: any;
  @Output() currentState: EventEmitter<string> = new EventEmitter();

  quoteSuccessful: boolean | null = null;
  options: any[] = [];
  content: any | undefined;
  pricingForm!: FormGroup;
  selectedOption: any | undefined;
  defaultPrice: number | undefined;
  currentProduct: any;
  contentItems: any;

  constructor(
    private fb: FormBuilder,
    public checkoutService: TimNatCatCheckoutService,
    private apiService: TimNatCatService,
    private nypDataService: NypDataService
  ) { }

  ngOnInit(): void {
    this.pricingForm = this.fb.group({
      selectedOption: ['', Validators.required]
    });

    this.currentProduct = this.nypDataService.CurrentProduct$.value;
    this.handleQuote();
    this.setupValueChangesListener();
  }

  private getKenticoSubtitle(code: string): string {
    switch (code) {
      case 'M':
        return this.kenticoContent?.split_month?.value || '';
      case 'T':
        return this.kenticoContent?.split_quarter?.value || '';
      case 'S':
        return this.kenticoContent?.split_semester?.value || '';
      case 'Y':
        return this.kenticoContent?.split_year?.value || '';
      default:
        return '';
    }
  }

  handleQuote(): void {
    const order = this.nypDataService.Order$.value;
    const quoteParams = {
      data: {
        customerId: order?.customerId,
        orderId: order?.id,
        productId: this.currentProduct.id
      }
    };

     this.apiService.quote(quoteParams).subscribe({
      next: (res: any) => {
      if (!res?.splitPayments) return;

      this.quoteSuccessful = true;

      this.content = {
        currency: res.currency,
        defaultLabel: 'anno',
        insuranceDurationButtons: res.splitPayments.map((o: any) => ({
          frequency: o.description,
          title: `${o.label}`,
          subtitle: this.getKenticoSubtitle(o.description),
          durationLabel: o.label
        }))
      };

      this.options = res.splitPayments.map((opt: any) => ({
        description: opt.description,
        price: opt.total,
        discountedPrice: res.splitPayments.find(p => p.description === 'Y')?.total || null,
        default: opt.default,
        label: opt.label
      }));

      const savedFrequency = order?.paymentFrequency || order?.orderItem?.[0]?.instance?.paymentFrequency;
      const selected = this.options.find(o => o.description === savedFrequency) || this.options.find(o => o.default);

      if (selected) {
        this.selectedOption = selected;
        this.defaultPrice = selected.price;
        this.pricingForm.get('selectedOption')?.setValue(selected.description, { emitEvent: false });
      } else {
        this.initFormWithDefault();
      }},
      error: (err) => {
      this.quoteSuccessful = false;
      console.error('Quote error:', err);
      }
    });
  }

  private initFormWithDefault(): void {
    const defaultOpt = this.options.find(o => o.default) || this.options.find(o => o.description === this.content?.defaultFrequency);
    if (defaultOpt) {
      this.pricingForm.get('selectedOption')?.setValue(defaultOpt.description, { emitEvent: false });
      this.selectedOption = defaultOpt;
      this.defaultPrice = defaultOpt.price;
    }
  }

  private setupValueChangesListener(): void {
    this.pricingForm.get('selectedOption')?.valueChanges.pipe(
      tap(value => {
        this.selectedOption = this.options.find(o => o.description === value);
        this.quoteSuccessful = null
      }),
      switchMap(() => this.updateOrderAndQuote())
    ).subscribe();
  }

  private updateOrderAndQuote(): Observable<any> {
    if (!this.selectedOption) return of(null);

    const paymentFrequency = this.selectedOption.description;
    let updatedOrder: any;

    return this.apiService.putOrder({ paymentFrequency }).pipe(
      tap(res => {
        updatedOrder = res;
        this.nypDataService.Order$.next(res);
      }),
      switchMap(() => this.apiService.quote({
        data: {
          customerId: updatedOrder.customerId,
          orderId: updatedOrder.id,
          productId: this.currentProduct.id
         }
      }).pipe(
        tap(res => {
          this.quoteSuccessful = true;
        }),
        tap({
          error: () => {
            this.quoteSuccessful = false;
          }
        })
      )
    )
  );
  }

  getButtonForOption(option: any): any | undefined {
    return this.content?.insuranceDurationButtons?.find(b => b.frequency === option.description);
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }

  handlePrevStep(): void {
    this.currentState.emit( this.checkoutService.InsuranceInfoState$.value);
    this.checkoutService.InsuranceInfoState$.next('choicePacket');
  }

  handleNextStep(): void {
    this.updateOrderAndQuote().subscribe(() => {
      this.checkoutService.InsuranceInfoState$.next('insuranceData');
    });
  }

}
