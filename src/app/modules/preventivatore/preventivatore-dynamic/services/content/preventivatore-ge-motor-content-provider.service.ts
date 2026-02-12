import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContentInterface } from './content-interface';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { DataService } from '@services';
import { map, switchMap } from 'rxjs/operators';
import { Product } from '@model';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreGeMotorContentProviderService implements PreventivatoreContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService
  ) { }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_motor').pipe(
      map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      how_works: {
        title_section: kenticoItem.how_works.value.find(item => item.system.codename === 'how_works_title_motor').text.value,
        text_section: kenticoItem.how_works.value.find(item => item.system.codename === 'how_works_motor_description').text.value,
        slides: this.getSlidesTwoByTwo(kenticoItem.how_works.value.find(item => item.system.codename === 'how_works_motor').container.value),
        product_content: this.getAllSlides(kenticoItem.how_works.value.find(item => item.system.codename === 'how_works_motor').container.value),
        quotator_link: kenticoItem.how_works.value.find(item => item.system.codename === 'quote').text.value
      },
      quote: {
        select_label: kenticoItem.quotator.value.find(item => item.system.codename === 'choose_vehicle').text.value,
        quote_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'make_quote').text.value
      },
      what_to_know: {
        title_section: kenticoItem.what_to_know.value.find(item => item.system.codename === 'what_to_know_title').text.value,
        text_section: kenticoItem.what_to_know.value.find(item => item.system.codename === 'what_to_know_motor').text.value,
        set_informativo_content: kenticoItem.what_to_know.value.find(item => item.system.codename === 'informative_set_plus_premium').text.value
      },
      more_info: {
        title: kenticoItem.more_info.value.find(item => item.system.codename === 'more_info_title').text.value,
        subtitle: kenticoItem.more_info.value.find(item => item.system.codename === 'more_info_text').text.value,
      }
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
        : null,
      quote_target: ``,
      quote_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'make_quote').text.value
    };
    return header;
  }

  getSlidesTwoByTwo(benefits: any) {
    const slides = [];
    benefits.map((b, i) => {
      if (i < benefits.length - 1) {
        slides.push({slide_id: b.system.codename, product_content: this.groupSlides([benefits[i], benefits[i + 1]])});
      }
    });
    return slides;
  }

  getAllSlides(benefits: any) {
    const policyCoverages = [];
    benefits.map(b => {
      const policyCoverage = {
        name: b.title.value,
        items_list: b.guarantee.value.map(g => {
          return {
            text: g.text.value,
            subitems_list: g.subitems.value.map(subitem => subitem.text.value),
            included: g.included.value.some(value => value.codename === 'included')
          };
        })
      };
      policyCoverages.push(policyCoverage);
    });
    return policyCoverages;
  }

  groupSlides(slides: any[]) {
    // to display two products for each slide and allow half-slide swipe
    const policyCoverages = [];
    slides.map(b => {
      const policyCoverage = {
        name: b.title.value,
        items_list: b.guarantee.value.map(g => {
          return {
            text: g.text.value,
            subitems_list: g.subitems.value.map(subitem => subitem.text.value),
            included: g.included.value.some(value => value.codename === 'included')
          };
        })
      };
      policyCoverages.push(policyCoverage);
    });
    return policyCoverages;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = <ContentInterface>{};
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      obj.container_1 = Object.assign({}, contentFromKentico.header);
      obj.container_2 = Object.assign({}, { breadcrumbs: Array.of(
        {name: 'Prodotti', route: '/prodotti', scrollTo: '#goToProdotti', scrollToOffset: '-80'},
        {name: contentFromInsuranceService[0].name}
      )});
      obj.container_3 = Object.assign({}, contentFromKentico.how_works);
      obj.container_4 = Object.assign({}, contentFromKentico.quote);
      obj.container_5 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_6 = Object.assign({}, contentFromKentico.more_info);

      obj.container_1.container_class = this.getTenantLayoutClass();
      obj.container_2.container_class = this.getTenantLayoutClass();
      obj.container_3.container_class = this.getTenantLayoutClass();
      obj.container_4.container_class = this.getTenantLayoutClass();
      obj.container_4.select_values = contentFromInsuranceService[0].product_structure.vehicles.map(v => {
        return {
          name: v.name,
          target: v.link
        };
      });
      obj.container_5.container_class = this.getTenantLayoutClass();
      obj.container_6.container_class = this.getTenantLayoutClass();
      return of(obj);
    }));
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }

}
