import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services';
import { CheckoutStates, IOrderResponse, ViaggiRoamingInsuredItems, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, concat } from 'rxjs';
import { filter, take, toArray } from 'rxjs/operators';
import { TimProtezioneViaggiRoamingApiService } from '../../services/api.service';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-step-insurance-info',
  templateUrl: './checkout-step-insurance-info.component.html',
  styleUrls: ['./checkout-step-insurance-info.component.scss', '../../../../../../styles/checkout-forms.scss', '../../../../../../styles/size.scss', '../../../../../../styles/colors.scss', '../../../../../../styles/text.scss', '../../../../../../styles/common.scss']
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {

  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly summaryStates: CheckoutStates[] = ['insurance-info', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  public Order$ = this.nypDataService.Order$;
  form: FormGroup;
  numberOfInput: number[] = [];
  lastAvailableDate: string;
  endDate = new FormControl(new Date());
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
    private formBuilder: FormBuilder,
    public nypUserService: NypUserService,
    private authService: AuthService,
    public nypDataService: NypDataService,
    private apiService: TimProtezioneViaggiRoamingApiService,
    private nypApiService: NypApiService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
  ) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy datepicker angular
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = new Date(1930, 0, 1);
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

    this.nypDataService.CurrentState$
      .pipe(filter(state => state == 'insurance-info'), take(1))
      .subscribe(() => {
        this.quantity = this.Order$.value.orderItem[0]?.quantity;

        if (this.quantity === 1) {
          this.singleUserSubmission();
        } else {
          this.form = this.formBuilder.group({
            insuranceForMe: [true,],
            subjects: this.formBuilder.array([])
          });
          this.updateNumberOfInput();
          this.setFormArrayWithMe();
        }
      });
  }

  setFormArrayWithMe() {
    this.subjects.clear();
    this.form.get('subjects').updateValueAndValidity();
    const loggedUser = this.authService.loggedUser;
    for (let i = 0; i < this.quantity; i++) {
      if (this.form.get('insuranceForMe').value && (i === 0 || this.quantity === 1)) {
        this.subjects.push(this.formBuilder.group({
          insuredName: [loggedUser?.firstname || '', Validators.required],
          insuredSurname: [loggedUser?.lastname || '', Validators.required],
          insuredDate: [loggedUser?.address.birth_date || '', Validators.required]
        }));
      } else {
        this.subjects.push(this.formBuilder.group({
          insuredName: ['', Validators.required],
          insuredSurname: ['', Validators.required],
          insuredDate: ['', Validators.required]
        }));
      }
    }
    console.log(this.form.value);
    console.log(this.form.valid);
  }

  setFormArrayWithoutMe() {
    this.subjects.clear();
    this.form.get('subjects').updateValueAndValidity();
    for (let i = 0; i < this.quantity; i++) {
      this.subjects.push(this.formBuilder.group({
        insuredName: ['', Validators.required],
        insuredSurname: ['', Validators.required],
        insuredDate: ['', Validators.required]
      }))
    }
  }

  updateNumberOfInput() {
    if (!this.form.get('insuranceForMe').value) {
      this.numberOfInput.length = this.quantity;
      this.setFormArrayWithoutMe();
    } else {
      this.numberOfInput.length = this.quantity === 1 ? 1 : this.quantity - 1;
      this.setFormArrayWithMe();
    }
    this.form.updateValueAndValidity();
  }

  onDateChangeInput(event: MatDatepickerInputEvent<Date>) {
    this.form.get('subjects').updateValueAndValidity();
    this.isInputFocused = true;
  }

  get subjects() {
    return this.form.get('subjects') as FormArray;
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName)?.invalid && (this.form.get(formControlName)?.touched || this.form.get(formControlName)?.dirty);
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName)?.errors && this.form.get(formControlName)?.errors[errorType];
  }

  getErrorFieldClass(formControlName: string, formGroupIndex?: number): string {
    if (formGroupIndex !== undefined) {
      const control = (this.form.get('subjects') as FormArray).at(formGroupIndex).get(formControlName);
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
    const endDate = this.Order$.value.orderItem[0].expiration_date;
    const startDate = this.Order$.value.orderItem[0].insured_item.start_date;
    const insuredItem: ViaggiRoamingInsuredItems = {
      insurance_holders: this.subjects.controls.map((formGroup: FormGroup) => {
        return {
          surname: formGroup.controls.insuredSurname.value,
          name: formGroup.controls.insuredName.value,
          birth_date: this.formatDateToYMD(new Date(formGroup.controls.insuredDate.value)),
        };
      }),
      destination: this.nypDataService.Order$.value?.orderItem[0]?.insured_item.destination,
      insured_is_contractor: this.form.get('insuranceForMe').value,
      start_date: this.formatDateToISOString(this.nypDataService.Order$.value?.orderItem[0]?.start_date),
      days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) + 1,
    };

    this.updateOrder(insuredItem).subscribe(() => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = 'Continua';
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.nypDataService.CurrentState$.next('survey');
    });
  }

  singleUserSubmission() {
    const loggedUser = this.authService.loggedUser;
    const insuredItem: ViaggiRoamingInsuredItems = {
      insurance_holders: [
        {
          surname: loggedUser?.lastname || '',
          name: loggedUser?.firstname || '',
          birth_date: this.formatDateToYMD(new Date(loggedUser?.address.birth_date)),
        }
      ],
      destination: this.nypDataService.Order$.value?.orderItem[0]?.insured_item.destination,
      insured_is_contractor: true,
      start_date: this.formatDateToISOString(this.nypDataService.Order$.value?.orderItem[0]?.start_date),
      days: this.daysDifference + 1,
    };

    this.updateOrder(insuredItem).subscribe(() => this.nypDataService.CurrentState$.next('survey'));
  }

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

  private updateOrder(insuredItems?: ViaggiRoamingInsuredItems): Observable<(RecursivePartial<IOrderResponse<ViaggiRoamingInsuredItems>> | void)[]> {
    const endDate = this.Order$.value.orderItem[0].expiration_date;
    const startDate = this.Order$.value.orderItem[0].insured_item.start_date;
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
        days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) + 1,
      }),
    ).pipe(toArray(), take(1));
  }
}
