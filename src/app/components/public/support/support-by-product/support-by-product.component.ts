import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-support-by-product',
    template: '<app-container [type]="supportByProduct"></app-container>',
    styleUrls: [],
    standalone: false
})
export class SupportByProductComponent  {
  supportByProduct = 'assistenza-detail';
}
