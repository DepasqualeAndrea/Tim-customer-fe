import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InsuranceInfoAttributes, LineFirstItem } from '@model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';

@Component({
  selector: 'app-checkout-step-insurance-info-yolo-cyber',
  templateUrl: './checkout-step-insurance-info-yolo-cyber.component.html',
  styleUrls: ['./checkout-step-insurance-info-yolo-cyber.component.scss']
})
export class CheckoutStepInsuranceInfoYoloCyberComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  data: any;
  email = <{
    label: string;
    value: string;
  }>{};
  disabledEmail = false;

  form: FormGroup;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private formBuilder: FormBuilder
  ) {
    super();
   }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl(this.email && this.email.value || undefined, [Validators.required])
    });
    const emailControl = this.form.get('email');
    if (emailControl.untouched && emailControl.valid) {
      this.disabledEmail = true;
    }
    this.kenticoTranslateService.getItem<any>('checkout_cyber').pipe(take(1)).subscribe(
      item => this.setData(item)
    );
  }

  setData(kenticoItem) {
    this.data = {
      title: kenticoItem.step_insurance_info.technical_contact_title.text.value,
      description: kenticoItem.step_insurance_info.info_email_technical_contact.text.value,
    };
    this.email.label = kenticoItem.step_insurance_info.form_email_technical_contact.text.value;
  }



  isFormValid(): boolean {
    return this.form.valid;
  }

  computeProduct() {
    const insuredIsContractor = true;
    const email = this.form.controls.email.value;
    return Object.assign({}, this.product, { insuredIsContractor, email });
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    insuranceInfoAttributes['it_contact'] = product.email;
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }

}
