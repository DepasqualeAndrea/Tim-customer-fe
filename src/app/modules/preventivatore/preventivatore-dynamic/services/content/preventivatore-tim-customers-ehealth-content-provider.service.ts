import { Injectable } from '@angular/core';
import { Product } from '@model';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { ContentInterface } from './content-interface';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreTimCustomersEhealthContentProviderService implements PreventivatoreContentProvider {

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_ehealth_homage').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      hero: {
        title: kenticoItem.title.value,
        subtitle: kenticoItem.subtitle.value,
        button_text: kenticoItem.cta.value,
        button_link: kenticoItem.hero_cta_link.value,
        img: kenticoItem.product_img.value[0].url,
        tag_activation: kenticoItem.tag_activation.value,
        tag_where_to_activate: kenticoItem.tag_where_to_activate.value,
        tag_product_type: kenticoItem.tag_product_type.value,
        tag_product_name: kenticoItem.tag_product_name.value,
        price_canceled: kenticoItem.price_canceled && kenticoItem.price_canceled.value || null,
        monthly_payment: kenticoItem.monthly_payment.value,
        partner_collaboration_text: kenticoItem.partner_collaboration_text.value,
        partner_collaboration_image: kenticoItem.partner_collaboration_image.value[0].url
      },
      how_works: {
        title: kenticoItem.how_works_title.value,
        bg_img: kenticoItem.how_works_bg_img.value[0].url,
        list: kenticoItem.how_works_list.value.map(item => {return {title: item.title.value, description: item.description.value}}),
        cta_text: kenticoItem.how_works_cta.value,
        cta_link: kenticoItem.how_works_cta_link.value,
        set_info_image: kenticoItem.set_info_image.value[0].url,
        set_info_text: kenticoItem.set_info_text.value
      },
      what_to_know: {
        title: kenticoItem.what_to_know_title.value,
        list: kenticoItem.what_to_know_list.value.map(item => {return {title: item.title.value, description: item.description.value}})
      }
    };
    return structure;
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setContentToProduct(contentFromInsuranceService: any, hero: any) {
    const product = contentFromInsuranceService.find(product => product.product_code === 'ehealth-quixa-homage')
    const obj = {
      product: product,
      title: hero.title,
      subtitle: hero.subtitle,
      button_text: hero.button_text,
      button_link: hero.button_link,
      img: hero.img,
      tag_activation: hero.tag_activation,
      tag_where_to_activate: hero.tag_where_to_activate,
      tag_product_type: hero.tag_product_type,
      tag_product_name: hero.tag_product_name,
      price_canceled: hero.price_canceled,
      monthly_payment: hero.monthly_payment,
      partner_collaboration_text: hero.partner_collaboration_text,
      partner_collaboration_image: hero.partner_collaboration_image
    };
    return obj;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};

      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));

      const setInfoLink = { setInfoLink: contentFromInsuranceService[0].information_package }

      obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.hero));
      obj.container_2 = Object.assign({}, setInfoLink, contentFromKentico.how_works);
      obj.container_3 = Object.assign({}, contentFromKentico.what_to_know);
      return of(obj);
    }));
  }
}
