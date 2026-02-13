import { Component, OnInit } from '@angular/core';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { Observable, of } from 'rxjs';
import { CheckoutStepInsuranceInfoCoveredTiresProduct } from './checkout-step-insurance-info-covered-tires.model';
import { LineFirstItem } from '@model';

@Component({
    selector: 'app-checkout-step-insurance-info-covered-tires',
    templateUrl: './checkout-step-insurance-info-covered-tires.component.html',
    styleUrls: ['./checkout-step-insurance-info-covered-tires.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoCoveredTiresComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.vehicleForm(this.product.insuredSubjects[0]);
  }
  vehicleForm(insuredvehicle) {
    const vehicleForm = new UntypedFormGroup({
      brand: new UntypedFormControl(insuredvehicle && insuredvehicle.brand || undefined, [Validators.required]),
      model: new UntypedFormControl(insuredvehicle && insuredvehicle.model || undefined ),
      licensePlate: new UntypedFormControl(insuredvehicle && insuredvehicle.license_plate || undefined, [Validators.required]),
    });
    return vehicleForm;
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    let id;
    if (this.product.insuredSubjects[0]) {
      id = this.product.insuredSubjects[0].id;
    }
    return <CheckoutStepInsuranceInfoProduct>Object.assign(this.product, {
      id: !id ? id : undefined,
      brand: this.form.controls.brand.value,
      model: this.form.controls.model.value,
      licensePlate: this.form.controls.licensePlate.value,
    });
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    const product = <CheckoutStepInsuranceInfoCoveredTiresProduct>this.computeProduct();
    lineItem['vehicle_attributes'] = Object.assign({
      id: product.id,
      brand: product.brand,
      model: product.model,
      license_plate: product.licensePlate,
    });
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

}
