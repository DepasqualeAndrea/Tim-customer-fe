import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { PreventivatoreDynamicSharedFunctions } from '../../services/content/preventivatore-dynamic-shared-functions';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-products-slider-customers',
  templateUrl: './products-slider-customers.component.html',
  styleUrls: ['./products-slider-customers.component.scss']
})
export class ProductsSliderCustomersComponent extends PreventivatoreAbstractComponent implements OnInit {
  
  @ViewChild('sliderProducts') sliderProducts: SlickCarouselComponent;
  slideConfig: any;
  activeSlider = 1;
  activeProductSlider = 0

  constructor(
    private ngbModal: NgbModal,
    ref: ChangeDetectorRef
  ) {
    super(ref)
  }

  get numberOfProducts() {
    return this.data.product_cards.length || 0
  }

  ngOnInit() {
    this.data.enabled ? this.setSliderConfig() : null;
    
  }

  swipeleftProduct() {
    this['sliderProducts'].slickNext()
  }

  swiperightProduct() {
    this['sliderProducts'].slickPrev()
  }

  isCurrentSlide(slideIndex: number): boolean {
    return slideIndex === this.activeSlider
  }

  selectSlide(slideIndex: number): void {
    this.activeSlider = slideIndex + 1
    const newPosition = slideIndex * 100
    this['slider'].nativeElement.setAttribute('style', `left: -${newPosition}%`)
  }

  isCurrentProductSlide(index: number): boolean {
    return index === this.activeProductSlider
  }

  selectProductSlide(index) {
    this.activeProductSlider = index
    this['sliderProducts'].slickGoTo(index)
  }

  productCardChanged(slickEvent) {
    this.activeProductSlider = slickEvent.nextSlide
  }

  private getMaxSlides(defaultSlides: number): number {
    return this.numberOfProducts < defaultSlides ? this.numberOfProducts : defaultSlides
  }

  openInfoModal(modal) {
    const infoModal = this.ngbModal.open(ContainerComponent, {centered: true, size: 'lg'})
    infoModal.componentInstance.type = 'ProductDetailInfoModal'
    infoModal.componentInstance.componentInputData = {
      content: modal
    }
  }

  private setSliderConfig() {
    this.slideConfig = {
      slidesToShow: this.getMaxSlides(3.75),
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
            slidesToShow: this.getMaxSlides(3.75),
          }
        },
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: this.getMaxSlides(3.75),
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
            touchThreshold: 100,
            touchMove: true,
            speed: 0
          }
        }
      ]
    }
  }

  public isEmpty(content: string): boolean {
    return PreventivatoreDynamicSharedFunctions.isEmptyText(content);
  }

}
