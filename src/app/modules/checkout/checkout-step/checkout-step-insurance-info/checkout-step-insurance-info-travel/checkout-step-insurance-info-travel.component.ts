import {take} from 'rxjs/operators';
import {KenticoTranslateService} from './../../../../kentico/data-layer/kentico-translate.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutCardInsuredSubjectsComponent} from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import * as moment from 'moment';
import {Observable, of, throwError} from 'rxjs';
import {CheckoutStepPaymentDocumentsAcceptanceComponent} from '../../checkout-step-payment/checkout-step-payment-documents-acceptance/checkout-step-payment-documents-acceptance.component';
import {CheckoutStepPaymentDocumentsAcceptance} from '../../checkout-step-payment/checkout-step-payment.model';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutStepService} from '../../../services/checkout-step.service';
import {CheckoutService} from '@services';
import {ToastrService} from 'ngx-toastr';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-checkout-step-insurance-info-travel',
    templateUrl: './checkout-step-insurance-info-travel.component.html',
    styleUrls: ['./checkout-step-insurance-info-travel.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoTravelComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  maxBirthDate: string;
  minBirthDate: string;
  documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  errorMessagesVisible = false;
  errorMessages = {};
  errorMessagesAddonsPremium = {
    description_warning_addons_premium: '',
    title_warning_addons_premium: ''
  };
  form: UntypedFormGroup;
  newDocAcceptance: string;
  formTravelCancellationValue: boolean = true;

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;
  // @ViewChild('documentAcceptanceCard', { static: true }) documentAcceptanceCard: CheckoutStepPaymentDocumentsAcceptanceComponent;

  constructor(private kenticoTranslateService: KenticoTranslateService,
              private checkoutStepService: CheckoutStepService,
              private checkoutService: CheckoutService,
              private toastrService: ToastrService,
              public formBuilder: UntypedFormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.maxBirthDate = moment(this.product.endDate).subtract(this.product.originalProduct.holder_maximum_age, 'years').subtract(1, 'day').format('DD/MM/YYYY');
    this.minBirthDate = moment().subtract(this.product.originalProduct.holder_minimum_age, 'years').format('DD/MM/YYYY');
    const product = Object.assign({}, this.product, {documentsAcceptance: this.documentsAcceptance});
    this.product = product;
    this.kenticoTranslateService.getItem<any>('checkout_travel').pipe(take(1)).subscribe(item => {
      const stepInfo = item.step_insurance_info.value;
      this.newDocAcceptance = stepInfo.find(item => item.system.codename === "new_documents_acceptance_travel").text.value
      stepInfo.filter(i => i.system.codename.includes('error'))
        .forEach(error => Object.defineProperty(this.errorMessages, error.system.codename, {value: error.text.value}));
      this.errorMessagesAddonsPremium.description_warning_addons_premium = stepInfo.find(i => i.system.codename === 'description_warning_addons_premium').text.value;
      this.errorMessagesAddonsPremium.title_warning_addons_premium = stepInfo.find(i => i.system.codename === 'title_warning_addons_premium').text.value;
    });
    this.form = this.formBuilder.group({
      checkbox_documents: new UntypedFormControl(this.checkoutStepService.step.completed, [Validators.required]),
    })
  }

  handleDocumentAcceptanceChange(docAcceptance: CheckoutStepPaymentDocumentsAcceptance) {
    this.documentsAcceptance = docAcceptance;
  }

  handleAddonsChange(addons: any) {
    this.checkoutStepService.priceChangeAfterSelectedAddons(this.createRequestQuoteTravel(addons));
  }

  isFormValid(): boolean {
    return this.insuredSubjectsCard.form.valid && this.form.get('checkbox_documents').value && this.formTravelCancellationValue;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign({}, this.product, {insuredIsContractor, insuredSubjects});
  }

  onBeforeNextStep(): Observable<any> {
    const addonsSelected = this.checkoutService.getAddonsStepInsuranceInfo();
    if (!(this.form.get('checkbox_documents').valid) || (addonsSelected.length <= 2 && this.product.code === 'htrv-premium')) {
      // if (this.documentAcceptanceCard.form.invalid) {
        this.errorMessagesVisible = true;
      // }
      if (addonsSelected.length <= 2 && this.product.code === 'htrv-premium') {
        this.toastrService.warning(
          this.errorMessagesAddonsPremium.description_warning_addons_premium,
          this.errorMessagesAddonsPremium.title_warning_addons_premium,
          {
            timeOut: 5000,
          });
      }
      return throwError(new Error());
    }
    return of(null);
  }

  createRequestQuoteTravel(addons: any) {
    const lineItem = this.product.order.line_items[0];
    return {
      token: localStorage.getItem('token-dhi'),
      tenant: 'civibank',
      product_code: this.product.code,
      product_data: {
        variant_name: lineItem.variant.name,
        quantity: lineItem.quantity,
        start_date: lineItem.start_date.split('T')[0],
        expiration_date: lineItem.expiration_date.split('T')[0],
        destinations: lineItem.insurance_info.destinations.map(element => {
          return {
            code: element.id.toString(),
            name: element.country,
            zone: element.area
          };
        }),
        addons: this.createAddonsRequestQuote(addons)
      }
    };
  }

  createAddonsRequestQuote(addons: any) {
    const arrayAddon = [];
    addons.forEach(addon => {
      arrayAddon.push({
        code: addon.code,
        maximal: addon.selectedMaximal,
        purchase_date: addon.datePurchase,
        travel_value: addon.valueTravel
      });
    });
    return arrayAddon;
  }

  formTravelCancellation(value: boolean): void {
    this.formTravelCancellationValue = value;
  }
}
