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
  providedIn: 'root'
})
export class PreventivatoreGeSellaTravelContentProviderService implements PreventivatoreContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService
  ) { }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_travel_genertel').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        policy: kenticoItem.quotator.value.find(item => item.system.codename === 'policy_quotator').text.value,
        travel_start: kenticoItem.quotator.value.find(item => item.system.codename === 'travel_start_date').text.value,
        travel_end: kenticoItem.quotator.value.find(item => item.system.codename === 'travel_end_date').text.value,
        destination_select: kenticoItem.quotator.value.find(item => item.system.codename === 'destination_select').text.value,
        age_selector_placeholder: kenticoItem.quotator.value.find(item => item.system.codename === 'age_selector_placeholder').text.value,
        addons_question: kenticoItem.quotator.value.find(item => item.system.codename === 'addons_question').text.value,
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'proceed_to_buy').text.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'information_package_text').text.value,
        covid_included: kenticoItem.quotator.value.find(item => item.system.codename === 'copertura_covid_19_inclusa').text.value,

      },
      how_works: {
        title: kenticoItem.how_works.container_coverages.title.value,
        how_works_viaggio: this.getHowWorksStructure(kenticoItem),
      },
      gold_guarantee: this.getGaranzieAggiuntiveStructure(kenticoItem),
      what_to_know: {
        title_section: kenticoItem.what_to_know.value.find(item => item.system.codename === 'what_to_know_title').text.value,
        text_section: kenticoItem.what_to_know.value.find(item => item.system.codename === 'what_to_know_travel').text.value,
        set_informativo_content: kenticoItem.what_to_know.value.find(item => item.system.codename === 'informative_set_plus_premium_travel').text.value
      },
      faq: {
        enabled: kenticoItem.common_questions.value[0].enabled.value.length
          ? kenticoItem.common_questions.value[0].enabled.value.some(value => value.codename === 'true')
          : false,
        title: kenticoItem.common_questions.value[0].title.value,
        faqs: this.getFaqStructure(kenticoItem.common_questions.value[0].faqs.value[0].linked_items),
        faqsMobile: this.getFaqMobileStructure(kenticoItem.common_questions.value[0].faqs.value[0].linked_items),
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
        title: kenticoItem.more_info.value.find(item => item.system.codename === 'more_info_title_travel').text.value,
        subtitle: kenticoItem.more_info.value.find(item => item.system.codename === 'more_info_text_travel').text.value,
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
        product_code: benefit.system.codename.endsWith('travel_plus') ? 'ge-travel-plus' : 'ge-travel-premium',
        ribbon: benefit.campaign_info.value.length && benefit.campaign_info.value[0].name ? benefit.campaign_info.value[0].name : null,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            text: guarantee.text.value,
            subitems_list: guarantee.subitems.value.map(subitem => subitem.text.value),
            included: guarantee.included.value.some(value => value.codename === 'included')
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
      obj.container_3 = Object.assign({}, contentFromKentico.gold_guarantee);
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_5 = Object.assign({}, contentFromKentico.faq);
      obj.container_6 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_1.quotator_size = 'col-12 col-sm-11 col-md-12';
      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      obj.container_1.breadcrumbs = Array.of(
        {name: 'Prodotto'},
        {name: contentFromInsuranceService[0].properties.find(property => property.name === 'uniq_name').value}
      );
      obj.container_2.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_4.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_6.container_class = [this.getTenantLayoutClass()].concat(codes);

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

  private getHowWorksStructure(kenticoItem: any) {
    const howWorks = [];
    kenticoItem.how_works.value.map((item) => {
      const howWorkStructure = {
        coverage: item.coverages.value.map(items => {
          return {
            title: items.title.value,
            dropdown: items.dropdown_icon.value[0].url,
            benefits: items.benefit.value.map(options => {
              return {
                icon: options.icon.value[0].url,
                description: options.description.value,
                covid: options.covid_19 ? options.covid_19.value : null,
                maximal: options.indennizzabili ? options.indennizzabili.value : null

              };
            })
          };
        })
      };
      howWorks.unshift(howWorkStructure);
    });
    return howWorks;
  }

  private getFaqStructure(kenticoItem: any) {
    let faqsFromKentico: any[] = kenticoItem.value.map(item => {
      return {
        question: item && item.question.value,
        answer: item && item.answer.value,
        id: item.system.codename,
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

  private getFaqMobileStructure(kenticoItem: any) {
    let faqsFromKentico: any[] = kenticoItem.value.map(item => {
      return {
        question: item && item.question.value,
        answer: item && item.answer.value,
        id: item.system.codename,
      };
    });
    return faqsFromKentico;
  }


  private getGaranzieAggiuntiveStructure(kenticoItem: any) {
      const more_info = {
        title: kenticoItem.what_to_know.title_more_info.text.value,
        more_info: kenticoItem.what_to_know.more_info.container.value,
      };
      return more_info;
    }
}
