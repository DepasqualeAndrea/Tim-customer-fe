import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { City, State } from '@model';
import { AuthService, DataService } from '@services';
import { BillProtectionInsuredItems, CheckoutStates, IOrderResponse, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { TimBillProtectionApiService } from '../../services/api.service';
import { TimBillProtectionCheckoutService } from '../../services/checkout.service';
import { environment } from 'environments/environment';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import {AdobeAnalyticsDatalayerService} from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-checkout-step-insurance-info',
    templateUrl: './checkout-step-insurance-info.component.html',
    styleUrls: ['./checkout-step-insurance-info.component.scss', '../../../../styles/checkout-forms.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {
  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly titleStates: CheckoutStates[] = ['login-register', 'address', 'insurance-info'];
  public readonly summaryStates: CheckoutStates[] = ['insurance-info', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  @Input('isMobileView') public isMobileView: boolean = false;

  public readonly KenticoPrefix = 'insurance_info';
  formBeneficiary: UntypedFormGroup;
  formDocument: UntypedFormGroup;

  states: State[];
  cities: City[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    public nypUserService: NypUserService,
    public dataService: DataService,
    public checkoutService: TimBillProtectionCheckoutService,
    private apiService: TimBillProtectionApiService,
    private authService: AuthService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.formBeneficiary = this.formBuilder.group({
      beneficiaryType: ['Eredi legittimi', Validators.required],
      beneficiaries: this.formBuilder.array([]),
    });

    this.formBeneficiary.setValidators((group: UntypedFormGroup): ValidationErrors => {
      const totalShare = this.Beneficiaries.controls
        ?.filter(prev => !!prev.get('share'))
        ?.reduce((curr, prev) => {
          return +prev.get('share').value + curr;
        }, 0);

      this.Beneficiaries.setErrors((group.get('beneficiaryType').value == 'Eredi legittimi' || totalShare == 100) ? null : { totalPercentage: 'tim_bill_protection.error_quote_text' });
      return;
    });

    this.formDocument = this.formBuilder.group({
      typeDocument: [environment.timBillProtectionTypeDocument ?? null, Validators.required],
      numberDocument: [environment.timBillProtectionNumberDocument ?? null, Validators.required],
      documentIssueDate: [environment.timBillProtectionDocumentIssueDate ?? null, [Validators.required]],
      documentIssuingEntity: [environment.timBillProtectionDocumentIssuingEntity ?? null, Validators.required],
      stateIssuingDocument: [environment.timBillProtectionStateIssuingDocument ?? null, Validators.required],
      municipalityIssuingDocument: [environment.timBillProtectionMunicipalityIssuingDocument ?? null, Validators.required],
      politicallyExposedPerson: [environment.timBillProtectionPoliticallyExposed ?? null, [Validators.required]]
    });

    this.getStates(110).subscribe();
  }

  public get Beneficiaries(): UntypedFormArray { return this.formBeneficiary?.get('beneficiaries') as UntypedFormArray; }

  beneficiaryTypeChange(beneficiaryType: string) {
    if (beneficiaryType == 'Eredi legittimi') {
      this.removeBeneficiary(2);
      this.removeBeneficiary(1);
      this.removeBeneficiary(0);
    } else if (beneficiaryType == 'Altro') {
      this.addBeneficiary();
    }
  }

  addBeneficiary() {
    const beneficiaries = this.Beneficiaries;
    if (beneficiaries.length < 3) {
      beneficiaries.push(this.formBuilder.group({
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        taxCode: [null, [Validators.required, Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$')]],
        share: [0, [Validators.required]],
      }));

      this.updateBeneficiariesShare(beneficiaries);
    }
  }

  removeBeneficiary(index: number) {
    const beneficiaries = this.Beneficiaries;
    if (beneficiaries.length > 0 && index >= 0 && index < 3 && index < beneficiaries.length) {
      beneficiaries.removeAt(index);

      this.updateBeneficiariesShare(beneficiaries);
    }
  }

  updateBeneficiariesShare(beneficiaries: UntypedFormArray) {
    beneficiaries.controls.forEach((beneficiary, index) => {
      const share = index == 0 ? Math.ceil(100 / beneficiaries.length) : Math.round(100 / beneficiaries.length);
      beneficiary.get('share').patchValue(share);
    });
  }

  getBeneficiaryErrorFieldClass(formControlName: string): string {
    if (this.getBeneficiaryFieldInvalidError(formControlName)) {
      if (this.getBeneficiaryFieldError(formControlName, 'required')) {
        return 'error-field'
      }
    }
  }

  getBeneficiaryFieldInvalidError(formControlName: string): boolean {
    return this.formBeneficiary.get(formControlName).invalid &&
      (this.formBeneficiary.get(formControlName).touched || this.formBeneficiary.get(formControlName).dirty)
  }

  getBeneficiaryFieldError(formControlName: string, errorType: string): boolean {
    return this.formBeneficiary.get(formControlName).errors && this.formBeneficiary.get(formControlName).errors[errorType]
  }

  getDocumentErrorFieldClass(formControlName: string): string {
    if (this.getDocumentFieldInvalidError(formControlName)) {
      if (this.getDocumentFieldError(formControlName, 'required')) {
        return 'error-field'
      }
    }
  }

  getDocumentFieldInvalidError(formControlName: string): boolean {
    return this.formDocument.get(formControlName).invalid &&
      (this.formDocument.get(formControlName).touched || this.formDocument.get(formControlName).dirty)
  }

  getDocumentFieldError(formControlName: string, errorType: string): boolean {
    return this.formDocument.get(formControlName).errors && this.formDocument.get(formControlName).errors[errorType]
  }

  submit() {
    this.updateOrder({
      identity_document_type: this.formDocument.get('typeDocument').value,
      identity_document_number: this.formDocument.get('numberDocument').value,
      identity_document_issue_date: this.formDocument.get('documentIssueDate').value,
      identity_document_issuer: this.formDocument.get('documentIssuingEntity').value,
      identity_document_issuer_state: this.states.find(s => s.id == this.formDocument.get('stateIssuingDocument').value.id)?.name,
      identity_document_issuer_city: this.cities.find(c => c.id === this.formDocument.get('municipalityIssuingDocument').value.id)?.name,
      politically_exposed: this.formDocument.get('politicallyExposedPerson').value == 'si',
      beneficiaries_type: this.formBeneficiary.get('beneficiaryType').value,
      beneficiaries: this.Beneficiaries?.controls?.map(beneficiary => ({
        first_name: beneficiary.get('firstName').value,
        last_name: beneficiary.get('lastName').value,
        tax_code: beneficiary.get('taxCode').value,
        percentage: +beneficiary.get('share').value,
      })),
    }).subscribe(() => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '') + '-datibeneficario';
      // digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
      // this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      this.kenticoTranslateService.getItem<any>('tim_bill_protection').pipe(take(1)).subscribe(item => {
        let digitalData: digitalData = window['digitalData'];
        const stepName = item?.survey_summary_recap_bp?.value;
        digitalData.page.pageInfo.pageName = stepName;
        this.adobeAnalyticsDataLayerService.adobeTrackClick();
        this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      });
      this.nypDataService.CurrentState$.next('survey')
    });
  }

  customCompare(o1: string, o2: { code: string, label: string }): boolean {
    return o1 === o2?.code;
  }

  selectChanged(id: number, nextControlName: 'municipalityIssuingDocument') {
    this.formDocument.get(nextControlName).patchValue(null);
    this.formDocument.get(nextControlName).disable();
    if (!id) return;

    this.getCity(id).subscribe();
  }

  getCity(id: number): Observable<City[]> {
    this.formDocument.get('municipalityIssuingDocument').patchValue(null);
    this.formDocument.get('municipalityIssuingDocument').disable();

    return this.nypUserService.getCities(id).pipe(tap(cities => {
      this.cities = cities;

      if (this.cities.length > 0) this.formDocument.controls['municipalityIssuingDocument'].enable();
    }));
  }

  getStates(id: number): Observable<State[]> {
    this.formDocument.get('stateIssuingDocument').patchValue(null);
    this.formDocument.get('stateIssuingDocument').disable();
    this.formDocument.get('municipalityIssuingDocument').patchValue(null);
    this.formDocument.get('municipalityIssuingDocument').disable();

    return this.nypUserService.getProvince(id).pipe(tap(states => {
      this.states = states;

      if (this.states.length > 0) this.formDocument.controls['stateIssuingDocument'].enable();
      if (this.formDocument.controls['stateIssuingDocument'].value) this.getCity(this.formDocument.controls['stateIssuingDocument'].value.id).subscribe();
      else this.formDocument.controls['municipalityIssuingDocument'].disable();
    }));
  }

  private updateOrder(insuredItems?: BillProtectionInsuredItems): Observable<RecursivePartial<IOrderResponse<BillProtectionInsuredItems>>> {
    return this.apiService
      .putOrder({
        orderCode: this.nypDataService.Order$.value.orderCode,
        customerId: this.authService.loggedUser?.id,
        productId: this.nypDataService.CurrentProduct$.value?.id,
        packet: this.nypDataService.CurrentProduct$.value.packets?.[0],
        chosenWarranties: this.nypDataService.CurrentProduct$.value.packets?.[0].warranties
          ?.map(warranty => Object.assign(warranty, { startDate: this.nypDataService.Order$.value?.orderItem[0]?.start_date, endDate: this.nypDataService.Order$.value?.orderItem[0]?.expiration_date })),
        price: this.checkoutService.ChosenPackets$.value.price,
        insuredItems: insuredItems,
        anagState: 'Draft',
      });
  }

  prevStep(goToAddress: boolean): void {
    const label = goToAddress ? 'documentiassicurato' : 'datibeneficario';
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('button-back').textContent.toLowerCase().replace(/\s/g, '') + '-' + label;
    digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    if (goToAddress) {
      this.nypDataService.CurrentState$.next('address');
    } else {
      this.checkoutService.InsuranceInfoState$.next('insured-documents')
    }
  }

  nextStep(): void {
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '') + '-documentiassicurato';
    // digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
    // this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    this.kenticoTranslateService.getItem<any>('tim_bill_protection').pipe(take(1)).subscribe(item => {
      const stepName = item?.beneficiary_data_title?.value;
      digitalData.page.pageInfo.pageName = stepName;
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    });
    this.checkoutService.InsuranceInfoState$.next('insurance-destination');
  }

}
