import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, UserService, Tenants } from '@services';
import { CheckoutContractor } from '../../checkout-step-address.model';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CheckoutAddressForm } from '../../checkout-address-forms.interface';
import { LocaleService } from '../../../../../../core/services/locale.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { NypUserService } from '@NYP/ngx-multitenant-core';
@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements CheckoutAddressForm, OnInit, OnDestroy {
  @Input() contractor: CheckoutContractor;
  @Output() validityChange = new EventEmitter<boolean>();

  mainDataDisabled = false;
  @Input() residentDataDisabled: boolean;
  @Input() phoneDataDisabled: boolean;
  @Input() correspondenceMessage: boolean;
  addressForm: FormGroup;
  kenticoTitleContentId = 'checkout.insured_contractor';
  product: any;
  birthCountry: any;
  birthStates: any;
  birthCities: any;
  residentialCountry: any;
  residentialStates: any;
  fiscalCodePattern = '';

  private fieldNamesToDisabled: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    protected nypUserService: NypUserService,
    public dataService: DataService,
    public localeService: LocaleService,
    private componentFeaturesService: ComponentFeaturesService
  ) {
    if (this.localeService.locale === 'it_IT' && this.dataService.tenantInfo.tenant !== 'leasys_db') {
      this.fiscalCodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';
    }
  }
  ngOnInit() {
    this.mainDataDisabled =
      this.dataService.tenantInfo.checkout.layout === 'cb' ||
      this.dataService.isTenant(Tenants.INTESA) ||
      this.contractor.locked_anagraphic;
    this.getKenticoTitleContentId();
    this.addressForm = this.formBuilder.group(this.fromModelToView(this.contractor));
    const ctls = this.addressForm.controls;
    ctls.firstName.setValidators([Validators.required, Validators.pattern('[a-zA-Z\ òàùèéì\']*')]);
    ctls.lastName.setValidators([Validators.required, Validators.pattern('[a-zA-Z\ òàùèéì\']*')]);
    ctls.fiscalCode.setValidators([Validators.required, Validators.pattern(this.fiscalCodePattern)]);
    ctls.phoneNumber.setValidators([Validators.required, Validators.pattern('[(+).0-9\ ]*')]);
    ctls.birthDate.setValidators([Validators.required, Validators.pattern('([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})')]); // pattern validator missing
    ctls.birthCountry.setValidators(Validators.required);
    ctls.birthStates.setValidators(Validators.required);
    ctls.birthCity.setValidators(Validators.required);
    ctls.residentialAddress.setValidators(Validators.required);
    ctls.residentialCity.setValidators(Validators.required);
    ctls.postCode.setValidators(Validators.required);
    ctls.residentialCountry.setValidators(Validators.required);
    ctls.residentialStates.setValidators(Validators.required);
    ctls.birthStates.disable();
    ctls.birthCity.disable();
    ctls.residentialStates.disable();
    if (this.dataService.tenantInfo.tenant === 'yolo-es-es_db' && this.product.product_code === 'net-mefio') {
      ctls.gender.setValidators(Validators.required);
    }
    this.getBirthCountries();
    this.addressForm.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.validityChange.emit(this.addressForm.valid);
    });
    this.computeContractorChanges(this.addressForm, this.contractor);
    if (this.mainDataDisabled) {
      ctls.firstName.disable();
      ctls.lastName.disable();
      ctls.fiscalCode.disable();
      ctls.birthDate.disable();
      ctls.birthCountry.disable();
      ctls.birthStates.disable();
      ctls.birthCity.disable();
    }
    if (this.isPhoneDisabled() || this.phoneDataDisabled) {
      ctls.phoneNumber.disable();
    }
    if (this.residentDataDisabled) {
      ctls.residentialAddress.disable();
      ctls.residentialCity.disable();
      ctls.postCode.disable();
      ctls.residentialCountry.disable();
      ctls.residentialStates.disable();
    }

    if (this.dataService.tenantInfo.tenant && this.localeService.locale === 'en_GB') {
      if (ctls['fiscalCode'].value === null || ctls['fiscalCode'].value === undefined) {
        this.contractor.fiscalCode = this.generateRandomTaxCode(9);
        ctls['fiscalCode'].setValue(this.contractor.fiscalCode);
      }
    }
    this.validityChange.emit(this.addressForm.valid);
    this.checkFieldNamesToDisabled();
  }

  private getKenticoTitleContentId() {
    const product = this.dataService.getResponseProduct();
    this.product = this.dataService.getResponseProduct();
    this.componentFeaturesService.useComponent('checkout-step-address');
    this.componentFeaturesService.useRule('title');
    const itemId: string = this.componentFeaturesService.getConstraints().get(product.product_code);
    if (!!itemId) {
      this.kenticoTitleContentId = itemId;
    }
  }

  isPhoneDisabled(): boolean {
    return this.dataService.isTenant(Tenants.INTESA);
  }

  generateRandomTaxCode(iLen: number) {
    let taxCodeRnd = '';
    const sChrs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    for (let i = 0; i < iLen; i++) {
      const randomPoz = Math.floor(Math.random() * sChrs.length);
      taxCodeRnd += sChrs.substring(randomPoz, randomPoz + 1);
    }
    return taxCodeRnd;
  }

  computeContractorChanges(form: FormGroup, contractor: CheckoutContractor) {
    form.patchValue(this.fromModelToView(contractor));
    if (contractor) {
      this.toggleEnable(form.controls.birthCountry.value, 'birthStates', true);
      this.toggleEnable(form.controls.birthStates.value, 'birthCity', true);
      this.toggleEnable(form.controls.residentialCountry.value, 'residentialStates', true);
    }
  }

  toggleEnable(el, input, keepValues?: boolean) {
    if (el && el.id) {
      if (!keepValues) {
        this.addressForm.get(input).patchValue(null);
      }
      this.addressForm.get(input).disable();
      if (input === 'birthStates') {
        if (!keepValues) {
          this.addressForm.get('birthCity').patchValue(null);
        }
        this.addressForm.get('birthCity').disable();
        if (el.states_required === true) {
          this.addressForm.get(input).setValidators(Validators.required);
          this.addressForm.get(input).enable();
          this.getBirthStates(el.id);
        } else {
          this.addressForm.get('birthCity').setValidators(null);
          this.addressForm.get(input).setValidators(null);
        }
      } else if (input === 'birthCity') {
        if (el.cities_required === true) {
          this.addressForm.get(input).setValidators(Validators.required);
          this.addressForm.get(input).enable();
          this.getBirthCities(el.id);
        } else {
          this.addressForm.get(input).setValidators(null);
        }
      } else if (input === 'residentialStates') {
        if (el.states_required === true) {
          this.addressForm.get(input).setValidators(Validators.required);
          this.addressForm.get(input).enable();
          this.getResidentialState(el.id);
        } else {
          this.addressForm.get(input).setValidators(null);
        }
      }

    } else {
      this.addressForm.get(input).disable();
    }
  }

  getBirthCountries() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe(countries => {
      this.dataService.setCountries(countries);
      this.birthCountry = countries;
      this.residentialCountry = countries;
    });
  }

  getBirthStates(stateId) {
    this.nypUserService.getProvince(stateId).subscribe(states => {
      this.birthStates = states;
    });
  }

  getBirthCities(cityId) {
    this.nypUserService.getCities(cityId).subscribe(cities => {
      this.birthCities = cities;
    });
  }

  getResidentialState(residentialStateId) {
    this.nypUserService.getProvince(residentialStateId).subscribe(states => {
      this.residentialStates = states;
    });
  }

  computeModel(): CheckoutContractor {
    return this.fromViewToModel(this.addressForm, true);
  }

  fromModelToView(contractor: CheckoutContractor): { [key: string]: any } {
    return {
      firstName: contractor && contractor.firstName || undefined,
      lastName: contractor && contractor.lastName || undefined,
      fiscalCode: contractor && contractor.fiscalCode || undefined,
      phoneNumber: contractor && contractor.phoneNumber || undefined,
      birthDate: contractor && contractor.birthDate || undefined,
      birthCountry: contractor && { id: contractor.birthCountryId, name: contractor.birthCountry, states_required: true } || undefined,
      birthStates: contractor && { id: contractor.birthStateId, name: contractor.birthState, cities_required: true } || undefined,
      birthCity: contractor && { id: contractor.birthCityId, name: contractor.birthCity } || undefined,
      residentialAddress: contractor && contractor.address || undefined,
      residentialCity: contractor && contractor.residenceCity || undefined,
      postCode: contractor && contractor.zipCode || undefined,
      residentialCountry: contractor && { id: contractor.residenceCountryId, name: contractor.residenceCountry, states_required: true } || undefined,
      residentialStates: contractor && { id: contractor.residendeStateId, name: contractor.residendeState } || undefined,
      contractor: contractor,
      gender: contractor && contractor.gender || undefined
    };
  }

  fromViewToModel(form: FormGroup, locked_anagraphic?: boolean): CheckoutContractor {
    return {
      firstName: form.controls.firstName.value,
      lastName: form.controls.lastName.value,
      fiscalCode: form.controls.fiscalCode.value,
      phoneNumber: form.controls.phoneNumber.value,
      birthDate: form.controls.birthDate.value,
      birthCountry: form.controls.birthCountry.value ? form.controls.birthCountry.value.name : '',
      birthState: form.controls.birthStates.value ? form.controls.birthStates.value.name : '',
      birthCity: form.controls.birthCity.value ? form.controls.birthCity.value.name : '',
      birthCountryId: form.controls.birthCountry.value ? form.controls.birthCountry.value.id : '',
      birthStateId: form.controls.birthStates.value ? form.controls.birthStates.value.id : '',
      birthCityId: form.controls.birthCity.value ? form.controls.birthCity.value.id : '',
      address: form.controls.residentialAddress.value,
      residenceCity: form.controls.residentialCity.value,
      zipCode: form.controls.postCode.value,
      residenceCountry: form.controls.residentialCountry.value ? form.controls.residentialCountry.value.name : '',
      residendeState: form.controls.residentialStates.value ? form.controls.residentialStates.value.name : '',
      residenceCountryId: form.controls.residentialCountry.value ? form.controls.residentialCountry.value.id : '',
      residendeStateId: form.controls.residentialStates.value ? form.controls.residentialStates.value.id : '',
      locked_anagraphic: locked_anagraphic,
      gender: form.controls.gender.value ? form.controls.gender.value : ''
    };
  }

  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  ngOnDestroy(): void {
  }

  getContractorFromForm(): CheckoutContractor {
    return this.computeModel();
  }

  checkFieldNamesToDisabled() {
    if (this.addressForm) {
      const ctls = this.addressForm.controls;
      this.fieldNamesToDisabled.forEach(fieldName => {
        const ctrl = ctls[fieldName];
        if (ctrl) {
          ctrl.disable();
        }
      });
      this.fieldNamesToDisabled = [];
    }
  }

  disableFields(fieldNames: string[]) {
    this.fieldNamesToDisabled = fieldNames;
    this.checkFieldNamesToDisabled();
  }
}
