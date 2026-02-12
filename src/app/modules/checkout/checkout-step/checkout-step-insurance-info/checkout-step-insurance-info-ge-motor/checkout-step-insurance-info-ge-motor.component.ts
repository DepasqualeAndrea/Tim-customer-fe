import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService, CheckoutService, DataService, InsurancesService} from '@services';
import {CheckoutStepService} from 'app/modules/checkout/services/checkout-step.service';
import {Observable, of} from 'rxjs';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutCardInsuranceInfoAutoFormComponent} from 'app/modules/checkout/checkout-card/checkout-card-insurance-info-auto-form/checkout-card-insurance-info-auto-form.component';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-checkout-step-insurance-info-ge-motor',
  templateUrl: './checkout-step-insurance-info-ge-motor.component.html',
  styleUrls: ['./checkout-step-insurance-info-ge-motor.component.scss']
})
export class CheckoutStepInsuranceInfoGeMotorComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  @ViewChild('infoAutoForm', { static: true }) infoAutoForm: CheckoutCardInsuranceInfoAutoFormComponent;

  product: CheckoutStepInsuranceInfoProduct;
  form: FormGroup;
  FormGroup: any;
  addons: any[];
  addonsChoise: any[];
  handleNextStep: boolean;
  attendees: any[];
  addon_list: any[][];
  kenticoBody: any;
  optionalWarranty = false;

  addonsProposal = ['basic', 'super', 'full'];
  newTypesProposal = ['basic', 'sicura', 'super'];
  proposalTitle: any;
  owner: boolean;
  ownerStep: boolean;
  recapOprionalWarranties: boolean;
  ownerData: any;
  typeProposal: string;
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
    if (localStorage.getItem('Proposal')) {
      localStorage.removeItem('Proposal');
    }
    if (localStorage.getItem('Customized')) {
      localStorage.removeItem('Customized');
    }
    if (localStorage.getItem('selectedAddons')) {
      localStorage.removeItem('selectedAddons');
    }
    this.setListAddons(this.product.order.data.quotation_response.additional_data.offerta.listaGaranzie);
    this.checkoutStepService.checkoutStepPriceChangeAfterSelectedAddonsMotor$.subscribe(quoteResponse => this.uploadPrice(quoteResponse.additional_data.offerta.listaGaranzie));
  }

  addAttendee(attendee: any) {
    this.attendees = attendee;
    this.addon_list = [this.attendees];
  }
  setProposalTitle(title) {
    this.proposalTitle = title;
  }

  uploadPrice(addonsListToResponse) {
    addonsListToResponse.forEach(addonList => {
      const addProv = this.addons.find(addFind => addFind.code === addonList.garanzia.codGaranzia);
      if (addProv) {
        this.uploadAddon(addProv, addonList);
        if (addProv.listpackage) {
          addProv.listpackage.forEach(addonAssStra => {
            const addProvAssStra = addonsListToResponse.find(addFindListAssStra => addFindListAssStra.garanzia.codGaranzia === addonAssStra.code);
            if (addProvAssStra) {
              this.uploadAddon(addonAssStra, addProvAssStra);
            }
          });
        }
      } else {
        if (!addonList.garanzia.codGaranzia.toLowerCase().includes('assauto')) {
          const addonToAdd = this.mapAddon(addonList);
          const addonProductProv = this.product.originalProduct.addons.find(elem => elem.code === addonToAdd.code);
          if (addonProductProv) {
            this.mapProductAddon(addonToAdd, addonProductProv);
            this.uploadKenticoToAddons(this.kenticoBody.step_insurance_info_optional_warranty.value, addonToAdd);
          }
          this.addons.push(addonToAdd);
        }
      }
    });
    this.addons.forEach(addon => {
      const addToDelete = addonsListToResponse.find(addFind => addFind.garanzia.codGaranzia === addon.code);
      if (addToDelete) {
        this.removeItemOnce(this.addons, addToDelete);
      }
    });

    const addonAssStraProv = this.addons.find(addon => addon.code.toLowerCase().includes('assauto'));
    const findSelected = addonAssStraProv.listpackage.find(add => add.selezionata);
    if (findSelected && findSelected.code !== addonAssStraProv.code) {
      findSelected.listpackage = addonAssStraProv.listpackage;
      this.addons.push(findSelected);
      this.removeItemOnce(this.addons, addonAssStraProv);
    }

    this.addons = this.addons.sort((a, b) => a.id < b.id ? -1 : 1);

    this.checkoutService.setAddonsStepInsuranceInfo(this.addons.filter(addon => addon.selezionata));
    const assKasko = this.addons.find(add => add.code.toLowerCase() === 'kasko');
    const assAnnSelvatici = this.addons.find(add => add.code.toLowerCase() === 'anselvatici');
    if (assKasko && assAnnSelvatici) {
      assKasko.selezionata ? assAnnSelvatici.isNotSelectable = true : assAnnSelvatici.isNotSelectable = false;
      assAnnSelvatici.selezionata ? assKasko.isNotSelectable = true : assKasko.isNotSelectable = false;
    }
  }

  removeItemOnce(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  setListAddons(addonsListToResponse) {
    let addons = [];
    const addonsAssStra = [];
    const product = this.product.originalProduct;
    this.kenticoTranslateService.getItem('checkout_motor_genertel').pipe(take(1)).subscribe(item => {
      this.kenticoBody = item;
      let addonAssStrsProv = null;
      addonsListToResponse.forEach(addon => {
        if (addon.garanzia.codGaranzia && addon.garanzia.codGaranzia.toLowerCase().includes('assauto')) {
          if (addon.selezionata) {
            addonAssStrsProv = this.mapAddon(addon);
          }
          addonsAssStra.push(this.mapAddon(addon));
        } else {
          addons.push(this.mapAddon(addon));
        }
      });
      addonsListToResponse.forEach(addon => {
        if (!addonAssStrsProv && addon.garanzia.codGaranzia.toLowerCase() === 'assauto') {
          addonAssStrsProv = this.mapAddon(addon);
        }
      });
      if (addonAssStrsProv && addonsAssStra.length > 1) {
        addonAssStrsProv.listpackage = addonsAssStra;
        addons.push(addonAssStrsProv);
      }

      addons.forEach(addon => {
        if (addon.listpackage) {
          addon.listpackage.forEach(addonAssStra => {
            const addonProvAssStra = product.addons.find(elem => elem.code === addonAssStra.code);
            if (addonProvAssStra) {
              this.mapProductAddon(addonAssStra, addonProvAssStra);
              this.uploadKenticoToAddons(this.kenticoBody.step_insurance_info_optional_warranty.value, addonAssStra);
            }
          });
        }
        const addonProv = product.addons.find(elem => elem.code === addon.code);
        if (addonProv) {
          this.mapProductAddon(addon, addonProv);
          this.uploadKenticoToAddons(this.kenticoBody.step_insurance_info_optional_warranty.value, addon);
        }
      });

      addons = addons.sort((a, b) => a.id < b.id ? -1 : 1);

      this.addons = addons;
      this.addonsChoise = this.addons.filter(addon => addon.selezionata);
    });
  }

  mapAddon(addon) {
    return {
      code: addon.garanzia.codGaranzia,
      premioTotaleGaranzia: addon.premioTotaleGaranzia,
      premioTotaleScontatoGaranzia: addon.premioTotaleScontatoGaranzia,
      scontoGaranzia: addon.scontoGaranzia,
      importoMassimaleAssicurato: addon.garanzia.importoMassimaleAssicurato,
      listaMassimali: (addon.garanzia.codGaranzia.toLowerCase() !== 'infcond' && addon.listaMassimali && addon.listaMassimali.length > 1) ? addon.listaMassimali : null,
      listSumInsured: addon.garanzia.codGaranzia.toLowerCase() === 'infcond' ? this.setListSumInsured() : null,
      sumInsuredChoose: addon.garanzia.codGaranzia.toLowerCase() === 'infcond' ? this.setListSumInsured()[0] : null,
      importoFranchigiaOScopMin: addon.garanzia.importoFranchigiaOScopMin,
      listaFranchigie: addon.listaFranchigie && addon.listaFranchigie.length > 1 ? addon.listaFranchigie : null,
      selezionata: addon.selezionata
    };
  }

  uploadAddon(addon, addonG) {
    addon.premioTotaleGaranzia = addonG.premioTotaleGaranzia;
    addon.premioTotaleScontatoGaranzia = addonG.premioTotaleScontatoGaranzia;
    addon.scontoGaranzia = addonG.scontoGaranzia;
    addon.importoMassimaleAssicurato = addonG.garanzia.importoMassimaleAssicurato;
    addon.selezionata = addonG.selezionata;
  }

  mapProductAddon(addon, addonProv) {
    addon.name = addonProv.name;
    addon.description = addonProv.description;
    addon.image = addonProv.image ? addonProv.image.original_url : undefined;
    addon.id = addonProv.id;
    if (addon.code.toLowerCase() === 'vandalnew') {
      addon.combinable_warranties = [
        {codes: ['ATMOSFNEW', 'INCFURTO'], description: 'Eventi atmosferisci e Furto e incendio'},
        {codes: ['ATMOSFNEW', 'MINIKASKO'], description: 'Eventi atmosferisci e Minikasko'},
      ];
      addon.defaultCombWarr = {codes: ['ATMOSFNEW', 'MINIKASKO'], description: 'Eventi atmosferisci e Minikasko'};
    }
    if (addon.code.toLowerCase() === 'atmosfnew') {
      addon.combinable_warranties = [
        {codes: ['INCFURTO'], description: 'Furto e incendio'},
        {codes: ['MINIKASKO'], description: 'Minikasko'},
      ];
      addon.defaultCombWarr = {codes: ['INCFURTO'], description: 'Furto e incendio'};
    }
  }

  isFormValid(): boolean {
    return this.infoAutoForm.form.valid;
  }

  submit(ownerData) {
    this.ownerData = ownerData;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const carInfo = this.infoAutoForm.computeModel();
    const isOwner = this.ownerData ? this.ownerData : null;
    return Object.assign({}, this.product, {insuredSubjects: null, carInfo, isOwner});
  }

  getCarInfo() {
    return this.infoAutoForm.computeModel();
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  setListSumInsured() {
    return [
      {ceiling: 25000, medicalExpenses: '€5.000', dailyAllowance: '€25'},
      {ceiling: 50000, medicalExpenses: '€10.000', dailyAllowance: '€50'},
      {ceiling: 100000, medicalExpenses: '€20.000', dailyAllowance: '€100'},
    ];
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
      addon.kentico_description = addonProvKentico.kentico_description.value;
    }
    return addon;
  }

  handleChangePrice(addons?: any, isCustomization?: boolean) {
    if (isCustomization) {
      this.optionalWarranty = !this.optionalWarranty;
    }
    this.checkoutStepService.priceChangeAfterSelectedAddonsMotor(this.createRequestQuote(addons));
  }

  handleChangeStep(optionalWarranty?: boolean, ownerStep?: boolean, recapOprionalWarranties?: boolean) {
    this.optionalWarranty = optionalWarranty;
    this.ownerStep = ownerStep;
    this.recapOprionalWarranties = recapOprionalWarranties;
    if (localStorage.getItem('Customized')) {
      this.isCustomized = localStorage.getItem('Customized');
    }
    const selectedAddons = localStorage.getItem('selectedAddons');
    this.selectedAddons =  JSON.parse(selectedAddons);
  }

  createRequestQuote(addon?: any) {
    this.addonsChoise = this.addons.filter(add => add.selezionata);
    const req = {
      product_code: this.product.code,
      order_id: this.product.order.id,
      car_data: this.infoAutoForm.computeModel(),
      addons_list: this.createAddonsRequestQuote(addon || this.addonsChoise),
      user_data: this.getInfoUser()
    };

    if (!this.authService.currentUser.email && !this.authService.currentUser.phone) {
      delete req.user_data;
    }

    return req;
  }

  createAddonsRequestQuote(addons: any) {
    if (addons.resettable) {
      const arrayAddon = [];
      arrayAddon.push({
        code: addons.code,
        maximal: addons.importoMassimaleAssicurato
      });
      return arrayAddon;
    } else {
    const arrayAddon = [];
    addons.forEach(addon => {
      arrayAddon.push({
        code: addon.code,
        maximal: addon.importoMassimaleAssicurato
      });
    });
    return arrayAddon;
  }
  }

  getInfoUser() {
    const user = this.authService.currentUser;
    if (user) {
      return {
        email: this.authService.currentUser.email,
        phone: this.authService.currentUser.phone
      };
    }
  }

  isOwner(event) {
    event ? this.owner = true : this.owner = false;
  }

  setTypeProposal(type?: string){
    this.typeProposal = type;
    if(!type){
      this.typeProposal = "basic";
    }
  }

}
