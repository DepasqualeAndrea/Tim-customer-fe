import { Injectable } from '@angular/core';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { DataService, InsurancesService, ProductsService } from '@services';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ContentInterface } from './content-interface';
import { Product } from '@model';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreGeYoloHomeContentProviderService {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService,
    private productsService: ProductsService,
    private nypInsuranceService: NypInsurancesService
  ) {
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        province_select: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_province_select').text.value,
        area: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_area').text.value,
        start_date: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_start_date').text.value,
        choise_massimali: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_choise_massimali'),
        choise_payment_type: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_choise_payment_type'),
        choise_type_home: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_choise_type_home'),
        collaborazione_prodotto: kenticoItem.quotator.value.find(item => item.system.codename === 'collaborazione_prodotto_home_genertel'),
        calculate_quote: kenticoItem.quotator.value.find(item => item.system.codename === 'calculate_quote_home_genertel').text.value,
        set_informativo: kenticoItem.quotator.value.find(item => item.system.codename === 'set_informativo_home_genertel').text.value,
        monthly_price: kenticoItem.quotator.value.find(item => item.system.codename === 'monthly_installment').text.value,
        annual_price: kenticoItem.quotator.value.find(item => item.system.codename === 'yearly_price').text.value,
        total_price: kenticoItem.quotator.value.find(item => item.system.codename === 'total_price').text.value,
        tooltip_text: kenticoItem.quotator.value.find(item => item.system.codename === 'tooltip_price_text').text.value
      },
      how_works: {
        title_section: kenticoItem.how_works.how_works_home_genertel.title.value,
        text_section: kenticoItem.how_works.how_works_home_genertel.text.value,
        guarantees: this.getListGuarantee(kenticoItem.how_works.how_works_home_genertel.benefits.value)
      },
      for_who: {
        title: kenticoItem.who_is_for.for_who_home_genertel.title.value,
        body: kenticoItem.who_is_for.for_who_home_genertel.text.value,
        note: kenticoItem.who_is_for.for_who_home_genertel.note.value,
      },
      optional_warranty: {
        title: kenticoItem.optional_warranty.optional_warranty_f48326c.title.value,
        list_optional_warranty: this.getListGuarantee(kenticoItem.optional_warranty.optional_warranty_f48326c.list_optional_warranty.value),
      },
      what_to_know: {
        title_section: kenticoItem.what_to_know.what_to_know_home_genertel.title.value,
        slider_content: kenticoItem.what_to_know.what_to_know_home_genertel.infocards.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        }),
        additional_info: kenticoItem.what_to_know.what_to_know_home_genertel.additional_info.value,
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
        },
        // set_informativo_content: kenticoItem.what_to_know.what_to_know_home_genertel.information_package.value
      },
      more_info: {
        left_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section_ge_home').title.value,
        left_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section_ge_home').body.value,
        left_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_button_home').text.value,
        right_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section_home').title.value,
        right_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section_home').body.value,
        right_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_button_home').text.value,
        route: kenticoItem.product_found.value.find(item => item.system.codename === 'assistance_route_home').text.value
      },
      products_carousel: {
        enabled: kenticoItem.product_carousel.value[0].enabled.value.length
          ? kenticoItem.product_carousel.value[0].enabled.value.some(value => value.codename === 'true')
          : false,
        title: kenticoItem.product_carousel.value[0].title.value,
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
        : null,
      quotatorTitle: kenticoItem.header.value[0].quotator_title,
      quotatorDescription: kenticoItem.header.value[0].quotator_description,
      quotatorChoiseTabs: kenticoItem.header.value[0].quotator_choise_tabs,
      scroll: {
        how_works: kenticoItem.header.value[0].scroll_to_how_works.value
          ? kenticoItem.header.value[0].scroll_to_how_works.value
          : null
      }
    };
    return header;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    const filteredProducts$ = this.getFilteredProducts(codes);
    return forkJoin([contentFromKentico$, filteredProducts$]).pipe(
      switchMap(([contentFromKentico, filteredProducts]) => {
        const obj = <ContentInterface>{};
        const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
        obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
        obj.container_2 = Object.assign({}, contentFromKentico.how_works);
        obj.container_3 = Object.assign({}, contentFromKentico.for_who);
        obj.container_4 = Object.assign({}, contentFromKentico.optional_warranty);
        obj.container_5 = Object.assign({}, contentFromKentico.what_to_know);
        obj.container_6 = Object.assign({}, contentFromKentico.faq);
        obj.container_7 = Object.assign({}, contentFromKentico.more_info);
        obj.container_8 = Object.assign({}, contentFromKentico.products_carousel);

        obj.container_1.container_class = this.getTenantLayoutClass();
        obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
        obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_8.products = this.productsService.createAggregateList(filteredProducts).map(prodAgg => {
          prodAgg.image = prodAgg.key === 'single'
            ? this.getSmallImage(prodAgg.products[0].images)
            : prodAgg.images.original_url;
          return prodAgg;
        });
        return of(obj);
      })
    );
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

  getListGuarantee(kenticoContent: any) {
    const listGuarantee = [];
    for (const kenticoContentElement of kenticoContent) {
      listGuarantee.push(
        {
          name: kenticoContentElement.name.value,
          description: kenticoContentElement.description.value,
          included: kenticoContentElement.included.value.some(value => value.name === 'included'),
          check_icon: kenticoContentElement.check_icon.value[0].url
        }
      );
    }
    return listGuarantee;
  }

  setImageProductsTabs(products: any) {
    return products;
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
      product.container_class = [this.getTenantLayoutClass()].concat(product.product_code);
      product.selected_values = {};
    });
    return obj.container_1.products;
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_home_genertel').pipe
      (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  private getFilteredProducts(codes: string[]) {
    return this.nypInsuranceService.getProducts().pipe(
      take(1), map(productList => {
        const filterFn = (p: Product) => {
          const productVisibility = (!p.product_structure || !p.product_structure.product_configuration) ? true : p.product_structure.product_configuration.visible;
          return p.show_in_dashboard === true && productVisibility && !codes.includes(p.product_code);
        };
        return productList.products.filter(filterFn);
      })
    );
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    contentFromInsuranceService = this.setImageProductsTabs(contentFromInsuranceService);
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.description,
      bg_img: header.image,
      img_alt: header.alt,
      quotatorTitle: header.quotatorTitle.value,
      quotatorDescription: header.quotatorDescription.value,
      quotatorChoiseTabsDescription: header.quotatorChoiseTabs.value.length ? header.quotatorChoiseTabs.value[0].title.value : null,
      iconProduct: this.getSmallImage(contentFromInsuranceService[0].images),
      scroll: header.scroll,
      container_class: 'layout-yolodb'
    };
    return obj;
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
