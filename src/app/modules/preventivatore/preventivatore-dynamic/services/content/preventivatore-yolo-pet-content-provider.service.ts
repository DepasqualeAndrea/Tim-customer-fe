import { forkJoin, Observable, of } from 'rxjs';
import { ContentInterface } from './content-interface';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { map, switchMap, take } from 'rxjs/operators';
import { Product } from 'app/core/models/insurance.model';
import { DataService, AuthService, InsurancesService, ProductsService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';
import { PreventivatoreDynamicSharedFunctions } from './preventivatore-dynamic-shared-functions';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreYoloPetContentProvider implements PreventivatoreContentProvider {

  productsAgg: any;

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private authService: AuthService,
    private nypInsurancesService: NypInsurancesService,
    private productsService: ProductsService
  ) {
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem.header.value[0]),
      quotator: {
        product_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'product_collaboration_net').product_collaboration.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'product_collaboration_net').info_package_link.value,
        provider_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'product_collaboration_net').provider_logo.value[0].url,
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'continue_button').text.value,
      },
      how_works: this.getHowWorksStructure(kenticoItem),
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
        left_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section_pet').title.value,
        left_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section_pet').body.value,
        left_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_button_pet').text.value,
        right_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section_pet').title.value,
        right_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section_pet').body.value,
        right_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_button_pet').text.value,
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
      text_section: kenticoItem.how_works.value[0].text.value || null,
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

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    const filteredProducts$ = this.getFilteredProducts(codes);
    return forkJoin([contentFromKentico$, filteredProducts$]).pipe(
      switchMap(([contentFromKentico, filteredProducts]) => {
        const obj = <ContentInterface>{};
        const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
        const welcomeMessage = this.getUserWelcomeMessage(contentFromKentico.header);
        contentFromKentico.what_to_know.set_informativo_content = PreventivatoreDynamicSharedFunctions.replaceInformationPackageLink(
          contentFromKentico.what_to_know.set_informativo_content,
          contentFromInsuranceService[0].information_package
        );
        obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header, welcomeMessage));
        obj.container_2 = Object.assign({}, contentFromKentico.how_works);
        obj.container_3 = Object.assign({}, contentFromKentico.for_who);
        obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
        obj.container_5 = Object.assign({}, contentFromKentico.faq);
        obj.container_6 = Object.assign({}, contentFromKentico.more_info);
        obj.container_7 = Object.assign({}, contentFromKentico.products_carousel);

        obj.container_1.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
        obj.container_7.products = this.productsService.createAggregateList(filteredProducts).map(prodAgg => {
          prodAgg.image = prodAgg.key === 'single'
            ? this.getSmallImage(prodAgg.products[0].images)
            : prodAgg.images.original_url;
          return prodAgg;
        });
        obj.container_1.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_2.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_4.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_6.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_7.container_class = [this.getTenantLayoutClass()].concat(codes);
        return of(obj);
      })
    );
  }


  private getUserWelcomeMessage(headerFromKentico: any) {
    if (!headerFromKentico) {
      return null;
    }
    if (!headerFromKentico.welcome_message) {
      return null;
    }
    const message = headerFromKentico.welcome_message;
    if (this.authService.currentUser.firstname) {
      return message + ' ' + this.authService.currentUser.firstname + '!';
    }
    return null;
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_yolo_pet').pipe
      (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  private getFilteredProducts(codes: string[]) {
    return this.nypInsurancesService.getProducts().pipe(
      take(1), map(productList => {
        const filterFn = (p: Product) => {
          const productVisibility = (!p.product_structure || !p.product_structure.product_configuration) ? true : p.product_structure.product_configuration.visible;
          return p.show_in_dashboard === true && productVisibility && !codes.includes(p.product_code);
        };
        return productList.products.filter(filterFn);
      })
    );
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any, welcomeMessage: any) {
    const obj = Object.assign({}, { products: contentFromInsuranceService }, { welcome_message: welcomeMessage }, header);
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
