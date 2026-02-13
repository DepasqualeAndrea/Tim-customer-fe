import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Country, State, ResponseOrder, City } from '@model';
import { NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService, UserService } from '@services';
import { CheckoutPeriod } from 'app/modules/checkout/checkout.model';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { ToponymHelper } from 'app/shared/toponym-codes.model';
import moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { StepInfoGenertelSciSubstep, stepInfoGenertelSciSubsteps } from './step-info-generte-lsci-substep.model';
import { InsuranceHolderFormLocation, professions, SelectDateFormOptions } from './step-info-genertel-sci-form.model';
import { contractorIsAdultRequest, TaxcodeCalculationRequest } from 'app/core/services/utils.model';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutSciGenertelContent } from './checkout-step-insurance-info-genertel-sci-content';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { ContentItem } from 'kentico-cloud-delivery';
import { GtmInitDataLayerService } from 'app/core/services/gtm/gtm-init-datalayer.service';
import { insuranceInfoDataLayerSciSubsteps } from './gtm/info-substeps-datalayer.values';
import { NypUserService } from '@NYP/ngx-multitenant-core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMM YYYY',
  },
};
export class Sexes {
  keyValue: string;
  value: string;
}

interface FormValue { [key: string]: any; }

@Component({
    selector: 'app-checkout-step-insurance-info-genertel-sci',
    templateUrl: './checkout-step-insurance-info-genertel-sci.component.html',
    styleUrls: ['./checkout-step-insurance-info-genertel-sci.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    standalone: false
})
export class CheckoutStepInsuranceInfoGenertelSciComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  isCfInvalid = false;
  product: CheckoutStepInsuranceInfoProduct;
  currentSubstep: StepInfoGenertelSciSubstep = StepInfoGenertelSciSubstep.INSURANCE_DATE;
  currentInsured = 0;
  contactorAlreadySelected = false;
  birthCounties: Country[];
  sexes: Sexes[] = [{ keyValue: 'M', value: 'Maschio' }, { keyValue: 'F', value: 'Femmina' }];
  professions = professions;
  startDate: string;
  endDate: string;
  checkoutPeriod: CheckoutPeriod;
  maxDate: Date;
  minDate: Date;
  minPurchaseDate: Date;
  maxPurchaseDate: Date;
  isInstant: boolean;
  subscriptions: Subscription[] = [];
  overFiftyCount = 0;
  underFiftyCount = 0;
  checkAge = true;
  content: CheckoutSciGenertelContent;
  selectDateForm: UntypedFormGroup;
  insuranceHoldersForm: UntypedFormArray;
  insuranceHolderFormLocations: InsuranceHolderFormLocation[] = [];
  contractorInfoForm: UntypedFormGroup;
  contractorBirthStates: State[];
  contractorBirthCities: City[];
  contractorOldFiscalcodeValue: string;
  contractorAddressForm: UntypedFormGroup;
  contractorContactsForm: UntypedFormGroup;
  isSelectedProductSeasonal = false;

  signupSubstep = 'contractor_contacts_form';
  insideSeason: Boolean = false;

  constructor(
    public dataService: DataService,
    private formBuilder: UntypedFormBuilder,
    public modalService: NgbModal,
    private userService: UserService,
    protected nypUserService: NypUserService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private checkoutStepService: CheckoutStepService,
    private toastrService: ToastrService,
    private insurancesService: InsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
    private dateAdapter: DateAdapter<any>,
    private gtmInitDataLayerService: GtmInitDataLayerService
  ) {
    super();
    this.restoreComponent();
  }

  private restored = false;
  private restoreComponent(): void {
    const data = this.checkoutStepService.getOngoingCheckoutData();
    if (!!data) {
      Object.assign(this, data);
      this.restored = true;
    }
  }



  ngOnInit() {
    this.minPurchaseDate = this.product.originalProduct.attributes.season_start_date;
    this.maxPurchaseDate = this.product.originalProduct.attributes.season_end_date;
    this.createDateForm();
    this.createInsuranceHoldersForm();
    this.createContractorInfoForm();
    this.getCountries();
    this.maxDate = moment().toDate();
    this.minDate = moment().subtract(70, 'years').toDate();

    const subscriptionOrderChanged = this.checkoutStepService.checkoutOrderChange$.subscribe(order => this.handleOrderChange(order));
    this.subscriptions.push(subscriptionOrderChanged);
    this.getContent();
    this.restoreComponent();
    this.dateAdapter.setLocale('it');
    this.isSelectedProductSeasonal = ((this.product.order.line_items[0].variant.sku) === 'GESKINEW-NORMAL_seasonal')
      || ((this.product.order.line_items[0].variant.sku) === 'GESKINEW-PLUS_seasonal');
    const today = new Date();
    if (!(this.isSelectedProductSeasonal) && formatDate(this.minPurchaseDate, 'yyyy-MM-dd', 'it_IT') < formatDate(today, 'yyyy-MM-dd', 'it_IT')) {
      this.minPurchaseDate = new Date(today.setDate(today.getDate() + 1));
    }
    this.isInsedeSeason();
    this.computePeriodModel();
    this.pushGtmNavigationEvent()
  }

  ngOnDestroy() {
    if (!!this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    }
  }

  private isInsedeSeason(): void {
    if (moment() >= moment(this.minPurchaseDate)) {
      this.insideSeason = true;
    }
  }

  getContent() {
    this.kenticoTranslateService.getItem<ContentItem>('checkout_sci_genertel').subscribe((json) => {
      this.content = {
        step_1: {
          start_insurance: json.start_insurance.value,
          choose_date_label: json.choose_date_label.value,
          choose_date_desc: json.choose_date_desc.value,
          insurance_starting_date: json.insurance_starting_date.value,
          insurance_start_placeholder: json.insurance_start_placeholder.value,
          error_insurance_start: json.error_insurance_start.value,
          start_today_label: json.start_today_label.value,
          start_today_title: json.start_today_title.value,
          start_today_desc: json.start_today_desc_303f9c7.value,
          title_insurance_seasonal: json.title_insurance_seasonal.value,
          desc_insurance_seasonal: json.desc_insurance_seasonal.value,
          icon_seasonal: json.icon_seasonal.value[0].url,
          seasonStartedActivation: json.season_started_description.value,
          seasonNotStartedActivation: json.season_not_started_description.value
        },
        step_2: {
          insured_title: json.insured_title.value,
          insured_number: json.insured_number.value,
          contractor_switch: json.contractor_switch.value,
          contractor_switch_secondary: json.contractor_switch_secondary.value,
          name: json.name.value,
          error_name: json.error_name.value,
          surname_label: json.surname_label.value,
          error_surname: json.error_surname.value,
          sex: json.sex.value,
          error_sex: json.error_sex.value,
          birth_date: json.birth_date.value,
          error_adult: json.error_adult.value,
          error_birth_date: json.error_birth_date.value,
        },
        step_3: {
          title: json.title.value,
          name: json.name_6e49864.value,
          error_name: json.error_name_52f8c3d.value,
          surname: json.surname.value,
          error_surname: json.error_surname_58c04b1.value,
          sex: json.sex_f83d85c.value,
          error_sex: json.error_sex_94922c6.value,
          birth_date: json.birth_date_3bd0cf6.value,
          error_birth_date: json.error_birth_date_be681a3.value,
          error_adult: json.error_adult_7f5a066.value,
          profession: json.profession.value,
          error_profession: json.error_profession.value,
          residence_title: json.residence_title.value,
          residence_province: json.residence_province.value,
          error_residence_province: json.error_residence_province.value,
          residence_city: json.residence_city.value,
          error_residence_city: json.error_residence_city.value,
          postal_code: json.postal_code.value,
          error_postal_code: json.error_postal_code.value,
          address: json.address.value,
          error_address: json.error_address.value,
          civic_number: json.civic_number.value,
          error_civic_number: json.error_civic_number.value
        },
        step_4: {
          title: json.title_7b27449.value,
          email: json.email.value,
          confirm_email: json.confirm_email.value,
          error_different_email: json.error_different_email.value,
          phone: json.phone.value,
          privacy_info: json.privacy_info.value,
          bubble_info: json.bubble_info.value
        },
        step_5: {
          verify_data: json.verify_data.value,
          insurance_start_date: json.insurance_start_date.value,
          insurance_end_date: json.insurance_end_date.value,
          insurance_start_time: json.insurance_start_time.value,
          insurance_end_time: json.insurance_end_time.value,
          start_time_label: json.start_time_label.value,
          end_time_label: json.end_time_label.value,
          contractor_label: json.contractor_label.value,
          contractor_name: json.contractor_name.value,
          contractor_tax_code: json.contractor_tax_code.value,
          insured_label: json.insured_lbel.value,
          insured_name: json.insured_name.value,
          insured_tax_code: json.insured_tax_code.value,
          info_set: json.info_set.value,
          end_time_label_seasonal: json.end_time_label_seasonal.value
        },
        step_6: {
          payment_method: json.payment_method.value,
          credit_card: json.credit_card.value,
          paypal: json.paypal.value,
          confirm_pay_btn: json.confirm_pay_btn.value
        },
        checkout_common_labels: {
          back: json.back.value,
          continue: json.continue.value,
          genertel_icon: json.genertel_icon.value,
          date_icon: json.date_icon.value,
          select_icon: json.select_icon.value,
          info_icon: json.info_icon.value,
          date_placeholder: json.date_placeholder.value,
          birth_country: json.birth_country_130a4b3.value,
          error_birth_country: json.error_birth_country_2d28258.value,
          birth_state: json.birth_state.value,
          error_birth_state: json.error_birth_state.value,
          birth_city: json.birth_city.value,
          error_birth_city: json.error_birth_city.value,
          tax_code: json.tax_code.value,
          error_tax_code: json.error_tax_code.value,
          error_check_cin: json.error_check_cin.value,
          continue_for: json.continue_for.value
        },
        modal: {
          modal_txt: json.modal_txt.value,
          btn_txt: json.btn_txt.value
        }
      };
    });
  }

  public validationCinCf(cf): boolean {
    if (!!cf) {
      const set1 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const set2 = 'ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const setpari = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const setdisp = 'BAKPLCQDREVOSFTGUHMINJWZYX';
      let accumulateS = 0;
      for (let j = 1; j <= 13; j += 2) {
        accumulateS += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(j))));
      }
      for (let k = 0; k <= 14; k += 2) {
        accumulateS += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(k))));
      }

      if (accumulateS % 26 != (cf.charCodeAt(15) - 'A'.charCodeAt(0))) {
        return false;
      } else {
        return true;
      }
    }
  }

  private createDateForm(): void {
    this.selectDateForm = this.formBuilder.group({
      startDateOption: [SelectDateFormOptions.SELECTABLE, Validators.nullValidator],
      startDate: [null, Validators.required]
    });
    this.selectDateForm.controls.startDateOption.valueChanges.subscribe(change => {
      this.updateDateSelectControls(change);
    });
  }

  private createInsuranceHoldersForm(): void {
    const totalInsuredHolders = this.getTotalInsuranceHolders();
    this.insuranceHoldersForm = this.formBuilder.array(
      this.createInsuranceHoldersFormArrayConfig(totalInsuredHolders)
    );
  }
  private createContractorInfoForm(): void {
    this.contractorInfoForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]],
      surname: [null, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]],
      sex: [null, Validators.required],
      birthDate: [null, Validators.required],
      birthCountry: [null, Validators.required],
      birthState: [{ value: null, disabled: true }, Validators.required],
      birthCity: [{ value: null, disabled: true }, Validators.required],
      fiscalCode: [null, [Validators.required, Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$')]],
      profession: [null, Validators.required]
    });
    this.contractorInfoForm.controls.birthDate.valueChanges.subscribe(date => {
      const constractorAge = this.calculateAge(moment(date).toDate());
      this.checkContractorIsAdult(constractorAge);
    });
    this.contractorInfoForm.controls.birthCountry.valueChanges.subscribe(country =>
      this.getContractorStatesList(country)
    );
    this.contractorInfoForm.controls.birthState.valueChanges.subscribe(state =>
      this.getContractorCitiesList(state)
    );
    this.contractorInfoForm.valueChanges.subscribe(changes => {
      this.sendContractorTaxcodeCalculation(changes);
      this.contractorOldFiscalcodeValue = changes.fiscalCode;
    });
    this.contractorInfoForm.controls.fiscalCode.valueChanges.subscribe(fiscalCode => {
      this.checkCodiceFiscale(fiscalCode);
    });
  }

  private fillContractorForm(): void {
    const contractor = this.insuranceHoldersForm.controls.find(form =>
      form.get('insuredIsContractor').value
    );
    if (!!contractor) {
      this.contractorInfoForm.setValue({
        name: contractor.get('name').value,
        surname: contractor.get('surname').value,
        sex: contractor.get('sex').value,
        birthDate: contractor.get('birthDate').value,
        birthCountry: contractor.get('birthCountry').value,
        birthState: contractor.get('birthState').value,
        birthCity: contractor.get('birthCity').value,
        fiscalCode: contractor.get('fiscalCode').value,
        profession: null
      });
    }
  }

  private setDates(startDate: Date, endDate: Date) {
    let isInstant;
    if (this.isSelectedProductSeasonal) {
      isInstant = true;
    } else {
      isInstant = this.selectDateForm.value.startDateOption === SelectDateFormOptions.INSTANT;
    }
    moment.locale('it', {
      months: 'GENNAIO_FEBBRAIO_MARZO_APRILE_MAGGIO_GIUGNO_LUGLIO_AGOSTO_SETTEMBRE_OTTOBRE_NOVEMBRE_DICEMBRE'.split('_'),
    });
    moment.locale('it');
    this.startDate = this.formatDate(startDate.toString());
    this.endDate = isInstant
      ? this.formatDate(endDate.toString())
      : this.formatDate(moment(endDate).subtract(1, 'day').toDate().toString());
  }

  private formatDate(dateString: string) {
    const date = new Date(dateString);
    return moment(date).format('D MMMM YYYY');
  }

  private getTotalInsuranceHolders(): number {
    return this.dataService.getResponseOrder().line_items[0].quantity;
  }
  private getTotalOverFifty(): number {
    return this.dataService.getResponseOrder().data.after_50;
  }
  private getTotalUnderFifty(): number {
    return this.dataService.getResponseOrder().data.before_50;
  }

  private createInsuranceHoldersFormArrayConfig(insuranceHolders: number): UntypedFormGroup[] {
    const formArrayConfig: UntypedFormGroup[] = [];
    for (let i = 0; i < insuranceHolders; i++) {
      this.insuranceHolderFormLocations.push(new InsuranceHolderFormLocation());
      formArrayConfig.push(this.createNewInsuredForm(i));
    }
    return formArrayConfig;
  }

  private createNewInsuredForm(index: number): UntypedFormGroup {
    const insuredForm = this.formBuilder.group({
      insuredIsContractor: [false, Validators.nullValidator],
      name: [null, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]],
      surname: [null, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]],
      sex: [null, Validators.required],
      birthDate: [null, Validators.required],
      birthCountry: [null, Validators.required],
      birthState: [{ value: null, disabled: true }, Validators.required],
      birthCity: [{ value: null, disabled: true }, Validators.required],
      fiscalCode: [{ value: null, disabled: true }, [Validators.required, Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$')]],
    });
    insuredForm.controls.insuredIsContractor.valueChanges.subscribe(change => {
      this.checkThereIsOnlyOneContractor(change);
      if (change) {
        if (!!insuredForm.get('insuredIsContractor').value) {
          if (insuredForm.get('birthDate').value) {
            const age = this.calculateAge(moment(insuredForm.get('birthDate').value).toDate());
            this.checkContractorIsAdult(age);
          }
        }

      }
    });
    insuredForm.controls.birthCountry.valueChanges.subscribe(country =>
      this.getInsuredStatesList(country, index)
    );
    insuredForm.controls.birthState.valueChanges.subscribe(state =>
      this.getInsuredCitiesList(state, index)
    );
    insuredForm.valueChanges.subscribe(changes => {
      this.sendHolderTaxcodeCalculation(changes, index);
      this.insuranceHolderFormLocations[index].fiscalCode = changes.fiscalCode;
    });
    insuredForm.controls.birthDate.valueChanges.subscribe(date => {
      const insuredAge = this.calculateAge(moment(date).toDate());
      if (insuredAge >= 50) {
        this.insuranceHolderFormLocations[index].ageRange = 'OVER_50';
      } else {
        this.insuranceHolderFormLocations[index].ageRange = 'UNDER_50';
      }
      this.checkContractorIsAdult(insuredAge);
    });
    insuredForm.controls.fiscalCode.valueChanges.subscribe(fiscalCode => {
      this.checkCodiceFiscale(fiscalCode);
    });
    return insuredForm;
  }
  checkCodiceFiscale(fiscalCode: string) {
    return this.isCfInvalid = this.checkFiscalCodeLength(fiscalCode) && !this.validationCinCf(fiscalCode);
  }
  checkFiscalCodeLength(fiscalCode: string): boolean {
    if (fiscalCode.length < 16) {
      return false;
    } else if (fiscalCode.length === 16) {
      return true;
    }
  }
  verifyInsuredNumberAge() {

    this.checkAge = true;

    this.insuranceHolderFormLocations.forEach((insured) => {
      if (insured.ageRange === 'OVER_50') {
        this.overFiftyCount++;
      } else {
        this.underFiftyCount++;
      }
    });
    const totalOverFifty = this.getTotalOverFifty();
    const totalUnderFifty = this.getTotalUnderFifty();
    const totalInsuredCount = this.overFiftyCount + this.underFiftyCount;
    const totalInsuredHolders = this.getTotalInsuranceHolders();
    if (this.overFiftyCount === totalOverFifty && this.underFiftyCount === totalUnderFifty && totalInsuredCount === totalInsuredHolders) {
      return;
    } else if (totalUnderFifty !== 0 && this.underFiftyCount !== totalUnderFifty && totalInsuredCount === totalInsuredHolders) {
      this.toastrService.error('Il totale degli assicurati Under 50 anni non corriponde a quello indicato');
      this.resetInsuredCounter();
      return;
    } else if (totalOverFifty !== 0 && this.overFiftyCount !== totalOverFifty && totalInsuredCount === totalInsuredHolders) {
      this.toastrService.error('Il totale degli assicurati Over 50 anni non corriponde a quello indicato');
      this.resetInsuredCounter();
      return;
    } else if (this.overFiftyCount !== totalOverFifty && this.underFiftyCount !== totalUnderFifty && totalInsuredCount === totalInsuredHolders) {
      this.toastrService.error('Il totale degli assicurati Over 50 anni e Under 50  non corriponde a quello indicato');
      this.resetInsuredCounter();
      return;
    }

  }

  /* FUNCTIONS FOR RESET INSURED COUNTER AND SET CHECK AGE TO FALSE */
  private resetInsuredCounter() {
    this.insuranceHolderFormLocations.forEach((insured) => {
      if (insured.ageRange === 'OVER_50') {
        this.overFiftyCount--;
      } else {
        this.underFiftyCount--;
      }
    });
    this.checkAge = false;
  }

  private checkThereIsOnlyOneContractor(change: boolean): void {
    this.contactorAlreadySelected = change;
  }
  private calculateAge(date: Date) {
    const today = moment();
    const age = today.diff(date, 'years');
    return age;
  }

  private updateDateSelectControls(change: SelectDateFormOptions): void {
    if (change === SelectDateFormOptions.INSTANT) {
      this.selectDateForm.controls.startDate.clearValidators();
    }
    if (change === SelectDateFormOptions.SELECTABLE) {
      this.selectDateForm.controls.startDate.setValidators([Validators.required]);
    }
    this.selectDateForm.controls.startDate.updateValueAndValidity({ emitEvent: false });
  }

  public isCurrentFormValid(): boolean {
    switch (this.currentSubstep) {
      case StepInfoGenertelSciSubstep.INSURANCE_DATE:
        return this.isSelectedProductSeasonal ? true : this.selectDateForm.valid;
      case StepInfoGenertelSciSubstep.INSURANCE_HOLDERS:
        if (!!this.validationCinCf(this.insuranceHoldersForm.controls[this.currentInsured].value.fiscalCode)) {
          return this.insuranceHoldersForm.controls[this.currentInsured].valid;
        }
      case StepInfoGenertelSciSubstep.CONTRACTOR_INFO:
        if (!!this.validationCinCf(this.contractorInfoForm.controls.fiscalCode.value)) {
          return this.contractorInfoForm.valid;
        }
      case StepInfoGenertelSciSubstep.CONTRACTOR_ADDRESS:
        return this.contractorAddressForm && this.contractorAddressForm.valid;
      case StepInfoGenertelSciSubstep.CONTRACTOR_CONTACTS:
        return this.contractorContactsForm && this.contractorContactsForm.valid;
      default: return false;
    }
  }

  public nextSubStep(): void {
    const startDateinRange = moment(this.selectDateForm.controls.startDate.value).add(this.dataService.getResponseOrder().data.quotation_response.additional_data.duration, 'days');
    if ((startDateinRange).subtract(1, 'days') > moment(this.maxPurchaseDate)) {
      this.toastrService.error('Attenzione, la stagione sciistica termina il' + ' ' + moment(this.maxPurchaseDate).format('DD/MM/YYYY') + ': diminuisci la durata della polizza oppure anticipa la decorrenza');
    } else {
      if (this.isCurrentSubstep(StepInfoGenertelSciSubstep.INSURANCE_HOLDERS)) {
        const totalInsuredHolders = this.getTotalInsuranceHolders();
        this.checkoutPeriod = this.computePeriodModel();
        if (this.currentInsured + 1 < totalInsuredHolders) {
          this.currentInsured++;
          return;
        } else {
          this.fillContractorForm();
          this.verifyInsuredNumberAge();
          if (!this.checkAge) {
            return;
          }
        }
      }
      if (this.isCurrentSubstep(StepInfoGenertelSciSubstep.CONTRACTOR_CONTACTS)) {
        if (this.signupSubstep === 'contractor_contacts_form') {
          const attachmentPayload = {
            email: this.contractorContactsForm.value.email,
            name: this.contractorInfoForm.value.name
          };
          this.insurancesService.sendGenertelLegalAttachments(attachmentPayload).pipe(take(1)).subscribe();
          this.signupSubstep = 'insurance_recap';
          return;
        }
        if (this.signupSubstep === 'insurance_recap') {
          this.checkoutStepService.checkoutSendForm(this.contractorContactsForm);
          this.checkoutStepService.setOngoingCheckoutData(this);
          return;
        }
      }
      if (this.isCurrentSubstep(StepInfoGenertelSciSubstep.CONTRACTOR_ADDRESS)) {
        this.insurancesService.checkZipCode(this.contractorAddressForm.get('postalCode').value,
          this.contractorAddressForm.get('residenceCity').value.id).subscribe(res => {
            if (!res.result) {
              this.toastrService.error('Codice postale non valido!');
              return;
            } else {
              this.resetCountFifty();
              this.currentSubstep = stepInfoGenertelSciSubsteps[this.getCurrentSubstepIndex() + 1];
            }
          });
      } else {
        this.resetCountFifty();
        this.currentSubstep = stepInfoGenertelSciSubsteps[this.getCurrentSubstepIndex() + 1];
      }
      this.pushGtmNavigationEvent()
    }
  }

  private resetCountFifty() {
    this.overFiftyCount = 0;
    this.underFiftyCount = 0;
  }

  public previousSubStep(): void {
    if (this.isCurrentSubstep(StepInfoGenertelSciSubstep.INSURANCE_DATE)) {
      this.dataService.setQuotator(true);
    }
    if (this.isCurrentSubstep(StepInfoGenertelSciSubstep.INSURANCE_HOLDERS)) {
      if (this.currentInsured - 1 >= 0) {
        this.currentInsured--;
        return;
      }
    }
    if (this.isCurrentSubstep(StepInfoGenertelSciSubstep.CONTRACTOR_CONTACTS)) {
      if (this.signupSubstep === 'insurance_recap') {
        this.signupSubstep = 'contractor_contacts_form';
        return;
      }
    }
    this.currentSubstep = stepInfoGenertelSciSubsteps[this.getCurrentSubstepIndex() - 1];
    this.pushGtmNavigationEvent()
  }

  private isCurrentSubstep(substep: StepInfoGenertelSciSubstep): boolean {
    return this.currentSubstep === substep;
  }

  private getCurrentSubstepIndex(): number {
    return stepInfoGenertelSciSubsteps.findIndex(substep =>
      substep === this.currentSubstep
    );
  }

  public getContractorName(): string {
    const contractorForm = this.insuranceHoldersForm.controls.find(form =>
      !!form.get('insuredIsContractor').value
    );
    return contractorForm.get('name').value + ' ' + contractorForm.get('surname').value;
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.checkoutPeriod;
    const insuredSubjects: any[] = this.computeModel();
    const insuredIsContractor = false;
    return Object.assign({}, this.product,
      period,
      {
        insuredIsContractor,
        insuredSubjects,
        instant: period.instant
      });
  }

  private computePeriodModel(): CheckoutPeriod {
    const today = new Date();
    if (this.isSelectedProductSeasonal) {
      const startDate = today;
      const seasonStartDate = new Date(this.product.originalProduct.attributes.season_start_date);
      if (!this.hasSeasonStarted(seasonStartDate)) {
        this.setDates(seasonStartDate, new Date(this.product.originalProduct.attributes.season_end_date));
        return {
          instant: false,
          startDate: seasonStartDate,
          endDate: new Date(this.product.originalProduct.attributes.season_end_date)
        };
      }
      this.setDates(startDate, new Date(this.product.originalProduct.attributes.season_end_date));
      return {
        startDate: today,
        endDate: new Date(this.product.originalProduct.attributes.season_end_date)
      };
    } else {
      const isInstant = this.selectDateForm.value.startDateOption === SelectDateFormOptions.INSTANT;
      const duration = this.dataService.getResponseOrder().data.quotation_response.additional_data.duration;
      const startDateInstant = moment().add(30, 'minutes').toDate();
      const endDateInstant = moment(startDateInstant).add(duration, 'days').toDate();
      const startDate = moment(this.selectDateForm.value.startDate).toDate();
      const endDate = moment(startDate).add(duration, 'days').toDate();
      this.setDates(isInstant ? startDateInstant : startDate, isInstant ? endDateInstant : endDate);

      return {
        instant: isInstant,
        startDate: isInstant ? startDateInstant : startDate,
        endDate: isInstant ? endDateInstant : endDate
      };
    }
  }

  private hasSeasonStarted(seasonStartDate: Date): boolean {
    return this.calendar.getToday().after(TimeHelper.fromDateToNgbDate(seasonStartDate));
  }

  private computeModel(): any[] {

    const computedHolders: any[] = this.insuranceHoldersForm.controls.map(form => {
      return {
        id: null,
        firstName: form.value.name,
        lastName: form.value.surname,
        taxcode: form.value.fiscalCode,
        contractor: form.value.insuredIsContractor,
        only_contractor: false,
        familyRelationship: null,
        birthDate: form.value.birthDate,
        birthCountry: form.value.birthCountry,
        birthState: form.value.birthCountry.iso === 'IT'
          ? form.value.birthState
          : null,
        birthCity: form.value.birthCountry.iso === 'IT'
          ? form.value.birthCity
          : null
      };
    });
    if (this.noInsuredIsContractor()) {
      computedHolders.push({
        id: null,
        firstName: this.contractorInfoForm.value.name,
        lastName: this.contractorInfoForm.value.surname,
        taxcode: this.contractorInfoForm.value.fiscalCode,
        contractor: true,
        only_contractor: true,
        familyRelationship: null,
        birthDate: this.contractorInfoForm.value.birthDate,
        birthCountry: this.contractorInfoForm.value.birthCountry,
        birthState: this.contractorInfoForm.value.birthCountry.iso === 'IT'
          ? this.contractorInfoForm.value.birthState
          : null,
        birthCity: this.contractorInfoForm.value.birthCountry.iso === 'IT'
          ? this.contractorInfoForm.value.birthCity
          : null
      });
    }
    const contractor = computedHolders.find(holder =>
      holder.contractor === true
    );
    Object.assign(contractor, {
      residentialState: this.contractorAddressForm.value.residenceState.id,
      postCode: this.contractorAddressForm.value.postalCode,
      residentialCountry: { id: 110 },
      residentialCity: this.contractorAddressForm.value.residenceCity.name,
      domicileHouseNumber: this.contractorAddressForm.value.civicNumber,
      address: this.contractorAddressForm.value.address,
      toponymCode: ToponymHelper.findToponymCode(this.contractorAddressForm.value.address),
      profession: this.contractorInfoForm.value.profession,
      email: this.contractorContactsForm.value.email,
      phone: this.contractorContactsForm.value.phone
    });
    if (this.restored) {
      return this.assignComputedHoldersId(computedHolders);
    }
    return computedHolders;
  }

  private assignComputedHoldersId(holders: any[]) {
    const responseOrderHolders = this.dataService.getResponseOrder().line_items[0].insured_entities.insurance_holders;
    return holders.map((holder, index) => {
      holder.id = responseOrderHolders[index].id;
      return holder;
    });
  }

  private formatNgbDate(date: NgbDate) {
    return date.year + '-' + date.month.toString().padStart(2, '0') + '-' + date.day.toString().padStart(2, '0');
  }

  private noInsuredIsContractor(): boolean {
    return this.insuranceHoldersForm.controls.every(form =>
      form.get('insuredIsContractor').value === false
    );
  }

  public updateAddressForm(form: UntypedFormGroup): void {
    this.contractorAddressForm = form;
  }

  public updateContactsForm(form: UntypedFormGroup): void {
    this.contractorContactsForm = form;
  }

  isFormValid(): boolean {
    return;
  }

  private getCountries(): void {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe((countries) => {
      const defaultCountry = countries.find(country => country.iso === 'IT');
      const defaultCountryIndex = countries.findIndex(country => country.iso === 'IT');
      countries.splice(defaultCountryIndex, 1);
      countries.unshift(defaultCountry);
      this.birthCounties = countries;
    });
  }

  private getInsuredStatesList(country: Country, index: number): void {
    const insuranceHolderForm = this.insuranceHoldersForm.controls[index] as UntypedFormGroup;
    const italySelected = country.iso === 'IT';
    if (italySelected) {
      this.nypUserService.getProvince(country.id).subscribe(states => {
        this.insuranceHolderFormLocations[index].states = states;
      });
      this.addValidators(['birthState'], insuranceHolderForm);
      this.removeValidators(['birthCity'], insuranceHolderForm);
    } else {
      this.removeValidators(['birthState', 'birthCity'], insuranceHolderForm);
    }
  }

  private getInsuredCitiesList(state: State, index: number) {
    const insuranceHolderForm = this.insuranceHoldersForm.controls[index] as UntypedFormGroup;
    if (!!state && state.cities_required) {
      this.nypUserService.getCities(state.id).subscribe(cities => {
        this.insuranceHolderFormLocations[index].cities = cities;
      });
      this.addValidators(['birthCity'], insuranceHolderForm);
    } else {
      this.removeValidators(['birthCity'], insuranceHolderForm);
    }
  }

  private removeValidators(formControlNames: string[], form: UntypedFormGroup): void {
    formControlNames.forEach(formControlName => {
      form.get(formControlName).clearValidators();
      form.get(formControlName).setValue(null, { emitEvent: false });
      form.get(formControlName).disable({ emitEvent: false });
    });
    form.updateValueAndValidity({ emitEvent: false });
  }

  private addValidators(formControlNames: string[], form: UntypedFormGroup): void {
    formControlNames.forEach(formControlName => {
      form.get(formControlName).setValidators(Validators.required);
      form.get(formControlName).enable({ emitEvent: false });
    });
    form.updateValueAndValidity({ emitEvent: false });
  }

  private sendTaxcodeCalculationRequest(formValue: FormValue, form: UntypedFormGroup, index: number) {
    const taxcodeRequest: TaxcodeCalculationRequest = this.createTaxcodeRequest(formValue);
    this.userService.taxcodeCalculation(taxcodeRequest).subscribe(res => {
      form.get('fiscalCode').setValue(res.taxcode, { emitEvent: false });
      this.addValidators(['fiscalCode'], form);
      form.get('fiscalCode').setErrors(null, { emitEvent: false });
      form.get('fiscalCode').setValidators(Validators.compose([
        Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$'),
        Validators.required]));
      if (index !== null) {
        this.insuranceHolderFormLocations[index].fiscalCode = res.taxcode;
      }
    });

  }

  private sendHolderTaxcodeCalculation(formValue: FormValue, index: number): void {
    const savedTaxcode = this.insuranceHolderFormLocations[index].fiscalCode;
    if (this.canCalculateTaxcode(formValue) && (
      (!formValue.fiscalCode && !savedTaxcode)
      || !this.hasFiscalCodeChanged(savedTaxcode, formValue.fiscalCode)
      || this.hasFiscalCodeBeenRecalculated(savedTaxcode, formValue.fiscalCode)
    )
    ) {
      this.sendTaxcodeCalculationRequest(formValue, this.insuranceHoldersForm.controls[index] as UntypedFormGroup, index);
    }
  }

  private sendContractorTaxcodeCalculation(formValue: FormValue) {
    if (this.canCalculateTaxcode(formValue) && (
      (!formValue.fiscalCode && !this.contractorOldFiscalcodeValue)
      || !this.hasFiscalCodeChanged(this.contractorOldFiscalcodeValue, formValue.fiscalCode)
      || this.hasFiscalCodeBeenRecalculated(this.contractorOldFiscalcodeValue, formValue.fiscalCode)
    )) {
      this.sendTaxcodeCalculationRequest(formValue, this.contractorInfoForm, null);
    }
  }

  private hasFiscalCodeChanged(savedTaxcode: string, fiscalCode: string): boolean {
    return savedTaxcode !== fiscalCode;
  }

  private hasFiscalCodeBeenRecalculated(savedTaxcode: string, fiscalCode: FormValue): boolean {
    if (!!savedTaxcode && !!fiscalCode) {
      return savedTaxcode.length === 16 && fiscalCode.length === 16;
    }
    return false;
  }

  private canCalculateTaxcode(formValue: FormValue): boolean {
    if (!formValue.birthCountry) {
      return false;
    }
    const italySelected = formValue.birthCountry.iso === 'IT';
    return italySelected
      ? !!formValue.name && !!formValue.surname && !!formValue.sex && !!formValue.birthDate
      && !!formValue.birthCountry && !!formValue.birthState && !!formValue.birthCity
      : !!formValue.name && !!formValue.surname && !!formValue.sex && !!formValue.birthDate
      && !!formValue.birthCountry;
  }

  private createTaxcodeRequest(formValue: FormValue): TaxcodeCalculationRequest {
    const isItalian = formValue.birthCountry.iso === 'IT';
    return {
      firstname: formValue.name,
      lastname: formValue.surname,
      gender: formValue.sex.keyValue,
      birthdate: moment(formValue.birthDate).format('DD/MM/YYYY'),
      country_name: formValue.birthCountry.name,
      province_code: isItalian ? formValue.birthState.abbr : undefined,
      city_name: isItalian ? formValue.birthCity.name : undefined,
    };
  }

  private checkContractorIsAdult(age: number) {
    for (const form of this.insuranceHoldersForm.controls) {
      if (!!form.get('insuredIsContractor').value) {
        if (age < 18) {
          form.get('birthDate').setErrors({ under_age: true });
        } else {
          form.get('birthDate').setErrors({ under_age: false });
          form.get('birthDate').setErrors(null);
        }
      } else {
        if (age < 18) {
          this.contractorInfoForm.get('birthDate').setErrors({ under_age: true });
        } else {
          this.contractorInfoForm.get('birthDate').setErrors({ under_age: false });
          this.contractorInfoForm.get('birthDate').setErrors(null);
        }
      }
    }
  }

  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  private handleOrderChange(order: ResponseOrder): void {
    this.product.lineItemId = order.line_items[0].id;
  }

  private getContractorStatesList(country: Country): void {
    const italySelected = country.iso === 'IT';
    if (italySelected) {
      this.nypUserService.getProvince(country.id).subscribe(states => {
        this.contractorBirthStates = states;
      });
      this.addValidators(['birthState'], this.contractorInfoForm);
      this.removeValidators(['birthCity'], this.contractorInfoForm);
    } else {
      this.removeValidators(['birthState', 'birthCity'], this.contractorInfoForm);
    }
  }

  private getContractorCitiesList(state: State) {
    if (!!state && state.cities_required) {
      this.nypUserService.getCities(state.id).subscribe(cities => {
        this.contractorBirthCities = cities;
      });
      this.addValidators(['birthCity'], this.contractorInfoForm);
    } else {
      this.removeValidators(['birthCity'], this.contractorInfoForm);
    }
  }

  getDisabledValue(): any {
    return this.product.originalProduct.attributes.show_instant ? null : true;
  }

  private pushGtmNavigationEvent() {
    const correspondingSubstep = (datalayerEvent: typeof insuranceInfoDataLayerSciSubsteps[number]) => datalayerEvent.step === this.currentSubstep
    if (insuranceInfoDataLayerSciSubsteps.some(correspondingSubstep)) {
      this.gtmInitDataLayerService.preventivatoreCustomTags(
        insuranceInfoDataLayerSciSubsteps.find(correspondingSubstep).value
      );
    }
  }
}
