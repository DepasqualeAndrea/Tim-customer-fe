import {Injectable} from '@angular/core';
import {Product} from '@model';
import {DataService} from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ContentInterface} from './content-interface';
import {PreventivatoreContentProvider} from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreCivibankTravelContentProvider implements PreventivatoreContentProvider {
  private productCodes = ['htrv'];

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {

    return {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        product_name: kenticoItem.quotator.value.find(item => item.system.codename === 'product_name').text.value,
        mandatory_fields: kenticoItem.quotator.value.find(item => item.system.codename === 'mandatory_fields').text.value,
        form_destination: kenticoItem.quotator.value.find(item => item.system.codename === 'form_destination').text.value,
        form_start_date: kenticoItem.quotator.value.find(item => item.system.codename === 'form_start_date').text.value,
        form_end_date: kenticoItem.quotator.value.find(item => item.system.codename === 'form_end_date').text.value,
        travel_type: kenticoItem.quotator.value.find(item => item.system.codename === 'travel_type').text.value,
        single_destination: kenticoItem.quotator.value.find(item => item.system.codename === 'single_destination').text.value,
        multiple_destinations: kenticoItem.quotator.value.find(item => item.system.codename === 'multiple_destinations').text.value,
        add_destination: kenticoItem.quotator.value.find(item => item.system.codename === 'add_destination').text.value,
        extra_info: kenticoItem.quotator.value.find(item => item.system.codename === 'extra_info').text.value,
        insured_persons_number: kenticoItem.quotator.value.find(item => item.system.codename === 'insured_persons_number').text.value,
        title_warning_message_more_info: kenticoItem.quotator.value.find(item => item.system.codename === 'title_warning_message_more_info').text.value,
        description_warning_message_more_info: kenticoItem.quotator.value.find(item => item.system.codename === 'description_warning_message_more_info').text.value,
        // package_title: kenticoItem.quotator.value.find(item => item.system.codename === 'package_title').text.value,
        // variants_type_label: kenticoItem.quotator.value.find(item => item.system.codename === 'variants_type_label').text.value,
        price_title: kenticoItem.quotator.value.find(item => item.system.codename === 'price_total_title').text.value,
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'continue_button').text.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'information_package_text').text.value,
        // product_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'product_collaboration').text.value,
        provider_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'logo_helvetia').thumbnail.value[0].url,
        tooltip: kenticoItem.quotator.value.find(item => item.system.codename === 'tooltip').text.value,
        checkbox: kenticoItem.quotator.value.find(item => item.system.codename === 'quotator_checkbox_travel').text.value,
        all_required_fields: kenticoItem.quotator.value.find(item => item.system.codename === 'all_required_fields').text.value,
        disclaimer_plus: kenticoItem.quotator.value.find(item => item.system.codename === 'disclaimer_plus').text.value,
        email_attachments: kenticoItem.quotator.value.find(item => item.system.codename === 'email_attachments').text.value,
      },
      how_works: this.getHowWorksStructure(kenticoItem),
      for_who: this.getWhoIsFor(kenticoItem),
      what_to_know: {
        title_section: kenticoItem.what_to_know.value[0].title.value,
        text_section: kenticoItem.what_to_know.value[0].text.value,
        slider_content: kenticoItem.what_to_know.value[0].infocards.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url
            // img_alt: card.image.value[0].description,
          };
        }),
        set_informativo_content: kenticoItem.what_to_know.value[0].information_package.value
      },
      more_info: {
        title: kenticoItem.product_found.need_more_info.title.value,
        subtitle: kenticoItem.product_found.need_more_info.body.value,
        button_text: kenticoItem.product_found.value.find(item => item.system.codename === 'contacts_button_label').text.value
      }
    };
  }

  getHeaderStructure(kenticoItem: any) {
    return {
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
        : null
    };
  }

  getHowWorksStructure(kenticoItem: any) {
    const selected_slide = 'htrv-premium';
    return {
      title_section: kenticoItem.how_works.value[0].title.value,
      text_section: kenticoItem.how_works.value[0].text.value,
      table_combinations: kenticoItem.how_works.value[0].tabella_combinazioni.value,
      selected_slide: selected_slide,
      product_content: this.getPolicyCoverages(kenticoItem)
    };
  }

  getPolicyCoverages(kenticoItem: any) {
    const policyCoverages = [];
    kenticoItem.how_works.value[0].benefits.value.map(benefit => {
      const recommended = benefit.campaign_info.value.length && benefit.campaign_info.value[0].codename === 'recommended';
      const included = benefit.campaign_info.value.length && benefit.campaign_info.value[0].codename === 'included';
      const title = benefit.campaign_info.value.length && benefit.campaign_info.value[0].codename === 'title';
      const tooltip = benefit.campaign_info.value.length && benefit.campaign_info.value[0].codename === 'tooltip';

      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename.endsWith('premium') ? 'htrv-premium' : 'htrv-basic',
        selected: recommended,
        recommended: recommended,
        included: included,
        title: title,
        tooltip: tooltip,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            text: guarantee.text.value,
            subitems_list: guarantee.subitems.value.some(subitem => subitem.included.value.length),
            info: guarantee.info.value,
            title: guarantee.title.value.some(value => value.codename === 'title'),
            tooltip: guarantee.tooltip.value.some(value => value.codename === 'tooltip'),
            subitems: guarantee.subitems.value.map(subitem => {
              return {
                text: subitem.text.value,
                included: subitem.included.value.some(value => value.codename === 'included'),
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
    return {
      title: kenticoItem.who_is_for.value[0].title.value,
      body: kenticoItem.who_is_for.value[0].text.value,
      sanitize: true
    };
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      const orderedContentFromInsuranceService = contentFromInsuranceService.sort((a, b) => a.product_code < b.product_code ? -1 : 1);
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
    return this.kenticoTranslateService.getItem('preventivatore_travel').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    return {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.description,
      how_works: header.how_works,
      for_who: header.for_who,
      more_info: header.more_info,
      bg_img: header.image,
      img_alt: header.alt
    };
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product.package_title = quotator.package_title;
      product.travel_type = quotator.travel_type;
      product.single_destination = quotator.single_destination;
      product.multiple_destinations = quotator.multiple_destinations;
      product.variants_type_label = quotator.variants_type_label;
      product.add_destination = quotator.add_destination;
      product.insured_persons_number = quotator.insured_persons_number;
      product.extra_info = quotator.extra_info;
      product.price_title = quotator.price_title;
      product.continue_button_label = quotator.continue_button_label;
      product.information_package_text = quotator.information_package_text;
      product.product_collaboration = quotator.product_collaboration;
      product.provider_logo = quotator.provider_logo;
      product.tooltip = quotator.tooltip;
      product.mandatory_fields = quotator.mandatory_fields;
      product.form_destination = quotator.form_destination;
      product.form_start_date = quotator.form_start_date;
      product.form_end_date = quotator.form_end_date;
      product.product_name = quotator.product_name;
      product.image = this.getSmallImage(product.images);
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = this.getTenantLayoutClass();
      product.isSelected = product.product_code === 'htrv-premium';
      product.title_warning_message_more_info = quotator.title_warning_message_more_info;
      product.description_warning_message_more_info = quotator.description_warning_message_more_info;
      product.checkbox = quotator.checkbox;
      product.all_required_fields = quotator.all_required_fields;
      product.disclaimer_plus = quotator.disclaimer_plus;
      product.email_attachments = quotator.email_attachments;
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
    if (this.dataService.tenantInfo.tenant === 'banco-desio_db') {
      return '/assistenza'
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
