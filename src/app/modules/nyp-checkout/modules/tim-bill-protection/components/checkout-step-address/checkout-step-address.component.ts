import { NypIadCustomerService, NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { City, Country, State, User } from '@model';
import { AuthService, DataService } from '@services';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, concat } from 'rxjs';
import { filter, take, tap, toArray } from 'rxjs/operators';
import { TimBillProtectionApiService } from '../../services/api.service';
import moment from 'moment';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-checkout-step-address',
  templateUrl: './checkout-step-address.component.html',
  styleUrls: ['./checkout-step-address.component.scss', '../../../../styles/checkout-forms.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss']
})
export class CheckoutStepAddressComponent implements OnInit {
  public readonly pageStates: CheckoutStates[] = ['address'];
  public isMobile: boolean = window.innerWidth < 768;
  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
  }
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  titleStates: CheckoutStates[] = ['login-register'];
  summaryStates: CheckoutStates[] = ['survey', 'consensuses', 'insurance-info'];

  countries: Array<Country> = [];
  birthStates: Array<State> = [];
  birthCities: Array<City> = [];
  residentialStates: Array<State> = [];
  residentialCities: Array<City> = [];

  form: FormGroup;
  startingUser: any;
  endUser: { name: string; surname: string; tax_code: string; street: string; city: string; };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private nypUserService: NypUserService,
    private nypIadCustomerService: NypIadCustomerService,
    private dataService: DataService,
    public nypDataService: NypDataService,
    private apiService: TimBillProtectionApiService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.endUser = {
      name: this.authService.loggedUser?.firstname,
      surname: this.authService.loggedUser?.lastname,
      tax_code: this.authService.loggedUser?.address?.taxcode,
      street: this.authService.loggedUser?.address?.address1,
      city: this.authService.loggedUser?.address?.city,
    };

    this.nypDataService.CurrentState$.pipe(
      filter(state => this.pageStates.includes(state)),
      take(1),
    ).subscribe(() => {
      this.form = this.formBuilder.group(this.fromModelToView(this.authService.loggedUser));
      this.startingUser = this.fromViewToModel();

      this.form.setValidators((group: FormGroup): ValidationErrors => {
        const birthDateControl = group.controls['birthDate'];

        const birthDate = moment(birthDateControl.value);

        // Cannot be younger then 18 years old
        if (moment().subtract(18, 'years').isBefore(birthDate))
          return { notCompliant: 'tim_bill_protection.min_18' };
        // cannot be older then 64 years old plus 364 days
        else if (moment().subtract(69, 'years').subtract(364, 'days').isAfter(birthDate))
          return { notCompliant: 'tim_bill_protection.max_69' };
      });

      ['birthCountry', 'birthState', 'birthCity', 'residentialCountry', 'residentialState', 'residentialCity',
        this.form.controls['fiscalCode'].value ? 'fiscalCode' : undefined,
        this.form.controls['birthDate'].value ? 'birthDate' : undefined,
        this.form.controls['firstName'].value ? 'firstName' : undefined,
        this.form.controls['lastName'].value ? 'lastName' : undefined,
      ]
        .filter(v => !!v)
        .forEach(csc => this.form.controls[csc].disable());

      this.getCountry(this.dataService.countriesEndpoint).subscribe(countries => {
        this.countries = countries;

        if (this.form.controls['birthCountry'].value?.id) {
          this.getState(this.form.controls['birthCountry'].value.id, 'birth').subscribe();
        } else this.form.controls['birthCountry'].enable();

        if (this.form.controls['residentialCountry'].value?.id) {
          this.getState(this.form.controls['residentialCountry'].value.id, 'residential').subscribe();
        }
        this.form.controls['residentialCountry'].enable();
      });
    });
  }

  getCountry(id: string): Observable<Country[]> {
    return this.nypUserService.getCountries(id);
  }

  getCity(id: number, destination: 'birth' | 'residential' | 'all'): Observable<City[]> {
    return this.nypUserService.getCities(id).pipe(tap(cities => {
      if (destination == 'birth' || destination == 'all') {
        this.birthCities = cities;

        if (!this.form.controls['birthCity'].value) this.form.controls['birthCity'].enable();
      }
      if (destination == 'residential' || destination == 'all') {
        this.residentialCities = cities;
        this.form.controls['residentialCity'].enable();
      }
    }));
  }

  getState(id: number, destination: 'birth' | 'residential' | 'all'): Observable<State[]> {
    return this.nypUserService.getProvince(id).pipe(tap(states => {
      if (destination == 'birth' || destination == 'all') {
        this.birthStates = states;

        const birthCountryValue = this.form.controls['birthCountry'].value;
        console.log("Paese di nascita:", birthCountryValue);

        if (destination == 'birth' && birthCountryValue?.name?.toLowerCase() !== 'italia') {
          console.log("Paese diverso da Italia");
          this.form.get('birthState').disable();
          this.form.get('birthCity').disable();
        } else if (this.form.controls['birthState'].value) {
          this.getCity(this.form.controls['birthState'].value.id, 'birth').subscribe();
        } else this.form.controls['birthState'].enable();

      }
      if (destination == 'residential' || destination == 'all') {
        this.residentialStates = states;
        this.form.controls['residentialState'].enable();

        if (this.form.controls['residentialState'].value) {
          this.getCity(this.form.controls['residentialState'].value.id, 'residential').subscribe();
        }
      }
    }));
  }


  selectChanged(csc: { id: number }, nextControlName: string) {
    if (!csc?.id) return;

    this.form.get(nextControlName).patchValue(null);
    this.form.get(nextControlName).disable();

    const destination = nextControlName.toLowerCase().includes('birth') ? 'birth' : 'residential';

    if (nextControlName.toLowerCase().includes('state')) {
      this.getState(csc.id, destination).subscribe();
    }
    else if (nextControlName.toLowerCase().includes('city')) {
      if (destination == 'residential')
        this.getCity(csc.id, destination).subscribe();
      else
        this.getCity(csc.id, destination).subscribe();
    }
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName)?.invalid && (this.form.get(formControlName)?.touched || this.form.get(formControlName)?.dirty);
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required') || this.getFieldError(formControlName, 'minlength') || this.getFieldError(formControlName, 'maxlength') || this.getFieldError(formControlName, 'pattern')) {
        return 'error-field'
      }
      if (this.getFieldError(formControlName, 'pattern')) {
        return 'warning-field'
      }
    }
  }

  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1?.id === o2?.id;
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName)?.errors && this.form.get(formControlName)?.errors[errorType];
  }

  fromModelToView(user: User): { [key: string]: any } {
    const dateOfBirth = user?.address?.birth_date?.split('-');
    return {
      firstName: [user?.firstname, [Validators.required]],
      lastName: [user?.lastname, [Validators.required]],
      fiscalCode: [user?.address?.taxcode, [Validators.required, Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$')]],
      phoneNumber: [user?.address?.phone, [Validators.required, Validators.pattern(/^\+39\d{10}$/)]],
      birthDate: [`${dateOfBirth[0]?.padStart(2, '0')}-${dateOfBirth[1]?.padStart(2, '0')}-${dateOfBirth[2]?.padStart(2, '0')}`, [Validators.required]],
      birthCountry: [user?.address?.birth_country, [Validators.required]],
      birthState: [user?.address?.birth_state, [Validators.required]],
      birthCity: [user?.address?.birth_city, [Validators.required]],
      residentialState: [user?.address?.state, [Validators.required]],
      residentialCountry: [user?.address?.country, [Validators.required]],
      residentialCity: [{ name: user?.address?.city, id: user?.address?.city_id }, [Validators.required]],
      postCode: [user?.address?.zipcode, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(/^\d+$/)]],
      email: [user?.email, [Validators.required]],
      gender: [user?.address?.sex || null],
    };
  }

  updateUser() {
    this.endUser = this.fromViewToModel();
    concat(
      ...[
        this.hasChanged() ? this.nypIadCustomerService.editCustomerUserDetails({ data: this.endUser }) : undefined,
      ].filter(v => !!v)
    ).pipe(toArray(), take(1)).subscribe(() => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '');
      // digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
      // this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      this.kenticoTranslateService.getItem<any>('tim_bill_protection').pipe(take(1)).subscribe(item => {
        const stepName = item?.insured_documents_title?.value;
        digitalData.page.pageInfo.pageName = stepName;
        this.adobeAnalyticsDataLayerService.adobeTrackClick();
        this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      });
      this.nypDataService.CurrentState$.next('insurance-info')
    });
  }

  hasChanged(): boolean {
    const user = this.fromViewToModel();
    return Object.entries(this.startingUser).some(([k, v]) => user[k] != v);
  }

  fromViewToModel(): any {
    return {
      birth_country: this.form.controls['birthCountry'].value?.name, //string
      birth_country_id: this.form.controls['birthCountry'].value?.id, //number
      birth_state: this.form.controls['birthState'].value?.name, //string
      birth_state_id: this.form.controls['birthState'].value?.id,
      birth_state_abbr: this.form.controls['birthState'].value?.iso, //number
      birth_city: this.form.controls['birthCity'].value?.name, //string
      birth_city_id: this.form.controls['birthCity'].value?.id, //string
      zip_code: this.form.controls['postCode'].value, //string
      city: this.form.controls['residentialCity'].value?.name, //string
      city_id: this.form.controls['residentialCity'].value?.id, //number
      country: this.form.controls['residentialCountry'].value?.name, //string
      country_id: this.form.controls['residentialCountry'].value?.id, //number
      state: this.form.controls['residentialState'].value?.name, //string
      state_id: this.form.controls['residentialState'].value?.id, //number
      state_abbr: this.form.controls['residentialState'].value?.abbr,//string
      street: this.form.controls['residentialAddress'].value, //string
      gender: this.form.controls['gender']?.value || null,
      id: this.authService.loggedUser.id,
      date_of_birth: this.form.controls['birthDate'].value, //string
      //language: null, //string
      //legal_form: null, //string
      //education: education,//string
      //salary: salary,//string
      //profession: profession,//string
      primary_mail: this.form.controls['email'].value,//string
      primary_phone: this.form.controls['phoneNumber'].value,//string
      //secondary_mail: this.user.email, //string
      //secondary_phone: this.user.address?.phone, //string
      //street_number: null, //string
      name: this.form.controls['firstName'].value,//string
      surname: this.form.controls['lastName'].value, //string
      tax_code: this.form.controls['fiscalCode'].value, // string
      //userAcceptances: this.userAcceptances,
      //username: null, //string
    };
  }
}
