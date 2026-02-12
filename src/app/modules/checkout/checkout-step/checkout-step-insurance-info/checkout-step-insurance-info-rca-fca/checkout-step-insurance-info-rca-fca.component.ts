import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarAttributes, LineFirstItem } from '@model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';

@Component({
  selector: 'app-checkout-step-insurance-info-rca-fca',
  templateUrl: './checkout-step-insurance-info-rca-fca.component.html',
  styleUrls: ['./checkout-step-insurance-info-rca-fca.component.scss']
})
export class CheckoutStepInsuranceInfoRcaFcaComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: FormGroup;
  data: any;
  displacementRange: string;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  powerSupplyList: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    private kenticoTranslateService: KenticoTranslateService,
    private authService: AuthService,
    private insurancesService: InsurancesService
  ) {
    super();
  }

  ngOnInit() {
    this.getPowerSupplyList()
    this.form = this.createFormGroup()
    this.minDate = TimeHelper.fromDateToNgbDate(moment("1950", "YYYY").toDate())
    this.maxDate = TimeHelper.fromDateToNgbDate(moment().toDate())
    this.kenticoTranslateService.getItem<any>('checkout_rc_auto').pipe(take(1)).subscribe(
      item => this.setData(item)
    );
    this.displacementRange = this.getDisplacementRangeFromOrder();
  }

  getPowerSupplyList(): void {
    this.insurancesService.getRcPowerSupplies().subscribe(powerSupplies =>
      this.powerSupplyList = powerSupplies
    )
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      modelDescription:   [null,  Validators.required],
      powerSupply:        [null,  Validators.required],
      licensePlate:       [null,  Validators.required],
      displacement:       [null,  Validators.required],
    }) 
    return formGroup
  }

  setData(kenticoItem) {
    const lineItem = this.product.order.line_items[0];
    const dataLabels = {
      displacement: kenticoItem.card_list.card_rc_auto.displacement.value,
      birth_date: kenticoItem.card_list.card_rc_auto.birth_date.value,
      residential_city: kenticoItem.card_list.card_rc_auto.residential_city.value,
    };
    const dataValues = {
      displacement: this.getDisplacementRangeFromOrder(),
      birth_date: moment(this.authService.currentUser.birth_date, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      residential_city: lineItem.insurance_info.province
    };

    const displayData = Object.keys(dataLabels).map(key => ({ label: dataLabels[key], value: dataValues[key] }));

    this.data = {
      title: kenticoItem.card_list.card_rc_auto.title.value,
      product_icon: this.product.image,
      display_data: displayData
    };
  }
  
  getDisplacementRangeFromOrder() {
    return this.product.order.line_items[0].insurance_info.displacement_label;
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    return Object.assign({}, this.product, {insuredIsContractor: true});
  }

  onBeforeNextStep(): Observable<any> {
   return of(null);
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    const carAttributes = lineItem.car_attributes || new CarAttributes();
    const insuranceInfoAttributes = this.product.order.line_items[0].insurance_info
    carAttributes['model_description'] = this.form.controls['modelDescription'].value
    carAttributes['power_supply'] = this.form.controls['powerSupply'].value.code
    carAttributes['license_plate'] = this.form.controls['licensePlate'].value
    carAttributes['displacement'] = this.form.controls['displacement'].value
    carAttributes['car_type'] = insuranceInfoAttributes.car_type
    carAttributes['family_rc'] = insuranceInfoAttributes.family_rc
    carAttributes['family_rc_license_plate'] = insuranceInfoAttributes.family_rc_license_plate
    carAttributes['family_rc_fiscal_code'] = insuranceInfoAttributes.family_rc_fiscal_code
    carAttributes['family_rc_origin_class'] = insuranceInfoAttributes.family_rc_origin_class
    carAttributes['brand'] = insuranceInfoAttributes.genertel_brand
    carAttributes['brand_description'] = insuranceInfoAttributes.genertel_brand_description
    lineItem.car_attributes = carAttributes;
  }

}
