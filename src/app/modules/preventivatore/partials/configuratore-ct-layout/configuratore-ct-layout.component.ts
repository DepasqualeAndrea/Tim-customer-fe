import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-configuratore-ct-layout',
  templateUrl: './configuratore-ct-layout.component.html',
  styleUrls: ['./configuratore-ct-layout.component.scss']
})
export class ConfiguratoreCtLayoutComponent implements OnInit {
  activeProduct = 1;
  @Input() products: any;

  constructor() {
  }

  ngOnInit() {
    this.products.sort((a, b) => a.product_code.indexOf('gold'));
  }

}
