import { Observable, of } from 'rxjs';
import { ContentInterface } from './content-interface';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { map, switchMap } from 'rxjs/operators';
import { Product } from 'app/core/models/insurance.model';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreYoloSportContentProviderService implements PreventivatoreContentProvider {
  private productCodes = ['chubb'];

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const howWorksForm = kenticoItem.quotator.value.find(item => item.system.codename === 'product_how_work_form');
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        ...(this.dataService.tenantInfo.tenant !== 'civibank_db' && {how: howWorksForm && howWorksForm.text.value}),
        choose_sport: kenticoItem.quotator.value.find(item => item.system.codename === 'choose_sport').text.value,//
        insured_age: kenticoItem.quotator.value.find(item => item.system.codename === 'insured_age').text.value,//
        variants_type_label: kenticoItem.quotator.value.find(item => item.system.codename === 'variants_type_label').text.value,//
        price: kenticoItem.quotator.value.find(item => item.system.codename === 'price').text.value,
        set_info_sport: kenticoItem.quotator.value.find(item => item.system.codename === 'set_info_sport').text.value,
        sport_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'sport_collaboration').text.value,
        provider_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'provider_chubb_logo').thumbnail.value[0].url,
        product_description: kenticoItem.quotator.value.find(item => item.system.codename === 'product_description').text.value,
        required_fields_sport: kenticoItem.quotator.value.find(item => item.system.codename === 'required_fields_sport').text.value,
        subtext: kenticoItem.quotator.value.find(item => item.system.codename === 'subtext').text.value,
        choose_sport_2: kenticoItem.quotator.value.find(item => item.system.codename === 'choose_sport_2').text.value,
        also_ensures: kenticoItem.quotator.value.find(item => item.system.codename === 'also_ensures').text.value,
        add: kenticoItem.quotator.value.find(item => item.system.codename === 'add').text.value,
        how_many_days: kenticoItem.quotator.value.find(item => item.system.codename === 'how_many_days').text.value,
        total: kenticoItem.quotator.value.find(item => item.system.codename === 'total').text.value,
        continue: kenticoItem.quotator.value.find(item => item.system.codename === 'continue').text.value,
        yolo_sport_offers_you: kenticoItem.quotator.value.find(item => item.system.codename === 'yolo_sport_offers_you').text.value,
        go_quote: kenticoItem.quotator.value.find(item => item.system.codename === 'go_quote').text.value
      },
      how_works: this.getHowWorksStructure(kenticoItem),
      //for_who: this.getWhoIsFor(kenticoItem),
      what_to_know: {
        title_section: kenticoItem.what_to_know_sport.value[0].title.value,
        slider_content: kenticoItem.what_to_know_sport.value[0].infocards.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        }),
        set_informativo_content: kenticoItem.what_to_know_sport.value[0].information_package.value
      },
      faq: {
        enabled: kenticoItem.common_questions.value[0].enabled.value.length
          ? kenticoItem.common_questions.value[0].enabled.value.some(value => value.codename === 'true')
          : false,
        title: kenticoItem.common_questions.value[0].title.value,
        faqs: this.getFaqStructure(kenticoItem.common_questions.value[0].faqs.value[0].linked_items),
        collapse_toggler_icons: {
          show: kenticoItem.common_questions.value[0].icon_closed.value[0]
            ? kenticoItem.common_questions.value[0].icon_closed.value[0].url
            : null,
          hide: kenticoItem.common_questions.value[0].icon_opened.value[0]
            ? kenticoItem.common_questions.value[0].icon_opened.value[0].url
            : null
        }
      },
      more_info: {
        title: kenticoItem.product_found.need_more_info.title.value,
        subtitle: kenticoItem.product_found.need_more_info.body.value,
        button_text: kenticoItem.product_found.value.find(item => item.system.codename === 'contacts_button_label').text.value
      },
    };
    return structure;
  }

  getHeaderStructure(kenticoItem: any) {
    const header = {
      image: kenticoItem.header.value[0].image.value[0]
        ? kenticoItem.header.value[0].image.value[0].url
        : null,
      alt: kenticoItem.header.value[0].image.value[0]
        ? kenticoItem.header.value[0].image.value[0].description
        : null,
      title: kenticoItem.header.value[0].title.value
        ? kenticoItem.header.value[0].title.value
        : null,
      description: kenticoItem.header.value[0].description_rich_text.value
        ? kenticoItem.header.value[0].description_rich_text.value
        : null,
      scroll: {
        how_works: kenticoItem.header.sport.scroll_to_how_works.value
          ? kenticoItem.header.sport.scroll_to_how_works.value
          : null
      }
    };
    return header;
  }


  getFaqStructure(kenticoItem: any) {
    let faqsFromKentico: any[] = kenticoItem.value.map(item => {
      return {
        question: item && item.question.value,
        answer: item && item.answer.value
      };
    });
    const fullLength = faqsFromKentico.length;
    if (fullLength > 0) {
      const halfLength = Math.ceil(fullLength / 2);
      const leftSideFaqs = faqsFromKentico.slice(0, halfLength);
      const rightSideFaqs = faqsFromKentico.slice(halfLength, fullLength);
      faqsFromKentico = [leftSideFaqs, rightSideFaqs];
    }
    return faqsFromKentico;
  }

  getHowWorksStructure(kenticoItem: any) {
    console.log(kenticoItem); 
    const howWorks = kenticoItem.how_works_sport;
    /*
    {
      //title_section: kenticoItem.how_works.value[0].title.value,
      //text_section: kenticoItem.how_works.value[0].text.value,
      how_works_yolo_sport_content_section: kenticoItem.how_works_sport.value[0], //?
      come_funziona_assicurazione_section: kenticoItem.how_works_sport.value[1], //?
    };
    */
    return howWorks;
  }

  /*getWhoIsFor(kenticoItem: any) {
    const whoIsFor = {
      title: kenticoItem.who_is_for.value[0].title.value,
      body: this.includeCollapseAttributes(kenticoItem),
      sanitize: true
    };
    return whoIsFor;
  }*/

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      const orderedContentFromInsuranceService = contentFromInsuranceService.sort((a, b) => b.product_code > a.product_code ? -1 : 1);
      obj.container_1 = Object.assign({}, this.setContentToProduct(orderedContentFromInsuranceService, contentFromKentico.header));
      obj.container_2 = Object.assign({}, contentFromKentico.how_works);
      //obj.container_3 = Object.assign({}, contentFromKentico.for_who);
      obj.container_3 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_4 = Object.assign({}, contentFromKentico.faq);
      obj.container_5 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      const selectedProduct = orderedContentFromInsuranceService.find(product => product.isSelected);
      if (selectedProduct) {
        obj.container_1.selected_slide_id = `tab-${selectedProduct.product_code}`;
      }
      obj.container_1.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_2.container_class = this.getTenantLayoutClass();
      //obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);      
      obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_4.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);


      return of(obj);
    }));
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_sport').pipe
      (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  private includeCollapseAttributes(kenticoItem: any) {
    const container = document.createElement('div');
    container.innerHTML = kenticoItem.who_is_for.value[0].text.value;
    return container.innerHTML;
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.description,
      bg_img: header.image,
      img_alt: header.alt,
      scroll: header.scroll
    };
    return obj;
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product.how = quotator.how;
      product.package_title = quotator.package_title;
      product.variants_type_label = quotator.variants_type_label;
      product.price = quotator.price;
      product.information_package_text = quotator.information_package_text;
      product.sport_collaboration = quotator.sport_collaboration;
      product.provider_logo = quotator.provider_logo;
      product.choose_sport = quotator.choose_sport;
      product.insured_age = quotator.insured_age;
      product.set_info_sport = quotator.set_info_sport;
      product.product_description = quotator.product_description;
      product.image = this.getSmallImage(product.images);
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = this.getTenantLayoutClass();
      product.isSelected = product.product_code === 'chubb-sport-rec';
      product.required_fields_sport = quotator.required_fields_sport;
      product.subtext = quotator.subtext;
      product.choose_sport_2 = quotator.choose_sport_2;
      product.also_ensures = quotator.also_ensures;
      product.add = quotator.add;
      product.how_many_days = quotator.how_many_days;
      product.total = quotator.total;
      product.continue = quotator.continue;
      product.yolo_sport_offers_you = quotator.yolo_sport_offers_you;
      product.go_quote = quotator.go_quote;
    });
    return obj.container_1.products;
  }

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }

  private getSmallImage(images) {
    if (!images.length) {
      return '';
    }
    let smallImage;
    smallImage = images.find((img) => img.image_type === 'fp_image');
    if (!!smallImage) {
      return smallImage.original_url;
    }
    smallImage = images.find((img) => img.image_type === 'default');
    if (!!smallImage) {
      return smallImage.original_url;
    }
    smallImage = images.find((img) => img.image_type === 'common_image');
    if (!!smallImage) {
      return smallImage.original_url;
    }
    return '';
  }

  
}
