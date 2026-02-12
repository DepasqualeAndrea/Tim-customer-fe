import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AddonHomeExtraParams,
  AddonHomeRequest,
  MyHomeHouseAttributes,
  ResponseOrder,
  TimMyHomeRequestQuote,
  User
} from '@model';
import { NgbTabset, NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, CheckoutService, DataService, InsurancesService } from '@services';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { FTTH_QUERY_PARAM, UPSELLING_QUERY_PARAM } from 'app/shared/shared-queryparam-keys';
import { forkJoin, Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { AddonCodes, ExtraFormTypes, InfoAddonModal, LinkedAddonModal, MyHomeAddonContent } from './my-home-addon-content.interface';
import { ProductConsistencyService } from '../../../../../core/services/product-consistency.service';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
type Direction = 'left' | 'right' | 'up' | 'down';
const DEFAULT_ADDON_PROPOSAL = 'basic';
const SUPER_ADDON_PROPOSAL = 'super';
const DISPLAY_ALL_MIN_WIDTH = '992px';

@Component({
  selector: 'app-checkout-step-insurance-info-tim-my-home',
  templateUrl: './checkout-step-insurance-info-tim-my-home.component.html',
  styleUrls: ['./checkout-step-insurance-info-tim-my-home.component.scss']
})
export class CheckoutStepInsuranceInfoTimMyHomeComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit, AfterViewInit {

  product: CheckoutStepInsuranceInfoProduct;
  content: any;
  private infoHomeForm: MyHomeHouseAttributes;
  addons: MyHomeAddonContent[];
  public optionalWarranty: boolean = false;
  public infoHomeStep: boolean = false;
  public recapOprionalWarranties: boolean = false;
  public ftthProcedure: boolean = false;

  addonsProposal = ['basic', 'super', 'full'];

  handleNextStep: boolean;
  kenticoBody: any;
  selectedProposalTitle: string;

  @ViewChild('proposal') proposal: NgbTabset;
  recapWarranties: any;
  isUpselling = false;

  constructor(
    public dataService: DataService,
    public checkoutStepService: CheckoutStepService,
    public authService: AuthService,
    protected nypInsuranceService: NypInsurancesService,
    public insuranceService: InsurancesService,
    public formBuilder: FormBuilder,
    public kenticoTranslateService: KenticoTranslateService,
    private checkoutService: CheckoutService,
    private auth: AuthService,
    private route: ActivatedRoute,
    config: NgbTabsetConfig,
    private consistencyService: ProductConsistencyService
  ) {
    super();
    config.justify = 'justified';
    config.type = 'pills';
    config.orientation = 'horizontal';
  }

  ngOnInit() {
    if (this.consistencyService.isUserLoggedInWithSso) {
      const consistencyPricePayload = this.consistencyService.getPricingConsistency('tim-my-home');
      if (!!consistencyPricePayload) {
        this.consistencyService.priceConsistency(consistencyPricePayload).subscribe(res => {
          if (!!res.ftth) {
            this.checkoutStepService.setReducerProperty({
              property: 'cost_item.price',
              value: '€0,00'
            });
            this.checkoutStepService.setReducerProperty({
              property: 'cost_item.informative_set',
              value: ''
            });
            this.checkoutStepService.setReducerProperty({
              property: 'cost_item.informative_set_double',
              value: ''
            });
            this.checkoutStepService.setReducerProperty({
              property: 'cost_item.informative_set_multirischio',
              value: ''
            });
          }
        });
      }
    }

    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has(UPSELLING_QUERY_PARAM)) {
      // remove addon assistance
      this.product.originalProduct.addons.splice(this.product.originalProduct.addons.findIndex((addon) => addon.code === AddonCodes.ADDON_ASSISTANCE), 1);
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.cost_detail_list',
        value: []
      });
      this.isUpselling = true;
    }

    const kenticoContent$ = this.kenticoTranslateService.getItem<any>('checkout_tim_myhome').pipe(take(1));
    const products$ = this.nypInsuranceService.getProducts();
    forkJoin([kenticoContent$, products$]).pipe(
      tap(([content, productsList]) => {
        this.content = content;
        this.addonsProposal = content.step_insurance_info_optional_proposal.value
          .filter(v => v.system.type === 'list_proposal')
          .map(p => ({ code: p.code.value, name: p.title_home.value }));
        const currentProduct = productsList.products.find(product => product.id === this.product.id);
        if (queryParamMap.has(UPSELLING_QUERY_PARAM)) {
          currentProduct.addons.splice(currentProduct.addons.findIndex((addon) => addon.code === AddonCodes.ADDON_ASSISTANCE), 1);
          this.addonsProposal.splice(this.addonsProposal.findIndex((addon) => addon['code'] === 'basic'), 1);
          this.checkoutStepService.setReducerProperty({
            property: 'cost_item.informative_set',
            value: ''
          });
          this.checkoutStepService.setReducerProperty({
            property: 'cost_item.informative_set_double',
            value: this.content.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_multirischio').text.value,
          });
          this.checkoutStepService.setReducerProperty({
            property: 'cost_item.informative_set_wording',
            value: ''
          });
        }
        this.setListAddons(content.step_insurance_info_optional_warranty.value, currentProduct.addons);
      })
    ).subscribe();
    this.checkoutStepService.checkoutStepPriceChangeAfterSelectedAddonsHome$.subscribe(quoteResponse => this.uploadPrice(quoteResponse.addons));

    if (queryParamMap.has(FTTH_QUERY_PARAM) && !queryParamMap.has(UPSELLING_QUERY_PARAM)) {
      const respUnipol$ = this.nypInsuranceService.submitTimMyHomeWarrantiesProposals(this.createRequest(), 'basic').pipe(take(1));
      forkJoin([respUnipol$]).pipe(
        tap(([respUnipol]) => {
          const kenticoBodyAddons = this.content.step_insurance_info_optional_warranty.value;
          let addonsList = this.uploadAddons(Array(this.product.originalProduct.addons.find(addon => addon.code === AddonCodes.ADDON_ASSISTANCE)), respUnipol.addons, kenticoBodyAddons);
          this.showProposalSelected(addonsList);
          this.setSelectedProposalTitle("Assistenza Imprevisti");
          localStorage.setItem('Proposal', this.selectedProposalTitle);
          this.handleChangeStep(true, true);
          this.ftthProcedure = true;
          this.checkoutStepService.setReducerProperty({
            property: 'cost_item.informative_set',
            value: ''
          });
          this.checkoutStepService.setReducerProperty({
            property: 'cost_item.informative_set_double',
            value: ''
          });
          this.checkoutStepService.setReducerProperty({
            property: 'cost_item.informative_set_multirischio',
            value: ''
          });
        })
      ).subscribe();
    }

    this.checkUpsellingId();

  }

  private checkUpsellingId(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has(UPSELLING_QUERY_PARAM)) {
      this.product.lineItemId = +queryParamMap.get(UPSELLING_QUERY_PARAM);
      if (localStorage.getItem('shoppingCartContent') != null && localStorage.getItem('shoppingCartContent') != '') {
        this.checkoutStepService.setReducerProperty({
          property: 'cost_item',
          value: JSON.parse(localStorage.getItem('shoppingCartContent'))
        });
        localStorage.removeItem('shoppingCartContent');
      }
    }
  }

  createRequest() {
    return {
      line_item_id: this.product.order.line_items[0].id,
    };
  }

  uploadAddons(allAddons: any, addons: any, kenticoBodyAddons: any) {
    const listAddons = [];
    allAddons.forEach(addon => {
      let addonToAdd;
      const addonProvKentico = kenticoBodyAddons.find(elem => elem.code.value.toLowerCase() === addon.code.toLowerCase());
      const addonProposal = addons.find(elem => elem.id.toLowerCase() === addon.code.toLowerCase());
      if (addonProposal) {
        addonToAdd = {
          name: addonProvKentico.name.value,
          selezionata: addonProposal.selected,
          code: addon.code,
          importoMassimaleAssicurato: addonProposal ? addonProposal.maximal : null,
          premioTotaleScontatoGaranzia: addonProposal ? addonProposal.price : null,
          description: addon.description,
          image: addon.image ? addon.image.original_url : undefined,
          id: addon.id
        };
        listAddons.push(addonToAdd);
      }
    });
    return listAddons;
  }

  ngAfterViewInit() {
    this.selectDefaultTab();
    const queryParamMap = this.route.snapshot.queryParamMap;
    if ((queryParamMap.has(FTTH_QUERY_PARAM) && !queryParamMap.has(UPSELLING_QUERY_PARAM)) || this.isUserFtth()) {
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.price',
        value: '€0,00'
      });
    }
  }

  private isUserFtth() {
    if (this.auth.loggedIn) {
      return !!this.auth.loggedUser.data && !!this.auth.loggedUser.data.tim_user_type && this.auth.loggedUser.data.tim_user_type === 'ftth';
    }
  }

  private selectDefaultTab() {
    const queryParamMap = this.route.snapshot.queryParamMap;
    let defaultTab: any;
    if (queryParamMap.has(UPSELLING_QUERY_PARAM)) {
      defaultTab = { nextId: `tab-${SUPER_ADDON_PROPOSAL}` };
    } else {
      defaultTab = { nextId: `tab-${DEFAULT_ADDON_PROPOSAL}` };
    }
    this.setTabContent(defaultTab);
  }

  selectTab(event) {
    if (!window.matchMedia(`(min-width: ${DISPLAY_ALL_MIN_WIDTH})`).matches) {
      this.setTabContent(event);
    }
  }

  onSwipe(event) {
    if (!window.matchMedia(`(min-width: ${DISPLAY_ALL_MIN_WIDTH})`).matches) {
      const direction: Direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : null;
      this.swipeTab(direction);
    }
  }

  private swipeTab(direction: Direction) {
    const tabs = this.proposal.tabs.toArray().map(t => t.id);
    const i = tabs.indexOf(this.proposal.activeId);
    const previous = i === 0 ? i : i - 1;
    const next = i === tabs.length - 1 ? tabs.length - 1 : i + 1;
    switch (direction) {
      case 'right':
        if (this.proposal.activeId !== this.proposal.tabs.first.id) {
          this.clickTab(tabs[previous]);
        }
        break;
      case 'left':
        if (this.proposal.activeId !== this.proposal.tabs.last.id) {
          this.clickTab(tabs[next]);
        }
        break;
      default: break;
    }
  }

  private setTabContent(event) {
    const tabId = event.nextId;
    const proposalTab = this.getProposalName(tabId, 'tab');
    this.proposal.tabs.toArray()
      .map(t => this.getProposalName(t.id, 'tab'))
      .forEach(proposalName => {
        const tabContentId = `${proposalTab}-proposal-${proposalName}`;
        proposalTab === proposalName ? this.setProposalActive(tabContentId) : this.setProposalNotActive(tabContentId);
        this.scrollToTop(`list-${proposalName}`);
      }
      );
  }

  private setProposalActive(tabContentId: string) {
    document.getElementById(tabContentId).classList.add('active');
  }

  private setProposalNotActive(tabContentId: string) {
    if (null !== document.getElementById(tabContentId)) {
      document.getElementById(tabContentId).classList.remove('active');
    }
  }

  private clickTab(tabId: string) {
    document.getElementById(tabId).click();
  }

  private scrollToTop(listContentId: string) {
    document.getElementById(listContentId).scrollTop = 0;
  }

  getProposalName(elementId: string, kind: string, subkind?: string) {
    const proposalName = elementId.split(`${kind}-`, 2)[1];
    return !!subkind ? proposalName.split(`-${subkind}`, 2)[0] : proposalName;
  }

  uploadPrice(addonsListToResponse) {
    this.addons.forEach(addon => {
      const correspondingAddon = addonsListToResponse.find(add => add.id === addon.code);
      if (correspondingAddon) {
        addon.price = correspondingAddon.price.replace('.', ',');
        addon.importoMassimaleAssicurato = correspondingAddon.maximal;
        addon.selezionata = correspondingAddon.selected;
      }
    });
    this.addons = this.addons.sort((a, b) => a.id < b.id ? -1 : 1);
    this.checkoutService.setAddonsStepInsuranceInfo(this.addons.filter(addon => addon.selezionata));
  }

  setListAddons(contentAddons: any[], productAddons: any[]) {
    const product = this.product.originalProduct;
    const filteredAddons = contentAddons.filter(ka =>
      productAddons.some(bea =>
        bea.code === ka.code.value
      )
    )
      .map(contentAddon => {
        const correspondingProductAddon = productAddons.find(productAddon =>
          productAddon.code === contentAddon.code.value
        );
        const ceiling = correspondingProductAddon.ceilings && correspondingProductAddon.ceilings[0];
        return {
          ...contentAddon,
          maximal: ceiling
        };
      });
    this.addons = product.addons;
    this.addons = this.addons.sort((a, b) => a.id < b.id ? -1 : 1);
    this.addons = filteredAddons.map(addon => {
      const addonBody = product.addons.find(a => a.code === addon.code.value);
      return {
        id: addonBody.id,
        code: addon.code.value,
        importoMassimaleAssicurato: addon.maximal,
        name: addon.name.value,
        icon: addon.icon.value[0].url,
        price: addon.price.value,
        addedByUsersLabel: addon.added_by_users.value,
        addButton: addon.add.value,
        removeButton: addon.remove.value,
        detailsLink: addon.details.value,
        extraForm: this.setAddonExtraForm(addon.extra_form.value[0]),
        infoAddonModal: this.setInfoModal(addon.info_addon_modal.value[0]),
        linkedAddonsModal: this.setLinkedAddonModal(addon.linked_addons_modal.value[0])
      };
    });
  }

  private setAddonExtraForm(formStructure: any) {
    if (!!formStructure) {
      switch (formStructure.system.type) {
        case ExtraFormTypes.DAMAGE_FORM: return {
          type: ExtraFormTypes.DAMAGE_FORM,
          title: formStructure.title.value,
          options: formStructure.options.value.map(option => {
            return {
              text: option.text.value,
              value: option.system.codename
            };
          })
        };
        case ExtraFormTypes.CATNAT_FORM: return {
          type: ExtraFormTypes.CATNAT_FORM,
          buildingTypeLabel: formStructure.building_type.value,
          constructionTypeLabel: formStructure.construction_type.value,
          locationStateLabel: formStructure.location_state.value,
          locationCityLabel: formStructure.location_city.value
        };
        default: return {
          type: ExtraFormTypes.NONE
        };
      }
    }
    return { type: ExtraFormTypes.NONE };
  }

  private setLinkedAddonModal(modalStructure: any): LinkedAddonModal {
    if (!!modalStructure) {
      return {
        title: modalStructure.title.value,
        icon: modalStructure.dismiss_icon.value[0].url,
        buttonCancelLabel: modalStructure.button_cancel.value,
        descriptionAddonLinkedWith: modalStructure.description_addon_linked_with.value,
        descriptionLinkedAddon: modalStructure.description_linked_addon.value,
        toggleOption: {
          code: modalStructure.toggle_option.value[0].codename,
          name: modalStructure.toggle_option.value[0].name
        },
        addonsPrices: modalStructure.addons_prices.value.map(addon => {
          return {
            name: addon.name.value,
            price: addon.price.value
          };
        })
      };
    }
  }

  private setInfoModal(modalStructure: any): InfoAddonModal {
    if (!!modalStructure) {
      return {
        title: modalStructure.title.value,
        icon: modalStructure.dismiss_icon.value[0].url,
        buttonAddLabel: modalStructure.button_add.value,
        buttonRemoveLabel: modalStructure.button_remove.value,
        buttonCancelLabel: modalStructure.button_cancel.value,
        description: modalStructure.description.value
      };
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
  }

  isFormValid(): boolean {
    return true;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const homeInfo = this.addCatnatDataToHouseAttributes(this.addons, this.infoHomeForm);
    return Object.assign({}, this.product, { insuredSubjects: null, homeInfo });
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  public handleChangeStep(optionalWarranty?: boolean, infoHomeStep?: boolean, recapOprionalWarranties?: boolean) {
    this.optionalWarranty = optionalWarranty;
    this.infoHomeStep = infoHomeStep;
    this.recapOprionalWarranties = recapOprionalWarranties;
    this.setSelectedProposalTitle(this.selectedProposalTitle)
  }

  showProposalSelected(addons: MyHomeAddonContent[]) {
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
    this.handleUploadPrice(addonsProposalList);
  }

  public setSelectedProposalTitle(event) {
    this.dataService.selectedPacketName = event;
    this.selectedProposalTitle = event
    const isCustomized = localStorage.getItem('Customized')
    const customizedLabel = this.content.step_insurance_info.customized.text.value.toLowerCase()
    if (isCustomized && this.infoHomeStep && !this.selectedProposalTitle.includes(customizedLabel)) {
      this.selectedProposalTitle = event + ' ' + customizedLabel
    }
  }

  public handleUploadPrice(addons?: MyHomeAddonContent[]) {
    this.recapWarranties = addons;
    this.checkoutStepService.priceChangeAfterSelectedAddonsTimMyHome(this.createRequestQuote(addons));
  }

  public checkUserLogged(): User {
    return this.auth.loggedUser;
  }

  private createRequestQuote(addons?: MyHomeAddonContent[]): TimMyHomeRequestQuote {
    const user = this.checkUserLogged();
    const req = {
      user_id: user.id,
      product_code: this.product.code,
      addons: this.createAddonsRequestQuote(addons)
    };
    return req;
  }

  private createAddonsRequestQuote(addons: MyHomeAddonContent[]): AddonHomeRequest[] {
    const arrayAddon = [];
    addons.forEach(addon => {
      arrayAddon.push({
        code: addon.code,
        maximal: addon.importoMassimaleAssicurato,
        params: addon.quoteParams,
        selected: this.isCatnatSelected(addon)
      });
    });
    return arrayAddon;
  }

  private isCatnatSelected(addon: MyHomeAddonContent): boolean {
    if (addon.code as AddonCodes === AddonCodes.ADDON_CATNAT) {
      return addon.selezionata && this.hasAllProperties(addon.quoteParams)
    }
    return undefined
  }

  private hasAllProperties(params: AddonHomeExtraParams): boolean {
    return !params || (!!params.buildingType && !!params.cityCode && !!params.material && !!params.state)
  }

  private addCatnatDataToHouseAttributes(addons: MyHomeAddonContent[], homeInfo: MyHomeHouseAttributes): MyHomeHouseAttributes {
    const catnatAddon = addons.find(addon => addon.code as AddonCodes === AddonCodes.ADDON_CATNAT);
    if (!!catnatAddon && catnatAddon.selezionata) {
      Object.assign(homeInfo, { building_type: catnatAddon.quoteParams.buildingType });
    }
    return homeInfo;
  }

  selectedTitle(proposalName: string) {
    if (proposalName === 'super') {
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.informative_set',
        value: this.content.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_assistenza').text.value,
      });
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.informative_set_double',
        value: this.content.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_multirischio').text.value,
      });
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.informative_set_wording',
        value: this.content.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_wording').text.value,
      });
    }
    if (proposalName === 'full') {
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.informative_set',
        value: this.content.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_assistenza').text.value,
      });
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.informative_set_double',
        value: this.content.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_multirischio').text.value,
      });
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.informative_set_wording',
        value: this.content.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_wording').text.value,
      });
    }
  }
  backTitle() {
    this.checkoutStepService.setReducerProperty({
      property: 'cost_item.informative_set',
      value: this.content.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_assistenza').text.value,
    });
    this.checkoutStepService.setReducerProperty({
      property: 'cost_item.informative_set_double',
      value: '',
    });
    this.checkoutStepService.setReducerProperty({
      property: 'cost_item.informative_set_wording',
      value: '',
    });
  }
}
