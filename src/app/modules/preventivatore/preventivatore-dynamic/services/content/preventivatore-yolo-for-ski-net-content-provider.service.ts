import {Observable, of} from 'rxjs';
import {ContentInterface} from './content-interface';
import {Injectable} from '@angular/core';
import {map, switchMap} from 'rxjs/operators';
import {Product} from 'app/core/models/insurance.model';
import {DataService} from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {PreventivatoreContentProvider} from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreYoloForSkiNetContentProviderService implements PreventivatoreContentProvider {
  public productCodes = ['yolo-for-ski'];
  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }


  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_ski_net').pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'bottone___continua_0bf98fa').text.value,
        coverage_duration: kenticoItem.quotator.value.find(item => item.system.codename === 'durata_della_copertura').text.value,
        logo_net: kenticoItem.quotator.value.find(item => item.system.codename === 'logo_net').thumbnail.value[0].url,
        prodotto_in_collaborazione_con: kenticoItem.quotator.value.find(item => item.system.codename === 'prodotto_in_collaborazione_con').text.value,
        insured_persons_number: kenticoItem.quotator.value.find(item => item.system.codename === 'seleziona_il_numero_di_assicurati').text.value,
        variants_type_label: kenticoItem.quotator.value.find(item => item.system.codename === 'seleziona_il_numero_di_giorni').text.value,
        set_informativo: kenticoItem.quotator.value.find(item => item.system.codename === 'set_informativo_2').title.value,
        totale: kenticoItem.quotator.value.find(item => item.system.codename === 'totale').text.value,
        daily: kenticoItem.quotator.value.find(item => item.system.codename === 'daily').text.value,
        seasonal: kenticoItem.quotator.value.find(item => item.system.codename === 'seasonal').text.value,
        do_a_preventive:  kenticoItem.quotator.value.find(item => item.system.codename === 'go_to_preventive').text.value
      },
      how_works: {
        title_section: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_yolo_for_ski').title.value,
        product_content: this.getPolicyCoverages(kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_yolo_for_ski').container),
        img_open: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_yolo_for_ski').icon_open.value[0].url,
        premium_protection: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_yolo_for_ski').platinum_protection.value,
        premium_protection_logo: kenticoItem.how_works.value.find(item => item.system.codename === 'container_for_accordion_yolo_for_ski').platinum_protection_logo.value[0].url
      },
      what_to_know: {
        title_section: kenticoItem.what_to_know.perche_scegliere_yolo_for_ski_.title.value,
        slider_content: kenticoItem.what_to_know.perche_scegliere_yolo_for_ski_.infocards.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url
          };
        }),
        set_informativo_content: kenticoItem.what_to_know.perche_scegliere_yolo_for_ski_.information_package ? kenticoItem.what_to_know.perche_scegliere_yolo_for_ski_.information_package.value : null
      },
      faq: {
        enabled: kenticoItem.common_questions.value[0].enabled.value.length
        ? kenticoItem.common_questions.value[0].enabled.value.some(value => value.codename === 'true')
        : false,
        title: kenticoItem.common_questions.value[0].title.value,
        faqs: this.getFaqStructure(kenticoItem.common_questions.container_faqs_ski.faqs.value),
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
        title: kenticoItem.more_info.more_info_label.title.value,
        subtitle: kenticoItem.more_info.more_info_label.body.value,
        button_text: kenticoItem.more_info.bottone___contattaci.text.value
      }
    };
    return structure;
  }

  getHeaderStructure(kenticoItem: any) {
    const header = {
      image: kenticoItem.header.header_yolo_for_ski.image.value ?
      kenticoItem.header.header_yolo_for_ski.image.value[0].url : null,
      alt: kenticoItem.header.header_yolo_for_ski.image.value ?
      kenticoItem.header.header_yolo_for_ski.image.value.description : null,
      title: kenticoItem.header.header_yolo_for_ski.title.value ?
      kenticoItem.header.header_yolo_for_ski.title.value : null,
      description: kenticoItem.header.header_yolo_for_ski.description.value ?
      kenticoItem.header.header_yolo_for_ski.description.value : null

    };
    return header;
  }


  getPolicyCoverages(benefits: any) {
    const policyCoverages = [];
    benefits.value.map(benefit => {
      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename.endsWith('ski_gold') ? 'yolo-for-ski-gold' : 'yolo-for-ski-platinum',
        ribbon: benefit.campaign_info.value.length && benefit.campaign_info.value[0].name ? benefit.campaign_info.value[0].name : null,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            text: guarantee.text.value,
            value: guarantee.value.value,
            included: guarantee.included.value.some(value => value.codename === 'included'),
            subitems_list: guarantee.subitems.value.map(subitem => {
              return{
                name: subitem.title.value
              };
            })
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
      obj.container_3 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_4 = Object.assign({}, contentFromKentico.faq);
      obj.container_5 = Object.assign({}, contentFromKentico.more_info);
      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      const selectedProduct = contentFromInsuranceService.find(product => product.isSelected);
      if (selectedProduct) {
        obj.container_1.selected_slide_id = `tab-${selectedProduct.product_code}`;
      }
      obj.container_1.container_class = [this.productCodes[0], this.getTenantLayoutClass()];
      obj.container_2.container_class = this.getTenantLayoutClass();
      obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_4.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_5.container_class = [this.getTenantLayoutClass()].concat(codes);
      return of(obj);
    }));
  }

  private includeCollapseAttributes(kenticoItem: any) {
    const container = document.createElement('div');
    container.innerHTML = kenticoItem.who_is_for.value[0].text.value;

    const a = container.querySelector('a');
    const itemId = a.getAttribute('data-item-id');
    const coveredCountriesId = kenticoItem.who_is_for.value[0].text.links.find(link => link.linkId === itemId).codename;
    a.removeAttribute('data-item-id');
    a.removeAttribute('data-new-window');
    a.removeAttribute('rel');
    a.setAttribute('href', `#${coveredCountriesId}`);
    a.setAttribute('data-toggle', 'collapse');
    a.setAttribute('aria-controls', 'collapse');
    a.setAttribute('aria-expanded', 'false');
    a.setAttribute('role', 'button');
    a.setAttribute('style', `color: var(--primary-title-color,#333); text-decoration: unset; cursor: pointer;`);

    const parent = a.parentElement;
    const coveredCountriesDiv = document.createElement('div');
    coveredCountriesDiv.setAttribute('id', `${coveredCountriesId}`);
    coveredCountriesDiv.setAttribute('class', 'col-12 collapse');
    coveredCountriesDiv.innerHTML = kenticoItem.who_is_for.value.find(item => item.system.codename === `${coveredCountriesId}`).text.value;
    parent.parentElement.appendChild(coveredCountriesDiv);
    return container.innerHTML;
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
      product.continue_button_label = quotator.continue_button_label;
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = [this.productCodes[0], this.getTenantLayoutClass()];
      product.isSelected = product.product_code === 'yolo-for-ski-gold';
      product.coverage_duration = quotator.coverage_duration;
      product.coverage_duration = quotator.coverage_duration;
      product.logo_net = quotator.logo_net;
      product.prodotto_in_collaborazione_con = quotator.prodotto_in_collaborazione_con;
      product.insured_persons_number = quotator.insured_persons_number;
      product.do_a_preventive = quotator.do_a_preventive;
      product.variants_type_label = quotator.variants_type_label;
      product.set_informativo = quotator.set_informativo;
      product.totale = quotator.totale;
      product.daily = quotator.daily;
      product.seasonal = quotator.seasonal;
    });
    return obj.container_1.products;
  }
  getFaqStructure(kenticoItem: any) {
    let faqsFromKentico: any[] = kenticoItem.map(item => {
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

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }
}
