import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {TranslateService} from '@ngx-translate/core';
import {registerLocaleData} from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';


export const LOCALE_FALLBACK = 'it_IT';

const localeDataMapping = {
  it_IT: localeIt,
  es_ES: localeEs,
  en_GB: localeEn,
};

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  locale: string;

  constructor(
    private dataService: DataService,
    private translateService: TranslateService,
  ) {
  }

  setupLocale() {
    const tenantLocales = Object.assign([], [LOCALE_FALLBACK], this.dataService.tenantInfo.locales as string[]);

    tenantLocales.forEach(locale => registerLocaleData(localeDataMapping[locale], locale));

    this.translateService.setDefaultLang(this.getMainLocale());
    this.translateService.use(this.getMainLocale());
  }

  getMainLocale(): string {
    const tenantLocales = this.dataService.tenantInfo.locales as string[] || [];
    this.locale = tenantLocales[0] || LOCALE_FALLBACK;
    return this.locale;
  }

  getCurrencySymbol(locale) {
    switch (locale) {
      case 'it_IT':
        return 'EUR';
      case 'es_ES':
        return 'EUR';
      case 'en_GB':
        return 'GBP';
      default:
        return 'EUR';
    }
  }
}
