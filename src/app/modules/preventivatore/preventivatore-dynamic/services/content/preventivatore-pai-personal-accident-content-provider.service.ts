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

@Injectable(
  {
    providedIn: 'root'
  }
)
export class PreventivatorePaiPersonalAccidentContentProvider
  implements PreventivatoreContentProvider {

  constructor(
    private insuranceService: InsurancesService,
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const quotatorErrors = [];
    kenticoItem.quotator_form_errors.value.forEach(item => {
      quotatorErrors[item.system.codename] = item.text.value;
    });
    const structure = {
      header: {
        image: kenticoItem.header.value[0].image.value[0].url,
        alt: kenticoItem.header.value[0].image.value[0].description,
        title: kenticoItem.header.value[0].title.value,
        subtitle: kenticoItem.header.value[0].description.value,
      },
      quotator: {
        product_collaboration: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'pai_accident_partner').product_collaboration.value,
        information_package_text: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'pai_accident_partner').info_package_link.value,
        continue_button_label: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'continue_accident_button').text.value,
        price_accident: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'price_accident').text.value,
        start_date_form: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'start_date_form').text.value,
        end_date_form: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'end_date_form').text.value,
        dates_disclaimer: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'dates_disclaimer').text.value,
        find_more_anchor: kenticoItem.quotator_product.value.find(item =>
            item.system.codename === 'find_more_anchor').text.value,
        drivers_number: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'drivers_number').text.value,
        single_driver_radio: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'single_driver_radio').text.value,
        multiple_drivers_radio: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'multiple_drivers_radio').text.value,
        single_insured_info: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'single_insured_info').text.value,
        errors: quotatorErrors
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
        set_informativo_content: kenticoItem.what_to_know_info_set.value.find(item =>
          item.system.codename === 'what_to_know_info_set').text.value
      },
      more_info: {
        title: kenticoItem.product_found.value.find(item =>
          item.system.codename === 'contacts_section').title.value,
        subtitle: kenticoItem.product_found.value.find(item =>
          item.system.codename === 'contacts_section').body.value,
        button_text: kenticoItem.product_found.value.find(item =>
          item.system.codename === 'contacts_button_label').text.value
      },
    };

    return structure;
  }

  getHowWorksStructure(productCodes: string[], kenticoItem: any) {
    const selected_slide = productCodes.length === 1 ? productCodes[0] : 'pai-personal-accident';
    const product_extra = productCodes.some(code => code === 'pai-personal-accident-extra') ? this.getExtraSlide(kenticoItem) : null;
    const product_simple = productCodes.some(code => code === 'pai-personal-accident') ? this.getNormalSlide(kenticoItem) : null;
    const product_content = [];
    if (product_extra) {
      product_content.push(product_extra);
    }
    if (product_simple) {
      product_content.push(product_simple);
    }
    const howWorks = {
      title_section: kenticoItem.benefits_title.value[0].text.value,
      selected_slide: selected_slide,
      product_content: product_content
    };
    return howWorks;
  }
  getExtraSlide(kenticoItem: any) {
    return {
      name: kenticoItem.title_extra.value[0].text.value,
      product_code: 'pai-personal-accident-extra',
      selected: true,
      recommended: true,
      items_list:
        kenticoItem.benefits_extra.value.map(benefit => {
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
  getNormalSlide(kenticoItem: any) {
    return {
      name: kenticoItem.title_normal.value[0].text.value,
      product_code: 'pai-personal-accident',
      selected: false,
      recommended: false,
      items_list: kenticoItem.benefits_normal.value.map(benefit => {
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

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = Object.assign({}, contentFromKentico);
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      obj.bg_img_hero = this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header);
      obj.bg_img_hero.container_class = this.getTenantLayoutClass();
      obj.bg_img_hero.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
      obj.how_works.container_class = this.getTenantLayoutClass();
      obj.what_to_know.container_class = this.getTenantLayoutClass();
      obj.more_info.container_class = this.getTenantLayoutClass();
      const selectedProduct = contentFromInsuranceService.find(product => product.isSelected);
    if (selectedProduct) {
      obj.bg_img_hero.selected_slide_id = `tab-${selectedProduct.product_code}`;
    }
      return of(obj);
    }));
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_pai_accident').pipe
      (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.subtitle,
      bg_img: header.image,
      img_alt: header.alt
    };
    return obj;
  }

  private setColorClassToProducts(obj: ContentInterface, quotator: any) {
    obj.bg_img_hero.products.forEach(product => {
      product.package_title = quotator.package_title;
      product.continue_button_label = quotator.continue_button_label;
      product.price_accident = quotator.price_accident;
      product.product_collaboration = quotator.product_collaboration;
      product.start_date_form = quotator.start_date_form;
      product.end_date_form = quotator.end_date_form;
      product.dates_disclaimer = quotator.dates_disclaimer;
      product.find_more_anchor = quotator.find_more_anchor;
      product.drivers_number = quotator.drivers_number;
      product.single_driver_radio = quotator.single_driver_radio;
      product.multiple_drivers_radio = quotator.multiple_drivers_radio;
      product.single_insured_info = quotator.single_insured_info;
      product.errors = quotator.errors;
      product.information_package_text = quotator.information_package_text;
      product.provider_logo = 'assets/images/partners/europassistancesvg.svg';
      product.image = this.getSmallImage(product.images);
      product.container_class = this.getTenantLayoutClass();
      product.selected_values = {};
      product.isSelected = product.product_code === 'pai-personal-accident';
    });
    obj.bg_img_hero.products[0].selected_values.focus = true;
    const orderedListProducts = obj.bg_img_hero.products.sort((a, b) => (a.product_code < b.product_code) ? 1 : -1);
    obj.bg_img_hero.products = orderedListProducts;
    return obj.bg_img_hero.products;
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
