import { PreventivatoreDynamicSharedFunctions } from './../../preventivatore-dynamic-shared-functions';
import { DataService } from './../../../../../../../core/services/data.service';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ContentInterface } from '../../content-interface';
import { Product } from '@model';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreTimEmployeesMyPetContentProviderService {

  @Output() actionEvent = new EventEmitter<any>();

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService,
  ) { }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_mypet').pipe
      (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      hero: {
        title: kenticoItem.title.value,
        subtitle: kenticoItem.subtitle_hero.value,
        button_text: kenticoItem.cta.value,
        button_link: kenticoItem.hero_cta_link.value,
        img: kenticoItem.product_img.value[0]
          ? kenticoItem.product_img.value[0].url
          : null,
        purchase_bar: {
          tag: kenticoItem.purchase_bar.value[0].tag.value[0]
            ? kenticoItem.purchase_bar.value[0].tag.value[0].name
            : null,
          product_name: kenticoItem.purchase_bar.value[0].product_name.value,
          price_title: kenticoItem.purchase_bar.value[0].price_title.value,
          purchase_button: kenticoItem.purchase_bar.value[0].purchase_button.value
        }
      },
      how_works: {
        title: kenticoItem.how_works_title.value,
        bg_img: kenticoItem.how_works_bg_img.value[0].url,
        list: kenticoItem.how_works_list.value.map(item => {
          return {
            title: item.title.value,
            description: item.description.value
          };
        }),
        cta_text: kenticoItem.how_works_cta.value,
      },
      available_products_slider: {
        bg_img: kenticoItem.available_products_bg_img.value[0]
          ? kenticoItem.available_products_bg_img.value[0].url
          : null,
        bg_img_alt: kenticoItem.available_products_bg_img.value[0]
          ? kenticoItem.available_products_bg_img.value[0].description
          : null,
        title: kenticoItem.available_products_title.value,
        list: kenticoItem.available_products_list.value.map(item => {
          return {
            id: item.system.codename,
            title: item.title.value,
            description: item.description.value,
            cta_text: item.cta_text.value,
            cta_link: item.cta_link.value
          };
        })
      },
      what_to_know: {
        title: kenticoItem.what_to_know_title.value,
        list: kenticoItem.what_to_know_list.value.map(item => {
          return {
            title: item.title.value,
            description: item.description.value
          };
        })
      },
      activate_offer_agency: {
        title_activation_agency: kenticoItem.title_activate_offer_agency.value,
        subtitle_activation_agency: kenticoItem.subtitle_activate_offer_agency.value,
        title_find_agency: kenticoItem.title_find_agency.value,
        subtitle_find_agency: kenticoItem.subtitle_find_agency.value,
        button_list: kenticoItem.find_button_list.value.map(item => {
          return {
            title: item.title.value,
            link: item.text.value
          };
        })
      }
    };
    return structure;
  }

  getPurchaseBar(kenticoItem) {
    const purchaseBar = {
      tag: kenticoItem.tag.value[0].name.value,
      product_name: kenticoItem.product_name.value,
      price_title: kenticoItem.price_title.value,
      purchase_button: kenticoItem.purchase_button.value
    };
    return purchaseBar;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      obj.container_1 = Object.assign({}, { products: contentFromInsuranceService }, contentFromKentico.hero);
      obj.container_2 = Object.assign({}, contentFromKentico.how_works);
      obj.container_3 = Object.assign({}, contentFromKentico.available_products_slider);
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_5 = Object.assign({}, contentFromKentico.activate_offer_agency);

      obj.container_1.products = this.setExtraContentToProduct(obj);
      obj.container_1.checkout_action = this.createCheckoutAction(contentFromInsuranceService[0]);
      obj.container_2.checkout_action = this.createCheckoutAction(contentFromInsuranceService[0]);
      obj.container_3.container_class = PreventivatoreDynamicSharedFunctions.setContainerClass(contentFromInsuranceService);
      obj.container_5.container_class = PreventivatoreDynamicSharedFunctions.setContainerClass(contentFromInsuranceService);
      return of(obj);
    }));
  }

  private getContentFromInsuranceService(filterFn: (product: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setExtraContentToProduct(obj: ContentInterface) {
    obj.container_1.products.forEach(product => {
      const price = product.display_price.split(',');
      product.price_principal = price[0];
      product.price_decimal = price[1];
    });
    return obj.container_1.products;
  }

  private createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            quantity: 1
          },
        },
      }
    };
  }

  private createCheckoutAction(product) {
    return {
      action: 'checkout_product',
      payload: {
        product: product,
        order: this.createOrderObj(product.master_variant),
        router: 'checkout'
      }
    };
  }

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }

}
