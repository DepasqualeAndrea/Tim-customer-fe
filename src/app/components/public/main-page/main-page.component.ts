import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductsList } from '@model';
import { AuthService, DataService, InsurancesService } from '@services';
import { CookieService } from 'app/core/services/cookie.service';
import { ConsistencyResponse, ProductConsistencyService } from 'app/core/services/product-consistency.service';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { SlickSliderConfigSettings } from 'app/shared/slick-slider-config.model';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { forkJoin, Observable, of, Subscription, timer } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

type Price = { unit: string; cent: string; afterPrice: string }

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  @ViewChild('slider') slider: ElementRef;
  @ViewChild('sliderProducts')
  sliderProducts: SlickCarouselComponent;

  activeProductSlider: number = 0;

  timerSubscription: Subscription;

  slideConfig: SlickSliderConfigSettings;

  numberOfSliders: number;
  activeSlider = 1;
  productsSliderPosition = 0;

  content: any;
  allProductSlides: any[];
  allOfferingSlides: any[];

  constructor(
    private router: Router,
    private kenticoTranslateService: KenticoTranslateService,
    private nypInsuranceService: NypInsurancesService,
    private route: ActivatedRoute,
    private timMyBrokerCustomersService: TimMyBrokerCustomersService,
    private consistencyService: ProductConsistencyService,
    private auth: AuthService,
    private cookieService: CookieService,
    public dataService: DataService,
  ) { }

  get numberOfProducts() {
    return this.content['productSlides'].length
  }

  get numberOfOfferings() {
    return this.content['offeringSlides'].length
  }

  ngOnInit() {
    this.consistencyService.getProductsConsistencyMapping()
    this.redirectNewCustomersSso()
    this.nypInsuranceService.getProducts().subscribe(res =>
      this.redirectIfThereIsOnlyHomageProduct(res)
    )
    this.loadContent()
    if (this.consistencyService.isUserLoggedInWithSso && !this.cookieService.getCookie('privacy-modal')) {
      this.auth.loadPrivacyModal();
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private setUpOfferingSlidesTimer(): void {
    this.timerSubscription = timer(8000, 8000).subscribe(() => {
      if (this.activeSlider < this.numberOfSliders) {
        this.swiperight()
      } else {
        this.selectSlide(0);
      }
    })
  }


  public setPause(pause: boolean): void {
    if (pause) {
      this.timerSubscription.unsubscribe();
    } else {
      this.setUpOfferingSlidesTimer();
    }
  }

  private redirectNewCustomersSso() {
    const queryParams = this.route.snapshot.queryParams
    if (!!queryParams['thirdPartJwt']) {
      this.timMyBrokerCustomersService.redirectToNewSsoAuth('main-page', queryParams['thirdPartJwt']);
    }
  }

  private redirectIfThereIsOnlyHomageProduct(data: ProductsList): void {
    if (data['products'].length === 1 &&
      data['products'][0].product_code === 'ehealth-quixa-homage') {
      this.router.navigate(['/preventivatore', { code: 'ehealth-quixa-homage' }])
    }
  }

  private loadContent() {

    const products$ = this.nypInsuranceService.getProducts().pipe(map(res => res.products))
    const kentico$ = this.kenticoTranslateService.getItem<any>('main_page').pipe(take(1))
    let consistencies$: Observable<ConsistencyResponse | null>
    if (this.consistencyService.isUserLoggedInWithSso) {
      consistencies$ = this.consistencyService.consistency().pipe(take(1))
    } else {
      consistencies$ = of(null)
    }

    forkJoin([kentico$, products$, consistencies$]).pipe(
      tap(([kenticoItem, products, consistencies]) => {
        this.consistencyService.setNoConistencyProducts(products)

        if (!!consistencies) {
          this.consistencyService.saveConsistenciesResponse(consistencies)
          products = this.consistencyService.filterProductsBasedOnConsistency(products)
        }
        products = this.consistencyService.filterProductsBasedOnUserType(products)

        this.allProductSlides = this.getProductsSlides(kenticoItem['product_cards'].value, products)
        this.allOfferingSlides = this.getOfferingSlides(kenticoItem['offering_slides'].value, products)

        this.allOfferingSlides.forEach(el => {
          if (el.code === 'tim-my-home') {

            let new_element = '<span class="full-warranty">' + el.warranty_description + '</span>'

            el.description_home = el.description_home.replace("{{placeholder}}", new_element)

          }
        })

        this.content = {
          offeringSlides: this.allOfferingSlides,
          enabled: kenticoItem['enabled'].value.length ? kenticoItem['enabled'].value.some(value => value.codename === 'on') : false,
          productsTitle: kenticoItem['products_title'].value,
          productSlides: this.allProductSlides,
          whoImage: kenticoItem['who_image'].value[0].url,
          whoTitle: kenticoItem['who_title'].value,
          whoDescription: kenticoItem['who_description'].value,
          whoCta: kenticoItem['who_cta'].value,
          whoCtaLink: kenticoItem['who_cta_link'].value,
          whatTitle: kenticoItem['what_title'].value,
          whatCards: this.getWhatToKnowCards(kenticoItem['what_cards'].value),
          preFooterDescription: kenticoItem['pre_footer_description'].value,
          preFooterButtonLabel: kenticoItem['button_label'].value,
          preFooterButtonLink: kenticoItem['button_link'].value
        }
        this.numberOfSliders = this.content['offeringSlides'].length
        this.filterProductsByQueryParam()
        this.setSliderConfig()
        this.setUpOfferingSlidesTimer()
      })
    ).subscribe()
  }

  private getOfferingSlides(offerings: any[], productsFromBE: Product[]): any[] {
    let filteredOfferings = offerings.filter(kp =>
      productsFromBE.some(bep => {
        return kp.code.value
          ? bep.product_code === kp.code.value
          : true
      })
    )
    return filteredOfferings.map(offering => {
      return {
        code: offering['code'].value,
        tag_up: offering['tag'].value,
        title: offering['title'].value,
        description: offering['offering_description'].value,
        description_home: offering['offering_description_home'].value,
        tag_activation: offering['tag_activation'].value,
        tag_where_to_activate: offering['tag_where_to_activate'].value,
        starting_from: offering['starting_from'].value,
        price: this.splitProductPrice(offering['price'].value),
        price_description: offering['price_description'].value,
        callToAction: offering['cta'].value,
        callToActionLink: offering['cta_link'].value,
        img: offering['image'].value[0].url,
        img_offer: offering['image_offer'].value[0].url,
        warranty_description: offering['warranty_description_ftth'].value
      }
    })
  }

  private getProductsSlides(productsFromKentico: any[], productsFromBE: Product[]): any[] {
    let filteredProds = productsFromKentico.filter(kp => productsFromBE.some(bep => bep.product_code === kp.code.value))
    return filteredProds.map(offering => {
      return {
        code: offering['code'].value,
        title: offering['title'].value,
        description: offering['description'].value,
        callToAction: offering['cta'].value,
        callToActionLink: offering['cta_link'].value,
        img: offering['image'].value[0].url,
        tag: offering['filter_tag'].value[0].name,
      }
    })
  }

  private splitProductPrice(offeringPriceValue: string): Price {
    if (!!offeringPriceValue) {
      const separatedPrice = offeringPriceValue.replace(/\s/g, '').split(',')
      const cents = separatedPrice[1].split('€')
      return {
        unit: separatedPrice[0],
        cent: ',' + cents[0],
        afterPrice: ' €' + cents[1]
      }
    }
  }

  private getWhatToKnowCards(cards: any[]): any[] {
    return cards.map(card => {
      return {
        title: card['title'].value,
        description: card['text'].value,
        collapsed: true
      }
    })
  }

  public swipeleft(): void {
    if (this.activeSlider > 1) {
      this.activeSlider--;
      const newPosition = (this.activeSlider - 1) * 100;
      this['slider'].nativeElement.setAttribute('style', `left: -${newPosition}%`);
    }
  }

  public swiperight(): void {
    if (this.activeSlider < this.numberOfSliders) {
      const newPosition = this.activeSlider * 100;
      this['slider'].nativeElement.setAttribute('style', `left: -${newPosition}%`);
      this.activeSlider++;
    }
  }

  public isCurrentSlide(slideIndex: number): boolean {
    return slideIndex === this.activeSlider
  }

  public selectSlide(slideIndex: number): void {
    this.activeSlider = slideIndex + 1
    const newPosition = slideIndex * 100
    this['slider'].nativeElement.setAttribute('style', `left: -${newPosition}%`)
  }

  private toggleProductsByTag(tag: string): void {
    this.content['productSlides'] = this.allProductSlides.filter(product =>
      product.tag === tag
    )
  }

  private filterProductsByQueryParam() {
    const filterParam = this.route['snapshot'].queryParams['category']
    if (!!filterParam) {
      this.toggleProductsByTag(filterParam)
    }
  }

  private getMaxSlides(defaultSlides: number): number {
    return this.numberOfProducts < defaultSlides ? this.numberOfProducts : defaultSlides
  }

  private setSliderConfig() {
    this.slideConfig = {
      slidesToShow: this.getMaxSlides(2.75),
      swipeToSlide: true,
      prevArrow: false,
      nextArrow: false,
      dots: false,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1700,
          settings: {
            slidesToShow: this.getMaxSlides(2.75),
          }
        },
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: this.getMaxSlides(2.75),
          }
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: this.getMaxSlides(1.5),
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: this.getMaxSlides(1),
            swipeToSlide: false,
            touchThreshold: 100,
            touchMove: true,
            speed: 0
          }
        }
      ]
    }
  }

  public swipeleftProduct(): void {
    this['sliderProducts'].slickNext();
  }

  public swiperightProduct(): void {
    this['sliderProducts'].slickPrev();
  }

  public isCurrentProductSlide(index: number): boolean {
    return index === this.activeProductSlider;
  }

  public selectProductSlide(index) {
    this.activeProductSlider = index;
    this['sliderProducts'].slickGoTo(index);
  }

  productCardChanged(slickEvent) {
    this.activeProductSlider = slickEvent.nextSlide;
  }

  goToPreventivatore(link: string): void {
    this.router.navigate([link]);
  }

  toggleCollapse(accordion) {
    accordion.collapsed = !accordion.collapsed
  }
}
