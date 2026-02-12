import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService } from '@services';
import { forkJoin, Subject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { InsuranceInfoModalTimMyHomeProposalComponent } from './insurance-info-modal-tim-my-home-proposal/insurance-info-modal-tim-my-home-proposal.component';
import { ActivatedRoute } from "@angular/router";
import { UPSELLING_QUERY_PARAM } from "../../../../shared/shared-queryparam-keys";
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-card-insurance-info-tim-my-home-proposal',
  templateUrl: './checkout-card-insurance-info-tim-my-home-proposal.component.html',
  styleUrls: ['./checkout-card-insurance-info-tim-my-home-proposal.component.scss']
})
export class CheckoutCardInsuranceInfoTimMyHomeProposalComponent implements OnInit {

  @Input() proposalName: any;
  @Input() product: any;
  @Input() kenticoItems: any;
  @Output() showOptionalWarranty = new EventEmitter<any>();
  @Output() showProposalSelected = new EventEmitter<any>();
  @Output() selectedAddonsProposalsEmit = new EventEmitter<any>();
  @Output() showProposalTitle = new EventEmitter<any>();
  @Output() proposalTitle = new EventEmitter<any>();

  addons;
  isUpselling: any;
  proposal = {
    title: '',
    subtitle: '',
    detail: '',
    customizeBtn: '',
    buyBtn: '',
    addons: [],
    price: '',
    premioTotaleScontatoGaranzia: '',
    closeProposalDetail: '',
  };

  kenticoBodyProposal: any;
  subscribe: any;

  constructor(
    public dataService: DataService,
    private modalService: NgbModal,
    protected nypInsuranceService: NypInsurancesService,
    private route: ActivatedRoute,

  ) {
  }

  ngOnInit() {
    this.createAddonList();
    //console.log(this.proposal)
  }

  createAddonList() {
    const kentico = this.kenticoItems;
    this.kenticoBodyProposal = kentico.step_insurance_info_optional_proposal.value;
    this.uploadKenticoProposal();
    const queryParamMap = this.route.snapshot.queryParamMap;
    const isUpSelling = queryParamMap.has(UPSELLING_QUERY_PARAM);
    this.isUpselling = isUpSelling;
    const respGenertel$ = this.nypInsuranceService.submitTimMyHomeWarrantiesProposals(this.createRequest(this.proposalName.charAt(0).toUpperCase() + this.proposalName.slice(1)), this.proposalName, isUpSelling).pipe(take(1));
    forkJoin([respGenertel$]).pipe(
      tap(([respGenertel]) => {
        this.kenticoBodyProposal = kentico.step_insurance_info_optional_proposal.value;
        const kenticoBodyAddons = kentico.step_insurance_info_optional_warranty.value;
        this.uploadKenticoProposal();
        this.uploadAddons(this.product.originalProduct.addons, respGenertel.addons, kenticoBodyAddons);
        this.proposal.price = respGenertel.total;
      })
    ).subscribe();
  }

  uploadKenticoProposal() {
    this.uploadKenticoImagesProposal();
    const addonProvKentico = this.kenticoBodyProposal.find(elem => elem.code && elem.code.value.toLowerCase() === this.proposalName.toLowerCase());
    this.uploadKenticoImagesProposal();
    if (addonProvKentico) {
      this.proposal.title = addonProvKentico.title_home.value;
      this.proposal.subtitle = addonProvKentico.subtitle.value;
      this.proposal.detail = addonProvKentico.detail.value;
      this.proposal.customizeBtn = addonProvKentico.customize_btn.value;
      this.proposal.buyBtn = addonProvKentico.buy_btn.value;
    }
  }

  uploadKenticoImagesProposal(): void {
    for (const elem of this.kenticoBodyProposal) {
      switch (elem.system.codename) {
        case 'close_modal_icon_home':
          this.proposal.closeProposalDetail = elem.thumbnail.value[0].url;
          break;
      }
    }
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

    this.proposal.addons = listAddons;
  }
  public getAddonsWithCriteria(key: string) {
    return this.dataService.product.addons.filter(a => a.taxons.some(s => s.name == key));
  }
  //create request quote for basic super full
  createRequest(proposalName) {
    return {
      line_item_id: this.product.order.line_items[0].id,
      addons: this.getAddonsWithCriteria(proposalName),
      product_code: "tim-my-home",
      tenant: "tim-customers",
      upselling: this.isUpselling,
      promotion: this.dataService.product.promotion,
      user_type: null
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

  showOptionalWarrantyBtn() {
    const addons = this.proposal.addons.filter(addon => addon.selezionata);
    this.showProposalTitle.emit(this.proposal.title);
    this.showOptionalWarranty.emit();
    this.showProposalSelected.emit(addons);
    this.proposalTitle.emit(this.proposalName);
  }

  showInfoHome() {
    this.dataService.timHomePrice = this.proposal.price
    localStorage.removeItem('Customized');
    localStorage.setItem('Proposal', this.proposal.title);
    const addons = this.proposal.addons.filter(addon => addon.selezionata);
    this.showProposalSelected.emit(addons);
    this.selectedAddonsProposalsEmit.emit();
    this.showProposalTitle.emit(this.proposal.title);
  }

  openDetail() {
    const modalRef = this.modalService.open(InsuranceInfoModalTimMyHomeProposalComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    (<InsuranceInfoModalTimMyHomeProposalComponent>modalRef.componentInstance).proposal = this.proposal;
    modalRef.result.then(action => {
      switch (action) {
        case 'edit':
          this.showOptionalWarrantyBtn()
          break
        case 'buy':
          this.showInfoHome()
          break
        default: break
      }
    })
  }
}
