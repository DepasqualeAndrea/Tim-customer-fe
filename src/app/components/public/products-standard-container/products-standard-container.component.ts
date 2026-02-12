import { Component } from '@angular/core';

@Component({
    selector: 'products-standard-container',
    styleUrls: [],
    template: '<app-container [type]="productsStandard"></app-container>'
})
export class ProductsStandardContainerComponent {
   productsStandard = 'products-standard-container' 
}
