import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-configuratore-big-quotator-layout',
    templateUrl: './configuratore-big-quotator-layout.component.html',
    styleUrls: ['./configuratore-big-quotator-layout.component.scss'],
    standalone: false
})
export class ConfiguratoreBigQuotatorLayoutComponent {

  @Input() products: any;
  @Input() activeProduct = null;
  @Input() kenticoItems: any;
  @Output() actionEvent = new EventEmitter<any>();

  constructor(config: NgbTabsetConfig) {
    config.justify = 'justified';
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }
  selectedProduct(product: any) {
    const action = {
      action: 'selected_product'
      , payload: {
        product: product
      }
    };
    this.actionEvent.next(action);
  }

  setProductTab(direction, products: any) {
    const orderedTabsIds = products.map(product =>
      'nav-link-' + product.product_code
    );
    switch (direction) {
      case 'right': document.getElementById(orderedTabsIds[0]).click();
      break;
      case 'left': document.getElementById(orderedTabsIds[1]).click();
      break;
      default: break;
    }
  }
}
