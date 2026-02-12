import {Observable, of} from 'rxjs';
import {ContentInterface} from './content-interface';
import {Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {map, switchMap, take} from 'rxjs/operators';
import {InsurancesService} from 'app/core/services/insurances.service';
import {Product} from 'app/core/models/insurance.model';
import {AuthService, DataService} from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {PreventivatoreContentProvider} from './preventivatore-content-provider.interface';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class PreventivatoreFcaPetContentProvider
  implements PreventivatoreContentProvider {
  constructor(private insuranceService: InsurancesService
    , private dataService: DataService
    , private kenticoTranslateService: KenticoTranslateService
    , private authService: AuthService
  ) {

  }

  createContentStructureFromKenticoItem(codes: string[], kenticoItem: any) {
    const structure = {
      header: {
        image: kenticoItem.header.value[0].image.value[0].url,
        alt: kenticoItem.header.value[0].image.value[0].description,
        title: kenticoItem.header.value[0].title.value,
        subtitle: kenticoItem.header.value[0].description.value,
        welcome_message: kenticoItem.welcome ? kenticoItem.welcome.value[0].text.value : null,
      },
      quotator: {
        package_title: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'package_title').text.value,
        product_collaboration: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'pet_partner').product_collaboration.value,
        information_package_text: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'pet_partner').info_package_link.value,
        continue_button_label: kenticoItem.quotator_product.value.find(item =>
          item.system.codename === 'continue_button').text.value,
      },
      how_works: this.getHowWorksStructure(codes, kenticoItem),
      what_to_know: {
        title_section: kenticoItem.what_to_know_title.value[0].text.value,
        slider_content: kenticoItem.what_to_know_description.value.map(card => {
          return {
            text: card.body.value,
            img: card.image.value[0].url,
            img_alt: card.image.value[0].description,
          };
        }),
        policy_note_content: kenticoItem.what_to_know_info_set.value.find(item =>
          item.system.codename === 'what_to_know_note').text.value,
        set_informativo_content: kenticoItem.what_to_know_info_set.value.find(item =>
          item.system.codename === 'what_to_know_info_set').text.value
      },
      more_info: {
        title: kenticoItem.product_found_section.value.find(item =>
          item.system.codename === 'contacts_section').title.value,
        subtitle: kenticoItem.product_found_section.value.find(item =>
          item.system.codename === 'contacts_section').body.value,
        button_text: kenticoItem.product_found_section.value.find(item =>
          item.system.codename === 'contacts_button_label').text.value
      },
      for_who: {
        title: kenticoItem.product_for_who.value[0].title.value,
        body: kenticoItem.product_for_who.value[0].body.value
      },
    };

    return structure;
  }

  getHowWorksStructure(productCodes: string[], kenticoItem: any) {
    const selected_slide = productCodes.length === 1 ? productCodes[0] : 'net-pet-silver';
    const product_gold = productCodes.some(code => code === 'net-pet-gold') ? this.getGoldSlide(kenticoItem) : null;
    const product_silver = productCodes.some(code => code === 'net-pet-silver') ? this.getSilverSlide(kenticoItem) : null;
    const product_content = [];
    if (product_gold) {
      product_content.push(product_gold);
    }
    if (product_silver) {
      product_content.push(product_silver);
    }
    const howWorks = {
      title_section: kenticoItem.benefits_title.value[0].text.value
      , selected_slide: selected_slide
      , product_content: product_content
    };
    return howWorks;
  }

  getGoldSlide(kenticoItem: any) {
    return {
      name: kenticoItem.benefits_title_gold.value[0].text.value,
      product_code: 'net-pet-gold',
      selected: false,
      recommended: true,
      items_list:
        kenticoItem.benefits_gold.value.map(benefit => {
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

  getSilverSlide(kenticoItem: any) {
    return {
      name: kenticoItem.benefits_title_silver.value[0].text.value,
      product_code: 'net-pet-silver',
      selected: true,
      recommended: false,
      items_list: kenticoItem.benefits_silver.value.map(benefit => {
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
    const contentFromKentico$ = this.getContentFromKentico(codes);
    return contentFromKentico$.pipe(switchMap((contentFromKentico) => {
      const obj = Object.assign({}, contentFromKentico);
      const welcomeMessage = this.getUserWelcomeMessage(contentFromKentico.header);
      const contentFromInsuranceService = this.getContentFromInsuranceService(p => codes.includes(p.product_code));
      obj.hero = this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header, welcomeMessage);
      obj.hero.products = this.setColorClassToProducts(obj, contentFromKentico.quotator);
      obj.more_info.container_class = this.getTenantLayoutClass();
      obj.hero.container_class = this.getTenantLayoutClass();
      this.selectProductDefault(obj, contentFromInsuranceService);
      return of(obj);
    }));
  }

  selectProductDefault(obj: any, contentFromInsuranceService: any) {
    const heroName = 'hero';
    const selectedProduct = contentFromInsuranceService.find(product => product.isSelected);
    if (selectedProduct) {
      obj[heroName].selected_slide_id = `tab-${selectedProduct.product_code}`;
    }
  }

  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }

  private getUserWelcomeMessage(headerFromKentico: any) {
    if (!headerFromKentico) {
      return null;
    }
    if (!headerFromKentico.welcome_message) {
      return null;
    }
    const message = headerFromKentico.welcome_message;
    if (this.authService.currentUser.firstname) {
      return message + ' ' + this.authService.currentUser.firstname + '!';
    }
    return null;
  }

  // private getContentFromInsuranceService(filterFn: (products: Product) => boolean): Observable<any> {
  //   return this.insuranceService.getProducts()
  //     .pipe(take(1), map(productList => productList.products.filter(filterFn)));
  // }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private getContentFromKentico(codes: string[]): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_pet').pipe
    (take(1), map(contentItem => this.createContentStructureFromKenticoItem(codes, contentItem)));
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any, welcomeMessage: any) {
    const obj = {
      products: contentFromInsuranceService
      , title: header.title
      , subtitle: header.subtitle
      , bg_img: header.image
      , img_alt: header.alt
      , welcome_message: welcomeMessage
    };
    return obj;
  }

  private setColorClassToProducts(obj: ContentInterface, quotator: any) {
    obj.hero.products.forEach(product => {
      product.package_title = quotator.package_title;
      product.continue_button_label = quotator.continue_button_label;
      product.product_collaboration = quotator.product_collaboration;
      product.information_package_text = quotator.information_package_text;
      product.provider_logo = 'assets/images/logos/net-logo.svg';
      product.image = this.getSmallImage(product.images);
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = this.getTenantLayoutClass();
      product.isSelected = product.product_code === 'net-pet-silver';
    });
    return obj.hero.products;
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
