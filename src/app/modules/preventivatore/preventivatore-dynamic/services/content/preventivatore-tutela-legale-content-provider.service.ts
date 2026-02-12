import { Observable, of } from 'rxjs';
import { ContentInterface } from './content-interface';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { map, switchMap, take } from 'rxjs/operators';
import { Product } from 'app/core/models/insurance.model';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})

export class PreventivatoreYoloTutelaLegaleContentProvider implements PreventivatoreContentProvider {

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {

    const quotatorErrors = {};
    kenticoItem.quotator.value.find(item => item.system.codename === 'quotator_errors_tut_leg').linked_items.value.forEach(
      error => Object.defineProperty(
        quotatorErrors,
        error.system.codename,
        { value: error.text.value }
      )
    );
    const structure = {
      header: this.getHeaderStructure(kenticoItem.header.value[0]),
      quotator: {
        tut_leg_description: kenticoItem.quotator.value.find(item => item.system.codename === 'tut_leg_description').text.value,
        form_employees_number: kenticoItem.quotator.value.find(item => item.system.codename === 'form_employees_number').text.value,
        select_employees_warning: kenticoItem.quotator.value.find(item => item.system.codename === 'select_employees_warning').text.value,
        payment_method: kenticoItem.quotator.value.find(item => item.system.codename === 'payment_method').text.value,
        errors: quotatorErrors,
        radiobutton_monthly: kenticoItem.quotator.value.find(item => item.system.codename === 'radiobutton_monthly').text.value,
        radiobutton_yearly: kenticoItem.quotator.value.find(item => item.system.codename === 'radiobutton_yearly').text.value,
        add_options_coverage: kenticoItem.quotator.value.find(item => item.system.codename === 'add_options_coverage').text.value,
        total_price: kenticoItem.quotator.value.find(item => item.system.codename === 'total_price').text.value,
        payment_monthly: kenticoItem.quotator.value.find(item => item.system.codename === 'payment_monthly').text.value,
        annual_total_price: kenticoItem.quotator.value.find(item => item.system.codename === 'annual_total_price').text.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'product_partner_das').info_package_link.value,
        product_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'product_partner_das').product_collaboration.value,
        buy_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'buy_button').text.value,
      },
      how_works: this.getHowWorksStructure(kenticoItem),
      how_works_double: this.getHowWorksDoubleStructure(kenticoItem),
      what_to_know: {
        title_section: kenticoItem.what_to_know.value[0].title.value,
        text_section: kenticoItem.what_to_know.value[0].text.value,
        slider_content: kenticoItem.what_to_know.value[0].infocards.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        }),
        policy_note_content: kenticoItem.what_to_know.value[0].additional_info.value,
        set_informativo_content: kenticoItem.what_to_know.value[0].information_package.value
      },
      more_info: {
        left_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section').title.value,
        left_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section').body.value,
        left_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_button').text.value,
        right_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section').title.value,
        right_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section').body.value,
        right_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_button').text.value,
        route: kenticoItem.product_found.value.find(item => item.system.codename === 'assistance_route').text.value
      },
      for_who: {
        title: kenticoItem.who_is_for.value[0].title.value,
        body: kenticoItem.who_is_for.value[0].text.value
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
      }
    };
    return structure;
  }

  getHeaderStructure(kenticoHeader: any) {
    const header = {
      bg_img: kenticoHeader.image.value[0]
        ? kenticoHeader.image.value[0].url
        : null,
      img_alt: kenticoHeader.image.value[0]
        ? kenticoHeader.image.value[0].description
        : null,
      title: kenticoHeader.title.value
        ? kenticoHeader.title.value
        : null,
      subtitle: kenticoHeader.description.value
        ? kenticoHeader.description.value
        : null,
      scroll: {
        how_works: kenticoHeader.scroll_to_how_works.value
          ? kenticoHeader.scroll_to_how_works.value
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
    const howWorks = {
      title_section: kenticoItem.how_works.value[0].title.value,
      text_section: kenticoItem.how_works.value[0].text.value,
      product_content: this.getPolicyCoverages(kenticoItem.how_works.value[0].benefits),
      text_container_size: 'col-12'
    };
    return howWorks;
  }

  getPolicyCoverages(benefits: any) {
    const policyCoverages = [];
    benefits.value.map(benefit => {
      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename,
        ribbon: benefit.campaign_info.value.length && benefit.campaign_info.value[0].name ? benefit.campaign_info.value[0].name : null,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            text: guarantee.text.value,
            subitems_list: guarantee.subitems.value.map(subitem => subitem.text.value),
            included: guarantee.included.value.some(value => value.name === 'included')
          };
        })
      };
      policyCoverages.push(policyCoverage);
    });
    return policyCoverages;
  }

  getHowWorksDoubleStructure(kenticoItem: any) {
    const howWorksDouble = {
      title_section: kenticoItem.how_works.value[1].title.value,
      product_content: this.getPolicyDoubleCoverages(kenticoItem)
    };
    return howWorksDouble;
  }

  getPolicyDoubleCoverages(kenticoItem: any) {
    const policyDoubleCoverages = [];
    kenticoItem.how_works.value[1].benefits.value.map(benefit => {
      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename.endsWith('fornitori_e_dipendenti') ? 'das-legalprotection' : null,
        selected: false,
        recommended: false,
        included: false,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            text: guarantee.text.value,
            subitems: guarantee.subitems.value.map(subitem => {
              return subitem.text.value;
            }),
            included: guarantee.included.value.some(value => value.codename === 'included')
          };
        })
      };
      policyDoubleCoverages.unshift(policyCoverage);
    });
    return policyDoubleCoverages;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
      obj.container_2 = Object.assign({}, contentFromKentico.how_works);
      obj.container_3 = Object.assign({}, contentFromKentico.how_works_double);
      obj.container_4 = Object.assign({}, contentFromKentico.for_who);
      obj.container_5 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_6 = Object.assign({}, contentFromKentico.faq);
      obj.container_7 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);

      obj.container_2.container_class = this.getTenantLayoutClass();
      obj.container_3.container_class = this.getTenantLayoutClass();
      obj.container_4.container_class = this.getTenantLayoutClass();
      obj.container_5.container_class = this.getTenantLayoutClass();
      obj.container_6.container_class = this.getTenantLayoutClass();

      return of(obj);
    }));

  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_tutela_legale').pipe
      (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.subtitle,
      bg_img: header.bg_img,
      img_alt: header.img_alt,
      scroll: header.scroll
    };
    return obj;
  }

  private setColorClassToProducts(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
      product.container_class = [this.getTenantLayoutClass(), product.product_code];
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
      return smallImage && smallImage.original_url || smallImage.small_url;
    }
    smallImage = images.find((img) => img.image_type === 'default');
    if (!!smallImage) {
      return smallImage && smallImage.original_url || smallImage.small_url;
    }
    smallImage = images.find((img) => img.image_type === 'common_image');
    if (!!smallImage) {
      return smallImage && smallImage.original_url || smallImage.small_url;
    }
    return '';
  }

}
