import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencySymbolComma'})
export class CurrencySymbolComma implements PipeTransform {
  transform(value?: string | number) {
    if (value !== undefined && value !== null) {
      return new Intl.NumberFormat('it', {  style: 'decimal', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(<number>value);
    }
  }
}
