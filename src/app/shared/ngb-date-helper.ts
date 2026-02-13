import { Injectable } from "@angular/core";
import { UntypedFormGroup, ValidatorFn } from "@angular/forms";
import { NgbCalendar, NgbDate, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

type PeriodOptions = 'days' | 'months' | 'years'

type ExtractSingular<T extends string > = T extends `${infer S}s` ? S : never

type StringFormats<T extends string> = T extends `${infer S}` 
  ? Capitalize<S> | Uppercase<S> | S
  : never

type StringPermutation<T extends string> = 
  T extends `${infer S}` 
    ? StringFormats<S | ExtractSingular<PeriodOptions>>
    : never;

type FirstChar<T extends string> = 
  T extends `${infer F}${infer R}` 
    ? F 
    : never

type ParsedPeriod = Lowercase<FirstChar<StringPermutation<PeriodOptions>>>

@Injectable({
  providedIn: 'root'
})
export class NgbDateHelper {
  constructor(private calendar: NgbCalendar) {}
  today = new HelperDate(this.calendar.getToday(), this.calendar)

  public getPreviousDateFromToday(value: number, period: StringPermutation<PeriodOptions>, precise = true): HelperDate {
    const date = this.calendar.getPrev(
      this.today, 
      this.parsePeriod(period), 
      value)
    this.setPreciseDateInfo(date, precise)
    return new HelperDate(date, this.calendar)
  }

  public getNextDateFromToday(value: number, period: StringPermutation<PeriodOptions>, precise = true): HelperDate {
    const date = this.calendar.getNext(
      this.today, 
      this.parsePeriod(period), 
      value)
    this.setPreciseDateInfo(date, precise)
    return new HelperDate(date, this.calendar)
  }

  private setTodayDayAndMonth(date: NgbDate): void {
    date.day = this.today.day
    date.month = this.today.month
  }

  private parsePeriod(period: StringPermutation<PeriodOptions>): ParsedPeriod {
    return period.slice(0, 1).toLowerCase() as ParsedPeriod
  }

  private setPreciseDateInfo(date: NgbDate, precise: boolean): void {
    if (precise) {
      this.setTodayDayAndMonth(date)
    }
  }

  public from(date: string | Date | NgbDateStruct): HelperDate {
    if (date instanceof Date) {
      return new HelperDate( NgbDate.from({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }), this.calendar)
    }
    if (this.isNgbDateStruct(date))
      return new HelperDate( NgbDate.from(date), this.calendar )
    const dateValues = date.split('-').map(v => +v)
    return new HelperDate (NgbDate.from({ 
      year: dateValues[0],
      month: dateValues[1],
      day: dateValues[2],
    }), this.calendar)
  }

  private isNgbDateStruct(date: NgbDateStruct | string): date is NgbDateStruct {
    return typeof date !== 'string' 
      && (<Array<keyof NgbDateStruct>>Object.keys(date)).every(
        (k: keyof NgbDateStruct) => k in date
      )
  }

  /*
    Prefer using the toString() method of HelperDate class
    because is more customize and supports dynamic format
  */
  public stringifyNgbDate(date: NgbDateStruct): string {
    return `${date.year}-${date.month}-${date.day}`
  }
  public formatNgbDate(date: NgbDate): string {
    return `${date.year}/${date.month}/${date.day}`
  }

  public createDateValidator(
    form: UntypedFormGroup,
    field: string,
    minDate: NgbDateStruct,
    maxDate: NgbDateStruct
  ): ValidatorFn {
    return () => {
      if (form && form.get(field) && form.get(field).value) {
        const parsedDate = this.from(form.get(field).value)
        if (parsedDate.before(minDate)) {
          return {minDateError: true}
        }
        if (parsedDate.after(maxDate)) {
          return {maxDateError: true}
        }
        form.setErrors(null)
        return null
      }
    }
  }
}

type FormatChars = 'dd' | 'mm' | 'yyyy'
type FormatSeparator = '-' | '/' | ' '

type ShuffleFormat<U extends string, S extends string> = `${U}${S}${U}${S}${U}` 

type FormatPermutations = ShuffleFormat<FormatChars, FormatSeparator>

type RemoveDuplicates<T extends string, U1 extends string, U2 extends string> =
  T extends `${U1}${U2}${infer E}${U2}${infer E2}` 
    ? U1 extends E
      ? never
      : U1 extends E2 
        ? never
        : E extends E2
          ? never
          : T extends `${U1}${U2}${E}${infer S}${E2}`
            ? U2 extends S
              ? never
              : `${U1}${U2}${E}${U2}${E2}`
            : never
    : never

type HelperFormat = RemoveDuplicates<FormatPermutations, FormatChars, FormatSeparator>

type Formats<T extends string> = T extends `${infer S}` 
  ? S | Uppercase<S>
  : never

/**
 * Helper class that extends base NgbDate for the following reasons:
 * - Retains classic comparison methods of NgbDate (before(), after() and equals())
 * - Has new method implementations to calculate dates (add() ans subtract())
 * - Is highly customizable to implement new methods that use
 *   any method of NgbCalendar through applyCalendarOperation() 
 */
export class HelperDate extends NgbDate {
  private readonly _calendar: NgbCalendar
  hours: number;
  minutes: number;

  constructor(date: NgbDate, calendar: NgbCalendar) {
    super(date.year, date.month, date.day)
    this._calendar = calendar
    this.hours = 0;
    this.minutes = 0;
  }

  add(value: number, period: StringPermutation<PeriodOptions>): HelperDate {
    return new HelperDate(
      this.applyCalendarOperation("getNext", this, this.parsePeriod(period), value),
      this._calendar
    )
  }

  subtract(value: number, period: StringPermutation<PeriodOptions>): HelperDate {
    return new HelperDate( 
      this.applyCalendarOperation("getPrev", this, this.parsePeriod(period), value),
      this._calendar
    )
  }

  toString(format: Formats<HelperFormat> = 'dd/mm/yyyy'): string {
    return format.toLowerCase().replace(/dd/, this.day.toString().padStart(2, '0'))
      .replace(/mm/, this.month.toString().padStart(2, '0'))
      .replace(/yyyy/, this.year.toString())
  }

  toDate(): Date {
    return new Date(this.year, this.month - 1, this.day)
  }

  /**
   * Calling this method grants access to all NgbCalendar methods
   * @param method Is the name of the NgbCalendar method to call
   * @param args Is the list of arguments to pass to that method
   * @returns Whatever the calendar method returns
   */
  applyCalendarOperation<T extends keyof NgbCalendar>(method: T, ...args: unknown[]): ReturnType<NgbCalendar[T]> {
    return this._calendar[method].apply(null, args)
  }

  private parsePeriod(period: StringPermutation<PeriodOptions>): ParsedPeriod {
    return period.slice(0, 1).toLowerCase() as ParsedPeriod
  }
}
