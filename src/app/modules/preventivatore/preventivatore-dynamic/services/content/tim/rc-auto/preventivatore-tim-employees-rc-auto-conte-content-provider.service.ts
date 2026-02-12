import { Injectable } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ContentInterface } from '../../content-interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreTimEmployeesRcAutoConteContentProviderService {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_rc_auto_conte').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }
  
  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      hero: {
        title: kenticoItem.title.value,
        subtitle: kenticoItem.subtitle_hero.value,
        button_text: kenticoItem.cta.value,
        button_link: kenticoItem.hero_cta_link.value,
        img: kenticoItem.product_img.value[0].url,
      },
      how_works: {
        title: kenticoItem.how_works_title.value,
        bg_img: kenticoItem.how_works_bg_img.value[0].url,
        list: kenticoItem.how_works_list.value.map(item => {return {title: item.title.value, description: item.description.value}}),
        cta_text: kenticoItem.how_works_cta.value,
        cta_link: kenticoItem.how_works_cta_link.value
      },
      available_products_slider: {
        bg_img: kenticoItem.available_products_bg_img.value[0].url,
        bg_img_alt: kenticoItem.available_products_bg_img.value[0].description,
        title: kenticoItem.available_products_title.value,
        list: kenticoItem.available_products_list.value.map(item => {
          return {
            title: item.title.value,
            description: item.description.value,
            cta_text: item.cta_text.value,
            cta_link: item.cta_link.value
          };
        })
      },
      what_to_know: {
        title: kenticoItem.what_to_know_title.value,
        list: kenticoItem.what_to_know_list.value.map(item => {return {title: item.title.value, description: item.description.value}})
      }
    };
    return structure;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      obj.container_1 = Object.assign({}, contentFromKentico.hero);
      obj.container_2 = Object.assign({}, contentFromKentico.how_works);
      obj.container_3 = Object.assign({}, contentFromKentico.available_products_slider);
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
      return of(obj);
    }));
  }
}
