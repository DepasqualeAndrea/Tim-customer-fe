import {Component, Injectable, LOCALE_ID, Inject} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {LocaleService} from './locale.service';

const I18N_VALUES = {
    'it_IT': {
      weekdays: ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'],
      months: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    },
    'es_ES': {
      weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    },
    'en_GB': {
      weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fi', 'Sa', 'Su'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  };

@Injectable()
export class NgbDatepickerLocalization extends NgbDatepickerI18n {

  constructor(private locale: LocaleService) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this.locale.locale].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this.locale.locale].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
     return `${date.day}-${date.month}-${date.year}`;
  }
}
