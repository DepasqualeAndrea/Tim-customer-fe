import { Injectable } from '@angular/core';
import { InsurancesService } from '@services';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { concat, forkJoin, Observable, of, zip } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutTimCustomersEhealthStdContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private nypInsurancesService: NypInsurancesService
  ) { }

  getContent(): Observable<ContentInterface | any> {
    const contentFromKentico$ = this.getContentFromKentico();
    const contentQuotation$ = this.getQuotation();
    return zip(contentFromKentico$, contentQuotation$).pipe(
      map(value => this.createContentStructureFromKenticoItem(value[0], value[1]))
    )
  }


  getQuotation(): Observable<any> {
    const quotationRequest = this.createQuotationPayload()
    return this.nypInsurancesService.submitEhealthStandardQuotation(quotationRequest)
  }

  createQuotationPayload(): any {
    return {
      tenant: "tim",
      product_code: "ehealth-quixa-standard",
      product_data: {}
    }
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_ehealth_quixa_standard')
  }

  createContentStructureFromKenticoItem(kenticoItem: any, contentQuotation: any) {
    const coveragesList = []
    kenticoItem.coverages_list.value.forEach(element => {
      coveragesList.push(element.text.value)
    })
    const structure = {
      checkout_header: {
        title: kenticoItem.activating.value,
        secondary_title: kenticoItem.activated.value,
        partner_text: kenticoItem.partner_collaboration_text.value,
        partner_icon: kenticoItem.partner_collaboration_logo.images[0].url
      },
      cost_item: {
        validation_title: kenticoItem.policy_validity.value,
        cost_detail_title: kenticoItem.coverages_title.value,
        informative_set: kenticoItem.precontractual_information_set.value,
        icon_1: kenticoItem.icon_policy_validity.value[0].url,
        icon_2: kenticoItem.icon_coverages.value[0].url,
        icon_3: kenticoItem.icon_information_set.value[0].url,
        product_title_price: kenticoItem.monthly_price.value,
        one_month_homage: kenticoItem.one_month_homage.value,
        priceFromQuote: contentQuotation.additional_data.data.InsuranceFees.pop().Price,
        hide_payment_price: false,
        cost_detail_by_product: {
          ehealthquixastandard: coveragesList
        }
      },
      card_contractor: {
        image: kenticoItem.holder_image.value[0].url,
        image_alt: kenticoItem.holder_image.value[0].description,
        title: kenticoItem.holder_title.value,
      },
      card_payment: {
        title: kenticoItem.payment_step_title.value,
      },
    }
    return structure;
  }
}