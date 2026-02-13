import { Component, Input } from '@angular/core';
import { Product, CrumbLink } from '@model';

@Component({
    selector: 'app-products-breadcrumb',
    templateUrl: './products-breadcrumb.component.html',
    styleUrls: ['./products-breadcrumb.component.scss'],
    standalone: false
})
export class ProductsBreadcrumbComponent {

  @Input() product: Product;
  @Input() crumbs: Array<CrumbLink>;

  getProductName() {
    return this.product.properties[0].name === 'contingency' ? this.product.name : this.product.properties[0].value;
  }

}
