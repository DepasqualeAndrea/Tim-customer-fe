import { formatCurrency, getCurrencySymbol } from "@angular/common";

export class CurrencyHelper {
  static formatPrice(
    price: number, 
    locale: string = 'it_IT',
    currency: string  = 'EUR'): string {
    return formatCurrency(
      price,
      locale,
      getCurrencySymbol(currency, 'narrow'),
      currency,
      '0.2-2'
    )
  }
}