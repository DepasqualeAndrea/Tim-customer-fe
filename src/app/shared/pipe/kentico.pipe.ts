import { Pipe, PipeTransform } from '@angular/core';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

export function kentico(value: string, ...args: unknown[]): string {
  let slugs = value?.split('.');
  if (slugs?.length < 2) return '';

  // Sometimes, prefix have been sent duplicated. With this escamotage the array will be read from the last element ignoring possible duplicated of the prefix.
  const [suffix, prefix,] = [slugs.pop(), slugs.pop()];

  const res = NypDataService.Translations[prefix][suffix];
  if (!res) {
    return '';
  }
  return res;
}

@Pipe({
    name: 'kentico',
    standalone: false
})
export class KenticoPipe implements PipeTransform {
  constructor() { }

  transform(value: string, ...args: unknown[]): string {
    return kentico(value, ...args);
  }
}
