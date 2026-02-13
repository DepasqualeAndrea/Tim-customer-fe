import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '@services';
import {ContainerComponent} from 'app/modules/tenants/component-loader/containers/container.component';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-quotator-rc-scooter-bike',
    templateUrl: './quotator-rc-scooter-bike.component.html',
    styleUrls: ['./quotator-rc-scooter-bike.component.scss'],
    standalone: false
})
export class QuotatorRcScooterBikeComponent extends PreventivatoreAbstractComponent implements OnInit {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();

  constructor(
    ref: ChangeDetectorRef,
    public dataService: DataService,
    private modalService: NgbModal,
  ) {
    super(ref);
  }

  ngOnInit() {
    this.dataService.setDataScooterBike(this.product);
  }

  getVariantId(product: any, sku: string) {
    return product.variants.find((variant) => variant.sku === sku).id;
  }

  getVariantPrice(sku: string) {
    return this.product.variants.find((variant) => variant.sku === sku).price.toFixed(2).toString().split('.')[0];
  }

  getVariantPriceDecimal(sku: string) {
    const price = this.product.variants.find((variant) => variant.sku === sku).price.toFixed(2).toString().split('.')[1];
    if (price === '00') {
      return undefined;
    } else {
      return price;
    }
  }

  openDetail(modal) {
    const modalRef = this.modalService.open(ContainerComponent, {
      size: 'lg',
      backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
      windowClass: 'modal-window',
    });
    (<ContainerComponent>modalRef.componentInstance).type = 'ModalRcMonopattinoBiciCoverages';
    (<ContainerComponent>modalRef.componentInstance).componentInputData = {
      content: modal,
      product: this.product
    };
  }

  createOrderObj(sku: string) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.getVariantId(this.product, sku),
            quantity: 1
          }
        }
      }
    };
  }

  checkout(sku: string) {
    const order = this.createOrderObj(sku);
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product',
      payload: {
        product: this.product,
        order: order,
        router: 'checkout'
      }
    };
    this.sendActionEvent(action);
  }

}
