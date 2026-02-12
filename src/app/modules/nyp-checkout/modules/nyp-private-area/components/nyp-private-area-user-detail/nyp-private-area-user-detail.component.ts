import { NypIadCustomerService, NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, Country, State, User } from '@model';
import { AuthService, DataService } from '@services';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, concat } from 'rxjs';
import { take, tap, toArray } from 'rxjs/operators';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';

@Component({
  selector: 'app-nyp-private-area-user-detail',
  templateUrl: './nyp-private-area-user-detail.component.html',
  styleUrls: ['./nyp-private-area-user-detail.component.scss']
})
export class NypPrivateAreaUserDetailComponent implements OnInit {

  public isMobile: boolean = window.innerWidth < 768;
  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
  }

  countries: Array<Country> = [];
  birthStates: Array<State> = [];
  birthCities: Array<City> = [];
  residentialStates: Array<State> = [];
  residentialCities: Array<City> = [];
  userAcceptances: { tag: string, value: boolean }[] = [];

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
    // private apiService: TimMyPetApiService,
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
      take(1),
    ).subscribe(() => {
      this.form = this.formBuilder.group(this.fromModelToView(this.authService.loggedUser));
      this.startingUser = this.fromViewToModel();

      ['birthCountry', 'birthState', 'birthCity', 'residentialCountry', 'residentialState', 'residentialCity',
        this.form.controls['fiscalCode'].value ? 'fiscalCode' : undefined,
        this.form.controls['birthDate'].value ? 'birthDate' : undefined,
        //this.form.controls['email'].value ? 'email' : undefined,
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
      if (this.getFieldError(formControlName, 'required')) {
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
      phoneNumber: [user?.address?.phone, [Validators.required]],
      birthDate: [`${dateOfBirth[0]?.padStart(2, '0')}-${dateOfBirth[1]?.padStart(2, '0')}-${dateOfBirth[2]?.padStart(2, '0')}`, [Validators.required]],
      birthCountry: [user?.address?.birth_country, [Validators.required]],
      birthState: [user?.address?.birth_state, [Validators.required]],
      birthCity: [user?.address?.birth_city, [Validators.required]],
      residentialAddress: [user?.address?.address1, [Validators.required]],
      residentialState: [user?.address?.state, [Validators.required]],
      residentialCountry: [user?.address?.country, [Validators.required]],
      residentialCity: [{ name: user?.address?.city, id: user?.address?.city_id }, [Validators.required]],
      postCode: [user?.address?.zipcode, [Validators.required]],
      email: [user?.email, [Validators.required]],
    };
  }

  updateUser() {
    this.endUser = this.fromViewToModel();
    concat(
      ...[
        this.hasChanged() ? this.nypIadCustomerService.editCustomerUserDetails({ data: this.endUser }) : undefined,
        //this.apiService.putOrder({ anagState: 'Draft' })
      ].filter(v => !!v)
    ).subscribe();
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
      street: this.form.controls['residentialAddress'].value, //string
      zip_code: this.form.controls['postCode'].value, //string
      city: this.form.controls['residentialCity'].value?.name, //string
      city_id: this.form.controls['residentialCity'].value?.id, //number
      country: this.form.controls['residentialCountry'].value?.name, //string
      country_id: this.form.controls['residentialCountry'].value?.id, //number
      state: this.form.controls['residentialState'].value?.name, //string
      state_id: this.form.controls['residentialState'].value?.id, //number
      state_abbr: this.form.controls['residentialState'].value?.abbr,//string
      //gender: null, //string
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
      userAcceptances: this.userAcceptances,
      //username: null, //string
    };
  }

}
