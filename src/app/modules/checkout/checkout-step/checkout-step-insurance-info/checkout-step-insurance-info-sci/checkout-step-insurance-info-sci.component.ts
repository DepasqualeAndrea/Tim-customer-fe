import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import * as moment from 'moment';
import { CheckoutCardDateTimeComponent } from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import { CheckoutCardInsuredSubjectsComponent } from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import { DataService, InsurancesService, UserService, AuthService } from '@services';
import { CheckoutPeriod } from '../../../checkout.model';
import { Observable } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { of } from 'rxjs/internal/observable/of';
import { LineFirstItem } from '@model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { take } from 'rxjs/operators';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';
@Component({
    selector: 'app-checkout-step-insurance-info-sci',
    templateUrl: './checkout-step-insurance-info-sci.component.html',
    styleUrls: ['./checkout-step-insurance-info-sci.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoSciComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  showConsent: boolean = false;
  minAgeBirthDate = moment().subtract(4, 'year').format('DD/MM/YYYY');
  maxAgeBirthDate = moment().subtract(70, 'year').add(1, 'day').format('DD/MM/YYYY');
  periodOptions: { maxDate: Date, minDate: Date } = { maxDate: undefined, minDate: undefined };
  disableDateCondition: (date: NgbDate) => boolean;
  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;
  @ViewChild('consent') consent: ConsentFormComponent;

  constructor(
    public dataService: DataService,
    private authService: AuthService,
    private nypUserService: NypUserService,
    protected nypInsuranceService: NypInsurancesService,
    private componentFeaturesService: ComponentFeaturesService
  ) {
    super();
  }

  ngOnInit() {
    this.product.extra = Object.assign({ label: 'Sport prevalente', values: [] }, this.product.extra);
    this.product.extraSelected = this.dataService.getResponseOrder().line_items[0].insurance_info.extra;
    this.periodOptions.minDate = moment(this.dataService.getResponseOrder().line_items[0].start_date).toDate();
    this.product.duration = this.product.duration || moment(this.product.endDate).diff(this.product.startDate, 'days');
    this.product.durationUnit = this.product.durationUnit || 'days';
    this.setShowConsent();
    this.checkDateCondition();
  }

  setShowConsent() {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('show-consent');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.nypInsuranceService.getInsurances().pipe(take(1)).subscribe(res => {
        this.showConsent = res.insurances.length === 0;
      });
    } else {
      this.showConsent = false;
    }
  }

  checkDateCondition() {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info-sci');
    this.componentFeaturesService.useRule('insurance-date');
    const constraints: Map<string, any> = this.componentFeaturesService.getConstraints();
    if (this.componentFeaturesService.isRuleEnabled()) {
      const startDate: Date = new Date(constraints.get('start-date').toString());
      const endDate: Date = new Date(constraints.get('end-date').toString());
      this.disableDateCondition = (date) => date.month > startDate.getMonth() && date.month < endDate.getMonth();        // Disabilita tutti i giorni da inizio maggio a fine ottobre
    } else {
      this.disableDateCondition = d => false;                                         // Non disabilitare nessuna data
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
      this.nypUserService.editUser(user).subscribe(() => {
        this.authService.setCurrentUserFromLocalStorage();
      }
      );
    }
    return of(null);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    if (this.dataService.tenantInfo.tenant === 'yolo-crif_db') {
      return;
    } else {
      lineItem.insurance_info_attributes = { extra: null };
    }
  }

}
