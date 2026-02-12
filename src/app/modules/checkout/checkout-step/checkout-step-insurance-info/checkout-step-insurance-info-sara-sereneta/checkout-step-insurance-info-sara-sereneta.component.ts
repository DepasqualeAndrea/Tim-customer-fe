import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct, CheckoutInsuredSubject } from '../checkout-step-insurance-info.model';
import { CheckoutCardInsuredSubjectsComponent } from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { CheckoutPeriod } from 'app/modules/checkout/checkout.model';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService, AuthService, UserService } from '@services';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { KenticoEmptyPipeMap } from 'app/shared/pipe/services/kentico-empty-pipe-map.service';
import { CheckoutCardPeriodComponent } from 'app/modules/checkout/checkout-card/checkout-card-period/checkout-card-period.component';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { take, tap, switchMap } from 'rxjs/operators';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-step-insurance-info-sara-sereneta',
  templateUrl: './checkout-step-insurance-info-sara-sereneta.component.html',
  styleUrls: ['./checkout-step-insurance-info-sara-sereneta.component.scss']
})
export class CheckoutStepInsuranceInfoSaraSerenetaComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  pickerOptions: { opened: boolean, maxDate: NgbDateStruct, minDate: NgbDateStruct } = (
    { opened: false, minDate: null, maxDate: null }
  );

  product: CheckoutStepInsuranceInfoProduct;
  tenant: string;
  minAgeBirthDate = moment().subtract(65, 'year').format('DD/MM/YYYY');
  minBirth = moment().subtract(100, 'year').format('DD/MM/YYYY');

  showConsent = false;

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardPeriodComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;
  @ViewChild('consent') consent: ConsentFormComponent;


  constructor(
    public calendar: NgbCalendar,
    public dataService: DataService,
    private authService: AuthService,
    protected nypInsuranceService: NypInsurancesService,
    private nypUserService: NypUserService,
    private componentFeaturesService: ComponentFeaturesService
  ) {
    super();
    this.pickerOptions.minDate = calendar.getNext(this.calendar.getToday(), 'd', 1);
  }

  ngOnInit() {
    this.tenant = this.dataService.tenantInfo.tenant;
    if (!this.product.startDate) {
      this.product.startDate = TimeHelper.fromNgbDateToDate(this.calendar.getNext(this.calendar.getToday(), 'd', 1));
      this.product.endDate = TimeHelper.fromNgbDateToDate(this.calendar.getNext(this.calendar.getToday(), 'd', 1 + this.product.duration));
    }
    this.setShowConsent();
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
    return Object.assign({}, this.product, period, { insuredIsContractor, insuredSubjects });
  }

  isFormValid(): boolean {
    if (this.showConsent) {
      return (this.consent.consentForm.valid &&
        this.insuredSubjectsCard.form.valid);
    } else {
      return this.insuredSubjectsCard.form.valid;
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

}
