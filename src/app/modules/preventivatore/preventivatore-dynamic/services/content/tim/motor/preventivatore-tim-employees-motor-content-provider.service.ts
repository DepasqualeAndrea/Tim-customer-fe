import {EventEmitter, Injectable, Output} from '@angular/core';
import {KenticoTranslateService} from '../../../../../../kentico/data-layer/kentico-translate.service';
import {DataService} from '@services';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ContentInterface} from '../../content-interface';
import {PreventivatoreDynamicSharedFunctions} from '../../preventivatore-dynamic-shared-functions';
import {Product} from '@model';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreTimEmployeesMotorContentProviderService {
  @Output() actionEvent = new EventEmitter<any>();

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService,
  ) { }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_tim_motor').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      hero: {
        title: kenticoItem.title.value,
        subtitle: kenticoItem.subtitle.value,
        description: kenticoItem.product_description.value,
        button_text: kenticoItem.cta.value,
        img: kenticoItem.product_img.value[0].url,
        tag_activation: kenticoItem.tag_activation.value,
        tag_where_to_activate: kenticoItem.tag_where_to_activate.value,
        tag_product_type: kenticoItem.tag_product_type.value,
        tag_product_name: kenticoItem.tag_product_name.value,
        monthly_payment: kenticoItem.monthly_payment.value,
        call_specialist: kenticoItem.call_specialist.value,
        warranty_description: kenticoItem.warranty_description.value,
        partner_collaboration_text: kenticoItem.partner_collaboration_text.value,
        partner_collaboration_image: kenticoItem.partner_collaboration_image.value[0].url
      },
      product_details_section: {
        image: kenticoItem.detail_section_image.value[0].url,
        title: kenticoItem.detail_section_title.value,
        pdf_image: kenticoItem.pdf_image.value[0].url,
        pdf_document: PreventivatoreDynamicSharedFunctions.isEmptyText(kenticoItem.pdf_document.value) ? false : kenticoItem.pdf_document.value,
        pdf_document_2: PreventivatoreDynamicSharedFunctions.isEmptyText(kenticoItem.pdf_document_2.value) ? false : kenticoItem.pdf_document_2.value,
         button: kenticoItem.button.value,
         button_link: kenticoItem.button_link.value,
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
      what_to_know: {
        title: kenticoItem.what_to_know_title.value,
        list: kenticoItem.what_to_know_list.value.map(item => {
          return {
            title: item.title.value,
            description: item.description.value
          };
        })
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
        code: product.code ? product.code.value : null,
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
        text: tag['text'] ? tag['text'].value : null ,
        color: tag['color'] ? tag['color'].promo_tag_type.value[0].codename : null
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
    const product = contentFromInsuranceService.find(product => product.product_code === 'tim-motor');
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
      price: hero.price,
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
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_5 = Object.assign({}, contentFromKentico.prefooter_section);
      return of(obj);
    }));
  }
}
