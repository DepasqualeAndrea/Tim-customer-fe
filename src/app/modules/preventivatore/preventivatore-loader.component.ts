import { Component, ComponentFactory, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PreventivatoreProductMapperService } from './services/preventivatore-product-mapper.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService, InsurancesService } from '@services';
import { GtmHandlerService } from '../../core/services/gtm/gtm-handler.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PREVENTIVATORE_URL_KEY } from './preventivatore/preventivatore.component';
import { Product } from '@model';
import { map } from 'rxjs/operators';
import { PreventivatorePage } from './services/preventivatore-page.interface';
import { RouterService } from '../../core/services/router.service';
import { YoloDataLayerEventObjGeneratorService } from '../tenants/y/yolo-data-layer-event-obj-generator.service';
import { gtm_settings } from 'app/core/models/gtm/gtm-settings.model';
import { ModalService } from '../../core/services/modal.service';
import { PreventivatoreOverrideService } from './preventivatore-override.service';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    template: '<ng-container #view></ng-container>',
    selector: 'app-preventivatore-loader',
    standalone: false
})
export class PreventivatoreLoaderComponent implements OnInit, OnDestroy, PreventivatorePage {

  @ViewChild('view', { read: ViewContainerRef, static: true }) view;
  productCodes: string[];
  products: Product[];

  constructor(
    private preventivatoreProductMapperService: PreventivatoreProductMapperService,
    public route: ActivatedRoute,
    public router: Router,
    public dataService: DataService,
    public insuranceService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    private gtmHandlerService: GtmHandlerService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService,
    private routerService: RouterService,
    public modalService: ModalService,
    private preventivatoreOverrideService: PreventivatoreOverrideService
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params: Params) => {
      if (params.id) {
        this.initializeParamsFromIds(params.id.split('-'));
      } else if (params.alias) {
        this.initializeParamsFromAliases(params.alias.split('_'));
      } else {
        this.initializeParamsFromCodes(params.code.split(','));
      }
    });
    this.dataService.preventivatoreUrlObs$.subscribe(() => {
      localStorage.setItem(PREVENTIVATORE_URL_KEY, this.router.url);
    });
  }

  initializeParamsFromIds(productIds: Array<string>) {
    if (!!productIds && productIds.length === 1) {
      this.initializeParamsFromId(productIds[0]);
      return;
    }
    this.initializeParams(p => productIds.includes(p.id.toString()));
  }

  initializeParamsFromAliases(productAliases: Array<string>) {
    this.initializeParams(p => productAliases.includes((p.properties.find(a => a.name === 'alias') || { value: p.product_code }).value));
  }

  initializeParamsFromId(productId: string) {
    this.nypInsurancesService.getProduct(productId).subscribe((product: Product) => {
      const products: Product[] = [];
      products.push(product);
      this.initializeProducts(products);
    });
  }

  initializeParamsFromCodes(productCodes: Array<string>) {
    this.initializeParams(p => productCodes.includes(p.product_code));
  }

  initializeParams(filterFn: (products: Product) => boolean) {
    this.nypInsurancesService.getProducts()
      .pipe(map(productList => productList.products.filter(filterFn)))
      .subscribe((products: Product[]) => this.initializeProducts(products));
  }

  initializeProducts(products: Product[]) {
    this.products = products.sort((a, b) => a.product_code.localeCompare(b.product_code));
    this.productCodes = this.products.map<string>(p => p.product_code);
    if (this.productCodes.length === 0 || !this.canLoadPreventivatore(this.productCodes[0])) {
      this.routerService.navigateBaseUrl();
      return;
    }
    // TEMP this should get obsolete with the placeholder system
    this.dataService.setTenantProductInfo(this.extractProductTemplate());
    // Handle GTM per product
    this.handleGTM(products);
    this.initializePreventivatore();
  }

  private canLoadPreventivatore(productCode: string): boolean {
    if (!productCode) {
      return false;
    }
    const factory: ComponentFactory<PreventivatorePage> = this.preventivatoreProductMapperService.getPreventivatoreFactory(productCode);
    return !!factory;
  }

  initializePreventivatore() {
    // Load right component (preventivatore) and set variables
    const firstCode: string = this.productCodes[0];
    this.preventivatoreOverrideService.overridePreventivatoreRegistration(firstCode)
    const factory: ComponentFactory<PreventivatorePage> = this.preventivatoreProductMapperService.getPreventivatoreFactory(firstCode);
    this.view.clear();
    const componentRef: ComponentRef<PreventivatorePage> = this.view.createComponent(factory);
    componentRef.instance.products = this.products;
    componentRef.instance.productCodes = this.productCodes;
    componentRef.instance.initializePreventivatore();
    // Open promo modal if exists
    const url = this.router.url.split('?')[0].split('/').pop();
    this.products.some((product) => {
      if (product.properties.includes((product.properties.find(p => p.name === 'path_modal_init' && p.value === url)))) {
        this.modalService.openModal('modal_sci_promo', 'PromoModalSci');
        return true;
      }
    });
  }

  handleGTM(products: Product[]) {
    gtm_settings.type === 'GA4' ? this.handleGA4(products) : this.handleUA(products);
  }

  private handleGA4(products: Product[]) {
    this.gtmHandlerService.multiPush(
      this.gtmEventGeneratorService.updateDataLayerBaseEvent(products[0]),
      this.gtmEventGeneratorService.resetEcommerce(),
      this.gtmEventGeneratorService.fillProductDetailViewEvent(products)
    );
  }

  private handleUA(products: Product[]) {
    this.gtmHandlerService.requireTenant('yolo-it-it');
    products.forEach(product => {
      this.gtmHandlerService.setPageInfoIntoDataLayer();
      this.gtmHandlerService.getModelHandler().overwrite(
        {
          productName: product.name,
          productId: product.id
        });
      this.gtmHandlerService.push();
    });
  }

  private extractProductTemplate(): any {
    const tenantProducts = this.dataService.tenantInfo.products;
    const currentProduct = this.products.find(product => tenantProducts[product.product_code] || tenantProducts[product.id]);
    return tenantProducts[currentProduct.product_code] || tenantProducts[currentProduct.id];
  }

  ngOnDestroy(): void {
  }

}
