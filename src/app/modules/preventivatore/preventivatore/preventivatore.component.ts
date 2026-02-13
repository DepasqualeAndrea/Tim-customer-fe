import {ComponentFeaturesService} from 'app/core/services/componentFeatures.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, CheckoutService, DataService, InsurancesService, ProductsService, UserService} from '@services';
import {ActivatedRoute, Router} from '@angular/router';
import {UntypedFormBuilder} from '@angular/forms';
import {NgbCalendar, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';
import {KenticoTranslateService} from '../../kentico/data-layer/kentico-translate.service';
import {PreventivatorePage} from '../services/preventivatore-page.interface';


export const PREVENTIVATORE_URL_KEY = 'preventivatore_url_key';

@Component({
    selector: 'app-preventivatore',
    templateUrl: './preventivatore.component.html',
    styleUrls: ['../preventivatoreY.component.scss'],
    standalone: false
})
export class PreventivatoreComponent implements OnInit, OnDestroy, PreventivatorePage {

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
  code: string;
  productCodes: string[];
  private readonly CB_PRODUCTS_WITH_RIGHT_ALIGN = ['ge-home', 'ge-motor'];

  constructor(
    public dataService: DataService,
    public router: Router,
    public userService: UserService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public formBuilder: UntypedFormBuilder,
    public calendar: NgbCalendar,
    public toastr: ToastrService,
    public insuranceService: InsurancesService,
    public checkoutService: CheckoutService,
    public productsService: ProductsService,
    public kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService,
    public modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
  }

  initializePreventivatore() {
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

  getBackgroundImg() {
    return {'background-image': 'url(' + this.products[0].product_structure.product_header.image + ')'};
  }

  getBackgroundDivClass(): string[] {
    return [this.dataService.tenantInfo.main.layout + '-bg-img', this.products[0].product_code + '-bg-img', this.dataService.tenantInfo.tenant + '-bg-img'];
  }

  getHeaderClass(): any {
    if (this.dataService.tenantInfo.header.layout !== 'cb') {
      return ['mx-auto'];
    }
    if (this.dataService.tenantInfo.tenant === 'santa-lucia_db') {
      return ['col-sm-12 col-md-12 col-lg-7'];
    }

    const productCode = this.products[0].product_code;
    return this.CB_PRODUCTS_WITH_RIGHT_ALIGN.includes(productCode) ?
      ['px-md-2', 'offset-md-6', 'pr-md-2', 'cb-header-no-quotator'] :
      ['px-md-2', 'mx-auto'];
  }

}
