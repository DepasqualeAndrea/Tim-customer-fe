import { forkJoin, Observable, of } from 'rxjs';
import { ContentInterface } from './content-interface';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { map, switchMap, take } from 'rxjs/operators';
import { Product } from 'app/core/models/insurance.model';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class PreventivatoreTiresStandardPlusContentProvider
  implements PreventivatoreContentProvider {
  constructor(private dataService: DataService
    , private kenticoTranslateService: KenticoTranslateService
  ) {

  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_tires_standard_and_plus').pipe
      (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const structure = {
      header: {
        image: kenticoItem.header.value[0].image.value[0].url,
        alt: kenticoItem.header.value[0].image.value[0].description,
        title: kenticoItem.header.value[0].title.value,
      },
      quotator: {
        standard_name: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'product_standard_name').text.value,
        plus_name: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'product_plus_name').text.value,
        standard_description: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'product_standard_description').text.value,
        plus_description: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'product_standard_description').text.value,
        product_collaboration: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'tires_covered_partner').product_collaboration.value,
        provider_logo: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'covea_logo').thumbnail.value[0].url,
        information_package_text: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'tires_covered_partner').info_package_link.value,
        continue_button_label: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'tires_continue_button').text.value,
        price_title: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'total_prize').text.value,
        formated_price: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'formated_price').text.value,
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
          item.system.codename === 'what_to_know_info_set_tires_std_plus').text.value
      }
    };
    return structure;
  }

  getHowWorksStructure(productCodes: string[], kenticoItem: any) {
    const selected_slide = productCodes.length === 1 ? productCodes[0] : 'covea-tires-covered-plus';
    const product_standard = productCodes.some(code => code === 'covea-tires-covered-standard') ? this.getStandardSlide(kenticoItem) : null;
    const product_plus = productCodes.some(code => code === 'covea-tires-covered-plus') ? this.getPlusSlide(kenticoItem) : null;
    const product_content = [];
    if (product_standard) {
      product_content.push(product_standard);
    }
    if (product_plus) {
      product_content.push(product_plus);
    }
    const howWorks = {
      title_section: kenticoItem.benefits_title.value[0].text.value
      , selected_slide: selected_slide
      , product_content: product_content
    };
    return howWorks;
  }
  getPlusSlide(kenticoItem: any) {
    return {
      name: kenticoItem.title_extra.value[0].text.value,
      product_code: 'covea-tires-covered-plus',
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
  getStandardSlide(kenticoItem: any) {
    return {
      name: kenticoItem.title_normal.value[0].text.value,
      product_code: 'covea-tires-covered-standard',
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
        const orderedContentFromInsuranceService = contentFromInsuranceService.sort((a, b) => a.product_code > b.product_code ? -1 : 1);
        obj.bg_img_hero = this.setContentToProduct(orderedContentFromInsuranceService, contentFromKentico.header);
        obj.bg_img_hero.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
        obj.bg_img_hero.container_class = this.getTenantLayoutClass();
        obj.how_works.container_class = this.getTenantLayoutClass();
        obj.what_to_know.container_class = this.getTenantLayoutClass();
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

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.bg_img_hero.products.forEach(product => {
      product.quotator_name = product.product_code === 'covea-tires-covered-standard' ? quotator.standard_name : quotator.plus_name;
      product.description = product.product_code === 'covea-tires-covered-standard' ? quotator.standard_description : quotator.plus_description;
      product.price_title = quotator.price_title;
      product.continue_button_label = quotator.continue_button_label;
      product.product_collaboration = quotator.product_collaboration;
      product.information_package_text = quotator.information_package_text;
      product.provider_logo = quotator.provider_logo;
      product.isSelected = product.product_code === 'covea-tires-covered-plus';
      product.price_to_display = this.setFormatedPrice(quotator.formated_price, product.price);
    });
    return obj.bg_img_hero.products;
  }

  setFormatedPrice(priceFormatFromKentico, price) {
    const decimalPrice = price.toFixed(2);
    return priceFormatFromKentico.replace(/{{price}}/i, decimalPrice);
  }

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }
}
