import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Team } from 'app/modules/kentico/models/ilteam.model';
import { KenticoYoloService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselComponent } from 'ngx-slick-carousel';





@Component({
    selector: 'app-theteam',
    templateUrl: './theteam.component.html',
    styleUrls: ['./theteam.component.scss'],
    standalone: false
})
export class TheteamComponent implements OnInit, OnDestroy {

  @ViewChild('imgCarousel') imgCarousel: SlickCarouselComponent;
  @ViewChild('txtCarousel') txtCarousel: SlickCarouselComponent;

 /*  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    pauseOnDotsHover: false,
  }; */

  backgrounds: any;
  kenticoModel: Team;
  /* staffImp: any[]; */
  staffnorm: any[];
  model: {
    images_header: any,
    title: string,
    subtitle: string,
    images_body: any,
    staff: any,
  };
  modelFinal: any;

  constructor(private kenticoYoloService: KenticoYoloService, config: NgbCarouselConfig) {
                config.showNavigationArrows = false;
                config.showNavigationIndicators = false;
                }

  ngOnInit() {
    this.kenticoYoloService.getItem<Team>('staff').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
      this.modelFinal = this.model.staff.value.map((a, index) => Object.defineProperty(a, 'position', { value: index }));
     /*  this.staffImp = this.model.staff.value.filter(a => a.important.value.length > 0); */
      this.staffnorm = this.model.staff.value/* .filter(a => a.important.value.length === 0) */;
    });
  }

  transformKenticoModel(item: Team): { images_header: any, title: string, subtitle: string, images_body: any, staff: any } {
    return {
      images_body: item.images_body.value,
      images_header: item.images_header.value,
      title: RichTextHtmlHelper.computeHtml(item.title),
      subtitle: item.subtitle.value,
      staff: item.staff,
    };
  }

 /*  goToCarousel(position: number) {
    this.imgCarousel.slickGoTo(position);
    this.txtCarousel.slickGoTo(position);
  }
 */

  ngOnDestroy() {
  }

/*   beforeChange(e) {
    this.txtCarousel.slickGoTo(e.nextSlide);
    this.imgCarousel.slickGoTo(e.nextSlide);
  } */

}
