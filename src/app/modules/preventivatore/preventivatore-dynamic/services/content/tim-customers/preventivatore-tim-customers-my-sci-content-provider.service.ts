import { Injectable } from '@angular/core';
import {PreventivatoreContentProvider} from '../preventivatore-content-provider.interface';
import {DataService} from '@services';
import {KenticoTranslateService} from '../../../../../kentico/data-layer/kentico-translate.service';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {PreventivatoreDynamicSharedFunctions} from '../preventivatore-dynamic-shared-functions';
import {Product} from '@model';
import {ContentInterface} from '../content-interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreTimCustomersMySciContentProviderService implements PreventivatoreContentProvider {

  constructor(private dataService: DataService,
              private kenticoTranslateService: KenticoTranslateService,
  ) {
  }



  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_tim_mysci').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }


  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      hero: {
        title: kenticoItem.title.value,
        description: kenticoItem.product_description.value,
        button_text: kenticoItem.cta.value,
        button_link: kenticoItem.hero_cta_link.value,
        img: kenticoItem.product_img.value[0].url,
        tag_activation: kenticoItem.tag_activation.value,
        tag_where_to_activate: kenticoItem.tag_where_to_activate.value,
        tag_product_type: kenticoItem.tag_product_type.value,
        tag_product_name: kenticoItem.tag_product_name.value,
        monthly_payment: kenticoItem.monthly_payment.value,
        partner_collaboration_text: kenticoItem.partner_collaboration_text.value,
        partner_collaboration_image: kenticoItem.partner_collaboration_image.value[0].url
      },
      product_details_section: {
        image: kenticoItem.detail_section_image.value[0].url,
        title: kenticoItem.detail_section_title.value,
        pdf_image: kenticoItem.pdf_image.value[0].url,
        pdf_document: PreventivatoreDynamicSharedFunctions.isEmptyText(kenticoItem.pdf_document.value) ? false : kenticoItem.pdf_document.value,
        pdf_document_2: PreventivatoreDynamicSharedFunctions.isEmptyText(kenticoItem.pdf_document_2.value) ? false : kenticoItem.pdf_document_2.value,
        button: kenticoItem.details_section_button.value,
        button_link: kenticoItem.details_section_button_link.value,
        details: this.getDetails(kenticoItem.details_list.value),
        labelled_icon: this.getLabelledIcon(kenticoItem.labelled_icon.value[0])
      },
      product_slider_section: {
        enabled: kenticoItem['enabled'].value.length ? kenticoItem['enabled'].value.some(value => value.codename === 'on') : false,
        title: kenticoItem.product_carousel_title.value,
        description: kenticoItem.product_carousel_description.value,
        carousel_style: kenticoItem.carousel_style.value[0].codename,
        product_cards: this.getProductSliderCards(kenticoItem.product_cards.value)
      },
      accordions_section: {
        accordions: this.getWhatToKnowCards(kenticoItem.accordion_list.value)
      },
      prefooter_section: {
        preFooterDescription: kenticoItem.prefooter.value[0].description.value,
        preFooterButtonLink: kenticoItem.prefooter.value[0].button_link.value,
        preFooterButtonLabel: kenticoItem.prefooter.value[0].button_label.value
      }
    };
    return structure;

  }

  private getProductSliderCards(products: any[]) {
    return products.map(product => {
      return {
        code: product.code.value,
        title: product.title.value,
        description: product.description.value,
        img: product.image.value[0].url,
        promo_tags: this.getPromoTag(product.promo_tags.value[0]),
        pre_price: product.pre_price.value,
        post_price: product.post_price.value,
        modal: this.getModal(product.modal.value[0])
      };
    });

  }

  private getWhatToKnowCards(cards: any[]): any[] {
    return cards.map(card => {
      return {
        title: card['title'].value,
        description: card['text'].value,
        collapsed: true
      };
    });
  }

  private hasContent(content: any[]) {
    return !!content.length
  }

  private getDetails(details: any[]) {
    return details.map(detail => {
      return {
        title: detail['title'].value,
        description: detail['description'].value,
        link: detail['link'].value,
        promo_tags: this.hasContent(detail['promo_tags'].value)
          ? this.getPromoTag(detail['promo_tags'].value[0])
          : null,
        modal: this.hasContent(detail['modal'].value)
          ? this.getModal(detail['modal'].value[0])
          : null
      };
    });
  }

  private getPromoTag(tag) {
    if (!!tag) {
      return {
        text: tag['text'].value,
        color: tag['color'].value[0].codename
      };
    }
    return null;
  }

  private getLabelledIcon(labelledIcon) {
    if (!!labelledIcon) {
      return {
        icon: labelledIcon['icon'].value[0].url,
        text: labelledIcon['text'].value
      };
    }
  }

  private getModal(modal) {
    if (!!modal) {
      return {
        title: modal['title'].value,
        description: modal['description'].value,
        button: modal['button'].value,
        background: modal.background
      };
    }
    return null;
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setContentToProduct(contentFromInsuranceService: any, hero: any) {
    const product = contentFromInsuranceService.find(product => product.product_code === 'tim-my-sci');
    const obj = {
      product: product,
      title: hero.title,
      description: hero.description,
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

      obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.hero));
      obj.container_2 = Object.assign({}, contentFromKentico.product_details_section, contentFromInsuranceService);
      obj.container_3 = Object.assign({}, contentFromKentico.product_slider_section);
      obj.container_4 = Object.assign({}, contentFromKentico.accordions_section);
      obj.container_5 = Object.assign({}, contentFromKentico.prefooter_section);
      return of(obj);
    }));
  }
}
