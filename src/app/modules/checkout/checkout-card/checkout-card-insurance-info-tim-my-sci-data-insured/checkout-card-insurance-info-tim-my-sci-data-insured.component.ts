import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutStepInsuranceInfoProduct } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';
import moment from 'moment';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { CheckoutCardInsuredSubjectsComponent } from '../checkout-card-insured-subjects/checkout-card-insured-subjects.component';

@Component({
  selector: 'app-checkout-card-insurance-info-tim-my-sci-data-insured',
  templateUrl: './checkout-card-insurance-info-tim-my-sci-data-insured.component.html',
  styleUrls: ['./checkout-step-insurance-info-tim-my-sci-data-insured.component.scss']
})
export class CheckoutCardInsuranceInfoTimMySciDataInsuredComponent implements OnInit {

  form: FormGroup;

  @Input() insuredNumber : number;
  @Output() operation:  EventEmitter<string> = new EventEmitter<string>();
  @Output() sendInsuredForms:  EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() product: CheckoutStepInsuranceInfoProduct;
  maxBirthDate: string;
  minBirthDate: string;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  showConsent: boolean = false;

  constructor(
    private infoComponent: CheckoutStepInsuranceInfoComponent
  ) {
  }

  ngOnInit() {
    this.maxBirthDate = moment().subtract(this.product.originalProduct.holder_maximum_age, 'years').format('DD/MM/YYYY');
    this.minBirthDate = moment().subtract(this.product.originalProduct.holder_minimum_age, 'years').format('DD/MM/YYYY');
  }

  isFormValid(): boolean {
    return this.insuredSubjectsCard.form.valid;
  }

  submit(): void {
    this.sendInsuredForms.emit(this.insuredSubjectsCard.form);
    this.infoComponent.handleNextStep();
  }

  previousPage() {
    this.operation.emit('prev');
  }

}
