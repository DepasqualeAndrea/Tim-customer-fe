import { Component, Input, OnInit } from '@angular/core';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { TimNatCatCheckoutService } from '../../services/checkout.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DataService } from 'app/core/services/data.service';
import { ForgotPasswordNdgModalComponent } from 'app/modules/security/components/login/forgot-password-ndg-modal/forgot-password-ndg-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services';
import { NypIadTokenService, NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';
import { catchError, distinct, map, mergeMap, take, tap } from 'rxjs/operators';
import { City, Country, State, User } from '@model';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, of } from 'rxjs';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';
import { UtilsService } from '../../services/utils.service';

const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
};
const passwordPatternValidator: ValidatorFn = Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/);

@Component({
  selector: 'app-checkout-step-login',
  templateUrl: './checkout-step-login.component.html',
  styleUrls: [
    './checkout-step-login.component.scss',
    '../../../../styles/checkout-forms.scss',
    '../../../../styles/size.scss',
    '../../../../styles/colors.scss',
    '../../../../styles/text.scss',
    '../../../../styles/common.scss'
  ]
})
export class CheckoutStepLoginComponent implements OnInit {

  @Input('state') public state: CheckoutStates;
  @Input() API_KEY?: string = 'AIzaSyBexfHEd_JaLQtrPLZjcpKoUDzo1EaXN9o';

  selectedOption: string = '';
  form!: FormGroup;
  wrongCredentials = false;
  showPassword = {
    login: false,
    new: false,
    confirm: false
  };
  countries: Country[] = [];
  provinces: State[] = [];
  cities: City[] = [];
  vatNumberRegex = /^[0-9]{11}$/;
  taxcodeRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i;
  registrationSuccess: boolean = false;
  registrationError: string | null = null;
  showRegistrationForm$: Observable<boolean>;
  content: any;

  constructor(
    public checkoutService: TimNatCatCheckoutService,
    private fb: FormBuilder,
    public dataService: DataService,
    private modalService: NgbModal,
    private auth: AuthService,
    private insuranceService: NypInsurancesService,
    private nypUserService: NypUserService,
    private httpClient: HttpClient,
    private nypDataService: NypDataService,
    private kenticoTranslateService: KenticoTranslateService,
    private nypIadTokenService: NypIadTokenService,
    private timMyBrokerCustomersService: TimMyBrokerCustomersService,
    private natCatUtilsService: UtilsService
  ) { }

  get formHasError(): boolean {
    const registerForm = this.form.get('register');
    if (!registerForm) return false;
    return Object.keys((registerForm as FormGroup).controls).some(key => registerForm.get(key)?.invalid && registerForm.get(key)?.touched) || !!registerForm.errors;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getKenticoContent();
    this.showRegistrationForm$ = interval(50)
      .pipe(
        map(() => localStorage.getItem('user')),
        distinct(),
        map((user: string) => {
          const isLogged = !!user && !!JSON.parse(user)?.data?.email;
          if (isLogged) {
            this.nypDataService.CurrentState$.next('address');
          }
          return !isLogged;
        })
      );
      this.setPrivateArea();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('access_business').subscribe(item => {
      const elements = item._raw.elements;
      this.content = {
        commonLabel: {
          show_password: elements.show_password?.value[0].url,
          icon_back_btn: elements.icon_back_btn?.value[0].url,
          icon_btn_text: elements.icon_btn_text?.value,
          title: elements.title?.value,
          yes_label: elements.yes_label?.value,
          no_label: elements.no_label?.value,
          error_icon: elements.error_icon?.value[0].url
        },
        register: {
          subtitle: elements.subtitle_register?.value,
          required_text: elements.required_text?.value,
          company_name_label: elements.company_name_label?.value,
          vat_number_label: elements.vat_number_label?.value,
          vat_error_message: elements.vat_error_message?.value,
          country_label: elements.country_label?.value,
          province_label: elements.province_label?.value,
          city_label: elements.city_label?.value,
          address_label: elements.address_label?.value,
          cap_label: elements.cap_label?.value,
          cap_error_message: elements.cap_error_message?.value,
          company_owner_label: elements.company_owner_label?.value,
          name_label: elements.name_label?.value,
          surname_label: elements.surname_label?.value,
          different_codes_label: elements.different_codes_label?.value,
          tax_code_label: elements.tax_code_label?.value,
          tax_code_error_message: elements.tax_code_error_message?.value,
          account_create: elements.account_create?.value,
          email_label: elements.email_label?.value,
          email_error_message: elements.email_error_message?.value,
          new_password_label: elements.new_password_label?.value,
          password_validation_info: elements.password_validation_info?.value,
          confirm_password: elements.confirm_password_label?.value,
          confirm_password_error_message: elements.confirm_password_error_message?.value,
          account_create_error: elements.account_create_error?.value,
          data_consent: elements.data_consent?.value,
          consent_advertisting_label: elements.consent_advertisting_label?.value,
          consent_behaviours_label: elements.consent_behaviours_label?.value,
          consent_text: elements.consent_text?.value,
          registration_btn_text: elements.registration_btn?.value,
          icon_activation: elements.icon_activation?.value[0].url,
          activation_title: elements.activation_title?.value,
          activation_subtitle: elements.activation_subtitle?.value,
          activation_btn: elements.activation_btn?.value
        },
        login: {
          subtitle: elements.subtitle?.value,
          icon_step: elements.icon_step?.value[0]?.url,
          email: elements.email_label?.value,
          password: elements.password_label?.value,
          error_message: elements.error_message?.value,
          reset_password: elements.reset_password?.value,
          login_btn: elements.login_btn?.value,
        }
      };
    });
  }

  initializeForm(): void {
    this.form = this.fb.group({
      accountOption: ['', Validators.required],
      login: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      }),
      register: this.fb.group({
        company: ['', Validators.required],
        vat: ['', [Validators.required, Validators.pattern(this.vatNumberRegex)]],
        countries: ['', Validators.required],
        provinces: [{ value: '', disabled: true }, Validators.required],
        cities: [{ value: '', disabled: true }, Validators.required],
        address: ['', Validators.required],
        postCode: ['', Validators.required],
        showExtra: [false],
        showtaxcode_mismatched: [false],
        name: [''],
        surname: [''],
        tax_code: ['', Validators.pattern(this.taxcodeRegex)],
        taxcode_mismatched: ['', Validators.pattern(this.taxcodeRegex)],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, passwordPatternValidator]],
        confirmPassword: ['', Validators.required],
        marketingConsent: [false, Validators.requiredTrue],
        communicationConsent: [false, Validators.requiredTrue]
      }, { validators: confirmPasswordValidator }
      )
    });

    this.form.get('accountOption')?.valueChanges.subscribe(option => {
      const loginGroup = this.form.get('login') as FormGroup;
      const registerGroup = this.form.get('register') as FormGroup;
      if (option === 'login') {
        registerGroup.reset();
      } else if (option === 'register') {
        loginGroup.reset();
        this.getCountries();
      }
      this.wrongCredentials = false;
      this.registrationError = '';

    });

    this.form.get('register.countries')?.valueChanges.subscribe((country: Country) => {
      if (country && country.id) {
        this.getProvices(country.id);
        this.form.get('register.provinces')?.enable();
      } else {
        this.provinces = [];
        this.cities = [];
        this.form.get('register.provinces')?.reset();
        this.form.get('register.provinces')?.disable();
        this.form.get('register.cities')?.reset();
        this.form.get('register.cities')?.disable();
      }
    });

    this.form.get('register.provinces')?.valueChanges.subscribe((province: State) => {
      if (province && province.id) {
        this.getCity(province);
      } else {
        this.cities = [];
        this.form.get('register.cities')?.reset();
        this.form.get('register.cities')?.disable();
      }
    });

    const group = this.form.get('register') as FormGroup;
    group.get('showExtra')?.valueChanges.subscribe(() => this.updateExtraFieldValidators());
    group.get('showtaxcode_mismatched')?.valueChanges.subscribe(() => this.updateExtraFieldValidators());

    this.form.get('register.postCode')?.valueChanges.subscribe(() => {
      const capField = this.form.get('register.postCode');
      if (capField?.hasError('errorMessage')) {
        capField.setErrors(null);
      }
    });
  }

  updateExtraFieldValidators(): void {
    const group = this.form.get('register') as FormGroup;
    const showExtra = group.get('showExtra')?.value;
    const showtaxcode_mismatched = group.get('showtaxcode_mismatched')?.value;

    if (showExtra) {
      group.get('name')?.setValidators(Validators.required);
      group.get('surname')?.setValidators(Validators.required);
      group.get('tax_code')?.setValidators([Validators.required, Validators.pattern(this.taxcodeRegex)]);
    } else {
      group.get('name')?.clearValidators();
      group.get('name')?.reset();
      group.get('surname')?.clearValidators();
      group.get('surname')?.reset();
      group.get('tax_code')?.clearValidators();
      group.get('tax_code')?.reset();
    }

    if (showtaxcode_mismatched) {
      group.get('taxcode_mismatched')?.setValidators([Validators.required, Validators.pattern(this.taxcodeRegex)]);
    } else {
      group.get('taxcode_mismatched')?.clearValidators();
      group.get('taxcode_mismatched')?.reset();
    }

    ['name', 'surname', 'tax_code', 'taxcode_mismatched'].forEach(field => {
      group.get(field)?.updateValueAndValidity();
    });
  }

  getCountries() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint)
      .pipe(take(1))
      .subscribe(countries => {
        const italy = countries.find(c => c.name === 'Italia');
        if (italy) {
          this.countries = [italy];
        } else {
          console.warn('Paese Italia non trovato');
        }
      });
  }

  getProvices(countryId: number) {
    this.nypUserService.getProvince(countryId)
      .pipe(take(1)).subscribe(provinces => { this.provinces = provinces; });
  }

  getCity(state: State): void {
    if (!state) return;
    this.nypUserService.getCities(state.id)
      .pipe(take(1)).subscribe(cities => {
        this.cities = cities || [];
        this.form.get('register.cities')?.reset();
        this.form.get('register.cities')?.enable();
      });
  }

  async checkBusinessZipCode(formData: FormGroup) {
    const capField = formData.get('postCode');
    const insertedCap = capField?.value;
    const cityControl = formData.get('cities')?.value;
    const city = typeof cityControl === 'string'
      ? cityControl
      : cityControl?.text || cityControl?.name || cityControl?.description;
    const address = formData.value.address;

    if (!city || !address || !insertedCap) { return; }

    try {
      const zipCode: any = await this.zipCodeValidation(`${city},${address}`);
      const targetPostalCode = zipCode?.results?.[0]?.address_components?.find((component: any) =>
        component.types.includes('postal_code')
      );

      const expectedCap = targetPostalCode?.long_name;

      if (expectedCap && expectedCap !== insertedCap) {
        capField?.setErrors({ errorMessage: this.content?.register?.cap_error_message });
      } else {
        capField?.setErrors(null);
      }
    } catch (error) {
      console.error('Errore durante la validazione del CAP', error);
      capField?.setErrors({ errorMessage: 'Errore nella verifica del CAP' });
    }
  }

  async zipCodeValidation(address: string) {
    const options = {};
    const queryOptions = {
      address,
      key: this.API_KEY,
      language: 'it',
    };
    const API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const queryString = this.encodeQuery(queryOptions);
    const basePath = API_URL + queryString;

    return this.httpClient
      .get(basePath, options)
      .toPromise()
      .then((response: any) => { return response; })
      .catch((err: any) => {
        console.log('zipCodeValidationError', err);
      });
  }

  encodeQuery(data: any) {
    let ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
  }

  sanitizeLineBreaks(text?: string): string {
    return text?.replace(/&lt;\/?br&gt;/gi, '<br>');
  }

  onPostCodeBlur() {
    this.checkBusinessZipCode(this.form.get('register') as FormGroup);
  }

  togglePasswordVisibility(field: 'login ' | 'new' | 'confirm') {
    this.showPassword[field] = !this.showPassword[field];
  }

  onSubmit(): void {
    const option = this.form.get('accountOption')?.value;
    if (option === 'login') {
      this.login();
    } else if (option === 'register') {
      this.register();
    }
  }

  login() {
    this.wrongCredentials = false;
    const loginGroup = this.form.get('login') as FormGroup;
    const credentials = {
      user: {
        ndg_code: loginGroup.get('email')?.value,
        password: loginGroup.get('password')?.value
      }
    };

    this.auth.ndgLogin(credentials)
      .pipe(
        mergeMap(() => this.insuranceService.getProducts()),
        map(res => res.products),
        tap(products => this.dataService.products = products),
        tap(products => {
          const y = this.dataService.Yin;
          if (!!y) {
            this.dataService.setProduct(products.find(p => p.product_code == y.product));
          }
        })
      )
      .subscribe(
        () => {
          this.setNypUserData(credentials.user);
          this.nypDataService.CurrentState$.next('address'); },
        (error) => {
          if (error.status === 403) {
            this.forgotPassword();
          } else {
            this.wrongCredentials = true;
          }
        }
      );
  }

  setNypUserData(credentials: any){
    const user: object = {username: credentials.ndg_code, password: credentials.password};
    this.auth.nypLogin(user).subscribe((data): void => {
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      this.getUser().then();
      }
    });
  }

  public getUser(): Promise<any> {
    return new Promise((): void => {
      this.auth.getNypUser().subscribe({
        next: (data): void => {
        localStorage.setItem('userData', JSON.stringify(data));
        },
      });
    });
  }

  register() {
    const registerForm = this.form.get('register') as FormGroup;
    const payload = this.buildPayloadForm(registerForm.controls);
    this.registrationError = null;
    this.nypIadTokenService.registration(payload)
      .pipe(
        take(1),
        catchError(err => {
          if (err.status === 409) {
            this.registrationError = this.content?.register?.account_create_error;
          } else {
            this.registrationError = 'Errore durante la registrazione. Riprova più tardi.';
          }
          return of(null);
        })
      )
      .subscribe(res => {
        if (res) {
          this.registrationSuccess = true;
        }
      });
  }

  private buildPayloadForm(formControls: { [key: string]: AbstractControl }): any {
    const getValue = (key: string) => formControls[key]?.value ?? '';
    const orderCode   = this.nypDataService.Order$.value.orderCode;
    const productCode = this.nypDataService.CurrentProduct$.value.code;
    return {
      legalForm:true,
      company: getValue('company'),
      vatcode: getValue('vat'),
      country: formControls['countries']?.value?.name ?? '',
      state: formControls['provinces']?.value?.name ?? '',
      state_abbr: formControls['provinces']?.value?.abbr ?? '',
      city: formControls['cities']?.value?.name ?? '',
      street: getValue('address'),
      showExtra: formControls['showExtra']?.value,
      cap: getValue('postCode'),
      name: getValue('name'),
      surname: getValue('surname'),
      tax_code: getValue('tax_code'),
      vatTaxDifference:formControls['showtaxcode_mismatched']?.value,
      taxcode_mismatched: getValue('taxcode_mismatched'),
      email: getValue('email'),
      password: getValue('password'),
      userAcceptances: [
        { tag: 'marketingConsent', value: formControls['marketingConsent']?.value },
        { tag: 'communicationConsent', value: formControls['communicationConsent']?.value }
      ],
      data: JSON.stringify([
        { key: 'product_code', value: productCode },
        { key: 'order', value: orderCode }
      ])
    };
  }

  forgotPassword() {
    this.modalService.open(ForgotPasswordNdgModalComponent, { centered: true, windowClass: 'tim-modal-window' })
  }

  onAccountSelection(option: string) {
    this.form.get('accountOption')?.setValue(option);
  }

  onLogin(): void {
    this.registrationSuccess = false;
    this.form.get('accountOption')?.setValue('login');
  }

  handlePrevStep(): void {
    this.nypDataService.CurrentState$.next('insurance-info');
    this.checkoutService.InsuranceInfoState$.next('insuranceData');
  }

  getCheckedStyle(id: string): boolean {
    const el= document.getElementById(id) as HTMLInputElement;
    return el?.checked;
  }

  customCompare(o1, o2) { return o1?.id === o2?.id; }

  setPrivateArea() {
    this.natCatUtilsService.setNypPrivateArea(true);
  }
}

