import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { State } from '@model'
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import { AuthService, DataService, InsurancesService, UserService } from '@services'
import { TimeHelper } from 'app/shared/helpers/time.helper'
import * as moment from 'moment'
import { Observable, of } from 'rxjs'
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component'
import { FamilyRcValues, VehicleTypeValues } from './rc-auto.enum'
import { NypUserService } from '@NYP/ngx-multitenant-core'

@Component({
    selector: 'app-quotator-rc-fca',
    templateUrl: './quotator-rc-fca.component.html',
    styleUrls: ['./quotator-rc-fca.component.scss'],
    standalone: false
})
export class QuotatorRcFcaComponent extends PreventivatoreAbstractComponent implements OnInit {

  @Input() product: any
  @Output() actionEvent = new EventEmitter<any>();

  form: UntypedFormGroup
  states: State[] = []
  minDate: NgbDateStruct
  minBirthDate: NgbDateStruct
  maxBirthDate: NgbDateStruct
  quotationPrice: string = '0'
  displacementsRangeList: any[] = []
  brandsList: any[] = []
  numbersClass: any[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dataService: DataService,
    protected nypUserService: NypUserService,
    private insurancesService: InsurancesService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private authService: AuthService,
    ref: ChangeDetectorRef
  ) { super(ref) }

  ngOnInit() {
    this.getDiplacementRanges()
    this.getBrands()
    this.getNumbersClass()
    this.getStates()
    this.setDatePickerDates()
    this.form = this.createFormGroup()
    this.form.valueChanges.subscribe(changes =>
      this.evaluateFormChanges(changes)
    )
  }

  getDiplacementRanges(): void {
    this.insurancesService.getRcDisplacements().subscribe(displacements =>
      this.displacementsRangeList = displacements
    )
  }

  getBrands(): void {
    this.insurancesService.getRcCarBrands().subscribe(brands =>
      this.brandsList = brands
    )
  }

  getAlternativeDescriptionBrand(brand) {
    if (brand === 'LCV') {
      return 'Fiat Professional'
    }
    return brand
  }

  getNumbersClass(): void {
    this.numbersClass = Array(18).fill(0).map((x, i) => i + 1);
  }

  setDatePickerDates() {
    this.minDate = TimeHelper.fromDateToNgbDate(this.getTodayDate().add(1, 'd').toDate())
    this.minBirthDate = TimeHelper.fromDateToNgbDate(moment("1920", "YYYY").toDate())
    this.maxBirthDate = TimeHelper.fromDateToNgbDate(moment().startOf('d').subtract(18, 'y').toDate())
  }

  getTodayDate(): moment.Moment {
    return moment().startOf('d')
  }

  getDateFromControl(dateFromControl: { year: number, month: number, day: number }) {
    return new Date(dateFromControl.year, dateFromControl.month - 1, dateFromControl.day)
  }

  getStates(): void {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe(countries => {
      const defaultCountry = countries.find(country => country.iso_name === 'ITALIA')
      this.setStates(defaultCountry.id)
    })
  }

  setStates(countryId: number): void {
    this.nypUserService.getProvince(countryId).subscribe(states => {
      this.states = states
    })
  }

  createFormGroup(): UntypedFormGroup {
    const formGroup = this.formBuilder.group({
      vehicleType: ['car', Validators.required],
      expirationDate: [null, Validators.required],
      displacement: [null, Validators.required],
      brand: [null, Validators.required],
      birthDate: [this.getUserBirthDateForm(), Validators.required],
      residenceState: [null, Validators.required],
      familyRC: [false, Validators.nullValidator],
      licensePlateRelative: [null, { validators: Validators.required, updateOn: 'blur' }],
      fiscalCodeRelative: [null, { validators: Validators.required, updateOn: 'blur' }],
      originClassRelative: [null, { validators: Validators.required, updateOn: 'blur' }],
      originClass: [null, { validators: Validators.nullValidator, updateOn: 'blur' }]
    })
    return formGroup
  }

  getUserBirthDateForm(): NgbDateStruct {
    const birthDate = this.authService.currentUser && this.authService.currentUser.birth_date ||
      this.authService.loggedUser && this.authService.loggedUser.birth_date
    return TimeHelper.fromDateToNgbDate(moment(birthDate).toDate())
  }

  evaluateFormChanges(changes: any): void {
    this.checkExpirationDateValididty(changes['expirationDate'])
    this.updateFamilyRcControlsValidators(changes['familyRC'])
    this.getQuotation(changes).subscribe(quotation => this.quotationPrice = quotation.total)
  }

  checkExpirationDateValididty(date: { year: number, month: number, day: number }): void {
    if (date) {
      const todayDate = this.getTodayDate()
      const dateFromControl = this.getDateFromControl(date)
      const expirationDate = moment(dateFromControl)
      if (expirationDate.diff(todayDate, 'd') > 30) {
        this.form.controls['expirationDate'].setErrors({ exceedError: true }, { emitEvent: false })
      } else {
        this.form.controls['expirationDate'].setErrors(null)
      }
    }
  }

  updateFamilyRcControlsValidators(isFamilyRcActive) {
    const familyRcFields = ['licensePlateRelative', 'fiscalCodeRelative', 'originClassRelative']
    familyRcFields.forEach(formControl =>
      this.updateControlValidity(isFamilyRcActive, formControl)
    )
    this.updateControlValidity(!isFamilyRcActive, 'originClass')
  }

  updateControlValidity(isRequired: boolean, formControl: string): void {
    if (isRequired) {
      this.form.controls[formControl].setValidators([Validators.required])
    } else {
      this.form.controls[formControl].clearValidators()
    }
    this.form.controls[formControl].updateValueAndValidity({ emitEvent: false })
  }

  getQuotation(formValue: any): Observable<any> {
    if (this.form.valid) {
      const quotationRequest = this.createQuotationPayload(formValue)
      return this.insurancesService.submitRCFcaInsuranceQuotation(quotationRequest)
    }
    return of({ total: '0' })
  }

  createQuotationPayload(formValue: any): any {
    const residenceStateZone = this.getResidenceStateZone(formValue['residenceState'])
    const quotationAge = this.calculateContractorAge(formValue['birthDate'], formValue['brand'])
    const carType = this.getCarTypeChar(formValue['vehicleType'])
    return {
      tenant: "fca-bank",
      product_code: this.product.product_code,
      product_data: {
        zone: residenceStateZone,
        displacement: formValue['displacement'].quote_value,
        quotation_age: quotationAge,
        car_type: carType
      }
    }
  }

  calculateContractorAge(birthDate: { year: number, month: number, day: number }, brand: { code: number, description: string }): number {
    const over25QuotationBrands = ['Jaguar', 'Land Rover']
    const isBrandOver25Quotation = over25QuotationBrands.some(over25brand => over25brand === brand.description)
    if (isBrandOver25Quotation) {
      return 26
    }
    if (birthDate) {
      const todayDate = this.getTodayDate()
      const dateFromControl = this.getDateFromControl(birthDate)
      const momentBirthDate = moment(dateFromControl)
      return todayDate.diff(momentBirthDate, 'y')
    }
  }

  getResidenceStateZone(state: State): number | any {
    const stateZones = Object.entries(this.product.extras)
    for (const [stateName, zone] of stateZones) {
      if (state.name === stateName) {
        return zone
      }
    }
  }

  getPolicyStartDate(expirationDate: { year: number, month: number, day: number }): string {
    const dateFromControl = this.getDateFromControl(expirationDate)
    const startDate = moment(dateFromControl).add(1, 'd')
    return startDate.format('YYYY-MM-DD')
  }

  getUserBirthDate(birthDate: { year: number, month: number, day: number }): string {
    const dateFromControl = this.getDateFromControl(birthDate)
    return moment(dateFromControl).format('YYYY-MM-DD')
  }

  getCarTypeChar(vehicleType: string): string {
    switch (vehicleType) {
      case 'car': return VehicleTypeValues.car
      case 'truck': return VehicleTypeValues.truck
      default: return null
    }
  }

  checkout(formValue: any): void {
    const order = this.createRequestOrder(formValue);
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product'
      , payload: {
        product: this.product
        , order: order
        , router: 'checkout'
      }
    }
    this.sendActionEvent(action);
  }

  createRequestOrder(formValue: any): any {
    const relativeLicensePlate = formValue['familyRC'] ? formValue['licensePlateRelative'] : null
    const relativeFiscalCode = formValue['familyRC'] ? formValue['fiscalCodeRelative'] : null
    const originClass = formValue['familyRC'] ? formValue['originClassRelative'] : formValue['originClass']
    const familyRC = formValue['familyRC'] ? FamilyRcValues.yes : FamilyRcValues.no
    const residenceStateZone = this.getResidenceStateZone(formValue['residenceState'])
    const quotationAge = this.calculateContractorAge(formValue['birthDate'], formValue['brand'])
    const startDate = this.getPolicyStartDate(formValue['expirationDate'])
    const birthDate = this.getUserBirthDate(formValue['birthDate'])
    const carType = this.getCarTypeChar(formValue['vehicleType'])
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.product.master_variant,
            quantity: 1,
            insured_is_contractor: true,
            start_date: startDate,
            insurance_info_attributes: {
              extra: residenceStateZone,
              province: formValue['residenceState'].name,
              quotation_age: quotationAge,
              displacement: formValue['displacement'].quote_value,
              displacement_label: formValue['displacement'].cc_displacement,
              car_type: carType,
              family_rc: familyRC,
              family_rc_license_plate: relativeLicensePlate,
              family_rc_fiscal_code: relativeFiscalCode,
              family_rc_origin_class: originClass,
              birth_date: birthDate,
              genertel_brand: formValue['brand'].code,
              genertel_brand_description: formValue['brand'].description
            }
          },
        },
      }
    }
  }

  hasValue(formControlName: string) {
    return !!this.form.controls[formControlName].value
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required') ||
        this.getFieldError(formControlName, 'exceedError')) {
        return 'error-field'
      }
      if (this.getFieldError(formControlName, 'pattern')) {
        return 'warning-field'
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

}
