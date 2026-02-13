import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LineFirstItem } from '@model';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoMiFidoProduct, PetInfo } from '../checkout-step-insurance-info-mi-fido/checkout-step-insurance-info-mi-fido.model';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';

@Component({
    selector: 'app-checkout-step-insurance-info-my-pet',
    templateUrl: './checkout-step-insurance-info-my-pet.component.html',
    styleUrls: ['./checkout-step-insurance-info-my-pet.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoMyPetComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: UntypedFormGroup;

  kinds: any[];

  maxBirthDate: NgbDateStruct;
  minBirthDate: NgbDateStruct;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) {
    super();
  }

  ngOnInit() {
    this.minBirthDate = TimeHelper.fromDateToNgbDate(moment().subtract(9, 'y').add(1, 'day').toDate());
    this.maxBirthDate = TimeHelper.fromDateToNgbDate(moment().subtract(181, 'day').toDate());
    const kinds = this.product.order.line_items[0].pet_properties.kinds;
    this.kinds = Object.keys(kinds).map(k => ({ key: k, value: kinds[k] }));

    const product: CheckoutStepInsuranceInfoMiFidoProduct = Object.assign(this.product);
    this.form = this.formBuilder.group({
      petName: new UntypedFormControl(product.petName || null, [Validators.required]),
      kind: new UntypedFormControl(product.kind || 'dog', [Validators.required]),
      birthDate: new UntypedFormControl(TimeHelper.fromDateToNgbDate(product.birthDate), [Validators.required]),
      privacy: new UntypedFormControl(false, [Validators.required])
    });
  }

  fromViewToModel(form: UntypedFormGroup): PetInfo {
    return {
      petName: form.controls.petName.value,
      kind: form.controls.kind.value,
      chip: null,
      breed: null,
      birthDate: TimeHelper.fromNgbDateToDate(form.controls.birthDate.value),
      informationPackage: form.controls.privacy.value,
    };
  }

  selectPetType(type: string) {
    this.form.patchValue({ kind: type });
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const petInfo: PetInfo = this.fromViewToModel(this.form);
    Object.assign(this.product, petInfo);
    return <CheckoutStepInsuranceInfoMiFidoProduct>Object.assign({}, this.product, {insuredSubjects: null});  }

  onBeforeNextStep(): Observable<any> {
    const form: any = {
      paymentmethod: '',
      mypet_pet_type: this.form.controls.kind.value,
      codice_sconto: 'no',
      sci_numassicurati: 0,
      sci_min14: 0,
      sci_polizza: '',
    }
    let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.product, 1, "", {}, form, 'tim broker', '');
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);


    return of(null);
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    const product = <CheckoutStepInsuranceInfoMiFidoProduct>this.computeProduct();
    lineItem['pet_attributes'] = Object.assign({
      name: product.petName,
      kind: product.kind,
      birth_date: moment(product.birthDate).format('YYYY-MM-DD')
    });
  }

}
