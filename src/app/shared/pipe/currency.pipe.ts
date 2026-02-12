import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { LocaleService } from 'app/core/services/locale.service';

@Pipe({
  name: 'currency'
})

export class CustomCurrencyPipe implements PipeTransform {
  constructor(private localeService: LocaleService) {}

  locale = this.localeService.getMainLocale();

  transform(
    value,
    currencyCode: string = this.localeService.getCurrencySymbol(this.locale),
    display:
        | 'code'
        | 'symbol'
        | 'symbol-narrow'
        | string
        | boolean = 'symbol',
    digitsInfo: string = '0.2-2',
    locale: string = this.locale || 'it_IT',
  ): string | null {
    return formatCurrency(
      value,
      locale,
      getCurrencySymbol(currencyCode, 'narrow'),
      currencyCode,
      digitsInfo,
    );
  }

}
