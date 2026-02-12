import { Injectable } from "@angular/core";
import { CheckoutModule } from "app/modules/checkout/checkout.module";
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";
import { ContentInterface } from "app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CheckoutContentProvider } from "./checkout-content-provider.interface";


@Injectable(
    {
      providedIn: 'root'
    }
  )

  export class CheckoutYoloCyberContentService implements CheckoutContentProvider {

    constructor(
        private kenticoTranslateService: KenticoTranslateService,
      ) { }

      getContent(): Observable<ContentInterface> {
        return this.getContentFromKentico();
      }

      private getContentFromKentico(): Observable<any> {
        return this.kenticoTranslateService.getItem('checkout_cyber').pipe
            (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
      }

      createContentStructureFromKenticoItem(kenticoItem: any) {
        const structure = {
          card_company : {
              title:          kenticoItem.card_list.card_cyber.title.value,
              revenue:     kenticoItem.card_list.card_cyber.revenue.value,
              payment:     kenticoItem.card_list.card_cyber.payment.value,
              icon_technical_contact: kenticoItem.card_list.card_cyber.icon_technical_contact.value[0].url,
              title_technical_contact: kenticoItem.card_list.card_cyber.title_technical_contact.value,
          },
          card_contractor: {
              image:      kenticoItem.card_list.card_contractor.image.value[0].url,
              image_alt:  kenticoItem.card_list.card_contractor.image.value[0].description,
              title:      kenticoItem.card_list.card_contractor.title.value,
          },
          card_survey: {
              image:        kenticoItem.card_list.card_questionario.image.value[0].url,
              image_alt:    kenticoItem.card_list.card_questionario.image.value[0].description,
              title:        kenticoItem.card_list.card_questionario.title.value,
              status:       kenticoItem.card_list.card_questionario.status.value,
              description:  kenticoItem.card_list.card_questionario.description.value,
          },
          card_payment: {
              title: kenticoItem.card_list.card_payment.text.value,
          },
          cost_item: {
              validation_title:   kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'validity_policy').text.value,
              cost_detail_title:  kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'cost_detail_title').text.value,
              renovation_type:    kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'renovation_annual').text.value,
              informative_set:    kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_cyber').text.value,
              discount_title:    kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'discount_title').text.value,
              product_title_price_annual:    kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'annual_prize').text.value,
              product_title_price_month:     kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'payment_monthly').text.value,
              cost_detail_by_product: {
                netcybergold: kenticoItem.coverage_options_gold.value.map(item => item.text.value),
                netcyberplatinum: kenticoItem.coverage_options_platinum.value.map(item => item.text.value)
              }
          },
          checkout_header: {
              title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
              partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
              partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'net_logo').thumbnail.value[0].url
          },
        };
        return structure;
      }
  }