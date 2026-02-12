import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, Country, State } from '@model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService } from '@services';
import { CheckoutStates, IOrderResponse, Packet, ProtezioneCasaInsuredItems, RecursivePartial, } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_PROTEZIONE_CASA_KENTICO_NAME, TIM_PROTEZIONE_CASA_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { kentico, KenticoPipe } from 'app/shared/pipe/kentico.pipe';
import { environment } from 'environments/environment';
import { Observable, zip } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { IModalTranslation, InsuranceInfoAlertModalComponent } from '../../modal/insurance-info-alert-modal/insurance-info-alert-modal.component';
import { IModalTransaltion, InsuranceInfoDetailsModalComponent } from '../../modal/insurance-info-details-modal/insurance-info-details-modal.component';
import { TimProtezioneCasaApiService } from '../../services/api.service';
import { PacketsName, PacketsNameEnum, IPacketNWarranties, TimProtezioneCasaCheckoutService } from '../../services/checkout.service';
import { AdobeAnalyticsDatalayerService } from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { digitalData } from '../../../../../../core/services/adobe_analytics/adobe-analytics-data.model';
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";

@Component({
  selector: 'app-checkout-step-insurance-info',
  templateUrl: './checkout-step-insurance-info.component.html',
  styleUrls: [
    './checkout-step-insurance-info.component.scss',
    '../../../../../../components/public/packet-selector/packet-selector.component.scss',
    '../../../../styles/checkout-forms.scss',
    '../../../../styles/size.scss',
    '../../../../styles/colors.scss',
    '../../../../styles/text.scss',
    '../../../../styles/common.scss',
  ]
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {
  public ChosenPackets$: Observable<IPacketNWarranties>;
  public Order$ = this.nypDataService.Order$;
  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  @ViewChild('smartCheckbox') public smartCheckbox: ElementRef;
  @ViewChild('deluxeCheckbox') public deluxeCheckbox: ElementRef;


  @Input('isMobileView') public isMobileView: boolean = false;

  public readonly KenticoPrefix = 'insurance_info';

  titleStates: CheckoutStates[] = [];
  summaryStates: CheckoutStates[] = ['address', 'survey', 'consensuses'];
  form: FormGroup;
  countries: Country[];
  states: State[];
  cities: City[];
  selectedTabPacket: PacketsNameEnum.Light | PacketsNameEnum.Deluxe | PacketsNameEnum.Smart | PacketsNameEnum.Photovoltaic = PacketsNameEnum.Smart;
  private lightWarranties: { code: number, label: string, price: number }[] = [];
  private smartWarranties: { code: number, label: string, checked: boolean, price: number }[] = [];
  private smartChoosableWarranties: { code: number, label: string, checked: boolean, price: number }[] = [];
  private deluxeWarranties: { code: number, label: string, checked: boolean, price: number }[] = [];
  private deluxeChoosableWarranties: { code: number, label: string, checked: boolean, price: number }[] = [];
  private photovoltaicWarranties: { code: number, label: string, checked: boolean, price: number }[] = [];

  private selectedPacket: string;

  public get PhotovoltaicDisabled(): boolean {
    return (this.checkoutService.SelectedPackets.smartII && this.checkoutService.SelectedPackets.mutualExclusive == 'Smart')
      || (this.checkoutService.SelectedPackets.deluxeII && this.checkoutService.SelectedPackets.mutualExclusive == 'Deluxe');
  }

  packetLabel: {
    'Light': 'tim_protezione_casa.insurance_info_button_selected' | 'tim_protezione_casa.insurance_info_button_select',
    'Smart': 'tim_protezione_casa.insurance_info_button_selected' | 'tim_protezione_casa.insurance_info_button_select',
    'Deluxe': 'tim_protezione_casa.insurance_info_button_selected' | 'tim_protezione_casa.insurance_info_button_select',
    'Photovoltaic': 'tim_protezione_casa.insurance_info_button_photovoltaic_remove' | 'tim_protezione_casa.insurance_info_button_photovoltaic_select',
  } = { 'Light': 'tim_protezione_casa.insurance_info_button_select', 'Smart': 'tim_protezione_casa.insurance_info_button_select', 'Deluxe': 'tim_protezione_casa.insurance_info_button_select', 'Photovoltaic': 'tim_protezione_casa.insurance_info_button_photovoltaic_select', };

  public ownerTypes: { code: string, label: string }[] = [{ code: 'Proprietario', label: kentico('tim_protezione_casa.insurance_info_estate_data_select_type_owner') }, { code: 'Inquilino', label: kentico('tim_protezione_casa.insurance_info_select_type_owner_inquilino') }]
  public buildingTypes: { code: string, label: string }[] = [{ code: 'Abitazione principale', label: kentico('tim_protezione_casa.insurance_info_estate_data_housing_use_main_house') }, { code: 'Altro', label: kentico('tim_protezione_casa.insurance_info_estate_data_housing_use_other') }]

  constructor(
    private formBuilder: FormBuilder,
    public nypUserService: NypUserService,
    public dataService: DataService,
    public checkoutService: TimProtezioneCasaCheckoutService,
    private modalService: NgbModal,
    private apiService: TimProtezioneCasaApiService,
    private authService: AuthService,
    private kenticoPipe: KenticoPipe,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.checkoutService.SelectedPackets.smartII = false;
    this.checkoutService.SelectedPackets.deluxeII = false;

    this.form = this.formBuilder.group({
      country: [environment.timProtezioneCasaCountry ?? null, Validators.required],
      province: [environment.timProtezioneCasaProvince ?? null, Validators.required],
      city: [environment.timProtezioneCasaCity ?? null, Validators.required],
      postalCode: [environment.timProtezioneCasaPostalCode ?? null, [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      address: [environment.timProtezioneCasaAddress ?? null, Validators.required],
      civicNumber: [environment.timProtezioneCasaCivicNumber ?? null, Validators.required],
      ownerType: [environment.timProtezioneCasaOwnerType ?? null, Validators.required],
      buildingType: [environment.timProtezioneCasaBuildingType ?? null, Validators.required],
    });
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe((countries) => {
      this.countries = countries.filter(country => ['SMR', 'ITA', 'VAT'].includes(country?.iso3));
      this.dataService.setCountries(this.countries);

      if (this.form.controls['country']?.value) {
        this.getStates(this.form.controls['country']?.value).subscribe();
        if (!this.form.controls['province']?.value) this.form.controls['city'].disable();
        else this.getCity(this.form.controls['province']?.value).subscribe();
      }

      const state$ = this.nypDataService.CurrentState$.pipe(filter(state => this.pageStates.includes(state)), take(1));

      zip(
        product$,
        state$,
      ).subscribe(() => {
        //this.choosePacket(PacketsNameEnum.Smart);
        this.checkoutService.ChosenPackets$.next({
          packet: '',
          warranties: [],
          price: 0,
          packetCombo: '',
        });
      });
    });

    const product$ = this.nypDataService.CurrentProduct$.pipe(
      tap(product => {
        product.packets?.
          filter(packet => {
            //A : Smart
            //B : Deluxe
            //C : Smart + Inagibilità
            //D : Deluxe + Inagibilità
            //E : Smart + Fotovoltaico
            //F : Deluxe + Fotovoltaico
            switch (packet.sku) {
              case "tim-protezione-casa-light": this.checkoutService.SelectedPackets.currentPacketConfiguration.Light.basic = Object.assign(packet, { packetCombination: packet.configuration.externalCode }); break;
              case "tim-protezione-casa-smart": this.checkoutService.SelectedPackets.currentPacketConfiguration.Smart.basic = Object.assign(packet, { packetCombination: packet.configuration.externalCode }); break;
              case "tim-protezione-casa-deluxe": this.checkoutService.SelectedPackets.currentPacketConfiguration.Deluxe.basic = Object.assign(packet, { packetCombination: packet.configuration.externalCode }); break;
              case "tim-protezione-casa-smart-photovoltaic": this.checkoutService.SelectedPackets.currentPacketConfiguration.Smart.photovoltaic = Object.assign(packet, { packetCombination: packet.configuration.externalCode }); break;
              case "tim-protezione-casa-deluxe-photovoltaic": this.checkoutService.SelectedPackets.currentPacketConfiguration.Deluxe.photovoltaic = Object.assign(packet, { packetCombination: packet.configuration.externalCode }); break;
              case "tim-protezione-casa-smart-ii": this.checkoutService.SelectedPackets.currentPacketConfiguration.Smart.ii = Object.assign(packet, { packetCombination: packet.configuration.externalCode }); break;
              case "tim-protezione-casa-deluxe-ii": this.checkoutService.SelectedPackets.currentPacketConfiguration.Deluxe.ii = Object.assign(packet, { packetCombination: packet.configuration.externalCode }); break;
              case "tim-protezione-casa-photovoltaic": this.checkoutService.SelectedPackets.currentPacketConfiguration.Photovoltaic.basic = packet; break;
            }

            switch (packet.name) {
              case PacketsNameEnum.Light: {
                this.lightWarranties = packet.warranties.
                  map(warranty => ({ code: warranty.id, label: warranty.translationCode, price: warranty.insurancePremium }));

                this.checkoutService.SelectedPackets.lightWarranties = [...this.lightWarranties];
              }; break;
              case PacketsNameEnum.SmartII: {
                this.smartWarranties = packet.warranties
                  .filter(w => !w.translationCode.includes('photovoltaic') && w.preselected)
                  .map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium }));

                this.smartChoosableWarranties = packet.warranties
                  .filter(w => !w.translationCode.includes('photovoltaic') && !w.preselected)
                  .map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium }));

                this.checkoutService.SelectedPackets.smartWarranties = [...this.smartWarranties, ...this.smartChoosableWarranties];
                return true;
              }; break;
              case PacketsNameEnum.DeluxeII: {
                this.deluxeWarranties = packet.warranties
                  .filter(w => !w.translationCode.includes('photovoltaic') && w.preselected)
                  .map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium }));

                this.deluxeChoosableWarranties = packet.warranties
                  .filter(w => !w.translationCode.includes('photovoltaic') && !w.preselected)
                  .map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium }));

                this.checkoutService.SelectedPackets.deluxeWarranties = [...this.deluxeWarranties, ...this.deluxeChoosableWarranties];
                return true;
              }; break;
              case PacketsNameEnum.Photovoltaic: {
                this.photovoltaicWarranties = packet.warranties.
                  map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium }));

                this.checkoutService.SelectedPackets.photovoltaicWarranties = [...this.photovoltaicWarranties];
              }; break;
            }
          })
          .forEach(packet => packet.warranties
            .forEach(warranty => this.chooseWarranty(packet?.name, { code: warranty.id, label: warranty.translationCode, checked: warranty.preselected }, warranty?.mandatory, true))
          );
      }));
  }


  public getAvailableOwnerTypes(): { code: string, label: string }[] {
    if (this.selectedPacket === 'Light') {

      return this.ownerTypes;
    } else {

      return this.ownerTypes.filter(type => type.code === 'Proprietario');
    }
  }

  toHomeDataEntry() {
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '');
    this.adobeAnalyticsDataLayerService.adobeTrackClick();
    this.kenticoTranslateService.getItem<any>('tim_protezione_casa').pipe(take(1)).subscribe(item => {
      const stepName = item?.insurance_info_estate_data_title?.value;
      digitalData.page.pageInfo.pageName = stepName;
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    })
    this.checkoutService.InsuranceInfoState$.next('home-data-entry');
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required')) {
        return 'error-field'
      }
    }
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid &&
      (this.form.get(formControlName).touched || this.form.get(formControlName).dirty)
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType]
  }

  selectChanged(id: number, nextControlName: 'province' | 'city') {
    if (!id) return;

    if (nextControlName == 'province') {
      this.getStates(id).subscribe();
    } else {
      this.getCity(id).subscribe();
    }
  }

  getCountry(id: string): Observable<Country[]> {
    return this.nypUserService.getCountries(id);
  }

  findElementById(id: number, elements: { id?: number; abbr?: string; name?: string }[]) {
    if (id && elements?.length) {
      return elements.find(element => element?.id === id);
    }
  }

  findElementByCode(code: string, elements: { code: string }[]) {
    if (code) {
      return elements.find(element => element?.code === code);
    }
  }

  getCity(id: number): Observable<City[]> {
    this.form.get('city').patchValue(null);
    this.form.get('city').disable();

    return this.nypUserService.getCities(id).pipe(tap(cities => {
      this.cities = cities;

      if (this.cities.length > 0) this.form.controls['city'].enable();
    }));
  }

  getStates(id: number): Observable<State[]> {
    this.form.get('province').patchValue(null);
    this.form.get('province').disable();
    this.form.get('city').patchValue(null);
    this.form.get('city').disable();

    return this.nypUserService.getProvince(id).pipe(tap(states => {
      this.states = states;

      if (this.states.length > 0) this.form.controls['province'].enable();
      if (this.form.controls['province'].value) this.getCity(this.form.controls['province'].value).subscribe();
      else this.form.controls['city'].disable();
    }));
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  submit() {
    const provinceId = this.form.controls['province'].value;
    const selectedProvince = this.findElementById(provinceId, this.states);
    const currentStateName = selectedProvince?.name;
    const currentStateAbbr = selectedProvince?.abbr;

    const insuredItem: ProtezioneCasaInsuredItems = {
      address: this.form.controls['address'].value,
      city: this.form.controls['city'].value,
      house_number: this.form.controls['civicNumber'].value,
      owner_type: this.form.controls['ownerType'].value,
      state_id: +this.form.controls['province'].value,
      country_id: +this.form.controls['country'].value,
      usage: this.form.controls['buildingType'].value,
      zipcode: this.form.controls['postalCode'].value,
      state: currentStateName,
      stateAbbr: currentStateAbbr,
    };

    this.updateOrder(insuredItem).subscribe(() => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '');
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.nypDataService.CurrentState$.next('login-register')
    });
  }

  openWarrantiesInfoModal(packetName: PacketsName, packetTitleSlug: string, productTitle: string) {
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = 'apri-scopridettagli-' + packetName.toLowerCase();
    this.adobeAnalyticsDataLayerService.adobeTrackClick();
    const product = this.nypDataService.CurrentProduct$.value;
    const packet = product?.packets?.find(packet => packet.name == packetName);

    const modalRef = this.modalService.open(InsuranceInfoDetailsModalComponent, {
      size: "lg",
      windowClass: "tim-modal-window",
    });

    const packetTranslationKeysSet = new Set<string>();
    // Querying for warranties
    Object.keys(NypDataService.Translations[TIM_PROTEZIONE_CASA_KENTICO_NAME])
      .forEach(sectionKey => {
        if (sectionKey.toLowerCase().includes(`${this.KenticoPrefix}_p_${packetName.toLowerCase()}_w_`)) {
          console.log(sectionKey)
          if (sectionKey.toLowerCase().endsWith('_t') || sectionKey.toLowerCase().endsWith('_d'))
            packetTranslationKeysSet.add(`tim_protezione_casa.${sectionKey.substring(0, sectionKey.length - 2)}`);
        }
      });

    modalRef.componentInstance.translation = {
      title: `${productTitle} - ${this.kenticoPipe.transform(packetTitleSlug)}`,
      price: packet?.packetPremium || Number.NaN,
      warranties: Array.from(packetTranslationKeysSet).map(packet => ({
        title: `${packet}_t`,
        description: `${packet}_d`,
      })).sort((a, b) => {
        // Sort added as a workaround to place choosable warranty as last element of the list.
        // Better to add ordering logic in the database.
        if (b.title.split('_').includes('choosable')) {
          return -1;
        } else {
          return 0;
        }
      }),
    } as IModalTransaltion;
  }

  choosePacket(packetName: PacketsName) {
    const selectedPacketBackup = this.checkoutService.SelectedPackets;

    if (packetName == PacketsNameEnum.Photovoltaic) {
      this.checkoutService.SelectedPackets.photovoltaic = !this.checkoutService.SelectedPackets.photovoltaic;
    } else {
      if (this.checkoutService.SelectedPackets.mutualExclusive == packetName) {
        this.checkoutService.SelectedPackets.mutualExclusive = undefined;
      } else {
        this.checkoutService.SelectedPackets.mutualExclusive = packetName;
      }
    }

    this.packetLabel.Light = this.checkoutService.SelectedPackets.mutualExclusive == PacketsNameEnum.Light ? 'tim_protezione_casa.insurance_info_button_selected' : 'tim_protezione_casa.insurance_info_button_select';
    this.packetLabel.Smart = this.checkoutService.SelectedPackets.mutualExclusive == PacketsNameEnum.Smart ? 'tim_protezione_casa.insurance_info_button_selected' : 'tim_protezione_casa.insurance_info_button_select';
    this.packetLabel.Deluxe = this.checkoutService.SelectedPackets.mutualExclusive == PacketsNameEnum.Deluxe ? 'tim_protezione_casa.insurance_info_button_selected' : 'tim_protezione_casa.insurance_info_button_select';
    this.packetLabel.Photovoltaic = this.checkoutService.SelectedPackets.photovoltaic ? 'tim_protezione_casa.insurance_info_button_photovoltaic_remove' : 'tim_protezione_casa.insurance_info_button_photovoltaic_select';

    if (this.checkoutService.SelectedPackets.mutualExclusive == PacketsNameEnum.Light) {
      this.disableOtherPackets(true);
    } else {
      this.disableOtherPackets(false);
    }

    console.log(this.checkoutService.SelectedPackets, " -----> Pacchetto selezionato");

    if (this.checkoutService.SelectedPackets.photovoltaic && !this.checkoutService.SelectedPackets.mutualExclusive) {
      this.checkInvalidCombinations("tim_protezione_casa.insurance_info_alert_modal_warning_title", "tim_protezione_casa.insurance_info_alert_modal_desc_possible_photovolt")
      this.checkoutService.SelectedPackets.photovoltaic = false
      this.packetLabel.Photovoltaic = 'tim_protezione_casa.insurance_info_button_photovoltaic_select'
    } else if ((this.checkoutService.SelectedPackets.smartII && this.checkoutService.SelectedPackets.photovoltaic && this.checkoutService.SelectedPackets.mutualExclusive == PacketsNameEnum.Smart) || (this.checkoutService.SelectedPackets.deluxeII && this.checkoutService.SelectedPackets.photovoltaic && this.checkoutService.SelectedPackets.mutualExclusive == PacketsNameEnum.Deluxe)) {
      this.checkInvalidCombinations("tim_protezione_casa.insurance_info_alert_modal_warning_title", "tim_protezione_casa.insurance_info_alert_modal_desc_not_possible_photo")
      this.checkoutService.SelectedPackets.photovoltaic = false
      this.packetLabel.Photovoltaic = 'tim_protezione_casa.insurance_info_button_photovoltaic_select'
      return
    }

    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + this.checkoutService.SelectedPackets?.mutualExclusive ? `Seleziono - ${this.checkoutService.SelectedPackets?.mutualExclusive}` : `Rimuovo - ${this.checkoutService.SelectedPackets?.mutualExclusive}`;
    this.adobeAnalyticsDataLayerService.adobeTrackClick();
    this.calculatePrice();
    this.updatePacket();
  }

  disableOtherPackets(disable: boolean) {
    this.checkoutService.SelectedPackets.disableSmart = disable;
    this.checkoutService.SelectedPackets.disableDeluxe = disable;
    this.checkoutService.SelectedPackets.disablePhotovoltaic = disable;
  }


  checkInvalidCombinations(title: string, description: string) {
    const modalRef = this.modalService.open(InsuranceInfoAlertModalComponent, {
      size: "sm",
      windowClass: "modal-window",
    }
    );
    modalRef.componentInstance.translation = {
      title: `${title}`,
      description: `${description}`,
    } as IModalTranslation;

  }

  customCompare(o1: string, o2: { code: string, label: string }): boolean {
    return o1 === o2?.code;
  }

  private updatePacket() {
    let packet: string;
    this.checkoutService.ChosenPacketsName = [];

    let chosenPacket: RecursivePartial<Packet>;

    if (this.checkoutService.SelectedPackets.mutualExclusive) {
      //packet = this.checkoutService.SelectedPackets.mutualExclusive;
      if (this.checkoutService.SelectedPackets.mutualExclusive == PacketsNameEnum.Light) {
        this.checkoutService.ChosenPacketsName.push('tim_protezione_casa.insurance_info_light_title');
        chosenPacket = this.checkoutService.SelectedPackets.currentPacketConfiguration.Light.basic;
        packet = chosenPacket.name;
      }
      else if (this.checkoutService.SelectedPackets.mutualExclusive == PacketsNameEnum.Smart) {
        this.checkoutService.ChosenPacketsName.push('tim_protezione_casa.insurance_info_smart_title');
        if (this.checkoutService.SelectedPackets.smartII) {
          chosenPacket = this.checkoutService.SelectedPackets.currentPacketConfiguration.Smart.ii;
          packet = chosenPacket.name;
        } else if (this.checkoutService.SelectedPackets.photovoltaic) {
          chosenPacket = this.checkoutService.SelectedPackets.currentPacketConfiguration.Smart.photovoltaic;
          packet = chosenPacket.name;
        } else {
          chosenPacket = this.checkoutService.SelectedPackets.currentPacketConfiguration.Smart.basic;
          packet = chosenPacket.name;
        }
      } else if (this.checkoutService.SelectedPackets.mutualExclusive == PacketsNameEnum.Deluxe) {
        this.checkoutService.ChosenPacketsName.push('tim_protezione_casa.insurance_info_deluxe_title');
        if (this.checkoutService.SelectedPackets.deluxeII) {
          chosenPacket = this.checkoutService.SelectedPackets.currentPacketConfiguration.Deluxe.ii;
          packet = chosenPacket.name;
        } else if (this.checkoutService.SelectedPackets.photovoltaic) {
          chosenPacket = this.checkoutService.SelectedPackets.currentPacketConfiguration.Deluxe.photovoltaic;
          packet = chosenPacket.name;
        } else {
          chosenPacket = this.checkoutService.SelectedPackets.currentPacketConfiguration.Deluxe.basic;
          packet = chosenPacket.name;
        }
      }
      if (this.checkoutService.SelectedPackets.photovoltaic) {
        packet = this.checkoutService.SelectedPackets.currentPacketConfiguration.Photovoltaic.basic.name;
        this.checkoutService.ChosenPacketsName.push('tim_protezione_casa.insurance_info_photovoltaic_title');
      }
    } else {
      console.log('A mandatory packet must be selected');
    }

    this.checkoutService.SelectedPackets.currentPacket = chosenPacket;

    if (this.checkoutService.SelectedPackets.photovoltaic) {
      //price += this.checkoutService.SelectedPackets.photovoltaicPrice;
      this.form.controls['ownerType'].setValue('Proprietario');
      this.form.controls['buildingType'].setValue('Abitazione principale');
      this.form.controls['ownerType'].disable();
      //  this.form.controls['buildingType'].disable();
    } else {
      this.form.controls['ownerType'].patchValue(null);
      this.form.controls['buildingType'].patchValue(null);
      this.form.controls['ownerType'].enable();
      // this.form.controls['buildingType'].enable();
    }

    this.checkoutService.ChosenPackets$.next({
      packet: packet,
      warranties: chosenPacket?.warranties?.map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium })),
      price: chosenPacket?.packetPremium,
      packetCombo: chosenPacket?.sku,
    });

    if (!!packet) {
      this.selectedPacket = packet;
      this.updateOrder().subscribe();
    }
  }

  private updateOrder(insuredItems?: ProtezioneCasaInsuredItems): Observable<RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>>> {
    return this.apiService
      .putOrder({
        orderCode: this.nypDataService.Order$.value.orderCode,
        customerId: this.authService.loggedUser?.id,
        productId: this.nypDataService.CurrentProduct$.value?.id,
        packet: this.checkoutService.SelectedPackets.currentPacket,
        chosenWarranties: this.checkoutService.SelectedPackets.currentPacket.warranties
          ?.map(warranty => Object.assign(warranty, { startDate: this.nypDataService.Order$.value?.orderItem[0]?.start_date, endDate: this.nypDataService.Order$.value?.orderItem[0]?.expiration_date })),
        packetCombination: this.checkoutService.SelectedPackets.currentPacket.packetCombination,
        insuredItems: insuredItems,
        price: this.checkoutService.SelectedPackets.currentPacket.packetPremium,
        anagState: 'Draft',
      })
  }

  chooseWarranty(packetName: PacketsName | string, warranty: { code: number, label: string, checked: boolean, }, checked: boolean, mandatory: boolean) {
    switch (packetName) {
      case PacketsNameEnum.Photovoltaic: break;
      case PacketsNameEnum.DeluxeII, PacketsNameEnum.SmartII: break;
      case PacketsNameEnum.Smart: {
        if (this.checkoutService.SelectedPackets.photovoltaic && !this.checkoutService.SelectedPackets.smartII) {
          this.checkInvalidCombinations("tim_protezione_casa.insurance_info_alert_modal_warning_title", "tim_protezione_casa.insurance_info_alert_modal_description_indenizzo")
          this.smartCheckbox.nativeElement.checked = false
          return
        }
        const w = this.checkoutService.SelectedPackets.smartWarranties?.find(w => w?.code == warranty?.code);
        if (!!w) w.checked = checked;
        if (!mandatory) this.checkoutService.SelectedPackets.smartII = checked;
      }; break;
      case PacketsNameEnum.Deluxe: {
        if (this.checkoutService.SelectedPackets.photovoltaic && !this.checkoutService.SelectedPackets.deluxeII) {
          this.checkInvalidCombinations("tim_protezione_casa.insurance_info_alert_modal_warning_title", "tim_protezione_casa.insurance_info_alert_modal_description_indenizzo")
          this.deluxeCheckbox.nativeElement.checked = false
          return
        }
        const w = this.checkoutService.SelectedPackets.deluxeWarranties?.find(w => w?.code == warranty?.code);
        if (!!w) w.checked = checked;
        if (!mandatory) this.checkoutService.SelectedPackets.deluxeII = checked;
      }; break;
      default: { console.log(TIM_PROTEZIONE_CASA_PRODUCT_NAME, 'wrong packetname dude', packetName); return; };
    }
    this.calculatePrice();
    // Without the check on the status, the update would be triggered after gup redirect, with order status changes
    if (this.checkoutService.ChosenPackets$.value?.packet == packetName && this.pageStates.includes(this.nypDataService.CurrentState$.value))
      this.updatePacket();
  }

  private calculatePrice() {
    this.checkoutService.SelectedPackets.lightPrice = this.checkoutService.SelectedPackets.currentPacketConfiguration.Light.basic.packetPremium;

    this.checkoutService.SelectedPackets.smartPrice = this.checkoutService.SelectedPackets.smartII ? this.checkoutService.SelectedPackets.currentPacketConfiguration.Smart.ii.packetPremium : this.checkoutService.SelectedPackets.currentPacketConfiguration.Smart.basic.packetPremium;

    this.checkoutService.SelectedPackets.deluxePrice = this.checkoutService.SelectedPackets.deluxeII ? this.checkoutService.SelectedPackets.currentPacketConfiguration.Deluxe.ii.packetPremium : this.checkoutService.SelectedPackets.currentPacketConfiguration.Deluxe.basic.packetPremium;

    this.checkoutService.SelectedPackets.photovoltaicPrice = this.checkoutService.SelectedPackets.currentPacketConfiguration.Photovoltaic.basic.packetPremium;
  }

  prevStep(): void {
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('back-button').textContent.toLowerCase().replace(/\s/g, '');
    digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    this.checkoutService.InsuranceInfoState$.next('packet-selector')
  }

}

export interface IPacketChoose {
  mutualExclusive: PacketsNameEnum.Light | PacketsNameEnum.Smart | PacketsNameEnum.Deluxe | undefined;
  photovoltaic: boolean;
  smartII: boolean;
  deluxeII: boolean;
  lightWarranties: { code: number, label: string, price: number }[];
  smartWarranties: { code: number, label: string, checked: boolean, price: number }[];
  deluxeWarranties: { code: number, label: string, checked: boolean, price: number }[];
  photovoltaicWarranties: { code: number, label: string, checked: boolean, price: number }[];
  lightPrice: number;
  smartPrice: number;
  deluxePrice: number;
  photovoltaicPrice: number;
  disableSmart?: boolean;
  disableDeluxe?: boolean;
  disablePhotovoltaic?: boolean;
  currentPacketConfiguration: { 'Light': { 'basic': RecursivePartial<Packet> }, 'Smart': { 'basic': RecursivePartial<Packet>, 'ii': RecursivePartial<Packet>, 'photovoltaic': RecursivePartial<Packet> }, 'Deluxe': { 'basic': RecursivePartial<Packet>, 'ii': RecursivePartial<Packet>, 'photovoltaic': RecursivePartial<Packet> }, 'Photovoltaic': { 'basic': RecursivePartial<Packet> } }
  currentPacket: RecursivePartial<Packet>;
}

function concat(arg0: Observable<RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>>>): Observable<RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems>>> {
  throw new Error('Function not implemented.');
}

