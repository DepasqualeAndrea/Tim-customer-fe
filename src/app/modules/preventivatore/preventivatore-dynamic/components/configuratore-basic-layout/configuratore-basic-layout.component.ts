import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { NgbTabsetConfig, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';

@Component({
  selector: 'app-configuratore-basic-layout',
  templateUrl: './configuratore-basic-layout.component.html',
  styleUrls: ['./configuratore-basic-layout.component.scss']
})
export class ConfiguratoreBasicLayoutComponent implements OnInit, AfterViewInit {

  @Input() products: any;
  @Input() activeProduct = null;
  @Output() actionEvent = new EventEmitter<any>();
  @Output() selectedPrice = new EventEmitter<number>();

  @ViewChild('tabs')
  private tabs: NgbTabset;
  isDifferent: boolean = false;
  tabSetNames: string[] = [];
  productTitle: string;
  showTopProductTitle = false;
  quotatorValues: any;

  constructor(config: NgbTabsetConfig,
    public dataService: DataService,
    public componentFeaturesService: ComponentFeaturesService
    ) {
      config.justify = 'justified';
    }

  ngOnInit() {
    this.getTabSetContent();
    this.getProductTitle();
    this.orderTab();
  }

  orderTab(){
    this.componentFeaturesService.useComponent('quotator-select-package');
    this.componentFeaturesService.useRule('order-tab');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.products.sort((el1, el2) => {
        return el1.id >= el2.id ? 1 : -1}
      );
    }
  }

  ngAfterViewInit() {
    this.dataService.getPreventivatoreProduct().subscribe(productCode => {
      if (this.dataService.tenantInfo.tenant === 'banca-sella_db') {
        this.products.find(product => {
          if (product.product_code === productCode) {
            this.tabs.select('tab-' + productCode);
            this.selectedProduct(product);
          }
        });
      }
    });
  }

  sendPrice(price: number) {
    this.selectedPrice.emit(price);
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  selectedProduct(product: any) {
    const action = {
      action: 'selected_product',
      payload: {
        product: product
      }
    };
    this.actionEvent.next(action);
  }

  getTabSetContent() {
    this.componentFeaturesService.useComponent('quotator-select-package');
    this.componentFeaturesService.useRule('tab-name-different');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints();
      if (constraints.size !== 0) {
        constraints.forEach((value, key) => {
          this.products.find(product => {
            if (product.product_code === key) {
              this.isDifferent = true;
              this.tabSetNames.push(value);
            }
          });
        });
      }
    }
  }

  setProductTab(direction, products: any) {
    const orderedTabsIds = products.map(product => 'nav-link-' + product.product_code);
    switch (direction) {
      case 'right': document.getElementById(orderedTabsIds[0]).click();
        break;
      case 'left': document.getElementById(orderedTabsIds[1]).click();
        break;
      default: break;
    }
  }

  getQuotatorHeader(): boolean {
    this.componentFeaturesService.useComponent('quotator-header');
    this.componentFeaturesService.useRule('show-header');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      return constraints.includes(this.products[0].product_code);
    }
    return false;
  }
  getProductTitle() {
    this.componentFeaturesService.useComponent('quotator-select-package');
    this.componentFeaturesService.useRule('package-name');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints();
      if (constraints.size !== 0) {
        constraints.forEach((value, key) => {
          if (this.products[0].product_code === key) {
            this.productTitle = value;
            if(key === 'tim-for-ski-gold' || key === 'tim-for-ski-platinum' || key === 'tim-for-ski-silver'){
              this.showTopProductTitle = true;
            }
          }
        });
      }
    }
  }
  
  setQuotatorValues(quotatorValues: {[formControlName: string]: any}) {
    this.quotatorValues = quotatorValues;
  }
}
