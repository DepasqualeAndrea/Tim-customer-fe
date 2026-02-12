import {Component, OnInit} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {of} from 'rxjs/internal/observable/of';
import {Observable} from 'rxjs';
import {CheckoutStepInsuranceInfoMiFidoProduct, PetInfo} from './checkout-step-insurance-info-mi-fido.model';
import {TimeHelper} from '../../../../../shared/helpers/time.helper';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {LineFirstItem} from '@model';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';

@Component({
  selector: 'app-checkout-step-insurance-info-mi-fido',
  templateUrl: './checkout-step-insurance-info-mi-fido.component.html',
  styleUrls: ['./checkout-step-insurance-info-mi-fido.component.scss']
})
export class CheckoutStepInsuranceInfoMiFidoComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: FormGroup;

  maxBirthDate: NgbDateStruct;
  minBirthDate: NgbDateStruct;

  breeds;
  dangerousBreeds;
  constraints;

  constructor(private formBuilder: FormBuilder,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    ) {
    super();
  }

  ngOnInit() {
    this.minBirthDate = TimeHelper.fromDateToNgbDate(moment().subtract(8, 'y').toDate());
    this.maxBirthDate = TimeHelper.fromDateToNgbDate(moment().subtract(6, 'month').toDate());
    this.breeds = this.product.order.line_items[0].pet_properties.breeds;
    this.dangerousBreeds = this.breeds.filter(b => !!b.dangerous).map(b => b.presentation).join();
    this.constraints = this.product.order.line_items[0].pet_properties.constraints;

    const product: CheckoutStepInsuranceInfoMiFidoProduct = Object.assign(this.product);
    this.form = this.formBuilder.group({
      kind: new FormControl(product.kind || 'dog', [Validators.required]),
      chipNumber: new FormControl(product.chip, [Validators.required, Validators.pattern(/^[0-9]{15}$/)]),
      breed: new FormControl(product.breed, [Validators.required]),
      birthDate: new FormControl(TimeHelper.fromDateToNgbDate(product.birthDate), [Validators.required]),
      informationPackage: new FormControl(product.informationPackage, [Validators.requiredTrue])
    });
  }

  fromViewToModel(form: FormGroup): PetInfo {
    return {
      petName: null,
      kind: form.controls.kind.value,
      chip: form.controls.chipNumber.value,
      breed: form.controls.breed.value,
      birthDate: TimeHelper.fromNgbDateToDate(form.controls.birthDate.value),
      informationPackage: form.controls.informationPackage.value
    };
  }

  isFormValid(): boolean {
    this.form.controls.breed.updateValueAndValidity();
    this.form.controls.informationPackage.updateValueAndValidity();
    return this.form.valid;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const petInfo: PetInfo = this.fromViewToModel(this.form);
    Object.assign(this.product, petInfo);
    return <CheckoutStepInsuranceInfoMiFidoProduct>Object.assign({}, this.product, petInfo, {insuredSubjects: null});
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  selectPetType(type: string) {
    this.form.patchValue({kind: type});
    if (type === 'dog') {
      this.form.controls.breed.setValidators(Validators.required);
      this.form.controls.informationPackage.setValidators(Validators.required);
    } else {
      this.form.controls.breed.patchValue(null);
      this.form.controls.breed.setValidators(null);
      this.form.controls.informationPackage.patchValue(null);
      this.form.controls.informationPackage.setValidators(null);
    }
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    const product = <CheckoutStepInsuranceInfoMiFidoProduct>this.computeProduct();
    lineItem['pet_attributes'] = Object.assign({
      breed: product.breed,
      microchip_code: product.chip,
      kind: product.kind,
      birth_date: moment(product.birthDate).format('YYYY-MM-DD')
    });

  }

}
