import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { CheckoutDocumentAcceptanceService } from '../../checkout-step/checkout-step-payment/checkout-step-payment-document-acceptance.service';
import { LocaleService } from 'app/core/services/locale.service';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { InsuranceInfoModalTimMyPetProposalComponent } from './insurance-info-modal-tim-my-pet-proposal/insurance-info-modal-tim-my-pet-proposal.component';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';

@Component({
    selector: 'app-checkout-card-insurance-info-tim-pet-proposal',
    templateUrl: './checkout-card-insurance-info-tim-pet-proposal.component.html',
    styleUrls: ['./checkout-card-insurance-info-tim-pet-proposal.component.scss'],
    standalone: false
})
export class CheckoutCardInsuranceInfoTimPetProposalComponent implements OnInit {

  @Input() proposalName: any;
  @Input() product: any;
  @Input() kenticoItems: any;
  @Input() price: number;
  @Output() showProposalTitle = new EventEmitter<any>();
  @Output() operation:  EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedVariant:  EventEmitter<string> = new EventEmitter<string>();
  @Output() showOptionalWarranty = new EventEmitter<any>();
  @Output() showProposalSelected = new EventEmitter<any>();
  @Output() selectedAddonsProposalsEmit = new EventEmitter<any>();


  addons;

  proposal = {
    title: '',
    subtitle: '',
    button: '',
    warranties: [],
    price: 0,
    discountedPrice: 0,
    sku: '',
    details: '',
    modal: [],
    period: ''
  };


  kenticoBodyProposal: any;
  subscribe: any;

  constructor(
    public dataService: DataService,
    private modalService: NgbModal,
    private localeService: LocaleService,
    public checkoutStepService: CheckoutStepService,
    private infoComponent: CheckoutStepInsuranceInfoComponent,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    ) {
  }

  ngOnInit() {
    this.createAddonList();

  }

  createAddonList() {
    this.kenticoBodyProposal = this.kenticoItems.package_list.value;
    this.uploadKenticoProposal();
  }


  uploadKenticoProposal() {
    const addonProvKentico = this.kenticoBodyProposal.find(elem => elem.code && elem.code.value.toLowerCase() === this.proposalName.toLowerCase());
    if (addonProvKentico) {
      this.proposal.title = addonProvKentico.title.value;
      this.proposal.subtitle = addonProvKentico.subtitle.value;
      this.proposal.button = addonProvKentico.button.value;
      this.proposal.sku = addonProvKentico.sku.value;
      this.proposal.warranties = this.mapWarranties(addonProvKentico.warranty.value);
      this.proposal.details = addonProvKentico.details.value;
      this.proposal.period= addonProvKentico.period.value;
      this.proposal.modal.push(this.getModal(addonProvKentico.modal.value[0]));
    }
  }

    getModal(modal){
      return{
        buy_button: modal.buy_button.value,
        close_icon: modal.close_icon.value[0].url,
        coverages: this.getCoverages(modal.coverages),
        forward_button: modal.forward_button.value
      }

  }
  getCoverages(coverages){
    let coveragesFromKentico : any[] = coverages.value.map(coverage =>{
      return{
        title: coverage.title.value,
        description: coverage.description.value
      }
    })
    return coveragesFromKentico;
  }

  private mapWarranties(kenticoItems: any[]): any[] {
    return kenticoItems.map(warranty => {
      return {
        included: !!warranty.multiple_choice.value.find(c => c.name === 'included'),
        name: warranty.warranty.value
      }
    })
  }

  createRequest() {
    return {
      line_item_id: this.product.order.line_items[0].id,
    };
  }

  onScroll(event) {
    if (event.srcElement.scrollTop > 0) {
      const element = document.getElementById(
        'top-button-' + this.proposalName
      );
      element.classList.remove('d-none');
    } else if (event.srcElement.scrollTop === 0) {
      const element = document.getElementById(
        'top-button-' + this.proposalName
      );
      element.classList.add('d-none');
    }

    if (event.srcElement.scrollTop === 430) {
      const element = document.getElementById(
        'bottom-button-' + this.proposalName
      );
      element.classList.add('d-none');
    } else if (event.srcElement.scrollTop < 430) {
      const element = document.getElementById(
        'bottom-button-' + this.proposalName
      );
      element.classList.remove('d-none');
    }
  }

  submit() {
    const form: any = {
      paymentmethod: '',
      mypet_pet_type: this.dataService.getParams().kindSelected,
      codice_sconto: 'no',
      sci_numassicurati: 0,
      sci_min14: 0,
      sci_polizza: '',
    }
    const number =  this.product.order.id + '';
    let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.product, 1, number, {}, form, 'tim broker', '');
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);

    const includedWarranties = this.proposal.warranties.filter(
      w => w.included
    ).map(
      w => w.name
    );
    localStorage.setItem('Proposal', this.proposal.title);
    localStorage.setItem('ProposalCostDetailList', JSON.stringify(includedWarranties));
    this.checkoutStepService.setReducerProperty({
      property: 'cost_item.cost_detail_by_product.customerstimpet',
      value: includedWarranties
    });
    this.dataService.petSelectedVariantPrice = this.dataService.product.variants.find(variant => variant.sku === this.proposal.sku).price;
    this.selectedVariant.emit(this.proposal.sku);
    this.showProposalTitle.emit(this.proposal.title);
    this.infoComponent.handleNextStep();
  }

  showOptionalWarrantyBtn() {
    const addons = this.proposal.warranties.filter(addon => addon.selezionata);
    this.showProposalTitle.emit(this.proposal.title);
    this.showOptionalWarranty.emit();
    this.showProposalSelected.emit(addons);
  }


  openDetail() {
    const modalRef = this.modalService.open(InsuranceInfoModalTimMyPetProposalComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    this.proposal.price = this.price;
    (<InsuranceInfoModalTimMyPetProposalComponent>modalRef.componentInstance).proposal = this.proposal;
    modalRef.result.then(action => {
      switch(action) {
        case 'edit':
          this.showOptionalWarrantyBtn();
          break
        case 'buy':
          this.submit();
          break
        default: break
      }
    })
  }
  private formatPrice(price: number): string {
    const locale = this.localeService.getMainLocale();
    return formatCurrency(
      price,
      locale || 'it_IT',
      getCurrencySymbol(this.localeService.getCurrencySymbol(locale), 'narrow'),
      this.localeService.getCurrencySymbol(locale),
      '0.2-2'
    )
  }

}
