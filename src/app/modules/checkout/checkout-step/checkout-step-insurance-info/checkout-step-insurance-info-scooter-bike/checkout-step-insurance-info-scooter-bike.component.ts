import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Observable, of} from 'rxjs';
import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutService} from '@services';
import {InsuranceHoldersAttributes, InsuranceInfoAttributes, LineFirstItem} from '@model';
import {TimeHelper} from "../../../../../shared/helpers/time.helper";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-checkout-step-insurance-info-scooter-bike',
  templateUrl: './checkout-step-insurance-info-scooter-bike.component.html',
  styleUrls: ['./checkout-step-insurance-info-scooter-bike.component.scss']
})
export class CheckoutStepInsuranceInfoScooterBikeComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: FormGroup;
  product: CheckoutStepInsuranceInfoProduct;
  beginDate: string;
  fiscalCodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';

  model: { minBirthDate: NgbDateStruct; maxBirthDate: NgbDateStruct, minActivationDate: NgbDateStruct } = {
    minBirthDate: {
      year:  +moment().subtract(75, 'years').add(1, 'day').format('YYYY'),
      month: +moment().subtract(75, 'years').add(1, 'day').format('MM'),
      day: +moment().subtract(75, 'years').add(1, 'day').format('DD')
    },
    maxBirthDate: {
      year: +moment().subtract(4, 'years').format('YYYY'),
      month: +moment().subtract(4, 'years').format('MM'),
      day: +moment().subtract(4, 'years').format('DD')
    },
    minActivationDate: {
      year: +moment().add(1, 'day').format('YYYY'),
      month: +moment().add(1, 'day').format('MM'),
      day: +moment().add(1, 'day').format('DD')
    },
  };

  constructor(
    public checkoutService: CheckoutService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initFormInsuranceInfo();
    this.setBeginDate();
  }

  initFormInsuranceInfo(): void {
    this.form = new FormGroup({
      contractor: new FormControl(false),
      activationDate: new FormControl(this.getDateAlreadySelected(), Validators.required),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      fiscalCode: new FormControl(''),
      birthDate: new FormControl(''),
    });
  }

  ageRangeValidator(): ValidatorFn {
    const currentDate = moment().subtract(75, 'years').format('YYYY-MM-DD');
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control && control.value && control.value < currentDate) {
        return {'ageRange': true};
      }
      return null;
    };
  }

  onHandleChange(event): void {
    this.toggleCheck();
  }

  toggleCheck(): void {
    this.form.controls.firstName.setValidators(this.form.value.contractor ? [Validators.required] : null);
    this.form.controls.lastName.setValidators(this.form.value.contractor ? [Validators.required] : null);
    this.form.controls.fiscalCode.setValidators(this.form.value.contractor ? [Validators.required, Validators.pattern(this.fiscalCodePattern)] : null);
    let tempMinBirthDate: NgbDateStruct = {
      year:  this.model.minBirthDate.year,
      month: this.model.minBirthDate.month,
      day: this.model.minBirthDate.day - 1
    }
    let sMinAge = moment(TimeHelper.fromNgbDateStrucutreStringTo(tempMinBirthDate)).format('YYYY-MM-DD');
    const minAgeDate = new Date(sMinAge);
    this.form.controls.birthDate.setValidators(this.form.value.contractor ? [Validators.required, TimeHelper.dateValidator(minAgeDate, moment(this.model.maxBirthDate).toDate())] : null);
    this.form.controls.firstName.updateValueAndValidity();
    this.form.controls.lastName.updateValueAndValidity();
    this.form.controls.fiscalCode.updateValueAndValidity();
    this.form.controls.birthDate.updateValueAndValidity();
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required')) {
        return 'error-field'
      }
      if (this.getFieldError(formControlName, 'pattern') ) {
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

  isFormValid(): boolean {
    return this.form.valid;
  }

  onBeforeNextStep(): Observable<any> {
    this.saveTimestamp();
    return of(null);
  }

  saveTimestamp(): void {
    this.checkoutService.saveTimestamp(this.product.order.line_items[0].id).subscribe();
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
    lineItem.insurance_info_attributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    if (this.form.value.contractor) {
      lineItem.insurance_holder_attributes = this.fromViewToModel(this.form) || new InsuranceHoldersAttributes();
    }
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredIsContractor = !this.form.value.contractor;
    const insuredSubjects = this.computeModel();
    const startDateVal = this.form.controls.activationDate.value;
    const startDate = (typeof (startDateVal) === 'string' ? moment(startDateVal, 'DD/MM/YYYY') : moment(TimeHelper.fromNgbDateToDate(startDateVal))).format('YYYY-MM-DD');
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    this.product.startDate = new Date(startDate);
    this.product.endDate = endDate;
    return Object.assign({}, this.product, {insuredIsContractor, insuredSubjects});
  }

  computeModel(): object {
    return this.fromViewToModel(this.form);
  }

  fromViewToModel(form: FormGroup): object {
    const birthDate = form.controls.birthDate.value;

    return {
      first_name: form.controls.firstName.value,
      last_name: form.controls.lastName.value,
      birth_date: (typeof (birthDate) === 'string' ? moment(birthDate, 'DD/MM/YYYY') : moment(TimeHelper.fromNgbDateToDate(birthDate))).format('YYYY-MM-DD'),
      taxcode: form.controls.fiscalCode.value
    };
  }

  setBeginDate() {
    this.beginDate = moment().add(1, 'd').format('YYYY-MM-DD');
  }

  getDateAlreadySelected() {
    if (this.product.startDate) {
      return this.product.startDate;
    }
  }


}
