import { Component, OnInit, Input } from '@angular/core';
import { NetCyberBusinessCheckoutService } from '../../services/checkout.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutStates, IQuote, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';


@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss',
        '../../../../styles/shopping-cart.scss',
        '../../../../styles/size.scss',
        '../../../../styles/colors.scss',
        '../../../../styles/text.scss',
        '../../../../styles/common.scss'],
    standalone: false
})

export class ShoppingCartComponent implements OnInit {

  public Order$ = this.nypDataService.Order$;
  public quote?: RecursivePartial<IQuote> | undefined;
  public quoteErrorInfo: string | null = null;
  public isStickyCartOpen = true;
  public isSticky: boolean = false;
  public showStates: CheckoutStates[] = ['address', 'survey', 'consensuses', 'payment'];
  public showInsuranceInfoStates: any[] = ['choicePacket', 'paymentSplitSelection'];
  kenticoContent: any;


  @Input('state') public state: CheckoutStates;
  @Input('isTablet') set _(isTablet: boolean) { this.isSticky = isTablet; this.isStickyCartOpen = !isTablet; }


  constructor(
    public checkoutService: NetCyberBusinessCheckoutService,
    public nypDataService: NypDataService,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit(): void {
    this.kenticoTranslateService.getItem<any>('checkout_customers_net_cyber_business').subscribe(item => {
      this.kenticoContent = item.shopping_cart_model.value[0];
    });

    this.nypDataService.Quote$.subscribe((quote) => {
      this.quote = quote;
      const quoteAny = quote as any;

      if (quoteAny?.errorInfo || quoteAny?.error) {
        this.quoteErrorInfo = this.kenticoContent?.error_msg?.value;
      } else {
        this.quoteErrorInfo = null;
      }
    });
  }


  toggleStickyCart() {
    this.isStickyCartOpen = !this.isStickyCartOpen;
  }


  getInsuredDataLabel(insureItem: any): string {
    if (!insureItem) {
      return this.kenticoContent?.insured_item_extra_txt?.value || '';
    }

    const extraText = this.kenticoContent?.insured_item_extra_txt?.value || '';
    const indirizzo = insureItem.indirizzo ?
      (insureItem.indirizzo.charAt(0).toUpperCase() + insureItem.indirizzo.slice(1)) :
      '';
    const cap = insureItem.cap || '';
    const comune = insureItem.comune || '';

    const indirizzoCompleto = [indirizzo, cap, comune]
      .filter(Boolean)
      .join(' ');
    return extraText + (indirizzoCompleto ? '<br>' + indirizzoCompleto : '');
  }

  getPaymentLabelByPaymentFrequency(description: string): string {
    switch (description) {
      case 'M':
        return this.kenticoContent?.monthly?.value || this.kenticoContent?.month_payment?.value || '';
      case 'T':
        return this.kenticoContent?.quarter_payment?.value || '';
      case 'S':
        return this.kenticoContent?.semester_payment?.value || '';
      case 'Y':
        return this.kenticoContent?.yearly?.value || this.kenticoContent?.year_payment?.value || '';
      default:
        return '';
    }
  }

  setPriceDetailLabel(): string {
    const orderItem = this.Order$.value?.orderItem[0];
    const packet = this.Order$.value?.packet;

    // Se c'è paymentFrequency, usa il metodo di pagamento specifico
    if (orderItem?.instance?.paymentFrequency) {
      return this.getPaymentLabelByPaymentFrequency(orderItem.instance.paymentFrequency);
    }

    // Altrimenti controlla se c'è una quotazione
    if (orderItem?.instance?.quotation?.data?.[0]?.price) {
      return this.kenticoContent?.month_payment?.value || '';
    }

    // Se c'è packet_duration, restituisci l'etichetta mensile
    const packetDuration = packet?.data?.['packet_duration']?.['packet_duration'];
    if (Array.isArray(packetDuration) && packetDuration.length > 0) {
      return this.kenticoContent?.month_payment?.value || '';
    }

    // Default
    return this.kenticoContent?.price_placeholder?.value || '';
  }

  getPriceByPaymentFrequency(paymentFrequency: string): number {
    const splitPayments = this.Order$.value.orderItem[0]?.instance?.quotation?.data[0].splitPayments;
    const splitPaymentObj = Array.isArray(splitPayments)
      ? splitPayments.find((el) => el.description === paymentFrequency)
      : undefined;

    return Number(splitPaymentObj?.price);
  }

  getPrice(): number {
    const orderItem = this.Order$.value?.orderItem[0];
    const packet = this.Order$.value?.packet;

    if (orderItem?.instance?.paymentFrequency) {
      return this.getPriceByPaymentFrequency(orderItem.instance.paymentFrequency);
    }

    if (orderItem?.instance?.quotation?.data?.[0]?.price) {
      return Number(orderItem.instance.quotation.data[0].price) || 0;
    }

    const packetDuration = packet?.data?.['packet_duration']?.['packet_duration'];
    if (Array.isArray(packetDuration) && packetDuration.length > 0) {
      const selectedDuration = packetDuration[0] || packetDuration[1];
      return Number(selectedDuration?.price) || 0;
    }

    return 0;
  }

  hasQuoteError(): boolean {
    return !!this.quoteErrorInfo;
  }

}
