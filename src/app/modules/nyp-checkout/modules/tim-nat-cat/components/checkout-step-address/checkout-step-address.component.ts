import { NypIadCustomerService, NypUserService } from '@NYP/ngx-multitenant-core';
import { ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { City, Country, LegalRap, State, User } from '@model';
import { AuthService, DataService } from '@services';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, Subject, concat, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, take, takeUntil, tap, toArray } from 'rxjs/operators';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { TimNatCatCheckoutService } from '../../services/checkout.service';
import { TimNatCatService } from '../../services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http'

export enum FormSection {
  company_data = 'company_data',
  legal_rap_data = 'legal_rap_data',
  contact_data = 'contact_data'
}

export enum CountryStateCity {
  legal_country = 'legal_state',
  legal_state = 'legal_city',
  residence_country = 'residence_state',
  residence_state = 'residence_city'
}


@Component({
  selector: "app-checkout-step-address",
  templateUrl: "./checkout-step-address.component.html",
  styleUrls: [
    "./checkout-step-address.component.scss",
    "../../../../styles/checkout-forms.scss",
    "../../../../styles/size.scss",
    "../../../../styles/colors.scss",
    "../../../../styles/text.scss",
    "../../../../styles/common.scss",
  ],
})
export class CheckoutStepAddressComponent implements OnInit, OnDestroy {
  onWindowResize(event): void { this.isMobile = event.target.innerWidth < 768; }
  public isMobile: boolean = window.innerWidth < 768;
  @HostListener("window:resize", ["$event"])
  @Input("state")
  public state: CheckoutStates;
  @ViewChild("innerhide") public HIDE;
  private destroy$ = new Subject<void>();

  titleStates: CheckoutStates[] = ["insurance-info", "survey", "consensuses"];
  countries: Array<Country> = [];
  legalStates: Array<State> = [];
  legalCities: Array<City> = [];
  residentialStates: Array<State> = [];
  residentialCities: Array<City> = [];
  form: FormGroup;
  startingUser: User;
  kenticoContent: any;
  sectionList: any[] = [];
  public isIndividual = false;
  public isVatDiff = false;


  addressStructure: any = {
    form_section: {
      company_data: {
        title: "",
        input_fields: [
          {
            label: "company_name",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "vatcode",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "legal_country",
            type: "select",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "legal_state",
            type: "select",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "legal_city",
            type: "select",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "legal_zipcode",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "legal_address",
            type: "text",
            error: "",
            class: "col-12",
            required: true
          },
          // {
          //   label: "sdicode",
          //   type: "text",
          //   error: "",
          //   class: "col-6",
          //   required: false
          // },
          {
            label: "individual_firm",
            type: "checkbox",
            error: "",
            class: "col-12",
            required: false
          },
          {
            label: "legal_firstname",
            type: "text",
            error: "",
            class: "col-6",
            required: false
          },
          {
            label: "legal_lastname",
            type: "text",
            error: "",
            class: "col-6",
            required: false
          },
          {
            label: "legal_taxcode",
            type: "text",
            error: "",
            class: "col-6",
            required: false
          },
          {
            label: "vattaxdifference",
            type: "checkbox",
            error: "",
            class: "col-12",
            required: false
          },
          {
            label: "difference_taxcode",
            type: "text",
            error: "",
            class: "col-12",
            required: false
          },
        ],
      },
      legal_rap_data: {
        title: "",
        input_fields: [
          {
            label: "lastname",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "firstname",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "taxcode",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "contractor_email",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "residence_country",
            type: "select",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "residence_state",
            type: "select",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "residence_city",
            type: "select",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "zipcode",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "residence_address",
            type: "text",
            error: "",
            class: "col-12",
            required: true
          },
        ],
      },
      contact_data: {
        title: "",
        input_fields: [
          {
            label: "certified_email",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
          {
            label: "phone",
            type: "text",
            error: "",
            class: "col-6",
            required: true
          },
        ],
      },
    },
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private nypUserService: NypUserService,
    private nypIadCustomerService: NypIadCustomerService,
    private dataService: DataService,
    public nypDataService: NypDataService,
    public timNatCatCheckoutService: TimNatCatCheckoutService,
    private kenticoTranslateService: KenticoTranslateService,
    private checkoutService: TimNatCatCheckoutService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user: any) => {
      this.startingUser = user;
      if (this.startingUser.data) {
        this.buildForm();
        this.additionalOperations();
      }
    });
    this.setSectionList();
  }

  // COMMENTED TO TRY FIX FOR YDT-5144
  // private getPostalCodes(city: string, state?: string, country = 'Italy'): Observable<string[]> {
  //   const address = [city, state, country].filter(x => x).join(', ');
  //   console.log('indirizzo per google maps', address);
  //   const params = new HttpParams()
  //     .set('address', address)
  //     .set('key', 'AIzaSyBexfHEd_JaLQtrPLZjcpKoUDzo1EaXN9o');

  //   return this.http.get<{ results: any[] }>('https://maps.googleapis.com/maps/api/geocode/json', { params })
  //     .pipe(
  //       map(resp => {
  //         const allComponents = resp.results
  //           .map(r => r.address_components)
  //           .reduce((acc, comps) => acc.concat(comps), []);
  //         console.log('components from google maps', allComponents);
  //         return allComponents
  //           .filter(c => c.types.includes('postal_code'))
  //           .map(c => c.long_name)
  //           .filter((zip, i, arr) => arr.indexOf(zip) === i);
  //       }),
  //       catchError((err) => of([err]))
  //     );
  // }

  // COMMENTED TO TRY FIX FOR YDT-5144
  // private postalCodeValidator(): AsyncValidatorFn {
  //   return (control: AbstractControl) => {
  //     const parent = control.parent;
  //     if (!parent) return of(null);
  //     const cityCtrl = parent.get('residence_city');
  //     const stateCtrl = parent.get('residence_state');
  //     const city = cityCtrl?.value?.name;
  //     const state = stateCtrl?.value?.name;

  //     if (!city) return of(null);

  //     return this.getPostalCodes(city, state).pipe(
  //       map(zips => {
  //         console.log(control.value, 'constollo su cap se ha gli 0 oppure no', zips);
  //         return zips.includes(control.value) ? null : { invalidZipForCity: true };
  //       }),
  //       catchError(() => of(null)),
  //       take(1)
  //     );
  //   };
  // }

    // COMMENTED TO TRY FIX FOR YDT-5144
  // private validatePostalCode(zip: string, city?: string, state?: string, countryCode: string = 'IT'): Observable<boolean> {
  //   if (!zip || zip.length !== 5) return of(true);
  //   const params = new HttpParams()
  //     .set('components', `postal_code:${zip}|country:${countryCode}`)
  //     .set('language', 'it')
  //     .set('key', 'AIzaSyBexfHEd_JaLQtrPLZjcpKoUDzo1EaXN9o');

  //   return this.http.get<{ results: any[] }>('https://maps.googleapis.com/maps/api/geocode/json', { params }).pipe(
  //     map(resp => {
  //       const results = resp?.results || [];
  //       if (!results.length) return true;
  //       const names = new Set<string>();
  //       results.forEach(r => {
  //         (r.address_components || []).forEach(ac => {
  //           const types = ac.types || [];
  //           if (
  //             types.includes('locality') ||
  //             types.includes('postal_town') ||
  //             types.includes('administrative_area_level_3') ||
  //             types.includes('administrative_area_level_2')
  //           ) {
  //             names.add((ac.long_name || '').toLowerCase());
  //           }
  //         });
  //       });
  //       const norm = (s?: string) => (s || '').toLowerCase();
  //       const cityOk = city ? Array.from(names).some(n => n.includes(norm(city)) || norm(city).includes(n)) : true;
  //       const stateOk = state ? Array.from(names).some(n => n.includes(norm(state)) || norm(state).includes(n)) : true;
  //       return cityOk || stateOk;
  //     }),
  //     catchError(() => of(true))
  //   );
  // }
  // private isFakeZip(zip: string): boolean {
  //   // Lista di CAP fittizi comuni. Puoi estendere questa lista.
  //   const badCaps = [
  //     '00000', '11111', '22222', '33333', '44444',
  //     '55555', '66666', '77777', '88888', '99999'
  //   ];
  //   return badCaps.includes(zip);
  // }

  // COMMENTED TO TRY FIX FOR YDT-5144
// private postalCodeValidatorFor(scope: 'residence' | 'legal'): AsyncValidatorFn {
//   return (control: AbstractControl): Observable<ValidationErrors | null> => {
//     const zip: string = (control.value || '').toString();
//     if (!zip || zip.length !== 5 || !/^[0-9]{5}$/.test(zip)) return of(null);
//     if (this.isFakeZip(zip)) {
//       return of({ invalidFakeZip: true });
//     }
//     const city = this.form?.get(scope === 'residence' ? 'residence_city' : 'legal_city')?.value?.name;
//     const state = this.form?.get(scope === 'residence' ? 'residence_state' : 'legal_state')?.value?.name;

//     return this.getPostalCodes(city, state).pipe(
//       map(zips => {
//         if (Array.isArray(zips) && zips.length > 0) {
//           return zips.includes(zip) ? null : { invalidZipForCity: true };
//         }
//         return null;
//       }),
//       catchError(() => of(null)),
//       take(1)
//     );
//   };
// }


  private enforceZipSanitization(controlName: 'zipcode' | 'legal_zipcode') {
    const ctrl = this.form.get(controlName);
    if (!ctrl) return;
    ctrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      const sanitized = (val ?? '').toString().replace(/\D/g, '').slice(0, 5);
      if (sanitized !== val) {
        ctrl.setValue(sanitized, { emitEvent: false });
      }
    });
  }

  additionalOperations() {
    this.getCountry(this.dataService.countriesEndpoint).pipe(take(1))
      .subscribe(countries => {
        const italy = countries.find(c => c.name === 'Italia');
        if (italy) {
          this.countries = [italy];
        } else {
          console.warn('Paese Italia non trovato');
        }
        const foundCountry = this.findValue(this.countries, this.startingUser?.data?.country);
        if (foundCountry) {
          this.form.get("legal_country")?.patchValue(foundCountry);
          this.form.get("legal_country")?.updateValueAndValidity();
        }
        if (this.startingUser?.data.legalRepresentativeInfo.length > 0) {
          const foundResidenceCountry = this.findValue(this.countries, this.startingUser?.data.legalRepresentativeInfo[0]?.country);
          if (foundResidenceCountry) {
            this.form.get("residence_country")?.patchValue(foundResidenceCountry);
            this.form.get("residence_country")?.updateValueAndValidity();
          }
        }
        if (foundCountry) {
          this.getState(this.form.controls["legal_country"].value.id, "legal").subscribe();
        } else {
          this.form.controls["legal_country"].enable();
        }
        if (this.form.controls["residence_country"].value?.id) {
          this.getState(this.form.controls["residence_country"].value.id, "residential").subscribe();
        }
        this.form.controls["residence_country"].enable();
      });
  }

  findValue(list: any[], value: any) {
    return list.find((el) => el?.name?.toLowerCase() === value?.toLowerCase());
  }

  setSectionList(): void {
    this.kenticoTranslateService
      .getItem<any>("step_contractor")
      .pipe(take(1))
      .subscribe((item) => {
        this.kenticoContent = item;
        Object.keys(this.kenticoContent.form_section).forEach(
          (section: any) => {
            if (Object.keys(FormSection).includes(section)) {
              const sectionObj = {
                title: this.kenticoContent.form_section[section].title.value,
                inputFields: this.setInputFields(this.kenticoContent.form_section[section], section)
              };
              this.sectionList.push(sectionObj);
            }
          }
        );
      });
  }

  setInputFields(section, sectionName): any[] {
    const inputFields: any[] = [];
    Object.keys(section.input_fields).forEach((field: any) => {
      if (
        typeof section === "object" &&
        section !== null &&
        section.input_fields[field].hasOwnProperty("label")
      ) {
        Object.keys(this.addressStructure.form_section).forEach(
          (strSection) => {
            if (strSection === sectionName) {
              const matchingField = this.addressStructure.form_section[
                strSection
              ].input_fields.find((el) => el.label === field);
              const tempObj: any = {
                label: section.input_fields[field].label.value,
                id: field,
                error: section.input_fields[field]?.error?.value,
                type: matchingField?.type,
                class: matchingField?.class,
                required: matchingField?.required,
              };
              inputFields.push(tempObj);
            }
          }
        );
      }
    });
    return inputFields;
  }

  buildForm(): void {
    const modelData = this.fromModelToView(this.startingUser?.data);
    let group: any = {};
    Object.keys(this.addressStructure.form_section).forEach((section) => {
      this.addressStructure?.form_section[section]?.input_fields?.forEach((field) => {
        if (modelData[field.label]) {
          group[field.label] = modelData[field.label];
        } else {
          const validators = [];
          if (field.required) validators.push(Validators.required);
          if (field.label === 'contractor_email') {
            validators.push(Validators.email);
          }
          group[field.label] = [null, validators];
        }
      });
    });

    if (modelData.legalRepresentativeInfo && modelData.legalRepresentativeInfo.length) {
      const firstRep = modelData.legalRepresentativeInfo[0];
      Object.keys(firstRep).forEach(rapKey => {
        group[rapKey] = firstRep[rapKey];
      });
    }
    this.form = this.fb.group(group);
    this.initConditionalFields();
    const zipCtrl = this.form.get('zipcode')!;
    // zipCtrl.setAsyncValidators(this.postalCodeValidator());
    const legalZipCtrl = this.form.get('legal_zipcode')!;
    this.enforceZipSanitization('zipcode');
    this.enforceZipSanitization('legal_zipcode');
    // zipCtrl.setAsyncValidators(this.postalCodeValidatorFor('residence'));
    // legalZipCtrl.setAsyncValidators(this.postalCodeValidatorFor('legal'));

    zipCtrl.updateValueAndValidity();
    legalZipCtrl.updateValueAndValidity();

    this.form.get('residence_city')!.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        zipCtrl.updateValueAndValidity();
      });

    this.form.get('residence_state')!.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        zipCtrl.updateValueAndValidity();
      });

    this.form.get('legal_city')!.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        legalZipCtrl.updateValueAndValidity();
      });

    this.form.get('legal_state')!.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        legalZipCtrl.updateValueAndValidity();
      });

    if (this.form) {
      const modelData = this.fromModelToView(this.startingUser?.data);
      Object.keys(modelData).forEach((key) => {
        if (this.form.contains(key)) {
          this.form.get(key)?.patchValue(modelData[key][0]);
        } else if (key === "legalRepresentativeInfo") {
          modelData.legalRepresentativeInfo.forEach(legalRap => {
            Object.keys(legalRap).forEach((rapKey) => {
              this.form.get(rapKey)?.patchValue(legalRap[rapKey][0]);
            });
          });
        }
      });
      this.form.updateValueAndValidity();
    }
  }

  getCountry(id: string): Observable<Country[]> {
    return this.nypUserService.getCountries(id);
  }

  getCity(id: number, destination: "legal" | "residential" | "all"): Observable<City[]> {
    return this.nypUserService.getCities(id).pipe(
      tap((cities) => {
        if (destination == "legal" || destination == "all") {
          this.legalCities = cities;
          const foundCity = this.findValue(this.legalCities, this.startingUser?.data?.city);
          if (foundCity) {
            this.form.get("legal_city")?.patchValue(foundCity);
            this.form.get("legal_city")?.updateValueAndValidity();
          }
          if (!this.form.controls["legal_city"].value)
            this.form.controls["legal_city"].enable();
        }
        if (destination == "residential" || destination == "all") {
          this.residentialCities = cities;
          if (this.startingUser?.data.legalRepresentativeInfo.length > 0) {
            const foundResidenceCity = this.findValue(this.residentialCities, this.startingUser?.data.legalRepresentativeInfo[0]?.city);
            if (foundResidenceCity) {
              this.form.get("residence_city")?.patchValue(foundResidenceCity);
              this.form.get("residence_city")?.updateValueAndValidity();
            }
          }
          this.form.controls["residence_city"].enable();
        }
      })
    );
  }

  getState(id: number, destination: "legal" | "residential" | "all"): Observable<State[]> {
    return this.nypUserService.getProvince(id).pipe(
      tap((states) => {
        if (destination == "legal" || destination == "all") {
          this.legalStates = states;
          const foundState = this.findValue(this.legalStates, this.startingUser?.data?.state);
          if (foundState) {
            this.form.get("legal_state")?.patchValue(foundState);
            this.form.get("legal_state")?.updateValueAndValidity();
          }
          const legalCountryValue = this.form.controls["legal_country"].value;
          if (
            destination == "legal" &&
            legalCountryValue?.name?.toLowerCase() !== "italia"
          ) {
            this.form.get("legal_state").disable();
            this.form.get("legal_city").disable();
          } else if (this.form.controls["legal_state"].value) {
            this.getCity(this.form.controls["legal_state"].value.id, "legal").subscribe();
          } else this.form.controls["legal_state"].enable();
        }
        if (destination == "residential" || destination == "all") {
          this.residentialStates = states;
          if (this.startingUser?.data.legalRepresentativeInfo.length > 0) {
            const foundResidenceState = this.findValue(this.residentialStates, this.startingUser?.data.legalRepresentativeInfo[0]?.state);
            if (foundResidenceState) {
              this.form.get("residence_state")?.patchValue(foundResidenceState);
              this.form.get("residence_state")?.updateValueAndValidity();
            }
          }
          this.form.controls["residence_state"].enable();
          if (this.form.controls["residence_state"].value) {
            this.getCity(this.form.controls["residence_state"].value.id, "residential").subscribe();
          }
        }
      })
    );
  }

  selectChanged(csc: { id: number }, fieldName: string) {
    const nextControlName = CountryStateCity[fieldName];
    if (!csc?.id || !nextControlName) return;
    this.form.get(nextControlName).patchValue(null);
    this.form.get(nextControlName).disable();
    const destination = nextControlName.toLowerCase().includes("legal") ? "legal" : "residential";
    if (nextControlName.toLowerCase().includes("state")) {
      this.getState(csc.id, destination).subscribe();
    } else if (nextControlName.toLowerCase().includes("city")) {
      if (destination == "residential")
        this.getCity(csc.id, destination).subscribe();
      else this.getCity(csc.id, destination).subscribe();
    }
  }

  getFieldInvalidError(formControlName: string): boolean {
    return (
      this.form.get(formControlName)?.invalid &&
      (this.form.get(formControlName)?.touched ||
        this.form.get(formControlName)?.dirty)
    );
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (
        this.getFieldError(formControlName, "required") ||
        this.getFieldError(formControlName, "minlength") ||
        this.getFieldError(formControlName, "maxlength") ||
        this.getFieldError(formControlName, "pattern") ||
        this.getFieldError(formControlName, "email") ||
        this.getFieldError(formControlName, "invalidZipForCity")
      ) {
        return "error-field";
      }
      if (this.getFieldError(formControlName, "pattern")) {
        return "warning-field";
      }
    }
  }

  customCompare(
    o1: { id: any; name: string },
    o2: { id: any; name: string }
  ): boolean {
    return o1?.id === o2?.id;
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return (
      this.form.get(formControlName)?.errors &&
      this.form.get(formControlName)?.errors[errorType]
    );
  }

  fromModelToView(user: any): { [key: string]: any } {
    return {
      company_name: [user?.company, []],
      vatcode: [user?.vatcode, []],
      legal_country: [user?.country, [Validators.required]],
      legal_state: [user?.state, [Validators.required]],
      legal_city: [user?.city, [Validators.required]],
      legal_zipcode: [
        user?.registration_info?.cap,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5),
          Validators.pattern(/^[0-9]{5}$/),
        ]
      ],
      legal_address: [user?.street, [Validators.required]],
      // sdicode: [user?.sdiCode, []],
      individual_firm: [!!user?.individualFirm, []],
      legal_firstname: [user?.name],
      legal_lastname: [user?.surname],
      legal_taxcode: [user?.name && user?.surname && user?.tax_code ? user?.tax_code : null, [Validators.pattern("^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$")]],
      vattaxdifference: [!!user?.vatTaxDifference, []],
      difference_taxcode: [user?.registration_info?.taxcode_mismatched ? user?.registration_info?.taxcode_mismatched : null, [Validators.pattern("^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$")]],
      certified_email: [user?.certifiedMail, [Validators.required, Validators.email]],
      phone: [user?.primary_phone, [Validators.required, Validators.pattern(/^\+[0-9]{1,3}[0-9]{6,12}$/)]],
      legalRepresentativeInfo: this.loadLegalRapInfo(user)
    };
  }

  loadLegalRapInfo(userData: any): LegalRap[] {
    const tempList: any[] = [];
    userData?.legalRepresentativeInfo?.forEach((el: any) => {
      const tempEl = {
        lastname: [el?.lastname || null, Validators.required],
        firstname: [el?.firstname || null, Validators.required],
        taxcode: [el?.taxcode || null, [Validators.required, Validators.pattern("^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$")]],
        contractor_email: [el?.mail || null, [Validators.required, Validators.email]],
        residence_country: [el?.country || null, Validators.required],
        residence_state: [el?.state || null, Validators.required],
        residence_city: [el?.city || null, Validators.required],
        zipcode: [el?.zipcode || null, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5),
          Validators.pattern(/^[0-9]{5}$/),
        ],
        ],
        residence_address: [el?.street || null, Validators.required],
      };
      tempList.push(tempEl);
    });
    return tempList;
  }

  updateUser() {
    concat(...[this.hasChanged() ? this.nypIadCustomerService.editCustomerUserDetails({ data: this.fromViewToModel(), }) : undefined,].filter((v) => !!v))
      .pipe(toArray(), take(1)).subscribe(() => { this.nypDataService.CurrentState$.next("survey"); });
  }

  hasChanged(): boolean {
    const user = this.fromViewToModel();
    return Object.entries(this.startingUser).some(([k, v]) => user[k] != v);
  }

  fromViewToModel(): any {
    const legalRapList: any[] = [];
    const tempRap = {
      lastname: this.form.controls["lastname"].value,
      firstname: this.form.controls["firstname"].value,
      taxcode: this.form.controls["taxcode"].value,
      country: this.form.controls["residence_country"].value.name,
      country_id: this.form.controls["residence_country"].value.id,
      city: this.form.controls["residence_city"].value.name,
      city_id: this.form.controls["residence_city"].value.id,
      state: this.form.controls["residence_state"].value.name,
      state_id: this.form.controls["residence_state"].value.id,
      state_abbr: this.form.controls["residence_state"].value.abbr,
      zipcode: this.form.controls["zipcode"].value,
      street: this.form.controls["residence_address"].value,
      mail: this.form.controls["contractor_email"].value,
    };
    legalRapList.push(tempRap);
    return {
      company: this.form.controls["company_name"].value,
      vatcode: this.form.controls["vatcode"].value,
      // sdiCode: this.form.controls["sdicode"].value,
      tax_code: this.form.controls["legal_taxcode"].value,
      country_id: this.form.controls["legal_country"].value?.id,
      country: this.form.controls["legal_country"].value?.name,
      state_id: this.form.controls["legal_state"].value?.id,
      state: this.form.controls["legal_state"].value?.name,
      state_abbr: this.form.controls["legal_state"].value?.abbr,
      city_id: this.form.controls["legal_city"].value?.id,
      city: this.form.controls["legal_city"].value?.name,
      street: this.form.controls["legal_address"].value,
      zip_code: this.form.controls["legal_zipcode"].value,
      certifiedMail: this.form.controls["certified_email"].value,
      primary_phone: this.form.controls["phone"].value,
      name: this.form.controls["legal_firstname"].value,
      surname: this.form.controls["legal_lastname"].value,
      vatTaxDifference: this.form.controls["vattaxdifference"].value,
      difference_taxcode: this.form.controls["difference_taxcode"].value,
      individualFirm: this.form.controls["individual_firm"].value,
      legalRepresentativeInfo: legalRapList,
    };
  }

  handlePrevStep(): void {
    this.nypDataService.CurrentState$.next('insurance-info');
    this.checkoutService.InsuranceInfoState$.next("insuranceData");
  }

  validateForm() {
    return this.form.valid;
  }

  private initConditionalFields() {
    const individualCtrl = this.form.get('individual_firm');
    const vatDiffCtrl = this.form.get('vattaxdifference');

    this.isIndividual = !!individualCtrl?.value;
    this.isVatDiff = !!vatDiffCtrl?.value;

    if (this.isIndividual) {
      this.form.get('legal_firstname')?.enable({ emitEvent: false });
      this.form.get('legal_lastname')?.enable({ emitEvent: false });
      this.form.get('legal_taxcode')?.enable({ emitEvent: false });
    } else {
      this.form.get('legal_firstname')?.reset(null, { emitEvent: false });
      this.form.get('legal_lastname')?.reset(null, { emitEvent: false });
      this.form.get('legal_firstname')?.disable({ emitEvent: false });
      this.form.get('legal_lastname')?.disable({ emitEvent: false });
      this.form.get('legal_taxcode')?.reset(null, { emitEvent: false });
      this.form.get('legal_taxcode')?.disable({ emitEvent: false });
    }

    if (this.isVatDiff) {
      this.form.get('difference_taxcode')?.enable({ emitEvent: false });
    } else {
      this.form.get('difference_taxcode')?.reset(null, { emitEvent: false });
      this.form.get('difference_taxcode')?.disable({ emitEvent: false });
    }

    individualCtrl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => {
      this.isIndividual = !!val;
      if (val) {
        this.form.get('legal_firstname')?.enable();
        this.form.get('legal_lastname')?.enable();
        this.form.get('legal_taxcode')?.enable();
      } else {
        this.form.get('legal_firstname')?.reset();
        this.form.get('legal_lastname')?.reset();
        this.form.get('legal_firstname')?.disable();
        this.form.get('legal_lastname')?.disable();
        this.form.get('legal_taxcode')?.reset();
        this.form.get('legal_taxcode')?.disable();
      }
      this.cd.detectChanges();
    });

    vatDiffCtrl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => {
      this.isVatDiff = !!val;
      if (val) {
        this.form.get('difference_taxcode')?.enable();
      } else {
        this.form.get('difference_taxcode')?.reset();
        this.form.get('difference_taxcode')?.disable();
      }
      this.cd.detectChanges();
    });
  }
}
