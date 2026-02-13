import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { InsuranceInfoAttributes, LineFirstItem, Variant } from '@model';
import { NgbDate, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService } from '@services';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import moment from 'moment';
import { forkJoin, Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { StepInfoTimMySciSubstep, stepInfoTimMySciSubsteps } from './tim-my-sci-substeps.model'
import { NypInsurancesService, NypTimBrokerCustomersService } from '@NYP/ngx-multitenant-core';

type Direction = 'left' | 'right' | 'up' | 'down';
const DEFAULT_ADDON_PROPOSAL = 'red';
const DISPLAY_ALL_MIN_WIDTH = '992px';
type CheckoutInsuredSubject = {
  id: null,
  first_name: string,
  last_name: string,
  birth_date: string
}

@Component({
    selector: 'app-checkout-step-insurance-info-tim-my-sci',
    templateUrl: './checkout-step-insurance-info-tim-my-sci.component.html',
    styleUrls: ['./checkout-step-insurance-info-tim-my-sci.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoTimMySciComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {
  product: CheckoutStepInsuranceInfoProduct;
  content: any;
  proposalContent: any;
  addonsProposal = [{ code: 'blue', name: 'Blu' }, { code: 'red', name: 'Rossa' }, { code: 'black', name: 'Nera' }];
  @ViewChild('proposal', { static: true }) proposal: NgbTabset;

  maximumInsurable: number = 0;
  prices: { [key: string]: any };
  hasDiscount: boolean = false;
  proposalTitle: string = '';
  selectedVariant: Variant;

  public numberInsuredPersons: boolean = false;
  hideTabset: boolean = false;

  currentSubstep: StepInfoTimMySciSubstep = StepInfoTimMySciSubstep.INSURED_NUMBER;
  public durationForm: UntypedFormGroup;
  public numberInsuredForm: UntypedFormGroup;
  public insuredForm: UntypedFormGroup;

  constructor(
    public kenticoTranslateService: KenticoTranslateService,
    public insuranceService: InsurancesService,
    protected nypInsuranceService: NypInsurancesService,
    public checkoutStepService: CheckoutStepService,
    private dataService: DataService,
    protected nypTimMyBrokerCustomersService: NypTimBrokerCustomersService,

  ) {
    super();
  }

  ngOnInit() {
    const kenticoContent$ = this.kenticoTranslateService.getItem<any>('checkout_tim_mysci').pipe(take(1));
    const products$ = this.nypInsuranceService.getProducts();
    forkJoin([kenticoContent$, products$]).pipe(
      tap(([content, productsList]) => {
        this.content = content;
        this.proposalContent = this.content.step_insurance_choose_policy.value[0];
        const currentProduct = productsList.products.find(product => product.id === this.product.id);
        this.maximumInsurable = currentProduct.maximum_insurable;
      })
    ).subscribe();
    this.numberInsuredPersons = true;
  }

  public nextSubStep(): void {
    if (this.isCurrentSubstep(StepInfoTimMySciSubstep.INSURED_NUMBER)) {
      this.getOrderDiscount();
    }
    if (this.isCurrentSubstep(StepInfoTimMySciSubstep.DURATION)) {
      this.setCostItemDates();
      this.getProposalPricesQuotation();
      this.hideTabset = false;
      return;
    }
    if (this.isCurrentSubstep(StepInfoTimMySciSubstep.SELECT_TYPE)) {
      this.hideTabset = true;
    }
    this.currentSubstep = stepInfoTimMySciSubsteps[this.getCurrentSubstepIndex() + 1];
  }

  private setCostItemDates(): void {
    this.checkoutStepService.setReducerProperty({
      property: 'cost_item.policy_startDate',
      value: TimeHelper.fromNgbDateStrucutreToStringLocale(this.durationForm.value.dateFrom)
    })
    this.checkoutStepService.setReducerProperty({
      property: 'cost_item.policy_endDate',
      value: TimeHelper.fromNgbDateStrucutreToStringLocale(this.durationForm.value.dateTo)
    })
  }

  private getOrderDiscount(): void {
    const request = {
      quantity: this.numberInsuredForm.value.insuredNumber,
      before_14: this.numberInsuredForm.value.insuredMinors,
      discount: !!this.numberInsuredForm.value.declarationMinors
    }
    const orderId = this.dataService.getResponseOrder().id;
    this.nypTimMyBrokerCustomersService.setTimMySciOrderDiscount(request, orderId).subscribe(response => {
      this.hasDiscount = response.discount
    });
  }

  private getProposalPricesQuotation(): void {
    const request = {
      tenant: 'tim-customers',
      product_code: this.product.code,
      token: null,
      product_data: {
        insureds: this.numberInsuredForm.value.insuredNumber,
        duration: this.calculatePolicyDuration()
      }
    }
    this.nypTimMyBrokerCustomersService.timMySciQuotation(request).subscribe(response => {
      this.prices = response.additional_data;
      this.currentSubstep = stepInfoTimMySciSubsteps[this.getCurrentSubstepIndex() + 1];
    })
  }

  private calculatePolicyDuration() {
    const fromDate = moment(TimeHelper.fromNgbDateToDate(this.durationForm.value.dateFrom)).startOf('day');
    const toDate = moment(TimeHelper.fromNgbDateToDate(this.durationForm.value.dateTo)).endOf('day');
    // Add one because we need to have duration from [fromDate 00:00] to [toDate 24:00]
    return toDate.diff(fromDate, 'days') + 1;
  }

  public previousSubStep(): void {
    this.currentSubstep = stepInfoTimMySciSubsteps[this.getCurrentSubstepIndex() - 1];
    if (this.isCurrentSubstep(StepInfoTimMySciSubstep.SELECT_TYPE)) {
      this.hideTabset = false
    }
  }

  private isCurrentSubstep(substep: StepInfoTimMySciSubstep): boolean {
    return this.currentSubstep === substep;
  }

  private getCurrentSubstepIndex(): number {
    return stepInfoTimMySciSubsteps.findIndex(substep =>
      substep === this.currentSubstep
    );
  }

  public updateDurationForm(form: UntypedFormGroup): void {
    this.durationForm = form;
  }

  public updateNumberInsuredForm(form: UntypedFormGroup): void {
    this.numberInsuredForm = form;
  }

  public setInsuredForms(form: UntypedFormGroup): void {
    this.insuredForm = form;
  }

  public operationManager(operation: string) {
    if (operation === 'next') {
      this.nextSubStep();
    } else if (operation === 'prev') {
      this.previousSubStep();
    }
  }

  isFormValid(): boolean {
    return true;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredSubjects: CheckoutInsuredSubject[] = this.computeModel();
    return Object.assign({}, this.product, {
      insuredSubjects,
      startDate: TimeHelper.fromNgbDateToDate(this.durationForm.value.dateFrom),
      endDate: TimeHelper.fromNgbDateToDate(this.durationForm.value.dateTo),
      insuredIsContractor: this.insuredForm.value.contractorIsInsured,
      variantId: this.selectedVariant.id
    });
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

  fillLineItem(lineItem: LineFirstItem): void {
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  ngAfterViewInit() {
    this.selectDefaultTab();
  }

  private selectDefaultTab() {
    this.proposal.select(`tab-${DEFAULT_ADDON_PROPOSAL}`);
    this.hideTabset = true;
  }

  selectTab(event: NgbTabChangeEvent) {
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

  private setTabContent(event: NgbTabChangeEvent) {
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

  public getPrice(index: number): number {
    return this.prices && this.prices[`grossPremium_${index + 1}`];
  }

  public getDiscountedPrice(index: number): number {
    return this.prices && this.prices[`grossPremiumDiscount_${index + 1}`];
  }
  public setSelectedProposalTitle($event) {
    this.proposalTitle = $event;
  }

  public setSelectedVariant(selectedVariantSku: string): void {
    this.selectedVariant = this.product.originalProduct.variants.find(variant =>
      variant.sku === selectedVariantSku
    );
  }

}
