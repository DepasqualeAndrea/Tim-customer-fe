import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from "@services";
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoProduct } from '../../checkout-step-insurance-info.model';

@Component({
  selector: 'app-checkout-step-insurance-info-y-multirisk-tutela-legale',
  templateUrl: './checkout-step-insurance-info-y-multirisk-tutela-legale.component.html',
  styleUrls: ['./checkout-step-insurance-info-y-multirisk-tutela-legale.component.scss']
})
export class CheckoutStepInsuranceInfoYMultiriskTutelaLegaleComponent implements OnInit {

  body: any;
  add: boolean = false;
  remove: boolean = true;
  selected: boolean =false;
  contentItem: any;
  modalRef: any
  @Input() addonsInfo: any;
  @Input() product: CheckoutStepInsuranceInfoProduct;
  @Output() quote = new EventEmitter<any>();
  quoteSelected : {operation: string, addon: {id: string, maximal: number}}
  quotes : any[] = [];
  @Input() employeesNumber: any;
  legal_total: string;
  @Input() addonPriceChange: any;
  private addonPriceChangeDialog = new Subject<any>();
  addonPriceChangeDialog$ = this.addonPriceChangeDialog.asObservable();
  @Input() addonChange: any;

  constructor(public dataService: DataService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getContentFromKentico();
    this.addonPriceChange.subscribe(adPrCh=> {
      this.legal_total = adPrCh.legal_total;
      this.addonPriceChangeDialog.next(adPrCh.legal_total);
    }
    );
    this.legal_total = this.addonsInfo.additionalData.legal_total;
    
    this.addonChange.subscribe(addCh=>{
      this.dataService.getAddonTutela().pipe(take(1)).subscribe(addonsRCSelected => {                
        if(!addonsRCSelected){
          if(this.addonsInfo?.step_insurance_info.policy_configuration.addons.tutela_legale_1.selected){
            this.addAddon('remove', this.addonsInfo?.step_insurance_info.policy_configuration.addons.tutela_legale_1.code_warranty.value);
          }          
        }
      })
    });
  }


  isSelected() {
    this.selected = true;
  }

  private getContentFromKentico() {
    const content = this.getContent(this.addonsInfo);
    this.contentItem = content;
  }

  getContent(kenticoItem: any){
    const structure = {
      step_info: this.getAddonStructure(kenticoItem)
    }
    return structure;
  }

  getAddonStructure(kenticoItem: any){
    const addon = [];
    kenticoItem.step_insurance_info.policy_configuration.addons.tutela_legale_1.addons_list.value.map(addons => {
      const addonStructure = {
        warrenty_code: addons.warrenty_code?.value,
        arrow_icon: addons.arrow_icon?.value[0]?.url,
        icon: addons.icon.value[0].url,
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
        selected: addons.selected ? addons.selected : null,
        modal: addons.modal_addon.value ? addons.modal_addon.value.map(modalAdd => {
          return {
            add_button: modalAdd.add_button.value,
            subtitle: modalAdd.subtitle.value,
            close_icon: modalAdd.close_icon.value[0].url,
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

  addAddon(operation: string, code_warrenty: string){
    this.dataService.getAddonTutela().pipe(take(1)).subscribe(selected => {
      this.quotes = [];
      if(selected){
        this.selected = !this.selected;
        this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: code_warrenty, maximal: this.addonsInfo?.step_insurance_info.policy_configuration.addons.tutela_legale_1.available_maximals.min}});
        this.quote.emit(this.quotes);
      }else{
        this.selected = false;
        this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: code_warrenty, maximal: this.addonsInfo?.step_insurance_info.policy_configuration.addons.tutela_legale_1.available_maximals.min}});
        this.quote.emit(this.quotes);
        this.openModalAbbinamento();
      }
    });
  }


   openModalAbbinamento(){
    this.modalRef = this.modalService.open(ContainerComponent, {size: 'sm', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', backdrop: 'static'});
    this.modalRef.componentInstance.type = 'ModalAbbinamentoYMultirisk';
  }




}
