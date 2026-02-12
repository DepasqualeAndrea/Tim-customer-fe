import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutService, DataService, InsurancesService, KenticoYoloService } from '@services';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { take, tap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { ResponseOrder } from '@model';

@Component({
  selector: 'app-checkout-card-insurance-info-auto-proposal',
  templateUrl: './checkout-card-insurance-info-auto-proposal.component.html',
  styleUrls: ['./checkout-card-insurance-info-auto-proposal.component.scss']
})
export class CheckoutCardInsuranceInfoAutoProposalComponent implements OnInit, OnDestroy {

  @ViewChildren('panel', { read: ElementRef }) public panel: QueryList<any>;
  @Input() proposalName: any;
  @Input() carInfo: any;
  @Input() product: any;
  @Input() formValid: boolean;
  @Input() typeProposal: string;
  @Output() addAttendee = new EventEmitter<any>();
  @Output() showOptionalWarranty = new EventEmitter<any>();
  @Output() showProposalTitle = new EventEmitter<any>();
  @Output() selectedAddonsProposalsEmit = new EventEmitter<any>();
  @Output() addonsPricing = new EventEmitter<any>();
  @Output() ownerStep = new EventEmitter<any>();


  proposal = {
    title: '',
    subtitle: '',
    detail: '',
    customizeBtn: '',
    buyBtn: '',
    addons: [],
    price: '',
    premioTotaleGaranzia: '',
    premioTotaleScontatoGaranzia: '',
    scontoGaranzia: '',
    description: '',
    checkIconMotor: '',
    notIncludedIcon: '',
    closeProposalDetail: ''
  };
  kenticoBodyProposal: any;
  subscribe: any;
  responseOrder: ResponseOrder;

  constructor(
    private kenticoYoloService: KenticoYoloService,
    public dataService: DataService,
    private modalService: NgbModal,
    private elementRef: ElementRef,
    private infoComponent: CheckoutStepInsuranceInfoComponent,
    private checkoutService: CheckoutService,
    private insuranceService: InsurancesService,
    private checkoutStepService: CheckoutStepService
  ) {
  }

  ngOnInit() {
    this.createAddonList();
    this.subscribe = this.checkoutStepService.checkoutStepPriceChangeAfterSelectedAddonsMotor$.subscribe(resp => this.createAddonList());
    this.responseOrder = this.dataService.getResponseOrder();
  }

  isOwner() {
    if (!this.responseOrder.line_items[0].contractor_is_owner) {
      this.ownerStep.emit(true);
    } else {
      this.infoComponent.handleNextStep();
    }
  }


  submit() {
    this.subscribe.unsubscribe();
    const addons = this.proposal.addons.filter(addon => addon.selezionata);
    localStorage.setItem('Proposal', this.proposal.title);
    this.checkoutService.setAddonsStepInsuranceInfo(addons);
    this.selectedAddonsProposalsEmit.emit(addons);
    const title = this.proposal.title;
    this.showProposalTitle.emit(title);
    this.isOwner();
  }

  createRequest() {
    return {
      product_code: this.product.code,
      order_id: this.product.order.id,
      car_data: this.carInfo
    };
  }

  onScroll(event) {
    if (event.srcElement.scrollTop > 0) {
      const element = document.getElementById('top-button-' + this.proposalName);
      element.classList.remove('d-none');
    } else if (event.srcElement.scrollTop === 0) {
      const element = document.getElementById('top-button-' + this.proposalName);
      element.classList.add('d-none');
    }

    if (event.srcElement.scrollTop === 430) {
      const element = document.getElementById('bottom-button-' + this.proposalName);
      element.classList.add('d-none');
    } else if (event.srcElement.scrollTop < 430) {
      const element = document.getElementById('bottom-button-' + this.proposalName);
      element.classList.remove('d-none');
    }
  }

  public onPreviousSearchPosition(): void {
    this.panel.forEach(item => {
      if (item.nativeElement.id === String(this.proposalName)) {
        item.nativeElement.scrollTop -= 20;
      }
    });
  }

  public onNextSearchPosition(): void {
    this.panel.forEach(item => {
      if (item.nativeElement.id === String(this.proposalName)) {
        item.nativeElement.scrollTop += 20;
      }
    });
  }


  createAddonList(full?: any) {
    setTimeout(() => {
      const kentico$ = this.kenticoYoloService.getItem<any>('checkout_motor_genertel').pipe(take(1));
      const respGenertel$ = this.insuranceService.submitGenertelMotorWarrantiesProposals(this.createRequest(), this.proposalName).pipe(take(1));
      forkJoin([kentico$, respGenertel$]).pipe(
        tap(([kenticoContent, respGenertel]) => {
          this.kenticoBodyProposal = kenticoContent.step_insurance_info_optional_proposal.value;
          const kenticoBodyAddons = kenticoContent.step_insurance_info_optional_warranty.value;
          this.uploadKenticoProposal();
          this.uploadAddons(respGenertel.additional_data.offerta.listaGaranzie, kenticoBodyAddons);
          this.proposal.price = respGenertel.total;
        })
      ).subscribe();
    }, 1500);
  }

  uploadKenticoProposal() {
    const addonProvKentico = this.kenticoBodyProposal.find(elem => elem.code && elem.code.value.toLowerCase() === this.proposalName.toLowerCase());
    this.uploadKenticoImagesProposal();
    if (addonProvKentico) {
      this.proposal.title = this.product.code === 'ge-motor-car' ? addonProvKentico.title_car.value : addonProvKentico.title_van.value;
      this.proposal.subtitle = addonProvKentico.subtitle.value;
      this.proposal.detail = addonProvKentico.detail.value;
      this.proposal.customizeBtn = addonProvKentico.customize_btn.value;
      this.proposal.buyBtn = addonProvKentico.buy_btn.value;
    }
  }

  uploadKenticoImagesProposal(): void {

    for (const elem of this.kenticoBodyProposal) {
      switch (elem.system.codename) {
        case 'check_icon_motor_small':
          this.proposal.checkIconMotor = elem.image.value[0].url;
          break;
        case 'not_included_icon_motor':
          this.proposal.notIncludedIcon = elem.image.value[0].url;
          break;
        case 'close_modal_icon':
          this.proposal.closeProposalDetail = elem.image.value[0].url;
          break;
      }
    }
  }

  uploadAddons(addons: any, kenticoBodyAddons: any) {
    const listAddons = [];
    addons.forEach(addon => {
      let addonToAdd;
      const addonProvKentico = kenticoBodyAddons.find(elem => elem.code.value.toLowerCase() === addon.garanzia.codGaranzia.toLowerCase());
      addonToAdd = {
        name: addonProvKentico.name.value,
        selezionata: addon.selezionata,
        code: addon.garanzia.codGaranzia,
        importoMassimaleAssicurato: !addon.listaMassimali ?
          this.product.order.data.quotation_response.additional_data.preventivoAggregatori.veicolo.importoValoreCommerciale
          : addon.garanzia.importoMassimaleAssicurato,
        franchigia: addon.listaFranchigie ? addon.listaFranchigie : null,
        autoValue: this.product.order.data.quotation_response.additional_data.preventivoAggregatori.veicolo.importoValoreCommerciale,
        premioTotaleGaranzia: addon.garanzia.premioTotaleGaranzia,
        premioTotaleScontatoGaranzia: addon.garanzia.premioTotaleScontatoGaranzia,
        scontoGaranzia: addon.garanzia.scontoGaranzia
      };
      const addonProduct = this.product.originalProduct.addons.find(elem => elem.code.toLowerCase() === addon.garanzia.codGaranzia.toLowerCase());
      if (addonProduct) {
        addonToAdd.description = addonProvKentico.kentico_description.value;
        addonToAdd.image = addonProduct.image ? addonProduct.image.original_url : undefined;
        addonToAdd.id = addonProduct.id;
      }
      addonToAdd.selezionata ? listAddons.unshift(addonToAdd) : listAddons.push(addonToAdd);

    });
    this.proposal.addons = listAddons;
  }

  openDetail() {
    const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    (<ContainerComponent>modalRef.componentInstance).type = 'ModalAutoProposal';
    (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'proposal': this.proposal };
    modalRef.result.then(result => {
      if (result === 'edit') {
        this.showOptionalWarrantyBtn();
      }
    }, (reason) => {
      if (reason === 'buy') {
        this.submit();
      }
    });
  }

  showOptionalWarrantyBtn() {
    this.subscribe.unsubscribe();
    const addons = this.proposal.addons.filter(addon => addon.selezionata);
    localStorage.setItem('Proposal', this.proposal.title);
    const title = this.proposal.title;
    this.showProposalTitle.emit(title);
    this.showOptionalWarranty.emit(addons);
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
