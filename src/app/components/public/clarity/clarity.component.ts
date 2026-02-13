import { Component, OnInit, OnDestroy } from '@angular/core';
import { InsurancesService } from '@services';
import { NavbarCbVariantSkinComponent } from '../navbar/navbar-cb/navbar-cb-variant-skin.component';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-clarity',
    templateUrl: './clarity.component.html',
    styleUrls: ['./clarity.component.scss'],
    standalone: false
})
export class ClarityComponent extends NavbarCbVariantSkinComponent implements OnInit, OnDestroy {

  nonContingencyProducts: any[];
  contingencyProducts: any[];
  clarity: any;
  clarityMainTitle: any;

  constructor(
    protected nypInsuranceService: NypInsurancesService,
    private kenticoTranslateService: KenticoTranslateService) {
    super();
  }

  ngOnInit() {
    this.getKenticoItem();
    this.getProducts();
  }

  getKenticoItem() {
    this.kenticoTranslateService.getItem<any>('clarity_page').pipe(take(1)).subscribe(item => {
      this.clarity = item.page;
      this.clarityMainTitle = item.page.clarity_main_title.text.value;
    });
  }

  getProducts() {
    this.nypInsuranceService.getProducts().subscribe(response => {
      this.nonContingencyProducts = response.products
        .filter(product => {
          const contingencyProperty = product.properties.find(property => property.name === 'contingency');
          return !contingencyProperty || contingencyProperty.value !== 'true';
        })
        .sort((prodA, prodB) => prodA.name.localeCompare(prodB.name))
        .map(product => ({
          title: this.replaceValues(this.clarity.information_package_non_contingency.text.value, { productName: product.name }),
          link: product.information_package
        }));
      this.contingencyProducts = this.clarity.information_package_contingency.page.value
        .map((cp, i) => (
          this.includeCollapseAttributes(cp, i)
        ));
    });

  }

  private replaceValues(source: string, replacement: object): string {
    let result = source;
    Object.entries(replacement).forEach(entry => {
      const name: string = entry[0];
      const value: string = entry[1];
      const toReplace: RegExp = new RegExp('\{\{\s*' + name + '\s*\}\}', 'gi');

      result = result.replace(toReplace, value);
    });
    return result;
  }

  private includeCollapseAttributes(kenticoItem: any, index: number) {
    const container = document.createElement('div');
    container.innerHTML = kenticoItem.text.value;
    const p = container.querySelector('p');
    const a = document.createElement('a');
    container.insertBefore(a, p);

    const contingencyLinksId = `contingency-link-list-${index}`;
    a.setAttribute('href', `#${contingencyLinksId}`);
    a.setAttribute('data-toggle', 'collapse');
    a.setAttribute('aria-controls', 'collapse');
    a.setAttribute('aria-expanded', 'false');
    a.setAttribute('role', 'button');
    a.innerHTML = p.textContent;
    container.removeChild(p);

    const ul = container.querySelector('ul');
    ul.setAttribute('id', `${contingencyLinksId}`);
    ul.setAttribute('class', 'collapse');
    return container.innerHTML;
  }
}
