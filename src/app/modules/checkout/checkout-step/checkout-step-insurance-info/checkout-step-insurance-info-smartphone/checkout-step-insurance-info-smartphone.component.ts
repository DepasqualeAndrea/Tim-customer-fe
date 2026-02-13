import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutStepInsuranceInfoSmartphoneProduct } from './checkout-step-insurance-info-smartphone.model';
import { TimeHelper } from '../../../../../shared/helpers/time.helper';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { CheckoutStepService } from '../../../services/checkout-step.service';
import { CheckoutProductCostItem, CheckoutProductCostItemType } from '../../../checkout.model';
import { InsuranceInfoAttributes, LineFirstItem } from '@model';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { AuthService, DataService, InsurancesService, UserService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { switchMap, take, tap } from 'rxjs/operators';
import { Constraint } from '../../../../../core/models/componentfeatures/constraint.model';
import { NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';


@Component({
    selector: 'app-checkout-step-insurance-info-smartphone',
    templateUrl: './checkout-step-insurance-info-smartphone.component.html',
    styleUrls: ['./checkout-step-insurance-info-smartphone.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoSmartphoneComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: UntypedFormGroup;

  maxPurchaseDate: NgbDateStruct;
  minPurchaseDate: NgbDateStruct;

  deviceTestLabel: string;

  autoCheckup = true;

  showConsent = false;

  @ViewChild('consent') consent: ConsentFormComponent;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public calendar: NgbCalendar,
    private checkoutStepService: CheckoutStepService,
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    protected nypInsuranceService: NypInsurancesService,
    private authService: AuthService,
    private nypUserService: NypUserService,
    public componentFeaturesService: ComponentFeaturesService,
  ) {
    super();
    this.maxPurchaseDate = calendar.getPrev(this.calendar.getToday(), 'd', 1);
    this.minPurchaseDate = this.calendar.getPrev(this.calendar.getToday(), 'y', 2);
    this.minPurchaseDate.day = this.calendar.getToday().day;
    this.minPurchaseDate.month = this.calendar.getToday().month;
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('checkout.device_test_cost').subscribe(label => this.deviceTestLabel = label.value);
    Object.assign(this.product, {
      brand: this.product.order.line_items[0].insurance_info.covercare_brand,
      model: this.product.order.line_items[0].insurance_info.covercare_model,
      technology: this.product.order.line_items[0].insurance_info.covercare_technology,
    });

    this.form = this.formBuilder.group({
      imeiCode: new UntypedFormControl((this.product as CheckoutStepInsuranceInfoSmartphoneProduct).imeiCode, [
        Validators.minLength(15), Validators.maxLength(15), Validators.required, Validators.pattern(/^[0-9]*$/)]),
      receiptNumber: new UntypedFormControl((this.product as CheckoutStepInsuranceInfoSmartphoneProduct).receiptNumber),
      purchaseDate: new UntypedFormControl((this.product as CheckoutStepInsuranceInfoSmartphoneProduct).purchaseDate && TimeHelper.fromDateToNgbDate(moment((this.product as CheckoutStepInsuranceInfoSmartphoneProduct).purchaseDate, 'DD/MM/YYYY').toDate()) || null, [Validators.required]),
      askForDeviceCheck: new UntypedFormControl((this.product as CheckoutStepInsuranceInfoSmartphoneProduct).askForDeviceCheck),
      phoneNumber: new UntypedFormControl((this.product as CheckoutStepInsuranceInfoSmartphoneProduct).phoneNumber, [Validators.required, Validators.pattern('[(+).0-9\ ]*')])
    });

    this.setShowConsent();
    this.autoCheckup = this.isCheckupAutoIncluded();
  }

  setShowConsent() {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('show-consent');
    const showConsentEnabled = this.componentFeaturesService.isRuleEnabled();
    if (showConsentEnabled) {
      this.nypInsuranceService.getInsurances().pipe(take(1)).subscribe(res => {
        this.showConsent = res.insurances.length === 0;
      });
    } else {
      this.showConsent = false;
    }
  }

  /**
   * Indicates when checkup is auto included into product.
   */
  private isCheckupAutoIncluded(): boolean {
    return !this.isCheckUpCheckboxEnabled();
  }

  /**
   * indicates if the whole device checkup panel is enabled
   */
  isCheckupEnabled(): boolean {
    this.componentFeaturesService.useComponent('smartphone-insurance-info');
    this.componentFeaturesService.useRule('checkup_device');
    if (!this.componentFeaturesService.isRuleEnabled()) {
      return false;
    }

    const whole: boolean = this.componentFeaturesService.getConstraints().get('whole-disclaimer');
    return !!whole;
  }

  /**
   * indicates whenever the device checkup "addons" is visible
   */
  isCheckUpCheckboxEnabled(): boolean {
    if (!this.isCheckupEnabled()) {
      return false;
    }

    this.componentFeaturesService.useComponent('smartphone-insurance-info');
    this.componentFeaturesService.useRule('checkup_device');
    if (!this.componentFeaturesService.isRuleEnabled()) {
      return false;
    }

    const checkbox: boolean = this.componentFeaturesService.getConstraints().get('checkbox');
    return !!checkbox;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    return <CheckoutStepInsuranceInfoProduct>Object.assign(this.product, {
      imeiCode: this.form.controls.imeiCode.value,
      receiptNumber: this.form.controls.receiptNumber.value,
      purchaseDate: moment(TimeHelper.fromNgbDateToDate(this.form.controls.purchaseDate.value)).format('DD/MM/YYYY'),
      askForDeviceCheck: this.autoCheckup ? true : this.form.controls.askForDeviceCheck.value,
      insuredIsContractor: true,
      insuredSubjects: null,
      phoneNumber: this.form.controls.phoneNumber.value,
    });
  }

  private createDeviceTestCostItem(): CheckoutProductCostItem {
    return {
      name: this.deviceTestLabel,
      amount: 6,
      type: CheckoutProductCostItemType.regular
    };
  }

  handleAskForDeviceCheckChange() {
    // remove costItem if exists
    this.product.costItems = this.product.costItems.filter(ci => ci.name !== this.deviceTestLabel);

    // is checkbox selected?
    if (this.form.controls.askForDeviceCheck.value) {
      this.product.costItems.unshift(this.createDeviceTestCostItem());
    }

    this.checkoutStepService.potentialPriceChange({
      costItems: Object.assign(this.product.costItems),
      current: this.checkoutStepService.recalculateCostItems(this.product.costItems),
      previous: this.product.costItems.find(ci => ci.type === CheckoutProductCostItemType.total).amount
    });
  }

  isFormValid(): boolean {
    if (this.showConsent) {
      return (this.consent.consentForm.valid &&
        this.form.valid);
    } else {
      return this.form.valid;
    }
  }

  onBeforeNextStep(): Observable<any> {
    if (this.showConsent) {
      const userAcceptancesAttributes = {};
      const user = this.authService.loggedUser;

      user.user_acceptances.forEach((ua: any, index) => {
        if (ua.kind === 'privacy') {
          userAcceptancesAttributes[`${index}`] = {
            id: ua.id,
            value: this.consent.consentForm.controls[ua.tag].value
          };
        }
      });

      user.user_acceptances_attributes = userAcceptancesAttributes;
      return this.nypUserService.editUser(user)
        .pipe(
          tap(() => this.authService.setCurrentUserFromLocalStorage()),
          switchMap(() => of(null)
          ));
    }

    return of(null);
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    const product: CheckoutStepInsuranceInfoSmartphoneProduct = this.computeProduct();
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    insuranceInfoAttributes.covercare_imei = product.imeiCode;
    insuranceInfoAttributes.covercare_receipt_number = product.receiptNumber;
    insuranceInfoAttributes.covercare_purchase_date = product.purchaseDate;
    insuranceInfoAttributes.covercare_test_device = product.askForDeviceCheck;
    insuranceInfoAttributes.covercare_brand = product.brand;
    insuranceInfoAttributes.covercare_model = product.model;
    insuranceInfoAttributes.covercare_technology = product.technology;
    insuranceInfoAttributes.phone_number = product.phoneNumber;
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }
}
