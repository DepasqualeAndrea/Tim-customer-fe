import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-by-product',
  template: '<app-container [type]="supportByProduct"></app-container>',
  styleUrls: []
})
export class SupportByProductComponent  {
  supportByProduct = 'assistenza-detail';
}
