import {Injectable} from '@angular/core';
import {PreventivatoreContentProvider} from './preventivatore-content-provider.interface';
import {DataService, InsurancesService} from '@services';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import {Observable, of} from 'rxjs';
import {ContentInterface} from './content-interface';
import {map, switchMap, take} from 'rxjs/operators';
import {Product} from '@model';
import { PreventivatoreDynamicSharedFunctions } from './preventivatore-dynamic-shared-functions';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreCseBikeContentProvider implements PreventivatoreContentProvider {

  constructor(
    private insuranceService: InsurancesService,
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService
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
        package_title: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'package_title').text.value,
        price_title: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'price').text.value,
        slash_price: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'slash_month').text.value,
        product_collaboration: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'product_collaboration').text.value,
        information_package_text: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'information_package_text').text.value,
        continue_button_label: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'continue_button').text.value,
        price_annual_title: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'price_annual_title').text.value,
        price_month_title: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'price_month_title').text.value,
        currency: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'currency').text.value,
        europe_assistance_logo: kenticoItem.quotator.value.find(item =>
          item.system.codename === 'europe_assistance_logo').thumbnail.value[0].url,
      },
      how_works: this.getHowWorksStructure(codes, kenticoItem),
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
        title: kenticoItem.product_found.value.find(item =>
          item.system.codename === 'contacts_section').title.value,
        subtitle: kenticoItem.product_found.value.find(item =>
          item.system.codename === 'contacts_section').body.value,
        button_text: kenticoItem.product_found.value.find(item =>
          item.system.codename === 'contacts_button_label').text.value
      },
      for_who: {
        title: kenticoItem.who_is_for.value[0].title.value,
        body: kenticoItem.who_is_for.value[0].text.value
      },
    };
    return structure;
  }

  getHowWorksStructure(productCodes: string[], kenticoItem: any) {
    const selected_slide = productCodes.length === 1 ? productCodes[0] : 'ea-bike-easy';
    const howWorks = {
      title_section: kenticoItem.how_works.vantaggi_bike.title.value,
      selected_slide: selected_slide,
      product_content: this.getPolicyCoverages(kenticoItem)
    };
    return howWorks;
  }

  getPolicyCoverages(kenticoItem: any) {
    const policyCoverages = [];
    kenticoItem.how_works.value[0].benefits.value.map(benefit => {
      const recommended = benefit.campaign_info.value.length !== 0 && benefit.campaign_info.value[0].codename === 'recommended' ? true : false;
      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename.endsWith('bike_top') ? 'ea-bike-top' : 'ea-bike-easy',
        selected: recommended,
        recommended: recommended,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            text: guarantee.text.value,
            subitems: guarantee.subitems.value.map(subitem => subitem.text.value),
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
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = Object.assign({}, contentFromKentico);
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      obj.bg_img_hero = this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header);
      obj.bg_img_hero.container_class = this.getTenantLayoutClass();
      obj.bg_img_hero.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
      obj.more_info.container_class = this.getTenantLayoutClass();
      obj.more_info.button_redirect = '/assistenza';
      return of(obj);
    }));
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_bike').pipe
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
      product.price_title = quotator.price_title;
      product.slash_price = quotator.slash_price;
      product.continue_button_label = quotator.continue_button_label;
      product.product_collaboration = quotator.product_collaboration;
      product.information_package_text = quotator.information_package_text;
      product.provider_logo = quotator.europe_assistance_logo;
      product.price_annual_title = quotator.price_annual_title;
      product.price_annual = this.calcPriceAnnual(product.price);
      product.price_month_title = quotator.price_month_title;
      product.currency = quotator.currency;
      product.image = this.getSmallImage(product.images);
      product.container_class = this.getTenantLayoutClass();
      product.color_class = this.dataService.getProductColorClass(product);
    });
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


  calcPriceAnnual(price) {
    price = price * 12;
    return price.toFixed(2).toString().replace('.', ',');
  }
}
