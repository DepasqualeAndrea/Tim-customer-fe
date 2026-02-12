import {Injectable} from '@angular/core';
import {Product} from '@model';
import {DataService} from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ContentInterface} from './content-interface';
import {PreventivatoreContentProvider} from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreYoloViaggioContentProvider implements PreventivatoreContentProvider {

  private productCodes = ['axa-assistance'];

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_viaggio').pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: this.getQuotatorStructure(kenticoItem),
      how_works: {
        title: kenticoItem.title.value,
        how_works_viaggio: this.getHowWorksStructure(kenticoItem),
        open_modal: kenticoItem.open_modal.value,
        set_info: kenticoItem.set_info.value,
        info: kenticoItem.info.value
      },
      more_info: this.getGaranzieAggiuntiveStructure(kenticoItem),
      what_to_know: {
        title_section: kenticoItem.title_what_to_know.value,
        slider_content: this.getWhatToknowStructure(kenticoItem)
      },
      faq: {
        faqs: this.getFaqStructure(kenticoItem)
      },
      contact_us: {
        title: kenticoItem.product_found.need_more_info.title.value,
        subtitle: kenticoItem.product_found.need_more_info.body.value,
        button_text: kenticoItem.product_found.value.find(item => item.system.codename === 'contacts_button_label').text.value
      }
    };
    return structure;
  }

  getFaqStructure(kenticoItem: any) {
    const faqStructure = [];
    kenticoItem.common_questions.value.map((questions) => {
      const faqContent = {
        container_faqs: questions.container_faqs.value.map((container) => {
          return {
            title: container.title.value,
            icon_opened: container.icon_opened.value[0].url,
            icon_closed: container.icon_closed.value[0].url,
            icon_card_opened: container.icon_card_opened.value[0].url,
            icon_card_closed: container.icon_card_closed.value[0].url,
            faqs: container.faqs.value.map((faqs) =>{
              return{
                id: faqs.id.value,
                question: faqs.question.value,
                answer: faqs.answer.value
              };
            })
          };
        })
      };
      faqStructure.unshift(faqContent);
    });
    return faqStructure;
  }

  getWhatToknowStructure(infoCards: any) {
    const image: any[] = infoCards.what_to_know.value.map(img => {
      return {
        img: img.image.value[0].url,
        img_alt: img.image.value[0].description,
        text: img.body.value
      };
    });
    return image;
  }

  getMoreInfoStructure(kenticoItem: any) {
    let moreInfo: any[] = kenticoItem.more_info.value.map((item) => {
      return {
        title: item.title.value,
        body: item.body.value
      };
    });
    return moreInfo;
  }

  getHowWorksStructure(kenticoItem: any) {
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

  getQuotatorStructure(kenticoItem: any) {
    const quotatorContent = [];
    kenticoItem.quotator.value.map(item => {
      const quotatorStructure = {
        set_info: item.set_info.value,
        logo: item.logo.value[0].url,
        description: item.description.value,
        price: item.total.value,
        button: item.button.value,
        label_date: item.label_date.value,
        label_insurance: item.label_insurance.value,
        label_destination: item.label_destination.value,
        label_start: item.label_start.value,
        label_end: item.label_end.value,
        arrow_logo: item.arrow.value[0].url,
        badge: item.badge.value,
        title: item.title.value,
        items: item.quotator.value.map(items => {
          return {
            coverages: items.coverages.value.map(coverage => {
              return {
                title: coverage.title.value,
                benefit: coverage.benefit.value.map(benefit => {
                  return {
                    icon: benefit.icon.value[0].url,
                    description: benefit.description.value
                  };
                })
              };
            })
          };
        }),
      };
      quotatorContent.unshift(quotatorStructure);
    });
    return quotatorContent;
  }

  getHeaderStructure(kenticoItem: any) {
    const header = {
      image: kenticoItem.header.value[0].image.value[0] ? kenticoItem.header.value[0].image.value[0].url : null,
      alt: kenticoItem.header.value[0].image.value[0] ? kenticoItem.header.value[0].image.value[0].description : null,
      title: kenticoItem.header.value[0].title.value ? kenticoItem.header.value[0].title.value : null,
      description: kenticoItem.header.value[0].description.value ? kenticoItem.header.value[0].description.value : null
    };
    return header;
  }

  getGaranzieAggiuntiveStructure(kenticoItem: any) {
    const more_info = {
      title: kenticoItem.title_more_info.value ? kenticoItem.title_more_info.value : null,
      more_info: kenticoItem.more_info.value ? kenticoItem.more_info.value : null,
    };
    return more_info;
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
      product.container_class = this.getTenantLayoutClass();
      product.isSelected = product.product_code === 'axa-assistance-silver';
      product.items = quotator.items[0].coverages.map(coverage => {
        return {
          title: coverage.title,
          benefit: coverage.benefit.map(benefits => {
            return {
              description: benefits.description,
              icon: benefits.icon
            };
          }),
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
      obj.container_3 = Object.assign({}, contentFromKentico.more_info);
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_5 = Object.assign({}, contentFromKentico.faq);
      obj.container_6 = Object.assign({}, contentFromKentico.contact_us);

      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator[0]);
      const selectedProduct = orderedContentFromInsuranceService.find(product => product.isSelected);
      if (selectedProduct) {
        obj.container_1.selected_slide_id = `tab-${selectedProduct.product_code}`;
      }
      obj.container_1.container_class = [this.productCodes[0], this.getTenantLayoutClass()];
      obj.container_2.container_class = this.getTenantLayoutClass();
      obj.container_3.container_class = this.getTenantLayoutClass();
      obj.container_4.container_class = this.getTenantLayoutClass();
      obj.container_5.container_class = this.getTenantLayoutClass();
      obj.container_6.container_class = this.getTenantLayoutClass();
      return of(obj);
    }));
  }

}
