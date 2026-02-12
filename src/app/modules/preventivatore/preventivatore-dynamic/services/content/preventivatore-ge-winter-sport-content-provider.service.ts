import { Injectable } from '@angular/core';
import { Product } from '@model';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ContentInterface } from './content-interface';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: PreventivatoreModule
})
export class PreventivatoreGeWinterSportContentProviderService implements PreventivatoreContentProvider{

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService
  ) { }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_winter_sport___genertel').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        policy: kenticoItem.quotator.value.find(item => item.system.codename === 'policy_quotator').text.value,
        destination_question: kenticoItem.quotator.value.find(item => item.system.codename === 'ski_destination_question').text.value,
        age_selector_placeholder: kenticoItem.quotator.value.find(item => item.system.codename === 'age_selector_placeholder').text.value,
        addons_question: kenticoItem.quotator.value.find(item => item.system.codename === 'addons_question').text.value,
        coverage_duration: kenticoItem.quotator.value.find(item => item.system.codename === 'coverage_duration').text.value,
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'continue').text.value,
        total: kenticoItem.quotator.value.find(item => item.system.codename === 'total').text.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'information_package_text').text.value,
        partner_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'partner_title_logo').image.value[0].url,
        partner_text: kenticoItem.quotator.value.find(item => item.system.codename === 'partner_title_logo').body.value,
        arrow_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'button_with_image').image.value[0].url,
        arrow_text: kenticoItem.quotator.value.find(item => item.system.codename === 'button_with_image').body.value,
      },
      how_works: {
        title_section: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').title.value,
        product_content: this.getPolicyCoverages(kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').container),
        img_open: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').icon_open.value[0].url,
        img_close: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').icon_close.value[0].url,
        img_not_included: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').icon_not_included.value[0].url,
        img_optional: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').icon_optional.value[0].url,
        premium_protection_logo: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').premium_protection_logo.value[0].url,
        optional: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').optional.value,
        only_premium: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').only_premium.value,
        premium_protection: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_ge_ski').premium_protection.value,
      },
      what_to_know: {
        title_section: kenticoItem.what_to_know.value[0].title.value,
        text_section: kenticoItem.what_to_know.value[0].text.value,
        slider_content: kenticoItem.what_to_know.value[0].infocards.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        })
      },
      more_info: {
        title: kenticoItem.more_info.value.find(item => item.system.codename === 'more_info_title_winter_sport')
        ? kenticoItem.more_info.value.find(item => item.system.codename === 'more_info_title_winter_sport').text.value : kenticoItem.more_info.more_info_title.text.value,
        subtitle: kenticoItem.more_info.value.find(item => item.system.codename === 'more_info_text_winter_sport')
        ? kenticoItem.more_info.value.find(item => item.system.codename === 'more_info_text_winter_sport').text.value : kenticoItem.more_info.more_info_text.text.value,
      },
      faq: {
        enabled: kenticoItem.common_questions.value[0].enabled.value.length
        ? kenticoItem.common_questions.value[0].enabled.value.some(value => value.codename === 'true')
        : false,
        title: kenticoItem.common_questions.value[0].title.value,
        faqs: this.getFaqStructure(kenticoItem.common_questions.container_domande_ski_instant.faqs.value),
        collapse_toggler_icons: {
          show: kenticoItem.common_questions.value[0].icon_closed.value[0]
            ? kenticoItem.common_questions.value[0].icon_closed.value[0].url
            : null,
          hide: kenticoItem.common_questions.value[0].icon_opened.value[0]
            ? kenticoItem.common_questions.value[0].icon_opened.value[0].url
            : null
        }
      }
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
      description: kenticoItem.header.value[0].description.value
        ? kenticoItem.header.value[0].description.value
        : null
    };
    return header;
  }

  getPolicyCoverages(benefits: any) {
    const policyCoverages = [];
    benefits.value.map(benefit => {
      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename.endsWith('plus') ? 'winter-sport-plus' : 'winter-sport-premium',
        ribbon: benefit.campaign_info.value.length && benefit.campaign_info.value[0].name ? benefit.campaign_info.value[0].name : null,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            text: guarantee.text.value,
            included: guarantee.included.value.some(value => value.codename === 'included'),
            subitems_list: guarantee.subitems.value.map(subitem => {
              return{
                name: subitem.title.value,
                description: subitem.description.value,
                maximal: subitem.maximal.value,
                maximal_desc: subitem.maximal_description.value
              };
            })
          };
        })
      };
      policyCoverages.push(policyCoverage);
    });
    return policyCoverages;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
      obj.container_2 = Object.assign({}, contentFromKentico.how_works);
      obj.container_3 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_4 = Object.assign({}, contentFromKentico.faq);
      obj.container_5 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_1.quotator_size = 'col-12 col-sm-11 col-md-12';
      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      obj.container_1.breadcrumbs = Array.of(
        {name: 'Prodotti', route: '/prodotti'},
        {name: contentFromInsuranceService[0].properties.find(property => property.name === 'uniq_name').value}
      );
      obj.container_2.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_4.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);

      return of(obj);
    }));
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
      img_alt: header.alt
    };
    return obj;
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = [this.getTenantLayoutClass()].concat(product.product_code);
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
  getFaqStructure(kenticoItem: any) {
    let faqsFromKentico: any[] = kenticoItem.map(item => {
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
}
