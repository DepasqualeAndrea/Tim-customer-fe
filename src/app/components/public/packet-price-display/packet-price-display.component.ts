import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

type theme = 'dark' | 'light'

@Component({
    selector: 'app-packet-price-display',
    templateUrl: './packet-price-display.component.html',
    styleUrls: [
        './packet-price-display.component.scss',
        '../../../modules/nyp-checkout/styles/checkout-forms.scss',
        '../../../modules/nyp-checkout/styles/size.scss',
        '../../../modules/nyp-checkout/styles/colors.scss',
        '../../../modules/nyp-checkout/styles/text.scss',
        '../../../modules/nyp-checkout/styles/common.scss',
    ],
    standalone: false
})
export class PacketPriceDisplayComponent implements OnChanges {

  @Input() price: number | string;
  @Input() topLabel?: string;
  @Input() bottomLabel?: string;
  @Input() priceCtaLabel?: string;
  @Input() priceCtaIconSrc?: string;
  @Input() textColor: theme = 'dark';

  @Output() priceCtaClick = new EventEmitter<void>();

  integerPrice: string = '-';
  decimalPrice: string = '-';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['price']){
      this.integerPrice = '-';
      this.decimalPrice = '-';
      this.elaboratePrice();
    }
  }

  private elaboratePrice(){
    if(typeof this.price === 'string'){
      this.price = parseFloat(this.price);
    }

    if(this.price && typeof this.price === 'number'){
      this.integerPrice = this.getIntegerFromPrice();
      this.decimalPrice = this.getDecimalFromPrice();
    }
  }

  private getIntegerFromPrice(){
    if(typeof this.price === 'number'){
      return this.price.toFixed(2).split('.')[0];
    }
  }

  private getDecimalFromPrice(){
    if(typeof this.price === 'number'){
    return this.price.toFixed(2).split('.')[1]
    }
  }

  onPriceCtaClick(){
    this.priceCtaClick.emit();
  }

}
