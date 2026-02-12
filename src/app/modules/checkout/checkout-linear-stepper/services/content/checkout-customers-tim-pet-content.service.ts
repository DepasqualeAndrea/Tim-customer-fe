import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutCustomersTimPetContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  // getContent(): Observable<ContentInterface> {
  //   const contentFromKentico$ = this.getContentFromKentico();
  //   return forkJoin([contentFromKentico$])
  //     .pipe(switchMap(([contentFromKentico]) => {
  //       const obj = Object.assign({}, contentFromKentico);
  //       return of(obj);
  //     }));
  // }

  // private getContentFromKentico(): Observable<any> {
  //   return this.kenticoTranslateService.getItem('checkout_customers_tim_pet')
  //     .pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  // }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_customers_tim_pet').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'net_logo').thumbnail.value[0].url,
      },
      card_pet: {
        pet_type_label: kenticoItem.card_list.card_pet.title.value,
        pet_type_image: kenticoItem.card_list.card_pet.image.value[0].url,
        pet_type_alt: kenticoItem.card_list.card_pet.image.value[0].description,
        choose_policy_alt: kenticoItem.card_list.card_choose_policy.image.value[0].description,
        choose_policy_image: kenticoItem.card_list.card_choose_policy.image.value[0].url,
        choose_policy_label: kenticoItem.card_list.card_choose_policy.title.value,
      },
      card_contractor: {
        title: kenticoItem.card_list.card_insured.title.value,
        image: kenticoItem.card_list.card_insured.image.value[0].url,
        image_alt: kenticoItem.card_list.card_insured.image.value[0].description,
      },
      card_survey: {
        title: kenticoItem.card_list.card_survey.title.value,
        description: kenticoItem.card_list.card_survey.description.value,
        status: kenticoItem.card_list.card_survey.status.value,
        image: kenticoItem.card_list.card_survey.image.value[0].url,
        image_alt: kenticoItem.card_list.card_survey.image.value[0].description,
      },
      card_payment: {
        title: kenticoItem.card_list.card_payment.text.value,
      },
      cost_item: {
        validation_title: kenticoItem.shopping_cart.yearly_duration_with_tacit_renewal.text.value,
        cost_detail_title: kenticoItem.shopping_cart.cost_detail_title.text.value,
        informative_set: kenticoItem.shopping_cart.informative_set_pet.text.value,
        icon_1: kenticoItem.icon_policy_validity.value[0].url,
        icon_2: kenticoItem.icon_coverages.value[0].url,
        icon_3: kenticoItem.icon_information_set.value[0].url,
        product_title_price:  kenticoItem.shopping_cart.monthly_prize.text.value,
        cost_detail_by_product: {
          customerstimpet: []
        }
      }
    };
    return structure;
  }
}
