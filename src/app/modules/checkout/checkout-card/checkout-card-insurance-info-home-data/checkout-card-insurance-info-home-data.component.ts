import { CheckoutService } from './../../../../core/services/checkout.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { City, Country, HomeAttributes } from '@model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService, InsurancesService, UserService, } from '@services';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import JsonData from '../../../../../assets/mock/elenchi_razze_e_dati_assicurativi.json';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-card-insurance-info-home-data',
  templateUrl: './checkout-card-insurance-info-home-data.component.html',
  styleUrls: ['./checkout-card-insurance-info-home-data.component.scss'],
})
export class CheckoutCardInsuranceInfoHomeDataComponent implements OnInit {
  maxDateBirthdayContractor: NgbDate = TimeHelper.fromDateToNgbDate(
    moment().toDate()
  );
  minDateBirthdayContractor: NgbDate = TimeHelper.fromDateToNgbDate(
    moment().subtract(120, 'y').toDate()
  );
  @Input() addons: any;
  @Input() product: any;
  @Output() homeDataInfoSubmit = new EventEmitter<any>();
  @Output() showOptinalWarrantiesEmit = new EventEmitter<any>();

  form: FormGroup;
  FormGroup: any;
  states: any;
  user: any;
  petInput: Boolean = false;
  buildingType = [];
  petsList = [];
  houseFloor = [];
  buildingFloorNumber = this.houseFloor;
  countries: Country[];
  residentialCities: City[];
  insuranceAmount = [];
  petsForm: FormArray;
  rcCane;

  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService,
    protected nypUserService: NypUserService,
    private authService: AuthService,
    public dataService: DataService,
    private infoComponent: CheckoutStepInsuranceInfoComponent,
    private checkoutService: CheckoutService
  ) {
  }

  ngOnInit() {
    this.user = this.authService.loggedUser;
    this.getStates();
    this.buildingType = JsonData.tipologia_fabbricato;
    this.houseFloor = JsonData.numero_piano_abitazione;
    this.buildingFloorNumber = JsonData.numero_piano_fabbricato;
    this.petsList = JsonData.razze_assicurabili;
    this.form = this.formBuilder.group({
      address: [null, Validators.required],
      postalCode: [null, Validators.required],
      province: [null, Validators.required],
      city: [{ value: null, disabled: true }, Validators.required],
      buildingType: [null, Validators.required],
      houseFloor: [null, Validators.required],
      buildingFloorNumber: [null, Validators.required],
      pets: this.formBuilder.array([]),
    });
    this.addPatternValidatorsPostalCode();
    this.insuranceAmount = [
      1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500,
      7000, 7500, 8000, 8500, 9000, 9500, 10000,
    ];
    this.rcCane = this.addons.find(
      (addon) => addon.code.toLowerCase() === 'rc cane'
    );

    if (this.rcCane.selezionata) {
      this.addPetInArrayForm(this.rcCane.numPet);
    }
  }
  getCountries() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe((countries) => {
      this.dataService.setCountries(countries);
      this.countries = countries;
    });
  }
  addPatternValidatorsPostalCode() {
    if (this.dataService.tenantInfo.tenant === 'chebanca_db') {
      this.form.get('postalCode').addValidators([Validators.pattern('[(+).0-9\ ]*')]);
    }
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

  petSelection(event) {
    if (event === 'ALTRO') {
      this.form.controls.animalBreed.reset();
      this.petInput = true;
    }
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

  fromViewToModel(form: FormGroup): HomeAttributes {
    throw new Error('Method not implemented.');
  }

  secureHouseLocation(home) {
    const addFurtoInc = this.checkoutService
      .getAddonsStepInsuranceInfo()
      .find((add) => add.code === 'HOME Furto e rapina');
    if (addFurtoInc) {
      home.secure_location = addFurtoInc.homeProtected;
    }
  }

  fromFormGroupToInsuredSubject(group: FormGroup): any {
    const infoHomeData = {
      home: {
        usage: this.product.order.line_items[0].insured_entities.house.usage,
        address: group.controls.address.value,
        zipcode: group.controls.postalCode.value,
        state_id: Number(group.controls.province.value),
        city: group.controls.city.value,
        building_type: group.controls.buildingType.value,
        building_floors: group.controls.buildingFloorNumber.value,
        flat_floor: group.controls.houseFloor.value,
        id: this.product.order.line_items[0].insured_entities.house.id,
      },
      pets: this.getPetsData(),
    };

    this.secureHouseLocation(infoHomeData.home);
    return infoHomeData;
  }

  submit() {
    this.homeDataInfoSubmit.emit(this.fromFormGroupToInsuredSubject(this.form));
    this.infoComponent.handleNextStep();
  }

  showOptinalWarranties() {
    this.showOptinalWarrantiesEmit.emit();
  }

  addPetInArrayForm(quantity: number): void {
    this.petsForm = this.form.controls.pets as FormArray;
    for (let i = 0; i < quantity; i++) {
      this.petsForm.push(this.createPetFromArray());
    }
  }

  createPetFromArray(): FormGroup {
    return this.formBuilder.group({
      animalBreed: [null, Validators.required],
      petName: [null, Validators.required],
      petBirthday: [null, Validators.required],
    });
  }

  getPetsData() {
    if (this.petsForm) {
      const petArray = [];
      this.petsForm.controls.forEach((pet) => {
        const dateFromForm = pet.get('petBirthday').value;
        const date =
          dateFromForm.year + '-' + dateFromForm.month + '-' + dateFromForm.day;
        petArray.push({
          birth_date: date,
          kind: 'dog',
          name: pet.get('petName').value,
          breed: pet.get('animalBreed').value,
        });
      });
      return petArray;
    } else {
      return null;
    }
  }
}
