import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutCardInsuranceInfoAutoFormComponent} from '../../../checkout-card/checkout-card-insurance-info-auto-form/checkout-card-insurance-info-auto-form.component';
import {AuthService, CheckoutService, DataService, InsurancesService} from '@services';
import {CheckoutStepService} from '../../../services/checkout-step.service';
import {FormBuilder} from '@angular/forms';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import {take} from 'rxjs/operators';
import {HomeRequestQuote} from '@model';

@Component({
  selector: 'app-checkout-step-insurance-info-ge-home',
  templateUrl: './checkout-step-insurance-info-ge-home.component.html',
  styleUrls: ['./checkout-step-insurance-info-ge-home.component.scss']
})
export class CheckoutStepInsuranceInfoGeHomeComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  @ViewChild('infoAutoForm') infoAutoForm: CheckoutCardInsuranceInfoAutoFormComponent;

  product: CheckoutStepInsuranceInfoProduct;
  addons: any[];
  handleNextStep: boolean;
  attendees: any[];
  addon_list: any[][];
  kenticoBody: any;
  optionalWarranty = false;
  infoHomeStep = false;
  recapOprionalWarranties = false;
  furto: any;
  checkRegionFurtoRapina = false;
  checkRegionRotturaImpianti = false;

  notAllowedIdFurtoRapina = ['av', 'bn', 'ce', 'na', 'sa',
    'cz', 'cs', 'kr', 'rc', 'vv',
    'ag', 'cl', 'ct', 'en', 'me', 'pa', 'rg', 'sr', 'tp',
    'ba', 'bt', 'br', 'fg', 'le', 'ta',
    'mt', 'pz'];
  notAllowedIdRotturaImpianti = ['av', 'bn', 'ce', 'na', 'sa'];
  addonsProposal = ['basic', 'super', 'full'];
  newTypesProposal = ['basic', 'sicura', 'super'];
  infoHomeForm: any;
  InfoInsuredPets: any;
  typeProposal: string;
  addonWithPrices: any;
  proposal: string;
  isCustomized: any;
  selectedAddons: any;

  constructor(public dataService: DataService,
              public checkoutStepService: CheckoutStepService,
              public authService: AuthService,
              public insuranceService: InsurancesService,
              public formBuilder: FormBuilder,
              public kenticoTranslateService: KenticoTranslateService,
              private checkoutService: CheckoutService
  ) {
    super();
  }

  ngOnInit() {
    this.setTypeProposal();
    const lineItem = this.product.order.line_items[0];
    for (const element of this.notAllowedIdFurtoRapina) {
      if (lineItem.insured_entities.house.state.abbr.toLowerCase() === element) {
        this.checkRegionFurtoRapina = true;
      }
    }
    for (const element of this.notAllowedIdRotturaImpianti) {
      if (lineItem.insured_entities.house.state.abbr.toLowerCase() === element) {
        this.checkRegionRotturaImpianti = true;
      }
    }
    if (localStorage.getItem('Proposal')) {
      localStorage.removeItem('Proposal');
    }
    if (localStorage.getItem('Customized')) {
      localStorage.removeItem('Customized');
    }
    if (localStorage.getItem('selectedAddons')) {
      localStorage.removeItem('selectedAddons');
    }
    this.setListAddons(this.product.order.data.quotation_response.addons);
    this.checkoutStepService.checkoutStepPriceChangeAfterSelectedAddonsHome$.subscribe(quoteResponse => this.uploadPrice(quoteResponse.addons));
    const furto = this.addons.find(add => add.code.toLowerCase() === 'home furto e rapina');
    const rotturaImp = this.addons.find(add => add.code.toLowerCase() === 'rottura imp abitaz');
    if (this.checkRegionFurtoRapina && furto) {
      furto.flagRegion = true;
    }
    if (this.checkRegionRotturaImpianti && rotturaImp) {
      rotturaImp.flagRegion = true;
    }
  }
  proposalTitleHandler(proposalTitle:any){
    this.proposal = proposalTitle;
  }

  addAttendee(attendee: any) {
    this.attendees = attendee;
    this.addon_list = [this.attendees];
  }

  uploadPrice(addonsListToResponse) {
    this.addons.forEach(addon => {
      const addRespGen = addonsListToResponse.find(add => add.id === addon.code);
      if (addRespGen) {
        addon.price = addRespGen.price;
        addon.importoMassimaleAssicurato = addRespGen.maximal;
        addon.selezionata = true;
      }else {
        addon.selezionata = false;
      }
    });
    this.addons = this.addons.sort((a, b) => a.id < b.id ? -1 : 1);
    this.checkoutService.setAddonsStepInsuranceInfo(this.addons.filter(addon => addon.selezionata));
  }

  setListAddons(addonsListToResponse) {
    const product = this.product.originalProduct;
    this.kenticoTranslateService.getItem('checkout_home_genertel').pipe(take(1)).subscribe(item => {
      this.kenticoBody = item;
      product.addons.forEach(addon => {
        const addRespGen = addonsListToResponse.find(add => add.id === addon.code);
        this.setListMaximal(addon);
        this.uploadKenticoToAddons(this.kenticoBody.step_insurance_info_optional_warranty.value, addon);
        if (addRespGen) {
          this.uploadAddon(addon, addRespGen);
        }
      });

      this.addons = product.addons;
      this.addons = this.addons.sort((a, b) => a.id < b.id ? -1 : 1);
    });
  }

  uploadAddon(addon, addonG) {
    addon.price = addonG.price;
    addon.selezionata = addonG.selected;
    addon.importoMassimaleAssicurato = addonG.maximal;
  }

  setListMaximal(addon) {
    const lineItem = this.product.order.line_items[0];
    if (addon.code === 'HOME Furto e rapina') {
      addon.listSumInsured = this.calcArrayMaximal(addon.ceilings_params.min, this.checkRegionFurtoRapina ? 2500 : addon.ceilings_params.max, addon.ceilings_params.step);
      addon.homeProtected = true;
      addon.usualHome = !!(lineItem.insured_entities.house.usage === '0' || lineItem.insured_entities.house.usage === '2');
      addon.importoMassimaleAssicurato = 2500;
    } else {
      if (addon.ceilings) {
        addon.listaMassimali = addon.ceilings;
      }
      if (addon.ceilings_params) {
        addon.listaMassimali = this.calcArrayMaximal(addon.ceilings_params.min, addon.ceilings_params.max, addon.ceilings_params.step);
      }
      if (addon.listaMassimali) {
        addon.importoMassimaleAssicurato = addon.listaMassimali[0];
      }
    }
  }

  calcArrayMaximal(min: number, max: number, increment: number) {
    const array = [];
    for (let i = min; i <= max; i = i + increment) {
      array.push(i);
    }
    return array;
  }

  submit(infoHomeData) {
    this.infoHomeForm = infoHomeData.home;
    this.InfoInsuredPets = infoHomeData.pets || [];
  }

  isFormValid(): boolean {
    return this.infoAutoForm.form.valid;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const homeInfo = this.infoHomeForm;
    const addonFurtoRap = this.addons.find(add => add.code === 'HOME Furto e rapina');
    homeInfo.usual_residence = addonFurtoRap.usualHome;
    const insuredPets = this.InfoInsuredPets;
    return Object.assign({}, this.product, {insuredSubjects: null, homeInfo, insuredPets});
  }

  getCarInfo() {
    return this.infoAutoForm.computeModel();
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  uploadKenticoToAddons(bodyKentico: any, addon) {

    const addonProvKentico = bodyKentico.find(elem => elem.code.value.toLowerCase() === addon.code.toLowerCase());

    if (addonProvKentico) {
      addon.additional_information = addonProvKentico.additional_information.value.length !== 0 ? addonProvKentico.additional_information.value[0] : null;
      addon.card_convention = addonProvKentico.card_convention.value.length !== 0 ? addonProvKentico.card_convention.value[0] : null;
      addon.description_combinability = addonProvKentico.description_combinability.value !== '' ? addonProvKentico.description_combinability.value : null;
      addon.included = addonProvKentico.included.value.length !== 0 ? addonProvKentico.included.value.length !== 0 : null;
      addon.name = addonProvKentico.name.value !== '' ? addonProvKentico.name.value : null;
      addon.nameForOption = addonProvKentico.name_for_option.value !== '' ? addonProvKentico.name_for_option.value : null;
      addon.subtitle_name = addonProvKentico.subtitle_name.value !== '' ? addonProvKentico.subtitle_name.value : null;
      addon.pet = addonProvKentico.pet.value.length !== 0 ? addonProvKentico.pet.value[0] : null;
      addon.numPet = addonProvKentico.pet.value.length !== 0 ? 1 : null;
      addon.numPetList = addonProvKentico.pet.value.length !== 0 ? [1, 2, 3, 4, 5, 6] : null;
      addon.kentico_description = addonProvKentico.kentico_description.value;

      if(addonProvKentico.tooltip_modal.value[0]){
        addon.tooltip_modal = {tooltip_txt: addonProvKentico.tooltip_modal.value[0].tooltip_txt.value,
                              tooltip_tlt: addonProvKentico.tooltip_modal.value[0].tooltip_tlt.value,
                              tooltip_btn: addonProvKentico.tooltip_modal.value[0].tooltip_btn.value
        }
      }
    }
    return addon;
  }

  handleChangeStep(optionalWarranty?: boolean, infoHomeStep?: boolean, recapOprionalWarranties?: boolean) {
    this.optionalWarranty = optionalWarranty;
    this.infoHomeStep = infoHomeStep;
    this.recapOprionalWarranties = recapOprionalWarranties;
    if (localStorage.getItem('Customized')) {
      this.isCustomized = localStorage.getItem('Customized');
    }
    const selectedAddons = localStorage.getItem('selectedAddons');
    this.selectedAddons =  JSON.parse(selectedAddons);
  }

  createProposalList(addons) {
    const addonsProposalList = [];
    this.addons.forEach(add => {
      const addonToPush = addons.find(addSelect => addSelect.code === add.code);
      if (addonToPush) {
        add.selezionata = true;
        addonsProposalList.push(addonToPush);
      } else {
        add.selezionata = false;
      }
    });
    return addonsProposalList;
  }

  getPricing(addons): void {
    this.addonWithPrices = addons;
    this.checkoutStepService.getPricesSelectedAddonsHome(this.createRequestQuote(this.createProposalList(addons))).subscribe( response => {
      this.addonWithPrices.forEach(addon => {
        const addRespGen = response.addons.find(add => add.id === addon.code);
        if (addRespGen) {
          addon.price = addRespGen.price;
          addon.importoMassimaleAssicurato = addRespGen.maximal;
        }
      });
      });
  }

  showProposalSelected(addons): void {
    this.handleUploadPrice(this.createProposalList(addons));
  }

  handleUploadPrice(addons?: any) {
    this.checkoutStepService.priceChangeAfterSelectedAddonsHome(this.createRequestQuote(addons));
  }

  createRequestQuote(addons?: any) {
    const lineItem = this.product.order.line_items[0];
    const addonFurtoRap = this.addons.find(add => add.code === 'HOME Furto e rapina');
    const req: HomeRequestQuote = {
      product_code: this.product.code,
      sqm: lineItem.insured_entities.house.sqm,
      usage: lineItem.insured_entities.house.usage,
      state_id: lineItem.insured_entities.house.state.id,
      start_date: lineItem.start_date,
      payment_type: lineItem.payment_frequency,
      usual_residence: addonFurtoRap.usualHome,
      addons: this.createAddonsRequestQuote(addons)
    };

    const addRcCane = addons.find(add => add.code === 'RC cane');
    const addFurtoIncSelected = addons.find(add => add.code === 'HOME Furto e rapina');
    if (addRcCane) {
      req.insured_pets = addRcCane.numPet || 1;
    }
    if (addFurtoIncSelected) {
      req.secure_location = addFurtoIncSelected.homeProtected;
    }

    return req;
  }

  createAddonsRequestQuote(addons: any) {
    const arrayAddon = [];
    addons.forEach(addon => {
      arrayAddon.push({
        code: addon.code,
        maximal: addon.importoMassimaleAssicurato
      });
    });
    return arrayAddon;
  }

  setTypeProposal(type?: string) {
    this.typeProposal = type;
    if (!type) {
      this.typeProposal = 'basic';
    }
  }
}
