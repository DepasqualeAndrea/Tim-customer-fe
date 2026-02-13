import { KenticoNetInsuranceService } from 'app/core/services/kentico/kentico-net-insurance.service';
import { Image } from '../../kentico/models/architecture.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService, UserService, InsurancesService, CheckoutService, ProductsService } from '@services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PREVENTIVATORE_URL_KEY } from '../preventivatore/preventivatore.component';
import { Product } from '@model';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { PreventivatorePage } from '../services/preventivatore-page.interface';
import { gtm_settings } from 'app/core/models/gtm/gtm-settings.model';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-preventivatore-kentico',
    templateUrl: './preventivatore-kentico.component.html',
    styleUrls: ['./preventivatore-kentico.component.scss'],
    standalone: false
})
export class PreventivatoreKenticoComponent implements OnInit, OnDestroy {

  productName: string;
  nazioni = [];
  includedSection = false;
  position: string;
  public policy: any;
  public cardsNumber: Array<number>;
  public utm_source_prev: string;
  public telemarketer: number;

  products: any = [];
  publicproducts: any = [];
  background_image;
  code: string;
  infoProd: string = null;

  constructor(
    public dataService: DataService,
    public router: Router,
    public userService: UserService,
    public route: ActivatedRoute,
    public formBuilder: UntypedFormBuilder,
    public calendar: NgbCalendar,
    public toastr: ToastrService,
    public insuranceService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    public checkoutService: CheckoutService,
    public productsService: ProductsService,
    private gtmHandlerService: GtmHandlerService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService,
    public kenticoService: KenticoNetInsuranceService) {
  }


  ngOnInit() {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params: Params) => {
      if (params.id) {
        this.initializeParamsFromIds(params.id.split('-'));
      } else {
        // CODE
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
  initializeParamsFromId(productId: string) {
    this.nypInsurancesService.getProduct(productId)
      .subscribe((product: Product) => {
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
    // TEMP this should get obsolete with the placeholder system
    this.dataService.setTenantProductInfo(this.extractProductTemplate());
    this.code = products[0].product_code.toLowerCase().replace('-', '_');
    this.infoProd = products[0].information_package;
    this.initializeKenticoContents();
    // handle GTM per product
    this.handleGTM(products);
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

  getSmallImage(images) {
    if (images.length) {
      let imgs = _.find(images, ['image_type', 'fp_image']);
      if (!imgs) {
        imgs = _.find(images, ['image_type', 'default']) ? _.find(images, ['image_type', 'default']) : _.find(images, ['image_type', 'common_image']);
      }
      return imgs.original_url;
    } else {
      return '';
    }
  }

  initializeKenticoContents() {
    this.kenticoService.setContentsOf(`${this.code}_preventivatore`);
    this.setBackgroundImg();
  }

  setBackgroundImg() {
    this.kenticoService.getItem<Image>(`${this.code}_background_image`).pipe(untilDestroyed(this)).subscribe(item => {
      const url = item.image.value[0].url;
      this.background_image = { 'background-image': 'url(' + url + ')' };
    });
  }

  getBackgroundDivClass(): string[] {
    return [this.dataService.tenantInfo.main.layout + '-bg-img', this.products[0].product_code + '-bg-img', this.dataService.tenantInfo.tenant + '-bg-img'];
  }

}
