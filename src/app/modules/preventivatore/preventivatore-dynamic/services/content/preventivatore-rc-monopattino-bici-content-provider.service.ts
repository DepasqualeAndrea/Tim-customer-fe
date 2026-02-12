import { forkJoin, Observable, of } from 'rxjs';
import { ContentInterface } from './content-interface';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { map, switchMap, take } from 'rxjs/operators';
import { Product } from 'app/core/models/insurance.model';
import { DataService, InsurancesService, ProductsService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';
import { PreventivatoreDynamicSharedFunctions } from './preventivatore-dynamic-shared-functions';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreRcMonopattinoBiciContentProvider implements PreventivatoreContentProvider {

  productsAgg: any;

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private nypInsuranceService: NypInsurancesService,
    private productsService: ProductsService
  ) {
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_rc_monopattino_e_bici').pipe
      (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem.header.value[0]),
      quotator: this.getQuotatorStructure(kenticoItem),
      how_works: this.getHowWorksStructure(kenticoItem),
      what_to_know: {
        title_section: kenticoItem.what_to_know.value[0].title.value,
        slider_content: kenticoItem.what_to_know.value[0].infocards.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        }),
        set_informativo_content: kenticoItem.what_to_know.value[0].information_package.value
      },
      more_info: {
        left_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section_rc_scooter_bike').title.value,
        left_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section_rc_scooter_bike').body.value,
        left_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_button').text.value,
        right_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section').title.value,
        right_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section').body.value,
        right_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'contacts_button_label').text.value,
        route: kenticoItem.product_found.value.find(item => item.system.codename === 'assistance_route').text.value
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
      products_carousel: {
        enabled: kenticoItem.product_carousel.value[0].enabled.value.length
          ? kenticoItem.product_carousel.value[0].enabled.value.some(value => value.codename === 'true')
          : false,
        title: kenticoItem.product_carousel.value[0].title.value,
      }
    };
    return structure;
  }

  getHeaderStructure(kenticoHeader: any) {
    const header = {
      img: kenticoHeader.image.value[0]
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

  getQuotatorStructure(kenticoItem: any) {

    const quotator = {
      quot_product_title: kenticoItem.header_quotator.value.find(item => item.system.codename === 'quot_product_title').text.value,
      product_content: this.getQuotator(kenticoItem),
      product_collaboration: kenticoItem.quotator_provider.value.find(item => item.system.codename === 'product_collaboration_europe_assistance').product_collaboration.value,
      provider_logo: kenticoItem.quotator_provider.value.find(item => item.system.codename === 'product_collaboration_europe_assistance').provider_logo.value[0].url,
      information_package_text: kenticoItem.quotator_provider.value.find(item => item.system.codename === 'product_collaboration_europe_assistance').info_package_link.value,

    };
    return quotator;

  }

  getQuotator(kenticoItem: any) {
    const quotatorContents = [];
    kenticoItem.quotator.value.map(card => {
      const quotatorContent = {
        title: card.title.value,
        items_list: card.card_list.value.map(cardContent => {
          return {
            sku_variant: cardContent.sku_variant.value,
            card_icon: cardContent.icon.value.length > 0 ? cardContent.icon.value[0].url : false,
            card_icon_alt: cardContent.icon.value.length > 0 ? cardContent.icon.value[0].description : false,
            card_title: cardContent.title.value,
            card_subtitle: cardContent.subtitle.value,
            card_image: cardContent.image.value[0].url,
            card_image_alt: cardContent.image.value[0].description,
            card_title_more_coverages: PreventivatoreDynamicSharedFunctions.isEmptyText(cardContent.title_more_coverages.value) ? false : cardContent.title_more_coverages.value,
            card_coverages: cardContent.coverages.value,
            price_variant: cardContent.price_variant.value,
            slash_annual: cardContent.slash_annual.value,
            buy_button: cardContent.buy_button.value,
            cover_detail: cardContent.cover_detail.value,
            modal: this.getModal(cardContent),
          };
        })

      };

      quotatorContents.unshift(quotatorContent);
    });
    return quotatorContents;
  }

  private getModal(modal) {
    console.log(modal)
    return {
      sku_variant: modal.sku_variant.value,
      card_image: modal.image.value[0].url,
      card_image_alt: modal.image.value[0].description,
      card_title: modal.title.value,
      price_variant: modal.price_variant.value,
      slash_annual: modal.slash_annual.value,
      little_descr: modal.modal.value[0].little_descr.value,
      img_close_modal: modal.modal.value[0].img_close_modal.value[0].url,
      img_close_modal_alt: modal.modal.value[0].img_close_modal.value[0].description,
      coverages_content: this.getCoverages(modal.modal.value[0].coverages),
      buy_button: modal.modal.value[0].buy_button.value,
      back_button: modal.modal.value[0].back_button.value,
    }
  }

  private getCoverages(coverages) {
    let coveragesFromKentico: any[] = coverages.value.map(coverage => {
      return {
        coverage_title: coverage.title.value,
        coverage_description: coverage.description.value
      };
    });
    return coveragesFromKentico;
  }

  getHowWorksStructure(kenticoItem: any) {
    const selected_tab = 'Monopattino';
    const howWorks = {
      selected_tab: selected_tab,
      product_content: this.getPolicyCoverages(kenticoItem)
    };
    return howWorks;
  }

  getPolicyCoverages(kenticoItem: any) {
    const policyCoverages = [];
    kenticoItem.how_works.value.map(card => {
      const policyCoverage = {
        name: card.product_variant_title.value,
        icon: card.icon_variant.value[0].url,
        icon_alt: card.icon_variant.value[0].description,
        product: card.system.codename.endsWith('monopattino') ? 'Monopattino' : 'Bici Elettrica',
        items_list: card.card_list.value.map(cardContent => {
          return {
            sku_variant: cardContent.sku_variant.value,
            card_image: cardContent.image_variant.value[0].url,
            card_image_alt: cardContent.image_variant.value[0].description,
            card_title: cardContent.title.value,
            card_coverages: cardContent.coverages.value,
            card_additional_coverages: PreventivatoreDynamicSharedFunctions.isEmptyText(cardContent.additional_coverages.value) ? false : cardContent.additional_coverages.value,
            price_variant: cardContent.price_variant.value,
            slash_annual: cardContent.slash_annual.value,
            buy_button: cardContent.buy_button.value,
            little_descr: cardContent.little_descr.value,
          };
        })
      };
      policyCoverages.unshift(policyCoverage);
    });
    return policyCoverages;
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

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    const filteredProducts$ = this.getFilteredProducts(codes);
    return forkJoin([contentFromKentico$, filteredProducts$]).pipe(
      switchMap(([contentFromKentico, filteredProducts]) => {
        const obj = <ContentInterface>{};
        const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
        contentFromKentico.what_to_know.set_informativo_content = PreventivatoreDynamicSharedFunctions.replaceInformationPackageLink(
          contentFromKentico.what_to_know.set_informativo_content,
          contentFromInsuranceService[0].information_package
        );
        obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
        obj.container_2 = Object.assign({}, contentFromKentico.how_works);
        obj.container_3 = Object.assign({}, contentFromKentico.what_to_know);
        obj.container_4 = Object.assign({}, contentFromKentico.faq);
        obj.container_5 = Object.assign({}, contentFromKentico.more_info);
        obj.container_6 = Object.assign({}, contentFromKentico.products_carousel);

        obj.container_1.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
        obj.container_6.products = this.productsService.createAggregateList(filteredProducts).map(prodAgg => {
          prodAgg.image = prodAgg.key === 'single'
            ? this.getSmallImage(prodAgg.products[0].images)
            : prodAgg.images.original_url;
          return prodAgg;
        });
        obj.container_1.quot_product_title = contentFromKentico.quotator.quot_product_title;
        obj.container_1.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_2.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_4.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_6.container_class = [this.getTenantLayoutClass()].concat(codes);
        return of(obj);
      })
    );
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
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

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    const obj = Object.assign({}, { products: contentFromInsuranceService }, header);
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
