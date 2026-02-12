import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, Country, HomeAttributes, State, User } from '@model';
import { AuthService, CheckoutService, DataService, UserService } from '@services';
import { take } from 'rxjs/operators';
import { AddonCodes, MyHomeAddonContent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-tim-my-home/my-home-addon-content.interface';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { CheckoutProduct } from '../../checkout.model';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-card-insurance-info-tim-my-home-data',
  templateUrl: './checkout-card-insurance-info-tim-my-home-data.component.html',
  styleUrls: ['./checkout-card-insurance-info-tim-my-home-data.component.scss']
})
export class CheckoutCardInsuranceInfoTimMyHomeDataComponent implements OnInit {

  @Input() addons: MyHomeAddonContent[];
  @Input() ftthProcedure: boolean;
  @Input() product: CheckoutProduct;
  @Output() homeDataInfoSubmit = new EventEmitter<any>();
  @Output() showOptinalWarrantiesEmit = new EventEmitter<any>();

  form: FormGroup;
  states: State[];
  user: User;
  buildingType: string[] = [];
  ownerTypes: string[] = [];
  countries: Country[];
  residentialCities: City[];

  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService,
    protected nypUserService: NypUserService,
    private authService: AuthService,
    private dataService: DataService, // HERE
    private infoComponent: CheckoutStepInsuranceInfoComponent,
    private checkoutService: CheckoutService
  ) {
  }

  ngOnInit() {
    this.user = this.authService.loggedUser;
    this.getStates();
    this.buildingType =
      [
        "Cemento Armato",
        "Altro"
      ],
      this.ownerTypes =
      [
        "Proprietario",
        "Inquilino"
      ]
    this.form = this.formBuilder.group({
      province: [null, Validators.required],
      city: [{ value: null, disabled: true }, Validators.required],
      postalCode: [null, Validators.required],
      address: [null, Validators.required],
      civicNumber: [null, Validators.required],
      buildingType: [null, Validators.required],
      ownerType: [null, Validators.required]
    });
    this.compileFormFromCatnatData(this.form)
  }

  private compileFormFromCatnatData(form: FormGroup): void {
    const catnatAddon = this.getAddon(AddonCodes.ADDON_CATNAT)
    if (!!catnatAddon && catnatAddon.selezionata) {
      const houseData = catnatAddon.extraForm.formValue
      this.nypUserService.getCities(houseData.locationState.id).subscribe(cities => {
        this.residentialCities = cities
        this.setFormData(form, houseData)
      })
    }
  }

  private setFormData(form: FormGroup, data: { [key: string]: any }): void {
    form.get('province').setValue(data.locationState.id)
    form.get('province').disable()
    form.get('city').setValue(data.locationCity.name)
    form.get('city').disable()
    form.get('buildingType').setValue(data.constructionType)
    form.get('buildingType').disable()
  }

  private getAddon(code: AddonCodes): MyHomeAddonContent {
    return this.addons.find(addon =>
      addon.code === code
    )
  }

  fromFormGroupToInsuredSubject(group: FormGroup): any {
    const infoHomeData = {
      home: {
        address: group.controls.address.value,
        zipcode: String(group.controls.postalCode.value),
        state_id: Number(group.controls.province.value),
        city: group.controls.city.value,
        id: null,
        house_number: String(group.controls.civicNumber.value),
        construction_material: group.controls.buildingType.value,
        owner_type: group.controls.ownerType.value,
        price: this.dataService.timHomePrice,
        state_abbr: this.states.find(state => state.id == group.controls.province.value).abbr
      },
    };
    this.checkoutService.getAddonsStepInsuranceInfo();
    return infoHomeData;
  }

  getCountries() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe((countries) => {
      this.dataService.setCountries(countries);
      this.countries = countries;
    });
  }

  toggleEnable(event) {
    this.getResidentialCities(event);
    this.form.controls.city.enable();
  }

  getResidentialCities(cityId) {
    this.nypUserService.getCities(cityId).subscribe((cities) => {
      this.residentialCities = cities;
    });
  }

  getStates() {
    this.nypUserService
      .getProvince(110)
      .pipe(take(1))
      .subscribe((res) => {
        this.states = res;
      });
  }

  displayFieldCss(form: any, field: string) {
    return {
      'error-field': this.isFieldValid(form, field),
    };
  }

  isFieldValid(form: any, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  computeModel(): HomeAttributes {
    throw new Error('Method not implemented.');
  }

  fromViewToModel(): HomeAttributes {
    throw new Error('Method not implemented.');
  }

  submit() {
    this.homeDataInfoSubmit.emit(this.fromFormGroupToInsuredSubject(this.form));
    this.infoComponent.handleNextStep();
  }

  showOptinalWarranties() {
    this.showOptinalWarrantiesEmit.emit();
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required')) {
        return 'error-field'
      }
    }
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid &&
      (this.form.get(formControlName).touched || this.form.get(formControlName).dirty)
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType]
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
