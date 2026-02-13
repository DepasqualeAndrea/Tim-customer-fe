import {ProductsService} from './../../../../../core/services/products.service';
import {ComponentFeaturesService} from './../../../../../core/services/componentFeatures.service';
import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';
import {Product} from '@model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-products-carousel',
    templateUrl: './products-carousel.component.html',
    styleUrls: ['./products-carousel.component.scss'],
    standalone: false
})
export class ProductsCarouselComponent extends PreventivatoreAbstractComponent implements OnInit {

  slideConfig;
  sliderHidden: boolean;

  constructor(
    private router: Router,
    private componentFeaturesService: ComponentFeaturesService,
    private productsService: ProductsService,
    ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    super(ref);
    this.slideConfig = {
      'slidesToShow': 6,
      'slidesToScroll': 6,
      'prevArrow': false,
      'nextArrow': false,
      'dots': true,
      'infinite': true,
      'autoplay': true,
      'responsive': [
        {
          'breakpoint': 1024,
          'settings': {
            'slidesToShow': 3,
            'slidesToScroll': 3
          }
        },
        {
          'breakpoint': 768,
          'settings': {
            'slidesToShow': 2,
            'slidesToScroll': 2
          }
        }
      ],
      'autoplaySpeed': 2500
    };
    this.sliderHidden = this.route.snapshot.queryParams.embedded === 'true';
  }

  ngOnInit() {
  }

  goToPreventivatore(products) {
    const productsArray = [].concat(products);
    const externalUrl = productsArray[0].external_url;
    if (externalUrl) {
      window.location.href = productsArray[0].external_url;
      return;
    }
    this.componentFeaturesService.useComponent('product-landing');
    this.componentFeaturesService.useRule('products');
    const constraints: Map<string, any> = this.componentFeaturesService.getConstraints();
    const product_landing: String[] = constraints.get('activated') || [];
    const landingProducts: Product[] = (productsArray as Product[]).filter(p => product_landing.includes(p.product_code));
    if (!!landingProducts && landingProducts.length > 0) {
      this.router.navigate(this.productsService.createPreventivatoreLandingProductRoute(productsArray));
    } else {
      this.router.navigate(this.productsService.createPreventivatoreRoute(productsArray));
    }
  }

}
