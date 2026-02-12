import { Injectable } from "@angular/core";
import { Product } from "@model";
import { DataService } from "@services";
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";
import { PreventivatoreModule } from "app/modules/preventivatore/preventivatore.module";
import { Observable, of } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { ContentInterface } from "./content-interface";
import { PreventivatoreContentProvider } from "./preventivatore-content-provider.interface";


@Injectable({
    providedIn: 'root'
  })
  export class PreventivatoreYoloCyberContentProvider implements PreventivatoreContentProvider {

    constructor(
        private dataService: DataService,
        private kenticoTranslateService: KenticoTranslateService,
      ) {
      }

      createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
        const structure = {
            header: this.getHeaderStructure(kenticoItem.header.value[0]),
            quotator: {
                quot_product_title: kenticoItem.quotator.value.find(item => item.system.codename === 'quot_product_title').text.value,
                insert_turnover: kenticoItem.quotator.value.find(item => item.system.codename === 'insert_turnover').text.value,
                radiobutton_min_turnover: kenticoItem.quotator.value.find(item => item.system.codename === 'radiobutton_min_turnover').text.value,
                radiobutton_medium_turnover: kenticoItem.quotator.value.find(item => item.system.codename === 'radiobutton_medium_turnover').text.value,
                radiobutton_max_turnover: kenticoItem.quotator.value.find(item => item.system.codename === 'radiobutton_max_turnover').text.value,
                choose_payment: kenticoItem.quotator.value.find(item => item.system.codename === 'choose_payment').text.value,
                yearly_payment: kenticoItem.quotator.value.find(item => item.system.codename === 'yearly_payment').text.value,
                monthly_payment: kenticoItem.quotator.value.find(item => item.system.codename === 'monthly_payment').text.value,
                total_price: kenticoItem.quotator.value.find(item => item.system.codename === 'total_price').text.value,
                payment_monthly: kenticoItem.quotator.value.find(item => item.system.codename === 'payment_monthly').text.value,
                annual_total_price: kenticoItem.quotator.value.find(item => item.system.codename === 'annual_total_price').text.value,
                information_package_text: kenticoItem.quotator.value.find(item => item.system.codename === 'product_partner_net').info_package_link.value,
                product_collaboration: kenticoItem.quotator.value.find(item => item.system.codename === 'product_partner_net').product_collaboration.value,
                buy_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'buy_button').text.value,
            },
            how_works: this.getHowWorksStructure(kenticoItem),
            what_to_know: {
              title_section: kenticoItem.what_to_know.value[0].title.value,
              text_section: kenticoItem.what_to_know.value[0].text.value,
              slider_content: kenticoItem.what_to_know.value[0].infocards.value.map(card => {
                return {
                  text: card.body.value,
                  img: card.image.value[0].url,
                  img_alt: card.image.value[0].description,
                };
              }),
              policy_note_content: kenticoItem.what_to_know.value[0].additional_info.value
            },
            service_protection_and_monitoring: this.getServiceProtectionAndMonitoringStructure(kenticoItem),
            what_offers: {
              offers: this.getWhatOffersStructure(kenticoItem.what_offers_section),
              collapse_toggler_icons: {
                show: kenticoItem.icon_closed.value[0]
                  ? kenticoItem.icon_closed.value[0].url
                  : null,
                hide: kenticoItem.icon_opened.value[0]
                  ? kenticoItem.icon_opened.value[0].url
                  : null
              }
            },
            faq: {
              enabled: kenticoItem.common_questions.value[0].enabled.value.length
                ? kenticoItem.common_questions.value[0].enabled.value.some(value => value.codename === 'true')
                : false,
              title: kenticoItem.common_questions.value[0].title.value,
              faqs: this.getFaqStructure(kenticoItem.common_questions.value[0].faqs.value[0].linked_items),
              collapse_toggler_icons: {
                show: kenticoItem.common_questions.value[0].icon_closed.value[0]
                  ? kenticoItem.common_questions.value[0].icon_closed.value[0].url
                  : null,
                hide: kenticoItem.common_questions.value[0].icon_opened.value[0]
                  ? kenticoItem.common_questions.value[0].icon_opened.value[0].url
                  : null
              },
              set_informativo_content: kenticoItem.information_package.value
            },
            more_info: {
              left_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section').title.value,
              left_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_section').body.value,
              left_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'buy_button').text.value,
              right_section_title: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section').title.value,
              right_section_subtitle: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_section').body.value,
              right_section_button: kenticoItem.product_found.value.find(item => item.system.codename === 'contact_button').text.value,
              route: kenticoItem.product_found.value.find(item => item.system.codename === 'assistance_route').text.value
            }
        };
        return structure;
      }

      getHeaderStructure(kenticoHeader: any) {
        const header = {
          bg_img: kenticoHeader.image.value[0]
            ? kenticoHeader.image.value[0].url
            : null,
          img_alt: kenticoHeader.image.value[0]
            ? kenticoHeader.image.value[0].description
            : null,
          title: kenticoHeader.title.value
            ? kenticoHeader.title.value
            : null,
          subtitle: kenticoHeader.description.value
            ? kenticoHeader.description.value
            : null,
          scroll: {
            how_works: kenticoHeader.scroll_to_how_works.value
              ? kenticoHeader.scroll_to_how_works.value
              : null
            }
  
        };
        return header;
      }

      getHowWorksStructure(kenticoItem: any) {
        const selected_slide = 'net-cyber-gold';
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
          const recommended = benefit.campaign_info.value.length && benefit.campaign_info.value[0].codename === 'recommended' ? true : false;
          const included = benefit.campaign_info.value.length && benefit.campaign_info.value[0].codename === 'included' ? true : false;
          const policyCoverage = {
            name: benefit.title.value,
            product_code: benefit.system.codename.endsWith('cyber_gold') ? 'net-cyber-gold' : 'net-cyber-platinum',
            selected: recommended,
            recommended: recommended,
            included: included,
            items_list: benefit.guarantee.value.map(guarantee => {
              return {
                text: guarantee.text.value,
                subitems: guarantee.subitems.value.map(subitem => {
                  return subitem.text.value;
                }),
                included: guarantee.included.value.some(value => value.codename === 'included')
              };
            })
          };
          policyCoverages.unshift(policyCoverage);
        });
        return policyCoverages;
      }

      getServiceProtectionAndMonitoringStructure(kenticoItem: any) {
        const selected_tab = 'net-cyber-gold';
        const ServiceProtectionAndMonitoring = {
          selected_tab: selected_tab,
          product_content: this.getServiceProtectionAndMonitoringContents(kenticoItem)
        };
        return ServiceProtectionAndMonitoring;
      }

      getServiceProtectionAndMonitoringContents(kenticoItem: any) {
        const ServiceProtectionAndMonitoringContents = [];
        kenticoItem.protection_service_and_monitoring_section.value.map(table => {
          const ServiceProtectionAndMonitoringContent = {
            name: table.product_variant_title.value,
            description: table.description.value,
            product_code: table.system.codename.endsWith('gold') ? 'net-cyber-gold' : 'net-cyber-platinum',
            items_list: table.table_list.value.map(tableContent => {
              const info = tableContent.i_info.value.length && tableContent.i_info.value[0].codename === 'i' ? true : false;
              return {
                table_title: tableContent.title.value,
                table_description: tableContent.description.value,
                info: info,
                info_modal_button: tableContent.modal_info.value.length>0 ? tableContent.modal_info.value[1].text.value : null,
                info_modal_title: tableContent.modal_info.value.length>0 ? tableContent.modal_info.value[0].title.value : null,
                info_modal_description: tableContent.modal_info.value.length>0 ? tableContent.modal_info.value[0].body.value : null,
              };
            })
          };
          ServiceProtectionAndMonitoringContents.unshift(ServiceProtectionAndMonitoringContent);
        });
        return ServiceProtectionAndMonitoringContents;
      }

      getWhatOffersStructure(kenticoItem: any) {
        let whatOffersFromKentico: any[] = kenticoItem.value.map(item => {
          return {
            offer_title: item && item.title.value,
            offer_description: item && item.body.value
          };
        });
        return whatOffersFromKentico;
      }

      getFaqStructure(kenticoItem: any) {
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

      getContent(codes: string[]): Observable<ContentInterface> { 
        const contentFromKentico$ = this.getContentFromKentico(codes);
        return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
          const obj = <ContentInterface>{};
          const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
          obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
          obj.container_2 = Object.assign({}, contentFromKentico.how_works);
          obj.container_3 = Object.assign({}, contentFromKentico.what_to_know);
          obj.container_4 = Object.assign({}, contentFromKentico.service_protection_and_monitoring);
          obj.container_5 = Object.assign({}, contentFromKentico.what_offers);
          obj.container_6 = Object.assign({}, contentFromKentico.faq);
          obj.container_7 = Object.assign({}, contentFromKentico.more_info);
    
          obj.container_1.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
          obj.container_1.quot_product_title = contentFromKentico.quotator.quot_product_title;
          obj.container_1.container_class = [this.getTenantLayoutClass()].concat(codes);
          obj.container_2.container_class = [this.getTenantLayoutClass()].concat(codes);
          obj.container_3.container_class = [this.getTenantLayoutClass()].concat(codes);
          obj.container_4.container_class = this.getTenantLayoutClass();
          obj.container_5.container_class = this.getTenantLayoutClass();
          obj.container_6.container_class = [this.getTenantLayoutClass()].concat(codes);
          obj.container_7.container_class = this.getTenantLayoutClass();
    
          return of(obj);
        }));
      }

      private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
        return this.dataService.getProductsFromInsuranceServices(filterFn);
      }

      private getContentFromKentico(codes: string[]): Observable<any> {
        return this.kenticoTranslateService.getItem('preventivatore_cyber').pipe
          (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
      }
      private setContentToProduct(contentFromInsuranceService: any, header: any) {
        const obj = {
          products: contentFromInsuranceService,
          title: header.title,
          subtitle: header.subtitle,
          bg_img: header.bg_img,
          img_alt: header.img_alt,
          scroll: header.scroll,
        };
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