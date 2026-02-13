import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { ModalService } from 'app/core/services/modal.service';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { Subject } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoProduct } from '../../checkout-step-insurance-info.model';

@Component({
    selector: 'app-checkout-step-insurance-info-y-multirisk-furto-rapina',
    templateUrl: './checkout-step-insurance-info-y-multirisk-furto-rapina.component.html',
    styleUrls: ['./checkout-step-insurance-info-y-multirisk-furto-rapina.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoYMultiriskFurtoRapinaComponent implements OnInit, AfterViewInit {

  form: UntypedFormGroup;
  public isCollapsed = true;
  selected = false;
  contentKentico: any;
  modalRef: any;
  recommended: number;
  @Input() addonsInfo: any;
  @Input() product: CheckoutStepInsuranceInfoProduct;
  maximal: any;
  maximals: number[] = []
  @Output() quote = new EventEmitter<any>();
  quoteSelected : {operation: string, addon: {id: string, maximal: number}}
  quotes: any[];
  @Input() addonPriceChange: any;
  theft_total: string;
  private addonPriceChangeDialog = new Subject<any>();
  addonPriceChangeDialog$ = this.addonPriceChangeDialog.asObservable();
  isSelectedRapina: boolean = false;
  @Input() addonChange: any;

  constructor(
    public modalService: ModalService,
    private dataService: DataService,
    private modalServ: NgbModal) {
     }

  ngOnInit(): void {
    this.contentKentico = this.addonsInfo.step_insurance_info.policy_configuration.addons.furto_rapina;
    this.form = new UntypedFormGroup({
      maximal: new UntypedFormControl()
    });

    this.getMaximal();
    this.addonPriceChange.subscribe(adPrCh=> {
      this.theft_total = adPrCh.theft_total;
      this.addonPriceChangeDialog.next(adPrCh.theft_total);
    }
    );
    this.theft_total = this.addonsInfo.additionalData.theft_total;

    this.addonChange.subscribe(addCh=>{
      this.dataService.getAddonIncendio().pipe(take(1)).subscribe(addonsFireSelected => {
        let addon = this.contentKentico;
        if(!addonsFireSelected){
          if(addon.selected){
            this.addAddon('remove');
          }          
        }
      })
    });
  }

  ngAfterViewInit() {
    this.form.controls.maximal.setValue(this.maximals[0]);
  }

  getMaximal(){
    for(var i : number = this.contentKentico.addons_list.garanzie_aggiuntive.additional_warrenty.value[0].available_maximals.min; i <= this.contentKentico.addons_list.garanzie_aggiuntive.additional_warrenty.value[0].available_maximals.max; i+=this.contentKentico.addons_list.garanzie_aggiuntive.additional_warrenty.value[0].available_maximals.step){
      this.maximals.push(i);
    }
    this.recommended = this.contentKentico.addons_list.garanzie_aggiuntive.additional_warrenty.value[0].available_maximals.recommended;
  }

  openModal(){
    this.modalService.openModalCentered('checkout_yolo_multirischi', 'FurtoERapinaModal');
  }

  openModalAbbinamento(){
    this.modalRef = this.modalServ.open(ContainerComponent, {size: 'sm', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', backdrop: 'static'});
    this.modalRef.componentInstance.type = 'ModalAbbinamentoFurtoYMultirisk';
  }

  addAddon(operation: string){
    this.dataService.getAddonIncendio().pipe(take(1)).subscribe(selected => {
      let addon = this.contentKentico;
      this.quotes = [];
      if(selected) {
        this.selected = !this.selected;
        this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addon.code_warranty.value, maximal: this.form.controls.maximal.value}});
        if(operation === 'add' && addon.selected === false) {
          addon.selected = !addon.selected;
        } else if(operation === 'remove' && addon.selected === true) {
          addon.selected = !addon.selected;
          this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addon.addons_list.garanzie_aggiuntive.additional_warrenty.value[0].code_warranty.value, maximal: this.form.controls.maximal.value}});
        }
        this.quote.emit(this.quotes);
      } else {
        this.selected = false;
        this.quotes.push(this.quoteSelected = {operation: 'remove', addon: {id: addon.code_warranty.value, maximal: this.form.controls.maximal.value}});
        this.quotes.push(this.quoteSelected = {operation: 'remove', addon: {id: addon.addons_list.garanzie_aggiuntive.additional_warrenty.value[0].code_warranty.value, maximal: this.form.controls.maximal.value}});
        this.quote.emit(this.quotes);
        this.openModalAbbinamento();
      }
    });
  }

  addAdditionalWarrenty(operation: string) {
    this.quotes = [];
    let addon = this.contentKentico.addons_list.garanzie_aggiuntive.additional_warrenty.value;
    this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addon[0].code_warranty.value, maximal: this.form.controls.maximal.value}});
        if(operation === 'add' && addon[0].selected === false) {
          addon[0].selected = !addon[0].selected;
        } else if(operation === 'remove' && addon[0].selected === true) {
          addon[0].selected = !addon[0].selected;
        }
        this.quote.emit(this.quotes);
  }

   maximalChanged(operation: string) {
    this.quotes = [];
    let addon = this.contentKentico;
    let addonAdditionalWarranty = this.contentKentico.addons_list.garanzie_aggiuntive.additional_warrenty.value;
    if(this.selected) {
      this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addon.code_warranty.value, maximal: this.form.controls.maximal.value}});
      if(this.contentKentico.addons_list.garanzie_aggiuntive.additional_warrenty.value[0].selected) {
        this.quotes.push(this.quoteSelected = {operation: operation, addon: {id: addonAdditionalWarranty[0].code_warranty.value, maximal: this.form.controls.maximal.value}});
      }
    }
    this.quote.emit(this.quotes);
  }
}
