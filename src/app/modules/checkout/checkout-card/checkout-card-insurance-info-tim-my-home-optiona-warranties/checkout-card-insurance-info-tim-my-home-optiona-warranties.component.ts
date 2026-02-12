import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddonHomeExtraParams, AddonHomeRequest, City, State, User } from '@model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutService, DataService, UserService } from '@services';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AddonCodes, ExtraFormTypes, LinkedAddon, LinkedAddonModal, MyHomeAddonContent, ToggleOptions } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-tim-my-home/my-home-addon-content.interface';
import { CheckoutProduct } from '../../checkout.model';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { NypUserService } from '@NYP/ngx-multitenant-core';

type FormControls = { [key: string]: AbstractControl }
type FormChange = { [key: string]: any }

@Component({
  selector: 'app-checkout-card-insurance-info-tim-my-home-optiona-warranties',
  templateUrl: './checkout-card-insurance-info-tim-my-home-optiona-warranties.component.html',
  styleUrls: ['./checkout-card-insurance-info-tim-my-home-optiona-warranties.component.scss']
})
export class CheckoutCardInsuranceInfoTimMyHomeOptionaWarrantiesComponent implements OnInit, OnDestroy {
  @Input() addons: MyHomeAddonContent[];
  @Input() product: CheckoutProduct;
  @Input() content: any;
  @Input() user: User;
  @Output() selectedAddonsEmit = new EventEmitter<any>();
  @Output() showProposalWarrantyEmit = new EventEmitter<any>();
  @Output() showProposalTitle = new EventEmitter<any>();
  @Output() showInfoHomeEmit = new EventEmitter<any>();

  public damageForm: FormGroup;
  public catnatForm: FormGroup;
  public buildingTypes: string[];
  public materials: string[];
  public locationStates: State[];
  public locationCities: City[];

  private ceilingsMap: Map<string, number> = new Map()

  constructor(
    private checkoutService: CheckoutService,
    private dataService: DataService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    protected nypUserService: NypUserService,
    private checkoutStepService: CheckoutStepService
  ) {
  }

  ngOnInit() {
    const selectedAddons = this.addons.filter((addon) => addon.selezionata);
    this.checkoutService.setAddonsStepInsuranceInfo(selectedAddons);
    this.createCatnatForm(this.getAddon(AddonCodes.ADDON_CATNAT))
    this.createDamageForm(this.getAddon(AddonCodes.ADDON_DAMAGE))
  }

  ngOnDestroy() {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll()
    }
  }

  private createDamageForm(damageAddon: MyHomeAddonContent): void {
    if (!!damageAddon) {
      const isRequired = damageAddon.selezionata ? Validators.required : Validators.nullValidator
      const ceilingFormOptions = damageAddon.extraForm.options
      this.damageForm = this.formBuilder.group({
        ceiling: [ceilingFormOptions[0].value, isRequired]
      })
      this.ceilingsMap.set(ceilingFormOptions[0].value, 50000)
      this.ceilingsMap.set(ceilingFormOptions[1].value, 80000)
      this.ceilingsMap.set(ceilingFormOptions[2].value, 100000)
      this.damageForm.valueChanges.subscribe(this.updateDamageAddonPrice)
    }
  }

  private updateDamageAddonPrice = (change: FormChange) => {
    const damageAddon = this.getAddon(AddonCodes.ADDON_DAMAGE)
    damageAddon.importoMassimaleAssicurato = this.ceilingsMap.get(change.ceiling)
    const catnatAddon = this.getAddon(AddonCodes.ADDON_CATNAT)
    if (!!catnatAddon) {
      catnatAddon.importoMassimaleAssicurato = damageAddon.importoMassimaleAssicurato;
      this.catnatForm.updateValueAndValidity();
    }
    const payload = {
      product_code: this.product.originalProduct.product_code,
      user_id: this.user.id,
      addons: [{
        code: damageAddon.code,
        maximal: damageAddon.importoMassimaleAssicurato
      }]
    }
    this.checkoutStepService.getSingleAddonQuotation(payload).subscribe(response => {
      const isDamageAddon = (addon) => addon.id === AddonCodes.ADDON_DAMAGE
      damageAddon.price = response.addons.find(isDamageAddon).price.replace('.', ',')
      if (damageAddon.selezionata) {
        this.emitSelectedAddons()
      }
    })
  }

  private createCatnatForm(catnatAddon: MyHomeAddonContent): void {
    if (!!catnatAddon) {
      const responseOrder = this.dataService.getResponseOrder()
      const properties = responseOrder.line_items[0].house_properties
      this.buildingTypes = properties.building_types ?? ["Appartamento", "Abitazione Indipendente"],
        this.materials = properties.construction_materials ?? ["Cemento Armato", "Altro"]
      this.setLocationStates()
      this.catnatForm = this.formBuilder.group({
        buildingType: [null, Validators.required],
        constructionType: [null, Validators.required],
        locationState: [null, Validators.required],
        locationCity: [{
          value: null,
          disabled: !catnatAddon.extraForm.formValue
        }, Validators.required]
      })
      this.setFormValueFromOldValues(catnatAddon);
      this.catnatForm.get('locationState').valueChanges.subscribe(this.updateState)
      this.catnatForm.valueChanges.subscribe(() => this.updateCatnatAddonPrice());
    }
  }

  private setFormValueFromOldValues(catnatAddon: MyHomeAddonContent): void {
    const formValue = catnatAddon.extraForm.formValue
    if (!!formValue) {
      this.nypUserService.getCities(formValue.locationState.id).subscribe(cities => {
        this.locationCities = cities;
        this.catnatForm.setValue(formValue)
      })
    }
  }

  private updateState = (state: State) => {
    if (!!state && state.cities_required) {
      this.catnatForm.get('locationCity').setValue(null, { emitEvent: false })
      this.nypUserService.getCities(state.id).subscribe(cities => {
        this.locationCities = cities;
        this.catnatForm.get('locationCity').enable({ emitEvent: false })
      })
    } else {
      this.catnatForm.get('locationCity').disable({ emitEvent: false })
    }
  }

  private updateCatnatAddonPrice(): void {
    const catnatAddon = this.getAddon(AddonCodes.ADDON_CATNAT);
    const damageAddon = this.getAddon(AddonCodes.ADDON_DAMAGE);
    catnatAddon.importoMassimaleAssicurato = damageAddon.importoMassimaleAssicurato;
    catnatAddon.extraForm.formValue = this.catnatForm.value;
    const payload = {
      product_code: this.product.originalProduct.product_code,
      user_id: this.user.id,
      addons: this.getCatnatAddonsPayload()
    };
    this.checkoutStepService.getSingleAddonQuotation(payload).subscribe(response => {
      const isCatnatAddon = (addon) => addon.id === AddonCodes.ADDON_CATNAT
      catnatAddon.price = response.addons.find(isCatnatAddon).price.replace('.', ',')
      if (catnatAddon.selezionata) {
        this.emitSelectedAddons()
      }
    });
  }

  private getCatnatAddonsPayload(): AddonHomeRequest[] {
    const catnatAddon = this.getAddon(AddonCodes.ADDON_CATNAT);
    const payload = [{
      code: catnatAddon.code,
      params: this.createCatnatQuoteRequest(this.catnatForm.controls),
      maximal: this.getAddon(AddonCodes.ADDON_DAMAGE).importoMassimaleAssicurato,
      selected: this.isFormFilled(this.catnatForm.controls) && this.hasAllProperties(catnatAddon.quoteParams)
    }];
    const damageAddon = this.getAddon(AddonCodes.ADDON_CONTENT_DAMAGE);
    if (damageAddon.selezionata) {
      payload.unshift({
        code: damageAddon.code,
        maximal: damageAddon.importoMassimaleAssicurato,
        params: undefined,
        selected: undefined
      })
    }
    return payload;
  }

  private setLocationStates(): void {
    this.nypUserService.getDefaultCountry().pipe(
      switchMap(defaultCountry => this.nypUserService.getProvince(defaultCountry.id)),
      tap(states => this.locationStates = states),
    ).subscribe()
  }

  private getAddon(code: AddonCodes): MyHomeAddonContent {
    return this.addons.find(addon =>
      addon.code === code
    )
  }

  public getExtraFormType(type: string): ExtraFormTypes {
    return ExtraFormTypes[type]
  }

  public toggleAddon(addon: MyHomeAddonContent, forceEmitQuoteEvent = false): void {
    if (addon.linkedAddonsModal && !forceEmitQuoteEvent
      && this.shouldOpenModal(addon.code, addon.linkedAddonsModal)) {
      this.openLinkedAddonModal(addon)
    } else {
      addon.selezionata = !addon.selezionata;
      if (this.hasExtraForm(addon) && !addon.selezionata) {
        this.resetFormMaximal(addon)
      }
      this.emitSelectedAddons();
    }
  }

  private hasExtraForm(addon: MyHomeAddonContent): boolean {
    return addon.extraForm.type !== ExtraFormTypes.NONE
  }

  private resetFormMaximal(addon: MyHomeAddonContent): void {
    if (addon === this.getAddon(AddonCodes.ADDON_DAMAGE)) {
      this.damageForm.controls.ceiling.setValue(addon.extraForm.options[0].value)
    }
  }

  private shouldOpenModal(addonCode: string, linkedAddonModal: LinkedAddonModal): boolean {
    let openModal: boolean
    switch (addonCode) {
      case AddonCodes.ADDON_PRIVATE_LIFE_RC:
        openModal = !this.getAddon(AddonCodes.ADDON_HOUSE_RC).selezionata;
        break;
      case AddonCodes.ADDON_HOUSE_RC:
        openModal = this.getAddon(AddonCodes.ADDON_PRIVATE_LIFE_RC).selezionata;
        break;
      case AddonCodes.ADDON_WATER_DAMAGE:
      case AddonCodes.ADDON_CONTENT_DAMAGE:
      case AddonCodes.ADDON_CATNAT:
        openModal = !this.getAddon(AddonCodes.ADDON_DAMAGE).selezionata;
        break;
      case AddonCodes.ADDON_DAMAGE:
        openModal = this.getAddon(AddonCodes.ADDON_WATER_DAMAGE).selezionata
          || this.getAddon(AddonCodes.ADDON_CONTENT_DAMAGE).selezionata
          || this.getAddon(AddonCodes.ADDON_CATNAT).selezionata;
        break;
      default:
        openModal = false
        break;
    }
    return !!linkedAddonModal && openModal
  }

  private openLinkedAddonModal(addon: MyHomeAddonContent): void {
    const modalRef = this.modalService.open(ContainerComponent, {
      size: 'lg',
      backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
      windowClass: 'modal-window',
    });
    modalRef.componentInstance.type = 'LinkedAddonModal';
    modalRef.componentInstance.componentInputData = {
      data: addon.linkedAddonsModal,
      option: addon.linkedAddonsModal.toggleOption,
      linkedAddons: this.getLinkedAddonsToShow(addon.code, addon.linkedAddonsModal.toggleOption.code)
    };
    modalRef.result.then((linkedAddons: LinkedAddon[]) => {
      const option = addon.linkedAddonsModal.toggleOption.code
      if (option === ToggleOptions.ADD) {
        this.toggleAddon(addon, true);
      }
      if (option === ToggleOptions.REMOVE && linkedAddons) {
        linkedAddons.shift()
        linkedAddons.forEach(linkedAddon => {
          const addon = this.getAddon(linkedAddon.code as AddonCodes);
          addon.selezionata = !addon.selezionata;
        });
        this.toggleAddon(addon, true);
      }
    });
  }

  private getLinkedAddonsToShow(addonCode: string, toggleOption: ToggleOptions): LinkedAddon[] {
    let addonPrices: MyHomeAddonContent[] = []
    addonPrices.push(this.getAddon(addonCode as AddonCodes))
    switch (addonCode) {
      case AddonCodes.ADDON_HOUSE_RC:
        addonPrices.push(this.getAddon(AddonCodes.ADDON_PRIVATE_LIFE_RC))
        break;
      case AddonCodes.ADDON_PRIVATE_LIFE_RC:
        addonPrices.push(this.getAddon(AddonCodes.ADDON_HOUSE_RC))
        break;
      case AddonCodes.ADDON_DAMAGE:
        addonPrices.push(
          this.getAddon(AddonCodes.ADDON_WATER_DAMAGE),
          this.getAddon(AddonCodes.ADDON_CONTENT_DAMAGE),
          this.getAddon(AddonCodes.ADDON_CATNAT)
        )
        break;
      case AddonCodes.ADDON_WATER_DAMAGE:
      case AddonCodes.ADDON_CONTENT_DAMAGE:
      case AddonCodes.ADDON_CATNAT:
        addonPrices.push(this.getAddon(AddonCodes.ADDON_DAMAGE))
        break;
      default: break;
    }
    const isSelected = (addon) => toggleOption === ToggleOptions.REMOVE ? addon.selezionata : !addon.selezionata
    const getPriceAndName = (addon) => { return { name: addon.name, price: addon.price, code: addon.code } }
    return addonPrices.filter(isSelected).map(getPriceAndName)
  }

  public openModal(addon: MyHomeAddonContent): void {
    const modalRef = this.modalService.open(ContainerComponent, {
      size: 'lg',
      backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
      windowClass: 'modal-window',
    });
    modalRef.componentInstance.type = 'LinkedAddonModal';
    modalRef.componentInstance.componentInputData = {
      data: addon.infoAddonModal,
      isAddonActive: addon.selezionata
    };
    modalRef.result.then((result) => {
      if (result) {
        this.toggleAddon(addon, true);
      }
    });
  }

  private openNoWarrantiesModal(): void {
    const modalRef = this.modalService.open(ContainerComponent, {
      size: 'lg',
      backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
      windowClass: 'modal-window',
    });
    modalRef.componentInstance.type = 'LinkedAddonModal';
    const modalContent = this.content.modal_no_warranties.value[0]
    modalRef.componentInstance.componentInputData = {
      data: {
        title: modalContent.title.value,
        description: modalContent.description.value,
        buttonRemoveLabel: modalContent.button_remove.value,
        buttonAddLabel: modalContent.button_add.value,
        icon: modalContent.dismiss_icon.value[0].url
      }
    };
  }

  public removeAllAddons(): void {
    const removeAddon = (addon) => addon.selezionata = false
    this.addons.forEach(removeAddon);
    this.emitSelectedAddons()
  }

  public noAddonsSelected(): boolean {
    const isNotSelected = (addon) => !addon.selezionata
    return this.addons.every(isNotSelected)
  }

  private emitSelectedAddons(): void {
    const selectedAddons = this.getSelectedAddons();
    this.addExtraQuoteParams(selectedAddons);
    this.checkoutService.setAddonsStepInsuranceInfo(selectedAddons);
    this.selectedAddonsEmit.emit(selectedAddons);
  }

  private getSelectedAddons(): MyHomeAddonContent[] {
    const isSelected = (addon) => addon.selezionata || addon.code === AddonCodes.ADDON_CATNAT;
    return this.addons.filter(isSelected);
  }

  private addExtraQuoteParams(addons: MyHomeAddonContent[]): void {
    const catNatAddon = addons.find(addon => addon.code === AddonCodes.ADDON_CATNAT);
    if (!!catNatAddon) {
      catNatAddon.quoteParams = this.createCatnatQuoteRequest(this.catnatForm.controls);
    }
  }

  private createCatnatQuoteRequest(controls: FormControls): AddonHomeExtraParams {
    if (this.isFormFilled(controls)) {
      return {
        buildingType: controls.buildingType.value,
        material: controls.constructionType.value,
        state: controls.locationState.value && controls.locationState.value.name,
        cityCode: controls.locationCity.value && controls.locationCity.value.code,
      }
    }
    if (controls.buildingType.value && controls.locationState.value) {
      return {
        buildingType: controls.buildingType.value,
        state: controls.locationState.value && controls.locationState.value.name,
      }
    }
    if (controls.constructionType.value && controls.locationCity.value) {
      return {
        material: controls.constructionType.value,
        cityCode: controls.locationCity.value && controls.locationCity.value.code
      }
    }
  }

  private isFormFilled(controls: FormControls) {
    return Object.values(controls).every(control => !!control.value)
  }

  private hasAllProperties(params: AddonHomeExtraParams): boolean {
    return !params || (!!params.buildingType && !!params.cityCode && !!params.material && !!params.state)
  }

  public showProposalWarranties(): void {
    this.showProposalWarrantyEmit.emit();
    this.showProposalTitle.emit();
  }

  public showInfoHome(): void {
    if (this.noAddonsSelected()) {
      this.openNoWarrantiesModal()
    } else {
      localStorage.setItem('Customized', 'true');
      this.showInfoHomeEmit.emit();
    }
  }
}
