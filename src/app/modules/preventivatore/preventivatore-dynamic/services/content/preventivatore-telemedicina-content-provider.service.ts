import { forkJoin, Observable, of } from 'rxjs';
import { ContentInterface } from './content-interface';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Product } from 'app/core/models/insurance.model';
import { DataService, AuthService, InsurancesService, ProductsService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';
import { PreventivatoreDynamicSharedFunctions } from './preventivatore-dynamic-shared-functions';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Injectable({
  providedIn: 'root'
})

export class PreventivatoreTelemedicinaContentProvider implements PreventivatoreContentProvider {

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
      header: this.getHeaderStructure(kenticoItem.header.value),
      quotator: {
        product_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'in_collaborazione_con').product_collaboration.value,
        information_package_link: kenticoItem.quotator.value.find(item => item.system.codename === 'in_collaborazione_con').info_package_link_dynamic.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'in_collaborazione_con').info_package_link.value,
        provider_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'in_collaborazione_con').provider_logo.value[0].url,
        description: kenticoItem.quotator.value.find(item => item.system.codename === 'description').text.value,
        title: kenticoItem.quotator.value.find(item => item.system.codename === 'title_quotator').text.value,
        payment_method: kenticoItem.quotator.value.find(item => item.system.codename === 'modalita_di_pagamento').text.value,

        year: kenticoItem.quotator_button.value.find(item => item.system.codename === 'anno').text.value,
        month: kenticoItem.quotator_button.value.find(item => item.system.codename === 'mese').text.value,
        continue: kenticoItem.quotator_button.value.find(item => item.system.codename === 'continua').text.value,
      },
      how_works: {
        title: kenticoItem.title.value,
        more_information: kenticoItem.more_information.value.map(item => {
          return {
            image: item.image.images[0].url,
            information: item.information.value
          };
        }),
        cards: this.getHowWorksStructure(kenticoItem.how_works_telemedicina),
      },
      what_to_know: {
        title_what_to_know: kenticoItem.title_what_to_know.value,
        what_to_know_texts: kenticoItem.what_to_know.value.map(item => {
          return {
            number: item.number.value,
            content: item.content.value,
          };
        }),

        title_more_to_know: kenticoItem.title_more_to_know.value,
        icon: kenticoItem.icon.value[0].url,
        more_to_know_texts: kenticoItem.answer.value.map(item => {
          return {
            text: item.text.value,
          };
        }),
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
        title: kenticoItem.contattaci.information.title.value,
        subtitle: kenticoItem.contattaci.information.body.value,
        button_text: kenticoItem.contattaci.contact.text.value,
        button_redirect: kenticoItem.contattaci.contact_route.text.value,
      },

    };
    return structure;
  }

  getHeaderStructure(kenticoHeader: any) {
    const header = {
      bg_img: kenticoHeader[0].image.value[0]
        ? kenticoHeader[0].image.value[0].url
        : null,
      img_alt: kenticoHeader[0].image.value[0]
        ? kenticoHeader[0].image.value[0].description
        : null,
      title: kenticoHeader[0].title.value
        ? kenticoHeader[0].title.value
        : null,
      subtitle: kenticoHeader[0].description.value
        ? kenticoHeader[0].description.value
        : null,
      scroll_to_top: kenticoHeader[0].scroll_to_how_works.value
        ? kenticoHeader[0].scroll_to_how_works.value
        : null,
      bg_img_mobile: kenticoHeader[1].image.value[0]
        ? kenticoHeader[1].image.value[0].url
        : null,
      title_mobile: kenticoHeader[1].title.value
        ? kenticoHeader[1].title.value
        : null,
      subtitle_mobile: kenticoHeader[1].description.value
        ? kenticoHeader[1].description.value
        : null,
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

  getHowWorksStructure(kenticoHowWork: any) {
    let howWorkFromKentico: any[] = kenticoHowWork.value.map(item => {
      return {
        title: item.title.value,
        content: item.content.value,
        icon: item.icon.value[0].url,
        addonIcon: !!item.addon.value[0] ? item.addon.value[0].icon.value[0].url : null,
        addonDescription: !!item.addon.value[0] ? item.addon.value[0].description.value : null,
      }
    });
    return howWorkFromKentico;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    const filteredProducts$ = this.getFilteredProducts(codes);
    return forkJoin([contentFromKentico$, filteredProducts$]).pipe(
      switchMap(([contentFromKentico, filteredProducts]) => {
        const obj = <ContentInterface>{};
        const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
        const welcomeMessage = this.getUserWelcomeMessage(contentFromKentico.header);
        obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header, welcomeMessage));
        obj.container_2 = Object.assign({}, contentFromKentico.how_works);
        obj.container_3 = Object.assign({}, contentFromKentico.what_to_know);
        obj.container_4 = Object.assign({}, contentFromKentico.faq);
        obj.container_5 = Object.assign({}, contentFromKentico.more_info);
        obj.container_1.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
        obj.container_1.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_2.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_4.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);
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
    return this.kenticoTranslateService.getItem('preventivatore_telemedicina').pipe
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

