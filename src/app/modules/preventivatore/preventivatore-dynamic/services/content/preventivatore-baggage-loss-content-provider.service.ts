import { PreventivatoreDynamicSharedFunctions } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-dynamic-shared-functions';
import { PreventivatoreModule } from './../../../preventivatore.module';
import { Injectable } from '@angular/core';
import { Product } from '@model';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ContentInterface } from './content-interface';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreBaggageLossContentProvider implements PreventivatoreContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService
  ) { }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_baggage_loss').pipe
      (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const quotatorErrors = {};
    kenticoItem.quotator.value.find(item => item.system.codename === 'quotator_errors').container.value.forEach(
      error => Object.defineProperty(
        quotatorErrors,
        error.system.codename,
        { value: error.text.value }
      )
    );
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        description: kenticoItem.quotator.value.find(item => item.system.codename === 'baggage_loss_description').text.value,
        start_date_form: kenticoItem.quotator.value.find(item => item.system.codename === 'start_date_form').text.value,
        end_date_form: kenticoItem.quotator.value.find(item => item.system.codename === 'end_date_form').text.value,
        dates_disclaimer: kenticoItem.quotator.value.find(item => item.system.codename === 'dates_disclaimer').text.value,
        errors: quotatorErrors,
        product_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'product_collaboration_covea').product_collaboration.value,
        information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'product_collaboration_covea').info_package_link.value,
        provider_logo: kenticoItem.quotator.value.find(item => item.system.codename === 'product_collaboration_covea').provider_logo.value[0].url,
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'continue_button').text.value
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
        set_informativo_content: kenticoItem.what_to_know.value[0].information_package.value
      },
      more_info: {
        title: kenticoItem.more_info.value[0].title.value,
        subtitle: kenticoItem.more_info.value[0].text.value,
        button_text: kenticoItem.more_info.value[0].button.value[0].label.value,
        button_redirect: kenticoItem.more_info.value[0].button.value[0].value.value
      },
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

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      contentFromKentico.what_to_know.set_informativo_content = PreventivatoreDynamicSharedFunctions.replaceInformationPackageLink(
        contentFromKentico.what_to_know.set_informativo_content,
        contentFromInsuranceService[0].information_package
      );
      obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
      obj.container_2 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_3 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.container_class = this.getTenantLayoutClass();
      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      obj.container_2.container_class = this.getTenantLayoutClass();
      obj.container_3.container_class = this.getTenantLayoutClass();

      return of(obj);
    }));
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
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
      product.container_class = this.getTenantLayoutClass();
      product.selected_values = {};
    });
    return obj.container_1.products;
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
