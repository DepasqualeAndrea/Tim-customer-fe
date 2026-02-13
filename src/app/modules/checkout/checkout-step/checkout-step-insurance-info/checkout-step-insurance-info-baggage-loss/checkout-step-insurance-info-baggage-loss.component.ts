import { CheckoutStepInsuranceInfoBaggageLossProduct } from './checkout-step-insurance-info-baggage-loss.model';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from './../../../../kentico/data-layer/kentico-translate.service';
import { InsuranceInfoAttributes, LineFirstItem } from './../../../../../core/models/order.model';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutCardInsuredSubjectsComponent } from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import { Observable, of } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutLinearStepperCommonReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-common-reducer';

@Component({
    selector: 'app-checkout-step-insurance-info-baggage-loss',
    templateUrl: './checkout-step-insurance-info-baggage-loss.component.html',
    styleUrls: ['./checkout-step-insurance-info-baggage-loss.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoBaggageLossComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  data: any;
  bookingId = <{
    label: string;
    value: string;
  }>{};
  disabledBookingId = false;

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
    this.bookingId.value = product.order.line_items[0].insurance_info.booking_id;
    this.form = this.formBuilder.group({
      bookingId: new UntypedFormControl(this.bookingId && this.bookingId.value || undefined, [Validators.required])
    });
    const bookingIdControl = this.form.get('bookingId');
    if (bookingIdControl.untouched && bookingIdControl.valid) {
      this.disabledBookingId = true;
    }
    this.kenticoTranslateService.getItem<any>('checkout_baggage_loss').pipe(take(1)).subscribe(
      item => this.setData(item)
    );
  }

  setData(kenticoItem) {
    const lineItem = this.product.order.line_items[0];
    const startDate = new Date(lineItem.start_date);
    const endDate = new Date(lineItem.expiration_date);
    const dataLabels = {
      coverage_start_date: kenticoItem.card_list.card_baggage_loss.coverage_start_date.value,
      coverage_expiration_date: kenticoItem.card_list.card_baggage_loss.coverage_expiration_date.value
    };
    const dataValues = {
      coverage_start_date: CheckoutLinearStepperCommonReducer.convertDateFormat(startDate),
      coverage_expiration_date: CheckoutLinearStepperCommonReducer.convertDateFormat(endDate),
    };
    const displayData = Object.keys(dataLabels).map(key => ({ label: dataLabels[key], value: dataValues[key] }));

    this.data = {
      title: kenticoItem.card_list.card_baggage_loss.title.value,
      product_icon: this.product.image,
      display_data: displayData
    };
    this.bookingId.label = kenticoItem.card_list.card_baggage_loss.booking_id.value;
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  computeProduct(): CheckoutStepInsuranceInfoBaggageLossProduct {
    const insuredIsContractor = true;
    const bookingId = this.form.controls.bookingId.value;
    return Object.assign({}, this.product, { insuredIsContractor, bookingId });
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    insuranceInfoAttributes['booking_id'] = product.bookingId;
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }

}
