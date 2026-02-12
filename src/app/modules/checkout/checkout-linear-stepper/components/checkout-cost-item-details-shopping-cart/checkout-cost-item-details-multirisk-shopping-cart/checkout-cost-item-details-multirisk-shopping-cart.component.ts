import { DataService } from './../../../../../../core/services/data.service';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import {CheckoutLinearStepperBaseComponent} from '../../checkout-linear-stepper-base/checkout-linear-stepper-base.component';
import {KenticoTranslateService} from '../../../../../kentico/data-layer/kentico-translate.service';
import { filter } from 'rxjs/operators';


type TaxCode = {
  ateco_id: number;
  company_name: string;
  product: string;
  product_code: string;
  taxcode_vat_number: string;
};
@Component({
  selector: 'app-checkout-cost-item-details-multirisk-shopping-cart',
  templateUrl: './checkout-cost-item-details-multirisk-shopping-cart.component.html',
  styleUrls: ['./checkout-cost-item-details-multirisk-shopping-cart.component.scss']
})
export class CheckoutCostItemDetailsMultiriskShoppingCartComponent extends CheckoutLinearStepperBaseComponent implements OnInit {

  public isCollapsed = true;
  taxcode: TaxCode;
  currentSubstep: string;

  constructor(
    public modalService: NgbModal,
    public dataService: DataService,
    ref: ChangeDetectorRef,
    private kenticoTranslateService: KenticoTranslateService
) {
    super(ref);
  }

  ngOnInit() {
   this.taxcode = this.dataService.getParams().ateco;
   this.getCurrentSubstep();
  }


  openModalShoppingCart() {
    let kenticoContent = {};
    const modalRef = this.modalService.open(ContainerComponent, {
      backdropClass:
        'backdrop-class ' + this.dataService.tenantInfo.main.layout,
      windowClass: 'modal-window',
      centered: true
    });
    this.kenticoTranslateService.getItem<any>('yolo_shopping_cart_modal').pipe().subscribe((item) => {
      kenticoContent = item;
      modalRef.componentInstance.type = 'ShoppingCartModal';
      modalRef.componentInstance.componentInputData = {'kenticoContent': kenticoContent, 'title': this.data?.name, 'codice': this.taxcode.product_code};
    });
  }

  modifyButton() {
    let objData = {
      path: 'insured_holders_data',
    }
    this.dataService.setRedirectShoppingCartMultirisk(objData);
  }

  getCurrentSubstep() {
    this.dataService.getRedirectShoppingCartMultirisk()
    .pipe(filter((substep) => substep !== ''))
    .subscribe((substep) => {
      this.currentSubstep = substep.path;
    });
  }

}
