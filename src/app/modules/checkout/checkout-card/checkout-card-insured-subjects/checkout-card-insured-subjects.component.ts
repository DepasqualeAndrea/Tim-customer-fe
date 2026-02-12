import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { City, Country, State } from '@model';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService, UserService } from '@services';
import { SET_TOKEN } from 'app/core/models/token-interceptor.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { TaxcodeCalculationRequest } from 'app/core/services/utils.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NgbDateHelper } from 'app/shared/ngb-date-helper';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { TimeHelper } from '../../../../shared/helpers/time.helper';
import { InsuranceHolderFormLocation } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-genertel-sci/step-info-genertel-sci-form.model';
import { CheckoutInsuredSubject } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';
export class Sexes {
  keyValue: string;
  value: string;
}

interface FormValue { [key: string]: any; }
@Component({
  selector: 'app-checkout-card-insured-subjects',
  templateUrl: './checkout-card-insured-subjects.component.html',
  styleUrls: ['./checkout-card-insured-subjects.component.scss'],

})
export class CheckoutCardInsuredSubjectsComponent implements OnInit, OnChanges {

  @Input() numberOfSubjects: number;

  @Input() insuredSubjects: CheckoutInsuredSubject[];

  @Input() insuredIsContractor: boolean;

  @Input() extended: boolean;

  @Input() hideInsuredIsContractorCheck: boolean;

  @Input() forcedInsuredIsContractorCheck: boolean;

  @Input() hideFamilyGrade: boolean;

  @Input() showFamilyGradeExtra: boolean;

  @Input() extendedPersonalOptional: boolean;

  @Input() minAge: number;
  @Input() minAgeBirthDate: string;
  @Input() maxAgeBirthDate: string;
  @Input() minBirth: string = moment().subtract(64, 'year').format('DD/MM/YYYY');
  @Input() hideBirthDate: boolean;

  @Input() residentialData: boolean;
  @Input() onlyResidentialCountry = false;
  @Input() residentialCountrySelectable = false;
  @Input() residentialCityWithSelect = false;

  @Input() personalExtraData: boolean;

  @Input() allFieldsRequired = true;

  @Input() productCode: string;
  @Input() icon: string;

  form: FormGroup;

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
  taxcodeField: string;
  get tenant(): string {
    return this.dataService.tenantInfo.tenant;
  }
  checkboxes = { dataTreatment: false, ageConfirm: false };
  kenticValue: any;
  product: string;
  sexes: Sexes[] = [{ keyValue: 'M', value: 'M' }, { keyValue: 'F', value: 'F' }];
  insuranceHolderFormLocations: InsuranceHolderFormLocation[] = [];
  insuranceHoldersForm: FormArray;
  contractorOldTaxcodeValue: string;
  contractorInfoForm: FormGroup;
  isCfInvalid = false;
  contactorAlreadySelected = false;
  overFiftyCount = 0;
  underFiftyCount = 0;
  checkAge = true;
  contractorOldtaxcodeValue: string;
  contractorBirthStates: State[];
  contractorBirthCities: City[];
  formInsuredIndex: number = 0;
  doLoop: boolean = true

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    protected nypUserService: NypUserService,

    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    public calendar: NgbCalendar,
    private dateHelper: NgbDateHelper,
    private authService: AuthService,
    private kenticoTranslateService: KenticoTranslateService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit() {
    this.createInsuranceHoldersForm();
    this.createContractorInfoForm();
    if (
      (this.dataService.isTenant('banco-desio_db') || this.dataService.isTenant('civibank_db')) &&
      (this.dataService.product.product_code === 'hpet-basic' || this.dataService.product.product_code === 'hpet-prestige' || this.dataService.product.product_code === 'hpet-vip')
    ) {
      this.getMinMaxBirthDates();
    }
    if (this.dataService.product.product_code === 'winter-sport-plus'
      || this.dataService.product.product_code === 'winter-sport-premium') {
      this.removeInsurableMaxBirthDate()
    }
    else {
      this.maxBirthDate = this.minAgeBirthDate ? {
        day: +moment(this.minAgeBirthDate, 'DD/MM/YYYY').format('DD'),
        month: +moment(this.minAgeBirthDate, 'DD/MM/YYYY').format('MM'),
        year: +moment(this.minAgeBirthDate, 'DD/MM/YYYY').format('YYYY'),
      } : this.calendar.getToday();
      this.minBirthDate = {
        day: +moment(this.maxAgeBirthDate ? this.maxAgeBirthDate : this.minBirth, 'DD/MM/YYYY').format('DD'),
        month: +moment(this.maxAgeBirthDate ? this.maxAgeBirthDate : this.minBirth, 'DD/MM/YYYY').format('MM'),
        year: +moment(this.maxAgeBirthDate ? this.maxAgeBirthDate : this.minBirth, 'DD/MM/YYYY').format('YYYY'),
      };
    }
    this.form = this.formBuilder.group({
      contractorIsInsured: new FormControl({ value: this.insuredIsContractor, disabled: this.forcedInsuredIsContractorCheck }),
      insuredSubjects: this.formBuilder.array(this.createSubjects(
        this.numberOfSubjects,
        this.insuredIsContractor,
        this.insuredSubjects,
        this.extended,
        this.hideFamilyGrade,
        this.showFamilyGradeExtra,
        this.residentialData,
        this.residentialCountrySelectable,
        this.residentialCityWithSelect,
        this.personalExtraData,
        this.extendedPersonalOptional,
        this.hideBirthDate,
        this.onlyResidentialCountry
      )),
      dataTreatment: new FormControl(''),
      ageConfirm: new FormControl('')
    });
    this.form.controls.insuredSubjects.valueChanges.subscribe(changes => {
      changes.forEach((element, i) => {
        if (this.doLoop) this.calculateCodFiscale();
        this.contractorOldTaxcodeValue = changes.taxcode;
      });
      if (this.doLoop) this.calculateCodFiscale();

      this.contractorOldTaxcodeValue = changes.taxcode;
    });
    if (this.dataService.tenantInfo.tenant === 'imagin-es-es_db') {
      this.form.get('dataTreatment').setValidators(Validators.requiredTrue);
      this.form.get('ageConfirm').setValidators(Validators.requiredTrue);
    }

    this.getDefaultCountry();
    this.getCountries();
    if ((this.residentialData && !this.residentialCountrySelectable) || this.onlyResidentialCountry) {
      this.getItalianResidentialStates();
    }
    this.birthCountryKey();

    this.ageConfirmCheckbox();
    this.dataTreatmentCheckbox();


    if (this.checkboxes.dataTreatment || this.checkboxes.ageConfirm) {
      this.kenticoTranslateService.getItem<any>('checkout_sport.step___address').pipe(take(1)).subscribe(item => {
        this.kenticValue = item;
      });
    }

    this.product = this.dataService.product.product_code;
  }

  getMinMaxBirthDates() {
    this.maxBirthDate = this.maxAgeBirthDate
      ? this.dateHelper.getPreviousDateFromToday(+this.minAgeBirthDate, 'Years')
      : this.dateHelper.today;

    this.minBirthDate = this.dateHelper.getPreviousDateFromToday(+this.maxAgeBirthDate, 'Years');
  }

  private removeInsurableMaxBirthDate(): void {
    const maximumAge = this.dataService.product.holder_maximum_age
    this.minBirthDate = this.dateHelper.getPreviousDateFromToday(maximumAge, 'years')
    this.maxBirthDate = this.dateHelper.today
  }

  switchInsuiredIsContractor(): boolean {
    this.componentFeaturesService.useComponent('checkout-insured-is-contractor-checkbox');
    this.componentFeaturesService.useRule('switch');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (constraints.includes(this.productCode)) {
        return true;
      }
    }
  }

  birthCountryKey(): boolean {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('birth-country-key');
    return this.componentFeaturesService.isRuleEnabled();
  }

  getFormSubjects(): FormArray {
    return this.form.controls.insuredSubjects as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.insuredIsContractor && !changes.insuredIsContractor.firstChange) ||
      (changes.numberOfSubjects && !changes.numberOfSubjects.firstChange) ||
      (changes.insuredSubjects && !changes.insuredSubjects.firstChange) ||
      (changes.extended && !changes.extended.firstChange) ||
      (changes.hideFamilyGrade && !changes.hideFamilyGrade.firstChange) ||
      (changes.showFamilyGradeExtra && !changes.showFamilyGradeExtra.firstChange)) {
      this.form.patchValue({ insuredIsContractor: this.insuredIsContractor });
      const insuredSubjects: FormArray = <FormArray>this.form.controls.insuredSubjects;
      const ctrls: AbstractControl[] = this.createSubjects(
        this.numberOfSubjects,
        this.insuredIsContractor,
        this.insuredSubjects,
        this.extended,
        this.hideFamilyGrade,
        this.showFamilyGradeExtra,
        this.residentialData,
        this.residentialCountrySelectable,
        this.residentialCityWithSelect,
        this.personalExtraData,
        this.extendedPersonalOptional,
        this.hideBirthDate,
        this.onlyResidentialCountry
      );
      this.cleanFormArray(insuredSubjects);
      ctrls.forEach(ctrl => insuredSubjects.push(ctrl));
    }
  }


  private dataTreatmentCheckbox(): void {
    this.componentFeaturesService.useComponent('address-form');
    this.componentFeaturesService.useRule('dataTreatment');
    this.checkboxes.dataTreatment = this.componentFeaturesService.isRuleEnabled();
  }

  private ageConfirmCheckbox(): void {
    this.componentFeaturesService.useComponent('address-form');
    this.componentFeaturesService.useRule('ageConfirm');
    this.checkboxes.ageConfirm = this.componentFeaturesService.isRuleEnabled();
  }


  computeModel(): CheckoutInsuredSubject[] {
    return this.fromViewToModel(this.form);
  }

  contractorIsInsured(): boolean {
    return this.form.controls.contractorIsInsured.value;
  }

  createSubjects(numberOfSubjects: number,
    insuredIsContractor: boolean,
    insuredSubjects: CheckoutInsuredSubject[],
    extended: boolean, hideFamilyGrade: boolean,
    showFamilyGradeExtra: boolean,
    residentialData: boolean,
    residentialCountrySelectable: boolean,
    residentialCityWithSelect: boolean,
    personalExtraData: boolean,
    extendedPersonalOptional: boolean,
    hideBirthDate: boolean,
    onlyResidentialCountry: boolean): AbstractControl[] {

    const n = insuredIsContractor ? numberOfSubjects - 1 : numberOfSubjects;
    if (insuredSubjects) {
      insuredSubjects = insuredSubjects.filter(subj => !subj.isContractor);
    }
    return new Array(n).fill(null).map((currentVal, index) => {
      return this.createInsuranceSubjectItem(
        insuredSubjects && insuredSubjects[index],
        extended,
        hideFamilyGrade,
        showFamilyGradeExtra,
        residentialData,
        residentialCountrySelectable,
        residentialCityWithSelect,
        personalExtraData,
        extendedPersonalOptional,
        hideBirthDate,
        onlyResidentialCountry);
    });
  }
  protected getSsoUser() {
    const updateUser = 'true';
    const code = localStorage.getItem('code');
    this.userService.ssoOauth(code, updateUser).subscribe((res) => {
      SET_TOKEN(res.token);
      this.nypUserService.getUserDetails(res.id).subscribe(
        data => {
          delete res.token;
          this.authService.currentUser = res;
          this.authService.loggedUser = data;
          localStorage.setItem('user', JSON.stringify(res));
        });
    });
  }

  public switchContractorIsInsuredChange(): void {
    this.getSsoUser();
    this.handleContractorIsInsuredChange();
  }

  handleContractorIsInsuredChange(): void {
    const array: FormArray = <FormArray>this.form.controls.insuredSubjects;
    if (!!this.form.controls.contractorIsInsured.value) {
      this.othersInsuranceSubject = true;
      array.removeAt(array.length - 1);
    } else {
      this.othersInsuranceSubject = false;
      array.push(this.createInsuranceSubjectItem(null,
        this.extended,
        this.hideFamilyGrade,
        this.showFamilyGradeExtra,
        this.residentialData,
        this.residentialCountrySelectable,
        this.residentialCityWithSelect,
        this.personalExtraData,
        this.extendedPersonalOptional,
        this.hideBirthDate,
        this.onlyResidentialCountry
      ));
    }
  }

  fromViewToModel(form: FormGroup, locked_anagraphic?: boolean): CheckoutInsuredSubject[] {
    const subjects: FormArray = <FormArray>form.controls.insuredSubjects;
    const transformed: CheckoutInsuredSubject[] = [];
    for (let i = 0; i < subjects.length; i++) {
      transformed.push(this.fromFormGroupToInsuredSubject(<FormGroup>subjects.at(i)));
    }
    return transformed;
  }

  fromFormGroupToInsuredSubject(group: FormGroup): CheckoutInsuredSubject {
    const subject = {
      familyRelationship: this.hideFamilyGrade ? 'other' : group.controls.familyRelationship.value,
      id: group.controls.id.value,
      firstName: group.controls.firstName.value,
      lastName: group.controls.lastName.value,
      gender: group.controls.gender.value
    };
    if (!this.hideBirthDate) {
      let birthDateValue: string | Date;
      if ((this.dataService.tenantInfo.tenant === 'banco-desio_db' || this.dataService.tenantInfo.tenant === 'civibank_db') && (typeof group.controls.birthDate.value === 'string')) {
        birthDateValue = group.controls.birthDate.value;
      } else {
        birthDateValue = TimeHelper.fromNgbDateToDate(group.controls.birthDate.value);
      }
      Object.assign(subject, {
        birthDate: birthDateValue
      });
    }
    if (this.extended) {
      Object.assign(subject, {
        taxcode: group.controls.taxcode.value,
        birthCountry: group.controls.birthCountry.value,
        birthState: group.controls.birthState.value,
        birthCity: group.controls.birthCity.value,
        gender: group.controls.gender.value
      });
    }
    if (this.personalExtraData) {
      Object.assign(subject, {
        phone: group.controls.phone.value,
        email: group.controls.email.value
      });
    }
    if (this.extendedPersonalOptional) {
      Object.assign(subject, {
        taxcode: group.controls.taxcode.value,
        phone: (group.controls.phone.value === null) ? '1234567890' : group.controls.phone.value,
        email: group.controls.email.value
      });
    }
    if (this.residentialData) {
      Object.assign(subject, {
        residentialAddress: group.controls.residentialAddress.value,
        postCode: group.controls.postCode.value,
        residentialCity: this.residentialCityWithSelect ? group.controls.residentialCity.value && group.controls.residentialCity.value.name : group.controls.residentialCity.value,
        residentialState: this.residentialCityWithSelect || this.residentialCountrySelectable ? group.controls.residentialState.value && group.controls.residentialState.value.id : group.controls.residentialState.value,
        residentialCountry: this.residentialCountrySelectable ? group.controls.residentialCountry.value : this.residentialItalianCountry
      });
    }
    if (this.onlyResidentialCountry) {
      Object.assign(subject, {
        residentialCountry: this.residentialCountrySelectable ? group.controls.residentialCountry.value : this.residentialItalianCountry,
        residentialAddress: '--',
        residentialState: 3707,
        residentialCity: 13792,
        postCode: 20100
      });
    }
    return subject;
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

  getBirthStates(stateId, formGroup: FormGroup) {
    this.nypUserService.getProvince(stateId).subscribe(states => {
      formGroup.controls.birthStates.patchValue(states);
    });
  }

  getResidentialStates(stateId, formGroup: FormGroup) {
    this.nypUserService.getProvince(stateId).subscribe(states => {
      formGroup.controls.residentialStates.patchValue(states);
    });
  }

  getBirthCities(cityId, formGroup: FormGroup) {
    this.nypUserService.getCities(cityId).subscribe(cities => {
      formGroup.controls.birthCities.patchValue(cities);
    });
  }

  getResidentialCities(cityId, formGroup: FormGroup) {
    this.nypUserService.getCities(cityId).subscribe(cities => {
      cities.forEach(item => {
        if (item.name === formGroup.controls.residentialCity.value) {
          formGroup.controls.residentialCity.patchValue(item);
        }
      });
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

  toggleEnable(el, input, formGroup: FormGroup, keepValues?: boolean) {
    if (el && el.id) {
      if (!keepValues) {
        formGroup.get(input).patchValue(null);
      }
      formGroup.get(input).disable();
      if (input === 'birthState') {
        if (!keepValues) {
          formGroup.get('birthCity').patchValue(null);
        }
        formGroup.get('birthCity').disable();
        if (el.states_required === true) {
          formGroup.get('birthCity').setValidators(Validators.required);
          formGroup.get(input).setValidators(Validators.required);
          formGroup.get(input).enable();
          this.getBirthStates(el.id, formGroup);
        } else {
          formGroup.get('birthCity').setValidators(null);
          formGroup.get(input).setValidators(null);
        }
      } else if (input === 'birthCity') {
        if (el.cities_required === true) {
          formGroup.get(input).setValidators(Validators.required);
          formGroup.get(input).enable();
          this.getBirthCities(el.id, formGroup);
        } else {
          formGroup.get(input).setValidators(null);
        }
      } else if (input === 'residentialState') {
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

  private createInsuranceSubjectItem(insuranceSubject: CheckoutInsuredSubject,
    extended: boolean,
    hideFamilyGrade: boolean,
    showFamilyGradeExtra: boolean,
    residentialData: boolean,
    residentialCountrySelectable: boolean,
    residentialCityWithSelect: boolean,
    personalExtraData: boolean,
    extendedPersonalOptional: boolean,
    hideBirthDate: boolean,
    onlyResidentialCountry: boolean) {
    const fg: FormGroup = new FormGroup({
      id: new FormControl(insuranceSubject && insuranceSubject.id || null),
      gender: new FormControl(insuranceSubject && insuranceSubject.sex),
      firstName: new FormControl(insuranceSubject && insuranceSubject.firstName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
      lastName: new FormControl(insuranceSubject && insuranceSubject.lastName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
      familyRelationship: new FormControl(insuranceSubject && insuranceSubject.familyRelationship),
    });
    const taxcodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';
    if (!hideFamilyGrade) {
      fg.controls.familyRelationship.setValidators(Validators.required);
    }
    if (showFamilyGradeExtra) {
      fg.controls.familyRelationship.setValidators(Validators.required);
    }
    if (!hideBirthDate) {
      fg.addControl('birthDate', new FormControl(TimeHelper.fromDateToNgbDate(insuranceSubject && insuranceSubject.birthDate), Validators.required));
    }
    if (!hideBirthDate && (this.dataService.tenantInfo.tenant === 'banco-desio_db' ||
      this.dataService.tenantInfo.tenant === 'civibank_db')) {
      let birthDateValue = TimeHelper.fromDateToNgbDate(insuranceSubject && insuranceSubject.birthDate);
      if (birthDateValue !== undefined) {
        fg.patchValue({
          birthDate: TimeHelper.fromNgbDateStrucutreStringTo(birthDateValue)
        });
      }
    }
    if (extended) {
      fg.addControl('taxcode', new FormControl(insuranceSubject && insuranceSubject.taxcode || undefined, [Validators.required, Validators.pattern(taxcodePattern)]));
      fg.addControl('birthCountry', new FormControl(insuranceSubject && insuranceSubject.birthCountry || undefined, [Validators.required]));
      fg.addControl('birthState', new FormControl({ value: insuranceSubject && insuranceSubject.birthState || undefined, disabled: true }, [Validators.required]));
      fg.addControl('birthCity', new FormControl({ value: insuranceSubject && insuranceSubject.birthCity || undefined, disabled: true }, [Validators.required]));
      fg.addControl('birthStates', new FormControl());
      fg.addControl('birthCities', new FormControl());
      fg.addControl('gender', new FormControl());
    }
    if (extendedPersonalOptional) {
      fg.addControl('taxcode', new FormControl(insuranceSubject && insuranceSubject.taxcode || undefined, Validators.pattern(taxcodePattern)));
      fg.addControl('phone', new FormControl(insuranceSubject && insuranceSubject.phone || undefined, Validators.pattern('[(+).0-9]*')));
      fg.addControl('email', new FormControl(undefined, [Validators.required, Validators.email]));
    }
    if (personalExtraData) {
      fg.addControl('email', new FormControl(undefined, [Validators.required, Validators.email]));
      fg.addControl('phone', new FormControl(undefined, [Validators.required, Validators.pattern('[(+).0-9\ ]*')]));
    }
    if (residentialData) {
      fg.addControl('residentialAddress', new FormControl(insuranceSubject && insuranceSubject.residentialAddress, [Validators.required]));
      fg.addControl('postCode', new FormControl(insuranceSubject && insuranceSubject.postCode, [Validators.required]));
      fg.addControl('residentialState', new FormControl(insuranceSubject && insuranceSubject.residentialState, [Validators.required]));
      fg.addControl('residentialCity', new FormControl({ value: insuranceSubject && insuranceSubject.residentialCity || undefined, disabled: true }, [Validators.required]));
      fg.addControl('residentialStates', new FormControl());
      if (residentialCountrySelectable) {
        fg.addControl('residentialCountry', new FormControl(undefined, [Validators.required]));
        fg.controls.residentialState.disable();
      }
      if (residentialCityWithSelect) {
        fg.addControl('residentialCities', new FormControl());
        fg.controls.residentialCity.disable();
      }
    }
    if (onlyResidentialCountry) {
      fg.addControl('residentialCountry', new FormControl());
      fg.controls.residentialCountry.disable();
    }
    if (insuranceSubject && insuranceSubject.birthCountry) {
      this.toggleEnable(insuranceSubject.birthCountry, 'birthState', fg, true);
    }
    if (insuranceSubject && insuranceSubject.birthState) {
      this.toggleEnable(insuranceSubject.birthState, 'birthCity', fg, true);
    }
    if (insuranceSubject && insuranceSubject.residentialCountry) {
      this.toggleEnable(insuranceSubject.residentialCountry, 'residentialState', fg, true);
    }
    if (insuranceSubject && insuranceSubject.residentialState && !!fg.get('residentialCity')) {
      this.toggleEnable(insuranceSubject.residentialState, 'residentialCity', fg, true);
    }


    if (this.tenant === 'banco-desio_db' || this.tenant === 'civibank_db') {
      fg.addValidators(this.dateValidator);
    }

    return fg;
  }

  checkCountryApex() {
    return this.birthCountryKey() && this.extended && (this.getFormSubjects().controls.length > 0 || !this.form.controls.contractorIsInsured.value);
  }

  private checkThereIsOnlyOneContractor(change: boolean): void {
    this.contactorAlreadySelected = change;
  }

  private calculateAge(date: Date) {
    const today = moment();
    const age = today.diff(date, 'years');
    return age;
  }

  private checkContractorIsAdult(age: number) {
    for (const form of this.insuranceHoldersForm.controls) {
      if (!!form.get('insuredIsContractor').value) {
        if (age < 18) {
          form.get('birthDate').setErrors({ under_age: true });
        } else {
          form.get('birthDate').setErrors({ under_age: false });
          form.get('birthDate').setErrors(null);
        }
      } else {
        if (age < 18) {
          this.contractorInfoForm.get('birthDate').setErrors({ under_age: true });
        } else {
          this.contractorInfoForm.get('birthDate').setErrors({ under_age: false });
          this.contractorInfoForm.get('birthDate').setErrors(null);
        }
      }
    }
  }

  private getInsuredStatesList(country: Country, index: number): void {
    const insuranceHolderForm = this.insuranceHoldersForm.controls[index] as FormGroup;
    const italySelected = country.iso === 'IT';
    if (italySelected) {
      this.nypUserService.getProvince(country.id).subscribe(states => {
        this.insuranceHolderFormLocations[index].states = states;
      });
      this.addValidators(['birthState'], insuranceHolderForm);
      this.removeValidators(['birthCity'], insuranceHolderForm);
    } else {
      this.removeValidators(['birthState', 'birthCity'], insuranceHolderForm);
    }
  }

  public validationCinCf(cf): boolean {
    if (!!cf) {
      const set1: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const set2: string = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const setpari: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const setdisp: string = "BAKPLCQDREVOSFTGUHMINJWZYX";
      let accumulateS: number = 0;
      for (let j = 1; j <= 13; j += 2) {
        accumulateS += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(j))));
      }
      for (let k = 0; k <= 14; k += 2) {
        accumulateS += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(k))));
      }

      if (accumulateS % 26 != (cf.charCodeAt(15) - 'A'.charCodeAt(0))) {
        return false;
      } else {
        return true;
      }
    }
  }

  checkCodiceFiscale(taxcode: string) {
    return this.isCfInvalid = this.checkTaxCodeLength(taxcode) && !this.validationCinCf(taxcode);
  }
  checkTaxCodeLength(taxcode: string): boolean {
    if (taxcode.length < 16) {
      return false;
    }
    else if (taxcode.length === 16) {
      return true;
    }
  }

  private getInsuredCitiesList(state: State, index: number) {
    const insuranceHolderForm = this.insuranceHoldersForm.controls[index] as FormGroup;
    if (!!state && state.cities_required) {
      this.nypUserService.getCities(state.id).subscribe(cities => {
        this.insuranceHolderFormLocations[index].cities = cities;
      });
      this.addValidators(['birthCity'], insuranceHolderForm);
    } else {
      this.removeValidators(['birthCity'], insuranceHolderForm);
    }
  }

  private removeValidators(formControlNames: string[], form: FormGroup): void {
    formControlNames.forEach(formControlName => {
      form.get(formControlName).clearValidators();
      form.get(formControlName).setValue(null, { emitEvent: false });
      form.get(formControlName).disable({ emitEvent: false });
    });
    form.updateValueAndValidity({ emitEvent: false });
  }

  private resetInsuredCounter() {
    this.insuranceHolderFormLocations.forEach((insured) => {
      if (insured.ageRange === 'OVER_50') {
        this.overFiftyCount--;
      } else {
        this.underFiftyCount--;
      }
    });
    this.checkAge = false;
  }

  verifyInsuredNumberAge() {

    this.checkAge = true;

    this.insuranceHolderFormLocations.forEach((insured) => {
      if (insured.ageRange === 'OVER_50') {
        this.overFiftyCount++;
      } else {
        this.underFiftyCount++;
      }
    });
    const totalOverFifty = this.getTotalOverFifty();
    const totalUnderFifty = this.getTotalUnderFifty();
    const totalInsuredCount = this.overFiftyCount + this.underFiftyCount;
    const totalInsuredHolders = this.getTotalInsuranceHolders();
    if (this.overFiftyCount === totalOverFifty && this.underFiftyCount === totalUnderFifty && totalInsuredCount === totalInsuredHolders) {
      return;
    } else if (totalUnderFifty !== 0 && this.underFiftyCount !== totalUnderFifty && totalInsuredCount === totalInsuredHolders) {
      this.toastrService.error('Il totale degli assicurati Under 50 anni non corriponde a quello indicato');
      this.resetInsuredCounter();
      return;
    } else if (totalOverFifty !== 0 && this.overFiftyCount !== totalOverFifty && totalInsuredCount === totalInsuredHolders) {
      this.toastrService.error('Il totale degli assicurati Over 50 anni non corriponde a quello indicato');
      this.resetInsuredCounter();
      return;
    } else if (this.overFiftyCount !== totalOverFifty && this.underFiftyCount !== totalUnderFifty && totalInsuredCount === totalInsuredHolders) {
      this.toastrService.error('Il totale degli assicurati Over 50 anni e Under 50  non corriponde a quello indicato');
      this.resetInsuredCounter();
      return;
    }

  }

  private dateValidator: ValidatorFn = (fg: FormGroup) => {
    if (fg && fg.get('birthDate') && fg.get('birthDate').value) {
      const parsedDate = this.dateHelper.from(fg.get('birthDate').value);
      if (parsedDate.before(this.minBirthDate)) {
        return { minDateError: true };
      }
      if (parsedDate.after(this.maxBirthDate)) {
        return { maxDateError: true };
      }
      fg.setErrors(null);
      return null;
    }
  }

  private getTotalInsuranceHolders(): number {
    return this.dataService.getResponseOrder().line_items[0].quantity;
  }
  private getTotalOverFifty(): number {
    return this.dataService.getResponseOrder().data.after_50;
  }
  private getTotalUnderFifty(): number {
    return this.dataService.getResponseOrder().data.before_50;
  }


  private createInsuranceHoldersForm(): void {
    const totalInsuredHolders = this.getTotalInsuranceHolders();
    this.insuranceHoldersForm = this.formBuilder.array(
      this.createInsuranceHoldersFormArrayConfig(totalInsuredHolders)
    );
  }

  private createInsuranceHoldersFormArrayConfig(insuranceHolders: number): FormGroup[] {
    const formArrayConfig: FormGroup[] = [];
    for (let i = 0; i < insuranceHolders; i++) {
      this.insuranceHolderFormLocations.push(new InsuranceHolderFormLocation());
      formArrayConfig.push(this.createNewInsuredForm(i));
    }
    return formArrayConfig;
  }


  private getContractorStatesList(country: Country): void {
    const italySelected = country.iso === 'IT';
    if (italySelected) {
      this.nypUserService.getProvince(country.id).subscribe(states => {
        this.contractorBirthStates = states;
      });
      this.addValidators(['birthState'], this.contractorInfoForm);
      this.removeValidators(['birthCity'], this.contractorInfoForm);
    } else {
      this.removeValidators(['birthState', 'birthCity'], this.contractorInfoForm);
    }
  }

  private getContractorCitiesList(state: State) {
    if (!!state && state.cities_required) {
      this.nypUserService.getCities(state.id).subscribe(cities => {
        this.contractorBirthCities = cities;
      });
      this.addValidators(['birthCity'], this.contractorInfoForm);
    } else {
      this.removeValidators(['birthCity'], this.contractorInfoForm);
    }
  }

  private createContractorInfoForm(): void {
    this.contractorInfoForm = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]],
      surname: [null, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]],
      gender: [null, Validators.required],
      birthDate: [null, Validators.required],
      birthCountry: [null, Validators.required],
      birthState: [{ value: null, disabled: true }, Validators.required],
      birthCity: [{ value: null, disabled: true }, Validators.required],
      taxcode: [null, [Validators.required, Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$')]],
      profession: [null, Validators.required]
    });
    this.contractorInfoForm.controls.birthDate.valueChanges.subscribe(date => {
      const constractorAge = this.calculateAge(moment(date).toDate());
      this.checkContractorIsAdult(constractorAge);
    });
    this.contractorInfoForm.controls.birthCountry.valueChanges.subscribe(country =>
      this.getContractorStatesList(country),
    );
    this.contractorInfoForm.controls.birthState.valueChanges.subscribe(state =>
      this.getContractorCitiesList(state)
    );
    this.contractorInfoForm.valueChanges.subscribe(changes => {
      this.contractorOldTaxcodeValue = changes.taxcode;
    });
    this.contractorInfoForm.controls.taxcode.valueChanges.subscribe(taxcode => {
      this.checkCodiceFiscale(taxcode);
    });
  }

  private createNewInsuredForm(index: number): FormGroup {
    const insuredForm = this.formBuilder.group({
      insuredIsContractor: [false, Validators.nullValidator],
      name: [null, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]],
      surname: [null, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]],
      gender: [null, Validators.required],
      birthDate: [null, Validators.required],
      birthCountry: [null, Validators.required],
      birthState: [{ value: null, disabled: true }, Validators.required],
      birthCity: [{ value: null, disabled: true }, Validators.required],
      taxcode: [{ value: null, disabled: true }, [Validators.required, Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$')]],
    });
    insuredForm.controls.insuredIsContractor.valueChanges.subscribe(change => {
      this.checkThereIsOnlyOneContractor(change);
      if (change) {
        if (!!insuredForm.get('insuredIsContractor').value) {
          if (insuredForm.get('birthDate').value) {
            const age = this.calculateAge(moment(insuredForm.get('birthDate').value).toDate());
            this.checkContractorIsAdult(age);
          }
        }
      }
    });
    insuredForm.controls.birthCountry.valueChanges.subscribe(country =>
      this.getInsuredStatesList(country, index)
    );
    insuredForm.controls.birthState.valueChanges.subscribe(state =>
      this.getInsuredCitiesList(state, index)
    );
    insuredForm.valueChanges.subscribe(changes => {
      if (this.doLoop) this.calculateCodFiscale();
    });
    insuredForm.controls.birthDate.valueChanges.subscribe(date => {
      const insuredAge = this.calculateAge(moment(date).toDate());
      if (insuredAge >= 50) {
        this.insuranceHolderFormLocations[index].ageRange = 'OVER_50';
      } else {
        this.insuranceHolderFormLocations[index].ageRange = 'UNDER_50';
      }
      this.checkContractorIsAdult(insuredAge);
    });
    insuredForm.controls.taxcode.valueChanges.subscribe(taxcode => {
      this.checkCodiceFiscale(taxcode);
    });
    return insuredForm;
  }

  private hasTaxcodeChanged(savedTaxcode: string, taxcode: string): boolean {
    return savedTaxcode !== taxcode;
  }

  private canCalculateTaxcode(formValue: FormValue): boolean {
    if (!formValue.birthCountry) {
      return false;
    }
    const italySelected = formValue.birthCountry.iso === 'IT';
    return italySelected
      ? !!formValue.firstName && !!formValue.lastName && !!formValue.gender && !!formValue.birthDate
      && !!formValue.birthCountry && !!formValue.birthState && !!formValue.birthCity
      : !!formValue.firstName && !!formValue.lastName && !!formValue.gender && !!formValue.birthDate
      && !!formValue.birthCountry;
  }

  private hasTaxcodeBeenRecalculated(savedTaxcode: string, taxcode: FormValue): boolean {
    if (!!savedTaxcode && !!taxcode) {
      return savedTaxcode.length === 16 && taxcode.length === 16;
    }
    return false;
  }

  private addValidators(formControlNames: string[], form: FormGroup): void {
    formControlNames.forEach(formControlName => {
      form.get(formControlName).setValidators(Validators.required);
      form.get(formControlName).enable({ emitEvent: false });
    });
    form.updateValueAndValidity({ emitEvent: false });
  }

  private calculateCodFiscale(): void {
    const subjects = this.form.controls['insuredSubjects']
    if (this.checkIfInsuredFormHasAllValue(subjects.get(`${this.formInsuredIndex}`))) {
      this.sendTaxcodeCalculationRequest(subjects.get(`${this.formInsuredIndex}`), this.form);
    }

  }

  private checkIfInsuredFormHasAllValue(insured: any): boolean {
    if ( //if insurance holder is not italian
      !!insured.get('firstName').value &&
      !!insured.get('lastName').value &&
      !!insured.get('birthDate').value &&
      !!insured.get('gender').value &&
      !!insured.get('birthCountry').value &&
      insured.get('birthCountry').value.iso != "IT"
    ) {
      return true;
    } else if ( //if insurance holder is italian
      !!insured.get('firstName').value &&
      !!insured.get('lastName').value &&
      !!insured.get('birthCountry').value &&
      !!insured.get('birthDate').value &&
      !!insured.get('birthState').value &&
      !!insured.get('birthCity').value &&
      !!insured.get('gender').value
    ) {
      return true;
    } else {
      return false
    }
  }

  private sendTaxcodeCalculationRequest(formValue: FormValue, form: FormGroup): void {
    const taxcodeRequest: TaxcodeCalculationRequest = this.createTaxcodeRequest(formValue);
    this.userService.taxcodeCalculation(taxcodeRequest).subscribe(res => {
      form.controls['insuredSubjects'].get(`${this.formInsuredIndex}`).get('taxcode').setValue(res.taxcode)
      form.controls['insuredSubjects'].get(`${this.formInsuredIndex}`).get('taxcode').setErrors(null, { emitEvent: false });
      form.controls['insuredSubjects'].get(`${this.formInsuredIndex}`).get('taxcode').setValidators(Validators.compose([
        Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$'),
        Validators.required]));
      this.doLoop = false;
    });
  }

  private createTaxcodeRequest(formValue: FormValue): TaxcodeCalculationRequest {
    return {
      firstname: formValue.value.firstName,
      lastname: formValue.value.lastName,
      gender: formValue.value.gender,
      birthdate: `${formValue.value.birthDate.day}/${formValue.value.birthDate.month}/${formValue.value.birthDate.year}`,
      country_name: !!formValue.value.birthCountry ? formValue.value.birthCountry.name : undefined,
      province_code: !!formValue.value.birthState ? formValue.value.birthState.abbr : undefined,
      city_name: !!formValue.value.birthCity ? formValue.value.birthCity.name : undefined,
    };
  }

  getIndex(i: number): void {
    this.formInsuredIndex = i;
    this.doLoop = true;
  }

  // those two functions are needed in order to be able to get the value from the,
  // checkboxes inputs and to pass this value to the validetors.

  getValueFromCheckBoxDataTreatment(event: any) {
    if (event.checked) this.form.get('dataTreatment')?.setValue(true);
    else this.form.get('dataTreatment')?.setValue(false);
  }
  getValueFromCheckBoxageConfirmAgeConfirm(event: any) {
    if (event.checked) this.form.get('ageConfirm')?.setValue(true);
    else this.form.get('ageConfirm')?.setValue(false);
  }
}
