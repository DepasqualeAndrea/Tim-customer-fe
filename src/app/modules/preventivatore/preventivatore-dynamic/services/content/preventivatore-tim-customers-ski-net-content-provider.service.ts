import {Observable, of} from 'rxjs';
import {ContentInterface} from './content-interface';
import {Injectable} from '@angular/core';
import {map, switchMap} from 'rxjs/operators';
import {Product} from 'app/core/models/insurance.model';
import {DataService} from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {PreventivatoreContentProvider} from './preventivatore-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreTimCustomersSkiNetContentProviderService implements PreventivatoreContentProvider {
  public productCodes = ['tim-for-ski'];
  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }


  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('preventivatore_ski_net').pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      header: this.getHeaderStructure(kenticoItem),
      quotator: {
        continue_button_label: kenticoItem.quotator.value.find(item => item.system.codename === 'bottone___continua_0bf98fa').text.value,
        coverage_duration: kenticoItem.quotator.value.find(item => item.system.codename === 'durata_della_copertura').text.value,
        logo_net: kenticoItem.quotator.value.find(item => item.system.codename === 'logo_net').thumbnail.value[0].url,
        prodotto_in_collaborazione_con: kenticoItem.quotator.value.find(item => item.system.codename === 'prodotto_in_collaborazione_con').text.value,
        insured_persons_number: kenticoItem.quotator.value.find(item => item.system.codename === 'seleziona_il_numero_di_assicurati').text.value,
        variants_type_label: kenticoItem.quotator.value.find(item => item.system.codename === 'seleziona_il_numero_di_giorni').text.value,
        set_informativo: kenticoItem.quotator.value.find(item => item.system.codename === 'set_informativo_2').title.value,
        totale: kenticoItem.quotator.value.find(item => item.system.codename === 'totale').text.value,
        daily: kenticoItem.quotator.value.find(item => item.system.codename === 'daily').text.value,
        seasonal: kenticoItem.quotator.value.find(item => item.system.codename === 'seasonal').text.value,
        do_a_preventive:  kenticoItem.quotator.value.find(item => item.system.codename === 'go_to_preventive').text.value
      }
    };
    return structure;
  }

  getHeaderStructure(kenticoItem: any) {
    const header = {
      title: kenticoItem.header.header_tim_for_ski.title.value ?
      kenticoItem.header.header_tim_for_ski.title.value : null,
      description: kenticoItem.header.header_tim_for_ski.description.value ?
      kenticoItem.header.header_tim_for_ski.description.value : null

    };
    return header;
  }


  getPolicyCoverages(benefits: any) {
    const policyCoverages = [];
    benefits.value.map(benefit => {
      const policyCoverage = {
        name: benefit.title.value,
        product_code: benefit.system.codename.endsWith('ski_gold') ? 'tim-for-ski-gold' : 'tim-for-ski-platinum',
        ribbon: benefit.campaign_info.value.length && benefit.campaign_info.value[0].name ? benefit.campaign_info.value[0].name : null,
        items_list: benefit.guarantee.value.map(guarantee => {
          return {
            text: guarantee.text.value,
            value: guarantee.value.value,
            included: guarantee.included.value.some(value => value.codename === 'included'),
            subitems_list: guarantee.subitems.value.map(subitem => {
              return{
                name: subitem.title.value
              };
            })
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
      obj.container_1 = Object.assign({}, this.setContentToProduct(contentFromInsuranceService, contentFromKentico.header));
      obj.container_1.products = this.setExtraContentForQuotator(obj, contentFromKentico.quotator);
      const selectedProduct = contentFromInsuranceService.find(product => product.isSelected);
      if (selectedProduct) {
        obj.container_1.selected_slide_id = `tab-${selectedProduct.product_code}`;
      }
      obj.container_1.container_class = [this.productCodes[0], this.getTenantLayoutClass()];
      return of(obj);
    }));
  }

  private includeCollapseAttributes(kenticoItem: any) {
    const container = document.createElement('div');
    container.innerHTML = kenticoItem.who_is_for.value[0].text.value;

    const a = container.querySelector('a');
    const itemId = a.getAttribute('data-item-id');
    const coveredCountriesId = kenticoItem.who_is_for.value[0].text.links.find(link => link.linkId === itemId).codename;
    a.removeAttribute('data-item-id');
    a.removeAttribute('data-new-window');
    a.removeAttribute('rel');
    a.setAttribute('href', `#${coveredCountriesId}`);
    a.setAttribute('data-toggle', 'collapse');
    a.setAttribute('aria-controls', 'collapse');
    a.setAttribute('aria-expanded', 'false');
    a.setAttribute('role', 'button');
    a.setAttribute('style', `color: var(--primary-title-color,#333); text-decoration: unset; cursor: pointer;`);

    const parent = a.parentElement;
    const coveredCountriesDiv = document.createElement('div');
    coveredCountriesDiv.setAttribute('id', `${coveredCountriesId}`);
    coveredCountriesDiv.setAttribute('class', 'col-12 collapse');
    coveredCountriesDiv.innerHTML = kenticoItem.who_is_for.value.find(item => item.system.codename === `${coveredCountriesId}`).text.value;
    parent.parentElement.appendChild(coveredCountriesDiv);
    return container.innerHTML;
  }

  private getContentFromInsuranceService(filterFn: (products: Product) => boolean): any {
    return this.dataService.getProductsFromInsuranceServices(filterFn);
  }

  private setContentToProduct(contentFromInsuranceService: any, header: any) {
    const obj = {
      products: contentFromInsuranceService,
      title: header.title,
      subtitle: header.description
    };
    return obj;
  }

  private setExtraContentForQuotator(obj: ContentInterface, quotator: any) {
    obj.container_1.products.forEach(product => {
      product.continue_button_label = quotator.continue_button_label;
      product.color_class = this.dataService.getProductColorClass(product);
      product.container_class = [this.productCodes[0], this.getTenantLayoutClass()];
      product.isSelected = product.product_code === 'tim-for-ski-silver';
      product.coverage_duration = quotator.coverage_duration;
      product.coverage_duration = quotator.coverage_duration;
      product.logo_net = quotator.logo_net;
      product.prodotto_in_collaborazione_con = quotator.prodotto_in_collaborazione_con;
      product.insured_persons_number = quotator.insured_persons_number;
      product.do_a_preventive = quotator.do_a_preventive;
      product.variants_type_label = quotator.variants_type_label;
      product.set_informativo = quotator.set_informativo;
      product.totale = quotator.totale;
      product.daily = quotator.daily;
      product.seasonal = quotator.seasonal;
    });
    return obj.container_1.products;
  }


  private getTenantLayoutClass() {
    return 'layout-' + this.dataService.tenantInfo.tenant;
  }
}
