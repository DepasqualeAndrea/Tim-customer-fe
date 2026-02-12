import {Observable, of} from 'rxjs';
import {ContentInterface} from './content-interface';
import {Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {map, switchMap} from 'rxjs/operators';
import {Product} from 'app/core/models/insurance.model';
import {DataService} from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {PreventivatoreContentProvider} from './preventivatore-content-provider.interface';
import {ComponentFeaturesService} from 'app/core/services/componentFeatures.service';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreCareContentProvider implements PreventivatoreContentProvider {
  private productCodes = ['rbm-pandemic'];
  private recommendedCoverage = 'copertura_alta_yolo_care';

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService
  ) {
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    console.log(kenticoItem.what_to_know);
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        variants_type_label: kenticoItem.quotator.value.find(item => item.system.codename === 'coverage_type_label').text.value,
        variants_names: this.getVariantsNames(kenticoItem),
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'continue_button').text.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'information_package_text').text.value,
        product_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'product_collaboration').text.value,
        provider_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'rbm_logo').thumbnail.value[0].url
      },
      how_works: this.getHowWorksStructure(kenticoItem),
      for_who: {
        title: kenticoItem.who_is_for.value[0].title.value,
        body: kenticoItem.who_is_for.value[0].text.value
      },
      what_to_know: {
        title_section: kenticoItem.what_to_know.value[0].title.value,
        slider_content: kenticoItem.what_to_know.value[0].infocards.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        }),
        additional_info: kenticoItem.what_to_know.value[0].additional_info.value,
        set_informativo_content: kenticoItem.what_to_know.value[0].information_package.value
      },
      more_info: {
        title: kenticoItem.product_found.need_more_info.title.value,
        subtitle: kenticoItem.product_found.need_more_info.body.value,
        button_text: kenticoItem.product_found.contacts_button_label.text.value
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
    const selected_slide = kenticoItem.how_works.value[0].benefits.value[0].system.codename;
    const howWorks = {
      title_section: kenticoItem.how_works.value[0].title.value,
      selected_slide: selected_slide,
      product_content: this.getPolicyCoverages(kenticoItem)
    };
    return howWorks;
  }

  getPolicyCoverages(kenticoItem: any) {
    const policyCoverages = [];
    kenticoItem.how_works.value[0].benefits.value.map(benefit => {
      let recommended = false;
      if (benefit.system.codename === this.recommendedCoverage) {
        recommended = true;
      }
      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename,
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

  getVariantsNames(kenticoItem: any) {
    const variantsNames = [];
    kenticoItem.quotator.value.find(item => item.system.codename === 'coperture_yolo_care').linked_items.value.map(variant_option => {
      variantsNames.push({name: variant_option.text.value});
    });
    return variantsNames;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
      obj.container_2 = Object.assign({}, contentFromKentico.how_works);
      obj.container_3 = Object.assign({}, contentFromKentico.for_who);
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_5 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.container_class = [this.productCodes[0], this.getTenantLayoutClass()];
      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      obj.container_2.container_class = this.getTenantLayoutClass();
      obj.container_3.container_class = this.getTenantLayoutClass();
      obj.container_4.container_class = this.getTenantLayoutClass();
      obj.container_5.container_class = this.getTenantLayoutClass();
      obj.container_5.products = contentFromInsuranceService;
      obj.container_5.btn_animation = this.enableButtonAnimation();
      obj.container_5.button_redirect = this.getMoreInfoButtonRedirect();

      return of(obj);
    }));
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_yolo_care').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  private enableButtonAnimation() {
    this.componentFeaturesService.useComponent('more-info');
    this.componentFeaturesService.useRule('has-btn-animation');
    const btnAnimationRule = this.componentFeaturesService.isRuleEnabled();
    if (btnAnimationRule) {
      const pc: Array<string> = this.componentFeaturesService.getConstraints().get('productCodes');
      return pc.includes(this.productCodes[0]);
    }
    return false;
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
      product.variants_type_label = quotator.variants_type_label;
      product.variants_names = quotator.variants_names;
      product.continue_button_label = quotator.continue_button_label;
      product.btn_animation = this.enableButtonAnimation();
      product.product_collaboration = quotator.product_collaboration;
      product.information_package_text = quotator.information_package_text;
      product.provider_logo = quotator.provider_logo;
      product.image = this.getSmallImage(product.images);
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = this.getTenantLayoutClass();
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
