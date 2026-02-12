import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CheckoutInsuredShipment } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Country } from '@model';
import { DataService, UserService } from '@services';
import { ComponentFeaturesService } from '../../../../core/services/componentFeatures.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-card-insured-shipment',
  templateUrl: './checkout-card-insured-shipment.component.html',
  styleUrls: ['./checkout-card-insured-shipment.component.scss']
})
export class CheckoutCardInsuredShipmentComponent implements OnInit, OnChanges {

  @Input() numberOfShipments = 1;

  @Input() insuredShipments: CheckoutInsuredShipment[];

  @Input() shipmentIsContractor: boolean;

  @Input() hideInsuredIsContractorCheck: boolean;

  @Input() forcedInsuredIsContractorCheck: boolean;

  @Input() residentialData: boolean;
  @Input() residentialCountrySelectable = false;
  @Input() residentialCityWithSelect = false;

  @Input() personalExtraData: boolean;

  @Input() allFieldsRequired = true;

  @Input() productCode: string;

  formShipment: FormGroup;

  minBirthDate: NgbDateStruct;
  maxBirthDate: NgbDateStruct;
  countries: any;
  birthStates: any;
  birthCities: any;
  residentialCities: any;
  othersInsuranceSubject: boolean;
  residentialStates: any;
  residentialItalianCountry: Country;
  defaultCountry: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    protected nypUserService: NypUserService,
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    public calendar: NgbCalendar) {
  }

  ngOnInit() {
    this.formShipment = this.formBuilder.group({
      isShipmentContractor: new FormControl({ value: this.shipmentIsContractor, disabled: this.forcedInsuredIsContractorCheck }),
      insuredShipmentsFormArray: this.formBuilder.array(this.createShipments(
        this.numberOfShipments,
        this.shipmentIsContractor,
        this.insuredShipments,
        this.residentialData,
        this.residentialCountrySelectable,
        this.residentialCityWithSelect,
        this.personalExtraData,
      ))
    });
    this.getDefaultCountry();
    this.getCountries();
    if (this.residentialData && !this.residentialCountrySelectable) {
      this.getItalianResidentialStates();
    }
  }

  getFormSubjects(): FormArray {
    return this.formShipment.controls.insuredShipmentsFormArray as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.shipmentIsContractor && !changes.shipmentIsContractor.firstChange) ||
      (changes.numberOfShipments && !changes.numberOfShipments.firstChange) ||
      (changes.insuredShipments && !changes.insuredShipments.firstChange)) {
      this.formShipment.patchValue({ shipmentIsContractor: this.shipmentIsContractor });
      const insuredShipments: FormArray = <FormArray>this.formShipment.controls.insuredShipmentsFormArray;
      const ctrls: AbstractControl[] = this.createShipments(
        this.numberOfShipments,
        this.shipmentIsContractor,
        this.insuredShipments,
        this.residentialData,
        this.residentialCountrySelectable,
        this.residentialCityWithSelect,
        this.personalExtraData
      );
      this.cleanFormArray(insuredShipments);
      ctrls.forEach(ctrl => insuredShipments.push(ctrl));
    }
  }

  computeModel(): CheckoutInsuredShipment[] {
    return this.fromViewToModel(this.formShipment);
  }

  isContractorShipment(): boolean {
    return this.formShipment.controls.isShipmentContractor.value;
  }

  createShipments(numberOfShipments: number,
    shipmentIsContractor: boolean,
    insuredShipments: CheckoutInsuredShipment[],
    residentialData: boolean,
    residentialCountrySelectable: boolean,
    residentialCityWithSelect: boolean,
    personalExtraData: boolean): AbstractControl[] {
    const n = shipmentIsContractor ? numberOfShipments - 1 : numberOfShipments;
    insuredShipments = insuredShipments.filter(subj => !subj.isShipmentContractor);
    return new Array(n).fill(null).map((currentVal, index) => {
      return this.createInsuranceSubjectItem(
        insuredShipments && insuredShipments[index],
        residentialData,
        residentialCountrySelectable,
        residentialCityWithSelect,
        personalExtraData);
    });
  }

  handleContractorIsShipmentChange(): void {
    const array: FormArray = <FormArray>this.formShipment.controls.insuredShipmentsFormArray;
    if (!!this.formShipment.controls.isShipmentContractor.value) {
      this.othersInsuranceSubject = true;
      array.removeAt(array.length - 1);
    } else {
      this.othersInsuranceSubject = false;
      array.push(this.createInsuranceSubjectItem(null,
        this.residentialData,
        this.residentialCountrySelectable,
        this.residentialCityWithSelect,
        this.personalExtraData
      ));
    }
  }

  fromViewToModel(form: FormGroup): CheckoutInsuredShipment[] {
    const Shipments: FormArray = <FormArray>form.controls.insuredShipmentsFormArray;
    const transformed: CheckoutInsuredShipment[] = [];
    for (let i = 0; i < Shipments.length; i++) {
      transformed.push(this.fromFormGroupToInsuredSubject(<FormGroup>Shipments.at(i)));
    }
    return transformed;
  }

  fromFormGroupToInsuredSubject(group: FormGroup): CheckoutInsuredShipment {
    const shipment = {
      id: group.controls.id.value,
      firstName: group.controls.firstName.value,
      lastName: group.controls.lastName.value,
    };
    if (this.personalExtraData) {
      Object.assign(shipment, {
        phone: group.controls.phone.value,
        email: group.controls.email.value
      });
    }
    if (this.residentialData) {
      Object.assign(shipment, {
        residentialAddress: group.controls.residentialAddress.value,
        postCode: group.controls.postCode.value,
        residentialCity: this.residentialCityWithSelect ? group.controls.residentialCity.value && group.controls.residentialCity.value.name : group.controls.residentialCity.value,
        residentialState: this.residentialCityWithSelect || this.residentialCountrySelectable ? group.controls.residentialState.value && group.controls.residentialState.value.id : group.controls.residentialState.value,
        residentialCountry: this.residentialCountrySelectable ? group.controls.residentialCountry.value : this.residentialItalianCountry
      });
    }
    return shipment;
  }

  cleanFormArray(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  getCountries() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe(countries => {
      this.dataService.setCountries(countries);
      this.countries = countries;
    });
  }

  getDefaultCountry() {
    this.nypUserService.getDefaultCountry().subscribe(country => {
      this.defaultCountry = country;
    });
  }

  getResidentialStates(stateId, formGroup: FormGroup) {
    this.nypUserService.getProvince(stateId).subscribe(states => {
      formGroup.controls.residentialStates.patchValue(states);
    });
  }

  getResidentialCities(cityId, formGroup: FormGroup) {
    this.nypUserService.getCities(cityId).subscribe(cities => {
      cities.forEach(item => {
        if (item.name === formGroup.controls.residentialCity.value) {
          formGroup.controls.residentialCity.patchValue(item);
        }
      })
      formGroup.controls.residentialCities.patchValue(cities);
    });
  }

  getItalianResidentialStates() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint)
      .pipe(
        map<Country[], Country>(values =>
          values.find(country => country.iso3 === 'ITA')
        ),
        tap(italy => this.residentialItalianCountry = italy),
        switchMap(italy =>
          this.nypUserService.getProvince(italy.id)
        )
      )
      .subscribe(states => {
        this.residentialStates = states;
      });
  }

  toggleEnable(el, input, formGroup: any, keepValues?: boolean) {
    if (el && el.id) {
      if (!keepValues) {
        formGroup.get(input).patchValue(null);
      }
      formGroup.get(input).disable();
      if (input === 'residentialState') {
        if (!keepValues) {
          formGroup.get('residentialCity').patchValue(null);
        }
        if (this.residentialCityWithSelect) {
          formGroup.get('residentialCity').disable();
        }
        if (el.states_required === true) {
          formGroup.get('residentialCity').setValidators(Validators.required);
          formGroup.get(input).setValidators(Validators.required);
          formGroup.get(input).enable();
          this.getResidentialStates(el.id, formGroup);
        } else {
          formGroup.get('residentialCity').setValidators(null);
          formGroup.get(input).setValidators(null);
        }
      } else if (input === 'residentialCity') {
        if (el.cities_required === true) {
          formGroup.get(input).setValidators(Validators.required);
          formGroup.get(input).enable();
          if (this.residentialCityWithSelect) {
            this.getResidentialCities(el.id, formGroup);
          }
        } else {
          formGroup.get(input).setValidators(null);
        }
      }
    } else {
      formGroup.get(input).disable();
    }
  }

  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  private createInsuranceSubjectItem(insuranceShipment: CheckoutInsuredShipment,
    residentialData: boolean,
    residentialCountrySelectable: boolean,
    residentialCityWithSelect: boolean,
    personalExtraData: boolean) {
    const fg: FormGroup = new FormGroup({
      id: new FormControl(insuranceShipment && insuranceShipment.id || null),
      firstName: new FormControl(insuranceShipment && insuranceShipment.firstName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
      lastName: new FormControl(insuranceShipment && insuranceShipment.lastName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
    });

    if (personalExtraData) {
      fg.addControl('email', new FormControl(insuranceShipment && insuranceShipment.email, [Validators.required, Validators.email]));
      fg.addControl('phone', new FormControl(insuranceShipment && insuranceShipment.phone, [Validators.required, Validators.pattern('[(+).0-9\ ]*')]));
    }
    if (residentialData) {
      fg.addControl('residentialAddress', new FormControl(insuranceShipment && insuranceShipment.residentialAddress, [Validators.required]));
      fg.addControl('postCode', new FormControl(insuranceShipment && insuranceShipment.postCode, [Validators.required, Validators.pattern('[(+).0-9\ ]*')]));
      fg.addControl('residentialCity', new FormControl(insuranceShipment && insuranceShipment.residentialCity, [Validators.required]));
      fg.addControl('residentialState', new FormControl(insuranceShipment && insuranceShipment.residentialState, [Validators.required]));
      fg.addControl('residentialStates', new FormControl());
      if (!residentialCountrySelectable) {
        fg.addControl('residentialCountry', new FormControl(this.defaultCountry && this.defaultCountry.name, [Validators.required]));
        fg.controls.residentialCountry.disable();
      }
      if (residentialCountrySelectable) {
        fg.addControl('residentialCountry', new FormControl(undefined, [Validators.required]));
        fg.controls.residentialState.disable();
      }
      if (residentialCityWithSelect) {
        fg.addControl('residentialCities', new FormControl());
        fg.controls.residentialCity.disable();
      }
    }
    if (insuranceShipment && insuranceShipment.residentialCountry) {
      this.toggleEnable(insuranceShipment.residentialCountry, 'residentialState', fg, true);
    }
    if (insuranceShipment && insuranceShipment.residentialState) {
      this.toggleEnable(insuranceShipment.residentialState, 'residentialCity', fg, true);
    }
    return fg;
  }


}
