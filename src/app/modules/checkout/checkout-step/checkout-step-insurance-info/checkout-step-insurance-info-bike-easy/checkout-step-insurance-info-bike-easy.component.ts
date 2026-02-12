import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import * as moment from 'moment';
import { CheckoutCardDateTimeComponent } from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import { CheckoutCardInsuredSubjectsComponent } from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import { CheckoutPeriod, CheckoutProductCostItem, CheckoutProductCostItemType } from '../../../checkout.model';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { CheckoutStepService } from '../../../services/checkout-step.service';
import { AuthService, DataService, InsurancesService, UserService } from '@services';
import { ConsentFormComponent } from '../../../../../shared/consent-form/consent-form.component';
import { switchMap, take, tap } from 'rxjs/operators';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-step-insurance-info-bike-easy',
  templateUrl: './checkout-step-insurance-info-bike-easy.component.html',
  styleUrls: ['./checkout-step-insurance-info-bike-easy.component.scss']
})
export class CheckoutStepInsuranceInfoBikeEasyComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  tenant: string;
  showConsent = false;

  minAgeBirthDate = moment().subtract(10, 'year').format('DD/MM/YYYY');

  periodOptions: { maxDate: Date };

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;
  @ViewChild('consent') consent: ConsentFormComponent;

  constructor(private checkoutStepService: CheckoutStepService,
    private dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private insuranceService: InsurancesService,
    private authService: AuthService,
    protected nypInsuranceService: NypInsurancesService,
    private nypUserService: NypUserService) {
    super();
  }

  ngOnInit() {
    this.tenant = this.dataService.tenantInfo.tenant;
    this.product.durationUnit = 'year';
    const numberOfInstalments = moment(this.product.endDate).diff(moment(this.product.startDate), 'months');
    const instalmentAmount = this.product.costItems.find(item => item.type === CheckoutProductCostItemType.total).amount;

    const costItems = this.product.costItems.filter(item => item.type !== CheckoutProductCostItemType.regular)
      .map(item => item.type === CheckoutProductCostItemType.total ? Object.assign(item, { name: 'Rata mensile' }) : item);

    costItems.unshift({ type: CheckoutProductCostItemType.regular, amount: instalmentAmount, period: numberOfInstalments, name: 'Totale' });
    costItems.unshift({ type: CheckoutProductCostItemType.propertyValue, amount: null, value: '1 ANNO', name: 'Duarata' });

    this.checkoutStepService.afterCheckoutCouponApplied$.subscribe(() => {
      this.adjustDiscountPrice();
    });
    this.setShowConsent();


    this.checkoutStepService.potentialPriceChange({
      current: this.product.costItems.find(ci => ci.type === CheckoutProductCostItemType.total).amount,
      previous: this.product.costItems.find(ci => ci.type === CheckoutProductCostItemType.total).amount,
      reason: '',
      costItems
    });
    this.periodOptions = { maxDate: moment().add(8, 'days').toDate() };
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

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign({}, this.product, period, { insuredIsContractor, insuredSubjects, instant: period.instant });
  }

  isFormValid(): boolean {
    if (this.showConsent) {
      return (this.periodCard.form.valid && this.insuredSubjectsCard.form.valid && this.consent.consentForm.valid);
    } else {
      return (this.periodCard.form.valid && this.insuredSubjectsCard.form.valid);
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

  private adjustDiscountPrice() {
    const discounts: CheckoutProductCostItem[] = this.product.costItems.filter(item => item.type === CheckoutProductCostItemType.discount);
    if (!discounts || discounts.length < 1) {
      return;
    }

    // Show total discount (whole insured period)
    const discountItem = discounts[0];
    const numberOfInstalments = moment(this.product.endDate).diff(moment(this.product.startDate), 'months');
    discountItem.period = numberOfInstalments;

    this.checkoutStepService.potentialPriceChange({
      current: this.checkoutStepService.recalculateCostItems(this.product.costItems, false, false),     // ignore insured period to calculate month price
      previous: 0,
      reason: '',
      costItems: this.product.costItems
    });
  }
}

