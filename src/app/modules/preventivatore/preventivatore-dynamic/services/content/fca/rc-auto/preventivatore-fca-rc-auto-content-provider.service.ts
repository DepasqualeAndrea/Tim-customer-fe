import { Injectable } from '@angular/core';
import { Product } from '@model';
import { DataService, InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ContentInterface } from '../../content-interface';
import { PreventivatoreContentProvider } from '../../preventivatore-content-provider.interface';
import { PreventivatoreDynamicSharedFunctions } from '../../preventivatore-dynamic-shared-functions';

@Injectable(
  { providedIn: 'root' }
)
export class PreventivatoreFcaRcAutoContentProviderService implements PreventivatoreContentProvider {

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {}

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: {
        image: kenticoItem.header.value[0].image.value[0].url,
        alt: kenticoItem.header.value[0].image.value[0].description,
        title: kenticoItem.header.value[0].title.value,
        subtitle: kenticoItem.header.value[0].description.value,
        container_class: this.dataService.tenantInfo.tenant
      },
      quotator: this.getQuotatorStructure(kenticoItem.quotator_product),
      how_works: this.getHowWorksStructure(kenticoItem),
      what_to_know: {
        title_section: kenticoItem.what_to_know_title.value[0].text.value,
        slider_content: kenticoItem.what_to_know_description.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        }),
        info_set_double_content: kenticoItem.what_to_know_info_set.value[0].text.value
      },
      for_who: {
        title: kenticoItem.product_for_who.value[0].title.value,
        body: kenticoItem.product_for_who.value[0].body.value
      },
      more_info: {
        title: kenticoItem.product_found.need_more_info.title.value,
        subtitle: kenticoItem.product_found.need_more_info.body.value,
        button_text: kenticoItem.product_found.contacts_button_label.text.value
      },
    }
    return structure
  }

  getQuotatorStructure(quotatorItems) {
    const quotatorStructureItem = {}
    const codenames = quotatorItems.itemCodenames
    codenames.forEach(codename => {
      quotatorItems.value.forEach(item => {
        if(item.system.codename === codename) {
          quotatorStructureItem[codename] = item.text.value
        }
      });
    });
    return quotatorStructureItem
  }

  getHowWorksStructure(kenticoItem: any) {
    const productContent = []
    productContent.push(this.getPolicyRC(kenticoItem))
    productContent.push(this.getPolicyCoverages(kenticoItem))
    const howWorks = {
      title_section: kenticoItem.benefits_title.value[0].text.value,
      ribbon: kenticoItem.ribbon.value,
      product_content: productContent
    }
    return howWorks
  }

  getPolicyRC(kenticoItem: any) {
    return {
      name: kenticoItem.title_rc.value[0].text.value,
      product_code: 'rc-card',
      selected: false,
      included: false,
      items_list:
        kenticoItem.list_rc.value.map(benefit => {
          return {
            text: benefit.text.value,
            subitems: benefit.subitems.value.map(subitem => {
              return subitem.text.value;
            }),
            included: benefit.included.value.some(value => value.name === 'included'),
          };
        })
    };
  }

  getPolicyCoverages(kenticoItem: any) {
    return {
      name: kenticoItem.title_coverages.value[0].text.value,
      product_code: 'coverage-card',
      selected: true,
      included: true,
      items_list:
        kenticoItem.list_coverages.value.map(benefit => {
          return {
            text: benefit.text.value,
            subitems: benefit.subitems.value.map(subitem => {
              return subitem.text.value;
            }),
            included: benefit.included.value.some(value => value.name === 'included'),
          };
        })
    };
  }

  getContent(codes: string[]): Observable<ContentInterface> {
    const contentFromKentico$ = this.getContentFromKentico()
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = Object.assign({}, contentFromKentico)
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      contentFromKentico.what_to_know.info_set_double_content = PreventivatoreDynamicSharedFunctions.replaceInfoCondPackageLink(
        contentFromKentico.what_to_know.info_set_double_content,
        contentFromInsuranceService[0].information_package,
        contentFromInsuranceService[0].conditions_package,
      );
      obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
      obj.container_1.container_class = this.getTenantLayoutClass();
      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      obj.container_2 = Object.assign({}, contentFromKentico.how_works);
      obj.container_3 = Object.assign({}, contentFromKentico.for_who);
      obj.container_4 = Object.assign({}, contentFromKentico.what_to_know);
      obj.container_5 = Object.assign({}, contentFromKentico.more_info);
      obj.container_2.container_class = [this.getTenantLayoutClass()].concat(codes);
      this.selectProductDefault(obj, contentFromInsuranceService)
      return of(obj)
    }))
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product = Object.assign(product, quotator);
      product.image = this.getSmallImage(product.images);
    });
    return obj.container_1.products;
  }

  selectProductDefault(obj: any, contentFromInsuranceService: any) {
    const heroName = 'hero'
    const selectedProduct = contentFromInsuranceService.find(product => product.isSelected)
    if (selectedProduct) {
      obj[heroName].selected_slide_id = `tab-${selectedProduct.product_code}`
    }
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn)
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_rc_auto').pipe
    (take(1), map(contentItem => this.createContentStructureFromKenticoItem(contentItem)))
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.subtitle,
      bg_img: header.image,
      img_alt: header.alt,
    }
    return obj
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
