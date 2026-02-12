import { Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { PreventivatoreDiscountCodeContentProvider } from './preventivatore-discount-code-content-provider.interface';
import { Observable, of, forkJoin } from 'rxjs';
import { ContentInterface } from './content-interface';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take, map, switchMap, mergeMap } from 'rxjs/operators';
import { DataService, DiscountCodeService } from '@services';
import { Product } from '@model';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreDiscountCountCovidContentProvider implements PreventivatoreDiscountCodeContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService,
    private couponCode: DiscountCodeService
  ) { }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_covid').pipe
      (take(1)
        , map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
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
        quotator_name: kenticoItem.quotator_product.value.find(item => item.system.codename === 'covid_name').text.value,
        quotator_description: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'covid_short_description').text.value,
        month_free: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'one_month_free').text.value,
        product_collaboration: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'covid_partner').product_collaboration.value,
        provider_logo: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'covid_logo').thumbnail.value[0].url,
        information_package_text: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'covid_partner').info_package_link.value,
        continue_button_label: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'continue_button').text.value,
        price_title: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'total_prize').text.value,
          next_price: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'next_prize_covid').text.value,
        next_price_text: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'next_price_for_you_text').text.value,
        code_not_valid: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'not_valid_coupon_warning_message').text.value,
        quotator_note: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'note').text.value,
      },
      how_works: {
        title_section: kenticoItem.benefits_title.value[0].text.value,
        selected_slide: kenticoItem.title_normal.value[0].system.codename,
        product_content: this.getPolicyBenefits(kenticoItem)
      }
    };
    return structure;
  }

  private getPolicyBenefits(kenticoItem: any) {
    const cards = [];
    const cardBase = {
      name: kenticoItem.title_normal.value[0].text.value,
      product_code: kenticoItem.title_normal.value[0].system.codename,
      selected: true,
      included: false,
      items_list: this.getBenefits(kenticoItem.benefits_normal.value)
    };
    const cardIncluded = {
      name: kenticoItem.title_extra.value[0].text.value,
      product_code: kenticoItem.title_extra.value[0].system.codename,
      selected: false,
      included: false,
      items_list: this.getBenefits(kenticoItem.benefits_extra.value)
    };
    cards.push(cardBase, cardIncluded);
    return cards;
  }

  private getBenefits(benefits: any[]) {
    return benefits.map(benefit => {
      return {
        text: benefit.text.value,
        subitems: benefit.subitems.value.map(subitem => subitem.text.value),
        included: benefit.included.value.some(value => value.name === 'included')
      };
    });
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico(codes);
    const isAuthorized$ = this.couponCode.isAuthorized();
    return forkJoin([contentFromKentico$, isAuthorized$])
      .pipe(mergeMap(([contentFromKentico, isAuthorized]) => {
        const obj = Object.assign({}, contentFromKentico);
        const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
        obj.bg_img_hero = this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header, contentFromKentico.quotator);
        obj.bg_img_hero.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator, isAuthorized);
        obj.how_works.container_class = this.dataService.tenantInfo.tenant;
        return of(obj);
      }));
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any, quotator: any) {
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.subtitle,
      bg_img: header.image,
      img_alt: header.alt
    };
    return obj;
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any, is_authorized: boolean) {
    const discountCode = this.couponCode.getSavedCoupon();
    obj.bg_img_hero.products.forEach(product => {
      product.price_title = quotator.price_title;
      product.month_free = quotator.month_free;
      product.continue_button_label = quotator.continue_button_label;
      product.product_collaboration = quotator.product_collaboration;
      product.information_package_text = quotator.information_package_text;
      product.provider_logo = quotator.provider_logo;
      product.description = quotator.quotator_description;
      product.quotator_name = quotator.quotator_name;
      product.next_price = quotator.next_price;
      product.next_price_text = quotator.next_price_text;
      product.code_not_valid = quotator.code_not_valid;
      product.coupon_id = !!discountCode ? discountCode.id : null;
      product.coupon_code = !!discountCode ? discountCode.code : null;
      product.is_authorized = is_authorized;
      product.note = quotator.quotator_note;
    });
    return obj.bg_img_hero.products;
  }
}
