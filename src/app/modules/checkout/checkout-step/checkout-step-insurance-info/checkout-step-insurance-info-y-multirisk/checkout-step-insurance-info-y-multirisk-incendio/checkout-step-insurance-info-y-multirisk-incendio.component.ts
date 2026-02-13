import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '@services';
import {ContainerComponent} from 'app/modules/tenants/component-loader/containers/container.component';
import {Subject} from 'rxjs';
import { skip, take } from 'rxjs/operators';
import {CheckoutStepInsuranceInfoProduct} from '../../checkout-step-insurance-info.model';
@Component({
    selector: 'app-checkout-step-insurance-info-y-multirisk-incendio',
    templateUrl: './checkout-step-insurance-info-y-multirisk-incendio.component.html',
    styleUrls: ['./checkout-step-insurance-info-y-multirisk-incendio.component.scss'],
    standalone: false
})

export class CheckoutStepInsuranceInfoYMultiriskIncendioComponent implements OnInit {

  body: any;
  add: boolean = false;
  remove: boolean = true;
  contentItem: any;
  @Input() addonsInfo: any;
  @Input() buildingType: any;
  @Input() product: CheckoutStepInsuranceInfoProduct;
  @Output() quote = new EventEmitter<any>();
  quoteSelected : {operation: string, addon: {id: string, maximal: number}, type: string}
  quotes : any[] = [];
  @Input() addonPriceChange: any;
  fire_total: string;
  modalRef: any
  private addonPriceChangeDialog = new Subject<any>();
  addonPriceChangeDialog$ = this.addonPriceChangeDialog.asObservable();

  constructor(private modalService: NgbModal,
    public dataService: DataService) { }

    ngOnInit(): void {
      this.getContentFromKentico();
      this.addonPriceChange.subscribe(adPrCh=> {
        this.fire_total = adPrCh.fire_total;
        this.addonPriceChangeDialog.next(adPrCh.fire_total);
        this.contentItem.step_info.forEach(element => {
          let addonPriceFilter = this.addonsInfo.step_insurance_info.policy_configuration.addons.incendio.addons_list.value.filter((item) => item.warrenty_code.value === element.warrenty_code);
          if (addonPriceFilter !== undefined) {
              element.price = addonPriceFilter[0].price;
          }
        });
      }
      );
      this.fire_total = this.addonsInfo.additionalData.fire_total;
  }

  private getContentFromKentico() {
    const content = this.getContent(this.addonsInfo);
    this.contentItem = content;
    this.contentItem.step_info.sort((x,y) => {
      if(x.warrenty_code === 'building' && y.warrenty_code === 'content') {
        return x.warrenty_code.localeCompare(y.warrenty_code);
      }
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
    kenticoItem.step_insurance_info.policy_configuration.addons.incendio.addons_list.value.map(addons => {
      const addonStructure = {
        warrenty_code: addons.warrenty_code?.value,
        arrow_icon: addons.arrow_icon?.value[0]?.url,
        icon: addons.icon.value[0].url,
        price: addons.price,
        visible: addons.visible,
        title: addons.title.value,
        year: addons.year.value,
        maximals: {
          min: addons.available_maximals ? addons.available_maximals.min : null,
          max: addons.available_maximals ? addons.available_maximals.max : null,
          recommended: addons.available_maximals ? addons.available_maximals.recommended : null,
          step: addons.available_maximals ? addons.available_maximals.step : null,
        },
        code_warranty: addons.code_warranty.value,
        selected: addons.selected ? addons.selected : false,
        modal: addons.modal_addon.value ? addons.modal_addon.value.map(modalAdd => {
          return {
            add_button: modalAdd.add_button.value,
            subtitle: modalAdd.subtitle.value,
            close_icon: modalAdd.close_icon.value[0].url,
            icon_closed: modalAdd.icon_closed.value[0].url,
            icon_opened: modalAdd.icon_opened.value[0].url,
            description: modalAdd.description.value,
            set_informativo_commerce: modalAdd.set_informativo_commerce.value,
            set_informativo_craft: modalAdd.set_informativo_craft.value,
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

  openModal(warrentyCode) {
    this.modalRef = this.modalService.open(ContainerComponent, {size: 'sm', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', backdrop: 'static'});
    this.modalRef.componentInstance.type = 'ModalAddonsYMultirisk';
    this.modalRef.componentInstance.componentInputData = {
      kenticoItem: this.contentItem,
      warrentyCode: warrentyCode,
      lineItemId: this.product.lineItemId,
      addonSelected: this.quote,
      addonPriceChangeDialog: this.addonPriceChangeDialog,
      initialPrice: this.fire_total
    }
    this.dataService.getModalMaximalAddon().pipe(skip(1)).subscribe(maximalData => {
      this.addSingleAddon(maximalData.contentTitle, false, maximalData.formMaximalValue, true);
    });
  }

  focusOn() : void{
    this.add = true;
  }

  addAddon(operation: string){
    this.quotes = [];
    this.removeAddAddons(operation);
    if(this.buildingType === 'a'){
      let addons = this.contentItem.step_info.filter(addon => addon.warrenty_code !== 'building');
      addons.forEach(addon => {
        let m = 0;
        if(addon.maximals.recommended !== undefined && addon.maximals.recommended > 0){
          m = addon.maximals.recommended;
        }else{
          m = addon.maximals.min;
        }
        this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addon.code_warranty, maximal: m}, type: "fire"})
      });
      let addon = addons.find(addon => addon.warrenty_code)
      addon.modal[0].additional_warrenty.forEach(warrenty => {    
        let m = 0;
        if(addon.maximals.recommended !== undefined && addon.maximals.recommended > 0){
          m = addon.maximals.recommended;
        }else{
          m = addon.maximals.min;
        }    
        this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: warrenty.code_warranty, maximal: m}, type: "fire"})
      });
    }
    else{
      let addons = this.contentItem.step_info.filter(addon => addon.warrenty_code);
      addons.forEach(addon => {
        let m = 0;
        if(addon.maximals.recommended !== undefined && addon.maximals.recommended > 0){
          m = addon.maximals.recommended;
        }else{
          m = addon.maximals.min;
        }
        this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addon.code_warranty, maximal: m}, type: "fire"})
        addon.modal[0].additional_warrenty.forEach(warrenty => {
          this.changeSelectedStatus(operation, warrenty);
          this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: warrenty.code_warranty, maximal: m}, type: "fire"})
        });
      });
    }
    this.quote.emit(this.quotes);
  }

  addSingleAddon(warrenty_code: string, selected: boolean, maximal: any, isFromModalMaximal: boolean = false) {
    this.quotes = [];
    let operation = selected ? 'remove' : 'add';
    let addon = this.contentItem.step_info.find(addon => addon.warrenty_code === warrenty_code);
    if(!isFromModalMaximal) {
    this.changeSelectedStatus(operation, addon);
    }

    let m = 0;
    if(maximal !== undefined && maximal > 0){
      m = maximal;
    }else if(addon.maximals.recommended !== undefined && addon.maximals.recommended > 0){
      m = addon.maximals.recommended;
    }else{
      m = addon.maximals.min;
    }
    this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addon.code_warranty, maximal: m}, type: "fire"})
    if(addon.modal[0] && !isFromModalMaximal){
      addon.modal[0].additional_warrenty.forEach(warrenty => {
        this.changeSelectedStatus(operation, warrenty);
        this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: warrenty.code_warranty, maximal: m}, type: "fire"})
      });
    }
    this.quote.emit(this.quotes);
  }

  changeSelectedStatus(operation: string, addon: any){
    if(operation === 'add' && addon.selected === false){
      addon.selected = !addon.selected
    }else if(operation === 'remove' && addon.selected === true){
      addon.selected = !addon.selected
    }
  }

  contentItemSelected() {
    let notHiddenEl = this.contentItem.step_info.filter(addon => addon.visible !== false);
    this.dataService.setAddonIncendio(notHiddenEl.some(add => add.selected));
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
