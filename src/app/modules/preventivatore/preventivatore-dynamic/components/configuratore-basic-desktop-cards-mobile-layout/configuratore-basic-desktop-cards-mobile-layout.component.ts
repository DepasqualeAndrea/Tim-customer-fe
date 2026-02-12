import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '@services';

@Component({
  selector: 'app-configuratore-basic-desktop-cards-mobile-layout',
  templateUrl: './configuratore-basic-desktop-cards-mobile-layout.component.html',
  styleUrls: ['./configuratore-basic-desktop-cards-mobile-layout.component.scss']
})
export class ConfiguratoreBasicDesktopCardsMobileLayoutComponent {

  @Input() products: any;
  @Output() actionEvent = new EventEmitter<any>();

  constructor(public dataService: DataService) { }

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

}
