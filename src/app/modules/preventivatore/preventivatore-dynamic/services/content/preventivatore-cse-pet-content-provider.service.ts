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
export class PreventivatoreCsePetContentProvider
  implements PreventivatoreContentProvider {

  constructor(
    private insuranceService: InsurancesService,
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const structure = {
      header: {
        image: kenticoItem.header.value[0].image.value[0].url,
        alt: kenticoItem.header.value[0].image.value[0].description,
        title: kenticoItem.header.value[0].title.value,
        subtitle: kenticoItem.header.value[0].description.value,
      },
      quotator: {
        package_title: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'package_title').text.value,
        price_title: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'price').text.value,
        slash_price: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'slash_month').text.value,
        product_collaboration: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'pet_partner').product_collaboration.value,
        information_package_text: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'pet_partner').info_package_link.value,
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
        policy_note_content: kenticoItem.what_to_know_info_set.value.find(item =>
          item.system.codename === 'what_to_know_note').text.value,
        set_informativo_content: kenticoItem.what_to_know_info_set.value.find(item =>
          item.system.codename === 'what_to_know_info_set').text.value
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
    const selected_slide = productCodes.length === 1 ? productCodes[0] : 'net-pet-gold';
    const product_gold = productCodes.some(code => code === 'net-pet-gold') ? this.getGoldSlide(kenticoItem) : null;
    const product_silver = productCodes.some(code => code === 'net-pet-silver') ? this.getSilverSlide(kenticoItem) : null;
    const product_content = [];
    if (product_gold) {
      product_content.push(product_gold);
    }
    if (product_silver) {
      product_content.push(product_silver);
    }
    const howWorks = {
      title_section: kenticoItem.benefits_title.value[0].text.value,
      selected_slide: selected_slide,
      product_content: product_content
    };
    return howWorks;
  }
  getGoldSlide(kenticoItem: any) {
    return {
      name: kenticoItem.benefits_title_gold.value[0].text.value,
      product_code: 'net-pet-gold',
      selected: true,
      recommended: true,
      items_list:
        kenticoItem.benefits_gold.value.map(benefit => {
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
  getSilverSlide(kenticoItem: any) {
    return {
      name: kenticoItem.benefits_title_silver.value[0].text.value,
      product_code: 'net-pet-silver',
      selected: false,
      recommended: false,
      items_list: kenticoItem.benefits_silver.value.map(benefit => {
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
      obj.bg_img_hero.container_class = PreventivatoreDynamicSharedFunctions.setContainerClass(obj.bg_img_hero.products);
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
    return this.kenticoTranslateService.getItem('preventivatore_pet').pipe
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
      product.provider_logo = 'assets/images/logos/net-logo.svg';
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
}
