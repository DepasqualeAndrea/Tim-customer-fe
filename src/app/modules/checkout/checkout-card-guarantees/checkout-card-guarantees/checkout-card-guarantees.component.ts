import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CheckoutProductCostItem } from '../../checkout.model';
import { DataService } from '@services';
import { Guarantees } from 'app/modules/kentico/models/guarantees.model';
import { take } from 'rxjs/operators';
import {KenticoTranslateService} from '../../../kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-checkout-card-guarantees',
    templateUrl: './checkout-card-guarantees.component.html',
    styleUrls: ['./checkout-card-guarantees.component.scss'],
    standalone: false
})
export class CheckoutCardGuaranteesComponent implements OnInit, OnDestroy {

  @Input() product: any;

  addonsName: string;
  addonsCode: string;
  addonsSorted: {}[];
  guarantees: {}[];
  addons: CheckoutProductCostItem[];
  updatedListAddons: { code: string; name: string; }[];
  model: any;
  plus = [];
  premium = [];
  titles = [];
  productTitles = [];
  selectedProductTitle: string = '';
  fallbackProductTitle: string = 'CHEBANCA! PROTEZIONE SPORT INVERNALI STAGIONALE';


  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit() {
    this.addons = this.getProductCostItemFromProductAddons(this.dataService.getResponseOrder().line_items['0'].addons);
    this.getKenticoContent();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<Guarantees>('guaranteescard').pipe(take(1)).subscribe(item => {
      const kenticoModel = this.transformKenticoModel(item);
      this.plus = this.populateGuaranteesArray(kenticoModel.plus);
      this.premium = this.populateGuaranteesArray(kenticoModel.premium);
      this.titles = this.populateGuaranteesArray(kenticoModel.title);
      this.productTitles = this.populateGuaranteesArray(kenticoModel.product);
      this.selectProductTitle();
      this.updatedListAddons = this.guaranteesPlusOrPremium();
    });
  }

  private selectProductTitle() {
    const prod: {name: string, description: string} = this.productTitles.find(element => {
      // Get the title that is included into product code (plus or premium)
      const item = (element as {name: string, description: string});
      return (<string>this.product.code).toLowerCase().includes(item.description.toLowerCase());
    });
    this.selectedProductTitle = prod.name || this.fallbackProductTitle;   // or if not found fallback on a generic title
  }

  guaranteesPlusOrPremium() {
    if (this.product.code === 'ge-ski-seasonal-plus') {
      return this.plus;
    } else {
      [].push.apply(this.premium, this.addons);
      return this.premium.sort((a, b) => (a.name > b.name) ? 1 : -1);
    }
  }

  getProductCostItemFromProductAddons(addons: any): CheckoutProductCostItem[] {
    const addonCostItems = [];
    addons.forEach(addon => {
      addonCostItems.push({ description: addon.description, name: addon.name });
    });
    return addonCostItems;
  }

  transformKenticoModel(item: Guarantees): { plus: any, premium: any, title: any, product: any } {
    return {
      plus: item.plus.value,
      premium: item.premium.value,
      title: item.title.value,
      product: item.product.value
    };
  }

  populateGuaranteesArray(guarantee) {
    let guaranteeArray = [];
    guarantee.map(item => {
      guaranteeArray = [...guaranteeArray, { description: item.guarantee.value, name: item.name.value }];
    });
    return guaranteeArray;
  }
  ngOnDestroy(): void {

  }
}

