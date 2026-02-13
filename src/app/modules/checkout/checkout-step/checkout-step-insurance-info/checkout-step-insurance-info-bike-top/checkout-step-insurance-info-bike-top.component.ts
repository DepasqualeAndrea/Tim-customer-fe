import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import * as moment from 'moment';
import { CheckoutCardDateTimeComponent } from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import { CheckoutCardInsuredSubjectsComponent } from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import { CheckoutStepService } from '../../../services/checkout-step.service';
import { CheckoutPeriod, CheckoutProductCostItem, CheckoutProductCostItemType } from '../../../checkout.model';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BikeTopInfo, CheckoutStepInsuranceInfoBikeTopProduct } from './checkout-step-insurance-info-bike-top.model';
import { TimeHelper } from '../../../../../shared/helpers/time.helper';
import { LineFirstItem } from '@model';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService, InsurancesService, UserService } from '@services';
import { ConsentFormComponent } from '../../../../../shared/consent-form/consent-form.component';
import { switchMap, take, tap } from 'rxjs/operators';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-checkout-step-insurance-info-bike-top',
    templateUrl: './checkout-step-insurance-info-bike-top.component.html',
    styleUrls: ['./checkout-step-insurance-info-bike-top.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoBikeTopComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  minAgeBirthDate = moment().subtract(10, 'year').format('DD/MM/YYYY');

  minPurchaseDate: NgbDateStruct;

  maxPurchaseDate: NgbDateStruct;

  form: UntypedFormGroup;

  tenant: string;
  showConsent = false;


  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;
  @ViewChild('consent') consent: ConsentFormComponent;


  constructor(private formBuilder: UntypedFormBuilder,
    private checkoutStepService: CheckoutStepService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    public calendar: NgbCalendar,
    private dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private insuranceService: InsurancesService,
    private authService: AuthService,
    protected nypInsuranceService: NypInsurancesService,
    protected nypUserService: NypUserService) {
    super();
    this.minPurchaseDate = calendar.getPrev(this.calendar.getToday(), 'y', 3);
    this.maxPurchaseDate = calendar.getPrev(this.calendar.getToday(), 'd', 1);
  }

  ngOnInit() {
    this.tenant = this.dataService.tenantInfo.tenant;
    const product: CheckoutStepInsuranceInfoBikeTopProduct = Object.assign(this.product);
    this.product.durationUnit = 'year';
    const numberOfInstalments = moment(this.product.endDate).diff(moment(this.product.startDate), 'months');
    const instalmentAmount = this.product.costItems.find(item => item.type === CheckoutProductCostItemType.total).amount;
    const costItems = this.product.costItems.filter(item => item.type !== CheckoutProductCostItemType.regular)
      .map(item => item.type === CheckoutProductCostItemType.total ? Object.assign(item, { name: 'Rata mensile' }) : item);

    costItems.unshift({ type: CheckoutProductCostItemType.regular, amount: instalmentAmount, period: numberOfInstalments, name: 'Totale' });
    costItems.unshift({ type: CheckoutProductCostItemType.propertyValue, amount: null, value: '1 ANNO', name: 'Durata' });

    this.setShowConsent();

    this.checkoutStepService.afterCheckoutCouponApplied$.subscribe(() => {
      this.adjustDiscountPrice();
    });

    this.checkoutStepService.potentialPriceChange({
      current: this.product.costItems.find(ci => ci.type === CheckoutProductCostItemType.total).amount,
      previous: this.product.costItems.find(ci => ci.type === CheckoutProductCostItemType.total).amount,
      reason: '',
      costItems
    });
    this.form = this.formBuilder.group({
      brand: new UntypedFormControl(product.brand, [Validators.required]),
      model: new UntypedFormControl(product.model, [Validators.required]),
      purchaseDate: new UntypedFormControl(product.purchaseDate && TimeHelper.fromDateToNgbDate(product.purchaseDate) || null, [Validators.required])
    });
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

  fromViewToModel(form: UntypedFormGroup): BikeTopInfo {
    return {
      brand: form.controls.brand.value,
      model: form.controls.model.value,
      purchaseDate: TimeHelper.fromNgbDateToDate(form.controls.purchaseDate.value)
    };
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const bikeTopInfo: BikeTopInfo = this.fromViewToModel(this.form);
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign({}, this.product, period, bikeTopInfo, { insuredIsContractor, insuredSubjects, instant: period.instant });
  }

  isFormValid(): boolean {
    if (this.showConsent) {
      return (this.periodCard.form.valid && this.insuredSubjectsCard.form.valid && this.consent.consentForm.valid && this.form.valid);
    } else {
      return (this.periodCard.form.valid && this.insuredSubjectsCard.form.valid && this.form.valid);
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

  fillLineItem(lineItem: LineFirstItem): void {
    const product: CheckoutStepInsuranceInfoBikeTopProduct = Object.assign(this.computeProduct());
    lineItem.bike_attributes = {
      brand: product.brand,
      model: product.model,
      purchase_date: moment(product.purchaseDate).format('YYYY-MM-DD')
    };
  }

  private adjustDiscountPrice() {
    const discounts: CheckoutProductCostItem[] = this.product.costItems.filter(item => item.type === CheckoutProductCostItemType.discount);
    if (!discounts || discounts.length < 1) {
      return;
    }

    // Show total discount (whole insured period)
    const discountItem = discounts[0];
    discountItem.period = moment(this.product.endDate).diff(moment(this.product.startDate), 'months');

    this.checkoutStepService.potentialPriceChange({
      current: this.checkoutStepService.recalculateCostItems(this.product.costItems, false, false),     // ignore insured period to calculate month price
      previous: 0,
      reason: '',
      costItems: this.product.costItems
    });
  }
}

