import { ConfigureDropinService } from './../../../../ngx-braintree/configure-dropin.service';
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
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class PreventivatoreCivibankPetContentProvider
  implements PreventivatoreContentProvider {
  private productCodes = ['hpet'];
  private recommendedCoverage = 'copertura_alta_yolo_care';

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService
  ) {
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        product_name: kenticoItem.quotator.value.find(item => item.system.codename === 'product_name_pet').text.value,
        mandatory_fields: kenticoItem.quotator.value.find(item => item.system.codename === 'mandatory_fields').text.value,
        how_many_pets: kenticoItem.quotator.value.find(item => item.system.codename === 'how_many_pets').text.value,
        payment_frequency_star: kenticoItem.quotator.value.find(item => item.system.codename === 'payment_type_star').text.value,
        monthly: kenticoItem.quotator.value.find(item => item.system.codename === 'monthly').text.value,
        annual: kenticoItem.quotator.value.find(item => item.system.codename === 'annual').text.value,
        addon_title: kenticoItem.quotator.value.find(item => item.system.codename === 'addon_title').text.value,
        total_price_small: kenticoItem.quotator.value.find(item => item.system.codename === 'total_price_small').text.value,
        price_monthly: kenticoItem.quotator.value.find(item => item.system.codename === 'price_monthly').text.value,
        info_tooltip: kenticoItem.quotator.value.find(item => item.system.codename === 'info_tooltip').text.value,
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'continue_button').text.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'information_package_text').text.value,
        checkbox: kenticoItem.quotator.value.find(item => item.system.codename === 'checkbox').text.value,
        all_required_fields: kenticoItem.quotator.value.find(item => item.system.codename === 'all_required_fields').text.value,
        kind: kenticoItem.quotator.value.find(item => item.system.codename === 'kind').text.value,
        breed: kenticoItem.quotator.value.find(item => item.system.codename === 'breed').text.value,
        email_attachments: kenticoItem.quotator.value.find(item => item.system.codename === 'email_attachments').text.value,
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
        : null,
      how_works: kenticoItem.header.value[0].how_works.value
        ? kenticoItem.header.value[0].how_works.value
        : null,
      for_who: kenticoItem.header.value[0].for_who.value
        ? kenticoItem.header.value[0].for_who.value
        : null,
      more_info: kenticoItem.header.value[0].more_info.value
        ? kenticoItem.header.value[0].more_info.value
        : null,
      quotator_title: kenticoItem.header.value[0].quotator_title.value
        ? kenticoItem.header.value[0].quotator_title.value : null,
      quotator_subtitle: kenticoItem.header.value[0].quotator_subtitle.value
        ? kenticoItem.header.value[0].quotator_subtitle.value : null
    };
    return header;
  }

  getHowWorksStructure(kenticoItem: any) {
    const selected_slide = kenticoItem.how_works.value[0].benefits.value[0].system.codename;
    const howWorks = {
      title_section: kenticoItem.how_works.value.find(item => item.system.codename === 'preventivatore_pet_desktop').title.value,
      table_combinations: kenticoItem.how_works.value.find(item => item.system.codename === 'preventivatore_pet_desktop').tabella_combinazioni.value,
      text_section: kenticoItem.how_works.value.find(item => item.system.codename === 'preventivatore_pet_desktop').text.value,
      scroll_disclaimer: kenticoItem.how_works.value.find(item => item.system.codename === 'preventivatore_pet_desktop').scroll_disclaimer.value,
      selected_slide: selected_slide,
      product_content: this.getPolicyCoverages(kenticoItem)
    };
    return howWorks;
  }

  getPolicyCoverages(kenticoItem: any) {
    const policyCoverages = [];
    kenticoItem.how_works.value.find(item => item.system.codename === 'preventivatore_pet_desktop').benefits.value.map(benefit => {

      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            title: guarantee.title.value.some(value => value.codename === 'title'),
            info: guarantee.info.value,
            text: guarantee.text.value,
            subitems: guarantee.subitems.value.map(subitem => subitem.text.value),
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
      variantsNames.push({ name: variant_option.text.value });
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
    return this.kenticoTranslateService.getItem('preventivatore_pet').pipe
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
      how_works: header.how_works,
      for_who: header.for_who,
      more_info: header.more_info,
      bg_img: header.image,
      img_alt: header.alt,
      quotator_title: header.quotator_title,
      quotator_subtitle: header.quotator_subtitle
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
      product.product_name = quotator.product_name;
      product.mandatory_fields = quotator.mandatory_fields;
      product.how_many_pets = quotator.how_many_pets;
      product.payment_frequency_star = quotator.payment_frequency_star;
      product.monthly = quotator.monthly;
      product.annual = quotator.annual;
      product.addon_title = quotator.addon_title;
      product.total_price_small = quotator.total_price_small;
      product.price_monthly = quotator.price_monthly;
      product.checkbox = quotator.checkbox;
      product.all_required_fields = quotator.all_required_fields;
      product.info_tooltip = quotator.info_tooltip;
      product.breed = quotator.breed;
      product.kind = quotator.kind;
      product.email_attachments = quotator.email_attachments;
    });
    return obj.container_1.products;
  }

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }

  private getMoreInfoButtonRedirect() {
    if (this.dataService.tenantInfo.tenant === 'bancapc-it-it_db' || this.dataService.tenantInfo.tenant === ''
      || this.dataService.tenantInfo.tenant === 'banco-desio_db'
    ) {
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
