import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { InsuranceInfoAttributes, LineFirstItem } from '@model';
import { CheckoutCardInsuredSubjectsComponent } from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import { CheckoutLinearStepperCommonReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-common-reducer';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoBaggageLossProduct } from '../checkout-step-insurance-info-baggage-loss/checkout-step-insurance-info-baggage-loss.model';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';

@Component({
    selector: 'app-checkout-step-insurance-info-baggage-loss-long-term',
    templateUrl: './checkout-step-insurance-info-baggage-loss-long-term.component.html',
    styleUrls: ['./checkout-step-insurance-info-baggage-loss-long-term.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoBaggageLossLongTermComponent extends CheckoutStepInsuranceInfoDynamicComponent  implements OnInit {

  data: any;
  plate = <{
    label: string;
    value: string;
  }>{};

  form: UntypedFormGroup;

  @ViewChild('insuredSubjectsCard') insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private formBuilder: UntypedFormBuilder
  ) {
    super();
  }

  ngOnInit() {
    const product: CheckoutStepInsuranceInfoBaggageLossProduct = Object.assign(this.product);
    this.form = this.formBuilder.group({
      plate: new UntypedFormControl(undefined, [Validators.required])
    });
    this.kenticoTranslateService.getItem<any>('checkout_baggage_loss_long_term').pipe(take(1)).subscribe(
      item => this.setData(item)
    );
  }

  setData(kenticoItem: any) {
    const lineItem = this.product.order.line_items[0];
    const startDate = new Date(lineItem.start_date);
    const endDate = new Date(lineItem.expiration_date);
    const dataLabels = {
      coverage_start_date: kenticoItem.card_list.card_baggage_loss_long_term.coverage_start_date.value,
      coverage_expiration_date: kenticoItem.card_list.card_baggage_loss_long_term.coverage_expiration_date.value
    };
    const dataValues = {
      coverage_start_date: CheckoutLinearStepperCommonReducer.convertDateAssuranceFormat(startDate),
      coverage_expiration_date: CheckoutLinearStepperCommonReducer.convertDateAssuranceFormat(endDate),
    };
    const displayData = Object.keys(dataLabels).map(key => ({ label: dataLabels[key], value: dataValues[key] }));

    this.data = {
      title: kenticoItem.card_list.card_baggage_loss_long_term.title.value,
      product_icon: this.product.image,
      display_data: displayData
    };
    this.plate.label = kenticoItem.card_list.card_baggage_loss_long_term.plate.value;
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  computeProduct(): CheckoutStepInsuranceInfoBaggageLossProduct {
    const insuredIsContractor = true;
    const plate = this.form.controls['plate'].value;
    return Object.assign({}, this.product, { insuredIsContractor, plate });
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    insuranceInfoAttributes['license_plate'] = product.plate;
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }
}
