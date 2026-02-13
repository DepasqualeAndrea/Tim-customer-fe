import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { AbstractControl } from '@angular/forms';

export class TimeHelper {

  static fromNgbDateToDate(ngbDate: NgbDate): Date {
    return ngbDate && new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day) || undefined;
  }

  static fromDateToNgbDate(date: Date): NgbDate {
    return date && new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) || undefined;
  }

  static roundDate(d: Date, interval: number): Date {
    const start = moment(d);
    const remain = interval - (start.minute() % interval);
    if (remain === 0) {
      return d;
    }
    return moment(start).add(remain, 'minutes').toDate();
  }

  static rangeRequiredDateValidator(min: Date, max: Date, format: string = 'DD/MM/YYYY') {
    return function (abstractControl: AbstractControl) {
      const inputDate: NgbDate | string = moment(abstractControl.value).format(format);
      const parsedDate = typeof (inputDate) !== 'string' ? moment(TimeHelper.fromNgbDateToDate(inputDate)) : moment(inputDate, format, true);
      if (abstractControl && abstractControl.value && !parsedDate.isValid()) {
        return { 'dateValidator': true };
      }
      if (abstractControl && abstractControl.value && (parsedDate.isBefore(min) || parsedDate.isAfter(max))) {
        return {
          'dateValidatorMinMax': {
            min: moment(min).format(format),
            max: moment(max).format(format)
          }
        };
      }
      return null;
    };
  }

  static dateValidator(min: Date, max: Date, format: string = 'DD/MM/YYYY') {
    return function (ac: AbstractControl) {
      const val: NgbDate | string = ac.value;
      const d = typeof (val) !== 'string' ? moment(TimeHelper.fromNgbDateToDate(val)) : moment(ac.value, format, true);
      if (ac && ac.value && !d.isValid()) {
        return { 'dateValidator': true };
      }
      if (ac && ac.value && (d.isBefore(min) || d.isAfter(max))) {
        return {
          'dateValidatorMinMax': {
            min: moment(min).format(format),
            max: moment(max).format(format)
          }
        };
      }
      return null;
    };
  }

  static fromStringToNgbDateStrucutre(date: string): NgbDateStruct {
    const momentFormat = moment(date, "YYYY-MM-DD");
    return {
      day: +moment(momentFormat).format('DD'),
      month: +moment(momentFormat).format('MM'),
      year: +moment(momentFormat).format('YYYY'),
    };
  }

  static fromNgbDateStrucutreStringTo(date: NgbDateStruct): string {
    const year = moment().year(date.year).format('YYYY');
    const month = moment().month(date.month).subtract(1, 'months').format('MM');
    const day = moment().date(date.day).format('DD');
    const formateDate = year + '-' + month + '-' + day;
    return formateDate
  }

  static fromNgbDateStrucutreToStringLocale(date: NgbDateStruct): string {
    const year = moment().year(date.year).format('YYYY');
    const month = moment().month(date.month).subtract(1, 'months').format('MM');
    const day = moment().date(date.day).format('DD');
    const formateDate = day + '/' + month + '/' + year;
    return formateDate
  }

  static formatNgbDate(date: NgbDate): string {
    return date.year + date.month.toString().padStart(2, '0') + date.day.toString().padStart(2, '0');
  }
  static inverPositionDayMonth(date: string, format: string, delimiter: string) {
    const dateItems = date.split(delimiter);
    const formatItems = format.toLowerCase().split(delimiter);
    const day = formatItems.indexOf('dd');
    const month = formatItems.indexOf('mm');
    const year = formatItems.indexOf('yyyy');
    const formattedDate = ([dateItems[day], dateItems[month], dateItems[year]]).join(delimiter);
    return formattedDate;
  }

}
