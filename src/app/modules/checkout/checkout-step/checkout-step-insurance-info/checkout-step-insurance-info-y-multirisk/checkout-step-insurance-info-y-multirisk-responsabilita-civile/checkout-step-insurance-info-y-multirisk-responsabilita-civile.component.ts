import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService, ProductsService } from "@services";
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { Subject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoProduct } from '../../checkout-step-insurance-info.model';



@Component({
    selector: 'app-checkout-step-insurance-info-y-multirisk-responsabilita-civile',
    templateUrl: './checkout-step-insurance-info-y-multirisk-responsabilita-civile.component.html',
    styleUrls: ['./checkout-step-insurance-info-y-multirisk-responsabilita-civile.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoYMultiriskResponsabilitaCivileComponent implements OnInit {

  body: any;
  add: boolean = false;
  remove: boolean = true;
  contentItem: any;
  modalRef: any;
  @Input() addonsInfo: any;
  @Input() product: CheckoutStepInsuranceInfoProduct;
  @Output() quote = new EventEmitter<any>();
  quoteSelected : {operation: string, addon: {id: string, maximal: number}, type: string}
  quotes : any[] = [];
  @Input() buildingType: any;
  rc_total: string;
  @Input() addonPriceChange: any;
  private addonPriceChangeDialog = new Subject<any>();
  addonPriceChangeDialog$ = this.addonPriceChangeDialog.asObservable();

  constructor(private modalService: NgbModal,
    public dataService: DataService) { }

    ngOnInit(): void {
      this.getContentFromKentico();
      this.addonPriceChange.subscribe(adPrCh=> {
        this.rc_total = adPrCh.rc_total;
        this.addonPriceChangeDialog.next(adPrCh.rc_total);
        this.contentItem.step_info.forEach(element => {
          let addonPriceFilter = this.addonsInfo.step_insurance_info.policy_configuration.addons.responsabilita_civile_1.addons_list.value.filter((item) => item.warrenty_code.value === element.warrenty_code);
          if (addonPriceFilter !== undefined) {
              element.price = addonPriceFilter[0].price;
          }
        });
      }
      );
      this.rc_total = this.addonsInfo.additionalData.rc_total;
  }

  private getContentFromKentico() {
    const content = this.getContent(this.addonsInfo);
    this.contentItem = content;
     this.contentItem.step_info.sort((x,y) => {
        return x.warrenty_code.localeCompare(y.warrenty_code);
    });
  }

  getContent(kenticoItem: any){
    const structure = {
      step_info: this.getAddonStructure(kenticoItem)
    }
    return structure;
  }

  getAddonStructure(kenticoItem: any){
    const addon = [];
    kenticoItem.step_insurance_info.policy_configuration.addons.responsabilita_civile_1.addons_list.value.map(addons => {
      const addonStructure = {
        warrenty_code: addons.warrenty_code?.value,
        visible: addons.visible,
        arrow_icon: addons.arrow_icon?.value[0]?.url,
        icon: addons.icon?.value[0]?.url,
        price: addons.price,
        title: addons.title.value,
        year: addons.year.value,
        maximals: {
          min: addons.available_maximals ? addons.available_maximals.min : null,
          max: addons.available_maximals ? addons.available_maximals.max : null,
          recommended: addons.available_maximals ? addons.available_maximals.recommended : null,
          step: addons.available_maximals ? addons.available_maximals.step : null,
        },
        code_warranty: addons.code_warranty.value,
        selected: addons.selected,
        modal: addons.modal_addon.value ? addons.modal_addon.value.map(modalAdd => {
          return {
            add_button: modalAdd.add_button.value,
            subtitle: modalAdd.subtitle.value,
            close_icon: modalAdd.close_icon.value[0].url,
            icon_closed: modalAdd.icon_closed.value[0].url,
            icon_opened: modalAdd.icon_opened.value[0].url,
            description: modalAdd.description.value,
            fee: modalAdd.fee.value,
            icon: modalAdd.icon.value[0].url,
            price: modalAdd.price.value,
            read_less: modalAdd.read_less.value,
            read_more: modalAdd.read_more.value,
            remove_button: modalAdd.remove_button.value,
            text: modalAdd.text.value,
            title: modalAdd.title.value,
            year: modalAdd.year.value,
            warrenties: modalAdd.warrenties.value,
            additional_warrenty: modalAdd.additional_warrenty.value.map( warrenty => {
              return {
                id: warrenty.id.value,
                icon: warrenty.icon.value[0].url,
                text: warrenty.text.value,
                selected: warrenty.selected,
                code_warranty: warrenty.code_warranty.value,
                modal_add_warrenty: warrenty.modal_add_warrenty.value.map( modal =>{
                  return{
                    modal_icon: modal.icon.value[0].url,
                    modal_description: modal.description.value
                  }
                })
              }
            })
          }
        }) : null

      }
     addon.unshift(addonStructure);
    })
    return addon;

  }

  openModal(warrentyCode){
      this.modalRef = this.modalService.open(ContainerComponent, {size: 'sm', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', backdrop: 'static'});
      this.modalRef.componentInstance.type = 'ModalAddonsYMultirisk';
      this.modalRef.componentInstance.componentInputData = {
        kenticoItem: this.contentItem,
        warrentyCode: warrentyCode,
        lineItemId: this.product.lineItemId,
        addonSelected: this.quote,
        addonPriceChangeDialog: this.addonPriceChangeDialog,
        initialPrice: this.rc_total
      }
      if(warrentyCode === 'rc_proprieta' || warrentyCode === 'rc_prestatori_bb'
          || warrentyCode === 'rc_prestatori' || warrentyCode === 'rc_attivita_bb'
          || warrentyCode === 'rc_attivita') {
        this.dataService.getModalMaximalAddon().pipe(skip(1)).subscribe(maximalData => {
          this.addSingleAddon(maximalData.contentTitle, false, maximalData.formMaximalValue, true);
        });
      }
    }

  focusOn() : void{
    this.add = true;
  }

  addAddon(operation: string) {
    this.quotes = [];

    let addons = this.contentItem.step_info.filter(addon => addon.visible === true);
    addons.forEach(addon => {
      let m = 0;
      if(addon.maximals.recommended !== undefined && addon.maximals.recommended > 0){
        m = addon.maximals.recommended;
      }else{
        m = addon.maximals.min;
      }
      this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addon.code_warranty, maximal: m}, type: "rc"});
    });

    this.removeAddAddons(operation);

    this.quote.emit(this.quotes);
  }

  addSingleAddon(warrenty_code: string, selected: boolean, maximal: any,  isFromModalMaximal: boolean = false) {
    this.quotes = [];
    let operation = selected ? 'remove' : 'add';
    let addon = this.contentItem.step_info.find(addon => addon.warrenty_code === warrenty_code);
    if(!isFromModalMaximal) {
    this.changeSelectedStatus(operation, addon);
    }

    let m = 0;
    if(maximal !== undefined && maximal > 0){
      m = maximal;
    }else{
      m = addon.maximals.min;
    }
    this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addon.code_warranty, maximal: m}, type: "rc"})
    if(addon.modal[0] && !isFromModalMaximal){
      addon.modal[0].additional_warrenty.forEach(warrenty => {
        this.changeSelectedStatus(operation, addon);
        let m = 0;
        if(maximal !== undefined && maximal > 0){
          m = maximal;
        }else{
          m = warrenty.maximals.min;
        }
        this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: warrenty.code_warranty, maximal: m}, type: "rc"})
      });
    }
    this.quote.emit(this.quotes);
  }

  changeSelectedStatus(operation: string, addon: any) {
    if(operation === 'add' && addon.selected === false) {
      addon.selected = !addon.selected
    } else if(operation === 'remove' && addon.selected === true) {
      addon.selected = !addon.selected
    }
  }

  contentItemSelected() {
    let notHiddenEl = this.contentItem.step_info.filter(addon => addon.visible !== false);
    this.dataService.setAddonTutela(notHiddenEl.some(add => add.selected));
    return notHiddenEl.every(add => add.selected);
  }

   removeAddAddons(operation: string) {
    this.contentItem.step_info.filter(addons => addons.visible !== false)
    .forEach((addon) => {
      if(operation === 'add') {
        addon.selected = true;
      } else if(operation === 'remove') {
        addon.selected = false;
      }
    });
  }
}
