import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "@services";
import { ContainerComponent } from "app/modules/tenants/component-loader/containers/container.component";

@Component({
  selector: "app-modal-addons-y-multirisk",
  templateUrl: "./modal-addons-y-multirisk.component.html",
  styleUrls: ["./modal-addons-y-multirisk.component.scss"],
})
export class ModalAddonsYMultiriskComponent implements OnInit, AfterViewChecked {
  form: FormGroup;
  contentItem: any;
  @Input() kenticoItem: any;
  @Input() warrentyCode;
  @Input() lineItemId;
  maximal: any;
  maximals: number[] = [];
  recommended: number;
  quotes: any[] = [];
  @Output() addonSelected: EventEmitter<any> = new EventEmitter();
  @Input() addonPriceChangeDialog: any;
  total_price: any;
  @Input() initialPrice: any;
  hideModalButtonAddRemove: boolean;
  previousSelection: string;


  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public dataService: DataService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.total_price = this.initialPrice;
    this.contentItem = {
      content: this.kenticoItem.step_info,
    };

    this.form = new FormGroup({
      maximal: new FormControl(),
    });

    this.getMaximal();

    this.addonPriceChangeDialog.subscribe(total=> {
      this.total_price = total;
    }
    );
  }

  ngAfterViewInit() {
    if(this.previousSelection !== undefined && this.previousSelection !== ''){
      this.form.controls.maximal.setValue(this.previousSelection);
    }else{
      this.form.controls.maximal.setValue(this.maximals[0]);
    }
  }

  getMaximal() {
    this.contentItem.content.forEach(element => {
      if(element.warrenty_code === this.warrentyCode){
        for (var i: number = element.maximals.min; i <= element.maximals.max; i += element.maximals.step) {
          this.maximals.push(i);
        }
        this.recommended = element.maximals.recommended;
        this.previousSelection = element.maximals.previousSelection;
      }
    });

    /*
    if (this.contentItem.content[0].warrenty_code === this.warrentyCode) {
      for (
        var i: number = this.contentItem.content[0].maximals.min;
        i <= this.contentItem.content[0].maximals.max;
        i += this.contentItem.content[0].maximals.step
      ) {
        this.maximals.push(i);
      }
      this.recommended = this.contentItem.content[0].maximals.recommended;
    } else if (
      this.contentItem.content[1].warrenty_code === this.warrentyCode
    ) {
      for (
        var i: number = this.contentItem.content[1].maximals.min;
        i <= this.contentItem.content[1].maximals.max;
        i += this.contentItem.content[1].maximals.step
      ) {
        this.maximals.push(i);
      }
      this.recommended = this.contentItem.content[1].maximals.recommended;
    }
    */
  }

  openModalAdditionalWarrenty(id, content: []) {
    const modalRef = this.modalService.open(ContainerComponent, {
      size: "lg",
      backdropClass:
        "backdrop-class " + this.dataService.tenantInfo.main.layout,
      windowClass: "modal-window",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.type = "ModalAdditionalWarrentyYMultirisk";
    modalRef.componentInstance.componentInputData = {
      kenticoItem: content,
      id: id,
    };
  }
  ngAfterViewChecked(){
    this.ref.detectChanges();
  }

  addAddon(code_warranty: any, selected: boolean, contentTitle: string, recommended: any) {
    this.contentItem.content
      .find((content) => content.warrenty_code === contentTitle)
      .modal[0].additional_warrenty.find((warrenty) => {
        if (warrenty.code_warranty === code_warranty) {
          warrenty.selected = !warrenty.selected;
        }
      });
    if (selected === true) {
      let addon = [ { operation: "remove", addon: { id: code_warranty, maximal: this.form.controls.maximal.value } }];
      this.addonSelected.emit(addon);
    } else {
      let addon = [ { operation: "add", addon: { id: code_warranty, maximal: this.form.controls.maximal.value } }];
      this.addonSelected.emit(addon)
    }
  }

  contentItemSelected(contentTitle: any) {
    if(this.contentItem.content
      .find((content) => content.warrenty_code === contentTitle).modal[0].additional_warrenty.length > 0) {
        this.hideModalButtonAddRemove = false;
        return this.contentItem.content
        .find((content) => content.warrenty_code === contentTitle).modal[0].additional_warrenty
        .every(add => add.selected);
      } else {
        this.hideModalButtonAddRemove = true;
        return false;
      }
  }

  buttonAddRemove(contentTitle: any, operation: string) {
    let addonsAr: any[] = [];
    this.contentItem.content
    .find((content) => content.warrenty_code === contentTitle)
    .modal[0].additional_warrenty.forEach((warranty) => {
     if(operation === 'add') {
      warranty.selected = true;
      let addon = { operation: "add", addon: { id: warranty.code_warranty, maximal: this.form.controls.maximal.value } };   
      addonsAr.push(addon);   
      } else if(operation === 'remove') {
        warranty.selected = false;
        let addon = { operation: "remove", addon: { id: warranty.code_warranty, maximal: this.form.controls.maximal.value } };  
        addonsAr.push(addon);        
      }
    });

    this.addonSelected.emit(addonsAr);

    let objData = {
      contentTitle: contentTitle,
      formMaximalValue: this.form.controls.maximal.value
    }
    this.dataService.setModalMaximalAddon(objData);
  }

  maximalChanged(contentTitle: string) {
    let additionalWarrenty = this.contentItem.content.find((content) => content.warrenty_code === contentTitle).modal[0].additional_warrenty
                                                     .filter(el => el.selected === true);
    additionalWarrenty.forEach((warrenty) => {
        let addon = [ { operation: "add", addon: { id: warrenty.code_warranty, maximal: this.form.controls.maximal.value } }];
        this.addonSelected.emit(addon);
    });
      this.contentItem.content.find((content) => content.warrenty_code === contentTitle).maximals.previousSelection = this.form.controls.maximal.value;
      let objData = {
        contentTitle: contentTitle,
        formMaximalValue: this.form.controls.maximal.value
      }
      this.dataService.setModalMaximalAddon(objData);
    }
}
