import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '@model';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';

export const PREVENTIVATORE_HEADER_PLACEHOLDER = 'PREVENTIVATORE_HEADER_PLACEHOLDER';

@Component({
    selector: 'app-preventivatore-header',
    templateUrl: './preventivatore-header.component.html',
    styleUrls: ['./preventivatore-header.component.scss'],
    standalone: false
})
export class PreventivatoreHeaderComponent implements OnInit, OnChanges {

  @Input() product: Product;
  @ViewChild('headerContainer', { static: true }) headerContainer: ContainerComponent;
  placeholderDefined: boolean;


  constructor(
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.product) {
      this.headerContainer.componentInputData = {'product': changes.product.currentValue};
      this.placeholderDefined = this.headerContainer.loadComponent(PREVENTIVATORE_HEADER_PLACEHOLDER);
    }
  }

  ngOnInit() {}
}
