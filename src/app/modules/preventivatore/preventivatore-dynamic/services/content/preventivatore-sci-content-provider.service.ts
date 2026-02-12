import {Observable, of} from 'rxjs';
import {ContentInterface} from './content-interface';
import {Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {map, switchMap} from 'rxjs/operators';
import {Product} from 'app/core/models/insurance.model';
import {DataService} from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {PreventivatoreContentProvider} from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreSciContentProvider implements PreventivatoreContentProvider {
  private productCodes = ['erv-mountain'];

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        package_title: kenticoItem.quotator.value.find(item => item.system.codename === 'package_title').text.value,
        variants_type_label: kenticoItem.quotator.value.find(item => item.system.codename === 'variants_type_label').text.value,
        price_title: kenticoItem.quotator.value.find(item => item.system.codename === 'price').text.value,
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'continue_button').text.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'information_package_text').text.value,
        product_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'product_collaboration').text.value,
        provider_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'ergo_logo').thumbnail.value[0].url
      },
      how_works: this.getHowWorksStructure(kenticoItem),
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
        policy_note_content: kenticoItem.what_to_know.value[0].additional_info.value,
        set_informativo_content: kenticoItem.what_to_know.value[0].information_package.value
      },
      more_info: {
        title: kenticoItem.product_found.need_more_info.title.value,
        subtitle: kenticoItem.product_found.need_more_info.body.value,
        button_text: kenticoItem.product_found.value.find(item => item.system.codename === 'contacts_button_label').text.value
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
        : null
    };
    return header;
  }

  getHowWorksStructure(kenticoItem: any) {
    const selected_slide = 'erv-mountain-gold';
    const howWorks = {
      title_section: kenticoItem.how_works.value[0].title.value,
      text_section: kenticoItem.how_works.value[0].text.value,
      selected_slide: selected_slide,
      product_content: this.getPolicyCoverages(kenticoItem)
    };
    return howWorks;
  }

  getPolicyCoverages(kenticoItem: any) {
    const policyCoverages = [];
    kenticoItem.how_works.value[0].benefits.value.map(benefit => {
      const recommended = benefit.campaign_info.value.length && benefit.campaign_info.value[0].codename === 'recommended' ? true : false;
      const included = benefit.campaign_info.value.length && benefit.campaign_info.value[0].codename === 'included' ? true : false;
      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename.endsWith('sci_gold') ? 'erv-mountain-gold' : 'erv-mountain-silver',
        selected: recommended,
        recommended: recommended,
        included: included,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            text: guarantee.text.value,
            subitems_list: guarantee.subitems.value.some(subitem => subitem.included.value.length),
            subitems: guarantee.subitems.value.map(subitem => {
              return {
                text: subitem.text.value,
                included: subitem.included.value.some(value => value.codename === 'included')
              };
            }),
            included: guarantee.included.value.some(value => value.codename === 'included')
          };
        })
      };
      policyCoverages.unshift(policyCoverage);
    });
    return policyCoverages;
  }

  getWhoIsFor(kenticoItem: any) {
    const whoIsFor = {
      title: kenticoItem.who_is_for.value[0].title.value,
      body: this.includeCollapseAttributes(kenticoItem),
      sanitize: true
    };
    return whoIsFor;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      const orderedContentFromInsuranceService = contentFromInsuranceService.sort((a, b) => a.product_code > b.product_code ? -1 : 1);
      obj.container_1 = Object.assign({}, this.setContentToProduct(orderedContentFromInsuranceService, contentFromKentico.header));
      obj.container_2 = Object.assign({}, contentFromKentico.how_works);
      obj.container_3 = Object.assign({}, contentFromKentico.for_who);
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_5 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      const selectedProduct = orderedContentFromInsuranceService.find(product => product.isSelected);
      if (selectedProduct) {
        obj.container_1.selected_slide_id = `tab-${selectedProduct.product_code}`;
      }
      obj.container_1.container_class = [this.productCodes[0], this.getTenantLayoutClass()];
      obj.container_2.container_class = this.getTenantLayoutClass();
      obj.container_3.container_class = this.getTenantLayoutClass();
      obj.container_4.container_class = this.getTenantLayoutClass();
      obj.container_5.container_class = this.getTenantLayoutClass();
      obj.container_5.button_redirect = this.getMoreInfoButtonRedirect();

      return of(obj);
    }));
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_sci').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
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
      product.package_title = quotator.package_title;
      product.variants_type_label = quotator.variants_type_label;
      product.price_title = quotator.price_title;
      product.continue_button_label = quotator.continue_button_label;
      product.information_package_text = quotator.information_package_text;
      product.product_collaboration = quotator.product_collaboration;
      product.provider_logo = quotator.provider_logo;
      product.image = this.getSmallImage(product.images);
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = this.getTenantLayoutClass();
      product.isSelected = product.product_code === 'erv-mountain-gold';
    });
    return obj.container_1.products;
  }

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }

  private getMoreInfoButtonRedirect() {
    if (this.dataService.tenantInfo.tenant === 'bancapc-it-it_db' || this.dataService.tenantInfo.tenant === 'civibank_db') {
      return '/assistenza';
    }
    return;
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
