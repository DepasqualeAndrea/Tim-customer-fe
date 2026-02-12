import { Injectable } from '@angular/core';
import { PreventivatoreModule } from '../../../preventivatore.module';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';
import { DataService, InsurancesService, ProductsService } from '@services';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { ContentInterface } from './content-interface';
import { forkJoin, Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { Product } from '@model';
import { PreventivatoreDynamicSharedFunctions } from './preventivatore-dynamic-shared-functions';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreScreenProtectionContentProviderService implements PreventivatoreContentProvider {

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private productsService: ProductsService,
    private nypInsurancesService: NypInsurancesService
  ) {
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const quotatorErrors = {};
    kenticoItem.quotator.value.find(item => item.system.codename === 'errori_quotatore_screen_protection').linked_items.value.forEach(
      error => Object.defineProperty(
        quotatorErrors,
        error.system.codename,
        { value: error.text.value }
      )
    );
    const structure = {
      header: {
        bg_img: kenticoItem.header.value[0].image.value[0].url,
        img_alt: kenticoItem.header.value[0].image.value[0].description,
        title: kenticoItem.header.value[0].title.value,
        subtitle: kenticoItem.header.value[0].description.value,
        scroll: {
          how_works: kenticoItem.header.value[0].scroll_to_how_works.value ? kenticoItem.header.value[0].scroll_to_how_works.value : null
        }
      },
      quotator: {
        form___imei: kenticoItem.quotator.value.find(item => item.system.codename === 'form___imei').text.value,
        prezzo: kenticoItem.quotator.value.find(item => item.system.codename === 'prezzo').text.value,
        prezzo_fisso: kenticoItem.quotator.value.find(item => item.system.codename === 'prezzo_fisso').text.value,
        anno: kenticoItem.quotator.value.find(item => item.system.codename === '_anno').text.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'collaborazione_prodotto_covercare').info_package_link.value,
        product_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'collaborazione_prodotto_covercare').product_collaboration.value,
        provider_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'collaborazione_prodotto_covercare').provider_logo.value[0].url,
        errors: quotatorErrors,
        error_icon: kenticoItem.quotator.value.find(item => item.system.codename === 'imei_error_icon').thumbnail.value[0].url,
        rimborso: kenticoItem.quotator.value.find(item => item.system.codename === 'rimborso').text.value,
        insert_imei_code: kenticoItem.quotator.value.find(item => item.system.codename === 'insert_imei_code').text.value,
        di_cosa_si_tratta: kenticoItem.quotator.value.find(item => item.system.codename === 'di_cosa_si_tratta').text.value,
        insert_new_imei: kenticoItem.quotator.value.find(item => item.system.codename === 'insert_new_imei').text.value,
        modal_imei: this.getModalImeiStructure(kenticoItem)
      },
      how_works: {
        title_section: kenticoItem.how_works.value[0].title.value,
        text_section: kenticoItem.how_works.value[0].text.value,
        product_content: this.getPolicyCoverages(kenticoItem.how_works.value[0].benefits),
        text_container_size: 'col-12'
      },
      how_works_repair_contribution: {
        title_section1: kenticoItem.how_works.value[0].title_2.value,
        subtitle_section1: kenticoItem.how_works.value[0].subtitle_2.value,
        text_container_size: 'col-12',
        product_content: this.getListSmartphone(kenticoItem.how_works.value[0].list_smartphone),
        description_payment: kenticoItem.how_works.value[0].description_payment.value

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
        }),
        policy_note_content: kenticoItem.what_to_know.value[0].additional_info.value,
        terms_of_service_content: kenticoItem.what_to_know.value[0].information_package.value
      },
      faq: {
        enabled: kenticoItem.common_questions.value[0].enabled.value.length ? kenticoItem.common_questions.value[0].enabled.value.some(value => value.codename === 'true') : false,
        title: kenticoItem.common_questions.value[0].title.value,
        faqs: this.getFaqStructure(kenticoItem.common_questions.value[0].faqs.value[0].linked_items),
        collapse_toggler_icons: {
          show: kenticoItem.common_questions.value[0].icon_closed.value[0] ? kenticoItem.common_questions.value[0].icon_closed.value[0].url : null,
          hide: kenticoItem.common_questions.value[0].icon_opened.value[0] ? kenticoItem.common_questions.value[0].icon_opened.value[0].url : null
        }
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
      products_carousel: {
        enabled: kenticoItem.product_carousel.value[0].enabled.value.length
          ? kenticoItem.product_carousel.value[0].enabled.value.some(value => value.codename === 'true')
          : false,
        title: kenticoItem.product_carousel.value[0].title.value,
      }
    };
    return structure;
  }


  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  setContentToProduct(contentFromInsuranceService: any, header: any) {
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.subtitle,
      bg_img: header.bg_img,
      img_alt: header.alt,
      scroll: {
        how_works: header.scroll.how_works
      }
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

  // getModalStructure(kenticoItem: any){
  //   const modalRefund = {
  //     title : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').title.value,
  //     name : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').name.value,
  //     surname : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').surname.value,
  //     email : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').email.value,
  //     number_coupon : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').number_coupon.value,
  //     imei : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').imei.value,
  //     iban_bancario : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').iban_bancario.value,
  //     button : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').button.value,
  //     insert_code_imei : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').insert_code_imei.value,
  //     icon : kenticoItem.quotator.value.find(item => item.system.codename === 'modal_refund_bank_transfer').icon.value[0].url,
  //   }
  //   return modalRefund;
  // }

  getModalImeiStructure(kenticoItem: any) {
    const modalImei = {
      title: kenticoItem.quotator.value.find(item => item.system.codename === 'modal_imei').title.value,
      description_1: kenticoItem.quotator.value.find(item => item.system.codename === 'modal_imei').description_1.value,
      description_2: kenticoItem.quotator.value.find(item => item.system.codename === 'modal_imei').description_2.value,
      number: kenticoItem.quotator.value.find(item => item.system.codename === 'modal_imei').number.value,
      button: kenticoItem.quotator.value.find(item => item.system.codename === 'modal_imei').button.value,
      icon: kenticoItem.quotator.value.find(item => item.system.codename === 'modal_imei').icon.value[0].url
    }
    return modalImei;
  }

  getPolicyCoverages(benefits: any) {
    const policyCoverages = [];
    benefits.value.map(benefit => {
      const policyCoverage = {
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
  getListSmartphone(kenticoItem: any) {
    const listSmartphone: any[] = kenticoItem.value.map(smartphone => {
      return {
        text: smartphone.text.value,
        included: smartphone.included.value.some(value => value.name === 'included')
      };
    });
    return listSmartphone;
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
        const obj = Object.assign({}, contentFromKentico);
        const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
        obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
        contentFromKentico.what_to_know.terms_of_service_content = PreventivatoreDynamicSharedFunctions.replaceInformationPackageLink(contentFromKentico.what_to_know.terms_of_service_content, contentFromInsuranceService[0].conditions_package);
        obj.container_2 = Object.assign({}, contentFromKentico.how_works_repair_contribution);
        obj.container_3 = Object.assign({}, contentFromKentico.how_works);
        obj.container_4 = Object.assign({}, contentFromKentico.what_to_know, { product_code: 'screen-protection' });
        obj.container_5 = Object.assign({}, contentFromKentico.faq);
        obj.container_6 = Object.assign({}, contentFromKentico.more_info);
        obj.container_7 = Object.assign({}, contentFromKentico.products_carousel);

        obj.container_1.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
        obj.container_7.products = this.productsService.createAggregateList(filteredProducts).map(prodAgg => {
          prodAgg.image = prodAgg.key === 'single'
            ? this.getSmallImage(prodAgg.products[0].images) : prodAgg.images.original_url;
          return prodAgg;
        });
        obj.container_1.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_2.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_4.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);
        obj.container_6.container_class = [this.getTenantLayoutClass()].concat(codes);
        return of(obj);
      }));
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_screen_protection').pipe
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

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }

}
