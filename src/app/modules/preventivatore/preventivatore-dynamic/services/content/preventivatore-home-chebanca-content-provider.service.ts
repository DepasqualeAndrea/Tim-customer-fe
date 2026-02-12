import {Injectable} from '@angular/core';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import {DataService} from '@services';
import {Observable, of} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {ContentInterface} from './content-interface';
import {Product} from '@model';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreHomeCheBancaContentProviderService {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService,
  ) {
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        province_select: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_province_select').text.value,
        area: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_area').text.value,
        start_date: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_start_date').text.value,
        choise_massimali: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_choise_massimali'),
        choise_payment_type: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_choise_payment_type'),
        choise_type_home: kenticoItem.quotator.value.find(item => item.system.codename === 'ge_home_choise_type_home'),
        collaborazione_prodotto: kenticoItem.quotator.value.find(item => item.system.codename === 'collaborazione_prodotto_home_genertel'),
        calculate_quote: kenticoItem.quotator.value.find(item => item.system.codename === 'calculate_quote_home_genertel').text.value,
        set_informativo: kenticoItem.quotator.value.find(item => item.system.codename === 'set_informativo_home_genertel').text.value,
        monthly_price: kenticoItem.quotator.value.find(item => item.system.codename === 'monthly_installment').text.value,
        annual_price: kenticoItem.quotator.value.find(item => item.system.codename === 'yearly_price').text.value,
        total_price: kenticoItem.quotator.value.find(item => item.system.codename === 'total_price').text.value,
        tooltip_text: kenticoItem.quotator.value.find(item => item.system.codename === 'tooltip_home').text.value,
        property_insured: kenticoItem.quotator.value.find(item => item.system.codename === 'immobile_da_assicurare').text.value,
      },
      how_works: {
        title_section: kenticoItem.how_works.value.find(item => item.system.codename === 'protect_your_home').text.value,
        text_section: kenticoItem.how_works.value.find(item => item.system.codename === 'protect_your_home_description').text.value,
        slides: this.getAllSlides(kenticoItem.how_works.value.find(item => item.system.codename === 'how_works_home_guarantees').container.value),
        quotator_link: kenticoItem.how_works.value.find(item => item.system.codename === 'quote').text.value,
        breadcrumb_name:  kenticoItem.how_works.value.find(item => item.system.codename === 'breadcrumb_name_home') ? kenticoItem.how_works.value.find(item => item.system.codename === 'breadcrumb_name_home').text.value : null
      },
       quote: {
         quote_button_label: kenticoItem.how_works.value.find(item => item.system.codename === 'quote').text.value,
         quote_target: kenticoItem.quotator.value.find(item => item.system.codename === 'home_quote_redirect').text.value,
      },
      what_to_know: {
        title_section: kenticoItem.what_to_know.value.find(item => item.system.codename === 'what_to_know_home_title').text.value,
        text_section: kenticoItem.what_to_know.value.find(item => item.system.codename === 'what_to_know_home_description').text.value,
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
      quotatorTitle: kenticoItem.header.value[0].quotator_title,
      quotatorDescription: kenticoItem.header.value[0].quotator_description,
      quotatorChoiseTabs: kenticoItem.header.value[0].quotator_choise_tabs,
      scroll: {
        how_works: kenticoItem.header.value[0].scroll_to_how_works.value
          ? kenticoItem.header.value[0].scroll_to_how_works.value
          : null
      }
    };
    return header;
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico();
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
        const obj = <ContentInterface>{};
        const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
        obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
        obj.container_2 = Object.assign({}, { breadcrumbs: Array.of(
          {name: 'Prodotti', route: '/prodotti', scrollTo: '#goToProdotti', scrollToOffset: '-80'},
          {name: contentFromKentico.how_works.breadcrumb_name ? contentFromKentico.how_works.breadcrumb_name : contentFromInsuranceService[0].name,
           product_code: 'ge-home'}
        )});
        obj.container_3 = Object.assign({}, contentFromKentico.how_works, { product_code: 'ge-home'} );
        obj.container_4 = Object.assign({}, contentFromKentico.quote);
        obj.container_5 = Object.assign({}, contentFromKentico.what_to_know);
        obj.container_6 = Object.assign({}, contentFromKentico.more_info);


        obj.container_1.container_class = this.getTenantLayoutClass();
        obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
        obj.container_2.container_class = this.getTenantLayoutClass();
        obj.container_3.container_class = this.getTenantLayoutClass();
        obj.container_4.container_class = this.getTenantLayoutClass();
        obj.container_5.container_class = this.getTenantLayoutClass();
        obj.container_6.container_class = this.getTenantLayoutClass();

        return of(obj);
      }));
  }


  setImageProductsTabs(products: any) {
    return products;
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
      product.container_class = [this.getTenantLayoutClass()].concat(product.product_code);
      product.selected_values = {};
    });
    return obj.container_1.products;
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_home').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }


  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    contentFromInsuranceService = this.setImageProductsTabs(contentFromInsuranceService);
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.description,
      bg_img: header.image,
      img_alt: header.alt,
      quotatorTitle: header.quotatorTitle.value,
      quotatorDescription: header.quotatorDescription.value,
      quotatorChoiseTabsDescription: header.quotatorChoiseTabs.value.length ? header.quotatorChoiseTabs.value[0].title.value : null,
      iconProduct: this.getSmallImage(contentFromInsuranceService[0].images),
      scroll: header.scroll,
      container_class: this.getTenantLayoutClass()
    };
    return obj;
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

  getAllSlides(benefits: any) {
    const policyCoverages = [];
    benefits.map(b => {
      const policyCoverage = {
        title_guarantee: b.title.value,
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
}
