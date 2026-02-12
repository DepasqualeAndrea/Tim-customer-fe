import { Injectable } from '@angular/core';
import { Product } from '@model';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { ContentInterface } from '../content-interface';
import { PreventivatoreContentProvider } from '../preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})

export class PreventivatoreTimCustomersCyberRiskContentProviderService implements PreventivatoreContentProvider {

    constructor(
      private dataService: DataService,
      private kenticoTranslateService: KenticoTranslateService,
    ) { }
  
    private getContentFromKentico(): Observable<any> {
      return this.kenticoTranslateService.getItem('preventivatore_cyber_risk').pipe
      (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
    }
    
    createContentStructureFromKenticoItem(kenticoItem: any) {
      const structure = {
        hero: {
          title: kenticoItem.title.value,
          description: kenticoItem.product_description.value,
          button_text: kenticoItem.cta.value,
          button_link: kenticoItem.hero_cta_link.value,
          img: kenticoItem.product_img.value[0].url,
          tag_activation: kenticoItem.tag_activation.value,
          tag_where_to_activate: kenticoItem.tag_where_to_activate.value,
          call_specialist: kenticoItem.call_specialist.value,
        },
        product_details_section: {
          image:    kenticoItem.detail_section_image.value[0].url,
          title:    kenticoItem.detail_section_title.value,
          button:   kenticoItem.details_section_button.value,
          button_link:    kenticoItem.details_section_button_link.value,
          details:  this.getDetails(kenticoItem.details_list.value),
        },
        product_slider_section: {
          enabled:        kenticoItem['enabled'].value.length ? kenticoItem['enabled'].value.some(value => value.codename === 'on') : false,
          title:          kenticoItem.product_carousel_title.value,
          description:    kenticoItem.product_carousel_description.value,
          carousel_style: kenticoItem.carousel_style.value[0].codename,
          product_cards:  this.getProductSliderCards(kenticoItem.product_cards.value)
        },
        accordions_section: {
          accordions: this.getWhatToKnowCards(kenticoItem.accordion_list.value)
        },
        prefooter_section: {
            preFooterDescription: kenticoItem.prefooter.value[0].description.value,
            preFooterButtonLink: kenticoItem.prefooter.value[0].button_link.value,
            preFooterButtonLabel: kenticoItem.prefooter.value[0].button_label.value
          }
      };
      return structure;
    }
  
    private getProductSliderCards(products: any[]) {
      return products.map(product => {
        return {
          title:      product.title.value,
          description:product.description.value
        }
      })
    }
    
    private getWhatToKnowCards(cards: any[]): any[] {
      return cards.map(card => {
        return {
          title:        card['title'].value,
          description:  card['text'].value,
          collapsed:    true
        }
      })
    }
  
    private getDetails(details: any[]) {
      return details.map(detail => {
        return {
          title:        detail['title'].value,
          description:  detail['description'].value,
        }
      })
    }
  
    private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
      return this.dataService.getProductsFromInsuranceServices(filterFn);
    }
  
    private setContentToProduct(contentFromInsuranceService: any, hero: any) {
      const product = contentFromInsuranceService.find(product => product.product_code === 'tim-cyber-risk')
      const obj = {
        product: product,
        title: hero.title,
        description: hero.description,
        button_text: hero.button_text,
        button_link: hero.button_link,
        img: hero.img,
        tag_activation: hero.tag_activation,
        tag_where_to_activate: hero.tag_where_to_activate,
        call_specialist: hero.call_specialist
      };
      return obj;
    }
  
    getContent(codes: string[]): Observable<ContentInterface> {
      const contentFromKentico$ = this.getContentFromKentico();
      return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
        const obj = <ContentInterface>{};
  
        const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
  
        obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.hero))
        obj.container_2 = Object.assign({}, contentFromKentico.product_details_section, contentFromInsuranceService)
        obj.container_3 = Object.assign({}, contentFromKentico.product_slider_section)
        obj.container_4 = Object.assign({}, contentFromKentico.accordions_section)
        obj.container_5 = Object.assign({}, contentFromKentico.prefooter_section);
        return of(obj);
      }));
    }
  }
  