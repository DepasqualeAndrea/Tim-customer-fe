import { NypUserService } from '@NYP/ngx-multitenant-core';
import { OnInit, Component, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Country, State, HouseAttributes, User, Address, City } from '@model';
import { UserService, AuthService, DataService } from '@services';
import { take } from 'rxjs/operators';



@Component({
    selector: 'app-checkout-card-house-address',
    templateUrl: './checkout-card-house-address.component.html',
    styleUrls: ['./checkout-card-house-address.component.scss'],
    standalone: false
})

export class CheckoutCardHouseAddressComponent implements OnInit {

  @Input() selectedCountry: Country;

  @Input() user: User;

  @Input() usage: string;

  @Input() fieldText: string;

  @Input() mandatoryFields = true;

  form: UntypedFormGroup;
  provinces: State[] = [];
  cities: City[] = [];
  provinceUserName = '';
  success = false;
  holidayDestinations = [];
  countries: Country[];
  countrie: Country;
  defaultCountrie: any;
  showImputText = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    protected nypUserService: NypUserService,
    protected dataService: DataService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      address: [this.user && this.user.address.address1 ? this.user.address.address1 : null, Validators.required],
      cap: [this.user && this.user.address.zipcode ? this.user.address.zipcode : null, Validators.required],
      city: [this.user && this.user.address.city ? this.user.address.city : null, Validators.required],
      province: [this.user && this.user.address.state ? this.user.address.state.id : null, Validators.required],
      country: ['', Validators.required]
    });
    this.setCountry();
    if (this.selectedCountry) {
      this.getProvices(this.selectedCountry.id);
      this.showImputText = this.selectedCountry.name !== 'Italia';
    }
  }


  setCountry() {
    if (this.selectedCountry) {
      this.form.controls.country.patchValue(this.selectedCountry.iso_name);
      this.form.controls.country.disable();
    } else if (this.user && this.user.address.country) {
      this.getProvices(this.user.address.country.id);
      this.provinceUserName = this.user.address.state.name;
      this.form.controls.country.patchValue(this.user.address.country.iso_name);
      this.form.controls.country.disable();
    } else {
      this.getCountries();
    }
  }

  getCountries() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint)
      .pipe(take(1))
      .subscribe(countries => {
        this.defaultCountrie = countries.find(countrie => countrie.iso_name === 'ITALIA');
        this.form.controls.country.patchValue(this.defaultCountrie.iso_name);
        this.form.controls.country.disable();
        this.getProvices(this.defaultCountrie.id);
      });
  }



  getProvices(countryId) {
    this.nypUserService.getProvince(countryId).pipe(take(1)).subscribe(states => {
      this.provinces = states;
    });
  }

  proviceIsSelected(event) {
    if (this.selectedCountry && this.selectedCountry.name === 'Italia') {
      this.nypUserService.getCities(event).pipe(take(1)).subscribe(cities => {
        this.cities = cities;
      });
    }
  }

  updateUser() {
    const updatedUser = Object.assign({}, this.user) as User;
    const updatedAddress = Object.assign({}, this.user.address) as Address;
    updatedAddress.address1 = this.form.controls.address.value;
    updatedAddress.city = this.form.controls.city.value;
    updatedAddress.state_id = +this.form.controls.province.value;
    updatedAddress.zipcode = this.form.controls.cap.value;
    updatedAddress.country_id = this.user.address.country ? this.user.address.country.id : this.defaultCountrie.id,
      updatedAddress.birth_country_id = this.user.address.birth_country.id;
    updatedAddress.birth_state_id = this.user.address.birth_state.id;
    updatedAddress.birth_city_id = this.user.address.birth_city.id;
    delete updatedAddress.country;
    delete updatedAddress.state;
    delete updatedAddress.birth_country;
    delete updatedAddress.birth_state;
    delete updatedAddress.birth_city;
    updatedUser.bill_address_attributes = updatedAddress;
    delete updatedUser.address;
    this.nypUserService.editUser(updatedUser).pipe(take(1)).subscribe(
      () => {
        this.success = true;
        this.authService.setCurrentUserFromLocalStorage();
      },
    );
  }

  userHasBeenUpdated() {
    const residentialCardRestults = this.computeAddress();
    return residentialCardRestults.address !== this.user.address.address1 ||
      residentialCardRestults.zipcode !== this.user.address.zipcode ||
      residentialCardRestults.city !== this.user.address.city ||
      residentialCardRestults.state_id !== (this.user.address.state_id || this.user.address.state.id);
  }

  computeAddress(): HouseAttributes {
    return {
      usage: this.usage,
      address: this.form.controls.address.value,
      zipcode: this.form.controls.cap.value,
      city: this.form.controls.city.value,
      state_id: +this.form.controls.province.value,
      country_id: this.selectedCountry ? this.selectedCountry.id : (this.user.address.country ? this.user.address.country.id : this.defaultCountrie.id)
    };
  }

}


