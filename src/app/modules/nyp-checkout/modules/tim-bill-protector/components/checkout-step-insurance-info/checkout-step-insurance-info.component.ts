import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { City, State } from '@model';
import { AuthService, DataService } from '@services';
import { BillProtectorInsuredItems, CheckoutStates, IOrderResponse, Packet, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TimBillProtectorApiService } from '../../services/api.service';
import { InsuranceInfoStates, TimBillProtectorCheckoutService } from '../../services/checkout.service';
import { environment } from 'environments/environment';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoDetailsModalComponent } from "app/modules/nyp-checkout/modules/tim-bill-protector/modal/info-details-modal/info-details-modal.component";
import { kentico } from 'app/shared/pipe/kentico.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-checkout-step-insurance-info',
    templateUrl: './checkout-step-insurance-info.component.html',
    styleUrls: ['./checkout-step-insurance-info.component.scss', '../../../../styles/checkout-forms.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoComponent implements OnInit, OnDestroy {
  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly titleStates: CheckoutStates[] = ['login-register', 'address', 'insurance-info', 'user-control'];
  public readonly summaryStates: CheckoutStates[] = ['insurance-info', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  @Input('isMobileView') public isMobileView: boolean = false;

  public readonly KenticoPrefix = 'insurance_info';
  formBeneficiary: UntypedFormGroup;
  formDocument: UntypedFormGroup;

  packets: RecursivePartial<Packet>[] = [];
  states: State[];
  cities: City[];

  private destroy$: Subject<void> = new Subject();

  constructor(
    private formBuilder: UntypedFormBuilder,
    public nypUserService: NypUserService,
    public dataService: DataService,
    public checkoutService: TimBillProtectorCheckoutService,
    private apiService: TimBillProtectorApiService,
    private authService: AuthService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.packets = this.nypDataService.CurrentProduct$.value.packets;
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

      this.Beneficiaries.setErrors((group.get('beneficiaryType').value == 'Eredi legittimi' || totalShare == 100) ? null : { totalPercentage: 'tim_bill_protector.error_quote_text' });
      return;
    });

    this.formDocument = this.formBuilder.group({
      typeDocument: [environment.timBillProtectorTypeDocument ?? null, Validators.required],
      numberDocument: [environment.timBillProtectorNumberDocument ?? null, Validators.required],
      documentIssueDate: [environment.timBillProtectorDocumentIssueDate ?? null, [Validators.required]],
      documentIssuingEntity: [environment.timBillProtectorDocumentIssuingEntity ?? null, Validators.required],
      stateIssuingDocument: [environment.timBillProtectorStateIssuingDocument ?? null, Validators.required],
      municipalityIssuingDocument: [environment.timBillProtectorMunicipalityIssuingDocument ?? null, Validators.required],
      politicallyExposedPerson: [environment.timBillProtectorPoliticallyExposed ?? null, [Validators.required]],
    });

    this.checkoutService.ChosenPackets$.pipe(takeUntil(this.destroy$)).subscribe((chosen) => {
      if (chosen.packet.sku === 'tim-bill-protector-deluxe') {
        this.addOccupationDetailsControls(this.formDocument);
      } else {
        this.removeOccupationDetailsControls(this.formDocument);
      }
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

  addOccupationDetailsControls(form: UntypedFormGroup): void {
    const occupationTypeControl = new UntypedFormControl(environment.timBillProtectorOccupationType ?? null, [Validators.required, Validators.pattern('Azienda privata tempo indeterminato')]);
    const occupationTimeControl = new UntypedFormControl(environment.timBillProtectorOccupationTime ?? null, [Validators.required, Validators.pattern('Da più di 12 mesi')]);
    form.addControl('occupationType', occupationTypeControl);
    form.addControl('occupationTime', occupationTimeControl);
  }

  removeOccupationDetailsControls(form: UntypedFormGroup): void {
    form.removeControl('occupationType');
    form.removeControl('occupationTime');
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
    if (this.formDocument.get('politicallyExposedPerson').value == 'si') {
      this.toastr.error("Non è possibile proseguire, per persone politicamente esposte è necessario contattare il servizio clienti");
      return;
    }
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
      oppucation_type: this.formDocument?.get('occupationType')?.value,
      occupation_time: this.formDocument?.get('occupationTime')?.value,
    }).subscribe({
      next: (response) => {
        if (response?.data) {
          this.nypDataService.Order$.next(response.data);
        }
        let digitalData: digitalData = window['digitalData'];
        digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '') + '-datibeneficario';
        digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
        this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        this.nypDataService.CurrentState$.next('login-register');
      },
      error: (error) => {
        this.toastr.error(error?.error?.message || "Non è possibile proseguire, per persone politicamente esposte è necessario contattare il servizio clienti");
      }
    });
  }

  customCompare(o1: string, o2: { code: string, label: string }): boolean {
    return o1 === o2?.code;
  }

  occupationTypeSelectChanged(nextControlName: string) {
    this.formDocument.get(nextControlName).patchValue(null);
    const occupationTypeControl = this.formDocument?.get('occupationType');
    if (occupationTypeControl && occupationTypeControl.valid) {
      this.formDocument.get(nextControlName).enable();
    } else {
      this.formDocument.get(nextControlName).disable();
    }
  }

  stateIssuingSelectChanged(id: number, nextControlName: 'municipalityIssuingDocument') {
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

  onPacketSelected(packet: RecursivePartial<Packet>) {
    if (this.checkoutService.ChosenPackets$.value.packet.id === packet.id) {
      this.checkoutService.ChosenPackets$.next({ packet: {}, warranties: [], price: null });
    } else {
      const orderItem = this.nypDataService.Order$.value?.orderItem[0];
      const warranties = packet.warranties?.map(warranty => ({
        ...warranty,
        startDate: orderItem?.start_date,
        endDate: orderItem?.expiration_date
      }));
      this.checkoutService.ChosenPackets$.next({
        packet,
        warranties,
        price: packet.packetPremium
      });
    }
  }

  onShowDetailsModal(packet: RecursivePartial<Packet>) {
    if (packet) {
      const modalDescriptions = {
        'tim-bill-protector-light': kentico('tim_bill_protector.packet_light_modal_content'),
        'tim-bill-protector-smart': kentico('tim_bill_protector.packet_smart_modal_content'),
        'tim-bill-protector-deluxe': kentico('tim_bill_protector.packet_deluxe_modal_content')
      }
      const modalRef = this.modalService.open(InfoDetailsModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = kentico('tim_bill_protector.packet_detail_modal_title');
      modalRef.componentInstance.subtitle = packet.name;
      modalRef.componentInstance.price = packet.packetPremium.toFixed(2).replace('.', ',') + '€/mese';
      modalRef.componentInstance.content = modalDescriptions[packet.sku];
    }
  }

  private updateOrder(insuredItems?: BillProtectorInsuredItems): Observable<RecursivePartial<IOrderResponse<BillProtectorInsuredItems>>> {
    return this.apiService
      .putOrder({
        orderCode: this.nypDataService.Order$.value.orderCode,
        customerId: this.authService.loggedUser?.id,
        productId: this.nypDataService.CurrentProduct$.value?.id,
        packet: this.checkoutService.ChosenPackets$.value.packet,
        chosenWarranties: this.checkoutService.ChosenPackets$.value.warranties,
        price: this.checkoutService.ChosenPackets$.value.price,
        insuredItems: insuredItems,
        anagState: 'Draft',
      });
  }

  prevStep(insuranceInfoState: InsuranceInfoStates): void {
    let label: string;

    switch (insuranceInfoState) {
      case 'packet-selection':
        label = 'packetselezione';
        break;
      case 'insured-documents':
        label = 'documentiassicurato';
        break;
      case 'insurance-destination':
        label = 'datibeneficario';
        break;
      default:
        label = 'generalback';
    }

    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' +
      document.getElementById('button-back').textContent.toLowerCase().replace(/\s/g, '') +
      '-' + label;
    digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);

    if (insuranceInfoState === 'insured-documents') {
      this.checkoutService.InsuranceInfoState$.next('packet-selection');
    } else if (insuranceInfoState === 'insurance-destination') {
      this.checkoutService.InsuranceInfoState$.next('insured-documents');
    }
  }

  nextStep(insuranceInfoState: InsuranceInfoStates): void {
    const politicallyExposedPerson = this.formDocument.get('politicallyExposedPerson')?.value;
    let label: string;

    switch (insuranceInfoState) {
      case 'packet-selection':
        label = 'packetselezione';
        break;
      case 'insured-documents':
        if (politicallyExposedPerson !== 'si') {
        label = 'documentiassicurato';
        } else {
          this.toastr.error("Non è possibile proseguire, per persone politicamente esposte è necessario contattare il servizio clienti");
          return;
        }
        break;
      case 'insurance-destination':
        label = 'datibeneficario';
        break;
      default:
        label = 'generalnext';
    }

    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' +
      document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '') +
      '-' + label;
    digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);

    if (insuranceInfoState === 'packet-selection') {
      this.checkoutService.InsuranceInfoState$.next('insured-documents');
    } else if (insuranceInfoState === 'insured-documents') {
      this.checkoutService.InsuranceInfoState$.next('insurance-destination');
    } else if (insuranceInfoState === 'insurance-destination') {
      this.nypDataService.CurrentState$.next('address');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
