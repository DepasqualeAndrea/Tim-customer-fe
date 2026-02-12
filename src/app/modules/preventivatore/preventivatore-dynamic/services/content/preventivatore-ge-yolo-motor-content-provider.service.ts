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
export class PreventivatoreGeYoloMotorContentProviderService {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService,
    private productsService: ProductsService,
    protected nypInsuranceService: NypInsurancesService
  ) {
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        license_plate: kenticoItem.quotator.value.find(item => item.system.codename === 'license_plate').text.value,
        birthday_contractor: kenticoItem.quotator.value.find(item => item.system.codename === 'birthday_contractor').text.value,
        residential_address_autocomplete: kenticoItem.quotator.value.find(item => item.system.codename === 'residential_address_autocomplete').text.value,
        choise_contractor_is_owner: kenticoItem.quotator.value.find(item => item.system.codename === 'choise_contractor_is_owner'),
        birthday_insured: kenticoItem.quotator.value.find(item => item.system.codename === 'birthday_owner').text.value,
        yearly_price: kenticoItem.quotator.value.find(item => item.system.codename === 'yearly_price').text.value,
        calculate_quote: kenticoItem.quotator.value.find(item => item.system.codename === 'calculate_quote').text.value,
        collaborazione_prodotto: kenticoItem.quotator.value.find(item => item.system.codename === 'collaborazione_prodotto_motor_genertel'),
        redirect_site: kenticoItem.quotator.value.find(item => item.system.codename === 'redirect_site_genertel').text.value,
        img_arrow_right: kenticoItem.quotator.value.find(item => item.system.codename === 'img_arrow_right').image.value[0],
        set_informativo: kenticoItem.quotator.value.find(item => item.system.codename === 'set_informativo_motor_genertel').text.value,
        link_redirect_genertel_car: kenticoItem.quotator.value.find(item => item.system.codename === 'link_redirect_genertel_car').text.value,
        link_redirect_genertel_van: kenticoItem.quotator.value.find(item => item.system.codename === 'link_redirect_genertel_van').text.value,
        residential_state: kenticoItem.quotator.value.find(item => item.system.codename === 'residential_state').text.value,
        residential_city: kenticoItem.quotator.value.find(item => item.system.codename === 'residential_city').text.value,
        address_type: kenticoItem.quotator.value.find(item => item.system.codename === 'address_type').text.value,
        residential_address: kenticoItem.quotator.value.find(item => item.system.codename === 'residential_address').text.value,
        residential_number: kenticoItem.quotator.value.find(item => item.system.codename === 'residential_number').text.value,
        postal_code: kenticoItem.quotator.value.find(item => item.system.codename === 'postal_code').text.value,
      },
      how_works: {
        title_section: kenticoItem.how_works.how_works.title.value,
        text_section: kenticoItem.how_works.how_works.text.value,
        guarantees: this.getListGuarantee(kenticoItem.how_works.how_works.benefits.value)
      },
      for_who: {
        title: kenticoItem.who_is_for.for_who.title.value,
        body: kenticoItem.who_is_for.for_who.text.value,
        note: kenticoItem.who_is_for.for_who.note.value,
      },
      optional_warranty: {
        title: kenticoItem.optional_warranty.optional_warranty.title.value,
        list_optional_warranty: this.getListGuarantee(kenticoItem.optional_warranty.optional_warranty.list_optional_warranty.value),
      },
      what_to_know: {
        title_section: kenticoItem.what_to_know.what_to_know_motor_genertel.title.value,
        slider_content: kenticoItem.what_to_know.what_to_know_motor_genertel.infocards.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        }),
        additional_info: kenticoItem.what_to_know.what_to_know_motor_genertel.additional_info.value,
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
        // set_informativo_content: kenticoItem.what_to_know.what_to_know_motor_genertel.information_package.value
      },
      more_info: {
        left_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section_motor').title.value,
        left_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section_motor').body.value,
        left_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_button').text.value,
        right_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section').title.value,
        right_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section').body.value,
        right_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_button').text.value,
        route: kenticoItem.product_found.value.find(item => item.system.codename === 'assistance_route').text.value
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
      quotatorChoiseTabs: kenticoItem.header.value[0].quotator_choise_tabs
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

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
      product.container_class = [this.getTenantLayoutClass()].concat(product.product_code);
      product.selected_values = {};
    });
    return obj.container_1.products;
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

  setImageProductsTabs(products: any, kenticoHeader: any) {
    const vehicleType = kenticoHeader.quotatorChoiseTabs.value[0].types_to_choose.value;
    for (const product of products) {
      for (const elem of vehicleType) {
        if (product.name.toLowerCase() === elem.description.value.toLowerCase()) {
          product.imageTabsActive = elem.img_type_active.value[0].url;
          product.imageTabsNotActive = elem.img_type_not_active.value[0].url;
        }
      }
    }
    return products;
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_motor_genertel').pipe
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
    contentFromInsuranceService = this.setImageProductsTabs(contentFromInsuranceService, header);
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.description,
      bg_img: header.image,
      img_alt: header.alt,
      quotatorTitle: header.quotatorTitle.value,
      quotatorDescription: header.quotatorDescription.value,
      quotatorChoiseTabsDescription: header.quotatorChoiseTabs.value[0].title.value,
      iconProduct: this.getSmallImage(contentFromInsuranceService[0].images)
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
