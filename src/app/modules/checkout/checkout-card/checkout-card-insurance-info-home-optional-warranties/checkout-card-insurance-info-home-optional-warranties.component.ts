import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CheckoutService, DataService, InsurancesService } from "@services";
import { KenticoTranslateService } from "../../../kentico/data-layer/kentico-translate.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { take } from "rxjs/operators";
import { ContainerComponent } from "../../../tenants/component-loader/containers/container.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import JsonData from "../../../../../assets/mock/elenchi_razze_e_dati_assicurativi.json";
import { AddonHomeRequest, HomeRequestQuote } from "@model";
import {costLineItemGeneratorFactory} from "../../services/cost-line-generators/line-generator-factory";

@Component({
  selector: "app-checkout-card-insurance-info-home-optional-warranties",
  templateUrl:
    "./checkout-card-insurance-info-home-optional-warranties.component.html",
  styleUrls: [
    "./checkout-card-insurance-info-home-optional-warranties.component.scss",
  ],
})
export class CheckoutCardInsuranceInfoHomeOptionalWarrantiesComponent
  implements OnInit
{
  @Input() addons;
  @Input() addonWithPrices;
  @Input() product;
  @Output() selectedAddonsEmit = new EventEmitter<any>();
  @Output() showProposalWarrantyEmit = new EventEmitter<any>();
  @Output() showInfoHomeEmit = new EventEmitter<any>();

  kenticoBody: any;
  formPet: FormGroup;
  formFurtoInc: FormGroup;
  selectedAddons: any;
  resettableAddons: any;

  constructor(
    public checkoutService: CheckoutService,
    public kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    public modalService: NgbModal,
    private insuranceService: InsurancesService
  ) {}

  ngOnInit() {
    this.getAddonsPrices();
    this.resettableAddons = this.addons.filter((addon) => addon.selezionata);
    this.kenticoTranslateService
      .getItem("checkout_home_genertel")
      .pipe(take(1))
      .subscribe((item) => {
        this.kenticoBody = item;
      });
    const selectedAddons = this.addons.filter((addon) => addon.selezionata);
    this.checkoutService.setAddonsStepInsuranceInfo(selectedAddons);
    const addonPet = selectedAddons.find((add) => add.code === "RC cane");
    const addonFurtoRapinaSelected = selectedAddons.find(
      (add) => add.code === "HOME Furto e rapina"
    );
    const addonFurtoRapina = this.addons.find(
      (add) => add.code === "HOME Furto e rapina"
    );
    this.createFormPet(addonPet);
    this.createFormFurtoInc(addonFurtoRapinaSelected, addonFurtoRapina);
    this.setNotSelectable();
    this.proposedMaximalGraviDanni();
    this.proposalMaximalContenutoArredi();
  }

  protected getAddonsPrices(): void {
    this.addons.forEach((addon) => {
      const addRespGen = this.addonWithPrices.find(
        (add) => add.code === addon.code
      );
      if (addRespGen) {
        addon.price = addRespGen.price;
      }
    });
  }

  setNotSelectable() {
    const lineItem = this.product.order.line_items[0];
    switch (lineItem.insured_entities.house.usage) {
      case "2":
        for (const addon of this.addons) {
          const addonCode = addon.code.toLowerCase();
          if (addonCode === "rc proprieta") {
            addon.isNotSelectable = true;
          }
        }
        break;
      case "3":
        for (const addon of this.addons) {
          const addonCode = addon.code.toLowerCase();
          if (
            addonCode === "rc conduzione" ||
            addonCode === "rc cane" ||
            addonCode === "rc ruote elettriche"
          ) {
            addon.isNotSelectable = true;
          }
        }
        break;
    }
  }


  resetSelectedAddon() {
    this.checkoutService.setAddonsStepInsuranceInfo(this.resettableAddons.selezionata);
    this.resettableAddons.forEach(element => {
        element.selezionata = false;
    });
    this.selectedAddonsEmit.emit(this.resettableAddons);
  }

  proposedMaximalGraviDanni() {
    const addon = this.addons.find((a) => a.code === "HOME Fabbricato Inc.");
    addon.listaMassimali.forEach((item) => {
      if (addon.importoMassimaleAssicurato === item) {
        addon.maximalProposed = item;
      }
    });
  }

  proposalMaximalContenutoArredi() {
    const addon = this.addons.find((a) => a.code === "Inc contenuto abitaz");
    const lineItem = this.product.order.line_items[0];
    addon.listaMassimali.forEach((item) => {
      if (
        item > lineItem.insured_entities.house.sqm * 330 &&
        item - 5000 < lineItem.insured_entities.house.sqm * 330
      ) {
        addon.maximalProposed = item;
        return;
      }
    });
  }

  openPetModal() {
    const modalRef = this.modalService.open(ContainerComponent, {
      size: "lg",
      backdropClass:
        "backdrop-class " + this.dataService.tenantInfo.main.layout,
      windowClass: "modal-window",
    });
    modalRef.componentInstance.type = "ModalPetOptionalWarranties";
    modalRef.componentInstance.componentInputData = {
      pets: JsonData.razze_non_assicurabili,
    };
  }

  openDetail(addon) {
    const modalRef = this.modalService.open(ContainerComponent, {
      size: "lg",
      backdropClass:
        "backdrop-class " + this.dataService.tenantInfo.main.layout,
      windowClass: "modal-window",
    });
    modalRef.componentInstance.type = "ModalDetailsWarrantiesComponent";
    modalRef.componentInstance.componentInputData = {
      addon: addon,
      kenticoBody: this.kenticoBody,
    };
    modalRef.result.then((result) => {
      this.addCancelWarranty(addon);
    });
  }

  openInfo(addon) {
    const modalRef = this.modalService.open(ContainerComponent, {
      size: "lg",
      backdropClass:
        "backdrop-class " + this.dataService.tenantInfo.main.layout,
      windowClass: "modal-window",
    });
    modalRef.componentInstance.type = "ModalInfoComponent";
    modalRef.componentInstance.componentInputData = {
      addon: addon,
    };
  }

  toggleAddonLimit(selectedMaximal, index) {
    this.addons[index].importoMassimaleAssicurato = selectedMaximal;
    this.toggleAddonUpdate(index);
  }

  togglePetChoiseNum(numPet, index) {
    this.addons[index].numPet = numPet;
    if (this.addons[index].code === "RC cane" && this.formPet.invalid) {
      return;
    }
    this.toggleAddonUpdate(index);
  }

  toggleHomeProtected(choise, index) {
    this.addons[index].homeProtected = choise;
    if (this.formFurtoInc.invalid) {
      return;
    }
    if (this.addons[index].selezionata) {
      if (this.addons[index].flagRegion) {
        this.addons[index].selezionata = false;
      }
      this.listSelectedAddons();
    } else {
      this.updateSingleAddonPrice(this.addons[index]);
    }
  }

  toggleUsualHome(choise, index) {
    this.addons[index].usualHome = choise;
    if (this.formFurtoInc.invalid) {
      return;
    }
    this.toggleAddonUpdate(index);
  }

  listSelectedAddons() {
    const selectedAddons = this.addons.filter((addon) => addon.selezionata);
    this.checkoutService.setAddonsStepInsuranceInfo(selectedAddons);
    this.selectedAddonsEmit.emit(selectedAddons);
    if (selectedAddons) {
      localStorage.setItem('Customized', 'true');
      localStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));
      const addons = localStorage.getItem('selectedAddons');
    }
  }

  showProposalWarranties() {
    this.showProposalWarrantyEmit.emit();
  }

  showInfoHome() {
    const isCustomized =  localStorage.getItem('Customized');
    this.showInfoHomeEmit.emit(isCustomized);
  }

  addCancelWarranty(addon: any) {
    if (
      (addon.code === "RC cane" && this.formPet.invalid) ||
      (addon.code === "HOME Furto e rapina" && this.formFurtoInc.invalid)
    ) {
      return;
    }
    addon.selezionata = !addon.selezionata;
    if (addon.code === "RC cane") {
      this.checkPetCheckbox(addon);
    }
    this.listSelectedAddons();
  }

  checkPetCheckbox(addon) {
    if (addon.selezionata) {
      this.formPet.get("petCheckbox").disable();
    } else {
      this.formPet.get("petCheckbox").enable();
    }
  }

  createFormPet(addonPet) {
    this.formPet = new FormGroup({
      numPet: new FormControl(1, [Validators.required]),
      petCheckbox: new FormControl(
        {
          value: !!addonPet,
          disabled: addonPet ? addonPet.selezionata : false,
        },
        [Validators.required]
      ),
    });
  }

  createFormFurtoInc(addonFurtoRapinaSelected, addonFurtoRapina) {
    this.formFurtoInc = new FormGroup({
      usualHome: new FormControl(addonFurtoRapina.usualHome, [
        Validators.required,
      ]),
      homeProtected: new FormControl(
        addonFurtoRapinaSelected
          ? addonFurtoRapinaSelected.homeProtected
          : true,
        [Validators.required]
      ),
      SumInsured: new FormControl(
        addonFurtoRapinaSelected
          ? addonFurtoRapinaSelected.importoMassimaleAssicurato
          : addonFurtoRapina.importoMassimaleAssicurato,
        [Validators.required]
      ),
    });
  }

  private toggleAddonUpdate(index: number): void {
    this.addons[index].selezionata
      ? this.listSelectedAddons()
      : this.updateSingleAddonPrice(this.addons[index]);
  }

  private updateSingleAddonPrice(addon): void {
    const request = this.createAddonRequest(addon);
    this.insuranceService
      .submitHomeGenertelQuotation(request)
      .pipe(take(1))
      .subscribe((res) => {
        const addonToUpdate = res.addons.find(
          (addonFromResponse) => addonFromResponse.id === addon.code
        );
        addon.price = addonToUpdate.price;
      });
  }

  private createAddonRequest(addon): HomeRequestQuote {
    const lineItem = this.product.order.line_items[0];
    const addonFurtoRap = this.addons.find(
      (add) => add.code === "HOME Furto e rapina"
    );
    const req: HomeRequestQuote = {
      product_code: this.product.code,
      sqm: lineItem.insured_entities.house.sqm,
      usage: lineItem.insured_entities.house.usage,
      state_id: lineItem.insured_entities.house.state.id,
      start_date: lineItem.start_date,
      payment_type: lineItem.payment_frequency,
      usual_residence: addonFurtoRap.usualHome,
      addons: this.createAddonsRequestQuote(addon),
      insured_pets: this.formPet.get('numPet').value
    };
    if (addon.code === "RC cane") {
      req.insured_pets = addon.numPet || 1;
    }
    if (addon.code === "HOME Furto e rapina") {
      req.secure_location = addon.homeProtected;
    }

    return req;
  }

  private createAddonsRequestQuote(addon): AddonHomeRequest[] {
    const selectedAddons = this.addons.filter((addon) => addon.selezionata);
    selectedAddons.push(addon);
    return selectedAddons.map((addon) => {
      return {
        code: addon.code,
        maximal: addon.importoMassimaleAssicurato,
      };
    });
  }
  getCurrencySymbolDot(addon: number) {
      return new Intl.NumberFormat('it', {  style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0,  currency: 'EUR' }).format(addon);
  }
}
