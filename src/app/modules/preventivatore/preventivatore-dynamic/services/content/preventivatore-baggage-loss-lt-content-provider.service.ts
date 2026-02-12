import { PreventivatoreDynamicSharedFunctions } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-dynamic-shared-functions';
import { PreventivatoreModule } from '../../../preventivatore.module';
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
export class PreventivatoreBaggageLossLongTermContentProvider implements PreventivatoreContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService
  ) { }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_baggage_loss_long_term').pipe
      (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: this.getQuotatorStructure(kenticoItem),
      what_to_know: this.getWhatToKnowStructure(kenticoItem),
      more_info: this.getMoreInfoStructure(kenticoItem),
    };
    return structure;
  }

  private getHeaderStructure(kenticoItem: any) {
    if (kenticoItem.header.value.length) {
      const header = kenticoItem.header.value[0];
      return {
        title: header.title
          ? header.title.value
          : null,
        subtitle: header.description
          ? header.description.value
          : null,
        bg_img: header.image && header.image.value[0]
          ? header.image.value[0].url
          : null,
        img_alt: header.image && header.image.value[0]
          ? header.image.value[0].description
          : null
      };
    }
    return null;
  }

  private getQuotatorStructure(kenticoItem: any) {
    if (kenticoItem.quotator.value.length) {
      const quotator = kenticoItem.quotator.value[0];
      return {
        description: quotator.description
          ? quotator.description.value
          : null,
        start_date_form: quotator.start_date
          ? quotator.start_date.value
          : null,
        end_date_form: quotator.end_date
          ? quotator.end_date.value
          : null,
        dates_disclaimer: quotator.dates_disclaimer
          ? quotator.dates_disclaimer.value
          : null,
        errors: this.getQuotatorErrors(quotator.errors),
        product_collaboration: quotator.product_collaboration
          ? quotator.product_collaboration.value
          : null,
        information_package_text: quotator.information_package_text
          ? quotator.information_package_text.value
          : null,
        provider_logo: quotator.provider_logo && quotator.provider_logo.value[0]
          ? quotator.provider_logo.value[0].url
          : null,
        continue_button_label: quotator.continue_button_label
          ? quotator.continue_button_label.value
          : null
      };
    }
    return null;
  }

  private getWhatToKnowStructure(kenticoItem: any) {
    if (kenticoItem.what_to_know.value.length) {
      const whatToKnow = kenticoItem.what_to_know.value[0];
      return {
        title_section: whatToKnow.title
          ? whatToKnow.title.value
          : null,
        text_section: whatToKnow.text
          ? whatToKnow.text.value
          : null,
        slider_content: this.getInfoCards(whatToKnow.infocards),
        set_informativo_content: whatToKnow.information_package
          ? whatToKnow.information_package.value
          : null
      };
    }
    return null;
  }

  private getMoreInfoStructure(kenticoItem: any) {
    if (kenticoItem.more_info.value.length) {
      const moreInfo = kenticoItem.more_info.value[0];
      const button = moreInfo.button.value.length ? moreInfo.button.value[0] : null;
      return {
        title: moreInfo.title
          ? moreInfo.title.value
          : null,
        subtitle: moreInfo.text
          ? moreInfo.text.value
          : null,
        button_text: button.label
          ? button.label.value
          : null,
        button_redirect: button.value
          ? button.value.value
          : null
      };
    }
    return null;
  }

  private getQuotatorErrors(quotatorErrors: any) {
    if (quotatorErrors.value.length) {
      const errors = [];
      quotatorErrors.value.forEach(error => {
        errors[error.system.codename] = error.text.value;
      });
      return errors;
    }
    return null;
  }

  private getInfoCards(infoCards: any) {
    if (infoCards && infoCards.value) {
      return infoCards.value.map(card => ({
        text: card.body.value,
        img: card.image.value[0].url,
        img_alt: card.image.value[0].description,
      }));
    }
    return null;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      if (contentFromKentico.what_to_know.set_informativo_content) {
        const newContent = PreventivatoreDynamicSharedFunctions.replaceInformationPackageLink(
          contentFromKentico.what_to_know.set_informativo_content,
          contentFromInsuranceService[0].information_package
        );
        contentFromKentico.what_to_know.set_informativo_content = newContent;
      }
      obj.container_1 = Object.assign({}, contentFromKentico.header, {products: contentFromInsuranceService});
      obj.container_2 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_3 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.container_class = [this.getTenantLayoutClass()].concat(codes);
      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      obj.container_2.container_class = this.getTenantLayoutClass();
      obj.container_3.container_class = this.getTenantLayoutClass();

      return of(obj);
    }));
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
      product.container_class = this.getTenantLayoutClass();
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
