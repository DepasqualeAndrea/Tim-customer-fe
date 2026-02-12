import { Observable, of } from 'rxjs';
import { ContentInterface } from './content-interface';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { map, switchMap, take } from 'rxjs/operators';
import { Product } from 'app/core/models/insurance.model';
import { DataService, AuthService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';
import { PreventivatoreDynamicSharedFunctions } from './preventivatore-dynamic-shared-functions';

@Injectable({
  providedIn: 'root'
})
export class PreventivatorePetContentProvider implements PreventivatoreContentProvider {

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private authService: AuthService
  ) {
  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: this.getQuotatorStructure(kenticoItem),
      how_works: this.getHowWorksStructure(kenticoItem),
      for_who: this.getForWhoStructure(kenticoItem),
      what_to_know: this.getWhatToKnowStructure(kenticoItem),
      faq: this.getFaqStructure(kenticoItem),
      more_info: this.getMoreInfoStructure(kenticoItem),
    };
    return structure;
  }

  getHeaderStructure(kenticoItem: any) {
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
          : null,
        welcome_message: header.welcome
          ? header.welcome.value
          : null,
        welcome_message_2: kenticoItem.header.value[0].welcome_female.value
          ? kenticoItem.header.value[0].welcome_female.value
          : null,
      };
    }
    return null;
  }

  getQuotatorStructure(kenticoItem: any) {
    if (kenticoItem.quotator.value.length) {
      const quotator = kenticoItem.quotator.value[0];
      return {
        hide_product_name_in_quotator: quotator.hide_product_name && quotator.hide_product_name.value.length
          ? quotator.hide_product_name.value.some(value => value.codename === 'true')
          : false,
        package_title: quotator.package_title
          ? quotator.package_title.value
          : null,
        product_collaboration: quotator.product_collaboration
          ? quotator.product_collaboration.value
          : null,
        information_package_text: quotator.information_package_text
          ? quotator.information_package_text.value
          : null,
        continue_button_label: quotator.continue_button_label
          ? quotator.continue_button_label.value
          : null,
        provider_logo: quotator.provider_logo && quotator.provider_logo.value[0]
          ? quotator.provider_logo.value[0].url
          : null
      };
    }
    return null;
  }

  getHowWorksStructure(kenticoItem: any) {
    if (kenticoItem.how_works.value.length) {
      const howWorks = kenticoItem.how_works.value[0];
      return {
        title_section: howWorks.title
          ? howWorks.title.value
          : null,
        text_section: howWorks.text
          ? howWorks.text.value
          : null,
        selected_slide: howWorks.benefits.value[0].system.codename,
        product_content: this.getPolicyCoverages(howWorks.benefits),
      };
    }
    return null;
  }

  getPolicyCoverages(benefits: any) {
    if (benefits && benefits.value) {
      const policyCoverages = [];
      benefits.value.map(benefit => {
        const policyCoverage = {
          name: benefit.title ? benefit.title.value : null,
          product_code: benefit.system.codename,
          ribbon: benefit.campaign_info && benefit.campaign_info.value.length ? benefit.campaign_info.value[0].name : null,
          items_list: benefit.guarantee && benefit.guarantee.value.map(guarantee => {
            return {
              text: guarantee.text ? guarantee.text.value : null,
              subitems: guarantee.subitems ? guarantee.subitems.value.map(subitem => subitem.text ? subitem.text.value : null) : [],
              included: guarantee.included && guarantee.included.value.length
                ? guarantee.included.value.some(value => value.codename === 'included')
                : false
            };
          })
        };
        policyCoverages.push(policyCoverage);
      });
      return policyCoverages;
    }
  }

  getForWhoStructure(kenticoItem) {
    if (kenticoItem.who_is_for.value.length) {
      const forWho = kenticoItem.who_is_for.value[0];
      return {
        title: forWho.title
          ? forWho.title.value
          : null,
        body: forWho.text
          ? forWho.text.value
          : null
      };
    }
    return null;
  }

  getWhatToKnowStructure(kenticoItem: any) {
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
        policy_note_content: whatToKnow.additional_info.value,
        set_informativo_content: whatToKnow.information_package.value
      };
    }
    return null;
  }

  getInfoCards(infoCards: any) {
    if (infoCards && infoCards.value) {
      return infoCards.value.map(card => ({
        text: card.body.value,
        img: card.image.value[0].url,
        img_alt: card.image.value[0].description,
      }));
    }
    return null;
  }

  getFaqStructure(kenticoItem: any) {
    if (kenticoItem.common_questions.value.length) {
      const faq = kenticoItem.common_questions.value[0];
      return {
        enabled: faq.enabled && faq.enabled.value.length
          ? faq.enabled.value.some(value => value.codename === 'true')
          : false,
        title: faq.title
          ? faq.title.value
          : null,
        faqs: this.getFaqs(faq.faqs),
        collapse_toggler_icons: {
          show: faq.icon_closed.value[0]
            ? faq.icon_closed.value[0].url
            : null,
          hide: faq.icon_opened.value[0]
            ? faq.icon_opened.value[0].url
            : null
        }
      };
    }
    return null;
  }

  getFaqs(kenticoItem: any) {
    if (kenticoItem && kenticoItem.value) {
      let faqsFromKentico: any[] = kenticoItem.value.map(item => {
        return {
          question: item && item.question.value,
          answer: item && item.answer.value
        };
      });
      const fullLength = faqsFromKentico.length;
      if (fullLength > 0) {
        const halfLength = Math.ceil(fullLength / 2);
        const leftSideFaqs = faqsFromKentico.slice(0, halfLength);
        const rightSideFaqs = faqsFromKentico.slice(halfLength, fullLength);
        faqsFromKentico = [leftSideFaqs, rightSideFaqs];
      }
      return faqsFromKentico;
    }
    return null;
  }

  getMoreInfoStructure(kenticoItem: any) {
    if (kenticoItem.product_found.value.length) {
      const leftSection = kenticoItem.product_found.value[0];
      const rightSection = kenticoItem.product_found.value[1];
      const moreInfo = {
        left_section_title: leftSection.title
          ? leftSection.title.value
          : null,
        left_section_subtitle: leftSection.description
          ? leftSection.description.value
          : null,
        left_section_button: leftSection.cta && leftSection.cta.value[0] && leftSection.cta.value[0].label
          ? leftSection.cta.value[0].label.value
          : null,
        right_section_title: rightSection.title
          ? rightSection.title.value
          : null,
        right_section_subtitle: rightSection.description
          ? rightSection.description.value
          : null,
        right_section_button: rightSection.cta && rightSection.cta.value[0] && rightSection.cta.value[0].label
          ? rightSection.cta.value[0].label.value
          : null,
        route: rightSection.cta && rightSection.cta.value[0] && rightSection.cta.value[0].value
          ? rightSection.cta.value[0].value.value
          : null
      };
      return moreInfo;
    }
    return null;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      const welcomeMessage = this.getUserWelcomeMessage(contentFromKentico.header);
      contentFromKentico.what_to_know.set_informativo_content = PreventivatoreDynamicSharedFunctions.replaceInformationPackageLink(
        contentFromKentico.what_to_know.set_informativo_content,
        contentFromInsuranceService[0].information_package
      );
      obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header, welcomeMessage));
      obj.container_2 = Object.assign({}, contentFromKentico.how_works);
      obj.container_3 = Object.assign({}, contentFromKentico.for_who);
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_5 = Object.assign({}, contentFromKentico.faq);
      obj.container_6 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
      return of(obj);
    }));
  }

  private getUserWelcomeMessage(headerFromKentico: any) {
    const messageMale = headerFromKentico.welcome_message;
    const messageFemale = headerFromKentico.welcome_message_2;
    if (this.authService.currentUser.firstname && this.authService.loggedUser.address.sex === 'M') {
      return messageMale + ' ' + this.authService.currentUser.firstname + '!';
    }
    if (this.authService.currentUser.firstname && this.authService.loggedUser.address.sex === 'F') {
      return messageFemale + ' ' + this.authService.currentUser.firstname + '!';
    }
    return null;
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_mifido').pipe
      (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any, welcomeMessage: any) {
    const obj = Object.assign({}, { products: contentFromInsuranceService }, header, { welcome_message: welcomeMessage });
    return obj;
  }

  private setColorClassToProducts(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
      product.container_class = [this.getTenantLayoutClass(), product.product_code];
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
      return smallImage && smallImage.original_url || smallImage.small_url;
    }
    smallImage = images.find((img) => img.image_type === 'default');
    if (!!smallImage) {
      return smallImage && smallImage.original_url || smallImage.small_url;
    }
    smallImage = images.find((img) => img.image_type === 'common_image');
    if (!!smallImage) {
      return smallImage && smallImage.original_url || smallImage.small_url;
    }
    return '';
  }
}
