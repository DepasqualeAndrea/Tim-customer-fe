import { NypUserService } from '@NYP/ngx-multitenant-core';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService } from '@services';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { CheckoutStates, ForSkiInsuredItems, IOrderResponse, Packet, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import moment from 'moment';
import { Observable, concat } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { AdobeAnalyticsDatalayerService } from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { TimForSkiApiService } from '../../services/api.service';
import { TimForSkiCheckoutService } from '../../services/checkout.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-checkout-step-insurance-info',
  templateUrl: './checkout-step-insurance-info.component.html',
  styleUrls: ['./checkout-step-insurance-info.component.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
  providers: [DatePipe]
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {

  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly summaryStates: CheckoutStates[] = ['insurance-info', 'address', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  form: FormGroup;

  numberOfInput: number[] = [];
  lastAvailableDate: string;
  endDate = new FormControl(new Date());
  maxDate: Date;
  maxDateInput: Date;
  isInputFocused: boolean = false;
  private datesManuallySet: boolean = false;
  startDateModel: NgbDateStruct;
  endDateModel: NgbDateStruct;
  quantity: number;
  isStartingNowDis: boolean = false;
  minMaxDate: {} = { min: 0, max: 150 };
  filterDatepicker = (d: Date): boolean => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Prevent past from being selected.
    return d > yesterday;
  }

  filterDatepickerInput = (d: Date): boolean => {
    const firstYear = new Date('01-01-1954');
    return d > firstYear;
  }

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder,
    public nypUserService: NypUserService,
    public dataService: DataService,
    public checkoutService: TimForSkiCheckoutService,
    private authService: AuthService,
    public nypDataService: NypDataService,
    private apiService: TimForSkiApiService,
    private nypApiService: NypApiService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy datepicker angular
  }


  ngOnInit(): void {
    console.log('CurrentProduct:', this.nypDataService.CurrentProduct$.value);
    console.log('Product from localStorage:', localStorage.getItem('product_code'));
    const productProperties: any = this.nypDataService.CurrentProduct$.value.properties;
    const seasonStartDate = productProperties.properties.find(prop => prop.name == "season_start_date").value;
    const seasonEndDate = productProperties.properties.find(prop => prop.name == "season_end_date").value;

    // Configura le date per i controlli di validità, ma non impostarle automaticamente
    const [day, month, year] = seasonEndDate.split('/');
    const reversedDateString = `${month}/${day}/${year}`;
    const reversedDate = new Date(reversedDateString);

    this.maxDate = moment(reversedDate).subtract(this.dataService.daysNumber - 1, "days").toDate();
    this.maxDateInput = new Date('12-31-2020');

    // Non impostare valori predefiniti per startDate e endDate
    // a meno che non siamo in modalità stagionale
    let startDateValue = null;
    let endDateValue = null;

    // Solo se stagionale, imposta date predefinite
    // if (this.dataService.isSeasonal) {
    startDateValue = this.checkSeasonDate();
    endDateValue = this.inizializeEndDate();
    // Qui imposta datesManuallySet a true poiché in modalità stagionale
    // le date sono fisse
    this.datesManuallySet = true;

    // }

    this.form = this.formBuilder.group({
      isStartingNow: [false, Validators.required],
      startDate: [startDateValue],
      endDate: [endDateValue],
      insuranceForMe: [true, Validators.required],
      subjects: this.formBuilder.array([])
    });

    this.checkStartDate();

    this.quantity = this.dataService.quantity || 1;

    this.updateNumberOfInput();
    this.setFormArrayWithMe();

    let today = moment(new Date());
    let lastDate = moment(new Date('05-15-2000'));
    let todayYear = today.year();
    lastDate.year(todayYear);
    if (today.isBefore(lastDate)) {
      this.lastAvailableDate = lastDate.format('DD/MM/YYYY');
    } else {
      todayYear = todayYear + 1;
      lastDate.year(todayYear);
      this.lastAvailableDate = lastDate.format('DD/MM/YYYY');
    }

    // set datepicker min max date
    const now = new Date();
    const product = this.nypDataService.CurrentProduct$.value;
    const maxBirthDate = new Date(
      now.getFullYear() - product.holder_minimum_age,
      now.getMonth(),
      now.getDate()
    );
    const minBirthDate = new Date(
      now.getFullYear() - product.holder_maximum_age,
      now.getMonth(),
      now.getDate() + 2 // 69 anni e 364 giorni
    );
    this.minMaxDate = { min: this.formatDateForInput(minBirthDate), max: this.formatDateForInput(maxBirthDate) };
    // Se non è stagionale, non chiama checkStartDate() qui
    // per evitare di impostare date predefinite
  }

  get subjects() {
    return this.form.get('subjects') as FormArray;
  }

  checkStartDate() {
    const productProperties: any = this.nypDataService.CurrentProduct$.value.properties
    const seasonStartDate = productProperties.properties.find(prop => prop.name == "season_start_date").value
    const seasonEndDate = productProperties.properties.find(prop => prop.name == "season_end_date").value
    const [day, month, year] = seasonStartDate.split('/');
    const [dayEnd, monthEnd, yearEnd] = seasonEndDate.split('/');
    const reversedDateString = `${month}/${day}/${year}`;
    const reversedDateEndString = `${monthEnd}/${dayEnd}/${yearEnd}`;
    const seasonStartDateMoment = moment(reversedDateString);
    const today = moment(new Date());
    const currentDate = new Date();
    // If this.dataService.firstDay is defined, calculates the policy end date starting from it,
    // otherwise calculates it starting from the current day
    const endDate = this.dataService.firstDay 
    ? moment(this.dataService.firstDay).add((this.dataService.daysNumber - 1), 'days').toDate() 
    : new Date(currentDate.setDate(currentDate.getDate() + this.dataService.daysNumber));

    //se è stagionale e se oggi viene prima dell'inizio della stagione
    if (this.dataService.isSeasonal && today.isBefore(seasonStartDateMoment)) {
      const reversedDate = new Date(reversedDateString);
      this.dataService.firstDay = new Date(reversedDate);
      this.dataService.lastDay = new Date(reversedDateEndString);
    }
    else if (this.dataService.isSeasonal) {
      this.dataService.firstDay = today.toDate();
      this.dataService.lastDay = new Date(reversedDateEndString);
      this.form.get('startDate').setValue(this.dataService.firstDay);
      this.form.get('endDate').setValue(this.dataService.lastDay);
    }
    //se ladata di inizio (o quella di oggi) viene prima dell'inizio della stagione
    else if ((moment(this.dataService.firstDay) || today).isBefore(seasonStartDateMoment)) {
      const reversedDate = new Date(reversedDateString);
      this.dataService.firstDay = new Date(reversedDateString);
      this.dataService.lastDay = new Date(reversedDate.setDate(reversedDate.getDate() + this.dataService.daysNumber - 1));
    }
    else {
      this.dataService.firstDay ??= this.getTomorrowDay();
      this.dataService.lastDay = endDate;
    }
  }

  packetIsSeasonal(packet: Packet): boolean {
    return [
      'tim-for-ski-silver-season',
      'tim-for-ski-gold-season',
      'tim-for-ski-platinum-season'
    ].includes(packet?.sku);
  }

  checkSeasonDate(): Date {
    const productProperties: any = this.nypDataService.CurrentProduct$.value.properties
    const seasonStartDate = productProperties.properties.find(prop => prop.name == "season_start_date").value
    const [day, month, year] = seasonStartDate.split('/');

    // Create a new date string with the day and month reversed
    const reversedDateString = `${month}/${day}/${year}`;

    const seasonStartDateMoment = moment(reversedDateString); //11/01/2023 season_start_date
    const today = moment(new Date(), "MM/DD/YYYY");

    if (today.isBefore(seasonStartDateMoment)) {
      this.isStartingNowDisabled()
      return new Date(reversedDateString);

    }

    return this.getTomorrowDay()
  }

  isStartingNowDisabled() {
    return this.isStartingNowDis = true;
  }

  getTomorrowDay(): Date {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return tomorrow;
  }

  onDateChange(event: any) {
    let selectedDate: Date;

    if (event instanceof Date) {
      selectedDate = event;
    } else if (event.target && event.target.valueAsDate) {
      selectedDate = event.target.valueAsDate;
    } else if (event.target && event.target.value) {
      selectedDate = new Date(event.target.value);
    } else {
      console.error('Impossibile estrarre la data dall\'evento:', event);
      return;
    }

    // Valida la data
    if (isNaN(selectedDate.getTime())) {
      console.error('Data non valida:', selectedDate);
      return;
    }

    // Imposta il flag a true perché l'utente ha selezionato manualmente una data
    this.datesManuallySet = true;

    const numberOfDays = this.dataService.daysNumber - 1;
    const endDate = new Date(selectedDate);
    endDate.setDate(selectedDate.getDate() + numberOfDays);

    // Aggiorna il form
    this.form.get('startDate').setValue(selectedDate);
    this.form.get('endDate').setValue(endDate);
    this.endDate.setValue(endDate);

    // Importante: crea NUOVI oggetti Date per forzare il rilevamento del cambiamento
    this.dataService.firstDay = new Date(selectedDate);
    this.dataService.lastDay = new Date(endDate);
  }

  onDateChangeInput(event: MatDatepickerInputEvent<Date>) {
    this.form.get('subjects').updateValueAndValidity();
    this.isInputFocused = true;
  }

  inizializeEndDate() {
    const productProperties: any = this.nypDataService.CurrentProduct$.value.properties
    const seasonStartDate = productProperties.properties.find(prop => prop.name == "season_start_date").value
    const [day, month, year] = seasonStartDate.split('/');

    // Create a new date string with the day and month reversed
    const reversedDateString = `${month}/${day}/${year}`;
    const reversedDate = new Date(reversedDateString);
    const seasonStartDateMoment = moment(reversedDateString)
    const today = moment(new Date(), "MM/DD/YYYY");
    const currentDate = new Date();
    let endDate;

    if (this.dataService.isSeasonal) {
      endDate = new Date(currentDate.getFullYear(), 4, 15);
    } else if (today.isBefore(seasonStartDateMoment)) {
      endDate = new Date(reversedDate.setDate(reversedDate.getDate() + this.dataService.daysNumber - 1))
    } else {
      endDate = new Date(currentDate.setDate(currentDate.getDate() + this.dataService.daysNumber));
    }
    return endDate
  }


  setFormArrayWithMe() {
    this.subjects.clear();
    this.form.get('subjects').updateValueAndValidity();
    for (let i = 0; i < this.dataService.quantity; i++) {
      if (this.form.get('insuranceForMe') && i === 0) {
        this.subjects.push(this.formBuilder.group({
          insuredName: [''],
          insuredSurname: [''],
          insuredDate: ['']
        }))
      } else {
        this.subjects.push(this.formBuilder.group({
          insuredName: ['', Validators.required],
          insuredSurname: ['', Validators.required],
          insuredDate: ['', Validators.required]
        }))
      }
    }
  }

  setFormArrayWithoutMe() {
    this.subjects.clear();
    this.form.get('subjects').updateValueAndValidity();
    for (let i = 0; i < this.dataService.quantity; i++) {
      this.subjects.push(this.formBuilder.group({
        insuredName: ['', Validators.required],
        insuredSurname: ['', Validators.required],
        insuredDate: ['', Validators.required]
      }))
    }
  }

  updateNumberOfInput() {
    if (!this.form.get('insuranceForMe').value) {
      this.numberOfInput.length = this.dataService.quantity;
      this.setFormArrayWithoutMe();
    } else {
      this.numberOfInput.length = this.dataService.quantity === 1 ? 1 : this.dataService.quantity - 1;
      this.setFormArrayWithMe()
    }
  }

  insuranceStartNow() {
    // Crea nuovi oggetti Date
    const today = new Date();
    const numberOfDays = this.dataService.daysNumber - 1;
    const endDate = new Date();
    endDate.setDate(today.getDate() + numberOfDays);

    this.datesManuallySet = true;

    // Aggiorna il form
    this.form.get('startDate').setValue(today);
    this.form.get('endDate').setValue(endDate);

    this.dataService.firstDay = new Date(today);
    this.dataService.lastDay = new Date(endDate);
  }

  handleNextStep() {
    if (this.form.get('insuranceForMe').value) {
      this.subjects.controls.shift();
    }

    const insuredItem = {
      start_date: this.trasformDateInItalianISO("startDate"),
      insured_is_contractor: this.form.get('insuranceForMe').value,
      days_number: this.dataService.daysNumber,
      instant: this.form.get('isStartingNow').value,
      insurance_info_attributes: {
        extra: null
      },
      insurance_holders_attributes: this.subjects.controls.map((form: FormGroup) => {
        return {
          last_name: form.controls.insuredSurname.value,
          first_name: form.controls.insuredName.value,
          birth_date: this.formatBirthDate(form.controls.insuredDate.value),
        }
      }),
      expiration_date: this.trasformDateInItalianISO("endDate")
    }
    this.dataService.insuredItem = insuredItem;
    this.updateOrder(insuredItem).subscribe(() => {
      const today = new Date();
      today.setFullYear(today.getFullYear() - 14);
      const sci_min14 = insuredItem.insurance_holders_attributes.filter(insured => new Date(insured.birth_date) > today).length;
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.sci_numassicurati = this.dataService.quantity;
      digitalData.cart.form.sci_polizza = String(this.nypDataService.CurrentProduct$.value.description);
      digitalData.cart.form.sci_min14 = sci_min14;
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '');
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.nypDataService.CurrentState$.next('login-register')
    });
    console.log('data compleanno', insuredItem.insurance_holders_attributes.map((i => i.birth_date)))
  }

  getFieldInvalidError(formControlName: string): boolean {
    try {
      const control = this.form.get(formControlName);
      return control?.invalid === true && (control?.touched === true || control?.dirty === true);
    } catch (error) {
      console.error('Errore in getFieldInvalidError:', error);
      return false;
    }
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    try {
      const control = this.form.get(formControlName);
      return control?.errors !== null && control?.errors !== undefined && control?.errors[errorType] === true;
    } catch (error) {
      console.error('Errore in getFieldError:', error);
      return false;
    }
  }

  getErrorFieldClass(formControlName: string, formGroupIndex?: number): string {
    try {
      if (formGroupIndex !== undefined) {
        const formArray = this.form.get('subjects') as FormArray;
        if (!formArray || !formArray.at(formGroupIndex)) return '';

        const control = formArray.at(formGroupIndex).get(formControlName);
        if (control?.invalid && (control?.touched || control?.dirty)) {
          return 'error-field';
        }
      } else {
        if (this.getFieldInvalidError(formControlName)) {
          if (this.getFieldError(formControlName, 'required')) {
            return 'error-field';
          }
          if (this.getFieldError(formControlName, 'pattern')) {
            return 'warning-field';
          }
        }
      }
      return '';
    } catch (error) {
      console.error('Errore in getErrorFieldClass:', error);
      return '';
    }
  }

  private updateOrder(insuredItems?: ForSkiInsuredItems): Observable<(RecursivePartial<IOrderResponse<ForSkiInsuredItems>> | void)[]> {
    return concat(
      this.apiService.putOrder({
        orderCode: this.nypDataService.Order$.value.orderCode,
        customerId: this.authService.loggedUser?.id,
        productId: this.nypDataService.CurrentProduct$.value?.id,
        packet: this.nypDataService.Order$.value.packet.data,
        chosenWarranties: this.nypDataService.Order$.value.packet?.data?.warranties
          ?.map(warranty => Object.assign(warranty, { startDate: this.nypDataService.Order$.value?.orderItem[0]?.start_date, endDate: this.nypDataService.Order$.value?.orderItem[0]?.expiration_date })),
        insuredItems: insuredItems,
        anagState: 'Draft',
      }),
      this.nypApiService.legacyRequest(this.nypDataService.Order$.value.orderCode, this.apiService.GET_EMISSIONBODY(this.nypDataService.Order$.value.orderCode, this.nypDataService.Order$.value.packet.data.id)),
    ).pipe(toArray(), take(1));
  }

  private formatBirthDate(date: any): any {
    if (date instanceof Date) {
      date.setHours(1, 0, 0, 0);
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
    } else if (typeof date === 'string') {
      const dateObject = new Date(date);
      dateObject.setHours(1, 0, 0, 0);
      return new Date(Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate())).toISOString();;
    }
    return date;
  }

  formatDate(date: any): string {
    if (!date) return '';

    const datePipe = new DatePipe('it-IT');

    if (typeof date === 'string') {
      return datePipe.transform(new Date(date), 'dd/MM/yyyy') || '';
    }

    if (date instanceof Date) {
      return datePipe.transform(date, 'dd/MM/yyyy') || '';
    }

    return '';
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private trasformDateInItalianISO(formControl: string): string {
    const datePipe = new DatePipe('it-IT');


    const value = this.form.get(formControl)?.value;
    if (!value) return '';

    if (this.form.get('isStartingNow')?.value && formControl === "startDate") {

      return datePipe.transform(value, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'') || '';
    } else {
      let dateValue: Date;
      if (value instanceof Date) {
        dateValue = new Date(value);
      } else if (typeof value === 'string') {
        dateValue = new Date(value);
      } else {
        console.error('Tipo di data non valido:', value);
        return '';
      }
      dateValue.setHours(0, 0, 0, 0);

      return datePipe.transform(dateValue, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'') || '';
    }
  }
}
