import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutInsuredShipment, CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutStepPaymentDocumentsAcceptance} from '../../checkout-step-payment/checkout-step-payment.model';
import {CheckoutCardInsuredSubjectsComponent} from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {CheckoutStepPaymentDocumentsAcceptanceComponent} from '../../checkout-step-payment/checkout-step-payment-documents-acceptance/checkout-step-payment-documents-acceptance.component';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import {take} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {CheckoutCardInsuredShipmentComponent} from '../../../checkout-card/checkout-card-insured-shipment/checkout-card-insured-shipment.component';
import {CheckoutCardInsuredPetComponent} from '../../../checkout-card/checkout-card-insured-pet/checkout-card-insured-pet.component';
import * as moment from 'moment';
import {NgbDateStructAdapter} from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import {PetsAttributes} from '@model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-step-insurance-info-pet-civibank',
  templateUrl: './checkout-step-insurance-info-pet-civibank.component.html',
  styleUrls: ['./checkout-step-insurance-info-pet-civibank.component.scss']
})
export class CheckoutStepInsuranceInfoPetCivibankComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  maxBirthDatePet: NgbDate;
  documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  errorMessagesVisible = false;
  formPetKenticoBody: any;
  errorMessages = {};
  form: FormGroup;
  newDocAcceptance: string;

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;
  @ViewChild('petsFormsCard', { static: true }) petsFormsCard: CheckoutCardInsuredPetComponent;
  @ViewChild('insuredSubjectsShipment') insuredSubjectsShipment: CheckoutCardInsuredShipmentComponent;
  @ViewChild('documentAcceptanceCard', { static: true }) documentAcceptanceCard: CheckoutStepPaymentDocumentsAcceptanceComponent;

  constructor(private kenticoTranslateService: KenticoTranslateService,
              private calendar: NgbCalendar,
              public formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.maxBirthDatePet = this.calendar.getToday();
    const product = Object.assign({}, this.product, {documentsAcceptance: this.documentsAcceptance});
    this.product = product;
    this.kenticoTranslateService.getItem<any>('checkout_pet').pipe(take(1)).subscribe(item => {
      const stepInfo = item.step___insurance_info.value;
      this.formPetKenticoBody = item.step___insurance_info.form_insured_animal;
      this.newDocAcceptance = stepInfo.find(item => item.system.codename === "new_documents_acceptance").text.value
      stepInfo.filter(i => i.system.codename.includes('error'))
        .forEach(error => Object.defineProperty(this.errorMessages, error.system.codename, {value: error.text.value}));
    });
    this.form = this.formBuilder.group({
      checkbox_documents: new FormControl('', [Validators.required]),
    })
  }

  handleDocumentAcceptanceChange(docAcceptance: CheckoutStepPaymentDocumentsAcceptance) {
    this.documentsAcceptance = docAcceptance;
  }

  isFormValid(): boolean {
    return this.insuredSubjectsCard.form.valid && this.petsFormsCard.formInsuredPet.valid;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    let insuredShipments: CheckoutInsuredShipment[];
    let isContractorShipment: boolean;
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    const insuredPets: PetsAttributes[] = this.petsFormsCard.computeModel();
    if (this.insuredSubjectsShipment) {
      isContractorShipment = this.insuredSubjectsShipment.isContractorShipment();
      insuredShipments = isContractorShipment ? undefined : this.insuredSubjectsShipment.computeModel();
    }
    return Object.assign({}, this.product, {insuredIsContractor, insuredSubjects, insuredShipments, isContractorShipment, insuredPets});
  }

  onBeforeNextStep(): Observable<any> {
    if (!this.form.get('checkbox_documents').valid) {
      return throwError(new Error());
    }
    return of(null);
  }
}
