import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services';
import { CheckoutStates, IOrderResponse, RecursivePartial, ViaggiAnnualeInsuredItems } from 'app/modules/nyp-checkout/models/api.model';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, concat, of } from 'rxjs';
import { catchError, filter, map, take, toArray } from 'rxjs/operators';
import { TimProtezioneViaggiAnnualeApiService } from '../../services/api.service';
import { AdobeAnalyticsDatalayerService } from '../../../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-checkout-step-insurance-info',
    templateUrl: './checkout-step-insurance-info.component.html',
    styleUrls: ['./checkout-step-insurance-info.component.scss',
        '../../../../../../styles/checkout-forms.scss',
        '../../../../../../styles/size.scss',
        '../../../../../../styles/colors.scss',
        '../../../../../../styles/text.scss',
        '../../../../../../styles/common.scss'
    ],
    standalone: false
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {

  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly summaryStates: CheckoutStates[] = ['insurance-info', 'user-control', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  public Order$ = this.nypDataService.Order$;

  form: UntypedFormGroup;
  lastAvailableDate: string;
  endDate = new UntypedFormControl(new Date());
  maxDate: Date;
  minDate: Date;
  maxDateInput: Date;
  isInputFocused: boolean = false;
  startDateModel: NgbDateStruct;
  endDateModel: NgbDateStruct;
  quantity: number;
  isForMe: boolean = true;
  isForMeGroup: boolean = true;
  isStartingNowDis: boolean = false;
  startDateString: string;
  endDateString: string;
  startDate: Date;
  expirationDate: Date;
  daysDifference: number;
  filterDatepicker = (d: Date): boolean => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return d > yesterday;
  }

  filterDatepickerInput = (date: Date | null): boolean => {
    if (!date) return false;
    return date >= this.minDate && date <= this.maxDateInput;
  };


  constructor(
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: UntypedFormBuilder,
    public nypUserService: NypUserService,
    private authService: AuthService,
    public nypDataService: NypDataService,
    private apiService: TimProtezioneViaggiAnnualeApiService,
    private nypApiService: NypApiService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
  ) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy datepicker angular
  }

  get subjects() {
    return this.form.get('subjects') as UntypedFormArray;
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = new Date(1954, 0, 1);
    this.maxDateInput = today;

    this.startDateString = this.nypDataService.Order$.value?.orderItem[0]?.start_date;
    this.endDateString = this.nypDataService.Order$.value?.orderItem[0]?.expiration_date;

    if (this.startDateString && this.endDateString) {
      this.startDate = new Date(this.startDateString);
      this.expirationDate = new Date(this.endDateString);

      const timeDiff = this.expirationDate.getTime() - this.startDate.getTime();
      this.daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
      console.log('daysDifference:', this.daysDifference);
    } else {
      console.error('Le date non sono valide.');
    }

    this.quantity = this.Order$.value.orderItem[0]?.quantity;
    this.form = this.formBuilder.group({
      insuranceForMe: [undefined, Validators.required],
      subjects: this.formBuilder.array([])
    });

    this.form.get('insuranceForMe').valueChanges.subscribe(value => {
      this.updateNumberOfInput();
    });

    this.nypDataService.CurrentState$
      .pipe(filter(state => state == 'insurance-info'), take(1))
      .subscribe(() => {
        this.form.get('insuranceForMe').patchValue(!this.nypDataService.Yin);
      });
  }

  updateNumberOfInput() {
    const currentValue = this.form.get('insuranceForMe')?.value;

    if (currentValue === undefined) {
      return;
    }

    this.subjects.clear();
    if (currentValue === true) {
      this.subjects.push(this.formBuilder.group({
        insuredName: [this.authService.loggedUser?.firstname || '', Validators.required],
        insuredSurname: [this.authService.loggedUser?.lastname || '', Validators.required],
        insuredDate: [this.authService.loggedUser?.address?.birth_date || '', Validators.required]
      }));
      for (let i = 1; i < this.quantity; i++) {
        this.subjects.push(this.formBuilder.group({
          insuredName: ['', Validators.required],
          insuredSurname: ['', Validators.required],
          insuredDate: ['', Validators.required]
        }));
      }
    } else {
      for (let i = 0; i < this.quantity; i++) {
        this.subjects.push(this.formBuilder.group({
          insuredName: ['', Validators.required],
          insuredSurname: ['', Validators.required],
          insuredDate: ['', Validators.required]
        }));
      }
    }
  }


  onDateChangeInput(event: MatDatepickerInputEvent<Date>) {
    this.form.get('subjects').updateValueAndValidity();
    this.isInputFocused = true;
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName)?.invalid &&
      (this.form.get(formControlName)?.touched || this.form.get(formControlName)?.dirty);
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName)?.errors &&
      this.form.get(formControlName)?.errors[errorType];
  }

  getErrorFieldClass(formControlName: string, formGroupIndex?: number): string {
    if (formGroupIndex !== undefined) {
      const control = (this.form.get('subjects') as UntypedFormArray).at(formGroupIndex).get(formControlName);
      if (control?.invalid && (control?.touched || control?.dirty)) {
        if (control?.errors?.['required']) {
          return 'error-field';
        }
        if (control?.errors?.['pattern']) {
          return 'warning-field';
        }
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
  }

  handleNextStep() {
    if (!this.Order$.value || !this.Order$.value.orderItem || !this.Order$.value.orderItem[0]) {
      console.error('Dati dell\'ordine mancanti');
      return;
    }

    const orderItem = this.Order$.value.orderItem[0];
    if (!orderItem.expiration_date || !orderItem.insured_item || !orderItem.insured_item.start_date) {
      console.error('Date mancanti nell\'ordine');
      return;
    }
    const insuredItems = orderItem.insured_item as ViaggiAnnualeInsuredItems
    const destinationCode = insuredItems?.destinationCode;

    const insuredItem: ViaggiAnnualeInsuredItems = {
      insurance_holders: this.subjects.controls.map((formGroup: UntypedFormGroup) => {
        return {
          surname: formGroup.controls.insuredSurname.value,
          name: formGroup.controls.insuredName.value,
          birth_date: this.formatDateToYMD(new Date(formGroup.controls.insuredDate.value)),
        };
      }),
      destination: this.nypDataService.Order$?.value?.orderItem[0]?.insured_item?.destination,
      destinationCode: destinationCode,
      insured_is_contractor: this.form.get('insuranceForMe').value,
      start_date: this.formatDateToISOString(this.nypDataService.Order$.value?.orderItem[0]?.insured_item?.start_date),
      expiration_date: this.formatDateToISOString(this.nypDataService.Order$.value?.orderItem[0]?.insured_item?.expiration_date),
      insureds_total: this.Order$.value.orderItem[0].quantity
    }

    this.updateOrder(insuredItem).subscribe(() => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '');
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.nypDataService.CurrentState$.next('survey');
      // this.checkExistingPolicy();
    });
  }

  // checkExistingPolicy() {
  //   if (this.authService.loggedIn) {
  //     this.apiService.checkExistingPolicy().subscribe(
  //       response => {
  //         console.log('Policy check response:', response);
  //         if (response.data === "Nessun'altra polizza trovata") {
  //           this.nypDataService.CurrentState$.next('survey');
  //         } else if (response.data === "Polizza già esistente") {
  //           this.nypDataService.CurrentState$.next('user-control');
  //         } else {
  //           this.router.navigate(['error-page']);
  //         }
  //       },
  //       error => {
  //         console.error('Errore durante il controllo della polizza esistente:', error);
  //         this.router.navigate(['error-page']);
  //       }
  //     );
  //   }
  // }

  private formatDateToYMD(date: Date): string {
    if (isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private formatDateToISOString(date: string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return '';
    }
    return d.toISOString().slice(0, 19) + '+01:00';
  }

  public getValidate(): Observable<RecursivePartial<IOrderResponse<ViaggiAnnualeInsuredItems>>> {
    try {
      const orderId = this.nypDataService.Order$.value?.orderCode;
      if (!orderId) {
        console.error('OrderCode non è definito o è vuoto.');
        return of({} as RecursivePartial<IOrderResponse<ViaggiAnnualeInsuredItems>>);
      }

      return this.apiService.getValidate()
        .pipe(
          map(response => response?.data || {}),
          catchError(error => {
            console.error('Errore durante la validazione:', error);
            return of({});
          })
        );
    } catch (error) {
      console.error('Errore in getValidate:', error);
      return of({});
    }
  }

  private updateOrder(insuredItems?: ViaggiAnnualeInsuredItems): Observable<(RecursivePartial<IOrderResponse<ViaggiAnnualeInsuredItems>> | void)[]> {
    if (!this.nypDataService.Order$.value || !this.nypDataService.Order$.value.orderCode) {
      console.error('OrderCode mancante');
      return of([]);
    }

    const orderItem = this.Order$.value.orderItem[0];
    if (!orderItem || !orderItem.expiration_date || !orderItem.insured_item || !orderItem.insured_item.start_date) {
      console.error('Date mancanti');
      return of([]);
    }

    const endDate = new Date(orderItem.expiration_date);
    const startDate = new Date(orderItem.start_date);

    if (isNaN(endDate.getTime()) || isNaN(startDate.getTime())) {
      console.error('Date non valide');
      return of([]);
    }

    return concat(
      this.apiService.putOrder({
        orderCode: this.nypDataService.Order$.value.orderCode,
        customerId: this.authService.loggedUser?.id,
        productId: this.nypDataService.CurrentProduct$.value?.id,
        insuredItems: insuredItems,
        anagState: 'Draft',
        days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) + 1,
      }),
      this.getValidate().pipe(catchError(error => {
        console.error('Error during validation:', error);
        return of(null);
      }))
    ).pipe(toArray(), take(1));
  }
}
