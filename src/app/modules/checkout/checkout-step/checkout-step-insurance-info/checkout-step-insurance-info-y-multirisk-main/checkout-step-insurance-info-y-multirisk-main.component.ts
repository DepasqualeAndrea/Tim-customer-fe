import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { StepInfoYoloMultiriskSubstep, stepInfoYoloMultiriskSubsteps } from './yolo-multirisk-substeps.model';
import {
  CheckoutStepInsuranceInfoYMultiriskFormComponent
} from '../checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-form/checkout-step-insurance-info-y-multirisk-form.component';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutService, DataService, InsurancesService } from "@services";
import { Product, RequestOrder } from '@model';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { CheckoutStepInsuranceInfoYMultiriskDataInsuredComponent } from '../checkout-step-insurance-info-y-multirisk/checkout-step-insurance-info-y-multirisk-data-insured/checkout-step-insurance-info-y-multirisk-data-insured.component';
import { AddonReworked, MultiRiskAddon } from './interfaces/multirisk.model';
import { ToastrService } from 'ngx-toastr';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

type CheckoutInsuredSubject = {
  id: null,
  first_name: string,
  last_name: string,
  birth_date: string
}

@Component({
  selector: 'app-checkout-step-insurance-info-y-multirisk-main',
  templateUrl: './checkout-step-insurance-info-y-multirisk-main.component.html',
  styleUrls: ['./checkout-step-insurance-info-y-multirisk-main.component.scss']
})
export class CheckoutStepInsuranceInfoYMultiriskMainComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  public insuredForm: FormGroup;
  currentSubstep: StepInfoYoloMultiriskSubstep = StepInfoYoloMultiriskSubstep.INSURED_DATA;
  product: CheckoutStepInsuranceInfoProduct;
  currentProduct: Product;
  addonsInfo: any;
  hasBeds: boolean;
  basicProposalPrice: number;
  addonsStepInsuranceInfoSelected: any[];
  addonsRecapInfo: any[] = [];
  buildingType: string = "";
  @ViewChild('dataDropdown') dataDropdown: CheckoutStepInsuranceInfoYMultiriskFormComponent;
  @ViewChild('formBuildingData') formBuildingData: CheckoutStepInsuranceInfoYMultiriskDataInsuredComponent;
  employeesNumber: string = "";
  infoBuildingData: any;
  provinceNameSelected: string = "";
  provinceIdSelected: number = null;
  provinceAbbrSelected: string = "";
  zipCodeSelected: number;
  addressSelected: string;
  citySelected: any;
  get lastStepForm(): any { return this.formBuildingData };
  dataForModify: any;
  provinceForModify: any;
  originalAddons: MultiRiskAddon[];
  contentAlert: any;
  addonsSelected: boolean;
  @ViewChild('alertImage', { read: ElementRef, static: false }) alertImage: ElementRef;
  @ViewChild('alertText', { read: ElementRef, static: false }) alertText: ElementRef;
  @ViewChild('containerAlert', { read: ElementRef, static: false }) containerAlert: ElementRef;
  retryAlert: boolean = false;
  firstTimeQuote: boolean = true;
  elementOperation: string = '';

  private addonPriceChange = new Subject<any>();
  addonPriceChange$ = this.addonPriceChange.asObservable();

  public recapInfoChange = new Subject<any>();
  recapInfoChange$ = this.recapInfoChange.asObservable();

  public recapPriceChange = new Subject<any>();
  recapPriceChange$ = this.recapPriceChange.asObservable();

  private addonChange = new Subject<any>();
  addonChange$ = this.addonChange.asObservable();

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public checkoutService: CheckoutService,
    public dataService: DataService,
    public insuranceService: InsurancesService,
    protected nypInsuranceService: NypInsurancesService,
    private checkoutStepService: CheckoutStepService,
    private toastService: ToastrService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.originalAddons = this.product.originalProduct.addons.slice();
    const productCode = this.dataService.getParams().productCode;
    const kenticoContent$ = this.kenticoTranslateService.getItem<any>('checkout_yolo_multirischi').pipe(take(1));
    const products$ = this.nypInsuranceService.getProducts();
    forkJoin([kenticoContent$, products$]).pipe(
      tap(([content, productsList]) => {
        this.addonsInfo = content;
        this.currentProduct = productsList.products.find(product => product.product_code === productCode);
      })
    ).subscribe();

    this.contentAlert = this.addonsInfo.step_insurance_info.policy_configuration.header.alert;

    if (!!(localStorage.getItem('historyBuildingData'))) {
      let historyBuildingData = JSON.parse(localStorage.getItem('historyBuildingData'));
      this.citySelected = historyBuildingData.city;
      this.provinceIdSelected = historyBuildingData.state_id;
      this.zipCodeSelected = historyBuildingData.zipcode;
      this.addressSelected = historyBuildingData.address;
      this.provinceNameSelected = historyBuildingData.province;
      localStorage.removeItem('historyBuildingData');
    }

    this.getRedirectFromModify();
  }

  isFormValid(): boolean {
    return true;
  }

  private computeModel(): CheckoutInsuredSubject[] {
    return this.insuredForm.value.insuredSubjects.map(subject => {
      return {
        id: null,
        firstName: subject.firstName,
        lastName: subject.lastName,
        birthDate: TimeHelper.fromNgbDateToDate(subject.birthDate)
      }
    })
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  public nextSubStep(): void {
    if (this.isCurrentSubstep(StepInfoYoloMultiriskSubstep.INSURED_DATA)) {
      this.dataForModify = this.dataDropdown.form.value;
      this.provinceForModify = this.dataDropdown.provincia;

      this.employeesNumber = this.dataDropdown.form.value.employeesNumber;
      this.buildingType = this.dataDropdown.form.value.buildingType;
      const lineItemId = this.dataService.getResponseOrder().line_items[0].id;
      const numberId = this.dataService.getResponseOrder().number;
      this.hasBeds = this.dataService.params.has_beds;
      const order = this.createOrderObjBasic(this.currentProduct.master_variant, this.dataDropdown.form, this.dataDropdown.provincia, this.dataService.getParams(), lineItemId);
      this.infoBuildingData = order;
      this.checkoutService.buildingCreate(lineItemId, <RequestOrder>order).pipe(
        tap(responseOrder => {
          //this.dataService.setResponseOrder(responseOrder);
          //this.dataService.setProduct(this.currentProduct);
          //this.product.lineItemId = responseOrder.line_items[0].id;
        }),
        switchMap(() => this.checkoutService.basicCheckout(this.product.lineItemId)),
        catchError(error => {
          console.log(error);
          throw error;
        }),
      ).subscribe(basicCheckResponse => this.basicProposalPrice = basicCheckResponse.total);

      this.checkoutStepService.changeInfoWithAddons(this.getDataDropdownForm());
      this.currentSubstep = stepInfoYoloMultiriskSubsteps[this.getCurrentSubstepIndex() + 1];

    } else if (this.isCurrentSubstep(StepInfoYoloMultiriskSubstep.START_PRICE)) {
      this.checkoutService.fullCheckout(this.product.lineItemId).subscribe(
        response => {
          this.currentProduct.addons = response.addons;
          this.product.addons = response.addons;
          this.addonsStepInsuranceInfoSelected = response.addons
            .filter((addon) => addon.selected === true)
            .map(item => ({
              id: item.id,
              maximal: item.maximal,
              price: item.price
            }));
          this.setAddonsSelectedFlag();
          this.loadInfoForAddons(response.addons);
          this.addonsInfo.additionalData = response.additional_data;
          this.changePrice(response);
          this.currentSubstep = stepInfoYoloMultiriskSubsteps[this.getCurrentSubstepIndex() + 1];
          this.setAddonsInCheckoutService(this.addonsStepInsuranceInfoSelected);
        }
      );
    } else if (this.isCurrentSubstep(StepInfoYoloMultiriskSubstep.INSURED_ADDONS)) {
      this.currentSubstep = stepInfoYoloMultiriskSubsteps[this.getCurrentSubstepIndex() + 1];
    }
    this.setRedirectFromModify();
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    if (this.hasBeds) {
      const buildingInfo = {
        employees_number: this.infoBuildingData.employees_number,
        beds_number: this.infoBuildingData.beds_number,
        building_type: this.infoBuildingData.building_type,
        state_id: this.infoBuildingData.state_id,
        address: this.formBuildingData.form.value.address,
        city_id: this.formBuildingData.form.value.searchCity.id,
        zipcode: this.formBuildingData.form.value.postalCode
      };
      const historyBuildingInfo = {
        address: this.formBuildingData.form.value.address,
        state_id: this.infoBuildingData ? this.infoBuildingData.state_id : this.product.buildingInfo.state_id,
        city: this.formBuildingData.form.value.searchCity,
        province: this.provinceNameSelected,
        zipcode: this.formBuildingData.form.value.postalCode
      }
      localStorage.setItem('historyBuildingData', JSON.stringify(historyBuildingInfo));

      return Object.assign({}, this.product, { insuredSubjects: null, buildingInfo });

    } else {
      const buildingInfo = {
        employees_number: this.infoBuildingData.employees_number,
        beds_number: 0,
        building_type: this.infoBuildingData.building_type,
        state_id: this.infoBuildingData.state_id,
        address: this.formBuildingData.form.value.address,
        city_id: this.formBuildingData.form.value.searchCity.id,
        zipcode: this.formBuildingData.form.value.postalCode
      };
      const historyBuildingInfo = {
        address: this.formBuildingData.form.value.address,
        state_id: this.infoBuildingData ? this.infoBuildingData.state_id : this.product.buildingInfo.state_id,
        city: this.formBuildingData.form.value.searchCity,
        province: this.provinceNameSelected,
        zipcode: this.formBuildingData.form.value.postalCode
      }
      localStorage.setItem('historyBuildingData', JSON.stringify(historyBuildingInfo));

      return Object.assign({}, this.product, { insuredSubjects: null, buildingInfo });
    }
  }

  private loadInfoForAddons(addons: any[]) {
    this.addonsRecapInfo.splice(0);
    // update incendio
    this.addonsInfo.step_insurance_info.policy_configuration.addons.incendio.addons_list.value.forEach(element => {
      let addonRecap: any = { id: '', price: '', maximal: '', name: '', description: '' };
      const addon = addons.find(add => add.id === element.code_warranty.value);
      element.visible = false;
      if (addon !== undefined) {
        element.price = addon.price;
        element.selected = addon.selected;
        element.maximal = addon.maximal;
        element.available_maximals = addon.available_maximals;
        element.visible = true;
      }


      this.addonsStepInsuranceInfoSelected.filter(addSel => {
        if (addSel.id === element.code_warranty.value) {
          addonRecap.id = addSel.id
          addonRecap.price = addSel.price;
          addonRecap.maximal = addSel.maximal;
          addonRecap.name = element.title_full.value;
        }
      });

      // update additional warrenty
      let descrTemp: any[] = [];
      element.modal_addon.value.forEach(subElement => {
        subElement.additional_warrenty.value.forEach(child => {
          const addon = addons.find(add => add.id === child.code_warranty.value);
          child.visible = false;
          if (addon !== undefined) {
            child.price = addon.price;
            child.selected = addon.selected;
            child.maximal = addon.maximal;
            child.available_maximals = addon.available_maximals;
            child.visible = true;
          }

          this.addonsStepInsuranceInfoSelected.filter(addSel => {
            if (addSel.id === child.code_warranty.value) {
              descrTemp.push(child.text.value);
            }
          });
        });
      });

      addonRecap.description = descrTemp.join(', ');

      if (addonRecap.id !== '') {
        this.addonsRecapInfo.push(addonRecap);
      }
    });

    // update furto e rapina
    const addonFurtoERapina = addons.find(add => add.id === this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.code_warranty.value);
    this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.visible = false;
    if (addonFurtoERapina !== undefined) {
      this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.price = addonFurtoERapina.price;
      this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.selected = addonFurtoERapina.selected;
      this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.maximal = addonFurtoERapina.maximal;
      this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.available_maximals = addonFurtoERapina.available_maximals;
      this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.visible = true;
      let addonRecap: any = { id: '', price: '', maximal: '', name: '', description: '' };
      this.addonsStepInsuranceInfoSelected.filter(addSel => {
        if (addSel.id === this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.code_warranty.value) {
          addonRecap.id = addSel.id
          addonRecap.price = addSel.price;
          addonRecap.maximal = addSel.maximal;
          addonRecap.name = this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.title.value;
          // addonRecap.description = this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.description.value;
        }
      });

      // additional addons of furto_e_rapina
      this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina.addons_list.value.forEach(element => {
        // update additional warrenty
        element.additional_warrenty.value.forEach(subElement => {
          const addon = addons.find(add => add.id === subElement.code_warranty.value);
          subElement.visible = false;
          if (addon !== undefined) {
            subElement.price = addon.price;
            subElement.selected = addon.selected;
            subElement.maximal = addon.maximal;
            subElement.available_maximals = addon.available_maximals;
            subElement.visible = true;
          }

          this.addonsStepInsuranceInfoSelected.filter(addSel => {
            if (addSel.id === subElement.code_warranty.value) {
              addonRecap.description += subElement.text.value;
            }
          });
        });
      });

      if (addonRecap.id !== '') {
        this.addonsRecapInfo.push(addonRecap);
      }

    }



    // update responsabilita civile
    this.addonsInfo.step_insurance_info.policy_configuration.addons.responsabilita_civile_1.addons_list.value.forEach(element => {
      let addonRecap: any = { id: '', price: '', maximal: '', name: '', description: '' };
      const addon = addons.find(add => add.id === element.code_warranty.value);
      element.visible = false;
      if (addon !== undefined) {
        element.price = addon.price;
        element.selected = addon.selected;
        element.maximal = addon.maximal;
        element.available_maximals = addon.available_maximals;
        element.visible = true;
      }

      this.addonsStepInsuranceInfoSelected.filter(addSel => {
        if (addSel.id === element.code_warranty.value) {
          addonRecap.id = addSel.id
          addonRecap.price = addSel.price;
          addonRecap.maximal = addSel.maximal;
          addonRecap.name = element.title_full.value;
          addonRecap.description = '-';
        }
      });
      if (addonRecap.id !== '') {
        this.addonsRecapInfo.push(addonRecap);
      }
    });

    // update tutela legale
    const addon = addons.find(add => add.id === this.addonsInfo.step_insurance_info.policy_configuration.addons.tutela_legale_1.code_warranty.value);
    this.addonsInfo.step_insurance_info.policy_configuration.addons.tutela_legale_1.visible = false;
    if (addon !== undefined) {
      this.addonsInfo.step_insurance_info.policy_configuration.addons.tutela_legale_1.price = addon.price;
      this.addonsInfo.step_insurance_info.policy_configuration.addons.tutela_legale_1.selected = addon.selected;
      this.addonsInfo.step_insurance_info.policy_configuration.addons.tutela_legale_1.maximal = addon.maximal;
      this.addonsInfo.step_insurance_info.policy_configuration.addons.tutela_legale_1.available_maximals = addon.available_maximals;
      this.addonsInfo.step_insurance_info.policy_configuration.addons.tutela_legale_1.visible = true;
      let addonRecap: any = { id: '', price: '', maximal: '', name: '', description: '' };
      this.addonsStepInsuranceInfoSelected.filter(addSel => {
        if (addSel.id === this.addonsInfo.step_insurance_info.policy_configuration.addons.tutela_legale_1.code_warranty.value) {
          addonRecap.id = addSel.id
          addonRecap.price = addSel.price;
          addonRecap.maximal = addSel.maximal;
          addonRecap.name = this.addonsInfo.step_insurance_info.policy_configuration.addons.tutela_legale_1.title.value;
          addonRecap.description = '-';
          this.addonsRecapInfo.push(addonRecap);
        }
      });
    }
    this.recapInfoChange.next(this.addonsRecapInfo);

    this.checkoutStepService.changeRecapInfo(this.addonsRecapInfo);
  }

  public previousSubStep(): void {
    this.currentSubstep = stepInfoYoloMultiriskSubsteps[this.getCurrentSubstepIndex() - 1];
    this.setRedirectFromModify();
  }

  public isCurrentSubstep(substep: StepInfoYoloMultiriskSubstep): boolean {
    return this.currentSubstep === substep;
  }

  private getCurrentSubstepIndex(): number {
    return stepInfoYoloMultiriskSubsteps.findIndex(substep =>
      substep === this.currentSubstep
    );
  }
  private getDataDropdownForm() {
    this.provinceNameSelected = this.dataDropdown.provincia.name;
    this.provinceIdSelected = this.dataDropdown.provincia.id;
    this.provinceAbbrSelected = this.dataDropdown.provincia.abbr;

    let employeesTemp = Object.entries(this.dataDropdown.employees);
    let itemTmp = employeesTemp.filter((item) => item[1] === this.dataDropdown.form.value.employeesNumber);
    let empl: any = itemTmp[0];

    let buildingTypeTmp = Object.entries(this.dataDropdown.buildings);
    let buildTmp = buildingTypeTmp.filter((item) => item[1] === this.dataDropdown.form.value.buildingType);
    let emplBuild: any = buildTmp[0];

    if (this.hasBeds) {
      let bedsTemp = Object.entries(this.dataDropdown.beds);
      let itemTmpBeds = bedsTemp.filter((item) => item[1] === this.dataDropdown.form.value.bedsNumber);
      let emplBeds: any = itemTmpBeds[0];
      return {
        employees_number: empl[0],
        beds_number: emplBeds[0],
        building_type: emplBuild[0],
        province: this.dataDropdown.provincia.name,
      };
    } else {
      return {
        employees_number: empl[0],
        beds_number: 0,
        building_type: emplBuild[0],
        province: this.dataDropdown.provincia.name,
      };
    }

  }

  public operationManager(operation: string) {
    if (operation === 'next') {
      this.nextSubStep();
    } else if (operation === 'prev') {
      this.previousSubStep();
    }
  }

  public quoteEvent(params: any) {
    let addonFire: boolean = false;
    let addonRC: boolean = false;
    if (params !== null) {
      params.forEach(element => {
        if (element.type !== undefined && element.type === 'fire') {
          addonFire = true;
        } else if (element.type !== undefined && element.type === 'rc') {
          addonRC = true;
        }

        if (element.operation === 'add') {
          this.elementOperation = 'add';
          this.addonsStepInsuranceInfoSelected = this.addonsStepInsuranceInfoSelected.filter(add => add.id !== element.addon.id);
          this.addonsStepInsuranceInfoSelected.push(element.addon);
        } else if (element.operation === 'remove') {
          this.elementOperation = 'remove';
          this.addonsStepInsuranceInfoSelected = this.addonsStepInsuranceInfoSelected.filter(add => add.id !== element.addon.id);
        }
      });
    }
    this.setAddonsInCheckoutService(this.addonsStepInsuranceInfoSelected);

    this.setAddonsSelectedFlag();

    this.checkoutService.multiriskCCQuote(this.product.lineItemId, this.addonsStepInsuranceInfoSelected).subscribe(
      (response) => {
        if (!this.firstTimeQuote && this.elementOperation === 'add') {
          this.retryAlert = false;
          this.containerAlert.nativeElement.style.display = 'block';
          setTimeout(() => {
            this.containerAlert.nativeElement.style.display = 'none';
          }, 4000);
          this.alertText.nativeElement.innerHTML = this.contentAlert.loading.value;
          this.alertImage.nativeElement.src = this.contentAlert.loading_icon.value[0].url;
        }

        this.currentProduct.addons = response.addons;
        this.product.addons = response.addons;
        this.addonsStepInsuranceInfoSelected = response.addons
          .filter((addon) => addon.selected === true)
          .map(item => ({
            id: item.id,
            maximal: item.maximal,
            price: item.price
          }));
        this.loadInfoForAddons(response.addons);
        this.changePrice(response);
        this.addonPriceChange.next(
          {
            fire_total: response.additional_data.fire_total,
            theft_total: response.additional_data.theft_total,
            rc_total: response.additional_data.rc_total,
            legal_total: response.additional_data.legal_total
          }
        );
      }, (error) => {
        if (!this.firstTimeQuote && this.elementOperation === 'add') {
          this.retryAlert = true;
          this.alertText.nativeElement.innerHTML = this.contentAlert.error.value;
          this.alertImage.nativeElement.src = this.contentAlert.error_icon.value[0].url;
          this.containerAlert.nativeElement.style.display = 'block';
          setTimeout(() => {
            this.containerAlert.nativeElement.style.display = 'none';
          }, 4000);
        }
        this.toastService.error(error.error.provider_error);
        if (addonFire || addonRC) {
          this.addonChange.next({});
        }
      }, () => {
        if (!this.firstTimeQuote && this.elementOperation === 'add') {
          this.alertText.nativeElement.innerHTML = this.contentAlert.added.value;
          this.alertImage.nativeElement.src = this.contentAlert.added_icon.value[0].url;
          this.containerAlert.nativeElement.style.display = 'block';
          setTimeout(() => {
            this.containerAlert.nativeElement.style.display = 'none';
          }, 4000);
        }
        this.firstTimeQuote = false;
        if (addonFire || addonRC) {
          this.addonChange.next({});
        }
      }
    );
  }

  private changePrice(priceInput: any) {
    const priceInfo = {
      total: priceInput.total,
      display_total: priceInput.display_total,
      additional_total: priceInput.additional_total,
      additional_display_total: priceInput.additional_display_total,
      discount_percent: priceInput.additional_data.discount_percent
    }
    this.recapPriceChange.next(priceInfo);
    this.checkoutStepService.changeShoppingCartInfo(priceInfo);
  }

  private createOrderObjBasic(variant, form: FormGroup, provincia, codeAteco: any, lineItemId: any) {
    if (this.hasBeds) {
      return {
        employees_number: form.value.employeesNumber,
        beds_number: form.value.bedsNumber,
        building_type: form.value.buildingType,
        state_id: provincia.id,
      }
    } else {
      return {
        employees_number: form.value.employeesNumber,
        building_type: form.value.buildingType,
        state_id: provincia.id,
      }
    }
  }

  private setAddonsSelectedFlag() {
    if (this.addonsStepInsuranceInfoSelected.length > 0) {
      this.addonsSelected = true;
    } else {
      this.addonsSelected = false;
    }
  }

  private setAddonsInCheckoutService(addons: any[]): void {
    const addonsReworked: AddonReworked[] = [];
    addons.forEach(item => {
      const addonFilter = this.originalAddons.find(add => add.code === item.id);
      if (addonFilter !== undefined) {
        addonsReworked.push({
          id: addonFilter.id,
          code: item.id,
          selectedMaximal: item.maximal,
          price: item.price
        });
      }
    });

    this.checkoutService.setAddonsStepInsuranceInfo(addonsReworked);
  }

  getRedirectFromModify() {
    this.dataService.getRedirectShoppingCartMultirisk()
      .pipe(filter((substep) => substep !== ''))
      .subscribe((substep) => {
        this.currentSubstep = substep.path;
      });
  }

  setRedirectFromModify() {
    let objData = {
      path: this.currentSubstep,
    }
    this.dataService.setRedirectShoppingCartMultirisk(objData);
  }

  hideAlert() {
    this.containerAlert.nativeElement.style.display = 'none';
  }

}

