import {Injectable} from '@angular/core';
import {Product} from '@model';
import {DataService} from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ContentInterface} from '../content/content-interface';
import {PreventivatoreContentProvider} from '../content/preventivatore-content-provider.interface';
@Injectable({
  providedIn: PreventivatoreModule
})
export class PreventivatoreYoloMultirischiContentProvider implements PreventivatoreContentProvider {

  private productCodes = ['net-multirisk-craft', 'net-multirisk-commerce'];

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_yolo_multirischi').pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: this.getQuotatorStructure(kenticoItem),
      how_works: {
        title: kenticoItem.how_works.value[0].title.value,
        how_works_multirisk: this.getHowWorksStructure(kenticoItem),
        description: kenticoItem.how_works.value[0].description.value
      },
      for_who: this.getWhoIsFor(kenticoItem),
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
         set_informativo_content: kenticoItem.what_to_know.value[0].information_package.value
      },
      more_info: {
        title: kenticoItem.product_found.need_more_information.title.value,
        subtitle: kenticoItem.product_found.need_more_information.body.value,
        button_text: kenticoItem.product_found.value.find(item => item.system.codename === 'contacts_button').text.value
      },
      faq: {
        enabled: kenticoItem.common_questions.value[0].enabled.value.length ? kenticoItem.common_questions.value[0].enabled.value.some(value => value.codename === 'true') : false,
        title: kenticoItem.common_questions.value[0].title.value,
        faqs: this.getFaqStructure(kenticoItem.common_questions.value[0].faqs.value[0].linked_items),
        collapse_toggler_icons: {
          show: kenticoItem.common_questions.value[0].icon_closed.value[0] ? kenticoItem.common_questions.value[0].icon_closed.value[0].url : null,
          hide: kenticoItem.common_questions.value[0].icon_opened.value[0] ? kenticoItem.common_questions.value[0].icon_opened.value[0].url : null
        }
      }
    };
    return structure;
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

  getBenefitsStructure(kenticoItem: any) {
    const benefitStructure = [];
    kenticoItem.who_is_for.value[0].benefits_multirischi_list_1.value.map(benefits => {
      const structure = {
        description: benefits.description.value,
        icon: benefits.icon.value[0].url,
        icon_description: benefits.icon.value[0].description
      };
      benefitStructure.push(structure);
    });
    return benefitStructure;
  }

  getBenefitsStructureTwo(kenticoItem: any) {
    const benefitStructureTwo = [];
    kenticoItem.who_is_for.value[0].benefits_multirischi_list_2.value.map(benefits => {
      const structure = {
        description: benefits.description.value,
        icon: benefits.icon.value[0].url,
        icon_description: benefits.icon.value[0].description
      };
      benefitStructureTwo.push(structure);
    });
    return benefitStructureTwo;
  }

  getWhoIsFor(kenticoItem: any) {
    const whoIsFor = {
      title: kenticoItem.who_is_for.value[0].title.value,
      subtitle: kenticoItem.who_is_for.value[0].subtitle.value,
      text: kenticoItem.who_is_for.value[0].text.value,
      info: kenticoItem.who_is_for.value[0].info.value,
      benefits_list_1: this.getBenefitsStructure(kenticoItem),
      benefits_list_2: this.getBenefitsStructureTwo(kenticoItem)
    };
    return whoIsFor;
  }

  getHowWorksStructure(kenticoItem: any) {
    const howWorks = [];
    kenticoItem.how_works.value.map((item) => {
      const howWorkStructure = {
        coverage: item.coverages.value.map(items => {
          return {
            title: items.title.value,
            benefits: items.benefit.value.map(options => {
              return {
                icon: options.icon.value[0].url,
                description: options.description.value
              };
            })
          };
        })
      };
      howWorks.unshift(howWorkStructure);
    });
    return howWorks;
  }

  getHeaderStructure(kenticoItem: any) {
    const header = {
      image: kenticoItem.header.value[0].image.value[0] ? kenticoItem.header.value[0].image.value[0].url : null,
      alt: kenticoItem.header.value[0].image.value[0] ? kenticoItem.header.value[0].image.value[0].description : null,
      title: kenticoItem.header.value[0].title.value ? kenticoItem.header.value[0].title.value : null,
      description: kenticoItem.header.value[0].description.value ? kenticoItem.header.value[0].description.value : null,
      scroll_to_top: kenticoItem.header.value[0].scroll_to_how_works.value ? kenticoItem.header.value[0].scroll_to_how_works.value : null
    };
    return header;
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
      scroll_to_top: header.scroll_to_top
    };
    return obj;
  }

  getQuotatorStructure(kenticoItem: any) {
    const quotatorContent = [];
    kenticoItem.quotator.value.map(item => {
      const quotatorStructure = {
        codice_fiscale: kenticoItem.quotator.codice_fiscale.text.value,
        calcola_preventivo: kenticoItem.quotator.calcola_preventivo.text.value,
        set_informativo: kenticoItem.quotator.set_informativo.title.value,
        product_collaboration: kenticoItem.quotator.prodotto_in_collaborazione.text.value,
        dedicata_alle_imprese: kenticoItem.quotator.dedicata_alle_imprese.title.value,
        icon_net: kenticoItem.quotator.prodotto_in_collaborazione.icon.value[0].url,
        modal_error_ateco: kenticoItem.quotator.modal_error_codice_ateco.title.value,
        modal_fiscal_vat_error: kenticoItem.quotator.fiscal_vat_error.text.value,
        title: kenticoItem.quotator.title.text.value,
        description_product: kenticoItem.quotator.description_product.text.value,
        items: item.benefit && item.benefit.value.map(coverage => {
          return {
            icon: coverage.icon.value[0].url,
            description: coverage.description.value
          };
        })
      };
      quotatorContent.push(quotatorStructure);
    });
    return quotatorContent;
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = this.getTenantLayoutClass();
      product.items = quotator.items && quotator.items.map(coverage => {
        return {
          description: coverage.description,
          icon: coverage.icon
        };

      });
    });
    return obj.container_1.products;
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

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      const orderedContentFromInsuranceService = contentFromInsuranceService.sort((a, b) => a.product_code > b.product_code ? -1 : 1);
      obj.container_1 = Object.assign({}, this.setContentToProduct(orderedContentFromInsuranceService, contentFromKentico.header));
      obj.container_2 = Object.assign({}, contentFromKentico.how_works, {product_code: codes});
      obj.container_3 = Object.assign({}, contentFromKentico.for_who);
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know, {product_code: 'multirisk'});
      obj.container_5 = Object.assign({}, contentFromKentico.faq);
      obj.container_6 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator[0]);
      const selectedProduct = orderedContentFromInsuranceService.find(product => product.isSelected);
      if (selectedProduct) {
        obj.container_1.selected_slide_id = `tab-${selectedProduct.product_code}`;
      }
      obj.container_1.container_class = [this.productCodes[0], this.getTenantLayoutClass()];
      obj.container_2.container_class = this.getTenantLayoutClass();
      obj.container_3.container_class = this.getTenantLayoutClass();
      obj.container_4.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_6.container_class = this.getTenantLayoutClass();
      return of(obj);
    }));
  }

}
