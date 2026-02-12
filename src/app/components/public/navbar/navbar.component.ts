import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '@services';
import {ComponentFeaturesService} from 'app/core/services/componentFeatures.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() secondaryNavbar: boolean;
  productCode = ['net-pet-gold', 'net-pet-silver', 'net-pet', 'yolo-for-pet'];
  sameColor: boolean;
  simpleFooter: boolean;
  headerLayout;
  headerHidden: boolean;

  constructor(
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.componentFeaturesService.useComponent('navbar');
    this.componentFeaturesService.useRule('same-color');
    this.sameColor = this.setSameColor(this.route.snapshot, this.dataService.product);
    this.headerLayout = this.dataService.tenantInfo.header.layout;
    this.headerHidden = this.route.snapshot.queryParams.embedded === 'true';
    this.simpleNavbar();
  }

  setSameColor(snapshotRoute, currentProduct) {
    if (!!snapshotRoute.params.code) {
      return this.productCode.includes(snapshotRoute.params.code);
    }
    if (currentProduct && snapshotRoute.routeConfig.path) {
      return (snapshotRoute.routeConfig.path.includes('checkout') && this.productCode.includes(currentProduct.product_code)) || (snapshotRoute.routeConfig.path.includes('private-area') && this.productCode.includes(currentProduct.product_code));
    }
    return this.componentFeaturesService.isRuleEnabled();
  }

  private simpleNavbar(): void {
    this.componentFeaturesService.useComponent('mobile-products-page');
    this.componentFeaturesService.useRule('simple-navbar');
    this.simpleFooter = this.componentFeaturesService.isRuleEnabled();
  }

}
