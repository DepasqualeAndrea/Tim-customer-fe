import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CheckoutStates, IQuote, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { TimNatCatCheckoutService } from '../../services/checkout.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss',
    '../../../../styles/shopping-cart.scss',
    '../../../../styles/size.scss',
    '../../../../styles/colors.scss',
    '../../../../styles/text.scss',
    '../../../../styles/common.scss']
})
export class ShoppingCartComponent implements OnInit {
  public Order$ = this.nypDataService.Order$;
  public quote?: RecursivePartial<IQuote> | undefined;
  public quoteErrorInfo: string | null = null;
  public isStickyCartOpen = true;
  public isSticky: boolean = false;
  public optionalWarrantyNames: string[] = [];
  public showStates: CheckoutStates[] = ['address', 'survey', 'consensuses', 'payment'];
  public showInsuranceInfoStates: any[] = ['choicePacket', 'paymentSplitSelection', 'insuranceData'];
  kenticoContent: any;

  @Input('state') public state: CheckoutStates;
  @Input('isTablet') set _(isTablet: boolean) { this.isSticky = isTablet; this.isStickyCartOpen = !isTablet; }

  constructor(
    public checkoutService: TimNatCatCheckoutService,
    public nypDataService: NypDataService,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit(): void {
    this.kenticoTranslateService.getItem<any>('checkout_customers_nat_cat').subscribe(item => {
      this.kenticoContent = item.shopping_cart_model.value[0];
    });

    this.nypDataService.Quote$.subscribe((quote) => {
    this.quote = quote;
    const quoteAny = quote as any;

    if (!quoteAny?.errorInfo && !quoteAny?.error) {
      this.quoteErrorInfo = null;
      return;
    }
    this.quoteErrorInfo = quoteAny?.error === 'INVALID_ADDRESS'? quoteAny?.errorInfo: this.kenticoContent?.error_msg?.value;
    });

    this.nypDataService.Order$.subscribe(order => {
    this.updateOptionalWarrantyNames(order);
    });
  }

  toggleStickyCart() {
    this.isStickyCartOpen = !this.isStickyCartOpen;
  }

  getInsuredDataLabel(insureItem: any): string{
    return this.kenticoContent.insured_item_extra_txt.value +"<br>"+  (insureItem.indirizzo.charAt(0).toUpperCase() + insureItem.indirizzo.slice(1)) + ', ' + insureItem.cap + ' ' + insureItem.comune
  }

  getPaymentLabelByPaymentFrequency(description: string): string {
    switch (description) {
      case 'M':
        return this.kenticoContent?.month_payment?.value || '';
      case 'T':
        return this.kenticoContent?.quarter_payment?.value || '';
      case 'S':
        return this.kenticoContent?.semester_payment?.value || '';
      case 'Y':
        return this.kenticoContent?.year_payment?.value || '';
      default:
        return '';
    }
  }

  setPriceDetailLabel(): string{
    const description = this.Order$.value.orderItem[0]?.instance?.paymentFrequency;
    let priceDetailLabel;
    if(!!description){
      priceDetailLabel = this.getPaymentLabelByPaymentFrequency(description)
    } else if(this.Order$.value.orderItem[0]?.instance?.quotation){
      priceDetailLabel = this.kenticoContent.month_payment.value;
    }else{
      priceDetailLabel = this.kenticoContent.price_placeholder.value;
    }
    return priceDetailLabel;
  }

  getPriceByPaymentFrequency(paymentFrequency: string): number{
    const splitPayments = this.Order$.value.orderItem[0]?.instance?.quotation?.data[0].splitPayments;
    const splitPaymentObj = Array.isArray(splitPayments)
      ? splitPayments.find((el) => el.description === paymentFrequency)
      : undefined;
    return Number(splitPaymentObj?.total);
  }

  getPrice(): number | string{
   const finalPrice = this.Order$.value.orderItem[0].instance.paymentFrequency ?
      this.getPriceByPaymentFrequency(this.Order$.value.orderItem[0].instance.paymentFrequency)
      : Number(this.Order$.value.orderItem[0]?.instance?.quotation?.data[0]?.total)
    return !isNaN(finalPrice) ? finalPrice:  "";
  }

  hasQuoteError(): boolean {
   return !!this.quoteErrorInfo;
  }

  private updateOptionalWarrantyNames(order: any): void {
    this.optionalWarrantyNames = [];

    const warranties = order?.orderItem?.[0]?.instance?.chosenWarranties?.data?.warranties;
    if (!Array.isArray(warranties) || warranties.length === 0) { return; }

    const namesFromAnag = warranties
      .filter(w => w && w.mandatory === false && w.anagWarranty && w.anagWarranty.name)
      .map(w => String(w.anagWarranty.name).trim())
      .filter(n => n.length > 0);

    if (namesFromAnag.length > 0) {
      this.optionalWarrantyNames = Array.from(new Set(namesFromAnag));
      return;
    }
  }
}

