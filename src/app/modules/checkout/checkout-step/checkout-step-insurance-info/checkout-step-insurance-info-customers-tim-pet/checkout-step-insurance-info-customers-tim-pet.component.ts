import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LineFirstItem, Variant } from '@model';
import { NgbDateParserFormatter, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { forkJoin, Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { stepInfoTimPetCustomersSubstep, StepInfoTimPetCustomersSubstep } from './tim-pet-customers-substeps.model';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

type Direction = 'left' | 'right' | 'up' | 'down';
const DEFAULT_ADDON_PROPOSAL = 'tim-my-pet-smart-plus';
const DISPLAY_ALL_MIN_WIDTH = '992px';

type CheckoutInsuredPet = {
  name: string,
  kind: string,
  birth_date: string,
  microchip_code: string
}

@Component({
  selector: 'app-checkout-step-insurance-info-customers-tim-pet',
  templateUrl: './checkout-step-insurance-info-customers-tim-pet.component.html',
  styleUrls: ['./checkout-step-insurance-info-customers-tim-pet.component.scss']
})
export class CheckoutStepInsuranceInfoCustomersTimPetComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  proposalContent: any;
  content: any;
  currentSubstep: StepInfoTimPetCustomersSubstep = StepInfoTimPetCustomersSubstep.INSURED_TYPE_ANIMAL;
  addonsProposal = [{ code: 'tim-my-pet-smart', name: 'Smart' }, { code: 'tim-my-pet-smart-plus', name: 'Smart+' }, { code: 'tim-my-pet-deluxe', name: 'Deluxe' }];
  @ViewChild('proposal', { static: true }) proposal: NgbTabset;
  proposalTitle: string = '';
  selectedVariant: Variant;
  prices: { [key: string]: any } = {};
  public insuredForm: FormGroup;
  public hideTabset: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    public kenticoTranslateService: KenticoTranslateService,
    public insuranceService: InsurancesService,
    protected nypInsuranceService: NypInsurancesService,
    private dataService: DataService,
  ) {
    super();
  }

  ngOnInit() {
    const kenticoContent$ = this.kenticoTranslateService.getItem<any>('checkout_customers_tim_pet').pipe(take(1));
    const products$ = this.nypInsuranceService.getProducts();
    forkJoin([kenticoContent$, products$]).pipe(
      tap(([content, productsList]) => {
        this.content = content;
        this.proposalContent = this.content.step_insurance_choose_policy.value[0];
        const currentProduct = productsList.products.find(product => product.id === this.product.id);
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    this.selectDefaultTab();
  }

  public setInsuredForms(form: FormGroup): void {
    if (form.value.kind === 'cat') {
      this.dataService.setParams({ kindSelected: 'gatto' });
    } else if (form.value.kind === 'dog') {
      this.dataService.setParams({ kindSelected: 'cane' });
    } else {
      this.dataService.setParams({ kindSelected: '' });
    }

    this.insuredForm = form;
  }

  public nextSubStep(): void {
    if (this.isCurrentSubstep(StepInfoTimPetCustomersSubstep.INSURED_TYPE_ANIMAL)) {
      this.getProposalPricesQuotation();
    }
    this.currentSubstep = stepInfoTimPetCustomersSubstep[this.getCurrentSubstepIndex() + 1];
    if (this.isCurrentSubstep(StepInfoTimPetCustomersSubstep.SELECT_POLICY_TYPE)) {
      this.hideTabset = false;
    }
  }

  public previousSubStep(): void {
    this.currentSubstep = stepInfoTimPetCustomersSubstep[this.getCurrentSubstepIndex() - 1];
  }

  private isCurrentSubstep(substep: StepInfoTimPetCustomersSubstep): boolean {
    return this.currentSubstep === substep;
  }

  private getCurrentSubstepIndex(): number {
    return stepInfoTimPetCustomersSubstep.findIndex(substep =>
      substep === this.currentSubstep
    );
  }

  private getProposalPricesQuotation(): void {
    this.product.originalProduct.variants.map((v, i) => {
      if (this.product.originalProduct.variants[i].sku) {
        this.prices[this.product.originalProduct.variants[i].sku] = this.product.originalProduct.variants[i].price;
      }
    });
  }

  public getPrice(sku: string): number {
    return this.prices && this.prices[sku];
  }


  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredPets: CheckoutInsuredPet = this.computeModel();
    return Object.assign({}, this.product, {
      insuredPets,
      variantId: this.selectedVariant.id || 16,
      insuredIsContractor: false
    });
  }


  private computeModel(): CheckoutInsuredPet {
    return {
      name: this.insuredForm.value.petName,
      kind: this.insuredForm.value.kind,
      birth_date: TimeHelper.fromNgbDateStrucutreStringTo(this.insuredForm.value.birthDate),
      microchip_code: this.insuredForm.value.microChip,
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
      });
  }

  public operationManager(operation: string) {
    if (operation === 'next') {
      this.nextSubStep();
    } else if (operation === 'prev') {
      this.previousSubStep();
    }
  }

  private setProposalActive(tabContentId: string) {
    document.getElementById(tabContentId).classList.add('active');
  }

  private setProposalNotActive(tabContentId: string) {
    document.getElementById(tabContentId).classList.remove('active');
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

  public setSelectedProposalTitle($event) {
    this.dataService.selectedPacketName = $event;
    this.proposalTitle = $event;
  }

  public setSelectedVariant(selectedVariantSku: string): void {
    this.selectedVariant = this.product.originalProduct.variants.find(variant =>
      variant.sku === selectedVariantSku
    );
  }

  selectTab(event) {
    if (!window.matchMedia(`(min-width: ${DISPLAY_ALL_MIN_WIDTH})`).matches) {
      this.setTabContent(event);
    }
  }

  private selectDefaultTab() {
    this.proposal.select(`tab-${DEFAULT_ADDON_PROPOSAL}`);
    this.hideTabset = true;
  }

  isFormValid(): boolean {
    return true;
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    delete lineItem.expiration_date;
    delete lineItem.start_date;
    return null;
  }




}
