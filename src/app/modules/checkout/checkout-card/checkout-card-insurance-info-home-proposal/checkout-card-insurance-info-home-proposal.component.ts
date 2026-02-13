import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CheckoutService,
  DataService,
  InsurancesService,
  KenticoYoloService,
} from '@services';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { take, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { CheckoutStepService } from '../../services/checkout-step.service';
import {KenticoTranslateService} from '../../../kentico/data-layer/kentico-translate.service';
import {log} from "util";

@Component({
    selector: 'app-checkout-card-insurance-info-home-proposal',
    templateUrl: './checkout-card-insurance-info-home-proposal.component.html',
    styleUrls: ['./checkout-card-insurance-info-home-proposal.component.scss'],
    standalone: false
})
export class CheckoutCardInsuranceInfoHomeProposalComponent implements OnInit {
  @Input() proposalName: any;
  @Input() product: any;
  @Input() typeProposal: string;

  @Output() addAttendee = new EventEmitter<any>();
  @Output() showOptionalWarranty = new EventEmitter<any>();
  @Output() showProposalSelected = new EventEmitter<any>();
  @Output() selectedAddonsProposalsEmit = new EventEmitter<any>();
  @Output() addonsPricing = new EventEmitter<any>();
  @Output() proposalTitle = new EventEmitter<any>();

  addons;
  valueInputChoose;

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
    checkIconHome: '',
    notIncludedIcon: '',
  };

  kenticoBodyProposal: any;
  subscribe: any;

  constructor(
    private kenticoYoloService: KenticoTranslateService,
    public dataService: DataService,
    private modalService: NgbModal,
    private elementRef: ElementRef,
    private infoComponent: CheckoutStepInsuranceInfoComponent,
    private checkoutService: CheckoutService,
    private insuranceService: InsurancesService,
    private checkoutStepService: CheckoutStepService
  ) { }

  ngOnInit() {
    this.createAddonList();
    if (this.dataService.tenantInfo.tenant === 'chebanca_db') {
      this.dataService.getValueInputChoise().subscribe(res => {
        this.valueInputChoose = res;
      });
    }
  }

  createAddonList() {
    const kentico$ = this.kenticoYoloService
      .getItem<any>('checkout_home_genertel')
      .pipe(take(1));
    const respGenertel$ = this.insuranceService
      .submitGenertelHomeWarrantiesProposals(
        this.createRequest(),
        this.proposalName
      )
      .pipe(take(1));
    forkJoin([kentico$, respGenertel$])
      .pipe(
        tap(([kenticoContent, respGenertel]) => {
          this.kenticoBodyProposal =
            kenticoContent.step_insurance_info_optional_proposal.value;
          const kenticoBodyAddons =
            kenticoContent.step_insurance_info_optional_warranty.value;
          this.uploadKenticoProposal();
          this.uploadAddons(
            this.product.originalProduct.addons,
            respGenertel.addons,
            kenticoBodyAddons
          );
          this.getAddonsPricing();
          this.proposal.price = respGenertel.total;
        })
      )
      .subscribe();
  }


  private getAddonsPricing(): void {
    const addons = this.proposal.addons.filter(addon => addon.selezionata);
    this.addonsPricing.emit(addons);
  }
  uploadKenticoProposal() {
    const addonProvKentico = this.kenticoBodyProposal.find(
      (elem) =>
        elem.code &&
        elem.code.value.toLowerCase() === this.proposalName.toLowerCase()
    );
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
        case 'check_icon_motor_small':
          this.proposal.checkIconHome = elem.image.value[0].url;
          break;
        case 'close_modal_icon_home':
          this.proposal.closeProposalDetail = elem.image.value[0].url;
          break;
          case 'not_included_icon_motor':
          this.proposal.notIncludedIcon = elem.image.value[0].url;
          break;
      }
    }
  }

  uploadAddons(allAddons: any, addons: any, kenticoBodyAddons: any) {
    const listAddons = [];
    allAddons.forEach((addon) => {
      let addonToAdd;
      const addonProvKentico = kenticoBodyAddons.find(
        (elem) => elem.code.value.toLowerCase() === addon.code.toLowerCase()
      );
      const addonProposal = addons.find(
        (elem) => elem.id.toLowerCase() === addon.code.toLowerCase()
      );
      addonToAdd = {
        name: addonProvKentico.name.value,
        selezionata: !!addonProposal,
        code: addon.code,
        importoMassimaleAssicurato: addonProposal
          ? addonProposal.maximal
          : null,
        premioTotaleScontatoGaranzia: addonProposal
          ? addonProposal.price
          : null,
        description: addonProvKentico.kentico_description.value,
        image: addon.image ? addon.image.original_url : undefined,
        id: addon.id,
      };

      listAddons.push(addonToAdd);
    });

    const sortiList = [];
    kenticoBodyAddons.map(elem => sortiList.push(elem.code.value.toLowerCase()));
    listAddons.sort((a, b) => sortiList.findIndex(item => a.code.toLowerCase() === item) < sortiList.findIndex(item => b.code.toLowerCase() === item) ? -1 : 1);
    this.proposal.addons = listAddons;
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

  showOptionalWarrantyBtn() {
    const addons = this.proposal.addons.filter((addon) => addon.selezionata);
    localStorage.setItem('Proposal', this.proposal.title);
    this.proposalTitle.emit(this.proposal.title);
    this.showOptionalWarranty.emit(addons);
    this.showProposalSelected.emit(addons);
  }

  showInfoHome() {
    const addons = this.proposal.addons.filter((addon) => addon.selezionata);
    localStorage.setItem('Proposal', this.proposal.title);
    this.proposalTitle.emit(this.proposal.title);
    this.checkoutService.setAddonsStepInsuranceInfo(addons);
    this.showProposalSelected.emit(addons);
    this.selectedAddonsProposalsEmit.emit(addons);
  }

  openDetail() {
    const modalRef = this.modalService.open(ContainerComponent, {
      size: 'lg',
      backdropClass:
        'backdrop-class ' + this.dataService.tenantInfo.main.layout,
      windowClass: 'modal-window',
    });
    (<ContainerComponent>modalRef.componentInstance).type = 'ModalAutoProposal';
    (<ContainerComponent>modalRef.componentInstance).componentInputData = { proposal: this.proposal };
    modalRef.result.then(result => {
      if (result === 'edit') {
        this.showOptionalWarrantyBtn();
      }
    }, (reason) => {
      if (reason === 'buy') {
        this.showInfoHome();
      }
    });
  }
}
