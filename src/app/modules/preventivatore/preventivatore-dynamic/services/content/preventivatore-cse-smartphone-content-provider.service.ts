import { forkJoin, Observable, of } from 'rxjs';
import { ContentInterface } from './content-interface';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { map, switchMap, take } from 'rxjs/operators';
import { InsurancesService } from 'app/core/services/insurances.service';
import { Product } from 'app/core/models/insurance.model';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';
import { PreventivatoreDynamicSharedFunctions } from './preventivatore-dynamic-shared-functions';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class PreventivatoreCseSmartphoneContentProvider
  implements PreventivatoreContentProvider {

  constructor(private insuranceService: InsurancesService
    , private dataService: DataService
    , private kenticoTranslateService: KenticoTranslateService
  ) {

  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const structure = {
      header: {
        image: kenticoItem.header.value[0].image.value[0].url,
        alt: kenticoItem.header.value[0].image.value[0].description,
        title: kenticoItem.header.value[0].title.value,
        subtitle: kenticoItem.header.value[0].description.value,
      },
      quotator: {
        form___value: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'form___value').text.value,
        form_select: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'form_select').text.value,
        form_brand: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'form_brand').text.value,
        form_model: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'form_model').text.value,
        price_title: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'price').text.value,
        slash_price: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'slash_month').text.value,
        product_collaboration: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'smartphone_partner').product_collaboration.value,
        information_package_text: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'smartphone_partner').info_package_link.value,
        continue_button_label: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'continue_button').text.value,
      },
      how_works: this.getHowWorksStructure(codes, kenticoItem),
      what_to_know: {
        title_section: kenticoItem.what_to_know_title.value[0].text.value,
        slider_content: kenticoItem.what_to_know_description.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        }),
        terms_of_service_content: kenticoItem.what_to_know_info_set.value.find(item =>
          item.system.codename === 'what_to_know_smartphone_terms_of_service').text.value
      },
      more_info: {
        title: kenticoItem.product_found_section.value.find(item =>
          item.system.codename === 'contacts_section').title.value,
        subtitle: kenticoItem.product_found_section.value.find(item =>
          item.system.codename === 'contacts_section').body.value,
          button_text: kenticoItem.product_found_section.value.find(item =>
          item.system.codename === 'contacts_button_label').text.value
      },
      for_who: {
        title: kenticoItem.product_for_who.value[0].title.value,
        body: kenticoItem.product_for_who.value[0].body.value
      },
    };

    return structure;
  }

  getHowWorksStructure(productCodes: string[], kenticoItem: any) {
    const selected_slide = productCodes.length === 1 ? productCodes[0] : 'chubb-devices';
    const product_card_1 = productCodes.some(code => code === 'chubb-devices') ? this.getSerenitySlide(kenticoItem) : null;
    const product_card_2 = productCodes.some(code => code === 'chubb-devices') ? this.getCardTwoSlide(kenticoItem) : null;
    const product_content = [];
    if (product_card_1) {
      product_content.push(product_card_1);
    }
    if (product_card_2) {
      product_content.push(product_card_2);
    }
    const howWorks = {
      title_section: kenticoItem.benefits_title.value[0].text.value
      , selected_slide: selected_slide
      , product_content: product_content
    };
    return howWorks;
  }
  getSerenitySlide(kenticoItem: any) {
    return {
      name: kenticoItem.title_benefit_card.value[0].text.value,
      product_code: kenticoItem.title_benefit_card.value[0].system.codename,
      selected: true,
      included: false,
      items_list:
        kenticoItem.benefit_card.value.map(benefit => {
          return {
            text: benefit.text.value,
            subitems: benefit.subitems.value.map(subitem => {
              return subitem.text.value;
            }),
            included: benefit.included.value.some(value => value.name === 'included'),
          };
        })
    };
  }
  getCardTwoSlide(kenticoItem: any) {
    return {
      name: kenticoItem.title_benefit_card_2.value[0].text.value,
      product_code: kenticoItem.title_benefit_card_2.value[0].system.codename,
      selected: false,
      included: true,
      items_list: kenticoItem.benefit_card_2.value.map(benefit => {
        return {
          text: benefit.text.value,
          subitems: benefit.subitems.value.map(subitem => {
            return subitem.text.value;
          }),
          included: benefit.included.value.some(value => value.name === 'included'),
        };
      })
    };
  }

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }


  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = Object.assign({}, contentFromKentico);
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      obj.bg_img_hero = this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header);
      obj.bg_img_hero.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
      obj.bg_img_hero.container_class = PreventivatoreDynamicSharedFunctions.setContainerClass(obj.bg_img_hero.products).concat(' ', this.getTenantLayoutClass());
      obj.how_works.container_class = this.getTenantLayoutClass();
      obj.what_to_know.container_class = this.getTenantLayoutClass();
      obj.for_who.container_class = this.getTenantLayoutClass();
      obj.more_info.container_class = this.getTenantLayoutClass();
      obj.more_info.button_redirect = '/assistenza';
      return of(obj);
    }));
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_smartphone').pipe
      (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    const obj = {
      products: contentFromInsuranceService
      , title: header.title
      , subtitle: header.subtitle
      , bg_img: header.image
      , img_alt: header.alt
    };
    return obj;
  }

  private setColorClassToProducts(obj: ContentInterface, quotator: any) {
    obj.bg_img_hero.products.forEach(product => {
      product.form___value = quotator.form___value;
      product.form_select = quotator.form_select;
      product.form_brand = quotator.form_brand;
      product.form_model = quotator.form_model;
      product.price_title = quotator.price_title;
      product.slash_price = quotator.slash_price;
      product.continue_button_label = quotator.continue_button_label;
      product.product_collaboration = quotator.product_collaboration;
      product.information_package_text = quotator.information_package_text;
      product.provider_logo = 'assets/images/logos/sara-logo.png';
      product.image = this.getSmallImage(product.images);
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = this.getTenantLayoutClass();
    });
    return obj.bg_img_hero.products;
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
