import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configurator-only-quotator-layout',
  templateUrl: './configurator-only-quotator-layout.component.html',
  styleUrls: ['./configurator-only-quotator-layout.component.scss']
})
export class ConfiguratorOnlyQuotatorLayoutComponent  {
 @Input() products: any;
  @Input() activeProduct = null;
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
